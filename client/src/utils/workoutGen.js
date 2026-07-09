import exercises from '../data/exercises.js';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickExercises(muscleGroup, difficulty, count = 5) {
  const pool = exercises.filter(
    e => e.muscleGroup === muscleGroup && (!difficulty || e.difficulty === difficulty || difficulty === 'beginner' ? e.difficulty === 'beginner' : true)
  );
  const shuffled = shuffle(pool);
  const cardio = muscleGroup === 'Cardio' || Math.random() > 0.7;
  if (cardio && muscleGroup !== 'Cardio') {
    const cardioEx = exercises.filter(e => e.muscleGroup === 'Cardio');
    return shuffle([...shuffled.slice(0, count - 1), ...shuffle(cardioEx).slice(0, 1)]).slice(0, count);
  }
  return shuffled.slice(0, count);
}

export function generateWorkoutPlan(goalType, experience, daysPerWeek) {
  const diff = experience;
  const days = [];

  const allGroups = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];
  const mainGroups = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms'];

  if (experience === 'beginner') {
    const count = Math.min(daysPerWeek, 3);
    for (let i = 0; i < count; i++) {
      const picks = shuffle(allGroups).slice(0, 4);
      days.push({
        day: i + 1,
        label: `Full Body ${i + 1}`,
        muscleFocus: 'Full Body',
        exercises: picks.flatMap(g => pickExercises(g, 'beginner', 1)).slice(0, 5),
      });
    }
  } else if (experience === 'intermediate') {
    if (daysPerWeek <= 3) {
      const splits = [['Chest', 'Shoulders', 'Triceps'], ['Back', 'Biceps'], ['Legs', 'Core']];
      const muscleMap = { Chest: 'Chest', Shoulders: 'Shoulders', Back: 'Back', Legs: 'Legs', Triceps: 'Arms', Biceps: 'Arms', Core: 'Core' };
      for (let i = 0; i < daysPerWeek; i++) {
        const group = splits[i % splits.length];
        days.push({
          day: i + 1,
          label: group.join(' / '),
          muscleFocus: group.join(' + '),
          exercises: group.flatMap(g => pickExercises(muscleMap[g], 'intermediate', 2)).slice(0, 6),
        });
      }
    } else {
      const pairs = [['Chest', 'Back'], ['Legs', 'Core'], ['Shoulders', 'Arms']];
      for (let i = 0; i < daysPerWeek; i++) {
        const [a, b] = pairs[i % pairs.length];
        days.push({
          day: i + 1,
          label: `${a} / ${b}`,
          muscleFocus: `${a} & ${b}`,
          exercises: [...pickExercises(a, 'intermediate', 3), ...pickExercises(b, 'intermediate', 2)].slice(0, 6),
        });
      }
    }
  } else {
    const broSplit = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];
    for (let i = 0; i < Math.min(daysPerWeek, 6); i++) {
      const focus = broSplit[i % broSplit.length];
      days.push({
        day: i + 1,
        label: focus,
        muscleFocus: focus,
        exercises: pickExercises(focus, 'advanced', 5),
      });
    }
  }

  days.forEach(d => {
    const hasCardio = goalType === 'lose_fat' && !d.exercises.some(e => e.muscleGroup === 'Cardio');
    if (hasCardio && d.exercises.length < 6) {
      const cardioEx = exercises.filter(e => e.muscleGroup === 'Cardio');
      d.exercises.push(cardioEx[Math.floor(Math.random() * cardioEx.length)]);
    }
    d.exercises = d.exercises.map(e => ({ ...e, done: false }));
  });

  return days;
}
