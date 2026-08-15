import { useEffect, useRef, useState } from 'react';
import { Send, Sparkles, User } from 'lucide-react';
import type { ChatMessage } from '@/types';

interface AIChatProps {
  messages: ChatMessage[];
  onSend: (text: string) => void;
  thinking: boolean;
  suggestions: string[];
  onSuggestion: (text: string) => void;
}

export function AIChat({
  messages,
  onSend,
  thinking,
  suggestions,
  onSuggestion,
}: AIChatProps) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, thinking]);

  const submit = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || thinking) return;
    onSend(trimmed);
    setInput('');
  };

  return (
    <div className="glass flex flex-col rounded-3xl p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
          <Sparkles size={16} />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-100">Portföy Danışmanı</p>
          <p className="flex items-center gap-1.5 text-[11px] text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-glow" />
            Çevrimiçi · risk analizi hazır
          </p>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="no-scrollbar flex max-h-72 min-h-[150px] flex-col gap-3 overflow-y-auto pr-1"
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed animate-fade-up ${
                m.role === 'user'
                  ? 'rounded-br-md bg-gradient-to-br from-violet-500/90 to-violet-600/80 text-white'
                  : 'rounded-bl-md bg-slate-800/70 text-slate-200'
              }`}
            >
              {m.role === 'ai' && (
                <span className="mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-violet-300">
                  <Sparkles size={10} /> Portföy Danışmanı
                </span>
              )}
              {m.text}
            </div>
          </div>
        ))}

        {thinking && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-slate-800/70 px-4 py-3">
              <span className="h-2 w-2 rounded-full bg-violet-400 animate-blink" />
              <span
                className="h-2 w-2 rounded-full bg-violet-400 animate-blink"
                style={{ animationDelay: '0.2s' }}
              />
              <span
                className="h-2 w-2 rounded-full bg-violet-400 animate-blink"
                style={{ animationDelay: '0.4s' }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => onSuggestion(s)}
            className="whitespace-nowrap rounded-full border border-slate-700/60 bg-slate-800/40 px-3 py-1.5 text-[11px] text-slate-300 transition-colors hover:border-violet-400/40 hover:text-violet-200"
          >
            {s}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(input);
        }}
        className="mt-3 flex items-center gap-2 rounded-2xl border border-slate-700/60 bg-slate-900/60 p-1.5"
      >
        <User size={16} className="ml-2 text-slate-500" />
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Portföy Danışmanı'na sorun…"
          className="flex-1 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={thinking || !input.trim()}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 text-white transition-all hover:shadow-[0_0_18px_-4px_rgba(139,92,246,0.8)] disabled:opacity-40"
          aria-label="Mesaj gönder"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
