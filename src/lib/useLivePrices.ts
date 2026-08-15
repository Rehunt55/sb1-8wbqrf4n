import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchLivePrices, type PriceResult } from '@/lib/priceService';
import { assetPriceMap } from '@/data/mock';

const initialMock: PriceResult = {
  prices: Object.fromEntries(
    Object.entries(assetPriceMap).map(([symbol, price]) => [
      symbol,
      { symbol, price, change24h: 0, sparkline: [] },
    ]),
  ),
  source: 'mock',
  fetchedAt: 0,
};

export function useLivePrices(intervalMs = 30_000) {
  const [result, setResult] = useState<PriceResult>(initialMock);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchNow = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    const res = await fetchLivePrices();
    setResult(res);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchNow();
    timer.current = setInterval(() => fetchNow(), intervalMs);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [fetchNow, intervalMs]);

  const isStale = result.source === 'stale';
  const isLive = result.source === 'live';

  return {
    ...result,
    loading,
    refreshing,
    isStale,
    isLive,
    refresh: () => fetchNow(true),
  };
}
