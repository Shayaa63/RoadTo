import { useEffect, useRef, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import type { Goal } from '../types';
import { arMalKlart, beraknaFramsteg } from '../lib/logik';
import ProgressBar from './ProgressBar';
import StepList from './StepList';

interface GoalCardProps {
  mal: Goal;
  nummer: string; // t.ex. "01" – destinationens löpnummer
  onRedigera: (mal: Goal) => void;
  onRadera: (mal: Goal) => void;
  onLaggTillSteg: (malId: string, titel: string) => void;
  onVaxlaSteg: (malId: string, stegId: string) => void;
  onRedigeraSteg: (malId: string, stegId: string, titel: string) => void;
  onRaderaSteg: (malId: string, stegId: string) => void;
}

function formateraDatum(iso: string): string {
  const datum = new Date(iso);
  if (Number.isNaN(datum.getTime())) return '';
  return datum.toLocaleDateString('sv-SE', { day: 'numeric', month: 'long', year: 'numeric' });
}

// Destinationskort: ett ark i journalen med framsteg och kontrollpunkter
export default function GoalCard({
  mal,
  nummer,
  onRedigera,
  onRadera,
  onLaggTillSteg,
  onVaxlaSteg,
  onRedigeraSteg,
  onRaderaSteg,
}: GoalCardProps) {
  const procent = beraknaFramsteg(mal.steps);
  const klart = arMalKlart(mal);
  const antalKlara = mal.steps.filter((s) => s.completed).length;
  const antal = mal.steps.length;

  // Stämpeln animeras bara i det ögonblick målet nås – inte när sidan laddas
  const [nyligenNadd, setNyligenNadd] = useState(false);
  const forraKlart = useRef(klart);

  useEffect(() => {
    let timer: number | undefined;

    if (klart && !forraKlart.current) {
      setNyligenNadd(true);
      timer = window.setTimeout(() => setNyligenNadd(false), 1200);
    } else if (!klart) {
      setNyligenNadd(false);
    }
    forraKlart.current = klart;

    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [klart]);

  const statusText =
    antal === 0
      ? 'Inga kontrollpunkter ännu'
      : `${antalKlara} av ${antal} ${antal === 1 ? 'kontrollpunkt' : 'kontrollpunkter'} ${
          antal === 1 ? 'nådd' : 'nådda'
        }`;

  const datum = formateraDatum(mal.created_at);

  return (
    <article
      className={`kort flex animate-fade-in-up flex-col p-5 sm:p-6 ${
        klart ? 'border-compass/60' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="meta">
            Destination nr {nummer}
            {datum && ` · Påbörjad ${datum}`}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h3 className="break-words text-xl font-semibold leading-snug">{mal.title}</h3>
            {klart && (
              <span className={`stampel ${nyligenNadd ? 'animate-stampa' : ''}`}>Nådd</span>
            )}
          </div>
          {mal.description && (
            <p className="mt-2 break-words text-sm leading-relaxed text-ink-soft">
              {mal.description}
            </p>
          )}
        </div>

        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            className="ikonknapp"
            onClick={() => onRedigera(mal)}
            aria-label={`Justera destinationen ${mal.title}`}
            title="Justera destination"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="ikonknapp hover:!text-rust"
            onClick={() => onRadera(mal)}
            aria-label={`Radera destinationen ${mal.title}`}
            title="Radera destination"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <span className="text-sm text-ink-soft">{statusText}</span>
          <span
            className={`font-serif text-lg font-semibold tracking-tight ${
              klart ? 'text-compass' : ''
            }`}
          >
            {procent}%
          </span>
        </div>
        <ProgressBar procent={procent} />
      </div>

      <div className="mt-5 border-t border-ink/15 pt-4">
        <StepList
          steg={mal.steps}
          onLaggTill={(titel) => onLaggTillSteg(mal.id, titel)}
          onVaxla={(stegId) => onVaxlaSteg(mal.id, stegId)}
          onRedigera={(stegId, titel) => onRedigeraSteg(mal.id, stegId, titel)}
          onRadera={(stegId) => onRaderaSteg(mal.id, stegId)}
        />
      </div>
    </article>
  );
}