export default function WeightTransitionScreen({ onBack, onContinue, goalDirection = 'lose' }) {
  const footerText = goalDirection === 'lose'
    ? "Based on fitcal's historical data, weight loss is usually delayed at first, but after 7 days, you can burn fat like crazy!"
    : "Based on fitcal's historical data, weight gain is usually delayed at first, but after 7 days, your body starts responding fast!";

  // Chart dimensions
  const w = 280, h = 180, padL = 10, padR = 10, padT = 10, padB = 30;
  const cx = padL, cy = h - padB;
  const xScale = (i) => cx + ((w - padL - padR) / 2) * i;
  const yScale = (v) => cy - ((h - padT - padB) / 100) * v;

  const pts = [
    { x: xScale(0), y: yScale(20) },
    { x: xScale(1), y: yScale(25) },
    { x: xScale(2), y: yScale(85) },
  ];

  const flatPath = `M${pts[0].x},${pts[0].y} L${pts[1].x},${pts[1].y}`;
  const steepPath = `M${pts[1].x},${pts[1].y} L${pts[2].x},${pts[2].y}`;
  const areaPath = `${steepPath} L${pts[2].x},${cy} L${pts[1].x},${cy} Z`;

  const labels = ['3 Days', '7 Days', '30 Days'];

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col max-w-sm mx-auto p-6">
      {/* 1. Header */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="w-[42%] h-full bg-white rounded-full" />
        </div>
      </div>

      {/* 2. Headline */}
      <h1 className="text-[36px] leading-[1.15] font-bold text-white mb-10">
        You have great potential to crush your goal
      </h1>

      {/* 3. Card */}
      <div className="bg-[#1c1c1e] rounded-3xl p-6">
        <h2 className="text-[22px] font-bold text-white mb-6">Your weight transition</h2>

        {/* Chart */}
        <div className="w-full mb-6 flex justify-center">
          <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
            <defs>
              <linearGradient id="amberFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f5a35c" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#f5a35c" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Gridlines */}
            <line x1={padL} y1={yScale(40)} x2={w - padR} y2={yScale(40)} stroke="#ffffff15" strokeDasharray="4 4" />
            <line x1={padL} y1={yScale(60)} x2={w - padR} y2={yScale(60)} stroke="#ffffff15" strokeDasharray="4 4" />

            {/* Area fill (steep segment only) */}
            <path d={areaPath} fill="url(#amberFill)" />

            {/* Flat segment line */}
            <path d={flatPath} stroke="#ffffff60" strokeWidth={2.5} fill="none" strokeLinecap="round" />

            {/* Steep segment line */}
            <path d={steepPath} stroke="#f5a35c" strokeWidth={2.5} fill="none" strokeLinecap="round" />

            {/* Dot at Day 3 */}
            <circle cx={pts[0].x} cy={pts[0].y} r={4.5} fill="#ffffff60" />

            {/* Dot at Day 7 */}
            <circle cx={pts[1].x} cy={pts[1].y} r={4.5} fill="#f5a35c" />

            {/* Trophy badge at Day 30 */}
            <circle cx={pts[2].x} cy={pts[2].y} r={14} fill="#f5a35c" />
            <g transform={`translate(${pts[2].x - 7}, ${pts[2].y - 7})`}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C6.5 4 6 9 6 9z" />
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5C17.5 4 18 9 18 9z" />
                <path d="M4 22h16" />
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
              </svg>
            </g>

            {/* Axis labels */}
            {labels.map((l, i) => (
              <text key={l} x={pts[i].x} y={h - 6} textAnchor="middle" fill="#9ca3af" fontSize={11} fontFamily="system-ui">
                {l}
              </text>
            ))}
          </svg>
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
