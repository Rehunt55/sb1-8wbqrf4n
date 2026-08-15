import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { X, CheckCircle2, AlertCircle, Info, Bell } from 'lucide-react';

export type ToastVariant = 'success' | 'warning' | 'error' | 'info';

export interface Toast {
  id: string;
  title: string;
  message?: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  showToast: (toast: Omit<Toast, 'id'>) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const variantConfig: Record<
  ToastVariant,
  { icon: typeof CheckCircle2; accent: string; iconBg: string; iconText: string; border: string }
> = {
  success: {
    icon: CheckCircle2,
    accent: 'text-emerald-300',
    iconBg: 'bg-emerald-500/15',
    iconText: 'text-emerald-300',
    border: 'border-emerald-400/30',
  },
  warning: {
    icon: Bell,
    accent: 'text-amber-300',
    iconBg: 'bg-amber-500/15',
    iconText: 'text-amber-300',
    border: 'border-amber-400/30',
  },
  error: {
    icon: AlertCircle,
    accent: 'text-rose-300',
    iconBg: 'bg-rose-500/15',
    iconText: 'text-rose-300',
    border: 'border-rose-400/30',
  },
  info: {
    icon: Info,
    accent: 'text-violet-300',
    iconBg: 'bg-violet-500/15',
    iconText: 'text-violet-300',
    border: 'border-violet-400/30',
  },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${++counter.current}`;
    setToasts((prev) => [...prev, { ...toast, id }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[100] flex flex-col items-center gap-2 px-4 pt-4">
        {toasts.map((toast) => {
          const cfg = variantConfig[toast.variant];
          const Icon = cfg.icon;
          return (
            <div
              key={toast.id}
              className={`glass-strong animate-fade-down pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border ${cfg.border} p-3.5 shadow-2xl`}
            >
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${cfg.iconBg} ${cfg.iconText}`}>
                <Icon size={18} />
              </span>
              <div className="flex-1 pt-0.5">
                <p className="text-[13px] font-semibold text-white">{toast.title}</p>
                {toast.message && (
                  <p className="mt-0.5 text-[11px] leading-relaxed text-slate-400">{toast.message}</p>
                )}
              </div>
              <button
                onClick={() => dismiss(toast.id)}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-800/60 text-slate-400 transition-colors hover:text-white"
              >
                <X size={13} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
