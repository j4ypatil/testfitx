import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Check, Clock, Dumbbell, Plus, CheckCircle } from 'lucide-react';
import { fetchExerciseDetails, getExerciseImageUrl } from '../../utils/exerciseDetails';
import { logExerciseSet, getLastSession, getExerciseBests, clearWorkoutLog } from '../../utils/storage';
import SetLogModal from './SetLogModal';

function RestTimer({ exerciseName, onNext }) {
  const [timer, setTimer] = useState(45);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) { clearInterval(intervalRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (timer === 0) onNext();
  }, [timer]);

  return (
    <div className="fixed inset-0 z-40 bg-[#121212] flex flex-col items-center justify-center px-6">
      <div className="w-24 h-24 rounded-full border-4 border-accent/30 flex items-center justify-center mb-6">
        <span className="text-4xl font-bold text-foreground">{timer}</span>
      </div>
      <h2 className="text-foreground text-lg font-bold mb-1">Rest</h2>
      <p className="text-dark-muted text-sm mb-8">{exerciseName}</p>
      <div className="flex gap-3 w-full max-w-[280px]">
        <button onClick={() => setTimer(t => t + 20)} className="flex-1 py-3.5 rounded-xl border border-accent text-accent font-semibold text-sm flex items-center justify-center gap-1.5">
          <Plus size={16} /> 20s
        </button>
        <button onClick={onNext} className="flex-1 py-3.5 rounded-xl bg-accent text-white font-semibold text-sm flex items-center justify-center gap-1.5">
          Skip <ChevronLeft size={16} className="rotate-180" />
        </button>
      </div>
    </div>
  );
}

export default function WorkoutExecution({ exercises, onBack, onFinish }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [setLogs, setSetLogs] = useState({});
  const [showModal, setShowModal] = useState(null);
  const [showRest, setShowRest] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [sessionVolume, setSessionVolume] = useState(0);

  const exercise = exercises[currentIdx];
  const total = exercises.length;
  const progress = ((currentIdx + 1) / total) * 100;
  const exKey = `ex_${currentIdx}`;
  const log = setLogs[exKey] || [];

  const lastSession = getLastSession(exercise?.name);
  const bests = getExerciseBests(exercise?.name);

  useEffect(() => {
    if (!exercise) return;
    setLoading(true);
    setDetail(null);
    fetchExerciseDetails(exercise.name).then((data) => {
      setDetail(data);
      setLoading(false);
    });
    const saved = localStorage.getItem('fitx_workout_exec_logs');
    if (saved) {
      try { setSetLogs(JSON.parse(saved)); } catch {}
    }
    setShowRest(false);
    setCompleted(false);
    setSessionVolume(0);
  }, [currentIdx]);

  useEffect(() => {
    localStorage.setItem('fitx_workout_exec_logs', JSON.stringify(setLogs));
    const allDone = log.length > 0 && log.every(s => s.done);
    setCompleted(allDone);
    if (allDone) {
      setSessionVolume(log.reduce((sum, s) => sum + s.weight * s.reps, 0));
    }
  }, [setLogs]);

  const handleSaveSet = (setNumber, weight, unit, reps) => {
    logExerciseSet(exercise.name, setNumber, weight, unit, reps);
    setSetLogs(prev => {
      const key = exKey;
      const sets = [...(prev[key] || log)];
      sets[setNumber - 1] = { set: setNumber, weight, unit, reps, done: true };
      return { ...prev, [key]: sets };
    });
    setShowModal(null);
  };

  const addSet = () => {
    setSetLogs(prev => {
      const key = exKey;
      const sets = [...(prev[key] || log)];
      const nextNum = sets.length + 1;
      sets.push({ set: nextNum, weight: 0, unit: 'kg', reps: 0, done: false });
      return { ...prev, [key]: sets };
    });
  };

  const handleNextExercise = () => {
    setShowRest(false);
    if (currentIdx < total - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      clearWorkoutLog();
      localStorage.removeItem('fitx_workout_exec_logs');
      if (onFinish) onFinish();
    }
  };

  const repRaw = exercise?.reps || '12';
  const largeRep = repRaw.match(/^(\d+)/);
  const repDisplay = largeRep ? largeRep[1] : '12';

  if (!exercise) return null;

  if (showRest) {
    return <RestTimer exerciseName={exercise.name} onNext={handleNextExercise} />;
  }

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col">
      <div className="sticky top-0 bg-[#121212] z-10">
        <div className="flex items-center justify-between px-4 pt-3 pb-1">
          <button onClick={onBack} className="w-9 h-9 rounded-full border border-[#2c2c2e] bg-dark-card flex items-center justify-center">
            <ChevronLeft size={16} className="text-foreground" />
          </button>
          <span className="text-xs font-semibold text-dark-muted tracking-wider">Exercise {currentIdx + 1} of {total}</span>
          <div className="w-9" />
        </div>
        <div className="h-1 bg-[#2c2c2e] mx-4 rounded-full overflow-hidden">
          <div className="h-full bg-accent rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="mx-auto w-full max-w-[260px] aspect-square mt-1">
          {loading ? (
            <div className="w-full h-full rounded-2xl bg-dark-card animate-pulse" />
          ) : detail?.ok && detail.id ? (
            <img src={getExerciseImageUrl(detail.id)} alt={exercise.name} className="w-full h-full rounded-2xl bg-dark-card object-cover" />
          ) : (
            <div className="w-full h-full rounded-2xl bg-dark-card flex items-center justify-center">
              <Dumbbell size={32} className="text-dark-muted/30" />
            </div>
          )}
        </div>

        <div className="mt-3 mb-2">
          <h2 className="text-foreground text-lg font-bold">{exercise.name}</h2>
          <div className="flex items-center gap-2 mt-0.5">
            {detail?.ok && detail.target && <span className="text-xs text-dark-muted">{detail.target}</span>}
            {detail?.ok && detail.equipment && <span className="text-xs text-dark-muted">· {detail.equipment}</span>}
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-sm font-semibold text-accent">{repDisplay} Reps</span>
          </div>
        </div>

        {completed && (
          <div className="bg-dark-card rounded-2xl p-4 shadow-sm mb-3 text-center">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-2">
              <CheckCircle size={22} className="text-green-500" />
            </div>
            <h3 className="text-foreground font-bold mb-1">Exercise Complete</h3>
            <div className="space-y-0.5 bg-[#121212] rounded-xl p-3 mb-3 text-left">
              {log.filter(s => s.done).map((s, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-dark-muted">Set {s.set}</span>
                  <span className="text-foreground font-semibold">{s.weight} {s.unit} × {s.reps}</span>
                </div>
              ))}
              <div className="border-t border-[#2c2c2e] pt-1 mt-1 flex items-center justify-between">
                <span className="text-dark-muted text-xs">Volume</span>
                <span className="text-accent font-bold">{sessionVolume} kg</span>
              </div>
            </div>
            <button
              onClick={() => setShowRest(true)}
              className="w-full py-3 rounded-xl bg-accent text-white font-semibold text-sm flex items-center justify-center gap-2"
            >
              Rest {currentIdx < total - 1 ? '& Continue' : '& Finish'}
            </button>
          </div>
        )}

        {lastSession && !completed && (
          <div className="bg-dark-card rounded-xl p-3 mb-3">
            <div className="text-[10px] font-semibold text-dark-muted uppercase tracking-wider mb-1.5">Previous Workout</div>
            {lastSession.sets.filter(s => s.weight > 0).map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-dark-muted py-0.5">
                <span className="w-8 font-medium text-foreground">Set {s.set}</span>
                <span>{s.weight}{s.unit} × {s.reps}</span>
              </div>
            ))}
          </div>
        )}

        {!completed && (
          <div>
            <div className="text-xs font-semibold text-dark-muted uppercase tracking-wider mb-2.5">Sets</div>
            <div className="space-y-2">
              {log.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (s.done) return;
                    setShowModal({ exKey, set: s.set, weight: s.weight > 0 ? String(s.weight) : '', unit: s.unit, reps: s.reps > 0 ? String(s.reps) : '' });
                  }}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
                    s.done ? 'border-green-500/30 bg-green-500/10' : 'border-[#2c2c2e] bg-dark-card'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                    s.done ? 'bg-green-500 text-white' : 'bg-[#121212] text-dark-muted'
                  }`}>
                    {s.done ? <Check size={16} /> : s.set}
                  </div>
                  <div className="flex-1 text-left">
                    <span className={`text-sm font-semibold ${s.done ? 'text-green-400' : 'text-foreground'}`}>
                      {s.done ? `${s.weight} ${s.unit} × ${s.reps}` : `Set ${s.set}`}
                    </span>
                    {!s.done && <span className="text-xs text-dark-muted ml-2">Tap to log</span>}
                  </div>
                  {s.done && <Check size={18} className="text-green-500" />}
                </button>
              ))}
            </div>
            <button
              onClick={addSet}
              className="w-full mt-2 py-3 rounded-xl border border-dashed border-[#2c2c2e] text-dark-muted text-sm font-medium flex items-center justify-center gap-1.5 hover:bg-white/[0.02] transition-colors"
            >
              <Plus size={14} />
              Add Set
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <SetLogModal
          exerciseName={exercise.name}
          setNumber={showModal.set}
          defaultWeight={showModal.weight}
          defaultUnit={showModal.unit}
          defaultReps={showModal.reps}
          prevSet={showModal.set > 1 ? log.find(s => s.set === showModal.set - 1) : null}
          onSave={(w, u, r) => handleSaveSet(showModal.set, w, u, r)}
          onClose={() => setShowModal(null)}
        />
      )}
    </div>
  );
}
