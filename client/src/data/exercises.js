const exercises = [
  // CHEST
  { id: 'c1', name: 'Barbell Bench Press', muscleGroup: 'Chest', difficulty: 'intermediate', sets: 4, reps: '8-12', rest: 90 },
  { id: 'c2', name: 'Dumbbell Bench Press', muscleGroup: 'Chest', difficulty: 'beginner', sets: 3, reps: '10-12', rest: 60 },
  { id: 'c3', name: 'Incline Barbell Press', muscleGroup: 'Chest', difficulty: 'intermediate', sets: 4, reps: '8-10', rest: 90 },
  { id: 'c4', name: 'Incline Dumbbell Press', muscleGroup: 'Chest', difficulty: 'beginner', sets: 3, reps: '10-12', rest: 60 },
  { id: 'c5', name: 'Cable Flyes', muscleGroup: 'Chest', difficulty: 'intermediate', sets: 3, reps: '12-15', rest: 60 },
  { id: 'c6', name: 'Push-Ups', muscleGroup: 'Chest', difficulty: 'beginner', sets: 3, reps: '15-20', rest: 45 },
  { id: 'c7', name: 'Decline Bench Press', muscleGroup: 'Chest', difficulty: 'intermediate', sets: 3, reps: '8-12', rest: 90 },
  { id: 'c8', name: 'Dumbbell Flyes', muscleGroup: 'Chest', difficulty: 'beginner', sets: 3, reps: '12-15', rest: 60 },
  { id: 'c9', name: 'Weighted Dips', muscleGroup: 'Chest', difficulty: 'advanced', sets: 4, reps: '8-10', rest: 90 },
  { id: 'c10', name: 'Pec Deck Machine', muscleGroup: 'Chest', difficulty: 'beginner', sets: 3, reps: '12-15', rest: 60 },

  // BACK
  { id: 'b1', name: 'Deadlift', muscleGroup: 'Back', difficulty: 'advanced', sets: 4, reps: '5-8', rest: 120 },
  { id: 'b2', name: 'Pull-Ups', muscleGroup: 'Back', difficulty: 'intermediate', sets: 3, reps: '8-12', rest: 90 },
  { id: 'b3', name: 'Lat Pulldown', muscleGroup: 'Back', difficulty: 'beginner', sets: 3, reps: '10-12', rest: 60 },
  { id: 'b4', name: 'Barbell Row', muscleGroup: 'Back', difficulty: 'intermediate', sets: 4, reps: '8-10', rest: 90 },
  { id: 'b5', name: 'Seated Cable Row', muscleGroup: 'Back', difficulty: 'beginner', sets: 3, reps: '10-12', rest: 60 },
  { id: 'b6', name: 'Dumbbell Row', muscleGroup: 'Back', difficulty: 'beginner', sets: 3, reps: '10-12', rest: 60 },
  { id: 'b7', name: 'T-Bar Row', muscleGroup: 'Back', difficulty: 'intermediate', sets: 4, reps: '8-12', rest: 90 },
  { id: 'b8', name: 'Face Pull', muscleGroup: 'Back', difficulty: 'intermediate', sets: 3, reps: '15-20', rest: 45 },
  { id: 'b9', name: 'Hyperextension', muscleGroup: 'Back', difficulty: 'beginner', sets: 3, reps: '12-15', rest: 60 },
  { id: 'b10', name: 'Hammer Strength Row', muscleGroup: 'Back', difficulty: 'intermediate', sets: 3, reps: '10-12', rest: 60 },

  // LEGS
  { id: 'l1', name: 'Barbell Back Squat', muscleGroup: 'Legs', difficulty: 'intermediate', sets: 4, reps: '8-10', rest: 120 },
  { id: 'l2', name: 'Leg Press', muscleGroup: 'Legs', difficulty: 'beginner', sets: 3, reps: '10-12', rest: 60 },
  { id: 'l3', name: 'Romanian Deadlift', muscleGroup: 'Legs', difficulty: 'intermediate', sets: 3, reps: '10-12', rest: 90 },
  { id: 'l4', name: 'Leg Extensions', muscleGroup: 'Legs', difficulty: 'beginner', sets: 3, reps: '12-15', rest: 45 },
  { id: 'l5', name: 'Leg Curls', muscleGroup: 'Legs', difficulty: 'beginner', sets: 3, reps: '12-15', rest: 45 },
  { id: 'l6', name: 'Walking Lunges', muscleGroup: 'Legs', difficulty: 'beginner', sets: 3, reps: '12-15', rest: 60 },
  { id: 'l7', name: 'Bulgarian Split Squat', muscleGroup: 'Legs', difficulty: 'intermediate', sets: 3, reps: '10-12', rest: 60 },
  { id: 'l8', name: 'Hack Squat', muscleGroup: 'Legs', difficulty: 'intermediate', sets: 4, reps: '8-12', rest: 90 },
  { id: 'l9', name: 'Goblet Squat', muscleGroup: 'Legs', difficulty: 'beginner', sets: 3, reps: '12-15', rest: 60 },
  { id: 'l10', name: 'Box Jumps', muscleGroup: 'Legs', difficulty: 'advanced', sets: 3, reps: '8-10', rest: 60 },

  // SHOULDERS
  { id: 's1', name: 'Overhead Barbell Press', muscleGroup: 'Shoulders', difficulty: 'intermediate', sets: 4, reps: '8-10', rest: 90 },
  { id: 's2', name: 'Dumbbell Shoulder Press', muscleGroup: 'Shoulders', difficulty: 'beginner', sets: 3, reps: '10-12', rest: 60 },
  { id: 's3', name: 'Lateral Raises', muscleGroup: 'Shoulders', difficulty: 'beginner', sets: 3, reps: '12-15', rest: 45 },
  { id: 's4', name: 'Front Raises', muscleGroup: 'Shoulders', difficulty: 'beginner', sets: 3, reps: '12-15', rest: 45 },
  { id: 's5', name: 'Reverse Flyes', muscleGroup: 'Shoulders', difficulty: 'beginner', sets: 3, reps: '12-15', rest: 45 },
  { id: 's6', name: 'Arnold Press', muscleGroup: 'Shoulders', difficulty: 'intermediate', sets: 3, reps: '10-12', rest: 60 },
  { id: 's7', name: 'Upright Row', muscleGroup: 'Shoulders', difficulty: 'intermediate', sets: 3, reps: '10-12', rest: 60 },
  { id: 's8', name: 'Face Pull', muscleGroup: 'Shoulders', difficulty: 'beginner', sets: 3, reps: '15-20', rest: 45 },
  { id: 's9', name: 'Clean and Press', muscleGroup: 'Shoulders', difficulty: 'advanced', sets: 4, reps: '6-8', rest: 120 },
  { id: 's10', name: 'Shrugs', muscleGroup: 'Shoulders', difficulty: 'beginner', sets: 3, reps: '12-15', rest: 45 },

  // ARMS
  { id: 'a1', name: 'Barbell Curl', muscleGroup: 'Arms', difficulty: 'beginner', sets: 3, reps: '10-12', rest: 60 },
  { id: 'a2', name: 'Hammer Curl', muscleGroup: 'Arms', difficulty: 'beginner', sets: 3, reps: '10-12', rest: 60 },
  { id: 'a3', name: 'Tricep Pushdown', muscleGroup: 'Arms', difficulty: 'beginner', sets: 3, reps: '12-15', rest: 45 },
  { id: 'a4', name: 'Skull Crushers', muscleGroup: 'Arms', difficulty: 'intermediate', sets: 3, reps: '10-12', rest: 60 },
  { id: 'a5', name: 'Preacher Curl', muscleGroup: 'Arms', difficulty: 'intermediate', sets: 3, reps: '10-12', rest: 60 },
  { id: 'a6', name: 'Dips', muscleGroup: 'Arms', difficulty: 'intermediate', sets: 3, reps: '12-15', rest: 60 },
  { id: 'a7', name: 'Concentration Curl', muscleGroup: 'Arms', difficulty: 'beginner', sets: 3, reps: '12-15', rest: 45 },
  { id: 'a8', name: 'Overhead Tricep Extension', muscleGroup: 'Arms', difficulty: 'beginner', sets: 3, reps: '12-15', rest: 45 },
  { id: 'a9', name: 'Zottman Curl', muscleGroup: 'Arms', difficulty: 'intermediate', sets: 3, reps: '10-12', rest: 60 },
  { id: 'a10', name: 'Close-Grip Bench Press', muscleGroup: 'Arms', difficulty: 'intermediate', sets: 3, reps: '8-10', rest: 90 },

  // CORE
  { id: 'core1', name: 'Plank', muscleGroup: 'Core', difficulty: 'beginner', sets: 3, reps: '30-60s', rest: 30 },
  { id: 'core2', name: 'Cable Crunch', muscleGroup: 'Core', difficulty: 'intermediate', sets: 3, reps: '12-15', rest: 45 },
  { id: 'core3', name: 'Hanging Leg Raise', muscleGroup: 'Core', difficulty: 'advanced', sets: 3, reps: '10-15', rest: 45 },
  { id: 'core4', name: 'Russian Twist', muscleGroup: 'Core', difficulty: 'beginner', sets: 3, reps: '15-20', rest: 30 },
  { id: 'core5', name: 'Ab Wheel Rollout', muscleGroup: 'Core', difficulty: 'intermediate', sets: 3, reps: '10-15', rest: 45 },
  { id: 'core6', name: 'Crunch', muscleGroup: 'Core', difficulty: 'beginner', sets: 3, reps: '15-20', rest: 30 },
  { id: 'core7', name: 'Pallof Press', muscleGroup: 'Core', difficulty: 'intermediate', sets: 3, reps: '10-12', rest: 45 },
  { id: 'core8', name: 'Side Plank', muscleGroup: 'Core', difficulty: 'beginner', sets: 3, reps: '20-40s', rest: 30 },
  { id: 'core9', name: 'Toes to Bar', muscleGroup: 'Core', difficulty: 'advanced', sets: 3, reps: '8-12', rest: 60 },
  { id: 'core10', name: 'Dead Bug', muscleGroup: 'Core', difficulty: 'beginner', sets: 3, reps: '10-12', rest: 30 },

  // CARDIO
  { id: 'cardio1', name: 'Treadmill Run', muscleGroup: 'Cardio', difficulty: 'beginner', sets: 1, reps: '20min', rest: 0 },
  { id: 'cardio2', name: 'Stationary Bike HIIT', muscleGroup: 'Cardio', difficulty: 'intermediate', sets: 1, reps: '20min', rest: 0 },
  { id: 'cardio3', name: 'Jump Rope', muscleGroup: 'Cardio', difficulty: 'beginner', sets: 1, reps: '10min', rest: 0 },
  { id: 'cardio4', name: 'Rowing Machine', muscleGroup: 'Cardio', difficulty: 'beginner', sets: 1, reps: '15min', rest: 0 },
  { id: 'cardio5', name: 'Stair Climber', muscleGroup: 'Cardio', difficulty: 'intermediate', sets: 1, reps: '20min', rest: 0 },
  { id: 'cardio6', name: 'Burpees', muscleGroup: 'Cardio', difficulty: 'advanced', sets: 3, reps: '15-20', rest: 30 },
];

export default exercises;

export const muscleGroups = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio'];
