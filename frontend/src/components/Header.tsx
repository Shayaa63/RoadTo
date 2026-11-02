import { Compass, Footprints, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { kontrollpunkterText } from '../lib/resa';
import type { LagringStatus } from '../types';

interface HeaderProps {
  manadensKontrollpunkter: number; // kontrollpunkter nådda denna månad
  lagring: LagringStatus;
}

const LAGRING_TEXT: Record<LagringStatus, { text: string; punkt: string }> = {
  lokal: { text: 'Journalen sparas i den här webbläsaren', punkt: 'bg-ink-soft' },
  synkar: { text: 'Skriver in i journalen…', punkt: 'bg-rust' },
  sparat: { text: 'Journalen är säkrad i Supabase', punkt: 'bg-compass' },
  fel: { text: 'Offline – sparas lokalt tills vidare', punkt: 'bg-rust' },
};

export default function Header({ manadensKontrollpunkter, lagring }: HeaderProps) {
  const { theme, vaxlaTema } = useTheme();
  const status = LAGRING_TEXT[lagring];

  const datum = new Date().toLocaleDateString('sv-SE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const manadsText =
    manadensKontrollpunkter === 0
      ? 'En lugn månad hittills'
      : `${kontrollpunkterText(manadensKontrollpunkter)} den här månaden`;

  return (
    <header className="mx-auto max-w-5xl px-4 pb-8 pt-8 sm:px-6 sm:pt-12">
      <div className="flex flex-wrap items-start justify-between gap-5 border-b border-ink/20 pb-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-ark border-2 border-ink text-ink">
            <Compass className="h-6 w-6" strokeWidth={1.75} />
          </div>
          <div>
            <p className="meta">Fältjournal · {datum}</p>
            <h1 className="mt-1 text-3xl font-bold sm:text-4xl">RoadTo</h1>
            <p className="mt-1.5 max-w-md text-sm leading-relaxed text-ink-soft">
              Sätt ut destinationer, nå kontrollpunkter och se hur långt du har färdats.
            </p>
            <p className="mt-3 flex items-center gap-2 text-xs text-ink-soft">
              <span className={`h-2 w-2 rounded-full ${status.punkt}`} aria-hidden="true" />
              {status.text}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 rounded-ark border border-ink/20 bg-sand px-3.5 py-2 text-sm font-medium"
            title="Kontrollpunkter du har nått under innevarande månad"
          >
            <Footprints className="h-4 w-4 text-compass" />
            <span>{manadsText}</span>
          </div>

          <button
            type="button"
            onClick={vaxlaTema}
            className="ikonknapp h-10 w-10 border border-ink/20 bg-sand"
            aria-label={theme === 'dark' ? 'Byt till ljust papper' : 'Byt till nattpapper'}
            title={theme === 'dark' ? 'Byt till ljust papper' : 'Byt till nattpapper'}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}