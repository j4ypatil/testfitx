import { Flame } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const streakData = {
  0: { label: 'No Streak', message: 'Complete your first day to start your streak!', emoji: '✨', color: '#ff9f0a' },
  1: { label: 'First Day', message: 'You\'ve taken the first step. Tomorrow matters.', emoji: '🌱', color: '#ff9f0a' },
  2: { label: 'Spark', message: 'Two days in a row! You\'re building momentum.', emoji: '🔥', color: '#ff9f0a' },
  3: { label: 'On Fire', message: '3-day streak! Consistency is taking hold.', emoji: '🔥', color: '#ff9f0a' },
  4: { label: 'Burning', message: '4 days strong! You\'re unstoppable.', emoji: '🔥', color: '#ff9f0a' },
  5: { label: 'Blazing', message: '5-day streak! This is becoming a habit.', emoji: '🔥', color: '#ff9f0a' },
  6: { label: 'Inferno', message: '6 days! One more for a perfect week.', emoji: '🔥', color: '#ff9f0a' },
  7: { label: 'Perfect Week', message: '7-day streak! A full week of excellence.', emoji: '⭐', color: '#ff9f0a' },
};

export default function StreakModal({ streak, onClose }) {
  const { user } = useAuth();
  const level = streak >= 7 ? 7 : streak;
  const info = streakData[level] || streakData[0];
  const days = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-sm bg-[#1c1c1e] rounded-3xl border border-white/[0.06] shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif' }}
      >
        <div className="h-1 w-full bg-gradient-to-r from-[#ff9f0a] via-[#ff6b35] to-[#ff453a]" />

        <div className="px-7 pt-8 pb-7 flex flex-col items-center">
          <div className="relative mb-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#ff9f0a]/20 to-[#ff453a]/10 flex items-center justify-center">
              <Flame size={36} strokeWidth={1.5} className="text-[#ff9f0a] animate-flame" fill="#ff9f0a" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#ff9f0a]/10 flex items-center justify-center">
              <span className="text-[10px]">{info.emoji}</span>
            </div>
          </div>

          <div className="flex items-baseline gap-0.5 mb-1">
            <span className="text-[56px] font-bold text-[#f5f5f7] leading-none tracking-tight">{streak}</span>
            <span className="text-base font-semibold text-[#98989d] ml-1">days</span>
          </div>

          <p className="text-sm font-semibold mb-4" style={{ color: info.color }}>{info.label}</p>

          <p className="text-[13px] text-[#98989d] text-center leading-relaxed mb-6 font-medium">
            {info.message}
          </p>

          <div className="flex items-center gap-2 mb-6">
            {days.map((d) => {
              const filled = d <= streak;
              return (
                <div key={d} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                      filled
                        ? 'bg-gradient-to-br from-[#ff9f0a] to-[#ff6b35] text-white shadow-[0_2px_8px_rgba(255,159,10,0.3)]'
                        : 'bg-[#2c2c2e] text-[#636366]'
                    }`}
                  >
                    {filled ? '✓' : d}
                  </div>
                  {d === 7 && <span className="text-[8px] text-[#636366] font-medium mt-0.5">Week</span>}
                </div>
              );
            })}
          </div>

          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl bg-[#f5f5f7] text-[#1c1c1e] text-[15px] font-semibold tracking-tight hover:bg-white active:scale-[0.98] transition-all shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
          >
            {streak > 0 ? 'Keep It Going' : 'Start Today'}
          </button>
        </div>
      </div>
    </div>
  );
}
