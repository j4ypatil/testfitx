import { useState } from 'react';
import { X, Check, History, Copy } from 'lucide-react';
import { getLastSession, getExerciseBests } from '../../utils/storage';

export default function SetLogModal({ exerciseName, setNumber, defaultWeight, defaultUnit, defaultReps, prevSet, onSave, onClose }) {
  const [weight, setWeight] = useState(defaultWeight || '');
  const [unit, setUnit] = useState(defaultUnit || 'kg');
  const [reps, setReps] = useState(defaultReps || '');
  const [saving, setSaving] = useState(false);

  const lastSession = getLastSession(exerciseName);
  const lastSet = lastSession?.sets?.find(s => s.set === setNumber);
  const bests = getExerciseBests(exerciseName);

  const handleSave = () => {
    if (!weight || !reps) return;
    setSaving(true);
    onSave(Number(weight), unit, Number(reps));
  };

  const usePrev = () => {
    if (!prevSet) return;
    setWeight(String(prevSet.weight));
    setUnit(prevSet.unit);
    setReps(String(prevSet.reps));
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-dark-card rounded-t-3xl p-5 pb-8 shadow-2xl animate-slideUp">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h3 className="text-foreground font-bold text-base">Set {setNumber}</h3>
            <p className="text-dark-muted text-xs mt-0.5">{exerciseName}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#2c2c2e] flex items-center justify-center">
            <X size={15} className="text-dark-muted" />
          </button>
        </div>

        {lastSet && (
          <div className="flex items-center gap-2 mt-3 bg-[#121212] rounded-xl px-3.5 py-2.5">
            <History size={14} className="text-accent shrink-0" />
            <span className="text-xs text-dark-muted">
              Last time: <span className="text-foreground font-semibold">{lastSet.weight} {lastSet.unit} × {lastSet.reps}</span>
            </span>
          </div>
        )}

        {prevSet && (
          <button onClick={usePrev} className="flex items-center gap-2 mt-2 bg-[#121212] rounded-xl px-3.5 py-2.5 w-full text-left">
            <Copy size={14} className="text-accent shrink-0" />
            <span className="text-xs text-dark-muted">
              Same as Set {prevSet.set}: <span className="text-foreground font-semibold">{prevSet.weight} {prevSet.unit} × {prevSet.reps}</span>
            </span>
          </button>
        )}

        <div className="mt-4 space-y-3">
          <div>
            <label className="text-xs font-medium text-dark-muted mb-1.5 block">Weight</label>
            <input
              type="number"
              value={weight}
              onChange={e => setWeight(e.target.value)}
              placeholder="0"
              className="w-full bg-[#121212] rounded-xl px-4 py-3 text-foreground text-lg font-bold text-center focus:outline-none focus:ring-1 focus:ring-accent"
              autoFocus
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setUnit('kg')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${unit === 'kg' ? 'bg-accent text-white' : 'bg-[#121212] text-dark-muted'}`}
            >
              KG
            </button>
            <button
              onClick={() => setUnit('lbs')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${unit === 'lbs' ? 'bg-accent text-white' : 'bg-[#121212] text-dark-muted'}`}
            >
              LBS
            </button>
          </div>

          <div>
            <label className="text-xs font-medium text-dark-muted mb-1.5 block">Reps</label>
            <input
              type="number"
              value={reps}
              onChange={e => setReps(e.target.value)}
              placeholder="0"
              className="w-full bg-[#121212] rounded-xl px-4 py-3 text-foreground text-lg font-bold text-center focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>

        {bests && (
          <div className="flex gap-2 mt-3">
            <div className="flex-1 bg-[#121212] rounded-xl px-3 py-2 text-center">
              <div className="text-xs text-dark-muted">Best Weight</div>
              <div className="text-sm font-bold text-accent">{bests.bestWeight} kg</div>
            </div>
            <div className="flex-1 bg-[#121212] rounded-xl px-3 py-2 text-center">
              <div className="text-xs text-dark-muted">Best Reps</div>
              <div className="text-sm font-bold text-accent">{bests.bestReps}</div>
            </div>
            <div className="flex-1 bg-[#121212] rounded-xl px-3 py-2 text-center">
              <div className="text-xs text-dark-muted">Best Volume</div>
              <div className="text-sm font-bold text-accent">{bests.bestVolume} kg</div>
            </div>
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={!weight || !reps || saving}
          className="w-full mt-4 py-3.5 rounded-xl bg-accent text-white font-semibold text-base flex items-center justify-center gap-2 disabled:opacity-30 transition-opacity"
        >
          {saving ? 'Saving...' : <><Check size={18} /> Save Set</>}
        </button>
      </div>
    </div>
  );
}
