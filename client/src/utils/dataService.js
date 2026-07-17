import { supabase } from './supabase.js';

/**
 * Data Service to handle Supabase operations
 * Provides a uniform API for data access with error handling
 */

export const dataService = {
  // --- Auth/User Data ---
  async getUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },

  // --- Workout Plans ---
  async getWorkoutPlan(userId) {
    const { data, error } = await supabase
      .from('workout_plans')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw error;
    return data ? data.plan : null;
  },

  async saveWorkoutPlan(userId, plan) {
    const { error } = await supabase
      .from('workout_plans')
      .upsert({ user_id: userId, plan: plan }, { onConflict: 'user_id' });
    if (error) throw error;
  },

  // --- Exercise History ---
  async getExerciseHistory(userId) {
    const { data, error } = await supabase
      .from('exercise_history')
      .select('*')
      .eq('user_id', userId);
    if (error) throw error;
    return data || [];
  },

  async saveExerciseHistory(userId, history) {
    const { error } = await supabase
      .from('exercise_history')
      .upsert({ user_id: userId, history: history }, { onConflict: 'user_id' });
    if (error) throw error;
  },

  // --- Add more methods as needed (foods, weights, etc.) ---
};
