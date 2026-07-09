export default function ConfirmSuccess() {
  const handleContinue = () => {
    window.location.hash = '';
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20,6 9,17 4,12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Email confirmed!</h1>
        <p className="text-foreground/60 text-sm leading-relaxed">
          Your account has been verified. You can now sign in.
        </p>
        <button
          onClick={handleContinue}
          className="mt-8 w-full py-4 rounded-2xl bg-accent text-white font-bold text-base"
        >
          Go to Sign In
        </button>
      </div>
    </div>
  );
}
