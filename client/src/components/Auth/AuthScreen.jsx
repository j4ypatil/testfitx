import { useState } from 'react';
import { supabase } from '../../utils/supabase.js';

export default function AuthScreen() {
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({ phone });
      if (error) throw error;
      setStep('otp');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const { error } = await supabase.auth.verifyOtp({ phone, token: otp, type: 'sms' });
      if (error) throw error;
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-foreground tracking-tight">FitCal</h1>
          <p className="text-dark-muted text-sm mt-2">Sign in with your phone</p>
        </div>

        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <input
                type="tel"
                placeholder="+91 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-dark-card border border-dark-border rounded-2xl px-5 py-4 text-foreground text-base outline-none focus:border-accent transition-colors placeholder:text-dark-muted/50"
                required
                autoFocus
              />
            </div>

            {error && <p className="text-sm text-center text-[#ff453a]">{error}</p>}

            <button
              type="submit"
              disabled={busy || !phone}
              className="w-full py-4 rounded-2xl bg-accent text-white font-bold text-base disabled:opacity-50"
            >
              {busy ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <p className="text-dark-muted text-sm text-center">
              Enter the code sent to <span className="text-foreground font-semibold">{phone}</span>
            </p>
            <div>
              <input
                type="text"
                inputMode="numeric"
                placeholder="000000"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-dark-card border border-dark-border rounded-2xl px-5 py-4 text-foreground text-2xl font-bold text-center tracking-widest outline-none focus:border-accent transition-colors placeholder:text-dark-muted/50"
                required
                autoFocus
              />
            </div>

            {error && <p className="text-sm text-center text-[#ff453a]">{error}</p>}

            <button
              type="submit"
              disabled={busy || otp.length < 4}
              className="w-full py-4 rounded-2xl bg-accent text-white font-bold text-base disabled:opacity-50"
            >
              {busy ? 'Verifying...' : 'Verify & Sign In'}
            </button>

            <button
              type="button"
              onClick={() => { setStep('phone'); setOtp(''); setError(''); }}
              className="w-full text-dark-muted text-sm hover:text-foreground transition-colors"
            >
              Change phone number
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
