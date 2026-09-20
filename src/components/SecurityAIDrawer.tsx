import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Bot, User, Loader2 } from 'lucide-react';
import type { ScanResult } from '@/lib/evaluateURL';
import { getRiskTheme } from '@/lib/evaluateURL';

interface SecurityAIDrawerProps {
  result: ScanResult;
  open: boolean;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'ai';
  content: string;
}

const suggestions = [
  'Why is this image flagged?',
  'Is this product authentic?',
  'What does the trust score mean?',
  'How were the reviews analyzed?',
];

function getAIResponse(prompt: string, result: ScanResult): string {
  const lower = prompt.toLowerCase();
  const theme = getRiskTheme(result.riskLevel);

  if (lower.includes('image') && (lower.includes('flag') || lower.includes('forensic'))) {
    const imgVerdict = result.verdicts.find((v) => v.engine === 'image_forensics');
    if (result.riskLevel === 'high') {
      return `The image forensics engine flagged this product because reverse image search found the exact same product photo on **14 known dropshipping sites**. This means the seller didn't take their own photos — they stole them from a stock catalog. Additionally, EXIF metadata (camera model, GPS location, timestamp) was stripped from the image, which is a common tactic used by fraudulent sellers to hide the photo's true origin. ELA (Error Level Analysis) also confirmed the image was not originally captured by the seller.`;
    }
    return `The image forensics engine ${imgVerdict?.status === 'pass' ? 'passed' : 'flagged'} this product. ${imgVerdict?.detail}`;
  }

  if (lower.includes('authentic') || lower.includes('libas') || lower.includes('real')) {
    if (result.riskLevel === 'safe') {
      return `Yes, this product appears authentic. The domain is verified as the official brand domain, reviews show organic distribution patterns, and the seller has a 5+ year established history with verified business documentation. All 3 engines passed verification. You can proceed with confidence.`;
    }
    if (result.riskLevel === 'high') {
      return `No, this product does not appear authentic. The trust score is ${result.trustScore}/100 with ${result.fraudLikelihood}% fraud likelihood. Three critical signals were detected: bot-generated reviews, stolen product images, and a seller account only 3 days old with impossible transaction volume. I strongly recommend avoiding this purchase.`;
    }
    return `This product shows mixed signals. The trust score is ${result.trustScore}/100. Some checks passed (images appear original) but others raised concerns (repetitive review phrasing, relatively new seller). I'd recommend verifying independently before purchasing.`;
  }

  if (lower.includes('trust score') || lower.includes('score mean')) {
    return `The Trust Score of ${result.trustScore}/100 is a composite metric calculated from 3 parallel inference engines: Review Intelligence (NLP analysis of review patterns), Image Forensics (reverse image search and ELA), and Seller Telemetry (account age, transaction velocity, payout routing). Each engine contributes a weighted score. The final score of ${result.trustScore} places this product in the **${result.riskLevel.toUpperCase()}** risk category with ${result.confidence * 100}% confidence.`;
  }

  if (lower.includes('review') || lower.includes('bot') || lower.includes('nlp')) {
    const reviewVerdict = result.verdicts.find((v) => v.engine === 'review_intel');
    if (result.riskLevel === 'high') {
      return `Our NLP engine analyzed the review patterns and found that **78% of 5-star reviews were posted within a single 2-hour window**. This is a classic bot-review signature. We also detected that 847 reviews share identical sentence structures — a strong indicator of automated, non-human authorship. The temporal clustering and linguistic fingerprinting both confirm coordinated review bombing.`;
    }
    return `Our NLP engine analyzed the review patterns. ${reviewVerdict?.detail}`;
  }

  if (lower.includes('seller')) {
    const sellerVerdict = result.verdicts.find((v) => v.engine === 'seller_telemetry');
    return `Seller telemetry monitors account age, transaction velocity, and payout routing. ${sellerVerdict?.detail}`;
  }

  return `I've analyzed this product URL and found a trust score of ${result.trustScore}/100 (${result.riskLevel.toUpperCase()} risk). Here's a summary:\n\n• Review Intelligence: ${result.verdicts[0]?.flagLabel}\n• Image Forensics: ${result.verdicts[1]?.flagLabel}\n• Seller Telemetry: ${result.verdicts[2]?.flagLabel}\n\nAsk me about any specific signal for more detail.`;
}

export default function SecurityAIDrawer({ result, open, onClose }: SecurityAIDrawerProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content: `Hi! I'm your Trinetra Kavach Security AI. I've analyzed this product and found a trust score of ${result.trustScore}/100 (${result.riskLevel.toUpperCase()} risk). Ask me anything about the analysis.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    setMessages([
      {
        role: 'ai',
        content: `Hi! I'm your Trinetra Kavach Security AI. I've analyzed this product and found a trust score of ${result.trustScore}/100 (${result.riskLevel.toUpperCase()} risk). Ask me anything about the analysis.`,
      },
    ]);
  }, [result]);

  const handleSend = (text?: string) => {
    const prompt = (text || input).trim();
    if (!prompt || loading) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: prompt }]);
    setLoading(true);

    setTimeout(() => {
      const response = getAIResponse(prompt, result);
      setMessages((prev) => [...prev, { role: 'ai', content: response }]);
      setLoading(false);
    }, 800 + Math.random() * 600);
  };

  const theme = getRiskTheme(result.riskLevel);

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in" onClick={onClose} />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-[#0a0e14] border-l border-slate-800 z-50 transition-transform duration-500 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Sparkles className="w-5 h-5 text-white" />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-[#0a0e14]"></span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Security AI Assistant</h2>
              <p className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                online · analyzing {result.riskLevel} risk
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 flex items-center justify-center text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4" style={{ height: 'calc(100% - 180px)' }}>
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-fade-in-up`}>
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'ai'
                    ? 'bg-gradient-to-br from-cyan-500 to-cyan-700'
                    : 'bg-slate-700'
                }`}
              >
                {msg.role === 'ai' ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-slate-300" />}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'ai'
                    ? 'bg-slate-800/60 border border-slate-700/40 text-slate-200'
                    : 'bg-cyan-500/15 border border-cyan-500/20 text-cyan-100'
                }`}
              >
                {msg.content.split('\n').map((line, j) => (
                  <p key={j} className={j > 0 ? 'mt-1' : ''}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-slate-800/60 border border-slate-700/40 rounded-2xl px-4 py-3 flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                <span className="text-sm text-slate-400">Analyzing...</span>
              </div>
            </div>
          )}
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="px-5 pb-2 flex flex-wrap gap-2">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSend(s)}
                className="px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/40 text-xs text-slate-300 hover:text-white transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="px-5 py-4 border-t border-slate-800">
          <div className="flex items-center gap-2 bg-slate-800/60 border border-slate-700/40 rounded-xl p-1.5 pl-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about the analysis..."
              className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
