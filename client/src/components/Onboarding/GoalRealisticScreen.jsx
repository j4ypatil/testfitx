export default function GoalRealisticScreen({ onBack, onContinue, goalWeightDiff, weightUnit = 'kg', socialProofPercent = 90 }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col max-w-sm mx-auto p-6">
      {/* 1. Header */}
      <div className="flex items-center justify-between mb-16">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="w-1/4 h-full bg-white rounded-full" />
        </div>
      </div>

      {/* 2. Headline */}
      <h1 className="text-[36px] leading-[1.15] font-bold text-white text-center">
        Losing <span className="text-[#f5a35c]">{goalWeightDiff} {weightUnit}</span> is a realistic target. It's not hard at all!
      </h1>

      {/* 3. Subtext */}
      <p className="text-center text-[#9ca3af] text-sm leading-relaxed mt-4 max-w-xs mx-auto">
        {socialProofPercent}% of users say that the change is obvious after using fitcal and it is not easy to rebound.
      </p>

      {/* 4. Spacer */}
      <div className="flex-1" />

      {/* 5. Bottom Button */}
      <button onClick={onContinue} className="w-full py-4 rounded-full bg-white text-black font-bold text-lg hover:bg-white/90 transition-all">
        Continue
      </button>
    </div>
  );
}
