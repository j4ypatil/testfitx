import { useState } from 'react';
import { calculateBMR, calculateTDEE, adjustCalories } from '../../utils/tdee.js';
import { calculateMacros } from '../../utils/macros.js';

function DonutChart({ carbs, protein, fat }) {
  const carbCal = carbs * 4, proteinCal = protein * 4, fatCal = fat * 9;
  const total = carbCal + proteinCal + fatCal;
  const r = 54, cx = 80, cy = 80, circ = 2 * Math.PI * r;

  const segments = [
    { key: 'protein', value: proteinCal / total, color: '#F04B6E', label: 'Protein' },
    { key: 'fat', value: fatCal / total, color: '#4C8DFF', label: 'Fat' },
    { key: 'carbs', value: carbCal / total, color: '#E3A93B', label: 'Carbs' },
  ];

  let offset = 0;
  const arcs = segments.map(s => {
    const len = s.value * circ;
    const o = offset;
    offset += len;
    return { ...s, dasharray: `${len} ${circ - len}`, dashoffset: -o };
  });

  const pct = (v) => Math.round(v * 100);

  return (
    <div className="flex items-center gap-5">
      <svg width="160" height="160" viewBox="0 0 160 160" className="shrink-0">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#2A2A2E" strokeWidth="22" />
        {arcs.map(a => (
          <circle key={a.key} cx={cx} cy={cy} r={r} fill="none" stroke={a.color} strokeWidth="22"
            strokeDasharray={a.dasharray} strokeDashoffset={a.dashoffset}
            transform={`rotate(-90 ${cx} ${cy})`} strokeLinecap="butt" />
        ))}
        <text x={cx} y={cy - 8} textAnchor="middle" fill="#F4F2ED" fontSize="20" fontFamily="'Space Grotesk',sans-serif" fontWeight="700">{Math.round(total)}</text>
        <text x={cx} y={cy + 14} textAnchor="middle" fill="#8B8A91" fontSize="11" fontFamily="Inter,sans-serif">kcal</text>
      </svg>
      <div className="space-y-2.5">
        {segments.map(s => (
          <div key={s.key} className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
            <span className="text-[#8B8A91] text-xs font-['Inter'] w-12">{s.label}</span>
            <span className="text-[#F4F2ED] text-sm font-['Space_Grotesk'] font-bold w-10">{s.key === 'carbs' ? carbs : s.key === 'protein' ? protein : fat}g</span>
            <span className="text-[#5C5B61] text-xs font-['Inter']">{pct(s.value)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function getTargetDate(timeline) {
  const d = new Date();
  if (timeline === '1month') d.setMonth(d.getMonth() + 1);
  else if (timeline === '6months') d.setMonth(d.getMonth() + 6);
  else d.setMonth(d.getMonth() + 3);
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
}

const timelineLabels = {
  lose_fat: 'You should lose',
  build_muscle: 'You should gain',
  maintain: 'You should maintain',
  body_recomp: 'Your target',
};

export default function PlanReadyScreen({ data, onBack, onSubmit }) {
  const [editMode, setEditMode] = useState(false);
  const bmr = calculateBMR(Number(data.currentWeight), Number(data.height), Number(data.age), data.gender);
  const tdee = calculateTDEE(bmr, data.activityLevel);
  const dailyCalories = adjustCalories(tdee, data.goalType, data.timeline || '3months');
  const macros = calculateMacros(dailyCalories, data.goalType);
  const diff = Math.abs(Number(data.currentWeight) - Number(data.goalWeight));
  const targetLabel = timelineLabels[data.goalType] || 'Target';
  const targetDate = getTargetDate(data.timeline);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0A0A0B' }}>
      <div className="flex-1 px-6 pt-6 pb-4 overflow-y-auto max-w-sm mx-auto w-full">
        {/* Back + Progress */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity" style={{ background: '#2A2A2E' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F4F2ED" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <div className="w-20 h-1 rounded-full overflow-hidden" style={{ background: '#2A2A2E' }}>
            <div className="h-full rounded-full" style={{ width: '92%', background: '#F4F2ED' }} />
          </div>
        </div>

        {/* Checkmark circle + Headline */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mb-5" style={{ background: '#F4F2ED' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A0A0B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="text-[26px] font-bold text-center leading-tight" style={{ fontFamily: "'Space Grotesk',sans-serif", color: '#F4F2ED' }}>
            Your custom plan is ready
          </h1>
        </div>

        {/* You should lose / gain badge */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-xs uppercase tracking-wider" style={{ color: '#8B8A91', fontFamily: 'Inter,sans-serif' }}>{targetLabel}</span>
          <span className="text-sm font-bold px-3.5 py-1.5 rounded-full" style={{ background: '#151517', border: '1px solid #2A2A2E', color: '#F4F2ED', fontFamily: "'Space Grotesk',sans-serif" }}>
            {diff} kg by {targetDate}
          </span>
        </div>

        {/* Card */}
        <div className="rounded-3xl p-5 mb-4" style={{ background: '#151517', border: '1px solid #2A2A2E' }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <span className="text-sm font-semibold" style={{ color: '#F4F2ED', fontFamily: 'Inter,sans-serif' }}>Daily recommendation</span>
            <button onClick={() => setEditMode(!editMode)} className="text-xs font-medium underline underline-offset-2" style={{ color: '#5C5B61' }}>
              {editMode ? 'Done' : 'Edit anytime'}
            </button>
          </div>

          {/* Donut + Legend */}
          <DonutChart carbs={macros.carbs} protein={macros.protein} fat={macros.fat} />

          {/* Divider */}
          <div className="my-5 h-px" style={{ background: '#2A2A2E' }} />

          {/* Health score */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#38C793" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
              <span className="text-sm" style={{ color: '#8B8A91', fontFamily: 'Inter,sans-serif' }}>Health score</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold" style={{ color: '#F4F2ED', fontFamily: "'Space Grotesk',sans-serif" }}>7/10</span>
              <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: '#2A2A2E' }}>
                <div className="h-full rounded-full" style={{ width: '70%', background: '#38C793' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 pb-10 pt-4 max-w-sm mx-auto w-full">
        <button onClick={onSubmit}
          className="w-full py-4 rounded-full font-bold text-base" style={{ background: '#F4F2ED', color: '#0A0A0B', fontFamily: "'Space Grotesk',sans-serif" }}>
          Let's get started
        </button>
      </div>
    </div>
  );
}
