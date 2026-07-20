import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';

const data = [
  { month: 'M1', diet: 95, fitcal: 95 },
  { month: 'M2', diet: 85, fitcal: 90 },
  { month: 'M3', diet: 90, fitcal: 85 },
  { month: 'M4', diet: 95, fitcal: 80 },
  { month: 'M5', diet: 100, fitcal: 78 },
  { month: 'M6', diet: 105, fitcal: 76 },
];

export default function LongTermResultsScreen({ onBack, onContinue, stat = '80%', statText = 'of fitcal users maintain their weight loss even 6 months later' }) {
  return (
    <div className="min-h-screen bg-white flex flex-col max-w-sm mx-auto p-6">
      {/* 1. Header */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <div className="w-20 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="w-1/6 h-full bg-black rounded-full" />
        </div>
      </div>

      {/* 2. Headline */}
      <h1 className="text-[40px] leading-[1.1] font-bold text-black mb-8">
        fitcal creates<br />long-term results
      </h1>

      {/* 3. Card */}
      <div className="bg-gray-50 rounded-3xl p-6 mb-8">
        <h2 className="text-2xl font-bold text-black mb-6">Your weight</h2>
        
        <div className="h-48 w-full mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
              <YAxis hide domain={[70, 110]} />
              <Line type="monotone" dataKey="fitcal" stroke="#000000" strokeWidth={3} dot={{r: 4, fill: '#000000'}} />
              <Line type="monotone" dataKey="diet" stroke="#f87171" strokeWidth={3} dot={{r: 4, fill: '#f87171'}} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <p className="text-center text-gray-500 text-sm leading-relaxed">
          <span className="font-bold text-black">{stat} </span>
          {statText}
        </p>
      </div>

      {/* 4. Bottom Button */}
      <button onClick={onContinue} className="mt-auto w-full py-4 rounded-full bg-black text-white font-bold text-lg hover:bg-gray-800 transition-all">
        Continue
      </button>
    </div>
  );
}
