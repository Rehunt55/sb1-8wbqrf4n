import { useState } from 'react';
import { Sparkles, Star, ShoppingBag, Wand2, Heart, Filter } from 'lucide-react';
import { products } from '@/data/mock';
import type { Product } from '@/types';

const categories = ['Tümü', 'Mobilya', 'Teknoloji', 'Ev'];

const fmt = (n: number) => `₺${n.toLocaleString('tr-TR')}`;

function ProductCard({ product, index }: { product: Product; index: number }) {
  const [liked, setLiked] = useState(false);
  const matchColor =
    product.match >= 95
      ? 'from-emerald-400 to-emerald-500 text-emerald-50'
      : product.match >= 90
        ? 'from-violet-400 to-violet-500 text-violet-50'
        : 'from-amber-400 to-amber-500 text-amber-50';

  return (
    <div
      className="glass animate-fade-up group overflow-hidden rounded-3xl"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
        <span
          className={`absolute left-2.5 top-2.5 flex items-center gap-1 rounded-full bg-gradient-to-r ${matchColor} px-2 py-1 text-[10px] font-bold shadow-lg`}
        >
          <Sparkles size={10} /> Eşleşme %{product.match}
        </span>
        <button
          onClick={() => setLiked((v) => !v)}
          className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/50 backdrop-blur transition-colors"
          aria-label="Kaydet"
        >
          <Heart
            size={15}
            className={liked ? 'fill-rose-400 text-rose-400' : 'text-slate-300'}
          />
        </button>
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 rounded-full bg-slate-950/50 px-2 py-1 text-[10px] text-slate-200 backdrop-blur">
          <Star size={11} className="fill-amber-400 text-amber-400" /> {product.rating}
        </div>
      </div>
      <div className="p-3">
        <p className="text-[10px] uppercase tracking-wide text-violet-300">
          {product.category}
        </p>
        <h3 className="mt-0.5 text-[13px] font-semibold leading-tight text-slate-100">
          {product.name}
        </h3>
        <div className="mt-2 flex items-end justify-between">
          <div>
            <p className="text-sm font-bold text-white">{fmt(product.price)}</p>
            {product.oldPrice && (
              <p className="text-[10px] text-slate-500 line-through">
                {fmt(product.oldPrice)}
              </p>
            )}
          </div>
          <button className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 text-white transition-all hover:shadow-[0_0_16px_-4px_rgba(139,92,246,0.8)]">
            <ShoppingBag size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function Shop() {
  const [active, setActive] = useState('Tümü');
  const [advice, setAdvice] = useState<string | null>(null);

  const filtered =
    active === 'Tümü' ? products : products.filter((p) => p.category === active);

  const showAdvice = () => {
    setAdvice(null);
    window.setTimeout(
      () =>
        setAdvice(
          'Aura Kulaklık + Pulse Akıllı Saat kombinasyonu ayrı almaya göre ₺650 kazandırır ve ikisi de teknoloji zevkine %90 üstünde eşleşiyor. İskandinav Salon Koltuğu oturma odası renk paletine uyuyor (%94 eşleşme).'
        ),
      700,
    );
  };

  return (
    <div className="animate-fade-in space-y-5 px-4 pb-28 pt-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Alışveriş</h1>
          <p className="text-[12px] text-slate-400">Zevkine göre yapay zeka önerileri</p>
        </div>
        <button className="glass flex h-9 w-9 items-center justify-center rounded-xl text-slate-300">
          <Filter size={16} />
        </button>
      </header>

      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-all ${
              active === c
                ? 'bg-gradient-to-r from-violet-500 to-violet-600 text-white shadow-[0_0_16px_-4px_rgba(139,92,246,0.7)]'
                : 'glass text-slate-300'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <button
        onClick={showAdvice}
        className="glass-strong flex w-full items-center justify-between rounded-2xl p-4 text-left transition-all hover:shadow-[0_0_24px_-6px_rgba(16,185,129,0.6)]"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/25 to-violet-500/15 text-emerald-300">
            <Wand2 size={18} />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-100">Akıllı Kombinasyon</p>
            <p className="text-[11px] text-slate-400">Seçkilerin için yapay zeka alışveriş önerisi</p>
          </div>
        </div>
        <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
          Analiz Et
        </span>
      </button>

      {advice !== undefined && (
        <div className="animate-fade-up rounded-2xl border border-emerald-400/25 bg-emerald-500/10 p-4">
          {advice === null ? (
            <p className="flex items-center gap-2 text-[12px] text-emerald-300">
              <Sparkles size={13} className="animate-pulse-glow" /> Seçkiler birleştiriliyor…
            </p>
          ) : (
            <p className="text-[12px] leading-relaxed text-slate-100">
              <span className="font-semibold text-emerald-300">Yapay Zeka Önerisi: </span>
              {advice}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {filtered.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </div>
  );
}
