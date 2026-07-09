import { useState, useEffect, useRef } from 'react';
import { House, Dumbbell, BarChart3, User, MessageSquare } from 'lucide-react';

const tabs = [
  { id: 0, label: 'Home', icon: House },
  { id: 1, label: 'Workouts', icon: Dumbbell },
  { id: 2, label: 'Progress', icon: BarChart3 },
  { id: 3, label: 'Community', icon: MessageSquare },
  { id: 4, label: 'Profile', icon: User },
];

export default function BottomNav({ activeTab, setActiveTab }) {
  const [indicatorLeft, setIndicatorLeft] = useState(0);
  const tabRefs = useRef([]);

  useEffect(() => {
    const el = tabRefs.current[activeTab];
    if (el) {
      const tabCenter = el.offsetLeft + el.offsetWidth / 2;
      setIndicatorLeft(tabCenter - 26);
    }
  }, [activeTab]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 flex items-center justify-center pb-5 pointer-events-none">
      <div className="relative w-[82%] max-w-[360px] pointer-events-auto">
        <div className="relative backdrop-blur-xl bg-[#1c1c1e]/95 rounded-[40px] shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex items-center h-[72px] px-3 border border-[#38383a]/60">
          <div
            className="absolute top-1/2 -translate-y-1/2 w-[52px] h-[52px] rounded-full bg-[#a1a1a6] transition-all duration-300 ease-out"
            style={{ left: indicatorLeft }}
          />

          {tabs.map((tab, i) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                ref={(el) => (tabRefs.current[i] = el)}
                onClick={() => setActiveTab(tab.id)}
                className="relative flex-1 flex flex-col items-center justify-center gap-0.5 h-full py-2 active:scale-90 transition-transform duration-200"
              >
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  className={isActive ? 'text-[#1c1c1e]' : 'text-[#636366]'}
                />
                <span
                  className={`text-[10px] leading-tight ${
                    isActive
                      ? 'font-semibold text-[#1c1c1e]'
                      : 'font-medium text-[#636366]'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
