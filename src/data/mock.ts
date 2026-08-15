import type {
  ChatMessage,
  ExpenseSlice,
  InventoryItem,
  Product,
  Transaction,
} from '@/types';

export const greeting = {
  name: 'Alperen',
  initials: 'AP',
  streak: 12,
  plan: 'OmniAI Pro',
};

export const initialChat: ChatMessage[] = [
  {
    id: 'm1',
    role: 'ai',
    text: 'Merhaba Alperen! Portföy Danışmanınızım. Varlıklarınızın risk dağılımını analiz edebilir, dengeli portföy önerileri sunabilirim. Aşağıdaki sorulardan birini deneyin.',
  },
];

export const suggestedPrompts = [
  'Portföyümün riskini analiz et',
  'Altın oranımı artırmalı mıyım?',
  'Kripto oranı çok mu yüksek?',
  'Dengeli portföy öner',
];

export const quickActions = [
  {
    id: 'budget',
    title: 'Bütçeyi Analiz Et',
    subtitle: 'Yapay zeka 90 günlük harcamanı tarar',
    icon: 'Wallet',
    accent: 'violet',
  },
  {
    id: 'product',
    title: 'Ürün Önerisi Al',
    subtitle: 'Sana özel öneriler',
    icon: 'ShoppingBag',
    accent: 'emerald',
  },
  {
    id: 'inventory',
    title: 'Stoku Kontrol Et',
    subtitle: 'Anlık stok sağlığı kontrolü',
    icon: 'Boxes',
    accent: 'amber',
  },
] as const;

export const finance = {
  totalBalance: 48250,
  income: 32000,
  expense: 18750,
  savings: 13250,
  currency: '₺',
  insight:
    'Portföyünüzün %60\'ı Kripto varlıklarda — risk seviyesi yüksek. Altın oranınızı %25\'e çıkararak oynaklığı azaltabilir ve döviz ile birlikte dengeli bir dağılım yakalayabilirsiniz.',
  slices: [
    { label: 'Yemek', value: 4200, color: '#8b5cf6' },
    { label: 'Kira', value: 6500, color: '#10b981' },
    { label: 'Alışveriş', value: 3100, color: '#f59e0b' },
    { label: 'Ulaşım', value: 1850, color: '#06b6d4' },
    { label: 'Faturalar', value: 2600, color: '#ec4899' },
  ] as ExpenseSlice[],
  weekly: [
    { label: 'Pzt', value: 240 },
    { label: 'Sal', value: 410 },
    { label: 'Çar', value: 180 },
    { label: 'Per', value: 520 },
    { label: 'Cum', value: 680 },
    { label: 'Cmt', value: 920 },
    { label: 'Paz', value: 360 },
  ],
  transactions: [
    {
      id: 't1',
      label: 'Maaş — Acme Co.',
      category: 'Gelir',
      amount: 32000,
      date: '1 Ağu',
      type: 'income',
    },
    {
      id: 't2',
      label: 'Migros — Market',
      category: 'Alışveriş',
      amount: 1840,
      date: '7 Ağu',
      type: 'expense',
    },
    {
      id: 't3',
      label: 'Spotify Aile',
      category: 'Faturalar',
      amount: 89,
      date: '5 Ağu',
      type: 'expense',
    },
    {
      id: 't4',
      label: 'Akşam Yemeği — Mikla',
      category: 'Yemek',
      amount: 1240,
      date: '6 Ağu',
      type: 'expense',
    },
    {
      id: 't5',
      label: 'Freelance — Tasarım',
      category: 'Gelir',
      amount: 4500,
      date: '4 Ağu',
      type: 'income',
    },
  ] as Transaction[],
};

export const products: Product[] = [
  {
    id: 'p1',
    name: 'İskandinav Salon Koltuğu',
    category: 'Mobilya',
    price: 4290,
    oldPrice: 5200,
    match: 94,
    image:
      'https://images.pexels.com/photos/32562036/pexels-photo-32562036.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    rating: 4.8,
  },
  {
    id: 'p2',
    name: 'Aura Kablosuz Kulaklık',
    category: 'Teknoloji',
    price: 3199,
    oldPrice: 3799,
    match: 97,
    image:
      'https://images.pexels.com/photos/7772548/pexels-photo-7772548.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    rating: 4.9,
  },
  {
    id: 'p3',
    name: 'Pulse Akıllı Saat S9',
    category: 'Teknoloji',
    price: 5499,
    match: 91,
    image:
      'https://images.pexels.com/photos/18662969/pexels-photo-18662969.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    rating: 4.7,
  },
  {
    id: 'p4',
    name: 'Evergreen Kokulu Mum',
    category: 'Ev',
    price: 349,
    match: 88,
    image:
      'https://images.pexels.com/photos/9002411/pexels-photo-9002411.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    rating: 4.6,
  },
];

export const inventory: InventoryItem[] = [
  {
    id: 'i1',
    name: 'Organik Kahve Çekirdeği 1kg',
    sku: 'CFE-001',
    stock: 4,
    unit: 'paket',
    status: 'critical',
    restockDate: '11 Ağu',
    dailySales: 14,
  },
  {
    id: 'i2',
    name: 'Yulaf Sütü 1L',
    sku: 'MLK-014',
    stock: 9,
    unit: 'şişe',
    status: 'low',
    restockDate: '14 Ağu',
    dailySales: 22,
  },
  {
    id: 'i3',
    name: 'Geri Dönüştürülebilir Bardak',
    sku: 'TUM-220',
    stock: 64,
    unit: 'adet',
    status: 'ok',
    restockDate: '2 Eyl',
    dailySales: 6,
  },
  {
    id: 'i4',
    name: 'Matcha Tozu 200g',
    sku: 'MTC-008',
    stock: 3,
    unit: 'kavanoz',
    status: 'critical',
    restockDate: '10 Ağu',
    dailySales: 9,
  },
  {
    id: 'i5',
    name: 'Bademli Kruvasan (dondurulmuş)',
    sku: 'BKE-051',
    stock: 18,
    unit: 'paket',
    status: 'low',
    restockDate: '16 Ağu',
    dailySales: 30,
  },
];

export const markets = {
  forex: [
    {
      id: 'usd-try',
      symbol: 'USD/TRY',
      name: 'Dolar',
      price: 38.42,
      change: 0.82,
      sparkline: [37.9, 38.1, 38.0, 38.25, 38.15, 38.3, 38.42],
    },
    {
      id: 'eur-try',
      symbol: 'EUR/TRY',
      name: 'Euro',
      price: 41.67,
      change: -0.45,
      sparkline: [41.9, 41.85, 41.92, 41.8, 41.75, 41.7, 41.67],
    },
  ],
  gold: [
    {
      id: 'gram-altin',
      symbol: 'Gram Altın',
      name: 'Gram',
      price: 2785,
      change: 1.34,
      sparkline: [2740, 2755, 2748, 2762, 2770, 2778, 2785],
    },
    {
      id: 'ceyrek-altin',
      symbol: 'Çeyrek Altın',
      name: 'Çeyrek',
      price: 4592,
      change: 1.28,
      sparkline: [4520, 4540, 4535, 4558, 4570, 4582, 4592],
    },
    {
      id: 'ons',
      symbol: 'Ons Altın',
      name: 'Ons',
      price: 2418.5,
      change: 0.67,
      sparkline: [2398, 2405, 2402, 2410, 2415, 2412, 2418.5],
    },
  ],
  crypto: [
    {
      id: 'btc',
      symbol: 'BTC',
      name: 'Bitcoin',
      price: 2384500,
      change: 2.14,
      sparkline: [2320, 2335, 2328, 2348, 2360, 2372, 2384.5],
    },
    {
      id: 'eth',
      symbol: 'ETH',
      name: 'Ethereum',
      price: 128750,
      change: -1.32,
      sparkline: [1305, 1302, 1308, 1295, 1290, 1288, 1287.5],
    },
    {
      id: 'sol',
      symbol: 'SOL',
      name: 'Solana',
      price: 6840,
      change: 3.47,
      sparkline: [6600, 6650, 6620, 6700, 6750, 6800, 6840],
    },
  ],
};

export const assetPriceMap: Record<string, number> = {
  'USD/TRY': 38.42,
  'EUR/TRY': 41.67,
  'Gram Altın': 2785,
  'Çeyrek Altın': 4592,
  'Ons Altın': 2418.5,
  BTC: 2384500,
  ETH: 128750,
  SOL: 6840,
};

export const assetOptions: {
  symbol: string;
  type: 'gold' | 'forex' | 'crypto';
  label: string;
}[] = [
  { symbol: 'Gram Altın', type: 'gold', label: 'Gram Altın' },
  { symbol: 'Çeyrek Altın', type: 'gold', label: 'Çeyrek Altın' },
  { symbol: 'Ons Altın', type: 'gold', label: 'Ons Altın' },
  { symbol: 'USD/TRY', type: 'forex', label: 'Dolar (USD)' },
  { symbol: 'EUR/TRY', type: 'forex', label: 'Euro (EUR)' },
  { symbol: 'BTC', type: 'crypto', label: 'Bitcoin (BTC)' },
  { symbol: 'ETH', type: 'crypto', label: 'Ethereum (ETH)' },
  { symbol: 'SOL', type: 'crypto', label: 'Solana (SOL)' },
];

export const business = {
  todaySales: 8420,
  orders: 127,
  avgTicket: 66,
  weekTrend: [
    { label: 'Pzt', value: 6200 },
    { label: 'Sal', value: 7400 },
    { label: 'Çar', value: 6900 },
    { label: 'Per', value: 8100 },
    { label: 'Cum', value: 9300 },
    { label: 'Cmt', value: 10200 },
    { label: 'Paz', value: 8420 },
  ],
  topItems: [
    { name: 'Buzlu Latte', units: 84 },
    { name: 'Kruvasan', units: 62 },
    { name: 'Matcha Latte', units: 41 },
  ],
};
