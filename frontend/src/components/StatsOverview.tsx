import { Flag, Flame, Footprints, ListChecks, MapPin, Medal, Target, Trophy, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Badge, BadgeIcon, Goal } from '../types';
import { beraknaStatistik } from '../lib/logik';
import ProgressBar from './ProgressBar';

interface StatsOverviewProps {
  goals: Goal[];
  badges: Badge[];
}

const BADGE_IKONER: Record<BadgeIcon, LucideIcon> = {
  footprints: Footprints,
  zap: Zap,
  target: Target,
  trophy: Trophy,
  flame: Flame,
  medal: Medal,
};

interface StatKortProps {
  ikon: LucideIcon;
  etikett: string;
  varde: string;
}

function StatKort({ ikon: Ikon, etikett, varde }: StatKortProps) {
  return (
    <div className="kort flex items-center gap-4 p-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-ark border border-ink/20 bg-paper text-compass">
        <Ikon className="h-5 w-5" strokeWidth={1.75} />
      </div>
      <div>
        <p className="font-serif text-2xl font-semibold tracking-tight">{varde}</p>
        <p className="meta mt-0.5">{etikett}</p>
      </div>
    </div>
  );
}

// Resans mått + milstolpar. (Ersätts delvis av kartan i Stage 2.)
export default function StatsOverview({ goals, badges }: StatsOverviewProps) {
  const stat = beraknaStatistik(goals);
  const uppnadda = badges.filter((b) => b.earned).length;

  return (
    <section aria-label="Resans mått" className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatKort ikon={MapPin} etikett="Destinationer" varde={String(stat.totalaMal)} />
        <StatKort ikon={Flag} etikett="Nådda" varde={String(stat.avklaradeMal)} />
        <StatKort
          ikon={ListChecks}
          etikett="Kontrollpunkter"
          varde={`${stat.avklaradeSteg} / ${stat.totalaSteg}`}
        />
      </div>

      <div className="kort p-5">
        <div className="mb-3 flex items-baseline justify-between">
          <p className="meta">Sträcka färdad</p>
          <span className="font-serif text-xl font-semibold tracking-tight">
            {stat.totalProcent}%
          </span>
        </div>
        <ProgressBar procent={stat.totalProcent} storlek="lg" />
      </div>

      <div className="kort p-5">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">Milstolpar</h2>
          <span className="meta">
            {uppnadda} av {badges.length} stämplade
          </span>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {badges.map((badge) => {
            const Ikon = BADGE_IKONER[badge.icon];
            return (
              <li
                key={badge.id}
                className={`flex items-start gap-3 rounded-ark border p-3 ${
                  badge.earned
                    ? 'border-rust/50 bg-paper'
                    : 'border-dashed border-ink/25 bg-transparent opacity-70'
                }`}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 ${
                    badge.earned
                      ? '-rotate-6 border-rust text-rust'
                      : 'border-dashed border-ink/30 text-ink-soft'
                  }`}
                >
                  <Ikon className="h-4 w-4" strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-tight">{badge.title}</p>
                  <p className="mt-0.5 text-xs leading-snug text-ink-soft">{badge.description}</p>
                  <p
                    className={`meta mt-1.5 !text-[10px] ${badge.earned ? '!text-rust' : ''}`}
                  >
                    {badge.earned ? 'Stämplad' : 'Ej nådd'}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}