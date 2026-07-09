import { useState, useEffect } from 'react';
import { User, Save } from 'lucide-react';
import { setOnboarding, getWeight, setWeight, getDateKey, getAllWeights } from '../../utils/storage.js';
import { calculateBMR, calculateTDEE, adjustCalories } from '../../utils/tdee.js';
import { calculateMacros } from '../../utils/macros.js';
import WeightChart from './WeightChart.jsx';
import BMICalculator from './BMICalculator.jsx';
import MacroCards from '../Home/MacroCards.jsx';
import CaloriesCard from '../Home/CaloriesCard.jsx';

const labels = {
  lose_fat: 'Lose Fat',
  build_muscle: 'Build Muscle',
  maintain: 'Maintain',
  body_recomp: 'Body Recomp',
};
const activityLabels = {
  sedentary: 'Sedentary',
  lightly_active: 'Lightly Active',
  moderately_active: 'Moderately Active',
  very_active: 'Very Active',
};
const dietLabels = { non_veg: 'Non-Veg', vegetarian: 'Vegetarian', vegan: 'Vegan' };
const expLabels = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' };
const genderLabels = { male: 'Male', female: 'Female', other: 'Other' };

export default function ProfilePage({ onboarding, setOnboarding: setParentOnboarding }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...onboarding });
  const [weightInput, setWeightInput] = useState('');
  const [weights, setWeights] = useState([]);
  const [saved, setSaved] = useState(false);

  const dateKey = getDateKey(new Date());
  const todayWeight = getWeight(dateKey);

  useEffect(() => {
    setWeights(getAllWeights());
  }, []);

  const handleSaveProfile = () => {
    const bmr = calculateBMR(Number(form.currentWeight), Number(form.height), Number(form.age), form.gender);
    const tdee = calculateTDEE(bmr, form.activityLevel);
    const dailyCalories = adjustCalories(tdee, form.goalType, form.timeline || '3months');
    const macros = calculateMacros(dailyCalories, form.goalType);

    const updated = {
      ...form,
      currentWeight: Number(form.currentWeight),
      goalWeight: Number(form.goalWeight),
      height: Number(form.height),
      age: Number(form.age),
      daysPerWeek: Number(form.daysPerWeek),
      tdee,
      dailyCalories,
      macros,
    };

    setOnboarding(updated);
    setParentOnboarding(updated);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogWeight = () => {
    const w = Number(weightInput);
    if (!w || w <= 0) return;
    setWeight(dateKey, w);
    setWeightInput('');
    setWeights(getAllWeights());
  };

  const inputClass = "w-full bg-dark-card border border-dark-border rounded-xl px-4 py-2.5 text-foreground text-sm outline-none focus:border-accent transition-colors";

  return (
    <div className="pt-6 pb-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <h1 className="text-foreground font-bold text-xl">Profile</h1>
        </div>
        <button
          onClick={editing ? handleSaveProfile : () => setEditing(true)}
          className={`flex items-center gap-1.5 text-xs font-medium rounded-full px-3.5 py-2 transition-all
            ${saved
              ? 'bg-accent/10 text-accent border border-accent/20'
              : editing
                ? 'bg-accent text-white'
                : 'bg-dark-card text-dark-muted border border-dark-border hover:text-accent hover:border-accent/30'
            }`}
        >
          {saved ? 'Saved!' : editing ? (
            <><Save size={14} /> Save</>
          ) : 'Edit'}
        </button>
      </div>

      <div className="card-dark space-y-3">
        {editing ? (
          <>
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-xs text-dark-muted block mb-1">Name</label>
                <input className={inputClass} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-dark-muted block mb-1">Age</label>
                <input className={inputClass} type="number" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-dark-muted block mb-1">Height (cm)</label>
                <input className={inputClass} type="number" value={form.height} onChange={e => setForm({ ...form, height: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-dark-muted block mb-1">Current Weight</label>
                <input className={inputClass} type="number" value={form.currentWeight} onChange={e => setForm({ ...form, currentWeight: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-dark-muted block mb-1">Goal Weight</label>
                <input className={inputClass} type="number" value={form.goalWeight} onChange={e => setForm({ ...form, goalWeight: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-dark-muted block mb-1">Gender</label>
                <select className={inputClass + ' appearance-none'} value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-xs text-dark-muted block mb-1">Goal</label>
                <select className={inputClass + ' appearance-none'} value={form.goalType} onChange={e => setForm({ ...form, goalType: e.target.value })}>
                  <option value="lose_fat">Lose Fat</option>
                  <option value="build_muscle">Build Muscle</option>
                  <option value="maintain">Maintain</option>
                  <option value="body_recomp">Body Recomp</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-dark-muted block mb-1">Activity</label>
                <select className={inputClass + ' appearance-none'} value={form.activityLevel} onChange={e => setForm({ ...form, activityLevel: e.target.value })}>
                  <option value="sedentary">Sedentary</option>
                  <option value="lightly_active">Lightly Active</option>
                  <option value="moderately_active">Moderately Active</option>
                  <option value="very_active">Very Active</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-dark-muted block mb-1">Diet</label>
                <select className={inputClass + ' appearance-none'} value={form.dietPref} onChange={e => setForm({ ...form, dietPref: e.target.value })}>
                  <option value="non_veg">Non-Veg</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-dark-muted block mb-1">Experience</label>
                <select className={inputClass + ' appearance-none'} value={form.gymExp} onChange={e => setForm({ ...form, gymExp: e.target.value })}>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-dark-muted block mb-1">Days/Week</label>
                <select className={inputClass + ' appearance-none'} value={form.daysPerWeek} onChange={e => setForm({ ...form, daysPerWeek: e.target.value })}>
                  {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Days</option>)}
                </select>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-2.5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <span className="text-accent font-bold text-lg">{onboarding.name[0]?.toUpperCase()}</span>
              </div>
              <div>
                <div className="text-foreground font-semibold text-lg">{onboarding.name}</div>
                <div className="text-dark-muted text-xs">{onboarding.age} years · {genderLabels[onboarding.gender]}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <InfoRow label="Height" value={`${onboarding.height} cm`} />
              <InfoRow label="Current Weight" value={`${onboarding.currentWeight} kg`} />
              <InfoRow label="Goal Weight" value={`${onboarding.goalWeight} kg`} />
              <InfoRow label="Goal" value={labels[onboarding.goalType]} />
              <InfoRow label="Activity" value={activityLabels[onboarding.activityLevel]} />
              <InfoRow label="Diet" value={dietLabels[onboarding.dietPref]} />
              <InfoRow label="Experience" value={expLabels[onboarding.gymExp]} />
              <InfoRow label="Timeline" value={{ '1month': '1 Month', '3months': '3 Months', '6months': '6 Months' }[onboarding.timeline] || '3 Months'} />
              <InfoRow label="Days/Week" value={`${onboarding.daysPerWeek} days`} />
            </div>
          </div>
        )}
      </div>

      <MacroCards consumed={{ protein: 0, carbs: 0, fat: 0 }} targets={onboarding.macros || { protein: 150, carbs: 250, fat: 65 }} />

      <CaloriesCard consumed={0} target={onboarding.dailyCalories || 2000} />

      <div className="card-dark">
        <h3 className="text-sm font-semibold text-dark-muted uppercase tracking-wider mb-3">Log Weight</h3>
        <div className="flex gap-2.5">
          <input
            className={inputClass + ' flex-1'}
            type="number"
            placeholder={todayWeight ? `Today: ${todayWeight} kg` : 'Enter weight in kg'}
            value={weightInput}
            onChange={e => setWeightInput(e.target.value)}
          />
          <button
            onClick={handleLogWeight}
            disabled={!weightInput || Number(weightInput) <= 0}
            className="px-5 py-2.5 rounded-xl bg-accent text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
          >
            Log
          </button>
        </div>
      </div>

      <WeightChart data={weights} />
      <BMICalculator weight={onboarding.currentWeight} heightCm={onboarding.height} />
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="bg-dark-card border border-dark-border rounded-xl px-3.5 py-2.5">
      <div className="text-dark-muted text-[10px] uppercase tracking-wider">{label}</div>
      <div className="text-foreground text-sm font-medium mt-0.5">{value}</div>
    </div>
  );
}
