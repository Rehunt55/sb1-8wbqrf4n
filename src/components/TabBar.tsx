import { Home, Wallet, LineChart, ShoppingBag, Store, type LucideIcon } from 'lucide-react';
import type { TabId } from '@/types';

interface TabBarProps {
  active: TabId;
  onChange: (tab: TabId) => void;
}

const tabs: { id: TabId; label: string; icon: LucideIcon }[] = [
  { id: 'home', label: 'Ana Sayfa', icon: Home },
  { id: 'finance', label: 'Finans', icon: Wallet },
  { id: 'markets', label: 'Piyasalar', icon: LineChart },
  { id: 'shop', label: 'Alışveriş', icon: ShoppingBag },
  { id: 'business', label: 'İşletme', icon: Store },
];

export function TabBar({ active, onChange }: TabBarProps) {
  return (
    <nav className="sticky bottom-0 z-50 w-full px-4 pb-4 pt-2">
      <div className="glass-strong flex items-center justify-around rounded-3xl px-2 py-2 shadow-2xl shadow-black/50">
        {tabs.map((tab) => {
          const isActive = active === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className="group relative flex flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2 transition-colors"
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <span
                className={`absolute inset-x-2 top-0 h-0.5 rounded-full bg-gradient-to-r from-violet-400 to-emerald-400 transition-opacity duration-300 ${
                  isActive ? 'opacity-100' : 'opacity-0'
                }`}
              />
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-2xl transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-br from-violet-500/25 to-emerald-500/15 text-violet-200 shadow-[0_0_18px_-4px_rgba(139,92,246,0.7)]'
                    : 'text-slate-500 group-hover:text-slate-300'
                }`}
              >
                <Icon size={19} strokeWidth={isActive ? 2.4 : 2} />
              </span>
              <span
                className={`text-[10px] font-medium tracking-wide transition-colors ${
                  isActive ? 'text-slate-100' : 'text-slate-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
