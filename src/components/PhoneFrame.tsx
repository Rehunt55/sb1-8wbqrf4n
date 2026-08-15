import { Smartphone, X } from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
}

/**
 * iPhone 15 style frame with Dynamic Island, rounded bezels, and side buttons.
 * Designed for desktop presentation; on small screens the frame is hidden
 * so the app fills the viewport naturally.
 */
export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="relative mx-auto w-[390px] shrink-0">
      {/* Side buttons */}
      <div className="absolute -left-[3px] top-[120px] h-8 w-[3px] rounded-l bg-slate-700" />
      <div className="absolute -left-[3px] top-[170px] h-14 w-[3px] rounded-l bg-slate-700" />
      <div className="absolute -left-[3px] top-[240px] h-14 w-[3px] rounded-l bg-slate-700" />
      <div className="absolute -right-[3px] top-[200px] h-20 w-[3px] rounded-r bg-slate-700" />

      {/* Outer titanium body */}
      <div className="relative rounded-[55px] bg-gradient-to-b from-slate-600 via-slate-700 to-slate-800 p-[5px] shadow-2xl shadow-black/60">
        {/* Inner bezel */}
        <div className="relative overflow-hidden rounded-[50px] bg-black p-[3px]">
          {/* Screen */}
          <div className="relative h-[814px] overflow-hidden rounded-[47px] bg-slate-950">
            {/* Dynamic Island */}
            <div className="pointer-events-none absolute left-1/2 top-[11px] z-[60] flex h-[34px] w-[120px] -translate-x-1/2 items-center justify-end gap-2 rounded-full bg-black pr-3">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-800 ring-1 ring-slate-700" />
            </div>

            {/* App content */}
            <div className="no-scrollbar h-full overflow-y-auto">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FrameToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export function FrameToggle({ enabled, onToggle }: FrameToggleProps) {
  if (enabled) {
    return (
      <button
        onClick={() => onToggle(false)}
        className="glass-strong fixed right-5 top-5 z-[100] flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-slate-200 shadow-xl transition-colors hover:text-white"
      >
        <X size={16} /> Çerçeveyi Kapat
      </button>
    );
  }

  return (
    <button
      onClick={() => onToggle(true)}
      className="glass-strong fixed right-5 top-5 z-[100] flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-slate-200 shadow-xl transition-colors hover:text-white"
    >
      <Smartphone size={16} /> iPhone Çerçevesi
    </button>
  );
}
