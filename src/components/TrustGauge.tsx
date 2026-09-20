import { useEffect, useState } from 'react';
import { ShieldAlert, ShieldCheck, Shield, AlertTriangle } from 'lucide-react';
import type { ScanResult } from '@/lib/evaluateURL';
import { getRiskTheme } from '@/lib/evaluateURL';

interface TrustGaugeProps {
  result: ScanResult;
}

export default function TrustGauge({ result }: TrustGaugeProps) {
  const [displayScore, setDisplayScore] = useState(100);
  const theme = getRiskTheme(result.riskLevel);
  const target = result.trustScore;

  useEffect(() => {
    setDisplayScore(100);
    const duration = 1200;
    const steps = 40;
    const stepTime = duration / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(100 - (100 - target) * eased));

      if (currentStep >= steps) {
        clearInterval(interval);
        setDisplayScore(target);
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, [target]);

  const circumference = 2 * Math.PI * 50;
  const offset = circumference - (displayScore / 100) * circumference;

  const ShieldIcon =
    result.riskLevel === 'safe' ? ShieldCheck : result.riskLevel === 'medium' ? Shield : ShieldAlert;

  return (
    <div
      className={`relative bg-[#0d1117] border ${theme.accentBorder} rounded-2xl p-6 md:p-8 animate-scale-in overflow-hidden`}
    >
      <div
        className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-[80px]"
        style={{ background: `${theme.primaryHex}1a` }}
      ></div>

      <div className="relative flex flex-col md:flex-row items-center gap-8">
        {/* Circular gauge */}
        <div className="relative w-44 h-44 flex-shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" fill="none" stroke="#1c2330" strokeWidth="8" />
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={theme.primaryHex} />
                <stop offset="50%" stopColor={theme.primaryLight} />
                <stop offset="100%" stopColor={theme.primaryHex} />
              </linearGradient>
            </defs>
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="url(#gaugeGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{
                transition: 'stroke-dashoffset 0.05s linear',
                filter: `drop-shadow(0 0 6px ${theme.glowColor})`,
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-extrabold text-white tabular-nums">{displayScore}</span>
            <span className="text-sm font-mono text-slate-500 mt-1">/ 100</span>
          </div>
        </div>

        {/* Verdict */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
            <ShieldIcon className={`w-5 h-5 ${theme.accent}`} />
            <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">
              Overall Trust Score
            </span>
          </div>
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${theme.badgeBg} border ${theme.badgeBorder} mb-4`}
            style={{ animation: result.riskLevel === 'high' ? 'pulse-glow 2s ease-in-out infinite' : undefined }}
          >
            <AlertTriangle className={`w-5 h-5 ${theme.accent}`} />
            <span className={`text-sm md:text-base font-bold ${theme.badgeText} tracking-wide`}>
              {theme.label}
            </span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed max-w-md">
            {result.riskLevel === 'safe' && (
              <>
                This product listing passed all <span className="text-emerald-400 font-semibold">3 verification engines</span>. The domain, reviews, and seller history all check out. This product is safe to purchase.
              </>
            )}
            {result.riskLevel === 'medium' && (
              <>
                This product listing shows <span className="text-amber-400 font-semibold">mixed risk signals</span>. Some engines passed while others flagged minor anomalies. Proceed with caution and verify independently.
              </>
            )}
            {result.riskLevel === 'high' && (
              <>
                This product listing exhibits <span className="text-red-400 font-semibold">3 critical fraud signals</span> across review intelligence, image forensics, and seller telemetry. Purchasing from this seller is strongly discouraged.
              </>
            )}
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-4">
            <span
              className={`px-2.5 py-1 rounded-md ${theme.accentBg} border ${theme.accentBorder} text-[11px] font-mono ${theme.accent}`}
            >
              FRAUD LIKELIHOOD: {result.fraudLikelihood}%
            </span>
            <span
              className={`px-2.5 py-1 rounded-md ${theme.accentBg} border ${theme.accentBorder} text-[11px] font-mono ${theme.accent}`}
            >
              CONFIDENCE: {result.riskLevel === 'safe' ? 'HIGH' : result.riskLevel === 'medium' ? 'MEDIUM' : 'HIGH'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
