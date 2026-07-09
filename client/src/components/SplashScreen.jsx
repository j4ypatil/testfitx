export default function SplashScreen({ onStart }) {
  return (
    <div className="min-h-screen bg-[#121212] flex flex-col">
      <div className="flex items-center justify-between px-6 pt-6">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="FitX" className="h-7 w-auto rounded-lg object-contain" />
          <span className="text-foreground font-bold text-sm tracking-tight">FitX</span>
        </div>
        <div className="bg-dark-card/70 backdrop-blur-sm border border-[#38383a] rounded-full px-4 py-1.5 text-xs text-dark-muted font-medium">
          English
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-[260px] mx-auto mb-10">
          <svg viewBox="0 0 240 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full drop-shadow-xl">
            <rect x="20" y="20" width="200" height="380" rx="32" fill="#2c2c2e" stroke="#38383a" strokeWidth="1.5" />
            <rect x="28" y="28" width="184" height="364" rx="28" fill="#121212" />
            <rect x="95" y="12" width="50" height="6" rx="3" fill="#f5f5f7" />
            <rect x="95" y="380" width="50" height="4" rx="2" fill="#f5f5f7" opacity="0.3" />
            <circle cx="120" cy="140" r="40" fill="none" stroke="#38383a" strokeWidth="6" />
            <circle cx="120" cy="140" r="40" fill="none" stroke="#f5f5f7" strokeWidth="6" strokeDasharray="251.2" strokeDashoffset="75" strokeLinecap="round" transform="rotate(-90 120 140)" />
            <text x="120" y="145" textAnchor="middle" fill="#f5f5f7" fontSize="14" fontWeight="bold" fontFamily="Space Grotesk">1,450</text>
            <rect x="48" y="200" width="144" height="12" rx="6" fill="#ff4d4d" opacity="0.15" />
            <rect x="48" y="215" width="144" height="12" rx="6" fill="#ff9f0a" opacity="0.15" />
            <rect x="48" y="230" width="144" height="12" rx="6" fill="#0a84ff" opacity="0.15" />
            <rect x="48" y="200" width="96" height="12" rx="6" fill="#ff4d4d" opacity="0.6" />
            <rect x="48" y="215" width="120" height="12" rx="6" fill="#ff9f0a" opacity="0.6" />
            <rect x="48" y="230" width="60" height="12" rx="6" fill="#0a84ff" opacity="0.6" />
            <rect x="32" y="270" width="176" height="1" fill="#38383a" />
            <rect x="32" y="286" width="176" height="10" rx="5" fill="#2c2c2e" />
            <rect x="32" y="302" width="176" height="10" rx="5" fill="#2c2c2e" />
            <rect x="32" y="318" width="176" height="10" rx="5" fill="#2c2c2e" />
          </svg>
        </div>

        <h1 className="text-[42px] leading-[1.05] font-bold text-foreground text-center tracking-tight">
          Calorie tracking
          <br />
          made easy
        </h1>
      </div>

      <div className="px-6 pb-12 space-y-4">
        <button
          onClick={onStart}
          className="w-full py-4 rounded-full bg-foreground text-white text-base font-semibold tracking-tight active:scale-[0.98] transition-transform"
        >
          Get Started
        </button>
        <p className="text-center text-sm text-dark-muted">
          Already have an account?{' '}
          <button className="text-foreground font-semibold underline underline-offset-2">
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}
