import { useEffect, useState } from 'react';
import { Radar, ShieldCheck } from 'lucide-react';
import type { ScanResult } from '@/lib/evaluateURL';
import { getRiskTheme } from '@/lib/evaluateURL';

interface ScanningAnimationProps {
  url: string;
  result: ScanResult;
  onComplete: () => void;
}

const scanSteps = [
  'Fetching product listing metadata...',
  'Running NLP analysis on 1,247 reviews...',
  'Executing reverse image search across 14 databases...',
  'Querying seller telemetry and transaction velocity...',
  'Cross-referencing dropship network signals...',
  'Compiling risk verdicts...',
];

export default function ScanningAnimation({ url, result, onComplete }: ScanningAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const theme = getRiskTheme(result.riskLevel);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= scanSteps.length - 1) {
          clearInterval(stepInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 450);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3200);

    return () => {
      clearInterval(stepInterval);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07090d] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px]" />

      <div className="relative z-10 flex flex-col items-center">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 animate-fade-in">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-white">
            Trinetra <span className="text-cyan-400">Kavach</span>
          </h1>
        </div>

        {/* Radar */}
        <div className="relative w-64 h-64 mb-10">
          <div className="absolute inset-0 rounded-full border border-cyan-500/20"></div>
          <div className="absolute inset-8 rounded-full border border-cyan-500/15"></div>
          <div className="absolute inset-16 rounded-full border border-cyan-500/10"></div>
          <div className="absolute top-1/2 left-0 right-0 h-px bg-cyan-500/10"></div>
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-cyan-500/10"></div>

          {/* Radar sweep */}
          <div className="absolute inset-0 animate-radar">
            <div
              className="absolute top-1/2 left-1/2 origin-bottom-left"
              style={{
                width: '50%',
                height: '2px',
                background: 'linear-gradient(90deg, rgba(6, 182, 212, 0.8), transparent)',
                transformOrigin: 'left center',
                boxShadow: '0 0 20px rgba(6, 182, 212, 0.5)',
              }}
            ></div>
          </div>

          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.8)]"></div>

          {/* Pings — color based on risk level */}
          <div className="absolute top-[30%] left-[60%]">
            <div
              className="w-2 h-2 rounded-full shadow-[0_0_10px] animate-radar-ping"
              style={{ background: theme.primaryHex, color: theme.glowColor }}
            ></div>
          </div>
          <div className="absolute top-[65%] left-[35%]">
            <div
              className="w-2 h-2 rounded-full shadow-[0_0_10px] animate-radar-ping"
              style={{ background: theme.primaryHex, color: theme.glowColor, animationDelay: '0.5s' }}
            ></div>
          </div>
          <div className="absolute top-[45%] left-[70%]">
            <div
              className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px] animate-radar-ping"
              style={{ background: theme.primaryHex, color: theme.glowColor, animationDelay: '1s' }}
            ></div>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-12">
            <Radar className="w-6 h-6 text-cyan-400/40" />
          </div>
        </div>

        {/* Status text */}
        <div className="text-center mb-6">
          <p className="text-sm font-mono text-cyan-400 mb-1">SCANNING TARGET</p>
          <p className="text-xs text-slate-500 font-mono truncate max-w-md">{url}</p>
        </div>

        {/* Steps */}
        <div className="w-full max-w-md space-y-2 font-mono text-xs">
          {scanSteps.map((step, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 transition-all duration-300 ${
                i <= currentStep ? 'opacity-100' : 'opacity-20'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                  i < currentStep
                    ? 'bg-green-500/20 text-green-400'
                    : i === currentStep
                    ? 'bg-cyan-500/20 text-cyan-400'
                    : 'bg-slate-800 text-slate-600'
                }`}
              >
                {i < currentStep ? (
                  <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : i === currentStep ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                ) : (
                  <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                )}
              </span>
              <span className={i <= currentStep ? 'text-slate-300' : 'text-slate-600'}>{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
