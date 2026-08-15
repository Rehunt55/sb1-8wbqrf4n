import { useState } from 'react';
import {
  Sparkles,
  Wallet,
  ShoppingBag,
  Boxes,
  TrendingUp,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { AIChat } from '@/components/AIChat';
import { greeting, initialChat, quickActions, suggestedPrompts } from '@/data/mock';
import { getAccent } from '@/lib/ui';
import type { ChatMessage, TabId } from '@/types';

const iconMap = { Wallet, ShoppingBag, Boxes, Sparkles };

const aiResponses: Record<string, string> = {
  risk:
    'Portföyünüzün %60\'ı Kripto varlıklarda — risk seviyesi yüksek. Altın oranınızı %25\'e çıkararak oynaklığı azaltabilirsiniz. Döviz oranı %15, bu seviye makul ancak kripto ağırlığını %35\'e indirmek daha dengeli bir risk profili sağlar.',
  gold:
    'Altın oranı şu an %10 — bu, güvenli liman ihtiyacınız için yetersiz. Altını portföyün %25\'ine çıkarmanızı öneririm. Gram Altın uzun vadede enflasyona karşı koruma sağlar ve kripto oynaklığını dengeler.',
  crypto:
    'Kripto oranı %60 ile oldukça yüksek. BTC ve ETH oynaklık getirse de uzun vadeli potansiyel sunuyor. Risk iştahınız yüksekse mevcut seviye korunabilir, ancak dengeli portföy için %25-35 arasına indirmek daha sağlıklı olur.',
  balanced:
    'Dengeli portföy önerim: %40 Altın, %30 Döviz, %30 Kripto. Bu dağılım hem enflasyona karşı koruma sağlar hem de kripto büyüme potansiyelini korur. Altın güvenli liman, döviz kur riski hedge, kripto büyüme motoru olarak işlev görür.',
};

function replyFor(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('risk') || lower.includes('analiz')) return aiResponses.risk;
  if (lower.includes('altın') || lower.includes('altın oran')) return aiResponses.gold;
  if (lower.includes('kripto') || lower.includes('kripto oran')) return aiResponses.crypto;
  if (lower.includes('dengeli') || lower.includes('denge')) return aiResponses.balanced;
  return 'Portföyünüzün risk dağılımını analiz edebilir, altın/döviz/kripto oranları için öneriler sunabilirim. Aşağıdaki önerilerden birini deneyin.';
}

interface DashboardProps {
  onNavigate: (tab: TabId) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialChat);
  const [thinking, setThinking] = useState(false);

  const send = (text: string) => {
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setThinking(true);
    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'ai',
          text: replyFor(text),
        },
      ]);
      setThinking(false);
    }, 900);
  };

  const handleQuickAction = (id: string) => {
    if (id === 'budget') {
      send('Portföyümün riskini analiz et');
    } else if (id === 'product') {
      onNavigate('shop');
    } else if (id === 'inventory') {
      onNavigate('business');
    }
  };

  return (
    <div className="animate-fade-in space-y-5 px-4 pb-28 pt-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-emerald-500 shadow-[0_0_22px_-6px_rgba(139,92,246,0.8)]">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight text-white">OmniAI</h1>
            <p className="text-[11px] text-slate-400">Yapay zeka süper uygulaman</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-300">
            <Flame size={12} /> {greeting.streak} gün serisi
          </span>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/30 to-emerald-500/20 text-sm font-semibold text-violet-200 ring-1 ring-violet-400/30">
            {greeting.initials}
          </div>
        </div>
      </header>

      <div className="animate-fade-up">
        <p className="text-sm text-slate-400">Günaydın,</p>
        <h2 className="text-2xl font-bold text-white">{greeting.name} 👋</h2>
        <p className="mt-1 text-[13px] text-slate-400">
          OmniAI bugün senin için hazırladıklarını sıraladı.
        </p>
      </div>

      <div className="glass animate-fade-up overflow-hidden rounded-3xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-400">
              Net servet
            </p>
            <p className="mt-1 text-2xl font-bold text-white">₺48,250</p>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-300">
            <TrendingUp size={13} /> +%6,4
          </span>
        </div>
        <div className="mt-3 flex h-1.5 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full w-[66%] bg-gradient-to-r from-emerald-400 to-emerald-500" />
          <div className="h-full w-[34%] bg-gradient-to-r from-violet-400 to-violet-500" />
        </div>
        <div className="mt-2 flex justify-between text-[11px] text-slate-400">
          <span>Gelir ₺32,000</span>
          <span>Gider ₺18,750</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {quickActions.map((action, i) => {
          const accent = getAccent(action.accent);
          const Icon = iconMap[action.icon] ?? Sparkles;
          return (
            <button
              key={action.id}
              onClick={() => handleQuickAction(action.id)}
              style={{ animationDelay: `${i * 60}ms` }}
              className={`glass animate-fade-up flex flex-col items-start gap-2 rounded-2xl p-3 text-left transition-all hover:-translate-y-0.5 hover:shadow-lg ${accent.glow}`}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${accent.iconBg} ${accent.iconText}`}
              >
                <Icon size={17} />
              </span>
              <span className="text-[12px] font-semibold leading-tight text-slate-100">
                {action.title}
              </span>
              <span className="text-[10px] leading-tight text-slate-400">
                {action.subtitle}
              </span>
            </button>
          );
        })}
      </div>

      <AIChat
        messages={messages}
        onSend={send}
        thinking={thinking}
        suggestions={suggestedPrompts}
        onSuggestion={send}
      />

      <button
        onClick={() => onNavigate('finance')}
        className="glass flex w-full items-center justify-between rounded-2xl p-4 transition-colors hover:border-violet-400/30"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
            <Wallet size={17} />
          </span>
          <div className="text-left">
            <p className="text-sm font-semibold text-slate-100">Tüm finans raporunu gör</p>
            <p className="text-[11px] text-slate-400">Grafikler, öngörüler ve işlemler</p>
          </div>
        </div>
        <ArrowRight size={18} className="text-slate-500" />
      </button>
    </div>
  );
}
