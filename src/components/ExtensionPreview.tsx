import { Star, Heart, ShoppingBag, ChevronRight, ShieldCheck, Zap, X } from 'lucide-react';
import type { ScanResult } from '@/lib/evaluateURL';
import { getRiskTheme } from '@/lib/evaluateURL';

interface ExtensionPreviewProps {
  result: ScanResult;
}

const productImages = [
  'https://images.pexels.com/photos/7176438/pexels-photo-7176438.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/38526708/pexels-photo-38526708.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/7176430/pexels-photo-7176430.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
];

export default function ExtensionPreview({ result }: ExtensionPreviewProps) {
  const theme = getRiskTheme(result.riskLevel);

  return (
    <div className="relative w-full h-full overflow-y-auto bg-white animate-fade-in">
      {/* Mock Myntra top bar */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-6">
          <span className="text-xl font-extrabold text-pink-600 tracking-tight">MYNTRA</span>
          <nav className="hidden md:flex items-center gap-4 text-sm text-gray-700">
            <span>Men</span>
            <span>Women</span>
            <span>Kids</span>
            <span>Home</span>
            <span>Beauty</span>
          </nav>
        </div>
        <div className="flex items-center gap-4 text-gray-600">
          <Heart className="w-5 h-5" />
          <ShoppingBag className="w-5 h-5" />
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="px-4 py-2 text-xs text-gray-400 flex items-center gap-1">
        <span>Home</span>
        <ChevronRight className="w-3 h-3" />
        <span>Women</span>
        <ChevronRight className="w-3 h-3" />
        <span>Ethnic</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-600">Libas Anarkali Kurta Set</span>
      </div>

      {/* Product layout */}
      <div className="flex flex-col lg:flex-row gap-6 px-4 pb-20 relative">
        {/* Product images */}
        <div className="lg:w-1/2">
          <div className="grid grid-cols-2 gap-2">
            {productImages.map((img, i) => (
              <div key={i} className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100">
                <img src={img} alt={`Product ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Product details */}
        <div className="lg:w-1/2 lg:pr-80">
          <div className="mb-3">
            <h1 className="text-lg font-bold text-gray-900">Libas Women Anarkali Kurta Set</h1>
            <p className="text-sm text-gray-500">Product ID: LIBAS-AK-2024-891</p>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1 bg-green-600 text-white px-1.5 py-0.5 rounded text-xs font-bold">
              4.3 <Star className="w-2.5 h-2.5 fill-white" />
            </div>
            <span className="text-xs text-gray-500">21,847 ratings</span>
          </div>

          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-2xl font-bold text-gray-900">Rs. 2,499</span>
            <span className="text-sm text-gray-400 line-through">Rs. 4,999</span>
            <span className="text-sm font-bold text-pink-600">(50% OFF)</span>
          </div>

          <div className="space-y-2 mb-4">
            <p className="text-sm font-semibold text-gray-700">Product Details</p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>Blue and white printed anarkali kurta set</li>
              <li>Material: 100% cotton, machine washable</li>
              <li>Includes kurta, salwar, and dupatta</li>
              <li>Perfect for festive and casual occasions</li>
            </ul>
          </div>

          <div className="flex gap-3 mb-6">
            <button className="flex-1 bg-pink-600 text-white py-3 rounded-lg font-bold text-sm hover:bg-pink-700 transition-colors">
              ADD TO BAG
            </button>
            <button className="flex-1 border-2 border-pink-600 text-pink-600 py-3 rounded-lg font-bold text-sm hover:bg-pink-50 transition-colors">
              WISHLIST
            </button>
          </div>

          {/* Mock reviews */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-bold text-gray-800 mb-3">Customer Reviews</h3>
            {[
              { name: 'Priya S.', rating: 5, text: 'Amazing quality! Exactly as shown in the photos. Highly recommend!' },
              { name: 'Ananya R.', rating: 5, text: 'Beautiful dress, perfect fit. Great value for money!' },
              { name: 'Kavya M.', rating: 5, text: 'Loved it! Amazing quality! Exactly as shown in the photos. Highly recommend!' },
            ].map((review, i) => (
              <div key={i} className="mb-3 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex items-center gap-1 bg-green-600 text-white px-1.5 py-0.5 rounded text-xs font-bold">
                    {review.rating} <Star className="w-2.5 h-2.5 fill-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{review.name}</span>
                </div>
                <p className="text-sm text-gray-500">{review.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Trinetra Kavach widget */}
        <div className="fixed bottom-4 right-4 lg:absolute lg:top-4 lg:right-4 lg:w-72 z-30">
          <div
            className="relative backdrop-blur-2xl rounded-2xl border p-5 shadow-2xl animate-slide-in-right"
            style={{
              background: 'rgba(13, 17, 23, 0.85)',
              borderColor: `${theme.primaryHex}40`,
              boxShadow: `0 0 40px ${theme.glowColor}`,
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Trinetra Kavach</p>
                  <p className="text-[9px] text-slate-400 font-mono">E-Commerce Guard</p>
                </div>
              </div>
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-green-500/10 border border-green-500/20">
                <Zap className="w-2.5 h-2.5 text-green-400" />
                <span className="text-[9px] font-mono text-green-400">{result.latencyMs}ms</span>
              </span>
            </div>

            {/* Score */}
            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-16 h-16 flex-shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="32" fill="none" stroke="#1c2330" strokeWidth="5" />
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    fill="none"
                    stroke={theme.primaryHex}
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 32}
                    strokeDashoffset={2 * Math.PI * 32 - (result.trustScore / 100) * 2 * Math.PI * 32}
                    style={{ filter: `drop-shadow(0 0 4px ${theme.glowColor})` }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-extrabold text-white">{result.trustScore}</span>
                </div>
              </div>
              <div>
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded ${theme.badgeBg} border ${theme.badgeBorder} mb-1`}>
                  <span className={`text-[10px] font-bold ${theme.badgeText}`}>{theme.labelShort}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  {result.riskLevel === 'safe' && 'All 3 engines passed'}
                  {result.riskLevel === 'medium' && 'Mixed risk signals'}
                  {result.riskLevel === 'high' && '3 critical fraud flags'}
                </p>
              </div>
            </div>

            {/* Mini verdicts */}
            <div className="space-y-1.5 mb-3">
              {result.verdicts.map((v, i) => (
                <div key={i} className="flex items-center gap-2 text-[11px]">
                  <span
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      v.status === 'pass' ? 'bg-emerald-400' : v.status === 'warn' ? 'bg-amber-400' : 'bg-red-400'
                    }`}
                  ></span>
                  <span className="text-slate-300 truncate">{v.title}</span>
                  <span
                    className={`ml-auto font-mono text-[10px] ${
                      v.status === 'pass' ? 'text-emerald-400' : v.status === 'warn' ? 'text-amber-400' : 'text-red-400'
                    }`}
                  >
                    {v.status === 'pass' ? 'PASS' : v.status === 'warn' ? 'WARN' : 'FAIL'}
                  </span>
                </div>
              ))}
            </div>

            {/* Action */}
            <button
              className={`w-full py-2 rounded-lg text-xs font-semibold transition-all ${theme.badgeBg} border ${theme.badgeBorder} ${theme.badgeText} hover:scale-[1.02]`}
            >
              View Full Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
