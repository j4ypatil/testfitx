import { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../utils/supabase.js';

const AuthContext = createContext(null);
const LOCAL_USER_KEY = 'fitx_local_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const local = getLocalUser();
    if (!isSupabaseConfigured && local) {
      setUser(local);
      setLoading(false);
      return;
    }
    if (!isSupabaseConfigured) { setLoading(false); return; }

    let cancelled = false;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!cancelled) {
        if (session?.user) setUser(session.user);
        else setUser(getLocalUser());
        setLoading(false);
      }
    }).catch(() => {
      if (!cancelled) { setUser(getLocalUser()); setLoading(false); }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) setUser(session.user);
    });

    return () => { cancelled = true; subscription?.unsubscribe(); };
  }, []);

  const login = async (email, password) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error) return { error: null };
    }
    const localUser = { id: `local_${Date.now()}`, email, app_metadata: {}, user_metadata: { email } };
    setLocalUser(localUser);
    setUser(localUser);
    return { error: null };
  };

  const signup = async (email, password) => {
    if (isSupabaseConfigured) {
      const origin = window.location.hostname === 'localhost' ? 'https://testfitx.vercel.app' : window.location.origin;
      const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: origin } });
      if (!error && data?.user) return { error: null };
      if (error && !error.message?.includes('already')) return { error };
    }
    const localUser = { id: `local_${Date.now()}`, email, app_metadata: {}, user_metadata: { email } };
    setLocalUser(localUser);
    setUser(localUser);
    return { error: null };
  };

  const logout = async () => {
    localStorage.removeItem(LOCAL_USER_KEY);
    setUser(null);
    if (isSupabaseConfigured) await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, isSupabaseConfigured }}>
      {children}
    </AuthContext.Provider>
  );
}

function getLocalUser() {
  try { const d = localStorage.getItem(LOCAL_USER_KEY); return d ? JSON.parse(d) : null; } catch { return null; }
}
function setLocalUser(u) { localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(u)); }

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
