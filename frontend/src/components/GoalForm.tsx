import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Goal } from '../types';
import Modal from './Modal';

interface GoalFormProps {
  mal: Goal | null; // null = skapa ny, annars redigera
  onSpara: (titel: string, beskrivning: string) => void;
  onAvbryt: () => void;
}

// Formulär i dialog för att sätta ut eller justera en destination
export default function GoalForm({ mal, onSpara, onAvbryt }: GoalFormProps) {
  const [titel, setTitel] = useState(mal?.title ?? '');
  const [beskrivning, setBeskrivning] = useState(mal?.description ?? '');
  const [fel, setFel] = useState<string | null>(null);

  const arRedigering = mal !== null;

  const hanteraSkicka = (e: FormEvent) => {
    e.preventDefault();
    const rensadTitel = titel.trim();

    if (!rensadTitel) {
      setFel('Ge din destination ett namn.');
      return;
    }

    onSpara(rensadTitel, beskrivning.trim());
  };

  return (
    <Modal
      titel={arRedigering ? 'Justera destination' : 'Sätt ut en ny destination'}
      onStang={onAvbryt}
    >
      <form onSubmit={hanteraSkicka} className="space-y-4" noValidate>
        <div>
          <label htmlFor="mal-titel" className="meta mb-1.5 block">
            Namn på destinationen
          </label>
          <input
            id="mal-titel"
            type="text"
            className="falt"
            placeholder="t.ex. Bli trygg i TypeScript"
            maxLength={80}
            autoFocus
            value={titel}
            onChange={(e) => {
              setTitel(e.target.value);
              if (fel) setFel(null);
            }}
            aria-invalid={fel ? true : undefined}
            aria-describedby={fel ? 'mal-titel-fel' : undefined}
          />
          {fel && (
            <p id="mal-titel-fel" className="mt-1.5 text-sm font-medium text-rust">
              {fel}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="mal-beskrivning" className="meta mb-1.5 block">
            Anteckning <span className="font-normal normal-case tracking-normal">(valfritt)</span>
          </label>
          <textarea
            id="mal-beskrivning"
            className="falt resize-none"
            rows={3}
            placeholder="Varför är den här resan viktig för dig?"
            maxLength={200}
            value={beskrivning}
            onChange={(e) => setBeskrivning(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" className="knapp-sekundar" onClick={onAvbryt}>
            Avbryt
          </button>
          <button type="submit" className="knapp-primar">
            {arRedigering ? 'Spara ändringar' : 'Sätt ut destination'}
          </button>
        </div>
      </form>
    </Modal>
  );
}