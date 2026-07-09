import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

export default function WeightChart({ data }) {
  if (!data || data.length < 2) {
    return (
      <div className="card-dark">
        <h3 className="text-sm font-semibold text-dark-muted uppercase tracking-wider mb-3">Weight Progress</h3>
        <p className="text-dark-muted text-xs text-center py-6">Log your weight daily to see progress</p>
      </div>
    );
  }

  const chartData = data.map(d => ({
    date: d.date.slice(5),
    weight: d.weight,
  }));

  return (
    <div className="card-dark">
      <h3 className="text-sm font-semibold text-dark-muted uppercase tracking-wider mb-3">Weight Progress</h3>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
          <XAxis dataKey="date" tick={{ fill: '#98989d', fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis
            domain={['dataMin - 2', 'dataMax + 2']}
            tick={{ fill: '#98989d', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #38383a',
              borderRadius: 12,
              color: '#fff',
              fontSize: 12,
            }}
            labelStyle={{ color: '#98989d' }}
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#a1a1a6"
            strokeWidth={2.5}
            dot={{ fill: '#a1a1a6', r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#a1a1a6' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
