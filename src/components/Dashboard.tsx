import { useState } from 'react';
import { ShieldCheck, ArrowLeft, RotateCcw, Zap, Clock, Activity, Globe, Sparkles, Share2, Monitor, Chrome, Sliders } from 'lucide-react';
import type { ScanResult, ScanFactors } from '@/lib/evaluateURL';
import { getRiskTheme, buildScanResult } from '@/lib/evaluateURL';
import TrustGauge from './TrustGauge';
import RiskCards from './RiskCards';
import TerminalWindow from './TerminalWindow';
import AnomalyChart from './AnomalyChart';
import ScoringAuditMatrix from './ScoringAuditMatrix';
import SecurityAIDrawer from './SecurityAIDrawer';
import ThreatLedger from './ThreatLedger';
import ShareAlertModal from './ShareAlertModal';
import ExtensionPreview from './ExtensionPreview';
import DemoControlsDrawer from './DemoControlsDrawer';

interface DashboardProps {
  result: ScanResult;
  factors: ScanFactors;
  onFactorsChange: (factors: ScanFactors) => void;
  onReset: () => void;
}

type ViewMode = 'dashboard' | 'extension';

export default function Dashboard({ result, factors, onFactorsChange, onReset }: DashboardProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [demoDrawerOpen, setDemoDrawerOpen] = useState(false);

  const theme = getRiskTheme(result.riskLevel);

  const formatUrl = (u: string) => {
    try {
      const parsed = new URL(u);
      return parsed.hostname + parsed.pathname;
    } catch {
      return u;
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07090d]">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div
        className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full blur-[120px]"
        style={{ background: `${theme.primaryHex}0d` }}
      />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px]" />

      {/* Top nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 border-b border-slate-800/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">
              Trinetra <span className="text-cyan-400">Kavach</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">E-Commerce Guard</p>
          </div>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-800/60 border border-slate-700/40">
          <button
            onClick={() => setViewMode('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'dashboard'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Web Dashboard</span>
          </button>
          <button
            onClick={() => setViewMode('extension')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'extension'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            <Chrome className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">In-Page Extension</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setDemoDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-300 text-sm transition-all hover:scale-105"
          >
            <Sliders className="w-4 h-4" />
            <span className="hidden md:inline">Demo Controls</span>
          </button>
          <button
            onClick={() => setAiDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-300 text-sm transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden md:inline">Ask Security AI</span>
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50 text-sm text-slate-300 hover:text-white transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">New Scan</span>
          </button>
        </div>
      </nav>

      {/* Content */}
      {viewMode === 'extension' ? (
        <div className="relative z-10 h-[calc(100vh-73px)]">
          <ExtensionPreview result={result} />
        </div>
      ) : (
        <div className="relative z-10 px-6 md:px-12 py-8 max-w-7xl mx-auto">
          {/* Scan info bar */}
          <div className="flex flex-wrap items-center gap-4 mb-6 animate-fade-in">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/40">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs font-mono text-slate-400 truncate max-w-xs">{formatUrl(result.url)}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/40">
              <Clock className="w-3.5 h-3.5 text-green-400" />
              <span className="text-xs font-mono text-slate-400">Scanned in {result.latencyMs}ms</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/40">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs font-mono text-slate-400">4 factors · {result.verdicts.length} signals</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 ml-auto">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-xs font-mono text-green-400">Analysis complete</span>
            </div>
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Trust score + Audit matrix + Risk cards + Chart */}
            <div className="lg:col-span-2 space-y-6">
              <TrustGauge result={result} />
              <ScoringAuditMatrix result={result} />
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-5 rounded-full" style={{ background: theme.primaryHex }}></div>
                  <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Risk Verdicts</h2>
                  <span className="text-xs font-mono text-slate-600">
                    — {result.verdicts.length} engines, {result.verdicts.filter((v) => v.status === 'fail').length} critical, {result.verdicts.filter((v) => v.status === 'warn').length} warnings
                  </span>
                </div>
                <RiskCards result={result} />
              </div>
              <AnomalyChart result={result} />
            </div>

            {/* Right: Terminal + Share button */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-6 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-5 rounded-full bg-cyan-400"></div>
                    <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Live API Response</h2>
                  </div>
                  <TerminalWindow result={result} />
                </div>

                {/* Architecture note */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/5 to-transparent border border-cyan-500/15">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-cyan-300 mb-1">Sub-100ms API Architecture</p>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Verdicts are computed by 4 parallel inference engines on edge GPUs. Full pipeline completes in under 100ms.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Share button */}
                <button
                  onClick={() => setShareModalOpen(true)}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-[1.01] active:scale-95 bg-gradient-to-r ${theme.gradientFrom} ${theme.gradientTo} text-white shadow-lg`}
                  style={{ boxShadow: `0 0 30px ${theme.glowColor}` }}
                >
                  <Share2 className="w-4 h-4" />
                  Share Threat Alert
                </button>
              </div>
            </div>
          </div>

          {/* Community Threat Ledger */}
          <div className="mt-8">
            <ThreatLedger result={result} />
          </div>

          {/* Footer action bar */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-[#0d1117] border border-slate-800 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${theme.accentBg} ${theme.accentBorder} border flex items-center justify-center`}>
                <ShieldCheck className={`w-5 h-5 ${theme.accent}`} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  {result.riskLevel === 'safe' && 'This product is safe to purchase.'}
                  {result.riskLevel === 'medium' && 'Proceed with caution. Verify independently.'}
                  {result.riskLevel === 'high' && 'This product is not safe to purchase.'}
                </p>
                <p className="text-xs text-slate-500">
                  {result.riskLevel === 'safe' && 'All 4 risk factors passed verification.'}
                  {result.riskLevel === 'medium' && 'Mixed risk signals detected across factors.'}
                  {result.riskLevel === 'high' && 'Critical fraud signals detected across multiple factors.'}
                </p>
              </div>
            </div>
            <button
              onClick={onReset}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-cyan-500/30 hover:scale-[1.02] active:scale-95 w-full sm:w-auto justify-center"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Scan Another Product</span>
            </button>
          </div>
        </div>
      )}

      {/* Drawers / Modals */}
      <DemoControlsDrawer factors={factors} onFactorsChange={onFactorsChange} open={demoDrawerOpen} onClose={() => setDemoDrawerOpen(false)} />
      <SecurityAIDrawer result={result} open={aiDrawerOpen} onClose={() => setAiDrawerOpen(false)} />
      <ShareAlertModal result={result} open={shareModalOpen} onClose={() => setShareModalOpen(false)} />
    </div>
  );
}
