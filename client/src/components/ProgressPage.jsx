import { useState, useEffect, lazy, Suspense } from 'react';
import { TrendingUp, TrendingDown, Minus, Dumbbell, Calendar, Zap, Target, ChevronRight } from 'lucide-react';
import { getOnboarding, getAllWeights, getWorkoutAdherence, getWorkoutPlan, getCompletedCount } from '../utils/storage.js';

const WeightChart = lazy(() => import('./Profile/WeightChart.jsx'));

export default function ProgressPage({ onboarding }) {
  const [weights, setWeights] = useState([]);
  const profile = (onboarding || getOnboarding()) || {};

  useEffect(() => {
    try { const w = getAllWeights(); if (w) setWeights(w); } catch {}
  }, []);

  const startWeight = weights?.length > 0 ? weights[0]?.weight : null;
  const currentWeight = weights?.length > 0 ? weights[weights.length - 1]?.weight : null;
  const change = startWeight && currentWeight ? (currentWeight - startWeight).toFixed(1) : null;
  const goalWeight = profile?.goalWeight || null;
  const goalDiff = currentWeight && goalWeight ? (goalWeight - currentWeight).toFixed(1) : null;

  const TrendIcon = change > 0 ? TrendingUp : change < 0 ? TrendingDown : Minus;
  const trendColor = profile?.goalType === 'lose_fat'
    ? (change < 0 ? 'text-green-500' : 'text-red-400')
    : profile?.goalType === 'build_muscle'
    ? (change > 0 ? 'text-green-500' : 'text-red-400')
    : 'text-dark-muted';

  const adherence = getWorkoutAdherence() || [];
  const plan = getWorkoutPlan();
  const planDays = plan?.length || 7;
  const completedDays = new Set((adherence || []).map(a => a.date)).size;
  const completionPct = Math.round((completedDays / planDays) * 100);

  const { days: doneEx, total: totalEx } = getCompletedCount(plan);
  let totalVolume = 0;
  try {
    const raw = localStorage.getItem('fitx_workout_logs');
    if (raw) totalVolume = Object.values(JSON.parse(raw)).flat().reduce((sum, s) => sum + (Number(s.weight) || 0) * (Number(s.reps) || 0), 0);
  } catch {}

  const wrapper = (content) => (
    <div className="absolute -inset-[1px] bg-gradient-to-b from-white/[0.06] to-transparent rounded-[28px] pointer-events-none" />
  );

  const Card = ({ children, className = '' }) => (
    <div className={`relative group ${className}`}>
      <div className="absolute -inset-[1px] bg-gradient-to-b from-white/[0.04] to-transparent rounded-[20px] pointer-events-none" />
      <div className="relative bg-[rgba(28,28,30,0.5)] backdrop-blur-xl rounded-[20px] border border-white/[0.06] p-4">
        {children}
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-6 pt-6 px-4 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-bold text-white/90">Progress</h1>
        <p className="text-sm text-white/40 mt-0.5">Track your journey</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card>
          <div className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1">Current</div>
          <div className="text-xl sm:text-2xl font-bold text-white/90">
            {currentWeight ? `${currentWeight} kg` : '—'}
          </div>
        </Card>
        <Card>
          <div className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1">Start</div>
          <div className="text-xl sm:text-2xl font-bold text-white/90">
            {startWeight ? `${startWeight} kg` : '—'}
          </div>
        </Card>
        <Card>
          <div className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1">Change</div>
          <div className={`text-xl sm:text-2xl font-bold flex items-center gap-1.5 ${trendColor}`}>
            {change !== null ? (
              <><TrendIcon size={20} strokeWidth={2.5} />{Math.abs(change)} kg</>
            ) : '—'}
          </div>
        </Card>
      </div>

      {goalWeight && goalDiff !== null && (
        <Card>
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center border border-white/[0.06]">
              <Target size={14} className="text-white/60" />
            </div>
            <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">Goal Progress</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2.5 bg-white/[0.06] rounded-full overflow-hidden">
              <div className="h-full bg-white/60 rounded-full transition-all duration-500"
                style={{ width: startWeight && goalWeight ? `${Math.min(Math.max(((startWeight - currentWeight) / (startWeight - goalWeight)) * 100, 0), 100)}%` : '0%' }} />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-white/50 shrink-0 whitespace-nowrap">{Math.abs(goalDiff)} kg to go</span>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center border border-white/[0.06]">
              <Calendar size={15} className="text-white/60" />
            </div>
            <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">Adherence</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white/90">{completionPct}%</div>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <div className="h-full bg-white/40 rounded-full transition-all" style={{ width: `${completionPct}%` }} />
            </div>
            <span className="text-[10px] text-white/40 shrink-0">{completedDays}/{planDays} days</span>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center border border-white/[0.06]">
              <Zap size={15} className="text-white/60" />
            </div>
            <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">Volume</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white/90">{totalVolume.toLocaleString()}</div>
          <div className="text-[10px] text-white/40 mt-1">total kg lifted</div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center border border-white/[0.06]">
            <Dumbbell size={15} className="text-white/60" />
          </div>
          <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">Workout Progress</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2.5 bg-white/[0.06] rounded-full overflow-hidden">
            <div className="h-full bg-[#30d158] rounded-full transition-all duration-500"
              style={{ width: totalEx > 0 ? `${(doneEx / totalEx) * 100}%` : '0%' }} />
          </div>
          <span className="text-xs sm:text-sm font-semibold text-white/50 shrink-0">{doneEx}/{totalEx}</span>
        </div>
      </Card>

      <Suspense fallback={<div className="h-[200px] bg-white/[0.02] rounded-[20px]" />}>
        <WeightChart data={weights} />
      </Suspense>
    </div>
  );
}
