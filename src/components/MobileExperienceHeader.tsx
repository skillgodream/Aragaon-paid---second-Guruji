import React from 'react';

interface Props {
  role: string;
  sopTitle: string;
  progress: number;
  total: number;
  isValid: boolean;
  onClose?: () => void;
  onOpenAudit: () => void;
}

export const MobileExperienceHeader: React.FC<Props> = ({ role, sopTitle, progress, total, isValid, onClose, onOpenAudit }) => (
  <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-[#F6F4EE]/95 backdrop-blur-md border-b border-[#D8D2C5] flex items-center justify-between px-4 shrink-0">
    <div className="flex items-center gap-3 min-w-0">
      {onClose && (
        <button onClick={onClose} className="text-[#181F26] font-bold text-xs cursor-pointer">
          ←
        </button>
      )}
      <div className="truncate">
        <div className="text-[10px] uppercase tracking-[0.16em] text-[#C84B11] font-bold truncate">
            {role}
        </div>
        <div className="text-sm font-extrabold text-[#181F26] truncate">
          {sopTitle}
        </div>
      </div>
    </div>
    
    <div className="flex items-center gap-3">
        <button
            onClick={onOpenAudit}
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isValid ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-[#FFEBEE] text-[#C62828]'}`}
        >
            {isValid ? '✓' : '⚠'}
        </button>
        <span className="font-mono text-[11px] font-bold text-[#364958]">
            {progress} / {total}
        </span>
    </div>
  </header>
);
