import { useState, useEffect, lazy, Suspense } from 'react';
import { TrendingUp, TrendingDown, Minus, Dumbbell, Calendar, Zap } from 'lucide-react';
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

  return (
    <div className="space-y-4 pb-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Progress</h1>
        <p className="text-sm text-dark-muted mt-0.5">Track your journey</p>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-dark-card rounded-2xl p-4 shadow-sm">
          <div className="text-[10px] font-semibold text-dark-muted uppercase tracking-wider mb-1">Current</div>
          <div className="text-xl font-bold text-foreground">
            {currentWeight ? `${currentWeight} kg` : '—'}
          </div>
        </div>
        <div className="bg-dark-card rounded-2xl p-4 shadow-sm">
          <div className="text-[10px] font-semibold text-dark-muted uppercase tracking-wider mb-1">Start</div>
          <div className="text-xl font-bold text-foreground">
            {startWeight ? `${startWeight} kg` : '—'}
          </div>
        </div>
        <div className="bg-dark-card rounded-2xl p-4 shadow-sm">
          <div className="text-[10px] font-semibold text-dark-muted uppercase tracking-wider mb-1">Change</div>
          <div className={`text-xl font-bold flex items-center gap-1 ${trendColor}`}>
            {change !== null ? (
              <><TrendIcon size={18} strokeWidth={2.5} />{Math.abs(change)} kg</>
            ) : '—'}
          </div>
        </div>
      </div>

      {goalWeight && goalDiff !== null && (
        <div className="bg-dark-card rounded-2xl p-4 shadow-sm">
          <div className="text-[10px] font-semibold text-dark-muted uppercase tracking-wider mb-1">Goal Progress</div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-[#2c2c2e] rounded-full overflow-hidden">
              <div className="h-full bg-accent rounded-full transition-all duration-500"
                style={{ width: startWeight && goalWeight ? `${Math.min(Math.max(((startWeight - currentWeight) / (startWeight - goalWeight)) * 100, 0), 100)}%` : '0%' }} />
            </div>
            <span className="text-xs font-semibold text-dark-muted shrink-0">{Math.abs(goalDiff)} kg to go</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-dark-card rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-accent/20 flex items-center justify-center">
              <Calendar size={14} className="text-accent" />
            </div>
            <span className="text-[10px] font-semibold text-dark-muted uppercase tracking-wider">Adherence</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{completionPct}%</div>
          <div className="text-[10px] text-dark-muted mt-0.5">{completedDays}/{planDays} days done</div>
        </div>
        <div className="bg-dark-card rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-accent/20 flex items-center justify-center">
              <Zap size={14} className="text-accent" />
            </div>
            <span className="text-[10px] font-semibold text-dark-muted uppercase tracking-wider">Volume</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{totalVolume.toLocaleString()}</div>
          <div className="text-[10px] text-dark-muted mt-0.5">total kg lifted</div>
        </div>
      </div>

      <div className="bg-dark-card rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-accent/20 flex items-center justify-center">
            <Dumbbell size={14} className="text-accent" />
          </div>
          <span className="text-[10px] font-semibold text-dark-muted uppercase tracking-wider">Workout Progress</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-[#2c2c2e] rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full transition-all duration-500"
              style={{ width: totalEx > 0 ? `${(doneEx / totalEx) * 100}%` : '0%' }} />
          </div>
          <span className="text-xs font-semibold text-dark-muted shrink-0">{doneEx}/{totalEx}</span>
        </div>
      </div>

      <Suspense fallback={<div className="h-[200px] bg-white/[0.02] rounded-2xl" />}>
        <WeightChart data={weights} />
      </Suspense>
    </div>
  );
}
