import { useEffect, useState, useRef } from 'react';
import { Terminal, Zap } from 'lucide-react';
import type { ScanResult } from '@/lib/evaluateURL';

interface TerminalWindowProps {
  result: ScanResult;
}

function buildPayload(result: ScanResult): string {
  const signals = result.verdicts
    .map((v) => {
      const severity = v.status === 'pass' ? 'ok' : v.status === 'warn' ? 'medium' : 'critical';
      const flag = v.flagLabel.split('·')[1]?.trim().toLowerCase().replace(/\s+/g, '_') || 'unknown';
      const lines: string[] = [];
      lines.push(`      {`);
      lines.push(`        "engine": "${v.engine}",`);
      lines.push(`        "flag": "${flag}",`);
      lines.push(`        "severity": "${severity}",`);
      lines.push(`        "verdict": "${v.metric}"`);
      lines.push(`      }`);
      return lines.join('\n');
    })
    .join(',\n');

  return `{
  "scan_id": "${result.scanId}",
  "target_url": "${result.url.slice(0, 40)}...",
  "latency_ms": ${result.latencyMs},
  "verdict": {
    "trust_score": ${result.trustScore},
    "risk_level": "${result.riskLevel.toUpperCase()}",
    "confidence": ${result.confidence},
    "recommendation": "${result.recommendation}",
    "signals": [
${signals}
    ]
  }
}`;
}

export default function TerminalWindow({ result }: TerminalWindowProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [latency, setLatency] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const fullText = `$ curl -X POST https://api.trinetra.kavach/v2/scan \\
  -H "Authorization: Bearer tk_live_****" \\
  -d '{"url": "${result.url.slice(0, 50)}"}'

${buildPayload(result)}`;

  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const interval = setInterval(() => {
      if (i <= fullText.length) {
        setDisplayedText(fullText.slice(0, i));
        i += 3;
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      } else {
        clearInterval(interval);
      }
    }, 8);
    return () => clearInterval(interval);
  }, [fullText]);

  useEffect(() => {
    setLatency(0);
    const timer = setTimeout(() => {
      const target = result.latencyMs;
      let current = 0;
      const interval = setInterval(() => {
        current += Math.ceil(Math.random() * 12);
        if (current >= target) {
          current = target;
          clearInterval(interval);
        }
        setLatency(current);
      }, 50);
      return () => clearInterval(interval);
    }, 800);
    return () => clearTimeout(timer);
  }, [result.latencyMs]);

  const renderLine = (line: string, idx: number) => {
    if (line.startsWith('$ curl')) return <span key={idx} className="text-cyan-400">{line}</span>;
    if (line.startsWith('  -H') || line.startsWith('  -d')) return <span key={idx} className="text-slate-500">{line}</span>;
    if (line.includes('"flag"')) return <span key={idx} className="text-red-400">{line}</span>;
    if (line.includes('"severity"')) {
      const color = line.includes('critical') ? 'text-red-400' : line.includes('medium') ? 'text-amber-400' : 'text-emerald-400';
      return <span key={idx} className={color}>{line}</span>;
    }
    if (line.includes('"trust_score"') || line.includes('"latency_ms"') || line.includes('"confidence"'))
      return <span key={idx} className="text-green-400">{line}</span>;
    if (line.includes('"recommendation"')) {
      const color = line.includes('AVOID') ? 'text-red-400' : line.includes('CAUTION') ? 'text-amber-400' : 'text-emerald-400';
      return <span key={idx} className={`${color} font-semibold`}>{line}</span>;
    }
    if (line.includes('"engine"')) return <span key={idx} className="text-cyan-300">{line}</span>;
    if (line.includes('"risk_level"')) {
      const color = line.includes('HIGH') ? 'text-red-400' : line.includes('MEDIUM') ? 'text-amber-400' : 'text-emerald-400';
      return <span key={idx} className={color}>{line}</span>;
    }
    return <span key={idx} className="text-slate-300">{line}</span>;
  };

  return (
    <div className="bg-[#0a0e14] border border-slate-800 rounded-2xl overflow-hidden animate-slide-in-right shadow-2xl">
      <div className="flex items-center justify-between px-4 py-3 bg-[#0d1117] border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
          </div>
          <div className="flex items-center gap-1.5 ml-2">
            <Terminal className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs font-mono text-slate-500">trinetra-api · live response</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-green-500/10 border border-green-500/20">
          <Zap className="w-3 h-3 text-green-400" />
          <span className="text-[11px] font-mono text-green-400">{latency}ms</span>
        </div>
      </div>
      <div ref={containerRef} className="p-4 h-[400px] overflow-y-auto font-mono text-[11px] leading-relaxed whitespace-pre-wrap break-all">
        {displayedText.split('\n').map((line, idx) => renderLine(line, idx))}
        <span className="inline-block w-2 h-3.5 bg-cyan-400 animate-blink ml-0.5"></span>
      </div>
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0d1117] border-t border-slate-800">
        <span className="text-[10px] font-mono text-slate-600">200 OK · application/json</span>
        <span className="text-[10px] font-mono text-slate-600 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
          stream active
        </span>
      </div>
    </div>
  );
}
