import { useEffect, useRef, useState } from 'react';
import {
  Bell,
  Plus,
  X,
  Trash2,
  ArrowUp,
  ArrowDown,
  Loader2,
  Coins,
  DollarSign,
  Bitcoin,
  CheckCircle2,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLivePrices } from '@/lib/useLivePrices';
import { useToast } from '@/components/Toast';
import { assetOptions, assetPriceMap } from '@/data/mock';
import type { PriceAlert } from '@/types';

const typeMeta: Record<
  string,
  { icon: typeof Coins; text: string; bg: string }
> = {
  gold: { icon: Coins, text: 'text-amber-300', bg: 'bg-amber-500/15' },
  forex: { icon: DollarSign, text: 'text-emerald-300', bg: 'bg-emerald-500/15' },
  crypto: { icon: Bitcoin, text: 'text-violet-300', bg: 'bg-violet-500/15' },
};

function formatPrice(n: number): string {
  if (n >= 1_000_000) return `₺${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `₺${n.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}`;
  return `₺${n.toFixed(2)}`;
}

function AddAlertModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (alert: Omit<PriceAlert, 'id' | 'created_at' | 'triggered'>) => void;
}) {
  const [symbol, setSymbol] = useState(assetOptions[0].symbol);
  const [targetPrice, setTargetPrice] = useState('');
  const [direction, setDirection] = useState<'above' | 'below'>('above');

  const selected = assetOptions.find((a) => a.symbol === symbol)!;
  const currentPrice = useLivePrices().prices[symbol]?.price ?? assetPriceMap[symbol] ?? 0;

  const submit = () => {
    const price = parseFloat(targetPrice);
    if (!price || price <= 0) return;
    onAdd({
      asset_symbol: symbol,
      asset_type: selected.type,
      target_price: price,
      direction,
    });
    setTargetPrice('');
    setDirection('above');
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center">
      <div className="glass-strong animate-fade-up w-full max-w-md rounded-t-3xl p-5 sm:rounded-3xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Fiyat Alarmı Kur</h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800/60 text-slate-400 transition-colors hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-3">
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

          <div className="rounded-xl border border-slate-700/40 bg-slate-800/30 px-3 py-2">
            <p className="text-[11px] text-slate-400">
              Güncel fiyat: <span className="font-semibold text-slate-200">{formatPrice(currentPrice)}</span>
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-slate-400">
              Bildirim Koşulu
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setDirection('above')}
                className={`flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-[12px] font-medium transition-all ${
                  direction === 'above'
                    ? 'border-emerald-400/50 bg-emerald-500/15 text-emerald-300'
                    : 'border-slate-700/50 bg-slate-800/40 text-slate-400 hover:border-slate-600'
                }`}
              >
                <ArrowUp size={14} /> Üstüne çıkınca
              </button>
              <button
                onClick={() => setDirection('below')}
                className={`flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-[12px] font-medium transition-all ${
                  direction === 'below'
                    ? 'border-rose-400/50 bg-rose-500/15 text-rose-300'
                    : 'border-slate-700/50 bg-slate-800/40 text-slate-400 hover:border-slate-600'
                }`}
              >
                <ArrowDown size={14} /> Altına inince
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-slate-400">
              Hedef Fiyat (₺)
            </label>
            <input
              type="number"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              placeholder={String(currentPrice || 0)}
              className="w-full rounded-xl border border-slate-700/60 bg-slate-900/60 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-violet-400/50 focus:outline-none"
            />
          </div>

          <button
            onClick={submit}
            disabled={!parseFloat(targetPrice)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 py-3 text-sm font-semibold text-white transition-all hover:shadow-[0_0_18px_-4px_rgba(139,92,246,0.8)] disabled:opacity-40"
          >
            <Bell size={16} /> Alarmı Kur
          </button>
        </div>
      </div>
    </div>
  );
}

export function PriceAlarm() {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { prices } = useLivePrices();
  const { showToast } = useToast();
  const checkedRef = useRef<Set<string>>(new Set());

  const fetchAlerts = async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('price_alerts')
      .select('*')
      .order('created_at', { ascending: false });
    if (err) {
      setError('Alarmlar yüklenemedi');
    } else {
      setAlerts((data as PriceAlert[]) ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const addAlert = async (alert: Omit<PriceAlert, 'id' | 'created_at' | 'triggered'>) => {
    const { error: err } = await supabase.from('price_alerts').insert(alert);
    if (err) {
      setError('Alarm kurulamadı');
      return;
    }
    await fetchAlerts();
  };

  const deleteAlert = async (id: string) => {
    const { error: err } = await supabase.from('price_alerts').delete().eq('id', id);
    if (err) {
      setError('Alarm silinemedi');
      return;
    }
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  useEffect(() => {
    const checkAlerts = async () => {
      for (const alert of alerts) {
        if (alert.triggered || checkedRef.current.has(alert.id)) continue;
        const livePrice = prices[alert.asset_symbol]?.price;
        if (!livePrice) continue;

        const shouldTrigger =
          (alert.direction === 'above' && livePrice >= alert.target_price) ||
          (alert.direction === 'below' && livePrice <= alert.target_price);

        if (shouldTrigger) {
          checkedRef.current.add(alert.id);
          const { error: err } = await supabase
            .from('price_alerts')
            .update({ triggered: true })
            .eq('id', alert.id);
          if (!err) {
            setAlerts((prev) =>
              prev.map((a) => (a.id === alert.id ? { ...a, triggered: true } : a)),
            );
            showToast({
              variant: 'warning',
              title: 'Fiyat Alarmı Tetiklendi!',
              message: `${alert.asset_symbol} fiyatı ${alert.direction === 'above' ? 'hedefin üstüne çıktı' : 'hedefin altına düştü'}: ₺${alert.target_price.toLocaleString('tr-TR')}`,
            });
          }
        }
      }
    };
    checkAlerts();
  }, [prices, alerts, showToast]);

  const toggleTriggered = async (id: string, current: boolean) => {
    const { error: err } = await supabase
      .from('price_alerts')
      .update({ triggered: !current })
      .eq('id', id);
    if (err) return;
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, triggered: !current } : a)));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Bell size={15} className="text-violet-300" />
          <h2 className="text-sm font-semibold text-slate-100">Fiyat Alarmları</h2>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1 rounded-full bg-gradient-to-br from-violet-500 to-violet-600 px-3 py-1.5 text-[11px] font-semibold text-white transition-all hover:shadow-[0_0_14px_-4px_rgba(139,92,246,0.8)]"
        >
          <Plus size={13} /> Alarm Kur
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

      {!loading && !error && alerts.length === 0 && (
        <div className="glass flex flex-col items-center justify-center gap-3 rounded-2xl p-6 text-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300">
            <Bell size={18} />
          </span>
          <p className="text-[12px] text-slate-400">
            Henüz alarm yok. Döviz, altın veya kripto için hedef fiyat bildirimi kurabilirsiniz.
          </p>
        </div>
      )}

      {alerts.map((alert, i) => {
        const meta = typeMeta[alert.asset_type];
        const Icon = meta.icon;
        const currentPrice = prices[alert.asset_symbol]?.price ?? assetPriceMap[alert.asset_symbol] ?? 0;
        const isAbove = alert.direction === 'above';
        const distance = Math.abs(((alert.target_price - currentPrice) / currentPrice) * 100);

        return (
          <div
            key={alert.id}
            className={`glass animate-fade-up flex items-center justify-between rounded-2xl p-3.5 ${
              alert.triggered ? 'border border-emerald-400/30' : ''
            }`}
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className="flex items-center gap-3">
              <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${meta.bg} ${meta.text}`}>
                <Icon size={16} />
              </span>
              <div>
                <p className="text-[13px] font-semibold text-slate-100">{alert.asset_symbol}</p>
                <p className="flex items-center gap-1 text-[11px] text-slate-400">
                  {isAbove ? (
                    <ArrowUp size={11} className="text-emerald-400" />
                  ) : (
                    <ArrowDown size={11} className="text-rose-400" />
                  )}
                  {isAbove ? 'Üstüne çıkınca' : 'Altına inince'} {formatPrice(alert.target_price)}
                </p>
                <p className="text-[10px] text-slate-500">
                  Güncel: {formatPrice(currentPrice)} · %{distance.toFixed(1)} uzaklık
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleTriggered(alert.id, alert.triggered)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                  alert.triggered
                    ? 'bg-emerald-500/15 text-emerald-300'
                    : 'bg-slate-800/50 text-slate-500 hover:text-slate-300'
                }`}
                aria-label="Alarm durumunu değiştir"
              >
                <CheckCircle2 size={15} />
              </button>
              <button
                onClick={() => deleteAlert(alert.id)}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800/50 text-slate-500 transition-colors hover:bg-rose-500/15 hover:text-rose-300"
                aria-label="Alarmı sil"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        );
      })}

      <AddAlertModal open={modalOpen} onClose={() => setModalOpen(false)} onAdd={addAlert} />
    </div>
  );
}
