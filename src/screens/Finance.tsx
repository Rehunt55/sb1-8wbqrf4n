import {
  ArrowDownLeft,
  ArrowUpRight,
  Lightbulb,
  Wallet,
  TrendingUp,
  PiggyBank,
} from 'lucide-react';
import { DonutChart } from '@/components/DonutChart';
import { BarChart } from '@/components/BarChart';
import { Portfolio } from '@/screens/Portfolio';
import { finance } from '@/data/mock';

const fmt = (n: number) => `${finance.currency}${n.toLocaleString('tr-TR')}`;

const stats = [
  {
    label: 'Toplam Bakiye',
    value: finance.totalBalance,
    icon: Wallet,
    accent: 'text-violet-300 bg-violet-500/15',
    trend: '+%6,4',
  },
  {
    label: 'Gelir',
    value: finance.income,
    icon: ArrowUpRight,
    accent: 'text-emerald-300 bg-emerald-500/15',
    trend: '+%2,1',
  },
  {
    label: 'Gider',
    value: finance.expense,
    icon: ArrowDownLeft,
    accent: 'text-rose-300 bg-rose-500/15',
    trend: '+%9,0',
  },
];

export function Finance() {
  return (
    <div className="animate-fade-in space-y-5 px-4 pb-28 pt-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Finans</h1>
          <p className="text-[12px] text-slate-400">Ağustos özeti</p>
        </div>
        <span className="flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
          <PiggyBank size={13} /> {fmt(finance.savings)} biriktirildi
        </span>
      </header>

      <div className="grid grid-cols-3 gap-3">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="glass animate-fade-up rounded-2xl p-3"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${s.accent}`}>
                <Icon size={15} />
              </span>
              <p className="mt-2 text-[10px] uppercase tracking-wide text-slate-400">
                {s.label}
              </p>
              <p className="text-sm font-bold text-white">{fmt(s.value)}</p>
              <p className="mt-0.5 text-[10px] text-slate-500">{s.trend} vs Tem</p>
            </div>
          );
        })}
      </div>

      <Portfolio />

      <div className="glass animate-fade-up rounded-3xl p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-100">Harcama Analizi</h2>
          <span className="text-[11px] text-slate-400">Bu ay</span>
        </div>
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-around">
          <DonutChart slices={finance.slices} />
          <div className="flex w-full flex-col gap-2 sm:max-w-[45%]">
            {finance.slices.map((slice) => (
              <div key={slice.label} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[12px] text-slate-300">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: slice.color, boxShadow: `0 0 6px ${slice.color}` }}
                  />
                  {slice.label}
                </span>
                <span className="text-[12px] font-medium text-slate-200">
                  {fmt(slice.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass animate-fade-up rounded-3xl p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-100">Haftalık Harcama</h2>
          <span className="flex items-center gap-1 text-[11px] text-emerald-300">
            <TrendingUp size={12} /> yükselişte
          </span>
        </div>
        <BarChart data={finance.weekly} accent="violet" />
      </div>

      <div className="relative animate-fade-up overflow-hidden rounded-3xl border border-violet-400/30 bg-gradient-to-br from-violet-500/15 via-slate-900/40 to-emerald-500/10 p-5">
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-violet-500/20 blur-2xl" />
        <div className="relative flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/20 text-violet-300">
            <Lightbulb size={17} />
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-violet-300">
              Portföy Danışmanı
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-slate-100">
              {finance.insight}
            </p>
            <button className="mt-3 rounded-full bg-violet-500/20 px-3 py-1.5 text-[11px] font-medium text-violet-200 transition-colors hover:bg-violet-500/30">
              Bu öneriyi uygula
            </button>
          </div>
        </div>
      </div>

      <div className="animate-fade-up space-y-2">
        <h2 className="px-1 text-sm font-semibold text-slate-100">Son İşlemler</h2>
        {finance.transactions.map((t) => (
          <div
            key={t.id}
            className="glass flex items-center justify-between rounded-2xl p-3.5"
          >
            <div className="flex items-center gap-3">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                  t.type === 'income'
                    ? 'bg-emerald-500/15 text-emerald-300'
                    : 'bg-rose-500/15 text-rose-300'
                }`}
              >
                {t.type === 'income' ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
              </span>
              <div>
                <p className="text-[13px] font-medium text-slate-100">{t.label}</p>
                <p className="text-[11px] text-slate-400">
                  {t.category} · {t.date}
                </p>
              </div>
            </div>
            <span
              className={`text-sm font-semibold ${
                t.type === 'income' ? 'text-emerald-300' : 'text-slate-200'
              }`}
            >
              {t.type === 'income' ? '+' : '−'}
              {fmt(t.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
