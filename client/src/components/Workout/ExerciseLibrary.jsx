import { useState, useEffect } from 'react';
import { X, ChevronDown, Dumbbell } from 'lucide-react';
import { fetchExerciseDetails, getExerciseImageUrl } from '../../utils/exerciseDetails';
import exercises, { muscleGroups } from '../../data/exercises';

export default function ExerciseLibrary({ onClose }) {
  const [selectedGroup, setSelectedGroup] = useState('Chest');
  const [details, setDetails] = useState({});
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const grp = exercises.filter(e => e.muscleGroup === selectedGroup);
    grp.forEach(ex => {
      if (!details[ex.name]) {
        fetchExerciseDetails(ex.name).then(data => {
          if (data.ok) setDetails(prev => ({ ...prev, [ex.name]: data }));
        });
      }
    });
  }, [selectedGroup]);

  const groupExercises = exercises.filter(e => e.muscleGroup === selectedGroup);

  return (
    <div className="fixed inset-0 z-50 bg-dark-bg">
      <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-[#2c2c2e]">
        <h2 className="text-foreground font-bold text-lg">Exercise Library</h2>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#2c2c2e] flex items-center justify-center">
          <X size={16} className="text-dark-muted" />
        </button>
      </div>

      <div className="flex gap-2 px-5 py-3 overflow-x-auto border-b border-[#2c2c2e]">
        {muscleGroups.map(group => (
          <button
            key={group}
            onClick={() => { setSelectedGroup(group); setExpanded(null); }}
            className={`shrink-0 px-3.5 py-2 rounded-full text-xs font-semibold transition-all ${
              selectedGroup === group ? 'bg-foreground text-white' : 'bg-dark-card text-dark-muted'
            }`}
          >
            {group === 'Core' ? 'Abs' : group}
          </button>
        ))}
      </div>

      <div className="overflow-y-auto px-5 pb-6 pt-3 space-y-2" style={{ height: 'calc(100vh - 110px)' }}>
        {groupExercises.map((ex, idx) => {
          const detail = details[ex.name];
          const open = expanded === idx;
          return (
            <div key={ex.id} className="bg-dark-card rounded-2xl overflow-hidden border border-[#2c2c2e]">
              <button
                onClick={() => setExpanded(open ? null : idx)}
                className="w-full flex items-center gap-3 p-3 text-left"
              >
                <div className="w-12 h-12 shrink-0 rounded-xl bg-[#121212] flex items-center justify-center overflow-hidden">
                  {detail?.id ? (
                    <img src={getExerciseImageUrl(detail.id)} alt={ex.name} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <Dumbbell size={18} className="text-dark-muted" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-foreground">{ex.name}</div>
                  <div className="text-[10px] text-dark-muted mt-0.5">
                    {ex.sets} × {ex.reps} · {ex.rest}s rest
                  </div>
                </div>
                <ChevronDown size={16} className={`text-dark-muted transition-transform ${open ? 'rotate-180' : ''}`} />
              </button>
              {open && (
                <div className="px-3 pb-3 pt-0 space-y-2">
                  {detail?.target && (
                    <div className="flex items-center gap-2 text-xs text-dark-muted">
                      <span className="font-medium text-foreground">Target:</span> {detail.target}
                    </div>
                  )}
                  {detail?.equipment && (
                    <div className="flex items-center gap-2 text-xs text-dark-muted">
                      <span className="font-medium text-foreground">Equipment:</span> {detail.equipment}
                    </div>
                  )}
                  {detail?.instructions?.length > 0 && (
                    <ol className="space-y-1 mt-1">
                      {detail.instructions.map((step, i) => (
                        <li key={i} className="text-xs text-dark-muted flex gap-2">
                          <span className="font-bold text-foreground shrink-0">{i + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
