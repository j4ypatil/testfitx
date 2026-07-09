const KEYS = {
  SPLASH: 'fitx_splash_seen',
  ONBOARDING: 'fitx_onboarding',
  STREAK: 'fitx_streak',
  STREAK_DATE: 'fitx_streak_date',
  FOODS_PREFIX: 'fitx_foods_',
  WORKOUT_PREFIX: 'fitx_workout_',
  WEIGHTS_PREFIX: 'fitx_weights_',
  WORKOUT_PLAN: 'fitx_workout_plan',
};

export function getHasSeenSplash() {
  try { return localStorage.getItem(KEYS.SPLASH) === 'true'; } catch { return false; }
}

export function setHasSeenSplash() {
  localStorage.setItem(KEYS.SPLASH, 'true');
}

export function getOnboarding() {
  try {
    const data = localStorage.getItem(KEYS.ONBOARDING);
    return data ? JSON.parse(data) : null;
  } catch { return null; }
}

export function setOnboarding(data) {
  localStorage.setItem(KEYS.ONBOARDING, JSON.stringify(data));
}

export function getFoods(date) {
  try {
    const data = localStorage.getItem(KEYS.FOODS_PREFIX + date);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

export function addFood(date, food) {
  const foods = getFoods(date);
  foods.push({ ...food, id: Date.now().toString() + Math.random().toString(36).slice(2, 6) });
  localStorage.setItem(KEYS.FOODS_PREFIX + date, JSON.stringify(foods));
  return foods;
}

export function deleteFood(date, id) {
  const foods = getFoods(date).filter(f => f.id !== id);
  localStorage.setItem(KEYS.FOODS_PREFIX + date, JSON.stringify(foods));
  return foods;
}

export function getWorkout(date) {
  try {
    const data = localStorage.getItem(KEYS.WORKOUT_PREFIX + date);
    return data ? JSON.parse(data) : null;
  } catch { return null; }
}

export function setWorkout(date, workout) {
  localStorage.setItem(KEYS.WORKOUT_PREFIX + date, JSON.stringify(workout));
}

export function toggleExercise(date, dayIndex, exerciseIndex) {
  const workout = getWorkout(date);
  if (!workout || !workout[dayIndex]) return;
  const ex = workout[dayIndex].exercises[exerciseIndex];
  if (ex) ex.done = !ex.done;
  localStorage.setItem(KEYS.WORKOUT_PREFIX + date, JSON.stringify(workout));
  return workout;
}

export function getWeight(date) {
  try {
    const data = localStorage.getItem(KEYS.WEIGHTS_PREFIX + date);
    return data ? JSON.parse(data) : null;
  } catch { return null; }
}

export function setWeight(date, weight) {
  localStorage.setItem(KEYS.WEIGHTS_PREFIX + date, JSON.stringify(weight));
}

export function getAllWeights() {
  const weights = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(KEYS.WEIGHTS_PREFIX)) {
      const date = key.replace(KEYS.WEIGHTS_PREFIX, '');
      const val = getWeight(date);
      if (val) weights.push({ date, weight: val });
    }
  }
  return weights.sort((a, b) => a.date.localeCompare(b.date));
}

export function getDateKey(date) {
  return date.toISOString().split('T')[0];
}

export function getStreak() {
  try { return parseInt(localStorage.getItem(KEYS.STREAK)) || 0; } catch { return 0; }
}

export function checkAndUpdateStreak(dateKey) {
  const lastDate = localStorage.getItem(KEYS.STREAK_DATE);
  const currentStreak = parseInt(localStorage.getItem(KEYS.STREAK)) || 0;
  if (lastDate === dateKey) return currentStreak;
  const today = new Date(dateKey + 'T00:00:00');
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = getDateKey(yesterday);
  let newStreak;
  if (lastDate === yesterdayKey) {
    newStreak = currentStreak + 1;
  } else {
    newStreak = 1;
  }
  localStorage.setItem(KEYS.STREAK, newStreak.toString());
  localStorage.setItem(KEYS.STREAK_DATE, dateKey);
  return newStreak;
}

export function getWorkoutPlan() {
  try {
    const data = localStorage.getItem(KEYS.WORKOUT_PLAN);
    return data ? JSON.parse(data) : null;
  } catch { return null; }
}

export function setWorkoutPlan(plan) {
  localStorage.setItem(KEYS.WORKOUT_PLAN, JSON.stringify(plan));
}

export function toggleDayExercise(dayIndex, exerciseIndex) {
  const plan = getWorkoutPlan();
  if (!plan || !plan[dayIndex]) return null;
  const ex = plan[dayIndex].exercises?.[exerciseIndex];
  if (ex) ex.done = !ex.done;
  setWorkoutPlan(plan);
  return plan;
}

export function markDayComplete(dayIndex) {
  const plan = getWorkoutPlan();
  if (!plan || !plan[dayIndex]) return null;
  const exercises = plan[dayIndex].exercises || [];
  exercises.forEach(ex => { if (ex) ex.done = true; });
  setWorkoutPlan(plan);
  return plan;
}

export function getCompletedCount(plan) {
  if (!plan) return { days: 0, total: 0 };
  const total = plan.reduce((sum, d) => sum + (d.exercises?.length || 0), 0);
  const done = plan.reduce((sum, d) => sum + (d.exercises?.filter(e => e.done)?.length || 0), 0);
  return { days: done, total };
}

export function getWorkoutLog() {
  try { return JSON.parse(localStorage.getItem('fitx_workout_logs')); } catch { return null; }
}

export function saveWorkoutLog(logs) {
  localStorage.setItem('fitx_workout_logs', JSON.stringify(logs));
}

export function getWorkoutPrefs() {
  try { return JSON.parse(localStorage.getItem('fitx_workout_prefs')); } catch { return null; }
}

export function setWorkoutPrefs(prefs) {
  localStorage.setItem('fitx_workout_prefs', JSON.stringify(prefs));
}

export function getWorkoutAdherence() {
  try { return JSON.parse(localStorage.getItem('fitx_adherence')); } catch { return []; }
}

export function logWorkoutDay(dayIndex) {
  const ad = getWorkoutAdherence();
  const today = new Date().toISOString().split('T')[0];
  if (!ad.find(a => a.date === today)) {
    ad.push({ date: today, dayIndex, completed: true });
    localStorage.setItem('fitx_adherence', JSON.stringify(ad));
  }
}

export function getExerciseHistory() {
  try { return JSON.parse(localStorage.getItem('fitx_exercise_history')) || {}; } catch { return {}; }
}

export function saveExerciseHistory(history) {
  localStorage.setItem('fitx_exercise_history', JSON.stringify(history));
}

export function logExerciseSet(exerciseName, setNumber, weight, unit, reps) {
  const history = getExerciseHistory();
  const today = new Date().toISOString().split('T')[0];
  if (!history[exerciseName]) history[exerciseName] = { sessions: [] };
  const ex = history[exerciseName];
  let session = ex.sessions.find(s => s.date === today);
  if (!session) {
    session = { date: today, sets: [] };
    ex.sessions.push(session);
  }
  session.sets.push({ set: setNumber, weight: Number(weight), unit, reps: Number(reps), timestamp: Date.now() });
  saveExerciseHistory(history);
  return session;
}

export function getLastSession(exerciseName) {
  const history = getExerciseHistory();
  const ex = history[exerciseName];
  if (!ex || ex.sessions.length < 2) return null;
  return ex.sessions[ex.sessions.length - 2];
}

export function getExerciseBests(exerciseName) {
  const history = getExerciseHistory();
  const ex = history[exerciseName];
  if (!ex) return null;
  const allSets = ex.sessions.flatMap(s => s.sets).filter(s => s.weight > 0);
  if (allSets.length === 0) return null;
  return {
    bestWeight: Math.max(...allSets.map(s => s.weight)),
    bestReps: Math.max(...allSets.map(s => s.reps)),
    bestVolume: Math.max(...allSets.map(s => s.weight * s.reps)),
  };
}

export function clearWorkoutLog() {
  localStorage.removeItem('fitx_workout_logs');
}
