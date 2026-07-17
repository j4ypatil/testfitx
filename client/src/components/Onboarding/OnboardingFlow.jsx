import { useState, useEffect } from 'react';
import { Camera, X } from 'lucide-react';
import { setOnboarding } from '../../utils/storage.js';
import { calculateBMR, calculateTDEE, adjustCalories } from '../../utils/tdee.js';
import { calculateMacros } from '../../utils/macros.js';
import QuestionScreen from './QuestionScreen.jsx';
import CardOptions from './CardOptions.jsx';
import TextInput from './TextInput.jsx';

const bodyTypes = {
  male: [
    { value: 'athlete', label: 'Athlete', icon: '/images/body-types/athlete.png', sub: 'Shredded, lean, athletic build — low body fat, visible definition' },
    { value: 'vtaper', label: 'V Taper', icon: '/images/body-types/vtaper.png', sub: 'Broad shoulders, narrow waist — classic V-shape physique' },
    { value: 'bulky', label: 'Bulky', icon: '/images/body-types/bulky.png', sub: 'Big, dense frame — mass and strength focused' },
  ],
  female: [
    { value: 'cat', label: 'Cat / Panther', icon: '/images/body-types/cat.svg', sub: 'Slim with curves, "snatched" waist' },
    { value: 'butterfly', label: 'Butterfly', icon: '/images/body-types/butterfly.svg', sub: 'Soft, flexible, yoga / pilates body' },
    { value: 'swan', label: 'Swan', icon: '/images/body-types/swan.svg', sub: 'Long, lean, graceful — dancer physique' },
    { value: 'tigress', label: 'Tigress', icon: '/images/body-types/tigress.svg', sub: 'Strong curves, glutes-focused, athletic-feminine' },
  ],
};

const questions = [
  {
    id: 'name',
    question: "What's your name?",
    subtitle: "Let's get started with FitCal",
    type: 'text',
    placeholder: 'Enter your name',
  },
  {
    id: 'age',
    question: 'How old are you?',
    subtitle: 'We use this to personalise your plan',
    type: 'number',
    placeholder: 'Enter your age',
    suffix: 'years',
  },
  {
    id: 'gender',
    question: "What's your gender?",
    type: 'options',
    options: [
      { value: 'male', label: 'Male', icon: '♂️' },
      { value: 'female', label: 'Female', icon: '♀️' },
    ],
  },
  {
    id: 'bodyType',
    question: "What body type do you want?",
    subtitle: "This helps us shape the right plan for you",
    type: 'dynamic_options',
    dependsOn: 'gender',
  },
  {
    id: 'currentWeight',
    question: "What's your current weight?",
    subtitle: 'We need this to track your progress',
    type: 'number',
    placeholder: 'Enter your weight',
    suffix: 'kg',
  },
  {
    id: 'goalWeight',
    question: "What's your goal weight?",
    subtitle: 'Where do you want to be?',
    type: 'number',
    placeholder: 'Enter your goal weight',
    suffix: 'kg',
  },
  {
    id: 'height',
    question: "What's your height?",
    subtitle: 'We\'ll use this to personalise your plan',
    type: 'height_ft_in',
  },
  {
    id: 'activityLevel',
    question: 'How active are you?',
    subtitle: 'This affects your daily calorie needs',
    type: 'options',
    options: [
      { value: 'sedentary', label: 'Sedentary', icon: '🛋️', sub: 'Desk job, little exercise' },
      { value: 'lightly_active', label: 'Lightly Active', icon: '🚶', sub: '1-3 days/week' },
      { value: 'moderately_active', label: 'Moderately Active', icon: '🏃', sub: '3-5 days/week' },
      { value: 'very_active', label: 'Very Active', icon: '🔥', sub: '6-7 days/week' },
    ],
  },
  {
    id: 'injuries',
    question: 'Any injuries we should know about?',
    subtitle: 'We\'ll avoid exercises that might aggravate them',
    type: 'options',
    options: [
      { value: 'none', label: 'No injuries', icon: '✅', sub: 'Skip this' },
      { value: 'lower_back', label: 'Lower Back', icon: '🔙', sub: 'Back pain or issues' },
      { value: 'knee', label: 'Knee', icon: '🦵', sub: 'Knee pain or injury' },
      { value: 'shoulder', label: 'Shoulder', icon: '💪', sub: 'Shoulder issues' },
      { value: 'neck', label: 'Neck', icon: '🧣', sub: 'Neck strain' },
    ],
  },
  {
    id: 'goalType',
    question: "What's your goal?",
    type: 'options',
    options: [
      { value: 'lose_fat', label: 'Lose Fat', icon: '🔥', sub: 'Calorie deficit focus' },
      { value: 'build_muscle', label: 'Build Muscle', icon: '💪', sub: 'Calorie surplus focus' },
      { value: 'maintain', label: 'Maintain', icon: '🎯', sub: 'Keep your current physique' },
      { value: 'body_recomp', label: 'Body Recomp', icon: '⚡', sub: 'Build muscle while losing fat' },
    ],
  },
  {
    id: 'timeline',
    question: 'By when do you want to reach your goal?',
    subtitle: 'This helps us set the right pace for you',
    type: 'options',
    options: [
      { value: '1month', label: '1 Month', icon: '🚀', sub: 'Aggressive pace' },
      { value: '3months', label: '3 Months', icon: '🎯', sub: 'Balanced pace' },
      { value: '6months', label: '6 Months', icon: '🧘', sub: 'Gentle pace' },
    ],
  },
  {
    id: 'dietPref',
    question: 'Do you follow a specific diet?',
    type: 'options',
    options: [
      { value: 'non_veg', label: 'Non-Veg', icon: '🥩', sub: 'No dietary restrictions' },
      { value: 'vegetarian', label: 'Vegetarian', icon: '🥗', sub: 'No meat' },
      { value: 'vegan', label: 'Vegan', icon: '🌱', sub: 'No animal products' },
    ],
  },
  {
    id: 'summary',
    question: 'Your daily targets',
    subtitle: 'Based on your info — tap to adjust',
    type: 'summary',
  },
  {
    id: 'gymType',
    question: 'What equipment do you have?',
    subtitle: 'We\'ll tailor exercises to what\'s available',
    type: 'options',
    options: [
      { value: 'well_equipped', label: 'Well Equipped Gym', icon: '🏋️', sub: 'Full racks, cables, machines' },
      { value: 'moderate', label: 'Moderate Gym', icon: '🏋️‍♂️', sub: 'Basic free weights & machines' },
      { value: 'home', label: 'Home Workout', icon: '🏠', sub: 'Minimal or bodyweight only' },
    ],
  },
  {
    id: 'gymExp',
    question: 'How long have you been training?',
    subtitle: 'This helps us set the right intensity',
    type: 'options',
    options: [
      { value: 'beginner', label: 'Just Started', icon: '🌱', sub: 'New to fitness or <3 months' },
      { value: 'intermediate', label: 'Intermediate', icon: '📈', sub: '6+ months consistent training' },
      { value: 'advanced', label: 'Advanced', icon: '💎', sub: '1+ year of dedicated training' },
    ],
  },
  {
    id: 'photo',
    question: 'Upload a progress photo',
    subtitle: 'Optional — helps track your transformation',
    type: 'photo',
  },
];

export default function OnboardingFlow({ onComplete }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({});
  const [editCalories, setEditCalories] = useState('');
  const [editProtein, setEditProtein] = useState('');
  const [editCarbs, setEditCarbs] = useState('');
  const [editFat, setEditFat] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');

  const current = questions[step];
  const value = data[current?.id];

  useEffect(() => {
    if (questions[step]?.type === 'summary') {
      setEditCalories('');
      setEditProtein('');
      setEditCarbs('');
      setEditFat('');
    }
  }, [step]);

  const getOptions = () => {
    if (current.type === 'dynamic_options') {
      const gender = data[current.dependsOn];
      return bodyTypes[gender] || [];
    }
    return current.options || [];
  };

  const bodyTypeAdjust = {
    athlete: { cal: 0.95, protein: 1.10, carbs: 0.95, fat: 0.90 },
    vtaper: { cal: 1.00, protein: 1.10, carbs: 1.00, fat: 0.95 },
    bulky: { cal: 1.10, protein: 1.05, carbs: 1.10, fat: 1.05 },
    cat: { cal: 0.95, protein: 1.0, carbs: 0.95, fat: 0.95 },
    butterfly: { cal: 1.0, protein: 0.95, carbs: 1.0, fat: 1.0 },
    swan: { cal: 0.95, protein: 1.0, carbs: 0.90, fat: 0.95 },
    tigress: { cal: 1.0, protein: 1.10, carbs: 0.95, fat: 1.0 },
  };

  const computeTargets = (d) => {
    const totalInches = Number(d.heightFeet || 0) * 12 + Number(d.heightInches || 0);
    const heightCm = totalInches * 2.54;
    const bmr = calculateBMR(Number(d.currentWeight), heightCm, Number(d.age), d.gender);
    const tdee = calculateTDEE(bmr, d.activityLevel);
    const baseCals = adjustCalories(tdee, d.goalType || 'maintain', d.timeline || '3months');
    const adj = bodyTypeAdjust[d.bodyType] || { cal: 1.0, protein: 1.0, carbs: 1.0, fat: 1.0 };
    const cals = Math.round(baseCals * adj.cal);
    const baseMac = calculateMacros(baseCals, d.goalType || 'maintain');
    const macros = {
      protein: Math.round(baseMac.protein * adj.protein),
      carbs: Math.round(baseMac.carbs * adj.carbs),
      fat: Math.round(baseMac.fat * adj.fat),
    };
    return { dailyCalories: cals, macros };
  };

  const canContinue = () => {
    if (!current) return false;
    if (current.type === 'text') return value && value.trim().length > 0;
    if (current.type === 'number') return value !== undefined && value !== '' && Number(value) > 0;
    if (current.type === 'height_ft_in') return data.heightFeet !== undefined && data.heightFeet !== '' && data.heightInches !== undefined && data.heightInches !== '';
    if (current.type === 'options' || current.type === 'dynamic_options') return value !== undefined;
    if (current.type === 'summary') return true;
    if (current.type === 'photo') return true;
    return false;
  };

  const handleSelect = (val) => {
    if (current.type === 'dynamic_options' || current.type === 'options') {
      setData(prev => ({ ...prev, [current.id]: val }));
    }
  };

  const handleChange = (val) => {
    setData(prev => ({ ...prev, [current.id]: val }));
  };

  const handleNext = () => {
    if (!canContinue()) return;
    if (current.id === 'summary') {
      const targets = computeTargets(data);
      setData(prev => ({
        ...prev,
        dailyCalories: Number(editCalories) || targets.dailyCalories,
        macros: {
          protein: Number(editProtein) || targets.macros.protein,
          carbs: Number(editCarbs) || targets.macros.carbs,
          fat: Number(editFat) || targets.macros.fat,
        },
      }));
    }
    if (current.id === 'photo' && photoPreview) {
      setData(prev => ({ ...prev, photo: photoPreview }));
    }
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      const targets = computeTargets(data);
      const totalInches = Number(data.heightFeet || 0) * 12 + Number(data.heightInches || 0);
      const heightCm = Math.round(totalInches * 2.54 * 10) / 10;
      const finalData = {
        ...data,
        currentWeight: Number(data.currentWeight),
        goalWeight: Number(data.goalWeight),
        height: heightCm,
        age: Number(data.age),
        dailyCalories: data.dailyCalories || targets.dailyCalories,
        macros: data.macros || targets.macros,
      };
      if (photoPreview) finalData.photo = photoPreview;
      
      // Log the initial weight
      import('../../utils/storage.js').then(({ setWeight, getDateKey }) => {
        setWeight(getDateKey(new Date()), finalData.currentWeight);
      });
      
      setOnboarding(finalData);
      onComplete(finalData);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handlePhotoCapture = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => setPhotoPreview(ev.target.result);
      reader.readAsDataURL(file);
    };
    input.click();
  };

  if (current?.type === 'summary') {
    const targets = computeTargets(data);
    const cals = editCalories || targets.dailyCalories;
    const p = editProtein || targets.macros.protein;
    const c = editCarbs || targets.macros.carbs;
    const f = editFat || targets.macros.fat;

    return (
      <div className="min-h-screen bg-dark-bg flex flex-col">
        <div className="flex-1 px-6 pt-6 pb-4 flex flex-col">
          <div className="mb-6">
            <button onClick={handleBack} className="w-10 h-10 rounded-full bg-dark-card border border-dark-border flex items-center justify-center mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f5f5f7" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
          </div>
          <div className="flex-1 flex flex-col">
            <h1 className="text-[40px] leading-[1.1] font-bold text-foreground mb-2">Your daily targets</h1>
            <p className="text-dark-muted text-base mb-8">Based on your info — tap to adjust</p>

            <div className="bg-dark-card border border-dark-border rounded-3xl p-6 mb-6">
              <div className="text-center mb-5">
                <div className="text-xs text-dark-muted uppercase tracking-wider mb-1">Daily Calories</div>
                <input
                  type="number"
                  value={cals}
                  onChange={(e) => setEditCalories(e.target.value)}
                  className="bg-transparent text-5xl font-bold text-foreground text-center w-full outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <div className="text-dark-muted text-sm">kcal</div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Protein', value: p, set: setEditProtein, color: 'text-[#ff4d4d]', bg: 'bg-[#ff4d4d]/10' },
                  { label: 'Carbs', value: c, set: setEditCarbs, color: 'text-[#ff9f0a]', bg: 'bg-[#ff9f0a]/10' },
                  { label: 'Fat', value: f, set: setEditFat, color: 'text-[#0a84ff]', bg: 'bg-[#0a84ff]/10' },
                ].map((item) => (
                  <div key={item.label} className={`${item.bg} rounded-2xl p-3 text-center`}>
                    <input
                      type="number"
                      value={item.value}
                      onChange={(e) => item.set(e.target.value)}
                      className={`bg-transparent ${item.color} text-lg font-bold text-center w-full outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                    />
                    <div className="text-xs text-dark-muted mt-0.5">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-xs text-dark-muted text-center">
              Your BMR is {calculateBMR(Number(data.currentWeight), (Number(data.heightFeet || 0) * 12 + Number(data.heightInches || 0)) * 2.54, Number(data.age), data.gender)} kcal/day
            </div>
          </div>
        </div>
        <div className="px-6 pb-10 pt-4">
          <button onClick={handleNext} className="w-full py-4 rounded-2xl bg-accent text-white font-bold text-base">
            Looks Good, Continue
          </button>
        </div>
      </div>
    );
  }

  if (current?.type === 'photo') {
    return (
      <div className="min-h-screen bg-dark-bg flex flex-col">
        <div className="flex-1 px-6 pt-6 pb-4 flex flex-col">
          <div className="mb-6">
            <button onClick={handleBack} className="w-10 h-10 rounded-full bg-dark-card border border-dark-border flex items-center justify-center mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f5f5f7" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <h1 className="text-[40px] leading-[1.1] font-bold text-foreground mb-2 text-center">Upload a progress photo</h1>
            <p className="text-dark-muted text-base mb-8 text-center">Optional — helps track your transformation</p>

            {photoPreview ? (
              <div className="relative w-64 h-64 rounded-3xl overflow-hidden mb-6">
                <img src={photoPreview} alt="Progress" className="w-full h-full object-cover" />
                <button onClick={() => setPhotoPreview('')} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center">
                  <X size={16} className="text-white" />
                </button>
              </div>
            ) : (
              <button onClick={handlePhotoCapture} className="w-64 h-64 rounded-3xl border-2 border-dashed border-dark-border bg-dark-card flex flex-col items-center justify-center gap-3 mb-6">
                <Camera size={40} className="text-dark-muted" />
                <span className="text-dark-muted text-sm font-medium">Tap to upload</span>
              </button>
            )}

            <div className="flex gap-3 w-full max-w-xs">
              {!photoPreview && (
                <button onClick={handleNext} className="flex-1 py-3.5 rounded-2xl bg-dark-card border border-dark-border text-foreground font-semibold text-sm">
                  Skip
                </button>
              )}
              <button onClick={handleNext} className="flex-1 py-3.5 rounded-2xl bg-accent text-white font-semibold text-sm">
                {photoPreview ? 'Save & Finish' : 'Continue Anyway'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <QuestionScreen
      question={current.question}
      subtitle={current.subtitle}
      currentStep={step + 1}
      totalSteps={questions.length}
      onBack={handleBack}
      canContinue={canContinue()}
      onContinue={handleNext}
      showBack={step > 0}
    >
      {current.type === 'text' && (
        <TextInput value={value || ''} onChange={handleChange} placeholder={current.placeholder} />
      )}
      {current.type === 'number' && (
        <TextInput
          value={value || ''}
          onChange={handleChange}
          placeholder={current.placeholder}
          type="number"
          suffix={current.suffix}
        />
      )}
      {current.type === 'height_ft_in' && (
        <div className="bg-dark-card border border-dark-border rounded-2xl p-4">
          <div className="flex gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 bg-dark-bg border border-dark-border rounded-xl px-3 py-3 focus-within:border-accent transition-colors">
                <input
                  type="number"
                  value={data.heightFeet || ''}
                  onChange={(e) => setData(prev => ({ ...prev, heightFeet: e.target.value }))}
                  placeholder="0"
                  className="w-full bg-transparent text-foreground text-lg font-semibold outline-none placeholder:text-dark-muted/50"
                  autoFocus
                />
                <span className="text-dark-muted font-medium text-sm whitespace-nowrap">ft</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 bg-dark-bg border border-dark-border rounded-xl px-3 py-3 focus-within:border-accent transition-colors">
                <input
                  type="number"
                  value={data.heightInches || ''}
                  onChange={(e) => setData(prev => ({ ...prev, heightInches: e.target.value }))}
                  placeholder="0"
                  className="w-full bg-transparent text-foreground text-lg font-semibold outline-none placeholder:text-dark-muted/50"
                />
                <span className="text-dark-muted font-medium text-sm whitespace-nowrap">in</span>
              </div>
            </div>
          </div>
        </div>
      )}
      {(current.type === 'options' || current.type === 'dynamic_options') && (
        <CardOptions
          options={getOptions()}
          selected={value}
          onSelect={handleSelect}
          layout={current.id === 'bodyType' ? 'card' : current.layout}
        />
      )}
    </QuestionScreen>
  );
}
