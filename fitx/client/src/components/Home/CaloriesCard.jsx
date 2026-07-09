import { Flame } from 'lucide-react';

function CircularRing({ progress, size = 120, strokeWidth = 10 }) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(progress, 100) / 100) * circ;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-[0_0_12px_rgba(255,255,255,0.05)]">
      <defs>
        <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff9f0a" />
          <stop offset="100%" stopColor="#ff453a" />
        </linearGradient>
      </defs>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="url(#ringGrad)" strokeWidth={strokeWidth}
        strokeLinecap="round" strokeDasharray={circ}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
      />
    </svg>
  );
}

export default function CaloriesCard({ consumed, target }) {
  const remaining = Math.max(target - consumed, 0);
  const progress = target > 0 ? (consumed / target) * 100 : 0;
  const pctText = target > 0 ? Math.min(Math.round((consumed / target) * 100), 100) : 0;

  return (
    <div className="relative group mb-4">
      <div className="absolute -inset-[1px] bg-gradient-to-b from-white/[0.06] to-transparent rounded-[28px] pointer-events-none" />
      <div className="relative bg-[rgba(28,28,30,0.6)] backdrop-blur-xl rounded-[28px] border border-white/[0.06] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2.5 w-0.5 rounded-full bg-[#ff9f0a]" />
              <span className="text-[10px] font-semibold text-white/40 tracking-widest uppercase">Calories</span>
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-[40px] font-bold text-white/90 leading-none tracking-tight">{remaining.toLocaleString()}</span>
              <span className="text-sm font-medium text-white/30 ml-1">left</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[11px] text-white/30 font-medium">{consumed.toLocaleString()} / {target.toLocaleString()}</span>
              <span className="text-[10px] font-semibold text-[#ff9f0a]">{pctText}%</span>
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <CircularRing progress={progress} />
            <div className="absolute flex flex-col items-center">
              <Flame size={20} className="text-[#ff9f0a]" fill="#ff9f0a" />
              <span className="text-[10px] font-bold text-white/50 mt-0.5">{pctText}%</span>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
          {progress >= 100 ? (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-[#30d158] font-semibold">✓ Goal reached</span>
            </div>
          ) : (
            <span className="text-[11px] text-white/30 font-medium">{remaining > 0 ? `${remaining} kcal remaining` : 'All caught up!'}</span>
          )}
        </div>
      </div>
    </div>
  );
}
