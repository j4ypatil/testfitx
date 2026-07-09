import { Beef, Wheat, Droplets } from 'lucide-react';

const macroConfig = {
  protein: { label: 'Protein', color: '#ff453a', icon: Beef },
  carbs: { label: 'Carbs', color: '#30d158', icon: Wheat },
  fat: { label: 'Fats', color: '#5e5ce6', icon: Droplets },
};

function MiniRing({ progress, color }) {
  const size = 36;
  const strokeWidth = 3.5;
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(progress, 100) / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
      />
    </svg>
  );
}

export default function MacroCards({ consumed, targets }) {
  const items = [
    { key: 'protein', consumed: consumed.protein, target: targets.protein },
    { key: 'carbs', consumed: consumed.carbs, target: targets.carbs },
    { key: 'fat', consumed: consumed.fat, target: targets.fat },
  ];

  return (
    <div className="flex gap-2 mb-4">
      {items.map(({ key, consumed: c, target: t }) => {
        const cfg = macroConfig[key];
        const remaining = Math.max(t - c, 0);
        const pct = t > 0 ? Math.min((c / t) * 100, 100) : 0;
        const Icon = cfg.icon;

        return (
          <div key={key} className="relative flex-1 group">
            <div className="absolute -inset-[1px] bg-gradient-to-b from-white/[0.04] to-transparent rounded-2xl pointer-events-none" />
            <div className="relative bg-[rgba(28,28,30,0.5)] backdrop-blur-xl rounded-2xl border border-white/[0.05] p-3.5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <Icon size={15} style={{ color: cfg.color }} />
                <MiniRing progress={pct} color={cfg.color} />
              </div>
              <div className="flex items-baseline gap-0.5">
                <span className="text-xl font-bold text-white/90 leading-none" style={{ color: cfg.color }}>{remaining}g</span>
              </div>
              <div className="text-[10px] text-white/30 font-medium mt-0.5">{cfg.label} left</div>
              <div className="mt-2 pt-2 border-t border-white/[0.04] flex justify-between">
                <span className="text-[9px] text-white/20">{c}g / {t}g</span>
                <span className="text-[9px] font-semibold text-white/40">{Math.round(pct)}%</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
