import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

export default function WeeklyChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="relative group">
        <div className="absolute -inset-[1px] bg-gradient-to-b from-white/[0.04] to-transparent rounded-[20px] pointer-events-none" />
        <div className="relative bg-[rgba(28,28,30,0.4)] backdrop-blur-xl rounded-[20px] border border-white/[0.05] p-5 text-center">
          <p className="text-white/30 text-sm font-medium">No data yet this week</p>
        </div>
      </div>
    );
  }

  const maxCal = Math.max(...data.map(d => d.calories), 1);

  return (
    <div className="relative group mb-4">
      <div className="absolute -inset-[1px] bg-gradient-to-b from-white/[0.04] to-transparent rounded-[20px] pointer-events-none" />
      <div className="relative bg-[rgba(28,28,30,0.4)] backdrop-blur-xl rounded-[20px] border border-white/[0.05] p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-2.5 w-0.5 rounded-full bg-white/30" />
          <span className="text-[10px] font-semibold text-white/30 tracking-widest uppercase">Weekly Trend</span>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a1a1a6" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#a1a1a6" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="day"
              tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'rgba(255,255,255,0.15)', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              domain={[0, maxCal * 1.2]}
              tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1c1c1e',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12,
                fontSize: 12,
                backdropFilter: 'blur(20px)',
              }}
              labelStyle={{ color: 'rgba(255,255,255,0.5)', fontSize: 10 }}
              itemStyle={{ color: '#f5f5f7', fontWeight: 600 }}
              formatter={(value) => [`${value.toLocaleString()} kcal`, 'Calories']}
            />
            <Bar dataKey="calories" fill="url(#barGrad)" radius={[4, 4, 0, 0]} barSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
