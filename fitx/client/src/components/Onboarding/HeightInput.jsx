import { useState } from 'react';

export default function HeightInput({ value, onChange }) {
  const [unit, setUnit] = useState('cm');
  const [feet, setFeet] = useState('');
  const [inches, setInches] = useState('');

  const cm = unit === 'cm' ? value : '';

  const handleUnitToggle = (u) => {
    if (u === unit) return;
    if (u === 'cm' && feet && inches) {
      const totalInches = Number(feet) * 12 + Number(inches);
      onChange(String(Math.round(totalInches * 2.54)));
    }
    setUnit(u);
  };

  const handleFeetChange = (val) => {
    setFeet(val);
    const inchVal = inches || '0';
    if (val && inchVal) {
      const totalInches = Number(val) * 12 + Number(inchVal);
      onChange(String(Math.round(totalInches * 2.54)));
    }
  };

  const handleInchesChange = (val) => {
    setInches(val);
    const ftVal = feet || '0';
    if (ftVal && val) {
      const totalInches = Number(ftVal) * 12 + Number(val);
      onChange(String(Math.round(totalInches * 2.54)));
    }
  };

  const handleCmChange = (val) => {
    onChange(val);
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center gap-1.5 bg-dark-card border border-dark-border rounded-2xl p-1 w-fit mx-auto">
        <button
          onClick={() => handleUnitToggle('cm')}
          className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${unit === 'cm' ? 'bg-foreground text-white' : 'text-dark-muted'}`}
        >
          cm
        </button>
        <button
          onClick={() => handleUnitToggle('ft')}
          className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${unit === 'ft' ? 'bg-foreground text-white' : 'text-dark-muted'}`}
        >
          ft/in
        </button>
      </div>

      {unit === 'cm' ? (
        <div className="flex items-center gap-2 bg-light-card border border-light-border rounded-2xl px-5 py-4 focus-within:border-accent transition-colors">
          <input
            type="number"
            value={cm}
            onChange={(e) => handleCmChange(e.target.value)}
            placeholder="Enter your height"
            className="flex-1 bg-transparent text-foreground text-xl font-semibold outline-none placeholder:text-light-muted/50"
            autoFocus
          />
          <span className="text-light-muted font-medium text-lg">cm</span>
        </div>
      ) : (
        <div className="flex gap-3">
          <div className="flex-1 flex items-center gap-2 bg-light-card border border-light-border rounded-2xl px-5 py-4 focus-within:border-accent transition-colors">
            <input
              type="number"
              value={feet}
              onChange={(e) => handleFeetChange(e.target.value)}
              placeholder="ft"
              className="flex-1 bg-transparent text-foreground text-xl font-semibold outline-none placeholder:text-light-muted/50"
              autoFocus
            />
            <span className="text-light-muted font-medium text-lg">ft</span>
          </div>
          <div className="flex-1 flex items-center gap-2 bg-light-card border border-light-border rounded-2xl px-5 py-4 focus-within:border-accent transition-colors">
            <input
              type="number"
              value={inches}
              onChange={(e) => handleInchesChange(e.target.value)}
              placeholder="in"
              className="flex-1 bg-transparent text-foreground text-xl font-semibold outline-none placeholder:text-light-muted/50"
            />
            <span className="text-light-muted font-medium text-lg">in</span>
          </div>
        </div>
      )}
    </div>
  );
}
