import { useEffect, useState } from 'react';
import {
  Plus,
  X,
  Trash2,
  Coins,
  DollarSign,
  Bitcoin,
  TrendingUp,
  TrendingDown,
  PieChart,
  Loader2,
  History,
  ArrowUpRight,
  ArrowDownLeft,
  Calculator,
} from 'lucide-react';
import { DonutChart } from '@/components/DonutChart';
import { supabase } from '@/lib/supabase';
import { useLivePrices } from '@/lib/useLivePrices';
import { assetOptions, assetPriceMap } from '@/data/mock';
import type { PortfolioTransaction, ExpenseSlice } from '@/types';

const typeMeta: Record<
  string,
  { icon: typeof Coins; color: string; text: string; bg: string }
> = {
  gold: { icon: Coins, color: '#f59e0b', text: 'text-amber-300', bg: 'bg-amber-500/15' },
  forex: { icon: DollarSign, color: '#10b981', text: 'text-emerald-300', bg: 'bg-emerald-500/15' },
  crypto: { icon: Bitcoin, color: '#8b5cf6', text: 'text-violet-300', bg: 'bg-violet-500/15' },
};

const typeLabel: Record<string, string> = {
  gold: 'Altın',
  forex: 'Döviz',
  crypto: 'Kripto',
};

function formatTRY(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `₺${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000) return `₺${n.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}`;
  return `₺${n.toFixed(2)}`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

interface Holding {
  symbol: string;
  type: string;
  totalAmount: number;
  avgCost: number;
  totalCost: number;
  livePrice: number;
  marketValue: number;
  pnl: number;
  pnlPct: number;
}

function computeHoldings(
  txs: PortfolioTransaction[],
  prices: Record<string, { price: number }>,
): Holding[] {
  const map: Record<string, { type: string; amount: number; cost: number }> = {};

  for (const tx of txs) {
    const key = tx.asset_symbol;
    if (!map[key]) map[key] = { type: tx.asset_type, amount: 0, cost: 0 };

    if (tx.action === 'buy') {
      const newAmount = map[key].amount + tx.amount;
      const newCost = map[key].cost + tx.amount * tx.price;
      map[key] = { type: tx.asset_type, amount: newAmount, cost: newCost };
    } else {
      const avgCost = map[key].amount > 0 ? map[key].cost / map[key].amount : 0;
      const sellAmount = Math.min(tx.amount, map[key].amount);
      map[key].amount -= sellAmount;
      map[key].cost -= sellAmount * avgCost;
    }
  }

  return Object.entries(map)
    .filter(([, v]) => v.amount > 0.0000001)
    .map(([symbol, v]) => {
      const avgCost = v.amount > 0 ? v.cost / v.amount : 0;
      const livePrice = prices[symbol]?.price ?? assetPriceMap[symbol] ?? avgCost;
      const marketValue = livePrice * v.amount;
      const pnl = marketValue - v.cost;
      const pnlPct = v.cost > 0 ? (pnl / v.cost) * 100 : 0;
      return {
        symbol,
        type: v.type,
        totalAmount: v.amount,
        avgCost,
        totalCost: v.cost,
        livePrice,
        marketValue,
        pnl,
        pnlPct,
      };
    });
}

function AddTransactionModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (tx: Omit<PortfolioTransaction, 'id' | 'created_at'>) => void;
}) {
  const [symbol, setSymbol] = useState(assetOptions[0].symbol);
  const [action, setAction] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState(todayStr());
  const [note, setNote] = useState('');

  const selected = assetOptions.find((a) => a.symbol === symbol)!;
  const currentPrice = useLivePrices().prices[symbol]?.price ?? assetPriceMap[symbol] ?? 0;

  const submit = () => {
    const amt = parseFloat(amount);
    const p = parseFloat(price) || currentPrice || 0;
    if (!amt || amt <= 0 || p <= 0) return;
    onAdd({
      asset_symbol: symbol,
      asset_type: selected.type,
      action,
      amount: amt,
      price: p,
      date,
      note: note.trim() || null,
    });
    setAmount('');
    setPrice('');
    setNote('');
    setAction('buy');
    setDate(todayStr());
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center">
      <div className="glass-strong animate-fade-up w-full max-w-md rounded-t-3xl p-5 sm:rounded-3xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-bold text-white">İşlem Ekle</h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800/60 text-slate-400 transition-colors hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-3">
          {/* Asset picker */}
          <div>
            <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-slate-400">
              Varlık
            </label>
            <div className="grid grid-cols-2 gap-2">
              {assetOptions.map((opt) => {
                const meta = typeMeta[opt.type];
                const Icon = meta.icon;
                const active = symbol === opt.symbol;
                return (
                  <button
                    key={opt.symbol}
                    onClick={() => setSymbol(opt.symbol)}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition-all ${
                      active
                        ? 'border-violet-400/50 bg-violet-500/15'
                        : 'border-slate-700/50 bg-slate-800/40 hover:border-slate-600'
                    }`}
                  >
                    <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${meta.bg} ${meta.text}`}>
                      <Icon size={14} />
                    </span>
                    <span className="text-[12px] font-medium text-slate-200">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Buy/Sell toggle */}
          <div>
            <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-slate-400">
              İşlem Tipi
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setAction('buy')}
                className={`flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-[12px] font-medium transition-all ${
                  action === 'buy'
                    ? 'border-emerald-400/50 bg-emerald-500/15 text-emerald-300'
                    : 'border-slate-700/50 bg-slate-800/40 text-slate-400 hover:border-slate-600'
                }`}
              >
                <ArrowDownLeft size={14} /> Alış
              </button>
              <button
                onClick={() => setAction('sell')}
                className={`flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-[12px] font-medium transition-all ${
                  action === 'sell'
                    ? 'border-rose-400/50 bg-rose-500/15 text-rose-300'
                    : 'border-slate-700/50 bg-slate-800/40 text-slate-400 hover:border-slate-600'
                }`}
              >
                <ArrowUpRight size={14} /> Satış
              </button>
            </div>
          </div>

          {/* Amount + Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-slate-400">
                Miktar
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full rounded-xl border border-slate-700/60 bg-slate-900/60 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-violet-400/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-slate-400">
                Fiyat (₺)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder={String(currentPrice || 0)}
                className="w-full rounded-xl border border-slate-700/60 bg-slate-900/60 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-violet-400/50 focus:outline-none"
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-slate-400">
              Tarih
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-slate-700/60 bg-slate-900/60 px-3 py-2.5 text-sm text-white focus:border-violet-400/50 focus:outline-none"
            />
          </div>

          {/* Note */}
          <div>
            <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-slate-400">
              Not (opsiyonel)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="örn. düzenli alım"
              className="w-full rounded-xl border border-slate-700/60 bg-slate-900/60 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-violet-400/50 focus:outline-none"
            />
          </div>

          {/* Current price hint */}
          <div className="rounded-xl border border-slate-700/40 bg-slate-800/30 px-3 py-2">
            <p className="text-[11px] text-slate-400">
              Güncel fiyat: <span className="font-semibold text-slate-200">{formatTRY(currentPrice)}</span>
            </p>
          </div>

          <button
            onClick={submit}
            disabled={!parseFloat(amount)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 py-3 text-sm font-semibold text-white transition-all hover:shadow-[0_0_18px_-4px_rgba(139,92,246,0.8)] disabled:opacity-40"
          >
            <Plus size={16} /> İşlemi Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}

export function Portfolio() {
  const [transactions, setTransactions] = useState<PortfolioTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { prices } = useLivePrices();

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('portfolio_transactions')
      .select('*')
      .order('date', { ascending: false })
      .order('created_at', { ascending: false });
    if (err) {
      setError('İşlemler yüklenemedi');
    } else {
      setTransactions((data as PortfolioTransaction[]) ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const addTransaction = async (tx: Omit<PortfolioTransaction, 'id' | 'created_at'>) => {
    const { error: err } = await supabase.from('portfolio_transactions').insert(tx);
    if (err) {
      setError('İşlem eklenemedi');
      return;
    }
    await fetchTransactions();
  };

  const deleteTransaction = async (id: string) => {
    const { error: err } = await supabase.from('portfolio_transactions').delete().eq('id', id);
    if (err) {
      setError('İşlem silinemedi');
      return;
    }
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const holdings = computeHoldings(transactions, prices);
  const grandTotal = holdings.reduce((s, h) => s + h.marketValue, 0);
  const grandCost = holdings.reduce((s, h) => s + h.totalCost, 0);
  const grandPnl = grandTotal - grandCost;
  const grandPnlPct = grandCost > 0 ? (grandPnl / grandCost) * 100 : 0;

  // Donut slices
  const typeTotals: Record<string, number> = {};
  for (const h of holdings) {
    typeTotals[h.type] = (typeTotals[h.type] ?? 0) + h.marketValue;
  }
  const slices: ExpenseSlice[] = Object.entries(typeTotals)
    .map(([type, value]) => ({
      label: typeLabel[type] ?? type,
      value,
      color: typeMeta[type]?.color ?? '#64748b',
    }))
    .filter((s) => s.value > 0)
    .sort((a, b) => b.value - a.value);

  return (
    <div className="animate-fade-in space-y-5">
      {/* Total value card */}
      <div className="glass animate-fade-up rounded-3xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-400">Toplam Varlık</p>
            <p className="mt-1 text-2xl font-bold text-white">{formatTRY(grandTotal)}</p>
          </div>
          <div className="text-right">
            <span
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                grandPnl >= 0
                  ? 'bg-emerald-500/15 text-emerald-300'
                  : 'bg-rose-500/15 text-rose-300'
              }`}
            >
              {grandPnl >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
              {grandPnl >= 0 ? '+' : ''}
              {formatTRY(grandPnl)} ({grandPnlPct >= 0 ? '+' : ''}
              {grandPnlPct.toFixed(1)}%)
            </span>
            <p className="mt-1 text-[10px] text-slate-500">Toplam Kâr/Zarar</p>
          </div>
        </div>
        {grandCost > 0 && (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-slate-700/40 bg-slate-800/30 px-3 py-2">
            <Calculator size={13} className="text-slate-400" />
            <p className="text-[11px] text-slate-400">
              Ortalama Maliyet: <span className="font-semibold text-slate-200">{formatTRY(grandCost)}</span>
              <span className="mx-2 text-slate-600">·</span>
              Anlık Değer: <span className="font-semibold text-slate-200">{formatTRY(grandTotal)}</span>
            </p>
          </div>
        )}
      </div>

      {/* Donut chart */}
      {slices.length > 0 && (
        <div className="glass animate-fade-up rounded-3xl p-5">
          <div className="mb-4 flex items-center gap-2">
            <PieChart size={15} className="text-violet-300" />
            <h2 className="text-sm font-semibold text-slate-100">Portföy Dağılımı</h2>
          </div>
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-around">
            <DonutChart slices={slices} />
            <div className="flex w-full flex-col gap-2 sm:max-w-[45%]">
              {slices.map((slice) => {
                const pct = grandTotal > 0 ? (slice.value / grandTotal) * 100 : 0;
                return (
                  <div key={slice.label} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[12px] text-slate-300">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: slice.color, boxShadow: `0 0 6px ${slice.color}` }}
                      />
                      {slice.label}
                    </span>
                    <span className="text-[12px] font-medium text-slate-200">
                      %{pct.toFixed(0)} · {formatTRY(slice.value)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Holdings list */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold text-slate-100">Varlıklarım</h2>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1 rounded-full bg-gradient-to-br from-violet-500 to-violet-600 px-3 py-1.5 text-[11px] font-semibold text-white transition-all hover:shadow-[0_0_14px_-4px_rgba(139,92,246,0.8)]"
          >
            <Plus size={13} /> İşlem Ekle
          </button>
        </div>

        {loading && (
          <div className="glass flex items-center justify-center rounded-2xl p-6">
            <Loader2 size={20} className="animate-spin text-violet-400" />
          </div>
        )}

        {error && (
          <div className="glass rounded-2xl border border-rose-400/30 p-4 text-center text-[12px] text-rose-300">
            {error}
          </div>
        )}

        {!loading && !error && holdings.length === 0 && (
          <div className="glass flex flex-col items-center justify-center gap-3 rounded-2xl p-8 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300">
              <PieChart size={22} />
            </span>
            <p className="text-[13px] text-slate-300">Henüz işlem eklemediniz</p>
            <p className="text-[11px] text-slate-500">
              Alış veya satış işlemi ekleyerek portföyünüzü oluşturun
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="mt-1 flex items-center gap-1 rounded-full bg-gradient-to-br from-violet-500 to-violet-600 px-4 py-2 text-[12px] font-semibold text-white transition-all hover:shadow-[0_0_14px_-4px_rgba(139,92,246,0.8)]"
            >
              <Plus size={14} /> İlk İşlemini Ekle
            </button>
          </div>
        )}

        {holdings.map((h, i) => {
          const meta = typeMeta[h.type];
          const Icon = meta.icon;
          const positive = h.pnl >= 0;
          return (
            <div
              key={h.symbol}
              className="glass animate-fade-up rounded-2xl p-3.5"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${meta.bg} ${meta.text}`}>
                    <Icon size={16} />
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-slate-100">{h.symbol}</p>
                    <p className="text-[11px] text-slate-400">
                      {h.totalAmount.toLocaleString('tr-TR')} adet · Ort. {formatTRY(h.avgCost)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-bold text-white">{formatTRY(h.marketValue)}</p>
                  <span
                    className={`text-[11px] font-semibold ${
                      positive ? 'text-emerald-300' : 'text-rose-300'
                    }`}
                  >
                    {positive ? '+' : ''}
                    {formatTRY(h.pnl)} ({h.pnlPct >= 0 ? '+' : ''}
                    {h.pnlPct.toFixed(1)}%)
                  </span>
                </div>
              </div>
              <div className="mt-2.5 flex items-center justify-between border-t border-slate-700/30 pt-2.5 text-[10px] text-slate-500">
                <span>Alış: {formatTRY(h.avgCost)}</span>
                <span>Anlık: {formatTRY(h.livePrice)}</span>
                <span>Maliyet: {formatTRY(h.totalCost)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Transaction history */}
      {transactions.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 px-1">
            <History size={15} className="text-violet-300" />
            <h2 className="text-sm font-semibold text-slate-100">İşlem Geçmişi</h2>
            <span className="text-[10px] text-slate-500">({transactions.length})</span>
          </div>

          {transactions.map((tx, i) => {
            const meta = typeMeta[tx.asset_type];
            const isBuy = tx.action === 'buy';
            const total = tx.amount * tx.price;
            return (
              <div
                key={tx.id}
                className="glass animate-fade-up flex items-center justify-between rounded-2xl p-3.5"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                      isBuy ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'
                    }`}
                  >
                    {isBuy ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-slate-100">
                      {isBuy ? 'Alış' : 'Satış'} · {tx.asset_symbol}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {tx.amount.toLocaleString('tr-TR')} adet · {formatTRY(tx.price)} · {formatDate(tx.date)}
                    </p>
                    {tx.note && <p className="text-[10px] text-slate-500">{tx.note}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className={`text-[13px] font-bold ${isBuy ? 'text-emerald-300' : 'text-rose-300'}`}>
                      {isBuy ? '-' : '+'}
                      {formatTRY(total)}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteTransaction(tx.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800/50 text-slate-500 transition-colors hover:bg-rose-500/15 hover:text-rose-300"
                    aria-label="İşlemi sil"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AddTransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={addTransaction}
      />
    </div>
  );
}
