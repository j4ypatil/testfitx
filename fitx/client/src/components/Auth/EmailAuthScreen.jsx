import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function EmailAuthScreen() {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [justSignedUp, setJustSignedUp] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    if (mode === 'login') {
      const { error } = await login(email, password);
      if (error) setError(error.message);
    } else {
      const { error } = await signup(email, password);
      if (error) {
        setError(error.message);
      } else {
        setJustSignedUp(true);
      }
    }
    setBusy(false);
  };

  if (justSignedUp) {
    return (
      <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          <img src="/logo.png" alt="FitX" className="w-16 h-16 object-contain mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Check your email</h1>
          <p className="text-foreground/60 text-sm leading-relaxed">
            We sent a confirmation link to<br />
            <span className="text-white font-semibold">{email}</span>
          </p>
          <p className="text-foreground/60 text-sm mt-4">
            Click the link in the email to verify your account, then sign in.
          </p>
          <button
            onClick={() => { setMode('login'); setJustSignedUp(false); }}
            className="mt-8 w-full py-4 rounded-2xl bg-accent text-white font-bold text-base"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <img src="/logo.png" alt="FitX" className="w-16 h-16 object-contain mx-auto mb-3" />
          <p className="text-foreground/60 text-sm mt-2">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-dark-card border border-dark-border rounded-2xl px-5 py-4 text-foreground text-base outline-none focus:border-accent transition-colors placeholder:text-foreground/30"
              required
              autoFocus
              autoComplete="email"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-dark-card border border-dark-border rounded-2xl px-5 py-4 text-foreground text-base outline-none focus:border-accent transition-colors placeholder:text-foreground/30"
              required
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          {error && <p className="text-sm text-center text-[#ff453a]">{error}</p>}

          <button
            type="submit"
            disabled={busy || !email || !password}
            className="w-full py-4 rounded-2xl bg-accent text-white font-bold text-base disabled:opacity-50"
          >
            {busy ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-foreground/60 mt-6">
          {mode === 'login' ? (
            <>No account?{' '}<button onClick={() => { setMode('signup'); setError(''); }} className="text-white font-semibold hover:underline">Sign up</button></>
          ) : (
            <>Already have an account?{' '}<button onClick={() => { setMode('login'); setError(''); }} className="text-white font-semibold hover:underline">Sign in</button></>
          )}
        </p>
      </div>
    </div>
  );
}
