import { useState } from 'react';
import type { FormEvent } from 'react';
import { Check, MapPinPlus, Pencil, Plus, Trash2, X } from 'lucide-react';
import type { Step } from '../types';
import ConfirmModal from './ConfirmModal';

interface StepListProps {
  steg: Step[];
  onLaggTill: (titel: string) => void;
  onVaxla: (stegId: string) => void;
  onRedigera: (stegId: string, titel: string) => void;
  onRadera: (stegId: string) => void;
}

// Lista med kontrollpunkter: lägg till, stämpla, justera och radera
export default function StepList({ steg, onLaggTill, onVaxla, onRedigera, onRadera }: StepListProps) {
  const [nyttSteg, setNyttSteg] = useState('');
  const [redigerarId, setRedigerarId] = useState<string | null>(null);
  const [redigerarText, setRedigerarText] = useState('');
  const [stegAttRadera, setStegAttRadera] = useState<Step | null>(null);
  // Id på den kontrollpunkt som precis stämplades (för stämpelanimationen)
  const [nyligenStamplad, setNyligenStamplad] = useState<string | null>(null);

  // Den första ostämplade kontrollpunkten är "nästa" på stigen
  const nastaId = steg.find((s) => !s.completed)?.id ?? null;

  const hanteraVaxla = (s: Step) => {
    if (!s.completed) setNyligenStamplad(s.id);
    onVaxla(s.id);
  };

  const hanteraLaggTill = (e: FormEvent) => {
    e.preventDefault();
    const titel = nyttSteg.trim();
    if (!titel) return;
    onLaggTill(titel);
    setNyttSteg('');
  };

  const startaRedigering = (s: Step) => {
    setRedigerarId(s.id);
    setRedigerarText(s.title);
  };

  const avbrytRedigering = () => {
    setRedigerarId(null);
    setRedigerarText('');
  };

  const sparaRedigering = (e: FormEvent) => {
    e.preventDefault();
    const titel = redigerarText.trim();
    if (redigerarId && titel) {
      onRedigera(redigerarId, titel);
    }
    avbrytRedigering();
  };

  return (
    <div>
      {steg.length === 0 ? (
        <div className="mb-4 flex flex-col items-center rounded-ark border border-dashed border-ink/30 px-4 py-6 text-center">
          <MapPinPlus className="mb-2 h-6 w-6 text-compass" strokeWidth={1.75} />
          <p className="text-sm font-semibold">Stigen är ännu inte utstakad</p>
          <p className="mt-0.5 text-xs text-ink-soft">
            Dela upp resan i kontrollpunkter – lägg till din första nedan.
          </p>
        </div>
      ) : (
        <ul className="mb-4 space-y-1">
          {steg.map((s) => {
            const arNasta = s.id === nastaId;
            return (
              <li
                key={s.id}
                className={`group flex items-center gap-3 rounded-ark border-l-2 px-2 py-1.5 transition ${
                  arNasta
                    ? 'border-l-rust bg-paper'
                    : 'border-l-transparent hover:bg-sand-deep/60'
                }`}
              >
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={s.completed}
                  aria-label={`${s.completed ? 'Ta bort stämpeln från' : 'Stämpla'} kontrollpunkten ${s.title}`}
                  onClick={() => hanteraVaxla(s)}
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition ${
                    s.completed ? 'border-rust text-rust' : 'border-ink/35 hover:border-rust'
                  }`}
                >
                  {s.completed && (
                    <span
                      className={`flex h-5 w-5 -rotate-6 items-center justify-center rounded-full border border-rust bg-rust/10 ${
                        nyligenStamplad === s.id ? 'animate-stampa' : ''
                      }`}
                    >
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                  )}
                </button>

                {redigerarId === s.id ? (
                  <form onSubmit={sparaRedigering} className="flex flex-1 items-center gap-2">
                    <input
                      type="text"
                      className="falt !py-1.5"
                      value={redigerarText}
                      maxLength={120}
                      autoFocus
                      onChange={(e) => setRedigerarText(e.target.value)}
                      aria-label="Justera kontrollpunkt"
                    />
                    <button type="submit" className="ikonknapp" aria-label="Spara" title="Spara">
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="ikonknapp"
                      onClick={avbrytRedigering}
                      aria-label="Avbryt"
                      title="Avbryt"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </form>
                ) : (
                  <>
                    <span
                      className={`min-w-0 flex-1 break-words text-sm transition ${
                        s.completed ? 'text-ink-soft line-through decoration-ink-soft/50' : ''
                      }`}
                    >
                      {s.title}
                    </span>
                    {arNasta && <span className="meta shrink-0 !text-rust">Nästa</span>}
                    <div className="flex gap-0.5 sm:opacity-0 sm:transition sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
                      <button
                        type="button"
                        className="ikonknapp"
                        onClick={() => startaRedigering(s)}
                        aria-label={`Justera kontrollpunkten ${s.title}`}
                        title="Justera"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="ikonknapp hover:!text-rust"
                        onClick={() => setStegAttRadera(s)}
                        aria-label={`Radera kontrollpunkten ${s.title}`}
                        title="Radera"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <form onSubmit={hanteraLaggTill} className="flex gap-2">
        <input
          type="text"
          className="falt"
          placeholder="Lägg till en kontrollpunkt…"
          maxLength={120}
          value={nyttSteg}
          onChange={(e) => setNyttSteg(e.target.value)}
          aria-label="Ny kontrollpunkt"
        />
        <button type="submit" className="knapp-primar shrink-0" disabled={!nyttSteg.trim()}>
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Lägg till</span>
        </button>
      </form>

      {stegAttRadera && (
        <ConfirmModal
          titel="Radera kontrollpunkt?"
          text={`Vill du radera kontrollpunkten "${stegAttRadera.title}"? Det går inte att ångra.`}
          onAvbryt={() => setStegAttRadera(null)}
          onBekrafta={() => {
            onRadera(stegAttRadera.id);
            setStegAttRadera(null);
          }}
        />
      )}
    </div>
  );
}