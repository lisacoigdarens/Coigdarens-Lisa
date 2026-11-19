import { useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { CV_PDF_PATH, UiCopy } from '../data/lisaProfile';

interface CvModalProps {
  isOpen: boolean;
  copy: UiCopy['modal'];
  onClose: () => void;
}

export function CvModal({ isOpen, copy, onClose }: CvModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={copy.title}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-[#140D0A]/85 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl h-[86vh] flex flex-col bg-[#2D211B] border border-[#F4ECE4]/15 rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-[#F4ECE4]/12">
          <h2 className="font-display text-xl text-[#F4ECE4] font-medium truncate">
            {copy.title}
          </h2>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={CV_PDF_PATH}
              download="CV_Lisa_Coigdarens.pdf"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D8B892] text-[#231914] text-xs font-medium hover:bg-[#E4C9A8] transition-colors whitespace-nowrap shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{copy.download}</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              aria-label={copy.close}
              className="p-2 rounded-lg text-[#CBBBAE] hover:text-[#F4ECE4] hover:bg-[#382A22] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D8B892]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 bg-[#1B130F]">
          <iframe
            src={CV_PDF_PATH}
            title={copy.title}
            className="w-full h-full border-0"
          />
        </div>
      </div>
    </div>
  );
}
