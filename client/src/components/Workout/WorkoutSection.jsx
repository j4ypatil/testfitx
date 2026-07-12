import { useState, useEffect, useRef } from 'react';
import { Camera, Upload } from 'lucide-react';
import { getOnboarding, getWorkoutPlan, setWorkoutPlan, getExerciseHistory } from '../../utils/storage';
import { generatePlanByBodyType, getBodyTypeFocus } from '../../utils/workoutGenerator';
import WorkoutPlanner from './WorkoutPlanner.jsx';

export default function WorkoutSection() {
  const [ready, setReady] = useState(false);
  const [onboarding, setOnboardingState] = useState(null);
  const [showPhotoOpt, setShowPhotoOpt] = useState(false);
  const [photoPreview, setPhotoPreview] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [focusDesc, setFocusDesc] = useState('');
  const fileRef = useRef(null);

  useEffect(() => {
    const onb = getOnboarding();
    if (onb) {
      setOnboardingState(onb);
      const focus = getBodyTypeFocus(onb.gender, onb.bodyType);
      setFocusDesc(focus.description);
    }

    const existing = getWorkoutPlan();
    const todayKey = new Date().toISOString().split('T')[0];
    const coversToday = existing && Array.isArray(existing) && existing.some(d => d.dateKey === todayKey);
    if (coversToday) {
      setReady(true);
      return;
    }

    setShowPhotoOpt(true);
    setReady(true);
  }, []);

  const generatePlan = (withPhoto = false) => {
    setGenerating(true);

    // Gather historic data from last 7 days
    const historyData = gatherHistory();

    const plan = generatePlanByBodyType(onboarding, historyData);
    setWorkoutPlan(plan);

    // If photo uploaded, send to backend for analysis
    if (withPhoto && photoFile && onboarding) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result.split(',')[1];
        fetch('/api/analyze-photo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64, onboarding }),
        }).then(r => r.json()).then(data => {
          if (data.ok && data.focusAreas) {
            // Adjust plan based on analysis
            const adjusted = adjustPlanByFocus(plan, data.focusAreas);
            setWorkoutPlan(adjusted);
          }
        }).catch(() => {});
      };
      reader.readAsDataURL(photoFile);
    }

    setShowPhotoOpt(false);
    setGenerating(false);
  };

  const skipPhoto = () => {
    generatePlan(false);
  };

  if (showPhotoOpt) {
    return (
      <div className="pt-6 pb-4">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/[0.06]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 4h4l2-2h4l2 2h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
              <circle cx="12" cy="13" r="4" />
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
                  <img src={photoPreview} alt="Progress" className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#30d158]" />
                  <span className="text-[11px] text-white/80 font-semibold">Photo ready</span>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileRef.current?.click()}
                className="relative group cursor-pointer mb-4"
              >
                <div className="absolute -inset-[1px] bg-gradient-to-b from-white/[0.04] to-transparent rounded-2xl pointer-events-none" />
                <div className="relative bg-[rgba(28,28,30,0.4)] rounded-2xl border border-dashed border-white/[0.1] hover:border-white/20 transition-colors py-8 flex flex-col items-center">
                  <Camera size={24} className="text-white/20 mb-2" />
                  <span className="text-sm text-white/30 font-medium">Upload a progress photo</span>
                  <span className="text-[10px] text-white/20 mt-1 px-8 text-center leading-relaxed">This helps a lot in creating your plan — we analyze your current physique to target the right areas</span>
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) { setPhotoFile(f); setPhotoPreview(URL.createObjectURL(f)); }
                }} />
              </div>
            )}

            <div className="space-y-2.5">
              <button
                onClick={skipPhoto}
                disabled={generating}
                className="w-full py-3.5 rounded-2xl bg-white text-black font-semibold text-sm hover:bg-white/90 transition-all disabled:opacity-50"
              >
                {generating ? 'Creating your plan...' : 'Create My Plan'}
              </button>
              <button
                onClick={() => { if (photoFile) generatePlan(true); }}
                disabled={generating || !photoFile}
                className="w-full py-3 rounded-2xl border border-white/[0.1] text-white/50 font-medium text-xs hover:bg-white/[0.03] transition-colors disabled:opacity-30 flex items-center justify-center gap-1.5"
              >
                <Upload size={12} />
                Create Plan with Photo Analysis
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="flex flex-col items-center justify-center pt-20 px-6">
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 rounded-full border-2 border-white/10" />
          <div className="absolute inset-0 rounded-full border-2 border-white/30 border-t-transparent animate-spin" />
        </div>
        <p className="text-white/80 font-semibold text-lg mb-2">Creating your plan...</p>
        <p className="text-white/30 text-sm">{focusDesc}</p>
      </div>
    );
  }

  return <WorkoutPlanner />;
}

function gatherHistory() {
  const history = getExerciseHistory();
  const weights = {};

  // Get last logged weight per exercise
  for (const [exName, data] of Object.entries(history || {})) {
    const sessions = data?.sessions || [];
    if (sessions.length === 0) continue;
    const last = sessions[sessions.length - 1];
    const lastSet = last?.sets?.[last.sets.length - 1];
    if (lastSet?.weight > 0) {
      weights[exName] = { weight: lastSet.weight, unit: lastSet.unit || 'kg', reps: lastSet.reps };
    }
  }

  return { weights };
}

function adjustPlanByFocus(plan, focusAreas) {
  // If AI analysis returns focus areas, prioritize those muscle groups
  if (!focusAreas || focusAreas.length === 0) return plan;
  return plan.map(day => {
    if (day.isRestDay) return day;
    const exInFocus = day.exercises.filter(e => focusAreas.includes(e.muscleGroup));
    const exOthers = day.exercises.filter(e => !focusAreas.includes(e.muscleGroup));
    return { ...day, exercises: [...exInFocus, ...exOthers] };
  });
}
