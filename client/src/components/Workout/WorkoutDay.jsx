import ExerciseItem from './ExerciseItem.jsx';

export default function WorkoutDay({ dayData }) {
  if (!dayData || !dayData.exercises) return null;

  const totalCount = dayData.exercises.length;

  return (
    <div className="bg-dark-card border border-[#2c2c2e] rounded-3xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-foreground text-lg font-bold">Day {dayData.day}</h2>
        {totalCount > 0 && (
          <div className="text-xs font-medium text-dark-muted bg-[#121212] px-3 py-1.5 rounded-full">
            0/{totalCount}
          </div>
        )}
      </div>

      <div className="space-y-3">
        {dayData.exercises.map((ex, idx) => (
          <ExerciseItem key={ex.id || idx} exercise={ex} />
        ))}
      </div>
    </div>
  );
}
