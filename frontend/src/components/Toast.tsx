import { useEffect } from 'react';
import { Award } from 'lucide-react';

interface ToastProps {
  meddelande: string | null;
  onStang: () => void;
}

// Liten lapp längst ner, försvinner av sig själv efter 4 sekunder
export default function Toast({ meddelande, onStang }: ToastProps) {
  useEffect(() => {
    if (!meddelande) return;
    const timer = window.setTimeout(onStang, 4000);
    return () => window.clearTimeout(timer);
  }, [meddelande, onStang]);

  if (!meddelande) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
      <div
        role="status"
        className="kort pointer-events-auto flex animate-fade-in-up items-center gap-3 border-l-4 border-l-rust px-4 py-3 text-sm font-medium"
      >
        <Award className="h-5 w-5 text-rust" />
        {meddelande}
      </div>
    </div>
  );
}