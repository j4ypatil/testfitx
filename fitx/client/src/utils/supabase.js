import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ymznqoxdjpvqhbhidpju.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inltem5xb3hkanB2cWhiaGlkcGp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0Mjk1MDUsImV4cCI6MjA5OTAwNTUwNX0._Bw0BASQt7kVvZP5SmAbrPsutcRsRi_nOiGq0Bb-ojU';
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

let _supabase = null;
if (isSupabaseConfigured) {
  try {
    _supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (e) {
    console.warn('Supabase init failed:', e);
  }
}
export const supabase = _supabase;
