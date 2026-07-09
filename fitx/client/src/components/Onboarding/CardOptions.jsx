import { Check } from 'lucide-react';

export default function CardOptions({ options, selected, onSelect, layout = 'grid' }) {
  const isCardLayout = layout === 'card';
  const gridClass = isCardLayout ? 'grid-cols-2' : (layout === 'row' ? 'grid-cols-2' : 'grid-cols-1');

  const renderIcon = (opt) => {
    if (!opt.icon) return null;
    if (typeof opt.icon === 'string' && (opt.icon.startsWith('/images/') || opt.icon.startsWith('data:') || /\.(svg|png|jpg|jpeg|webp|gif|avif)$/i.test(opt.icon))) {
      return <img src={`${opt.icon}?v=1`} alt={opt.label} className="w-full h-full object-cover" />;
    }
    if (typeof opt.icon === 'string') {
      return <span className="text-xl">{opt.icon}</span>;
    }
    return opt.icon;
  };

  return (
    <div className={`grid ${gridClass} gap-3 w-full`}>
      {options.map((opt) => {
        const isSelected = selected === opt.value;
        if (isCardLayout) {
          return (
            <button
              key={opt.value}
              onClick={() => onSelect(opt.value)}
              className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-200 text-center
                ${isSelected ? 'border-accent bg-accent/5' : 'border-light-border bg-light-card hover:border-light-muted'}`}
            >
              <div className={`w-full aspect-[3/4] rounded-xl overflow-hidden shrink-0
                ${isSelected ? 'ring-2 ring-accent' : ''}`}>
                {opt.icon ? renderIcon(opt) : <div className="w-full h-full bg-[#2c2c2e]" />}
              </div>
              <div className="font-semibold text-foreground text-sm leading-tight">{opt.label}</div>
              {isSelected && <Check size={14} className="text-accent shrink-0" />}
            </button>
          );
        }
        return (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left
              ${isSelected ? 'border-accent bg-accent/5' : 'border-light-border bg-light-card hover:border-light-muted'}`}
          >
            {opt.icon && (
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg shrink-0 overflow-hidden
                ${isSelected ? 'bg-accent/10' : 'bg-[#f0f0f5]'}`}>
                {renderIcon(opt)}
              </div>
            )}
            <div className="flex-1">
              <div className="font-semibold text-foreground text-base">{opt.label}</div>
              {opt.sub && <div className="text-xs text-light-muted mt-0.5">{opt.sub}</div>}
            </div>
            {isSelected && (
              <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center shrink-0">
                <Check size={14} className="text-white" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
