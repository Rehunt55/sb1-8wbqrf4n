import { useState } from 'react';
import {
  Store,
  TrendingUp,
  ShoppingBag,
  Receipt,
  AlertTriangle,
  Package,
  Wand2,
  CalendarClock,
  ChevronRight,
} from 'lucide-react';
import { BarChart } from '@/components/BarChart';
import { business, inventory } from '@/data/mock';

const fmt = (n: number) => `₺${n.toLocaleString('tr-TR')}`;

const statusConfig = {
  critical: {
    label: 'Kritik',
    badge: 'bg-rose-500/15 text-rose-300 border-rose-400/30',
    dot: 'bg-rose-400',
  },
  low: {
    label: 'Azaldı',
    badge: 'bg-amber-500/15 text-amber-300 border-amber-400/30',
    dot: 'bg-amber-400',
  },
  ok: {
    label: 'Sağlıklı',
    badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30',
    dot: 'bg-emerald-400',
  },
} as const;

const metrics = [
  {
    label: 'Bugünkü Satış',
    value: fmt(business.todaySales),
    icon: TrendingUp,
    accent: 'text-emerald-300 bg-emerald-500/15',
    sub: '+%12 ort.',
  },
  {
    label: 'Sipariş',
    value: String(business.orders),
    icon: ShoppingBag,
    accent: 'text-violet-300 bg-violet-500/15',
    sub: '8 bekliyor',
  },
  {
    label: 'Ort. Sepet',
    value: fmt(business.avgTicket),
    icon: Receipt,
    accent: 'text-cyan-300 bg-cyan-500/15',
    sub: '+₺4',
  },
];

export function Business() {
  const [showOrder, setShowOrder] = useState(false);

  const criticalItems = inventory.filter((i) => i.status !== 'ok');

  return (
    <div className="animate-fade-in space-y-5 px-4 pb-28 pt-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/25 to-violet-500/15 text-amber-300">
            <Store size={18} />
          </span>
          <div>
            <h1 className="text-xl font-bold text-white">İşletme</h1>
            <p className="text-[12px] text-slate-400">Alperen'in Kahvecisi</p>
          </div>
        </div>
        <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
          Açık
        </span>
      </header>

      <div className="grid grid-cols-3 gap-3">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <div
              key={m.label}
              className="glass animate-fade-up rounded-2xl p-3"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${m.accent}`}>
                <Icon size={15} />
              </span>
              <p className="mt-2 text-[10px] uppercase tracking-wide text-slate-400">
                {m.label}
              </p>
              <p className="text-sm font-bold text-white">{m.value}</p>
              <p className="mt-0.5 text-[10px] text-slate-500">{m.sub}</p>
            </div>
          );
        })}
      </div>

      <div className="glass animate-fade-up rounded-3xl p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-100">Haftalık Satış</h2>
          <span className="flex items-center gap-1 text-[11px] text-emerald-300">
            <TrendingUp size={12} /> +%18 Hf/Hf
          </span>
        </div>
        <BarChart data={business.weekTrend} accent="emerald" />
      </div>

      <div className="glass animate-fade-up rounded-3xl p-5">
        <h2 className="mb-3 text-sm font-semibold text-slate-100">Bugünün En Çok Satanları</h2>
        <div className="space-y-2.5">
          {business.topItems.map((item, i) => (
            <div key={item.name} className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-[11px] font-bold text-slate-300">
                {i + 1}
              </span>
              <span className="flex-1 text-[13px] text-slate-200">{item.name}</span>
              <span className="text-[12px] font-semibold text-slate-100">{item.units}</span>
              <span className="text-[10px] text-slate-500">satıldı</span>
            </div>
          ))}
        </div>
      </div>

      <div className="animate-fade-up space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold text-slate-100">Stok Uyarıları</h2>
          <span className="flex items-center gap-1 text-[11px] font-medium text-rose-300">
            <AlertTriangle size={12} /> {criticalItems.length} ürün dikkat gerektirir
          </span>
        </div>

        {inventory.map((item) => {
          const cfg = statusConfig[item.status];
          return (
            <div
              key={item.id}
              className="glass flex items-center justify-between rounded-2xl p-3.5"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                    item.status === 'critical'
                      ? 'bg-rose-500/15 text-rose-300'
                      : item.status === 'low'
                        ? 'bg-amber-500/15 text-amber-300'
                        : 'bg-emerald-500/15 text-emerald-300'
                  }`}
                >
                  <Package size={16} />
                </span>
                <div>
                  <p className="text-[13px] font-medium text-slate-100">{item.name}</p>
                  <p className="text-[11px] text-slate-400">
                    {item.sku} · {item.stock} {item.unit} kaldı · {item.dailySales}/gün
                  </p>
                </div>
              </div>
              <span
                className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${cfg.badge}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                {cfg.label}
              </span>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => setShowOrder(true)}
        className="glass-strong flex w-full items-center justify-between rounded-2xl p-4 text-left transition-all hover:shadow-[0_0_24px_-6px_rgba(139,92,246,0.6)]"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/25 to-emerald-500/15 text-violet-300">
            <Wand2 size={18} />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-100">Yapay Zeka Sipariş Önerisi</p>
            <p className="text-[11px] text-slate-400">Tahmini stok yenileme tarihleri</p>
          </div>
        </div>
        <ChevronRight size={18} className="text-slate-500" />
      </button>

      {showOrder && (
        <div className="animate-fade-up space-y-2.5 rounded-3xl border border-violet-400/25 bg-violet-500/10 p-4">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/20 text-violet-300">
              <CalendarClock size={14} />
            </span>
            <p className="text-[12px] font-semibold text-violet-200">
              Tahmini Yenileme Takvimi
            </p>
          </div>
          {criticalItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl bg-slate-900/40 px-3 py-2.5"
            >
              <div>
                <p className="text-[12px] font-medium text-slate-100">{item.name}</p>
                <p className="text-[10px] text-slate-400">
                  Sipariş miktarı: {Math.ceil(item.dailySales * 7)} {item.unit}
                </p>
              </div>
              <span className="rounded-full bg-violet-500/20 px-2.5 py-1 text-[11px] font-semibold text-violet-200">
                {item.restockDate} tarihine kadar
              </span>
            </div>
          ))}
          <button className="mt-1 w-full rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 py-2.5 text-[13px] font-semibold text-white transition-all hover:shadow-[0_0_18px_-4px_rgba(139,92,246,0.8)]">
            Satın alma siparişi oluştur
          </button>
        </div>
      )}
    </div>
  );
}
