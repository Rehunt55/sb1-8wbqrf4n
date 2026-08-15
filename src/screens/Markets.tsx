import { DollarSign, Coins, Bitcoin, TrendingUp, TrendingDown, RefreshCw, Wifi, WifiOff, AlertTriangle, ArrowDown } from 'lucide-react';
import { Sparkline } from '@/components/Sparkline';
import { PriceAlarm } from '@/components/PriceAlarm';
import { SectionSkeleton } from '@/components/Skeleton';
import { markets } from '@/data/mock';
import { useLivePrices } from '@/lib/useLivePrices';
import { usePullToRefresh } from '@/lib/usePullToRefresh';
import type { LivePrice } from '@/lib/priceService';

type MarketItem = {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  sparkline: number[];
};

const sectionConfig: { title: string; icon: typeof DollarSign; accent: string; symbols: string[]; skeletonCount: number }[] = [
  { title: 'Canlı Döviz', icon: DollarSign, accent: 'text-emerald-300', symbols: ['USD/TRY', 'EUR/TRY'], skeletonCount: 2 },
  { title: 'Canlı Altın', icon: Coins, accent: 'text-amber-300', symbols: ['Gram Altın', 'Çeyrek Altın', 'Ons Altın'], skeletonCount: 3 },
  { title: 'Kripto Paralar', icon: Bitcoin, accent: 'text-violet-300', symbols: ['BTC', 'ETH', 'SOL'], skeletonCount: 3 },
];

function formatPrice(price: number): string {
  if (price >= 1_000_000) return `₺${(price / 1_000_000).toFixed(2)}M`;
  if (price >= 1_000) return `₺${price.toLocaleString('tr-TR', { maximumFractionDigits: 1 })}`;
  return `₺${price.toFixed(2)}`;
}

function ChangeBadge({ change }: { change: number }) {
  const positive = change >= 0;
  return (
    <span
      className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
        positive
          ? 'bg-emerald-500/15 text-emerald-300 shadow-[0_0_10px_-2px_rgba(16,185,129,0.6)]'
          : 'bg-rose-500/15 text-rose-300 shadow-[0_0_10px_-2px_rgba(244,63,94,0.6)]'
      }`}
    >
      {positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
      {positive ? '+' : ''}
      {change.toFixed(2)}%
    </span>
  );
}

function MarketCard({ item, index }: { item: MarketItem; index: number }) {
  const positive = item.change >= 0;
  return (
    <div
      className="glass animate-fade-up flex items-center justify-between rounded-2xl p-3.5"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-xl text-[13px] font-bold ${
            positive ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'
          }`}
        >
          {item.symbol.slice(0, 3)}
        </span>
        <div>
          <p className="text-[13px] font-semibold text-slate-100">{item.symbol}</p>
          <p className="text-[11px] text-slate-400">{item.name}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Sparkline data={item.sparkline} positive={positive} />
        <div className="text-right">
          <p className="text-[13px] font-bold text-white">{formatPrice(item.price)}</p>
          <div className="mt-0.5">
            <ChangeBadge change={item.change} />
          </div>
        </div>
      </div>
    </div>
  );
}

function buildItem(symbol: string, live: LivePrice | undefined, mockItems: MarketItem[]): MarketItem {
  const mock = mockItems.find((m) => m.symbol === symbol);
  const base = mock ?? { id: symbol, symbol, name: symbol, price: 0, change: 0, sparkline: [] };
  if (!live) return base;
  return {
    ...base,
    price: live.price,
    change: live.change24h || base.change,
    sparkline: live.sparkline.length > 0 ? live.sparkline : base.sparkline,
  };
}

function SourceBadge({ source }: { source: 'live' | 'stale' | 'mock' }) {
  if (source === 'live') {
    return (
      <p className="flex items-center gap-1.5 text-[12px] text-emerald-400">
        <Wifi size={12} />
        Canlı veri
      </p>
    );
  }
  if (source === 'stale') {
    return (
      <p className="flex items-center gap-1.5 text-[12px] text-amber-400">
        <AlertTriangle size={12} />
        Son bilinen fiyatlar
      </p>
    );
  }
  return (
    <p className="flex items-center gap-1.5 text-[12px] text-slate-500">
      <WifiOff size={12} />
      Çevrimdışı (örnek veri)
    </p>
  );
}

export function Markets() {
  const { prices, source, refresh, refreshing, loading } = useLivePrices();
  const allMock = [...markets.forex, ...markets.gold, ...markets.crypto] as MarketItem[];

  const { pullDistance, isRefreshing, bind } = usePullToRefresh({
    onRefresh: async () => {
      await refresh();
    },
  });

  const pullProgress = Math.min(pullDistance / 70, 1);
  const showPullHint = pullDistance > 0 && !isRefreshing;

  return (
    <div
      className="animate-fade-in space-y-5 px-4 pb-28 pt-6"
      {...bind}
    >
      {/* Pull-to-refresh indicator */}
      {(showPullHint || isRefreshing) && (
        <div
          className="flex items-center justify-center transition-opacity"
          style={{ height: isRefreshing ? 40 : pullDistance, opacity: pullProgress }}
        >
          <RefreshCw
            size={20}
            className={isRefreshing ? 'animate-spin text-violet-400' : 'text-slate-500'}
            style={{ transform: `rotate(${pullProgress * 360}deg)` }}
          />
          {!isRefreshing && pullDistance > 30 && (
            <span className="ml-2 text-[11px] text-slate-500">
              <ArrowDown size={11} className="mr-1 inline" />
              Yenilemek için bırakın
            </span>
          )}
        </div>
      )}

      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Piyasalar</h1>
          <SourceBadge source={source} />
        </div>
        <button
          onClick={refresh}
          className="glass-strong flex h-9 w-9 items-center justify-center rounded-full text-slate-300 transition-colors hover:text-white"
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
        </button>
      </header>

      {/* Stale data warning banner */}
      {source === 'stale' && (
        <div className="glass animate-fade-up flex items-center gap-2.5 rounded-2xl border border-amber-400/30 p-3.5">
          <AlertTriangle size={16} className="shrink-0 text-amber-400" />
          <p className="text-[12px] leading-relaxed text-amber-200">
            Canlı veriye ulaşılamıyor, son bilinen fiyatlar gösteriliyor. İnternet bağlantınızı kontrol edin.
          </p>
        </div>
      )}

      {loading
        ? sectionConfig.map((section) => (
            <SectionSkeleton key={section.title} count={section.skeletonCount} />
          ))
        : sectionConfig.map((section) => {
            const SectionIcon = section.icon;
            const items = section.symbols.map((sym) =>
              buildItem(sym, prices[sym], allMock),
            );
            return (
              <div key={section.title} className="space-y-2.5">
                <div className="flex items-center gap-2 px-1">
                  <SectionIcon size={15} className={section.accent} />
                  <h2 className="text-sm font-semibold text-slate-100">{section.title}</h2>
                </div>
                {items.map((item, i) => (
                  <MarketCard key={item.id} item={item} index={i} />
                ))}
              </div>
            );
          })}

      <PriceAlarm />
    </div>
  );
}
