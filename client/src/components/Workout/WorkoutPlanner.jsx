import { useState, useEffect } from 'react';
import { Dumbbell, Play, ChevronRight, ChevronLeft, BookOpen, Zap, Clock, Flame } from 'lucide-react';
import WorkoutExecution from './WorkoutExecution.jsx';
import ExerciseLibrary from './ExerciseLibrary.jsx';
import { getWorkoutPlan, markDateComplete, getCompletedCount, checkAndUpdateStreak, getDateKey } from '../../utils/storage.js';

const dayLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];



export default function WorkoutPlanner() {
  const [started, setStarted] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [plan, setPlan] = useState(null);
  const [, forceUpdate] = useState(0);

  const [activeDay, setActiveDay] = useState(0);

  useEffect(() => {
    const p = getWorkoutPlan();
    setPlan(p);
    if (p && p.length > 0) {
      const todayKey = new Date().toISOString().split('T')[0];
      const todayIdx = p.findIndex(d => d.dateKey === todayKey);
      if (todayIdx >= 0) setActiveDay(todayIdx);
    }
  }, []);

  const triggerUpdate = () => forceUpdate(n => n + 1);

  if (!plan || plan.length === 0) {
    return (
      <div className="pt-6 pb-4">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/[0.06]">
            <Dumbbell size={16} className="text-white/80" />
          </div>
          <h1 className="text-white/90 font-bold text-xl">Workout</h1>
        </div>
        <div className="relative group">
          <div className="absolute -inset-[1px] bg-gradient-to-b from-white/[0.06] to-transparent rounded-[28px] pointer-events-none" />
          <div className="relative bg-[rgba(28,28,30,0.6)] backdrop-blur-xl rounded-[28px] border border-white/[0.06] p-10 flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-4 border border-white/[0.06]">
              <Dumbbell size={24} className="text-white/20" />
            </div>
            <p className="text-white/40 text-sm text-center">No workout plan yet — complete onboarding to generate one</p>
          </div>
        </div>
      </div>
    );
  }

  const currentDay = plan[activeDay];
  const { days: doneEx, total: totalEx } = getCompletedCount(plan);

  const handleFinishWorkout = () => {
    const todayKey = getDateKey(new Date());
    markDateComplete(todayKey);
    checkAndUpdateStreak(todayKey);
    setStarted(false);
    const nextIdx = plan.findIndex(d => d.dateKey === todayKey);
    if (nextIdx >= 0 && nextIdx < plan.length - 1) setActiveDay(nextIdx + 1);
    triggerUpdate();
  };

  if (started) {
    return (
      <WorkoutExecution
        exercises={currentDay?.exercises || []}
        onBack={() => setStarted(false)}
        onFinish={handleFinishWorkout}
      />
    );
  }

  const isRest = currentDay?.isRestDay === true;
  const dayExercises = currentDay?.exercises || [];
  const dayLabel = dayLabels[activeDay];

  const groups = [...new Set(dayExercises.map(e => e.muscleGroup).filter(Boolean))];

  const dayNav = (dir) => {
    let next = activeDay + dir;
    if (next >= 0 && next < plan.length) setActiveDay(next);
  };

  return (
    <div className="pt-6 pb-4">
      {showLibrary && <ExerciseLibrary onClose={() => setShowLibrary(false)} />}

      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/[0.06]">
            <Dumbbell size={16} className="text-white/80" />
          </div>
          <h1 className="text-white/90 font-bold text-xl">Workout</h1>
        </div>
        <div className="flex items-center gap-2.5">
          <button onClick={() => setShowLibrary(true)} className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center hover:bg-white/[0.1] transition-colors">
            <BookOpen size={14} className="text-white/40" />
          </button>
          <div className="text-[11px] text-white/40 font-semibold bg-white/[0.06] px-2.5 py-1 rounded-full">{doneEx}/{totalEx}</div>
        </div>
      </div>

      <div className="relative group mb-5">
        <div className="absolute -inset-[1px] bg-gradient-to-b from-white/[0.06] to-transparent rounded-[28px] pointer-events-none" />
        <div className="relative bg-[rgba(28,28,30,0.6)] backdrop-blur-xl rounded-[28px] border border-white/[0.06] overflow-hidden">
          <div className="p-5 pb-0">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/[0.06]">
                <Zap size={10} className="text-white/40" />
                <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">Week 1</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/[0.06]">
                <Clock size={10} className="text-white/40" />
                <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">{dayLabel}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 mb-1">
              <div>
                <h2 className="text-white text-2xl font-bold tracking-tight">
                  Day {currentDay.day}
                </h2>
                {!isRest && groups.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {groups.map(g => (
                      <span key={g} className="text-[10px] font-semibold text-white/50 bg-white/[0.06] px-2.5 py-1 rounded-full border border-white/[0.06]">
                        {g}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => dayNav(-1)}
                  disabled={activeDay === 0}
                  className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center disabled:opacity-20 hover:bg-white/[0.1] transition-colors"
                >
                  <ChevronLeft size={16} className="text-white/60" />
                </button>
                <button
                  onClick={() => dayNav(1)}
                  disabled={activeDay === plan.length - 1}
                  className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center disabled:opacity-20 hover:bg-white/[0.1] transition-colors"
                >
                  <ChevronRight size={16} className="text-white/60" />
                </button>
              </div>
            </div>

            {!isRest && currentDay.focus && (
              <p className="text-white/30 text-xs mt-1.5 mb-3 leading-relaxed">{currentDay.focus}</p>
            )}
          </div>

          <div className="px-5 pb-5">
            {isRest ? (
              <div className="flex flex-col items-center py-8">
                <div className="w-16 h-16 rounded-2xl bg-[rgba(28,28,30,0.8)] flex items-center justify-center mb-4 border border-white/[0.06]">
                  <Flame size={28} className="text-white/20" />
                </div>
                <h3 className="text-white/70 font-bold text-lg mb-1">Rest & Recovery</h3>
                <p className="text-white/30 text-xs">Take the day off — your muscles grow during rest</p>
                {currentDay.cooldown?.length > 0 && (
                  <div className="mt-5 w-full space-y-2">
                    {currentDay.cooldown.map((item, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-xs text-white/30 bg-white/[0.03] px-3.5 py-2.5 rounded-xl border border-white/[0.06]">
                        <div className="w-1 h-1 rounded-full bg-white/20" />
                        {item}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {currentDay.warmup?.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {currentDay.warmup.map((item, i) => (
                      <span key={i} className="text-[10px] text-white/30 bg-white/[0.03] px-2.5 py-1 rounded-full border border-white/[0.06]">{item}</span>
                    ))}
                  </div>
                )}

                <div className="space-y-1.5">
                  {dayExercises.map((ex, idx) => (
                    <div key={idx} className="group/item flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] flex items-center justify-center border border-white/[0.06] shrink-0">
                        <span className="text-[10px] font-bold text-white/30">{idx + 1}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold text-white/80">{ex.name}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-white/40 font-medium">{ex.sets} × {ex.reps}</span>
                          {ex.rest && (
                            <>
                              <span className="text-white/[0.08]">|</span>
                              <span className="text-[10px] text-white/30">{ex.rest}s</span>
                            </>
                          )}
                          {ex.muscleGroup && (
                            <>
                              <span className="text-white/[0.08]">|</span>
                              <span className="text-[10px] text-white/30">{ex.muscleGroup}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {currentDay.cooldown?.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/[0.06]">
                    <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-2.5">Cooldown</p>
                    <div className="flex flex-wrap gap-1.5">
                      {currentDay.cooldown.map((item, i) => (
                        <span key={i} className="text-[10px] text-white/30 bg-white/[0.03] px-2.5 py-1 rounded-full border border-white/[0.06]">{item}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {plan.map((day, idx) => {
          const dayTotal = (day.exercises || []).length;
          const doneCount = (day.exercises || []).filter(e => e.done).length;
          const allDone = dayTotal > 0 && doneCount === dayTotal;
          const d = new Date(day.dateKey + 'T00:00:00');
          const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          const shortDay = day.dayName?.slice(0, 3) || dayLabels[idx]?.slice(0, 3);
          return (
            <button
              key={idx}
              onClick={() => setActiveDay(idx)}
              className={`relative min-w-[52px] shrink-0 rounded-2xl p-3 transition-all ${
                activeDay === idx
                  ? 'bg-white/10 border border-white/[0.1]'
                  : 'bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06]'
              }`}
            >
              <div className="text-[9px] font-semibold text-center text-white/30">{shortDay}<br/>{dateStr}</div>
              <div className={`flex items-center justify-center gap-0.5 mt-1 text-[9px] font-medium ${activeDay === idx ? 'text-white/50' : 'text-white/20'}`}>
                {day.isRestDay ? (
                  <span>—</span>
                ) : allDone ? (
                  <span className="text-green-400 flex items-center gap-0.5">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {doneCount}
                  </span>
                ) : (
                  <span>{doneCount}/{dayTotal}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {!isRest && dayExercises.length > 0 && (
        <button
          onClick={() => setStarted(true)}
          className="relative group mt-4 w-full"
        >
          <div className="absolute -inset-[1px] bg-gradient-to-b from-white/[0.08] to-transparent rounded-[28px] pointer-events-none" />
          <div className="relative w-full py-4 rounded-[28px] bg-white text-black font-bold text-base flex items-center justify-center gap-2.5 active:scale-[0.98] transition-transform shadow-lg shadow-white/5">
            <Play size={18} className="fill-black" />
            Start Workout
          </div>
        </button>
      )}
    </div>
  );
}
