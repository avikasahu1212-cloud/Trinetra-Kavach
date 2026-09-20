import { useState } from 'react';
import { X, Share2, Copy, Check, ShieldCheck, AlertTriangle, Shield } from 'lucide-react';
import type { ScanResult } from '@/lib/evaluateURL';
import { getRiskTheme } from '@/lib/evaluateURL';

interface ShareAlertModalProps {
  result: ScanResult;
  open: boolean;
  onClose: () => void;
}

export default function ShareAlertModal({ result, open, onClose }: ShareAlertModalProps) {
  const [copied, setCopied] = useState(false);
  const theme = getRiskTheme(result.riskLevel);

  if (!open) return null;

  const alertText = `⚠️ TRINETRA KAVACH THREAT ALERT ⚠️

Product URL: ${result.url}
Trust Score: ${result.trustScore}/100
Risk Level: ${theme.label}
Confidence: ${result.confidence * 100}%
Fraud Likelihood: ${result.fraudLikelihood}%

Risk Verdicts:
${result.verdicts.map((v) => `• ${v.title}: ${v.flagLabel}`).join('\n')}

Recommendation: ${result.recommendation}
Scan ID: ${result.scanId}

Shared via Trinetra Kavach — E-Commerce Guard
#TrinetraKavach #FraudAlert #StaySafeOnline`;

  const handleCopy = () => {
    navigator.clipboard.writeText(alertText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const ShieldIcon = result.riskLevel === 'safe' ? ShieldCheck : result.riskLevel === 'medium' ? Shield : AlertTriangle;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 animate-fade-in" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="w-full max-w-lg pointer-events-auto animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-slate-400" />
              <h2 className="text-sm font-semibold text-white">Share Threat Alert</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 flex items-center justify-center text-slate-400 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Social media card */}
          <div
            className="relative rounded-2xl overflow-hidden border p-6"
            style={{
              background: `linear-gradient(135deg, #0a0e14 0%, #0d1117 100%)`,
              borderColor: `${theme.primaryHex}40`,
              boxShadow: `0 0 60px ${theme.glowColor}`,
            }}
          >
            {/* Decorative grid */}
            <div className="absolute inset-0 bg-grid opacity-20"></div>
            <div
              className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[60px]"
              style={{ background: `${theme.primaryHex}20` }}
            ></div>

            <div className="relative">
              {/* Brand header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Trinetra Kavach</p>
                    <p className="text-[9px] text-slate-500 font-mono">E-Commerce Guard</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-600">{result.scanId}</span>
              </div>

              {/* Alert banner */}
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${theme.badgeBg} border ${theme.badgeBorder} mb-5`}>
                <ShieldIcon className={`w-5 h-5 ${theme.accent}`} />
                <span className={`text-sm font-bold ${theme.badgeText}`}>{theme.label}</span>
              </div>

              {/* Score */}
              <div className="flex items-center gap-5 mb-5">
                <div className="relative w-24 h-24 flex-shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#1c2330" strokeWidth="6" />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke={theme.primaryHex}
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 42}
                      strokeDashoffset={2 * Math.PI * 42 - (result.trustScore / 100) * 2 * Math.PI * 42}
                      style={{ filter: `drop-shadow(0 0 4px ${theme.glowColor})` }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-extrabold text-white">{result.trustScore}</span>
                    <span className="text-[10px] font-mono text-slate-500">/ 100</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-mono text-slate-500 uppercase mb-1">Target URL</p>
                  <p className="text-xs text-slate-300 font-mono truncate mb-2">{result.url}</p>
                  <div className="flex gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${theme.accentBg} ${theme.accentBorder} border ${theme.accent}`}>
                      {result.fraudLikelihood}% fraud
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${theme.accentBg} ${theme.accentBorder} border ${theme.accent}`}>
                      {result.confidence * 100}% conf
                    </span>
                  </div>
                </div>
              </div>

              {/* Risk factors */}
              <div className="space-y-2 mb-5">
                {result.verdicts.map((v, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span
                      className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        v.status === 'pass' ? 'bg-emerald-400' : v.status === 'warn' ? 'bg-amber-400' : 'bg-red-400'
                      }`}
                    ></span>
                    <span className="text-slate-300">{v.title}</span>
                    <span
                      className={`ml-auto text-[10px] font-mono ${
                        v.status === 'pass' ? 'text-emerald-400' : v.status === 'warn' ? 'text-amber-400' : 'text-red-400'
                      }`}
                    >
                      {v.flagLabel.split('·')[1]?.trim() || v.flagLabel}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <span className="text-[10px] font-mono text-slate-600">
                  Scanned in {result.latencyMs}ms · {new Date().toLocaleDateString()}
                </span>
                <span className="text-[10px] font-mono text-slate-600">trinetra.kavach</span>
              </div>
            </div>
          </div>

          {/* Copy button */}
          <button
            onClick={handleCopy}
            className={`w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-[1.01] active:scale-95 ${
              copied
                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                : `bg-gradient-to-r ${theme.gradientFrom} ${theme.gradientTo} text-white shadow-lg`
            }`}
            style={!copied ? { boxShadow: `0 0 30px ${theme.glowColor}` } : undefined}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied to Clipboard!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Alert to Clipboard
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
