import { Radio, ShieldAlert, ShieldCheck, Shield, Flag, Clock } from 'lucide-react';
import type { ScanResult } from '@/lib/evaluateURL';

interface ThreatLedgerProps {
  result: ScanResult;
}

interface ThreatEntry {
  url: string;
  platform: string;
  trustScore: number;
  riskLevel: 'safe' | 'medium' | 'high';
  date: string;
  reporter: string;
}

const mockThreats: ThreatEntry[] = [
  { url: 'myntra.com/cheap-promo-saree-deal', platform: 'Myntra', trustScore: 18, riskLevel: 'high', date: '2 min ago', reporter: '@rahul_s' },
  { url: 'amazon.in/scam-electronics-flash-sale', platform: 'Amazon', trustScore: 12, riskLevel: 'high', date: '8 min ago', reporter: '@priya_k' },
  { url: 'libas.com/anarkali-kurta-set-official', platform: 'Libas', trustScore: 94, riskLevel: 'safe', date: '15 min ago', reporter: '@ananya_r' },
  { url: 'myntra.com/fake-brand-handbag-discount', platform: 'Myntra', trustScore: 22, riskLevel: 'high', date: '23 min ago', reporter: '@vikram_m' },
  { url: 'amazon.in/suspicious-skincare-promo', platform: 'Amazon', trustScore: 58, riskLevel: 'medium', date: '31 min ago', reporter: '@sneha_d' },
  { url: 'nike.com/air-max-official-store', platform: 'Nike', trustScore: 96, riskLevel: 'safe', date: '45 min ago', reporter: '@arjun_t' },
  { url: 'flipkart.com/cheap-winter-jacket-scam', platform: 'Flipkart', trustScore: 19, riskLevel: 'high', date: '1 hr ago', reporter: '@divya_n' },
  { url: 'myntra.com/promo-mass-sale-watch-deal', platform: 'Myntra', trustScore: 28, riskLevel: 'high', date: '1 hr ago', reporter: '@karan_s' },
];

function getRiskIcon(level: string) {
  if (level === 'safe') return { icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10' };
  if (level === 'medium') return { icon: Shield, color: 'text-amber-400', bg: 'bg-amber-500/10' };
  return { icon: ShieldAlert, color: 'text-red-400', bg: 'bg-red-500/10' };
}

export default function ThreatLedger({ result }: ThreatLedgerProps) {
  // Inject the current scan at the top
  const currentEntry: ThreatEntry = {
    url: result.url.length > 40 ? result.url.slice(0, 40) + '...' : result.url,
    platform: result.url.toLowerCase().includes('myntra') ? 'Myntra' : result.url.toLowerCase().includes('amazon') ? 'Amazon' : result.url.toLowerCase().includes('libas') ? 'Libas' : result.url.toLowerCase().includes('nike') ? 'Nike' : 'Unknown',
    trustScore: result.trustScore,
    riskLevel: result.riskLevel,
    date: 'just now',
    reporter: '@you',
  };

  const entries = [currentEntry, ...mockThreats];

  return (
    <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-5 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Radio className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Live Community Threat Feed</h3>
            <p className="text-xs text-slate-500 mt-0.5">Crowdsourced fraud signals from {entries.length} recent scans</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="text-[11px] font-mono text-cyan-400">LIVE</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10px] font-mono text-slate-500 uppercase tracking-wider border-b border-slate-800">
              <th className="pb-3 pr-4 font-medium">URL Scanned</th>
              <th className="pb-3 pr-4 font-medium">Platform</th>
              <th className="pb-3 pr-4 font-medium">Trust Score</th>
              <th className="pb-3 pr-4 font-medium">Reported</th>
              <th className="pb-3 pr-4 font-medium">By</th>
              <th className="pb-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, i) => {
              const riskIcon = getRiskIcon(entry.riskLevel);
              const RiskIcon = riskIcon.icon;
              const isCurrentUser = entry.reporter === '@you';
              return (
                <tr
                  key={i}
                  className={`border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors ${isCurrentUser ? 'bg-cyan-500/5' : ''}`}
                >
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg ${riskIcon.bg} flex items-center justify-center flex-shrink-0`}>
                        <RiskIcon className={`w-3.5 h-3.5 ${riskIcon.color}`} />
                      </div>
                      <span className={`text-xs font-mono truncate max-w-[180px] ${isCurrentUser ? 'text-cyan-300' : 'text-slate-400'}`}>
                        {entry.url}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="text-xs text-slate-400">{entry.platform}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`text-sm font-bold font-mono ${
                        entry.riskLevel === 'safe' ? 'text-emerald-400' : entry.riskLevel === 'medium' ? 'text-amber-400' : 'text-red-400'
                      }`}
                    >
                      {entry.trustScore}/100
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      {entry.date}
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`text-xs font-mono ${isCurrentUser ? 'text-cyan-400' : 'text-slate-500'}`}>{entry.reporter}</span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all hover:scale-105 ${
                        entry.riskLevel === 'high'
                          ? 'bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400'
                          : entry.riskLevel === 'medium'
                          ? 'bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400'
                          : 'bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      <Flag className="w-3 h-3" />
                      {entry.riskLevel === 'safe' ? 'Verify' : 'Verify & Flag'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
        <span className="font-mono">Showing {entries.length} of 12,847 entries today</span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          {entries.filter((e) => e.riskLevel === 'safe').length} safe
          <span className="mx-1">·</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
          {entries.filter((e) => e.riskLevel === 'medium').length} caution
          <span className="mx-1">·</span>
          <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
          {entries.filter((e) => e.riskLevel === 'high').length} flagged
        </span>
      </div>
    </div>
  );
}
