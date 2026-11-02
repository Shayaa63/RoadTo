import { useEffect, useId } from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  titel: string;
  onStang: () => void;
  children: ReactNode;
}

// Generisk dialog: stängs med Esc, klick på bakgrunden eller kryssknappen
export default function Modal({ titel, onStang, children }: ModalProps) {
  const titelId = useId();

  // Stäng med Escape
  useEffect(() => {
    const hanteraTangent = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onStang();
    };
    document.addEventListener('keydown', hanteraTangent);
    return () => document.removeEventListener('keydown', hanteraTangent);
  }, [onStang]);

  // Lås bakgrundens scroll medan dialogen är öppen
  useEffect(() => {
    const tidigare = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = tidigare;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
      onClick={onStang}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titelId}
        className="kort w-full max-w-md animate-fade-in-up p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4 border-b border-ink/15 pb-3">
          <h2 id={titelId} className="text-xl font-semibold">
            {titel}
          </h2>
          <button type="button" className="ikonknapp -mr-2 -mt-1" onClick={onStang} aria-label="Stäng">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}