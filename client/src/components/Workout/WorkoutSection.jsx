import { useState, useEffect, useRef } from 'react';
import { Camera, Upload, Dumbbell } from 'lucide-react';
import { getOnboarding, getWorkoutPlan, setWorkoutPlan, getExerciseHistory } from '../../utils/storage';
import { generatePlanByBodyType, getBodyTypeFocus } from '../../utils/workoutGenerator';
import WorkoutPlanner from './WorkoutPlanner.jsx';

function gatherHistory() {
  const history = getExerciseHistory() || {};
  const weights = {};
  for (const [name, data] of Object.entries(history)) {
    const sessions = data?.sessions || [];
    if (!sessions.length) continue;
    const last = sessions[sessions.length - 1];
    const lastSet = last?.sets?.[last.sets.length - 1];
    if (lastSet?.weight > 0) weights[name] = { weight: lastSet.weight, unit: lastSet.unit || 'kg', reps: lastSet.reps };
  }
  return { weights };
}

function adjustByFocus(plan, areas) {
  if (!areas?.length) return plan;
  return plan.map(day => {
    if (day.isRestDay) return day;
    const focus = day.exercises.filter(e => areas.includes(e.muscleGroup));
    const other = day.exercises.filter(e => !areas.includes(e.muscleGroup));
    return { ...day, exercises: [...focus, ...other] };
  });
}

export default function WorkoutSection() {
  const [ready, setReady] = useState(false);
  const [onboarding, setOnboarding] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [focusDesc, setFocusDesc] = useState('');
  const [needsPlan, setNeedsPlan] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    const ob = getOnboarding();
    if (ob) {
      setOnboarding(ob);
      setFocusDesc(getBodyTypeFocus(ob.gender, ob.bodyType).description);
    }
    const existing = getWorkoutPlan();
    const today = new Date().toISOString().split('T')[0];
    if (existing && Array.isArray(existing) && existing.some(d => d.dateKey === today)) {
      setReady(true);
    } else {
      setNeedsPlan(true);
      setReady(true);
    }
  }, []);

  const createPlan = (withPhoto = false) => {
    setGenerating(true);
    const plan = generatePlanByBodyType(onboarding, gatherHistory());
    setWorkoutPlan(plan);
    if (withPhoto && photoFile && onboarding) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result.split(',')[1];
        fetch('/api/analyze-photo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64, onboarding }),
        }).then(r => r.json()).then(data => {
          if (data.ok && data.focusAreas) setWorkoutPlan(adjustByFocus(plan, data.focusAreas));
        }).catch(() => {});
      };
      reader.readAsDataURL(photoFile);
    }
    setNeedsPlan(false);
    setGenerating(false);
  };

  if (!ready) {
    return (
      <div className="flex flex-col items-center justify-center pt-20 px-6">
        <div className="w-16 h-16 mb-6 rounded-full border-2 border-white/10 border-t-white/30 animate-spin" />
        <p className="text-white/80 font-semibold text-lg">Creating your plan...</p>
      </div>
    );
  }

  if (needsPlan) {
    return (
      <div className="pt-6 pb-4">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/[0.06]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 4h4l2-2h4l2 2h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" /><circle cx="12" cy="13" r="4" />
            </svg>
          </div>
          <h1 className="text-white/90 font-bold text-xl">Your Workout Plan</h1>
        </div>
        <div className="relative group mb-6">
          <div className="absolute -inset-[1px] bg-gradient-to-b from-white/[0.06] to-transparent rounded-[28px] pointer-events-none" />
          <div className="relative bg-[rgba(28,28,30,0.6)] backdrop-blur-xl rounded-[28px] border border-white/[0.06] p-6">
            <div className="mb-4">
              <div className="text-[10px] font-semibold text-white/40 tracking-widest uppercase mb-1">Your Goal</div>
              <h2 className="text-white/90 font-bold text-lg capitalize">{onboarding?.bodyType || 'Fitness'}</h2>
              <p className="text-white/40 text-sm mt-1 leading-relaxed">{focusDesc}</p>
            </div>
            {photoPreview ? (
              <div className="relative mb-4">
                <div className="absolute -inset-[1px] bg-gradient-to-b from-white/[0.06] to-transparent rounded-2xl pointer-events-none" />
                <div className="relative bg-black/40 rounded-2xl overflow-hidden">
                  <img src={photoPreview} alt="" className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#30d158]" />
                  <span className="text-[11px] text-white/80 font-semibold">Photo ready</span>
                </div>
              </div>
            ) : (
              <div onClick={() => fileRef.current?.click()} className="relative group cursor-pointer mb-4">
                <div className="absolute -inset-[1px] bg-gradient-to-b from-white/[0.04] to-transparent rounded-2xl pointer-events-none" />
                <div className="relative bg-[rgba(28,28,30,0.4)] rounded-2xl border border-dashed border-white/[0.1] hover:border-white/20 transition-colors py-8 flex flex-col items-center">
                  <Camera size={24} className="text-white/20 mb-2" />
                  <span className="text-sm text-white/30 font-medium">Upload a progress photo</span>
                  <span className="text-[10px] text-white/20 mt-1 px-8 text-center leading-relaxed">Helps us analyze your current physique to target the right areas</span>
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => {
                  const f = e.target.files?.[0];
                  if (f) { setPhotoFile(f); setPhotoPreview(URL.createObjectURL(f)); }
                }} />
              </div>
            )}
            <div className="space-y-2.5">
              <button onClick={() => createPlan(false)} disabled={generating} className="w-full py-3.5 rounded-2xl bg-white text-black font-semibold text-sm hover:bg-white/90 transition-all disabled:opacity-50">
                {generating ? 'Creating your plan...' : 'Create My Plan'}
              </button>
              <button onClick={() => photoFile && createPlan(true)} disabled={generating || !photoFile} className="w-full py-3 rounded-2xl border border-white/[0.1] text-white/50 font-medium text-xs hover:bg-white/[0.03] transition-colors disabled:opacity-30 flex items-center justify-center gap-1.5">
                <Upload size={12} /> Create Plan with Photo Analysis
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <WorkoutPlanner />;
}
