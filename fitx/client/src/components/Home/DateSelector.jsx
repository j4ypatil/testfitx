import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function DateSelector({ selectedDate, onSelect }) {
  const today = new Date();
  const dates = [];
  for (let i = -1; i < 5; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d);
  }

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const isToday = (d) => {
    const t = new Date();
    return d.getDate() === t.getDate() && d.getMonth() === t.getMonth() && d.getFullYear() === t.getFullYear();
  };

  const isSelected = (d) => {
    return d.getDate() === selectedDate.getDate() && d.getMonth() === selectedDate.getMonth() && d.getFullYear() === selectedDate.getFullYear();
  };

  const canGoPrev = dates[0] > new Date(today.getFullYear(), today.getMonth(), today.getDate() - 14);
  const canGoNext = dates[dates.length - 1] < new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);

  const goPrev = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    onSelect(d);
  };

  const goNext = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    onSelect(d);
  };

  return (
    <div className="flex items-center gap-1 mb-5">
      <button onClick={goPrev} disabled={!canGoPrev} className="w-8 h-8 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center disabled:opacity-20 hover:bg-white/[0.06] transition-colors">
        <ChevronLeft size={14} className="text-white/50" />
      </button>
      <div className="flex-1 flex gap-1.5 overflow-x-auto scrollbar-hide justify-center">
        {dates.map((d) => {
          const sel = isSelected(d);
          const todayFlag = isToday(d);
          return (
            <button
              key={d.toISOString()}
              onClick={() => onSelect(d)}
              className={`flex flex-col items-center py-2.5 px-3.5 rounded-2xl transition-all duration-200 min-w-[52px] ${
                sel
                  ? 'bg-white/10 border border-white/20'
                  : 'bg-transparent border border-transparent hover:bg-white/[0.03]'
              }`}
            >
              <span className={`text-[9px] font-semibold tracking-wide uppercase mb-1 ${sel ? 'text-white/80' : 'text-white/30'}`}>
                {dayNames[d.getDay()].slice(0, 3)}
              </span>
              <span className={`text-lg font-bold leading-none ${sel ? 'text-white' : 'text-white/50'}`}>
                {String(d.getDate()).padStart(2, '0')}
              </span>
              {todayFlag && (
                <span className={`text-[8px] mt-1 font-semibold tracking-wide ${sel ? 'text-white/60' : 'text-white/20'}`}>
                  TODAY
                </span>
              )}
            </button>
          );
        })}
      </div>
      <button onClick={goNext} disabled={!canGoNext} className="w-8 h-8 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center disabled:opacity-20 hover:bg-white/[0.06] transition-colors">
        <ChevronRight size={14} className="text-white/50" />
      </button>
    </div>
  );
}
