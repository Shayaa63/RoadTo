import { Compass, Footprints, MapPin } from 'lucide-react';
import type { PeppMeddelande, PeppTon } from '../types';

interface MotivationBannerProps {
  meddelande: PeppMeddelande;
}

// Vänsterkantens färg visar tonen: kompassblå = lugn, rost = framgång, grafit = mjuk påminnelse
const KANT: Record<PeppTon, string> = {
  neutral: 'border-l-compass',
  framgang: 'border-l-rust',
  paminnelse: 'border-l-ink-soft',
};

const IKONER: Record<PeppTon, typeof Compass> = {
  neutral: Compass,
  framgang: Footprints,
  paminnelse: MapPin,
};

// En marginalanteckning som ändras efter hur resan har gått
export default function MotivationBanner({ meddelande }: MotivationBannerProps) {
  const Ikon = IKONER[meddelande.ton];

  return (
    <div
      role="status"
      className={`flex items-start gap-4 rounded-ark border border-l-4 border-ink/15 bg-sand px-5 py-4 ${KANT[meddelande.ton]}`}
    >
      <Ikon className="mt-1 h-5 w-5 shrink-0 text-compass" strokeWidth={1.75} />
      <div>
        <p className="meta">Marginalanteckning</p>
        <p className="mt-1 font-serif text-base italic leading-relaxed sm:text-lg">
          {meddelande.text}
        </p>
      </div>
    </div>
  );
}