import { Sliders, X, RotateCcw, Zap } from 'lucide-react';
import type { ScanFactors, ScanResult } from '@/lib/evaluateURL';
import { calculateTrustScore, getRiskTheme } from '@/lib/evaluateURL';

interface DemoControlsDrawerProps {
  factors: ScanFactors;
  onFactorsChange: (factors: ScanFactors) => void;
  open: boolean;
  onClose: () => void;
}

interface ToggleConfig {
  key: keyof ScanFactors;
  label: string;
  description: string;
  positiveLabel: string;
  negativeLabel: string;
}

const toggles: ToggleConfig[] = [
  {
    key: 'verifiedBrand',
    label: 'Verified Brand / Official Store',
    description: 'Seller is a verified brand entity with valid SSL and domain registration',
    positiveLabel: 'Verified brand',
    negativeLabel: 'Not verified',
  },
  {
    key: 'newUnverifiedSeller',
    label: 'New Unverified Seller (< 30 days)',
    description: 'Seller account created less than 30 days ago with no business documentation',
    positiveLabel: 'New seller',
    negativeLabel: 'Established',
  },
  {
    key: 'authenticPhotos',
    label: 'Authentic Product Photos',
    description: 'Original photography with intact EXIF metadata, no dropshipping matches',
    positiveLabel: 'Authentic photos',
    negativeLabel: 'Not authentic',
  },
  {
    key: 'aiGeneratedImages',
    label: 'AI-Generated / Manipulated Images',
    description: 'Computer vision detects high probability of AI-generated catalog images',
    positiveLabel: 'AI detected',
    negativeLabel: 'No AI artifacts',
  },
  {
    key: 'organicReviewTimeline',
    label: 'Organic Review Timeline',
    description: 'Reviews distributed naturally over months with diverse temporal patterns',
    positiveLabel: 'Organic spread',
    negativeLabel: 'Not organic',
  },
  {
    key: 'botReviewCluster',
    label: 'Bot Review Cluster Detected',
    description: '50+ reviews posted within the same 2-hour window — coordinated bombing',
    positiveLabel: 'Bot cluster',
    negativeLabel: 'No bots',
  },
  {
    key: 'verifiedPurchaseSentiment',
    label: 'Verified Purchase Sentiment',
    description: 'Positive reviews carry verified purchase badges with diverse detailed text',
    positiveLabel: 'Verified buyers',
    negativeLabel: 'Unverified',
  },
  {
    key: 'genericPositiveSpam',
    label: 'Generic Positive Spam Reviews',
    description: 'High positive count but zero detailed text, identical phrasing across accounts',
    positiveLabel: 'Spam detected',
    negativeLabel: 'No spam',
  },
];

const negativeKeys: (keyof ScanFactors)[] = ['newUnverifiedSeller', 'aiGeneratedImages', 'botReviewCluster', 'genericPositiveSpam'];

export default function DemoControlsDrawer({ factors, onFactorsChange, open, onClose }: DemoControlsDrawerProps) {
  const { score, factorResults } = calculateTrustScore(factors);
  const riskLevel = score >= 70 ? 'safe' : score >= 40 ? 'medium' : 'high';
  const theme = getRiskTheme(riskLevel);

  const handleToggle = (key: keyof ScanFactors) => {
    onFactorsChange({ ...factors, [key]: !factors[key] });
  };

  const handleReset = () => {
    onFactorsChange({
      verifiedBrand: false, newUnverifiedSeller: false,
      authenticPhotos: false, aiGeneratedImages: false,
      organicReviewTimeline: false, botReviewCluster: false,
      verifiedPurchaseSentiment: false, genericPositiveSpam: false,
    });
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in" onClick={onClose} />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-[#0a0e14] border-l border-slate-800 z-50 transition-transform duration-500 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Sliders className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Demo Controls</h2>
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Custom Factor Adjuster</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 flex items-center justify-center text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live score preview */}
        <div className="px-5 py-4 border-b border-slate-800">
          <div
            className="flex items-center justify-between p-4 rounded-xl border transition-colors duration-300"
            style={{
              background: `${theme.primaryHex}0d`,
              borderColor: `${theme.primaryHex}40`,
            }}
          >
            <div>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Live Score</p>
              <span className="text-3xl font-extrabold" style={{ color: theme.primaryHex }}>{score}</span>
              <span className="text-sm font-mono text-slate-500">/100</span>
            </div>
            <div className="text-right">
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-bold"
                style={{
                  background: `${theme.primaryHex}15`,
                  borderColor: `${theme.primaryHex}40`,
                  color: theme.primaryLight,
                }}
              >
                {theme.label}
              </div>
              <p className="text-[10px] text-slate-500 mt-1.5 font-mono flex items-center gap-1 justify-end">
                <Zap className="w-2.5 h-2.5" />
                recalculates in real-time
              </p>
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2" style={{ height: 'calc(100% - 200px)' }}>
          {toggles.map((toggle) => {
            const isNegative = negativeKeys.includes(toggle.key);
            const isChecked = factors[toggle.key];
            const isGreen = isNegative ? !isChecked : isChecked;

            return (
              <div
                key={toggle.key}
                className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isChecked
                    ? isNegative
                      ? 'bg-red-500/5 border-red-500/20'
                      : 'bg-emerald-500/5 border-emerald-500/20'
                    : 'bg-slate-800/30 border-slate-800'
                }`}
                onClick={() => handleToggle(toggle.key)}
              >
                <div className="flex items-start gap-3">
                  {/* Custom checkbox */}
                  <div
                    className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      isChecked
                        ? isNegative
                          ? 'bg-red-500 border-red-500'
                          : 'bg-emerald-500 border-emerald-500'
                        : 'border-slate-600'
                    }`}
                  >
                    {isChecked && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-white">{toggle.label}</span>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          isGreen
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-red-500/10 text-red-400'
                        }`}
                      >
                        {isGreen ? toggle.positiveLabel : toggle.negativeLabel}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{toggle.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-slate-800">
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/40 text-sm text-slate-300 hover:text-white transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Reset All Factors
          </button>
        </div>
      </div>
    </>
  );
}
