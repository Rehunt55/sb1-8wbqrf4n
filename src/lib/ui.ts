import type { LucideIcon } from 'lucide-react';

export const accentMap: Record<
  string,
  {
    text: string;
    bg: string;
    border: string;
    glow: string;
    ring: string;
    iconBg: string;
    iconText: string;
  }
> = {
  violet: {
    text: 'text-violet-300',
    bg: 'bg-violet-500/10',
    border: 'border-violet-400/30',
    glow: 'shadow-[0_0_24px_-4px_rgba(139,92,246,0.55)]',
    ring: 'ring-violet-400/40',
    iconBg: 'bg-violet-500/15',
    iconText: 'text-violet-300',
  },
  emerald: {
    text: 'text-emerald-300',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-400/30',
    glow: 'shadow-[0_0_24px_-4px_rgba(16,185,129,0.55)]',
    ring: 'ring-emerald-400/40',
    iconBg: 'bg-emerald-500/15',
    iconText: 'text-emerald-300',
  },
  amber: {
    text: 'text-amber-300',
    bg: 'bg-amber-500/10',
    border: 'border-amber-400/30',
    glow: 'shadow-[0_0_24px_-4px_rgba(245,158,11,0.5)]',
    ring: 'ring-amber-400/40',
    iconBg: 'bg-amber-500/15',
    iconText: 'text-amber-300',
  },
  rose: {
    text: 'text-rose-300',
    bg: 'bg-rose-500/10',
    border: 'border-rose-400/30',
    glow: 'shadow-[0_0_24px_-4px_rgba(244,63,94,0.5)]',
    ring: 'ring-rose-400/40',
    iconBg: 'bg-rose-500/15',
    iconText: 'text-rose-300',
  },
  cyan: {
    text: 'text-cyan-300',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-400/30',
    glow: 'shadow-[0_0_24px_-4px_rgba(6,182,212,0.5)]',
    ring: 'ring-cyan-400/40',
    iconBg: 'bg-cyan-500/15',
    iconText: 'text-cyan-300',
  },
};

export function getAccent(name: string) {
  return accentMap[name] ?? accentMap.violet;
}

export function iconFor(
  name: string,
  icons: Record<string, LucideIcon>
): LucideIcon {
  return icons[name] ?? icons.Sparkles;
}
