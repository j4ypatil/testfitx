import { Flame, Wheat, Drumstick, Droplet, Pencil, Heart, ChevronRight } from 'lucide-react';
import { calculateBMR, calculateTDEE, adjustCalories } from '../../utils/tdee.js';
import { calculateMacros } from '../../utils/macros.js';

function MacroCard({ label, value, unit, icon: Icon, color, arcColor }) {
  const radius = 30;
  const stroke = 4;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (0.75 * circumference); // Just a visual arc

  return (
    <div className="bg-[#1c1c1e] border border-[#2A2A2E] rounded-2xl p-4 flex flex-col items-center relative">
      <div className="flex items-center gap-2 mb-3 self-start">
        <Icon size={14} style={{ color: arcColor }} />
        <span className="text-xs text-[#8B8A91] font-['Inter']">{label}</span>
      </div>
      <div className="relative flex items-center justify-center mb-2">
        <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
          <circle stroke="#2A2A2E" strokeWidth={stroke} fill="transparent" r={normalizedRadius} cx={radius} cy={radius} />
          <circle stroke={arcColor} strokeWidth={stroke} fill="transparent" r={normalizedRadius} cx={radius} cy={radius} strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" />
        </svg>
        <span className="absolute text-sm font-['Space_Grotesk'] font-bold text-[#F4F2ED]">
          {value}<span className="text-[10px] text-[#5C5B61]">{unit}</span>
        </span>
      </div>
      <Pencil size={12} className="absolute bottom-3 right-3 text-[#5C5B61] cursor-pointer hover:text-[#F4F2ED]" />
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

export default function PlanReadyScreen({ data, onBack, onSubmit }) {
  const totalInches = Number(data.heightFeet || 0) * 12 + Number(data.heightInches || 0);
  const heightCm = data.height || (totalInches * 2.54);
  const bmr = calculateBMR(Number(data.currentWeight), heightCm, Number(data.age), data.gender);
  const tdee = calculateTDEE(bmr, data.activityLevel);
  const dailyCalories = adjustCalories(tdee, data.goalType, data.timeline || '3months');
  const macros = calculateMacros(dailyCalories, data.goalType);
  const diff = Math.abs(Number(data.currentWeight) - Number(data.goalWeight));
  const targetDate = getTargetDate(data.timeline);
  const goalText = data.currentWeight > data.goalWeight ? 'lose' : 'gain';

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0B] text-[#F4F2ED] p-6 max-w-sm mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#151517' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F4F2ED" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <div className="flex-1 ml-4 h-1 rounded-full bg-[#2A2A2E] overflow-hidden">
          <div className="h-full bg-[#F4F2ED]" style={{ width: '92%' }} />
        </div>
      </div>

      {/* Headline */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-[#F4F2ED]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A0A0B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h1 className="text-[28px] font-bold text-center leading-tight mb-6" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
          Congratulations<br />your custom plan is ready!
        </h1>
        <div className="text-[#8B8A91] text-sm mb-2">You should {goalText}:</div>
        <div className="bg-[#151517] text-[#F4F2ED] text-sm font-bold px-5 py-2.5 rounded-full border border-[#2A2A2E]">
          {goalText.charAt(0).toUpperCase() + goalText.slice(1)} {diff} kg by {targetDate}
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-[#151517] border border-[#2A2A2E] rounded-3xl p-5 mb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-[#F4F2ED]">Daily recommendation</h2>
          <span className="text-xs text-[#5C5B61]">You can edit this anytime</span>
        </div>

        {/* 2x2 Macro Grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <MacroCard label="Calories" value={Math.round(dailyCalories)} unit="" icon={Flame} arcColor="#8B8A91" />
          <MacroCard label="Carbs" value={macros.carbs} unit="g" icon={Wheat} arcColor="#E3A93B" />
          <MacroCard label="Protein" value={macros.protein} unit="g" icon={Drumstick} arcColor="#F04B6E" />
          <MacroCard label="Fats" value={macros.fat} unit="g" icon={Droplet} arcColor="#4C8DFF" />
        </div>

        {/* Health Score */}
        <div className="bg-[#0A0A0B] rounded-2xl p-4 flex items-center justify-between border border-[#2A2A2E]">
          <div className="flex items-center gap-3">
            <Heart size={18} className="text-[#F04B6E]" />
            <span className="text-sm text-[#F4F2ED]">Health Score</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold">7/10</span>
            <div className="w-16 h-1.5 rounded-full bg-[#2A2A2E] overflow-hidden">
              <div className="h-full bg-[#38C793]" style={{ width: '70%' }} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1" />

      {/* CTA */}
      <button onClick={onSubmit} className="w-full py-4 rounded-full bg-[#F4F2ED] text-[#0A0A0B] font-bold text-base hover:bg-white transition-all mb-4" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
        Let's get started!
      </button>
    </div>
  );
}
