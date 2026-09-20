import { useState } from 'react';
import { ScanLine, Brain, Eye, TrendingUp, ShieldCheck, Zap, AlertTriangle, Lock } from 'lucide-react';
import { demoScenarios } from '@/lib/evaluateURL';

interface HeroStateProps {
  onScan: (url: string) => void;
}

const features = [
  {
    icon: Brain,
    title: 'NLP Review Analysis',
    description: 'Natural language processing detects bot-generated reviews and coordinated posting bursts across product listings.',
    accent: 'text-cyan-400',
    glow: 'shadow-cyan-500/20',
    border: 'hover:border-cyan-500/40',
  },
  {
    icon: Eye,
    title: 'Visual Anomaly Detection',
    description: 'Reverse image search and computer vision flag stolen product photos reused across dropshipping networks.',
    accent: 'text-orange-400',
    glow: 'shadow-orange-500/20',
    border: 'hover:border-orange-500/40',
  },
  {
    icon: TrendingUp,
    title: 'Seller Velocity Tracking',
    description: 'Real-time telemetry monitors seller account age, transaction volume, and behavioral anomalies for fraud signals.',
    accent: 'text-red-400',
    glow: 'shadow-red-500/20',
    border: 'hover:border-red-500/40',
  },
];

export default function HeroState({ onScan }: HeroStateProps) {
  const [url, setUrl] = useState('');

  const handleScan = () => {
    if (url.trim()) {
      onScan(url.trim());
    } else {
      onScan('https://www.myntra.com/product/demo-listing');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07090d]">
      {/* Background grid + glow */}
      <div className="absolute inset-0 bg-grid opacity-60" />
      <div className="absolute inset-0 bg-radial-glow" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px]" />

      {/* Top nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">
              Trinetra <span className="text-cyan-400">Kavach</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">E-Commerce Guard</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-slate-400">
          <span className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="font-mono">Sub-100ms API</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-slate-500" />
            <span>Consumer-First</span>
          </span>
        </div>
      </nav>

      {/* Hero content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 pt-16 md:pt-24 pb-12">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-sm mb-8 animate-fade-in-up">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75 animate-ping"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
          </span>
          <span className="text-xs font-medium text-cyan-300 font-mono tracking-wide">AI FRAUD DETECTION ENGINE · LIVE</span>
        </div>

        {/* Headline */}
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-center tracking-tight max-w-4xl animate-fade-in-up leading-[1.05]" style={{ animationDelay: '0.1s' }}>
          <span className="text-white">Scan any product URL.</span>
          <br />
          <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-teal-400 bg-clip-text text-transparent text-glow-cyan">
            Expose the fraud.
          </span>
        </h2>

        <p className="mt-6 text-base md:text-lg text-slate-400 text-center max-w-2xl animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.2s' }}>
          Paste a link from Myntra, Amazon, or any major marketplace. Our AI engine analyzes reviews, images, and seller behavior in real time to flag scams, fake reviews, and fraudulent sellers.
        </p>

        {/* Search bar */}
        <div className="w-full max-w-2xl mt-10 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/30 via-cyan-400/20 to-teal-500/30 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center gap-3 bg-[#0d1117] border border-slate-700/60 rounded-2xl p-2 pl-5 backdrop-blur-xl">
              <ScanLine className="w-5 h-5 text-cyan-400 flex-shrink-0" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                placeholder="Paste a Myntra or Amazon product URL to scan for fraud..."
                className="flex-1 bg-transparent text-sm md:text-base text-white placeholder-slate-500 outline-none py-3 min-w-0"
              />
              <button
                onClick={handleScan}
                className="flex-shrink-0 flex items-center gap-2 px-5 md:px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white font-semibold text-sm md:text-base transition-all duration-300 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/50 hover:scale-[1.02] active:scale-95"
              >
                <Zap className="w-4 h-4" />
                <span>Scan Product</span>
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-slate-500 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-green-400"></span>
              3 engines online
            </span>
            <span>·</span>
            <span>12,847 URLs scanned today</span>
            <span>·</span>
            <span className="text-cyan-400">0 false negatives</span>
          </div>

          {/* Demo scenario buttons */}
          <div className="mt-5 w-full">
            <p className="text-[11px] text-slate-600 font-mono text-center mb-2.5 uppercase tracking-wider">Quick Demo Scenarios</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {demoScenarios.map((scenario) => {
                const isSafe = scenario.expectedScore >= 70;
                const isHigh = scenario.expectedScore < 40;
                const colorClass = isSafe
                  ? 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20 text-emerald-400'
                  : isHigh
                  ? 'bg-red-500/10 hover:bg-red-500/20 border-red-500/20 text-red-400'
                  : 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/20 text-amber-400';

                return (
                  <button
                    key={scenario.id}
                    onClick={() => onScan(scenario.url)}
                    className={`group px-3 py-2.5 rounded-xl border text-left transition-all hover:scale-[1.03] ${colorClass}`}
                  >
                    <span className="block text-[11px] font-semibold leading-tight">{scenario.label}</span>
                    <span className="block text-[10px] font-mono mt-1 opacity-70">
                      {scenario.expectedScore}/100 · {scenario.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-20 w-full max-w-5xl animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className={`group relative bg-[#0d1117] border border-slate-800 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl ${feature.glow} ${feature.border} hover:-translate-y-1`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-slate-800/60 flex items-center justify-center border border-slate-700/50 group-hover:scale-110 transition-transform duration-300">
                    <Icon className={`w-5 h-5 ${feature.accent}`} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-slate-600 uppercase tracking-wider">Engine {String(i + 1).padStart(2, '0')}</span>
                  </div>
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Warning footer */}
        <div className="mt-16 flex items-center gap-2 text-xs text-slate-600 font-mono animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Trinetra Kavach is a demonstration prototype. Verdicts are simulated for showcase purposes.</span>
        </div>
      </div>
    </div>
  );
}
