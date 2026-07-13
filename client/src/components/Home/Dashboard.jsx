import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import Header from './Header.jsx';
import DateSelector from './DateSelector.jsx';
import CaloriesCard from './CaloriesCard.jsx';
import MacroCards from './MacroCards.jsx';
import MealList from './MealList.jsx';
import AddFoodModal from './AddFoodModal.jsx';

const WeeklyChart = lazy(() => import('./WeeklyChart.jsx'));
import { getFoods, addFood, deleteFood, getDateKey, getStreak, checkAndUpdateStreak, isDayComplete } from '../../utils/storage.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { syncFoodData, cleanupOldFoodData, loadUserData } from '../../utils/sync.js';

function getWeekData(selectedDate) {
  const today = new Date(selectedDate);
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = getDateKey(d);
    const foods = getFoods(key);
    const totalCals = foods.reduce((s, f) => s + f.calories, 0);
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    days.push({ day: dayName, date: key, calories: totalCals });
  }
  return days;
}

export default function Dashboard({ onboarding }) {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [foods, setFoods] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [streak, setStreak] = useState(getStreak);

  const dateKey = getDateKey(selectedDate);

  // Sync from Supabase on mount + cleanup old data
  useEffect(() => {
    if (!user) return;
    loadUserData().then(() => {
      loadFoods();
      cleanupOldFoodData();
    });
  }, [user?.id]);
  const dailyCalories = onboarding.dailyCalories || 2000;
  const macroTargets = onboarding.macros || { protein: 150, carbs: 250, fat: 65 };

  const loadFoods = useCallback(() => {
    setFoods(getFoods(dateKey));
  }, [dateKey]);

  useEffect(() => {
    loadFoods();
  }, [loadFoods]);

  const consumedCals = foods.reduce((s, f) => s + (f.calories || 0), 0);
  const consumedMacros = foods.reduce(
    (s, f) => ({
      protein: s.protein + (f.protein || 0),
      carbs: s.carbs + (f.carbs || 0),
      fat: s.fat + (f.fat || 0),
    }),
    { protein: 0, carbs: 0, fat: 0 }
  );

  const handleAddFood = (food) => {
    const updated = addFood(dateKey, food);
    syncFoodData(dateKey, updated);
    setFoods(updated);
    setShowModal(false);
    if (isDayComplete(dateKey, dailyCalories)) {
      const newStreak = checkAndUpdateStreak(dateKey);
      setStreak(newStreak);
    }
  };

  const handleDeleteFood = (id) => {
    const updated = deleteFood(dateKey, id);
    syncFoodData(dateKey, updated);
    setFoods(updated);
  };

  const weekData = getWeekData(selectedDate).filter(d => d.calories > 0);

  const handleDateSelect = (d) => {
    setSelectedDate(d);
  };

  return (
    <div className="pb-4">
      <Header name={onboarding.name} streak={streak} />
      <DateSelector selectedDate={selectedDate} onSelect={handleDateSelect} />
      <CaloriesCard consumed={consumedCals} target={dailyCalories} />
      <div className="flex items-center gap-2 mb-3 mt-1">
        <div className="h-3 w-0.5 rounded-full bg-white/20" />
        <span className="text-[11px] font-semibold text-white/30 tracking-widest uppercase">Macronutrients</span>
      </div>
      <MacroCards consumed={consumedMacros} targets={macroTargets} />
      <div className="flex items-center gap-2 mb-3 mt-1">
        <div className="h-3 w-0.5 rounded-full bg-white/20" />
        <span className="text-[11px] font-semibold text-white/30 tracking-widest uppercase">{foods.length > 0 ? "Today's Meals" : 'Nutrition Log'}</span>
      </div>
      <MealList foods={foods} onDelete={handleDeleteFood} />
      <Suspense fallback={<div className="h-[200px] bg-white/[0.02] rounded-[20px]" />}>
        <WeeklyChart data={weekData} />
      </Suspense>

      {showModal && (
        <AddFoodModal dateKey={dateKey} onClose={() => { loadFoods(); setShowModal(false); }} onAdd={handleAddFood} />
      )}

      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30 w-14 h-14 rounded-full bg-white text-black shadow-[0_4px_20px_rgba(255,255,255,0.2)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1c1c1e" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
    </div>
  );
}
