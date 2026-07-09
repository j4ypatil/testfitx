import { Trash2, Utensils, Apple, Coffee, Beef, Pizza } from 'lucide-react';

const foodIcons = {
  breakfast: Coffee, lunch: Beef, dinner: Pizza, snack: Apple,
};

function getFoodCategory(name) {
  const n = (name || '').toLowerCase();
  if (n.includes('egg') || n.includes('oat') || n.includes('cereal') || n.includes('pancake') || n.includes('toast') || n.includes('yogurt')) return 'breakfast';
  if (n.includes('chicken') || n.includes('rice') || n.includes('salad') || n.includes('soup') || n.includes('sandwich') || n.includes('wrap') || n.includes('bowl')) return 'lunch';
  if (n.includes('steak') || n.includes('pasta') || n.includes('fish') || n.includes('curry') || n.includes('pizza') || n.includes('burger')) return 'dinner';
  if (n.includes('bar') || n.includes('shake') || n.includes('fruit') || n.includes('nut') || n.includes('smoothie')) return 'snack';
  return null;
}

export default function MealList({ foods, onDelete }) {
  if (foods.length === 0) {
    return (
      <div className="relative group mb-4">
        <div className="absolute -inset-[1px] bg-gradient-to-b from-white/[0.04] to-transparent rounded-[20px] pointer-events-none" />
        <div className="relative bg-[rgba(28,28,30,0.4)] backdrop-blur-xl rounded-[20px] border border-white/[0.05] p-6 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-3">
            <Utensils size={18} className="text-white/20" />
          </div>
          <p className="text-sm text-white/30 font-medium">No meals logged</p>
          <p className="text-[11px] text-white/20 mt-1">Tap + to add your first entry</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 mb-4">
      {foods.map((food) => {
        const cat = getFoodCategory(food.name);
        const Icon = cat ? foodIcons[cat] : Utensils;
        return (
          <div key={food.id} className="relative group">
            <div className="absolute -inset-[1px] bg-gradient-to-b from-white/[0.04] to-transparent rounded-[16px] pointer-events-none" />
            <div className="relative bg-[rgba(28,28,30,0.4)] backdrop-blur-xl rounded-[16px] border border-white/[0.05] flex items-center gap-3 py-3 px-4">
              <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
                <Icon size={15} className="text-white/40" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white/80 truncate">{food.name}</div>
                <div className="text-[10px] text-white/30 mt-0.5 font-medium">
                  P {food.protein}g · C {food.carbs}g · F {food.fat}g
                </div>
              </div>
              <div className="text-right shrink-0 mr-1">
                <div className="text-sm font-bold text-white/90">{food.calories}</div>
                <div className="text-[9px] text-white/30 font-medium">kcal</div>
              </div>
              <button
                onClick={() => onDelete(food.id)}
                className="w-8 h-8 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] flex items-center justify-center transition-colors shrink-0 opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={13} className="text-white/40 hover:text-[#ff453a] transition-colors" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
