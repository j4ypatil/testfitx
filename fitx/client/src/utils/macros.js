const macroSplits = {
  lose_fat: { protein: 0.40, carbs: 0.35, fat: 0.25 },
  build_muscle: { protein: 0.30, carbs: 0.50, fat: 0.20 },
  maintain: { protein: 0.30, carbs: 0.45, fat: 0.25 },
  body_recomp: { protein: 0.35, carbs: 0.40, fat: 0.25 },
};

export function calculateMacros(calories, goalType) {
  const split = macroSplits[goalType] || macroSplits.maintain;
  const proteinG = Math.round((calories * split.protein) / 4);
  const carbsG = Math.round((calories * split.carbs) / 4);
  const fatG = Math.round((calories * split.fat) / 9);
  return { protein: proteinG, carbs: carbsG, fat: fatG };
}
