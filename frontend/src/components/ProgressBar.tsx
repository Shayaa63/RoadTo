interface ProgressBarProps {
  procent: number;
  storlek?: 'sm' | 'md' | 'lg';
}

// Sträckmätare: rost medan resan pågår, kompassblå när man är framme.
// Små tickmarkeringar vid 25 % ger en känsla av linjal/kartskala.
export default function ProgressBar({ procent, storlek = 'md' }: ProgressBarProps) {
  const varde = Math.max(0, Math.min(100, Number.isFinite(procent) ? procent : 0));
  const hojd = { sm: 'h-1.5', md: 'h-2', lg: 'h-3' }[storlek];
  const framme = varde === 100;

  return (
    <div
      role="progressbar"
      aria-label="Sträcka färdad"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={varde}
      className={`relative w-full overflow-hidden rounded-full border border-ink/15 bg-sand-deep ${hojd}`}
    >
      <div
        className={`h-full rounded-full transition-[width] duration-700 ease-out ${
          framme ? 'bg-compass' : 'bg-rust'
        }`}
        style={{ width: `${varde}%` }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, transparent 0, transparent calc(25% - 1px), rgb(var(--paper) / 0.7) calc(25% - 1px), rgb(var(--paper) / 0.7) 25%)',
        }}
      />
    </div>
  );
}