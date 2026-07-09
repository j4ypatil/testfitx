import { calculateBMR, calculateTDEE, adjustCalories } from '../../utils/tdee.js';
import { calculateMacros } from '../../utils/macros.js';
import { Zap, Dumbbell, Apple, Flame, Target } from 'lucide-react';

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

const goalIcons = {
  lose_fat: <Flame size={20} />,
  build_muscle: <Dumbbell size={20} />,
  maintain: <Target size={20} />,
  body_recomp: <Zap size={20} />,
};

export default function SummaryScreen({ data, onBack, onSubmit }) {
  const bmr = calculateBMR(data.currentWeight, data.height, data.age, data.gender);
  const tdee = calculateTDEE(bmr, data.activityLevel);
  const timelineLabels = { '1month': '1 Month (Aggressive)', '3months': '3 Months (Balanced)', '6months': '6 Months (Gentle)' };
  const dailyCalories = adjustCalories(tdee, data.goalType, data.timeline || '3months');
  const macros = calculateMacros(dailyCalories, data.goalType);

  return (
    <div className="min-h-screen bg-light-bg flex flex-col">
      <div className="flex-1 px-6 pt-6 pb-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-light-card border border-light-border flex items-center justify-center hover:bg-light-border transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f5f5f7" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <span className="text-sm font-medium text-light-muted">Almost there!</span>
          <div className="w-10" />
        </div>

        <h1 className="text-[40px] leading-[1.1] font-bold text-foreground mb-3">
          Your Plan
        </h1>
        <p className="text-light-muted text-base mb-8">Here's your personalized fitness plan</p>

        <div className="bg-light-card border border-light-border rounded-3xl p-6 mb-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Flame size={24} className="text-accent" />
            <span className="text-3xl font-bold text-foreground">{dailyCalories}</span>
            <span className="text-light-muted text-sm">kcal/day</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#fff5f5] rounded-2xl p-3 text-center">
              <div className="text-macro-protein text-lg font-bold">{macros.protein}g</div>
              <div className="text-xs text-light-muted">Protein</div>
            </div>
            <div className="bg-[#fffaf0] rounded-2xl p-3 text-center">
              <div className="text-macro-carbs text-lg font-bold">{macros.carbs}g</div>
              <div className="text-xs text-light-muted">Carbs</div>
            </div>
            <div className="bg-[#f0f5ff] rounded-2xl p-3 text-center">
              <div className="text-macro-fats text-lg font-bold">{macros.fat}g</div>
              <div className="text-xs text-light-muted">Fat</div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between py-2 border-b border-light-border">
            <span className="text-light-muted text-sm">Goal</span>
            <span className="text-foreground font-medium text-sm flex items-center gap-1.5">
              {goalIcons[data.goalType]}
              {labels[data.goalType]}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-light-border">
            <span className="text-light-muted text-sm">Activity</span>
            <span className="text-foreground font-medium text-sm">{activityLabels[data.activityLevel]}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-light-border">
            <span className="text-light-muted text-sm">Diet</span>
            <span className="text-foreground font-medium text-sm"><Apple size={14} className="inline mr-1" />{dietLabels[data.dietPref]}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-light-border">
            <span className="text-light-muted text-sm">Experience</span>
            <span className="text-foreground font-medium text-sm"><Dumbbell size={14} className="inline mr-1" />{expLabels[data.gymExp]}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-light-border">
            <span className="text-light-muted text-sm">Timeline</span>
            <span className="text-foreground font-medium text-sm">{timelineLabels[data.timeline] || '3 Months (Balanced)'}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-light-muted text-sm">Workouts/week</span>
            <span className="text-foreground font-medium text-sm">{data.daysPerWeek} days</span>
          </div>
        </div>
      </div>

      <div className="px-6 pb-10 pt-4">
        <button onClick={onSubmit} className="btn-primary btn-primary-active">
          Start My Journey
        </button>
      </div>
    </div>
  );
}
