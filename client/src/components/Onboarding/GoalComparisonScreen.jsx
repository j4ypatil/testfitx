export default function GoalComparisonScreen({ onBack, onContinue, goalDirection = 'lose', withoutPercent = 20, multiplier = '2X' }) {
  const isLose = goalDirection === 'lose';
  const headline = isLose
    ? 'Lose twice as much weight with fitcal vs on your own'
    : 'Gain twice as much weight with fitcal vs on your own';
  const footerText = 'fitcal makes it easy and holds you accountable.';

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col max-w-sm mx-auto p-6">
      {/* 1. Header */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="w-[35%] h-full bg-white rounded-full" />
        </div>
      </div>

      {/* 2. Headline */}
      <h1 className="text-[36px] leading-[1.15] font-bold text-white mb-10">
        {headline}
      </h1>

      {/* 3. Card */}
      <div className="bg-[#1c1c1e] rounded-3xl p-6">
        {/* Two columns */}
        <div className="flex items-end justify-center gap-7 mb-6">
          {/* Left column - Without fitcal */}
          <div className="flex flex-col items-center gap-3 w-[100px]">
            <span className="text-[11px] font-semibold text-white/60 text-center leading-tight">
              Without<br />fitcal
            </span>
            <div className="w-full bg-white rounded-2xl flex flex-col items-center justify-end pb-2" style={{ height: '140px' }}>
              <span className="text-xs font-bold text-black/60 bg-gray-200 px-3 py-1 rounded-full">
                {withoutPercent}%
              </span>
            </div>
          </div>

          {/* Right column - With fitcal */}
          <div className="flex flex-col items-center gap-3 w-[100px]">
            <span className="text-[11px] font-semibold text-white/60 text-center leading-tight">
              With<br />fitcal
            </span>
            <div className="w-full bg-white rounded-2xl flex flex-col items-center justify-end pb-2 relative overflow-hidden" style={{ height: '200px' }}>
              <div className="absolute bottom-0 left-0 right-0 bg-black rounded-2xl flex items-center justify-center" style={{ height: '70%' }}>
                <span className="text-white font-bold text-lg">{multiplier}</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-[#9ca3af] text-sm leading-relaxed">
          {footerText}
        </p>
      </div>

      {/* 4. Spacer */}
      <div className="flex-1" />

      {/* 5. Bottom Button */}
      <button onClick={onContinue} className="w-full py-4 rounded-full bg-white text-black font-bold text-lg hover:bg-white/90 transition-all">
        Continue
      </button>
    </div>
  );
}
