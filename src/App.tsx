import { useState } from 'react';
import { TabBar } from '@/components/TabBar';
import { PhoneFrame, FrameToggle } from '@/components/PhoneFrame';
import { ToastProvider } from '@/components/Toast';
import { Dashboard } from '@/screens/Dashboard';
import { Finance } from '@/screens/Finance';
import { Markets } from '@/screens/Markets';
import { Shop } from '@/screens/Shop';
import { Business } from '@/screens/Business';
import type { TabId } from '@/types';

function App() {
  const [tab, setTab] = useState<TabId>('home');
  const [framed, setFramed] = useState(false);

  const content = (
    <>
      <main key={tab}>
        {tab === 'home' && <Dashboard onNavigate={setTab} />}
        {tab === 'finance' && <Finance />}
        {tab === 'markets' && <Markets />}
        {tab === 'shop' && <Shop />}
        {tab === 'business' && <Business />}
      </main>
      <TabBar active={tab} onChange={setTab} />
    </>
  );

  return (
    <ToastProvider>
      <div className="relative min-h-screen w-full bg-slate-950">
        {/* Ambient glow backdrop */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-violet-600/15 blur-[100px]" />
          <div className="absolute -right-24 top-1/3 h-72 w-72 rounded-full bg-emerald-600/12 blur-[100px]" />
          <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-violet-700/10 blur-[90px]" />
        </div>

        <FrameToggle enabled={framed} onToggle={setFramed} />

        {framed ? (
          <div className="flex min-h-screen items-center justify-center py-10">
            <PhoneFrame>{content}</PhoneFrame>
          </div>
        ) : (
          <div className="relative mx-auto min-h-screen w-full max-w-md">{content}</div>
        )}
      </div>
    </ToastProvider>
  );
}

export default App;
