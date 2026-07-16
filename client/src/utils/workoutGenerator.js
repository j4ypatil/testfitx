import exercises from '../data/exercises.js';

const bodyTypeFocus = {
  male: {
    athlete: { label: 'Athlete', focus: { Chest: 2, Back: 2, Legs: 2, Shoulders: 2, Arms: 1, Core: 2, Cardio: 2 }, description: 'Balanced athletic build — functional strength, lean muscle, cardio endurance' },
    vtaper: { label: 'V Taper', focus: { Chest: 2, Back: 3, Legs: 1, Shoulders: 3, Arms: 2, Core: 1, Cardio: 0 }, description: 'Broad shoulders, wide lats, narrow waist — classic V-shape' },
    bulky: { label: 'Bulky', focus: { Chest: 3, Back: 3, Legs: 3, Shoulders: 2, Arms: 2, Core: 1, Cardio: 0 }, description: 'Big, dense frame — heavy compounds, mass and strength focused' },
  },
  female: {
    cat: { label: 'Cat / Panther', focus: { Chest: 1, Back: 1, Legs: 3, Shoulders: 1, Arms: 1, Core: 2, Cardio: 1 }, description: 'Slim with curves — glutes, legs, core emphasis' },
    butterfly: { label: 'Butterfly', focus: { Chest: 1, Back: 2, Legs: 2, Shoulders: 1, Arms: 1, Core: 3, Cardio: 1 }, description: 'Soft, flexible — core, back, full body conditioning' },
    swan: { label: 'Swan', focus: { Chest: 1, Back: 2, Legs: 2, Shoulders: 2, Arms: 1, Core: 2, Cardio: 1 }, description: 'Long, lean, graceful — posture, legs, full body toning' },
    tigress: { label: 'Tigress', focus: { Chest: 1, Back: 1, Legs: 4, Shoulders: 2, Arms: 1, Core: 1, Cardio: 1 }, description: 'Strong curves — heavy glutes, legs, shoulders' },
  },
};

const exerciseDBids = {
  "Barbell Bench Press": "0025", "Dumbbell Bench Press": "0289", "Incline Barbell Press": "0047",
  "Incline Dumbbell Press": "1283", "Push-Ups": "0492", "Decline Bench Press": "0033",
  "Dumbbell Flyes": "0308", "Weighted Dips": "0009", "Deadlift": "0032", "Pull-Ups": "0139",
  "Lat Pulldown": "0673", "Barbell Row": "0027", "Seated Cable Row": "0861", "T-Bar Row": "0606",
  "Hyperextension": "0488", "Leg Press": "0739", "Romanian Deadlift": "0085", "Leg Extensions": "0585",
  "Leg Curls": "0496", "Walking Lunges": "1460", "Bulgarian Split Squat": "0097", "Hack Squat": "0046",
  "Goblet Squat": "0534", "Box Jumps": "1374", "Overhead Barbell Press": "0091",
  "Lateral Raises": "0178", "Front Raises": "0040", "Reverse Flyes": "0154", "Arnold Press": "0287",
  "Upright Row": "0119", "Clean and Press": "0028", "Shrugs": "0095", "Barbell Curl": "0031",
  "Hammer Curl": "0165", "Tricep Pushdown": "1723", "Skull Crushers": "0060", "Preacher Curl": "0059",
  "Dips": "0677", "Concentration Curl": "0089", "Overhead Tricep Extension": "1722", "Zottman Curl": "0439",
  "Close-Grip Bench Press": "0030", "Plank": "1375", "Crunch": "0056", "Hanging Leg Raise": "0037",
  "Russian Twist": "0130", "Side Plank": "1406", "Dead Bug": "0063", "Burpees": "0081",
  "Jump Rope": "0043", "Treadmill Run": "1866", "Stationary Bike HIIT": "1876",
  "Cable Crunch": null, "Pallof Press": null, "Ab Wheel Rollout": null, "Toes to Bar": null,
  "Cable Flyes": null, "Pec Deck Machine": null, "Dumbbell Row": null, "Face Pull": null,
  "Hammer Strength Row": null, "Barbell Back Squat": null, "Dumbbell Shoulder Press": null,
  "Rowing Machine": null, "Stair Climber": null,
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

export function getBodyTypeFocus(gender, bodyType) {
  const map = bodyTypeFocus[gender];
  if (!map) return bodyTypeFocus.male.athlete;
  return map[bodyType] || bodyTypeFocus.male.athlete;
}

export function getFocusGenders() {
  return bodyTypeFocus;
}

export function generatePlanByBodyType(onboarding, historyData, oldPlan) {
  const gender = onboarding.gender || 'male';
  const bodyType = onboarding.bodyType || 'athlete';
  const gymType = onboarding.gymType || 'moderate';
  const gymExp = onboarding.gymExp || 'beginner';
  const goalType = onboarding.goalType || 'maintain';
  const injuries = onboarding.injuries || 'none';

  const focus = getBodyTypeFocus(gender, bodyType);
  const groupWeights = Object.entries(focus.focus).filter(([, v]) => v > 0);

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const todayIdx = new Date().getDay();
  const offsetDayNames = [...dayNames.slice(todayIdx), ...dayNames.slice(0, todayIdx)];

  // Build a map of completed exercises from old plan for carry-over
  const prevCompleted = {};
  if (oldPlan && Array.isArray(oldPlan)) {
    for (const day of oldPlan) {
      if (day.isRestDay) continue;
      for (const ex of (day.exercises || [])) {
        if (ex.done) {
          prevCompleted[ex.name] = true;
        }
      }
    }
  }

  const split = [];
  const allGroups = [...groupWeights];
  for (let d = 0; d < 7; d++) {
    const dayName = offsetDayNames[d];
    
    const dayGroups = [];
    const pool = [...allGroups];
    const count = Math.min(4, Math.max(2, pool.length));
    for (let i = 0; i < count; i++) {
      const pick = weightedPick(pool);
      dayGroups.push(pick[0]);
    }
    const uniqueGroups = [...new Set(dayGroups)].slice(0, 4);
    split.push({ focus: uniqueGroups.join(' · '), groups: uniqueGroups });
  }

  return split.map((d, idx) => {
    const dayName = offsetDayNames[idx];
    const date = new Date();
    date.setDate(date.getDate() + idx);
    const dateKey = date.toISOString().split('T')[0];
    return {
      day: idx + 1,
      dayName,
      dateKey,
      focus: d.focus,
      isRestDay: false,
      warmup: ['Arm circles 30s', 'Bodyweight squats 15 reps', 'Torso twists 30s'],
      exercises: pickExercisesForDay(d.groups, gymType, gymExp, injuries, historyData, goalType, prevCompleted),
      cooldown: ['Hamstring stretch 30s', 'Shoulder stretch 30s'],
    };
  });
}

function weightedPick(pool) {
  const total = pool.reduce((s, [, w]) => s + w, 0);
  let r = Math.random() * total;
  for (const item of pool) {
    r -= item[1];
    if (r <= 0) return item;
  }
  return pool[pool.length - 1];
}

function pickExercisesForDay(groups, gymType, gymExp, injuries, historyData, goalType, prevCompleted) {
  const exByGroup = {};
  const difficultyLevels = ['beginner', 'intermediate', 'advanced'];
  const maxDiff = difficultyLevels.indexOf(gymExp || 'beginner');
  const validExercises = exercises.filter(e =>
    exerciseDBids[e.name] !== undefined &&
    (gymType !== 'home' || isBodyweightOrMinimal(e)) &&
    difficultyLevels.indexOf(e.difficulty) <= maxDiff &&
    !isInjurious(e, injuries)
  );

  for (const ex of validExercises) {
    if (!exByGroup[ex.muscleGroup]) exByGroup[ex.muscleGroup] = [];
    exByGroup[ex.muscleGroup].push(ex);
  }

  const dayExercises = [];
  const usedNames = new Set();

  for (const group of groups) {
    const pool = exByGroup[group] || [];
    // Prioritize exercises completed in previous plan
    const prev = pool.filter(e => prevCompleted?.[e.name]);
    const rest = pool.filter(e => !prevCompleted?.[e.name]);
    const ordered = [...shuffle(prev), ...shuffle(rest)];

    let count = group === 'Legs' ? 2 : 1;
    if (goalType === 'build_muscle' && (group === 'Chest' || group === 'Back')) count = 2;

    let picked = 0;
    for (const ex of ordered) {
      if (picked >= count) break;
      if (usedNames.has(ex.name)) continue;

      let weightSuggestion = null;
      if (historyData?.weights?.[ex.name]) {
        weightSuggestion = historyData.weights[ex.name];
        // Progressive overload: add 2.5kg if previously completed
        if (prevCompleted?.[ex.name]) {
          weightSuggestion = {
            weight: weightSuggestion.weight + 2.5,
            unit: weightSuggestion.unit || 'kg',
            reps: weightSuggestion.reps,
          };
        }
      }

      const diff = gymExp === 'beginner' ? clampDifficulty(ex.difficulty, 'beginner') : ex.difficulty;

      usedNames.add(ex.name);
      dayExercises.push({
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        muscleGroup: ex.muscleGroup,
        difficulty: diff,
        rest: ex.rest || 60,
        notes: weightSuggestion ? `Previous: ${weightSuggestion.weight}${weightSuggestion.unit || 'kg'} × ${weightSuggestion.reps}` : '',
        done: false,
        exerciseDBId: exerciseDBids[ex.name],
      });
      picked++;
    }
  }

  return shuffle(dayExercises).slice(0, 6);
}

function isBodyweightOrMinimal(ex) {
  const bodyweight = ['Push-Ups', 'Plank', 'Crunch', 'Side Plank', 'Dead Bug', 'Russian Twist', 'Walking Lunges', 'Burpees', 'Jump Rope', 'Pull-Ups', 'Dips'];
  return bodyweight.includes(ex.name) || ex.difficulty === 'beginner';
}

function isInjurious(ex, injuries) {
  if (injuries === 'none' || !injuries) return false;
  const injuryMap = {
    lower_back: ['Deadlift', 'Barbell Row', 'Good Morning'],
    knee: ['Walking Lunges', 'Bulgarian Split Squat', 'Box Jumps', 'Leg Press', 'Hack Squat'],
    shoulder: ['Overhead Barbell Press', 'Arnold Press', 'Upright Row', 'Dips', 'Weighted Dips'],
    neck: ['Overhead Barbell Press', 'Shrugs', 'Clean and Press'],
  };
  const bad = injuryMap[injuries] || [];
  return bad.includes(ex.name);
}

function clampDifficulty(diff, max) {
  const levels = ['beginner', 'intermediate', 'advanced'];
  return levels[Math.min(levels.indexOf(diff), levels.indexOf(max))];
}

export function analyzePhotoForFocus(imageBase64) {
  // Returns focus areas from AI analysis (will be sent to backend)
  return null;
}

export { exerciseDBids };
