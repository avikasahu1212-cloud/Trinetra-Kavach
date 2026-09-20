import { Bot, ImageOff, TrendingUp, ShieldCheck, Camera, Store, AlertTriangle, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';
import type { ScanResult, Verdict } from '@/lib/evaluateURL';
import { getRiskTheme } from '@/lib/evaluateURL';

interface RiskCardsProps {
  result: ScanResult;
}

const iconMap: Record<string, typeof Bot> = {
  review_intel: Bot,
  image_forensics: ImageOff,
  seller_telemetry: TrendingUp,
  domain_verification: ShieldCheck,
};

const statusConfig = {
  pass: {
    icon: CheckCircle2,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    border: 'border-emerald-500/30',
    flagBg: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  },
  warn: {
    icon: AlertCircle,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
    border: 'border-amber-500/30',
    flagBg: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  },
  fail: {
    icon: AlertTriangle,
    color: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/20',
    border: 'border-red-500/30',
    flagBg: 'text-red-400 bg-red-500/10 border-red-500/30',
  },
};

function RiskCard({ verdict, index, themeColor }: { verdict: Verdict; index: number; themeColor: string }) {
  const config = statusConfig[verdict.status];
  const Icon = iconMap[verdict.engine] || Bot;
  const StatusIcon = config.icon;

  return (
    <div
      className={`relative bg-[#0d1117] border ${config.border} rounded-2xl p-5 animate-fade-in-up overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}
      style={{ animationDelay: `${0.1 + index * 0.1}s` }}
    >
      <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-current to-transparent ${config.color} opacity-30`}></div>

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${config.bg}`}>
            <Icon className={`w-5 h-5 ${config.color}`} />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-600 uppercase tracking-wider">
              Engine {verdict.engineCode}
            </span>
            <h3 className="text-sm font-semibold text-white">{verdict.title}</h3>
          </div>
        </div>
        <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
      </div>

      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-mono font-semibold ${config.flagBg} mb-4`}>
        <StatusIcon className="w-3 h-3" />
        {verdict.flagLabel}
      </div>

      <div className="mb-3">
        <div className="flex items-baseline gap-2">
          <span className={`text-3xl font-extrabold ${config.color}`}>{verdict.metric}</span>
        </div>
        <p className="text-sm text-slate-400 mt-1 leading-relaxed">{verdict.metricLabel}</p>
      </div>

      <div className="pt-3 border-t border-slate-800">
        <p className="text-xs text-slate-500 leading-relaxed">{verdict.detail}</p>
      </div>
    </div>
  );
}

export default function RiskCards({ result }: RiskCardsProps) {
  const theme = getRiskTheme(result.riskLevel);
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {result.verdicts.map((verdict, i) => (
        <RiskCard key={i} verdict={verdict} index={i} themeColor={theme.primary} />
      ))}
    </div>
  );
}
