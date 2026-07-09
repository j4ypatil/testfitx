export function calculateBMR(weight, height, age, gender) {
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  }
  return 10 * weight + 6.25 * height - 5 * age - 161;
}

export const activityMultipliers = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
};

export const goalAdjustments = {
  lose_fat: { '1month': -750, '3months': -500, '6months': -300 },
  build_muscle: { '1month': 400, '3months': 300, '6months': 200 },
  maintain: { '1month': 0, '3months': 0, '6months': 0 },
  body_recomp: { '1month': 0, '3months': 0, '6months': 0 },
};

export function calculateTDEE(bmr, activityLevel) {
  return Math.round(bmr * (activityMultipliers[activityLevel] || 1.2));
}

export function adjustCalories(tdee, goalType, timeline) {
  const adj = goalAdjustments[goalType] || { '1month': 0, '3months': 0, '6months': 0 };
  return tdee + (adj[timeline] || 0);
}
