import { CheckCircle2, AlertTriangle, Brain, Sparkles } from 'lucide-react';
import type { ScanResult, FactorResult } from '@/lib/evaluateURL';
import { getRiskTheme } from '@/lib/evaluateURL';

interface ScoringAuditMatrixProps {
  result: ScanResult;
}

function FactorBar({ factor, index }: { factor: FactorResult; index: number }) {
  const isGreen = factor.flag === 'green';
  const barWidth = Math.min(100, Math.abs(factor.points) / factor.maxPoints * 100);

  return (
    <div
      className="bg-[#0a0e14] border border-slate-800 rounded-xl p-4 animate-fade-in-up"
      style={{ animationDelay: `${0.1 + index * 0.08}s` }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-600 uppercase tracking-wider">
            Factor {String(index + 1).padStart(2, '0')}
          </span>
          <span className="text-xs font-semibold text-white">{factor.title}</span>
        </div>
        <span className="text-[10px] font-mono text-slate-500">{factor.weight}% weight</span>
      </div>

      {/* Flag badge + points */}
      <div className="flex items-center gap-2 mb-3">
        <div
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[10px] font-mono font-semibold ${
            isGreen
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}
        >
          {isGreen ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
          {isGreen ? 'GREEN FLAG' : 'RED FLAG'}
        </div>
        <span
          className={`text-sm font-bold font-mono ${isGreen ? 'text-emerald-400' : 'text-red-400'}`}
        >
          {factor.points > 0 ? '+' : ''}{factor.points} pts
        </span>
        <span className="text-[10px] text-slate-500 ml-auto truncate">{factor.flagLabel}</span>
      </div>

      {/* Progress bar */}
      <div className="relative h-2 rounded-full bg-slate-800/60 overflow-hidden">
        <div
          className="absolute top-0 left-1/2 h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${barWidth / 2}%`,
            transform: isGreen ? 'translateX(0%)' : 'translateX(-100%)',
            background: isGreen
              ? 'linear-gradient(90deg, rgba(16,185,129,0.3), #10b981)'
              : 'linear-gradient(270deg, rgba(239,68,68,0.3), #ef4444)',
            boxShadow: isGreen ? '0 0 10px rgba(16,185,129,0.4)' : '0 0 10px rgba(239,68,68,0.4)',
          }}
        />
        {/* Center divider */}
        <div className="absolute top-0 left-1/2 w-px h-full bg-slate-600/50" />
      </div>

      {/* Detail */}
      <p className="text-[11px] text-slate-500 leading-relaxed mt-2.5">{factor.detail}</p>
    </div>
  );
}

export default function ScoringAuditMatrix({ result }: ScoringAuditMatrixProps) {
  const theme = getRiskTheme(result.riskLevel);

  return (
    <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-5 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Brain className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Scoring Audit Matrix</h3>
            <p className="text-xs text-slate-500 mt-0.5">Weighted factor breakdown — how the score was calculated</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-500">Total:</span>
          <span className="text-lg font-bold font-mono" style={{ color: theme.primaryHex }}>
            {result.trustScore}/100
          </span>
        </div>
      </div>

      {/* Factor bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        {result.factors.map((factor, i) => (
          <FactorBar key={factor.key} factor={factor} index={i} />
        ))}
      </div>

      {/* AI Summary */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-cyan-500/5 to-transparent border border-cyan-500/15">
        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-cyan-400" />
        </div>
        <div>
          <p className="text-xs font-semibold text-cyan-300 mb-1">AI Summary</p>
          <p className="text-xs text-slate-400 leading-relaxed">{result.aiSummary}</p>
        </div>
      </div>
    </div>
  );
}
