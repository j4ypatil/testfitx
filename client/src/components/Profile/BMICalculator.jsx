export function calculateBMI(weight, heightCm) {
  if (!weight || !heightCm) return null;
  const h = heightCm / 100;
  return weight / (h * h);
}

export function getBMICategory(bmi) {
  if (bmi < 18.5) return { label: 'Underweight', color: '#0a84ff' };
  if (bmi < 25) return { label: 'Normal', color: '#30d158' };
  if (bmi < 30) return { label: 'Overweight', color: '#ff9f0a' };
  return { label: 'Obese', color: '#ff4d4d' };
}

export default function BMICalculator({ weight, heightCm }) {
  const bmi = calculateBMI(weight, heightCm);
  if (!bmi) return null;

  const category = getBMICategory(bmi);

  return (
    <div className="card-dark">
      <h3 className="text-sm font-semibold text-dark-muted uppercase tracking-wider mb-3">BMI</h3>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-3xl font-bold text-foreground">{bmi.toFixed(1)}</div>
          <div className="text-xs text-dark-muted mt-1">Body Mass Index</div>
        </div>
        <div
          className="px-4 py-2 rounded-xl text-xs font-semibold"
          style={{ backgroundColor: category.color + '15', color: category.color, border: `1px solid ${category.color}30` }}
        >
          {category.label}
        </div>
      </div>
    </div>
  );
}
