import Modal from './Modal';

interface ConfirmModalProps {
  titel: string;
  text: string;
  bekraftaText?: string;
  onBekrafta: () => void;
  onAvbryt: () => void;
}

// Bekräftelsedialog för destruktiva handlingar, t.ex. radering
export default function ConfirmModal({
  titel,
  text,
  bekraftaText = 'Radera',
  onBekrafta,
  onAvbryt,
}: ConfirmModalProps) {
  return (
    <Modal titel={titel} onStang={onAvbryt}>
      <p className="text-sm leading-relaxed text-ink-soft">{text}</p>
      <div className="mt-6 flex justify-end gap-3">
        <button type="button" className="knapp-sekundar" onClick={onAvbryt}>
          Avbryt
        </button>
        <button type="button" className="knapp-fara" onClick={onBekrafta}>
          {bekraftaText}
        </button>
      </div>
    </Modal>
  );
}