import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Activity, TrendingUp } from 'lucide-react';
import type { ScanResult } from '@/lib/evaluateURL';
import { getRiskTheme } from '@/lib/evaluateURL';

interface AnomalyChartProps {
  result: ScanResult;
}

export default function AnomalyChart({ result }: AnomalyChartProps) {
  const theme = getRiskTheme(result.riskLevel);
  const data = result.chartData;

  const isHighRisk = result.riskLevel === 'high';
  const isSafe = result.riskLevel === 'safe';

  const chartColor = theme.primaryHex;
  const chartColorLight = theme.primaryLight;

  const subtitle = isHighRisk
    ? 'Bot review bombing detected — 547 reviews submitted in a single day'
    : isSafe
    ? 'Natural review growth pattern over 8 months — organic distribution'
    : 'Moderate review activity with a minor spike during a promotional event';

  return (
    <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-5 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${theme.accentBg} ${theme.accentBorder}`}>
            <Activity className={`w-5 h-5 ${theme.accent}`} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Review Submissions vs. Rating Over Time</h3>
            <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md ${theme.accentBg} border ${theme.accentBorder}`}>
          <TrendingUp className={`w-3 h-3 ${theme.accent}`} />
          <span className={`text-[11px] font-mono ${theme.accent}`}>
            {isHighRisk ? 'ANOMALY' : isSafe ? 'ORGANIC' : 'ELEVATED'}
          </span>
        </div>
      </div>

      <div className="w-full h-[260px] mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="reviewLineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={chartColor} stopOpacity={0.4} />
                <stop offset="100%" stopColor={chartColor} stopOpacity={1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1c2330" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#475569"
              tick={{ fill: '#475569', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              axisLine={{ stroke: '#1c2330' }}
              tickLine={{ stroke: '#1c2330' }}
            />
            <YAxis
              stroke="#475569"
              tick={{ fill: '#475569', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              axisLine={{ stroke: '#1c2330' }}
              tickLine={{ stroke: '#1c2330' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0a0e14',
                border: '1px solid #1c2330',
                borderRadius: '8px',
                fontSize: '12px',
                fontFamily: 'JetBrains Mono',
              }}
              labelStyle={{ color: '#94a3b8' }}
              itemStyle={{ color: '#e2e8f0' }}
            />
            {isHighRisk && (
              <ReferenceLine
                y={300}
                stroke="#ef4444"
                strokeDasharray="4 4"
                strokeOpacity={0.3}
                label={{ value: 'anomaly threshold', fill: '#ef4444', fontSize: 9, position: 'insideTopRight', fontFamily: 'JetBrains Mono' }}
              />
            )}
            <Line
              type={isSafe ? 'monotone' : 'linear'}
              dataKey="reviews"
              stroke="url(#reviewLineGradient)"
              strokeWidth={2.5}
              dot={{ fill: chartColor, r: 3 }}
              activeDot={{ r: 5, fill: chartColorLight, stroke: '#0a0e14', strokeWidth: 2 }}
              name="Reviews"
            />
            <Line
              type="monotone"
              dataKey="rating"
              stroke="#64748b"
              strokeWidth={1.5}
              strokeDasharray="5 5"
              dot={false}
              name="Avg Rating"
              yAxisId={0}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 rounded-full" style={{ background: chartColor }}></div>
          <span className="text-slate-400 font-mono">Review count</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 rounded-full bg-slate-500" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #64748b 0, #64748b 3px, transparent 3px, transparent 6px)' }}></div>
          <span className="text-slate-400 font-mono">Avg rating</span>
        </div>
      </div>
    </div>
  );
}
