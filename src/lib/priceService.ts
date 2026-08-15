import { assetPriceMap } from '@/data/mock';

export interface LivePrice {
  symbol: string;
  price: number;
  change24h: number;
  sparkline: number[];
}

export type PriceSource = 'live' | 'stale' | 'mock';

export interface PriceResult {
  prices: Record<string, LivePrice>;
  source: PriceSource;
  fetchedAt: number;
}

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';
const BINANCE_BASE = 'https://api.binance.com/api/v3';
const FOREX_BASE = 'https://open.er-api.com/v6/latest/TRY';

const GRAMS_PER_OUNCE = 31.1035;
const CEYREK_GRAMS = 1.75; // çeyrek altın ≈ 1.75 gram

interface CryptoMapping {
  binanceSymbol: string;
  coingeckoId: string;
}

const cryptoMappings: Record<string, CryptoMapping> = {
  BTC: { binanceSymbol: 'BTCUSDT', coingeckoId: 'bitcoin' },
  ETH: { binanceSymbol: 'ETHUSDT', coingeckoId: 'ethereum' },
  SOL: { binanceSymbol: 'SOLUSDT', coingeckoId: 'solana' },
};

const forexSymbols = ['USD/TRY', 'EUR/TRY'];

let cachedUsdTry: number | null = null;

async function fetchCryptoFromBinance(): Promise<Record<string, LivePrice> | null> {
  const symbols = Object.values(cryptoMappings).map((m) => m.binanceSymbol);
  const tickerUrl = `${BINANCE_BASE}/ticker/24hr?symbols=${encodeURIComponent(JSON.stringify(symbols))}`;

  const tickerRes = await fetch(tickerUrl);
  if (!tickerRes.ok) throw new Error(`Binance ticker ${tickerRes.status}`);
  const tickerData = (await tickerRes.json()) as Array<{
    symbol: string;
    lastPrice: string;
    priceChangePercent: string;
  }>;

  const klinesUrl = `${BINANCE_BASE}/klines?symbol=${symbols[0]}&interval=1h&limit=7`;
  const klinesRes = await fetch(klinesUrl);
  const klinesOk = klinesRes.ok;

  const result: Record<string, LivePrice> = {};
  for (const [symbol, mapping] of Object.entries(cryptoMappings)) {
    const ticker = tickerData.find((t) => t.symbol === mapping.binanceSymbol);
    if (!ticker) continue;

    let sparkline: number[] = [];
    if (klinesOk) {
      try {
        const skUrl = `${BINANCE_BASE}/klines?symbol=${mapping.binanceSymbol}&interval=1h&limit=7`;
        const skRes = await fetch(skUrl);
        if (skRes.ok) {
          const skData = (await skRes.json()) as Array<[string, string, string, string, string, string]>;
          sparkline = skData.map((k) => parseFloat(k[4]));
        }
      } catch {
        // sparkline is optional
      }
    }

    const usdPrice = parseFloat(ticker.lastPrice);
    const change = parseFloat(ticker.priceChangePercent);

    let tryPrice = usdPrice;
    if (cachedUsdTry && cachedUsdTry > 0) {
      tryPrice = usdPrice * cachedUsdTry;
    }

    result[symbol] = {
      symbol,
      price: tryPrice,
      change24h: change,
      sparkline: sparkline.length > 0 ? sparkline : [],
    };
  }
  return result;
}

async function fetchCryptoFromCoinGecko(): Promise<Record<string, LivePrice> | null> {
  const ids = Object.values(cryptoMappings).map((m) => m.coingeckoId).join(',');
  const url = `${COINGECKO_BASE}/coins/markets?vs_currency=try&ids=${ids}&sparkline=true&price_change_percentage=24h`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`CoinGecko ${res.status}`);
  const data = (await res.json()) as Array<{
    id: string;
    current_price: number;
    price_change_percentage_24h: number;
    sparkline_in_7d?: { price: number[] };
  }>;

  const result: Record<string, LivePrice> = {};
  for (const [symbol, mapping] of Object.entries(cryptoMappings)) {
    const coin = data.find((c) => c.id === mapping.coingeckoId);
    if (!coin) continue;
    const spark = coin.sparkline_in_7d?.price ?? [];
    result[symbol] = {
      symbol,
      price: coin.current_price,
      change24h: coin.price_change_percentage_24h ?? 0,
      sparkline: spark.length > 7 ? spark.slice(-7) : spark,
    };
  }
  return result;
}

async function fetchForex(): Promise<Record<string, LivePrice> | null> {
  const res = await fetch(FOREX_BASE);
  if (!res.ok) throw new Error(`Forex ${res.status}`);
  const data = (await res.json()) as { rates: Record<string, number> };

  const result: Record<string, LivePrice> = {};
  for (const symbol of forexSymbols) {
    const code = symbol.split('/')[0];
    const rate = data.rates[code];
    if (!rate) continue;
    result[symbol] = {
      symbol,
      price: rate,
      change24h: 0,
      sparkline: [],
    };
  }

  if (result['USD/TRY']) {
    cachedUsdTry = result['USD/TRY'].price;
  }

  return result;
}

async function fetchGold(): Promise<Record<string, LivePrice> | null> {
  const ids = 'pax-gold';
  const url = `${COINGECKO_BASE}/coins/markets?vs_currency=try&ids=${ids}&sparkline=true&price_change_percentage=24h`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`CoinGecko Gold ${res.status}`);
  const data = (await res.json()) as Array<{
    id: string;
    current_price: number;
    price_change_percentage_24h: number;
    sparkline_in_7d?: { price: number[] };
  }>;

  const coin = data.find((c) => c.id === 'pax-gold');
  if (!coin) return null;

  const onsPriceTry = coin.current_price * GRAMS_PER_OUNCE;
  const gramPrice = coin.current_price;
  const ceyrekPrice = gramPrice * CEYREK_GRAMS;
  const rawSpark = coin.sparkline_in_7d?.price ?? [];
  const gramSpark = rawSpark.length > 7 ? rawSpark.slice(-7) : rawSpark;

  return {
    'Ons Altın': {
      symbol: 'Ons Altın',
      price: onsPriceTry,
      change24h: coin.price_change_percentage_24h ?? 0,
      sparkline: rawSpark.length > 7 ? rawSpark.slice(-7) : rawSpark,
    },
    'Gram Altın': {
      symbol: 'Gram Altın',
      price: gramPrice,
      change24h: coin.price_change_percentage_24h ?? 0,
      sparkline: gramSpark,
    },
    'Çeyrek Altın': {
      symbol: 'Çeyrek Altın',
      price: ceyrekPrice,
      change24h: coin.price_change_percentage_24h ?? 0,
      sparkline: gramSpark.map((p) => p * CEYREK_GRAMS),
    },
  };
}

function mockResult(source: PriceSource = 'mock'): PriceResult {
  const prices: Record<string, LivePrice> = {};
  for (const [symbol, price] of Object.entries(assetPriceMap)) {
    prices[symbol] = {
      symbol,
      price,
      change24h: 0,
      sparkline: [],
    };
  }
  return { prices, source, fetchedAt: Date.now() };
}

let lastKnownPrices: Record<string, LivePrice> | null = null;

export async function fetchLivePrices(): Promise<PriceResult> {
  try {
    const forexPromise = fetchForex();
    const goldPromise = fetchGold();

    let crypto: Record<string, LivePrice> | null = null;
    try {
      crypto = await fetchCryptoFromBinance();
    } catch {
      crypto = await fetchCryptoFromCoinGecko();
    }

    const [forex, gold] = await Promise.all([forexPromise, goldPromise]);

    const prices: Record<string, LivePrice> = {};
    if (crypto) Object.assign(prices, crypto);
    if (gold) Object.assign(prices, gold);
    if (forex) Object.assign(prices, forex);

    if (Object.keys(prices).length === 0) {
      if (lastKnownPrices) {
        return { prices: lastKnownPrices, source: 'stale', fetchedAt: Date.now() };
      }
      return mockResult();
    }

    lastKnownPrices = prices;
    return { prices, source: 'live', fetchedAt: Date.now() };
  } catch {
    if (lastKnownPrices) {
      return { prices: lastKnownPrices, source: 'stale', fetchedAt: Date.now() };
    }
    return mockResult();
  }
}
