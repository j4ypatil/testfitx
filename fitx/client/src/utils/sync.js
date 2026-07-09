import { supabase } from './supabase.js';

export async function getCurrentUserId() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data?.user?.id || null;
}

export async function syncFoodData(date, foods) {
  const userId = await getCurrentUserId();
  if (!userId) return;
  await supabase.from('daily_data').upsert(
    { user_id: userId, date, key: 'foods', value: foods },
    { onConflict: 'user_id,date,key', ignoreDuplicates: false }
  );
}

export async function cleanupOldFoodData() {
  const userId = await getCurrentUserId();
  if (!userId) return;
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const cutoff = weekAgo.toISOString().split('T')[0];

  const { data: oldData } = await supabase
    .from('daily_data')
    .select('date, value')
    .eq('user_id', userId)
    .eq('key', 'foods')
    .lt('date', cutoff);

  if (!oldData || oldData.length === 0) return;

  const summaries = oldData.map(d => {
    const foods = d.value || [];
    return {
      user_id: userId,
      date: d.date,
      key: 'summary',
      value: {
        calories: foods.reduce((s, f) => s + (f.calories || 0), 0),
        protein: foods.reduce((s, f) => s + (f.protein || 0), 0),
        carbs: foods.reduce((s, f) => s + (f.carbs || 0), 0),
        fat: foods.reduce((s, f) => s + (f.fat || 0), 0),
      },
    };
  });

  await supabase.from('daily_data').delete().eq('user_id', userId).eq('key', 'foods').lt('date', cutoff);

  for (const s of summaries) {
    await supabase.from('daily_data').upsert(s, { onConflict: 'user_id,date,key', ignoreDuplicates: false });
  }
}

export async function loadUserData() {
  const userId = await getCurrentUserId();
  if (!userId) return;

  const { data } = await supabase
    .from('daily_data')
    .select('date, key, value')
    .eq('user_id', userId);

  if (!data) return;

  for (const row of data) {
    if (row.key === 'foods') {
      localStorage.setItem('fitx_foods_' + row.date, JSON.stringify(row.value));
    }
    if (row.key === 'summary') {
      localStorage.setItem('fitx_summary_' + row.date, JSON.stringify(row.value));
    }
  }

  const { data: userData } = await supabase
    .from('user_data')
    .select('key, value')
    .eq('user_id', userId);

  if (userData) {
    for (const row of userData) {
      localStorage.setItem('fitx_' + row.key, JSON.stringify(row.value));
    }
  }
}
