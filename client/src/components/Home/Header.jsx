import { useState } from 'react';
import { Flame } from 'lucide-react';
import StreakModal from './StreakModal.jsx';

export default function Header({ name, streak }) {
  const [showModal, setShowModal] = useState(false);

  const streakLevel = streak <= 0 ? 'none' : streak <= 2 ? 'spark' : streak <= 6 ? 'fire' : 'inferno';
  const colors = {
    none: { bg: 'bg-white/[0.03]', border: 'border-white/[0.06]', icon: 'text-white/30', text: 'text-white/30', glow: '' },
    spark: { bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: 'text-orange-400', text: 'text-orange-400', glow: 'shadow-[0_0_12px_rgba(255,159,10,0.15)]' },
    fire: { bg: 'bg-orange-500/15', border: 'border-orange-500/30', icon: 'text-orange-400', text: 'text-orange-300', glow: 'shadow-[0_0_16px_rgba(255,159,10,0.25)]' },
    inferno: { bg: 'bg-red-500/15', border: 'border-red-500/30', icon: 'text-[#ff453a]', text: 'text-[#ff9f0a]', glow: 'shadow-[0_0_20px_rgba(255,69,58,0.25)]' },
  };
  const c = colors[streakLevel];

  return (
    <div className="flex items-center justify-between mb-5 pt-2">
      <div className="flex items-center gap-3">
        <div className="relative">
          <img src="/logo.png" alt="FitX" className="h-9 w-auto rounded-xl object-contain" />
          <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#30d158] border-[1.5px] border-black" />
        </div>
        <div>
          <h1 className="text-white/90 font-bold text-base leading-tight">Hi, {name?.split(' ')[0] || 'there'}</h1>
          <p className="text-[10px] text-white/30 font-medium tracking-wide">Ready to train?</p>
        </div>
      </div>

      <button
        onClick={() => setShowModal(true)}
        className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-all duration-300 ${c.bg} ${c.border} ${c.glow} hover:scale-105 active:scale-95`}
      >
        <div className={`relative ${streak > 0 ? 'animate-flame' : ''}`}>
          <Flame size={17} strokeWidth={streak > 0 ? 2 : 1.5} className={c.icon} fill={streak > 0 ? 'currentColor' : 'none'} />
        </div>
        <span className={`text-sm font-bold tabular-nums ${c.text} ${streak > 0 ? 'animate-streak-pulse' : ''}`}>
          {streak}
        </span>
      </button>

      {showModal && <StreakModal streak={streak} onClose={() => setShowModal(false)} />}
    </div>
  );
}
