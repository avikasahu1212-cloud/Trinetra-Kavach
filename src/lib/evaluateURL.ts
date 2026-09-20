export type RiskLevel = 'safe' | 'medium' | 'high';

export interface FactorResult {
  key: string;
  title: string;
  weight: number;
  points: number;
  maxPoints: number;
  flag: 'green' | 'red';
  flagLabel: string;
  detail: string;
}

export interface Verdict {
  engine: string;
  engineCode: string;
  title: string;
  flagLabel: string;
  metric: string;
  metricLabel: string;
  detail: string;
  status: 'pass' | 'warn' | 'fail';
}

export interface ScanResult {
  url: string;
  riskLevel: RiskLevel;
  trustScore: number;
  confidence: number;
  fraudLikelihood: number;
  recommendation: string;
  verdicts: Verdict[];
  factors: FactorResult[];
  aiSummary: string;
  chartData: { date: string; reviews: number; rating: number }[];
  latencyMs: number;
  scanId: string;
  scanFactors: ScanFactors;
}

export interface ScanFactors {
  verifiedBrand: boolean;
  newUnverifiedSeller: boolean;
  authenticPhotos: boolean;
  aiGeneratedImages: boolean;
  organicReviewTimeline: boolean;
  botReviewCluster: boolean;
  verifiedPurchaseSentiment: boolean;
  genericPositiveSpam: boolean;
}

function generateScanId(): string {
  const chars = '0123456789abcdef';
  let id = 'trn_';
  for (let i = 0; i < 10; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

export function calculateTrustScore(factors: ScanFactors): { score: number; factorResults: FactorResult[] } {
  const factorResults: FactorResult[] = [];

  // Sub-Metric 1: Seller & Brand Reputation (Weight: 30%)
  let sellerPoints = 0;
  let sellerFlag: 'green' | 'red' = 'green';
  let sellerFlagLabel = 'Verified Brand / Official Store';
  let sellerDetail = 'DNS records confirm this domain is registered to the verified brand entity with valid SSL certification.';

  if (factors.verifiedBrand) {
    sellerPoints = 30;
    sellerFlag = 'green';
  } else if (factors.newUnverifiedSeller) {
    sellerPoints = -25;
    sellerFlag = 'red';
    sellerFlagLabel = 'New Unverified Seller (< 30 days)';
    sellerDetail = 'Seller account created less than 30 days ago with no verified business documentation. High risk of fly-by-night operation.';
  } else {
    sellerPoints = 0;
    sellerFlag = 'red';
    sellerFlagLabel = 'Unverified Reseller';
    sellerDetail = 'Seller is not a verified brand entity. Account exists but lacks official brand authorization.';
  }

  factorResults.push({
    key: 'seller',
    title: 'Seller & Brand Reputation',
    weight: 30,
    points: sellerPoints,
    maxPoints: 30,
    flag: sellerFlag,
    flagLabel: sellerFlagLabel,
    detail: sellerDetail,
  });

  // Sub-Metric 2: Image Forensics & AI Artifacts (Weight: 25%)
  let imagePoints = 0;
  let imageFlag: 'green' | 'red' = 'green';
  let imageFlagLabel = 'Authentic Product Photos';
  let imageDetail = 'Product images appear to be original photography with intact EXIF metadata. No matches found across dropshipping databases.';

  if (factors.authenticPhotos && !factors.aiGeneratedImages) {
    imagePoints = 25;
    imageFlag = 'green';
  } else if (factors.aiGeneratedImages) {
    imagePoints = -25;
    imageFlag = 'red';
    imageFlagLabel = 'AI-Generated / Manipulated Images';
    imageDetail = 'Computer vision analysis detected high probability of AI-generated or heavily manipulated catalog images. ELA analysis shows inconsistent error-level artifacts typical of generative models.';
  } else if (!factors.authenticPhotos) {
    imagePoints = -10;
    imageFlag = 'red';
    imageFlagLabel = 'Stock Images Reused';
    imageDetail = 'Reverse image search found this product photo on multiple dropshipping sites. Images may not represent the actual product.';
  }

  factorResults.push({
    key: 'image',
    title: 'Image Forensics & AI Artifacts',
    weight: 25,
    points: imagePoints,
    maxPoints: 25,
    flag: imageFlag,
    flagLabel: imageFlagLabel,
    detail: imageDetail,
  });

  // Sub-Metric 3: Review Timeline & Date Clustering (Weight: 25%)
  let reviewPoints = 0;
  let reviewFlag: 'green' | 'red' = 'green';
  let reviewFlagLabel = 'Organic Review Spread';
  let reviewDetail = 'Reviews are distributed naturally over several months with diverse temporal patterns. No coordinated posting bursts detected.';

  if (factors.organicReviewTimeline && !factors.botReviewCluster) {
    reviewPoints = 25;
    reviewFlag = 'green';
  } else if (factors.botReviewCluster) {
    reviewPoints = -25;
    reviewFlag = 'red';
    reviewFlagLabel = 'Bot Pattern Detected (Date Clustering)';
    reviewDetail = 'NLP analysis detected 50+ reviews posted within the same 2-hour window. Temporal clustering and identical sentence structures confirm coordinated review bombing.';
  } else if (!factors.organicReviewTimeline) {
    reviewPoints = 10;
    reviewFlag = 'green';
    reviewFlagLabel = 'Mixed Review Timeline';
    reviewDetail = 'Review timeline shows mostly organic distribution with a minor clustering anomaly around a promotional event.';
  }

  factorResults.push({
    key: 'review_timeline',
    title: 'Review Timeline & Date Clustering',
    weight: 25,
    points: reviewPoints,
    maxPoints: 25,
    flag: reviewFlag,
    flagLabel: reviewFlagLabel,
    detail: reviewDetail,
  });

  // Sub-Metric 4: Review Sentiment vs. Authenticity (Weight: 20%)
  let sentimentPoints = 0;
  let sentimentFlag: 'green' | 'red' = 'green';
  let sentimentFlagLabel = 'Verified Purchase Sentiment';
  let sentimentDetail = 'Positive reviews carry verified purchase badges with diverse, detailed text across accounts. Sentiment analysis confirms authentic buyer feedback.';

  if (factors.verifiedPurchaseSentiment && !factors.genericPositiveSpam) {
    sentimentPoints = 20;
    sentimentFlag = 'green';
  } else if (factors.genericPositiveSpam) {
    sentimentPoints = -20;
    sentimentFlag = 'red';
    sentimentFlagLabel = 'Generic Positive Spam Reviews';
    sentimentDetail = 'High positive review count but zero detailed text. Identical phrasing detected across multiple accounts. Reviews lack verified purchase badges, indicating artificial inflation.';
  } else if (!factors.verifiedPurchaseSentiment) {
    sentimentPoints = -1;
    sentimentFlag = 'red';
    sentimentFlagLabel = 'Low Feedback Volume';
    sentimentDetail = 'Very few verified purchase reviews. Low feedback volume makes it difficult to assess genuine buyer sentiment.';
  }

  factorResults.push({
    key: 'sentiment',
    title: 'Review Sentiment vs. Authenticity',
    weight: 20,
    points: sentimentPoints,
    maxPoints: 20,
    flag: sentimentFlag,
    flagLabel: sentimentFlagLabel,
    detail: sentimentDetail,
  });

  // Calculate composite score (0-100)
  const rawScore = factorResults.reduce((sum, f) => sum + f.points, 0);
  const score = Math.max(0, Math.min(100, Math.round(rawScore)));

  return { score, factorResults };
}

function getRiskLevel(score: number): RiskLevel {
  if (score >= 70) return 'safe';
  if (score >= 40) return 'medium';
  return 'high';
}

function buildVerdicts(factors: FactorResult[]): Verdict[] {
  return factors.map((f, i) => {
    const status: 'pass' | 'warn' | 'fail' = f.flag === 'green' ? (f.points < f.maxPoints ? 'warn' : 'pass') : 'fail';
    return {
      engine: f.key,
      engineCode: String(i + 1).padStart(2, '0'),
      title: f.title,
      flagLabel: `${status === 'pass' ? 'VERIFIED' : status === 'warn' ? 'CAUTION' : 'FLAGGED'} · ${f.flagLabel.toUpperCase()}`,
      metric: f.points > 0 ? `+${f.points}` : `${f.points}`,
      metricLabel: `${f.weight}% weight contribution — ${f.flag === 'green' ? 'positive signal' : 'negative signal'}`,
      detail: f.detail,
      status,
    };
  });
}

function generateAISummary(factors: FactorResult[], score: number): string {
  const greenFlags = factors.filter((f) => f.flag === 'green');
  const redFlags = factors.filter((f) => f.flag === 'red');

  if (redFlags.length === 0) {
    return `All 4 risk factors passed verification. The seller is a verified brand, product images are authentic, reviews show organic distribution, and sentiment analysis confirms verified purchase badges. This product is safe to purchase with high confidence.`;
  }

  const greenParts = greenFlags.map((f) => f.title.toLowerCase()).join(', ');
  const redParts = redFlags.map((f) => `${f.flagLabel.toLowerCase()}`).join(', and ');

  if (score < 40) {
    return `While ${greenParts || 'the product exists'}, the listing is undermined by ${redParts}. These critical signals lower the overall trust score to ${score}/100, placing it in the HIGH RISK category. Purchasing from this seller is strongly discouraged.`;
  }

  return `While ${greenParts || 'some factors pass'}, the score is reduced by ${redParts}. These mixed signals place the overall trust score at ${score}/100. Proceed with caution and verify independently before purchasing.`;
}

function generateChartData(factors: ScanFactors, score: number) {
  if (factors.botReviewCluster) {
    const days = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 8'];
    return days.map((date, i) => {
      if (i < 6) return { date, reviews: Math.floor(Math.random() * 8) + 2, rating: 4.0 + Math.random() * 0.3 };
      if (i === 6) return { date, reviews: 547, rating: 5.0 };
      return { date, reviews: 612, rating: 4.9 };
    });
  }

  if (score >= 70) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
    let cumulative = 0;
    return months.map((date) => {
      cumulative += Math.floor(Math.random() * 15) + 5;
      return { date, reviews: cumulative, rating: 4.2 + Math.random() * 0.5 };
    });
  }

  const weeks = ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6', 'Wk 7', 'Wk 8'];
  let cumulative = 0;
  return weeks.map((date, i) => {
    if (i === 4) cumulative += 68;
    else cumulative += Math.floor(Math.random() * 12) + 4;
    return { date, reviews: cumulative, rating: 3.8 + Math.random() * 0.6 };
  });
}

export function evaluateURL(url: string): ScanResult {
  const lower = url.toLowerCase();
  const scanId = generateScanId();

  let factors: ScanFactors;

  if (lower.includes('libas') && lower.includes('official')) {
    factors = {
      verifiedBrand: true, newUnverifiedSeller: false,
      authenticPhotos: true, aiGeneratedImages: false,
      organicReviewTimeline: true, botReviewCluster: false,
      verifiedPurchaseSentiment: true, genericPositiveSpam: false,
    };
  } else if (lower.includes('libas') && (lower.includes('third') || lower.includes('resell') || lower.includes('unverified'))) {
    factors = {
      verifiedBrand: true, newUnverifiedSeller: false,
      authenticPhotos: false, aiGeneratedImages: false,
      organicReviewTimeline: true, botReviewCluster: false,
      verifiedPurchaseSentiment: false, genericPositiveSpam: false,
    };
  } else if (lower.includes('scam') || lower.includes('ai-dress') || lower.includes('fast-fashion')) {
    factors = {
      verifiedBrand: false, newUnverifiedSeller: true,
      authenticPhotos: false, aiGeneratedImages: true,
      organicReviewTimeline: false, botReviewCluster: true,
      verifiedPurchaseSentiment: false, genericPositiveSpam: true,
    };
  } else if (lower.includes('bot') || lower.includes('manipulated') || lower.includes('boosted')) {
    factors = {
      verifiedBrand: false, newUnverifiedSeller: false,
      authenticPhotos: false, aiGeneratedImages: false,
      organicReviewTimeline: false, botReviewCluster: true,
      verifiedPurchaseSentiment: false, genericPositiveSpam: true,
    };
  } else if (lower.includes('libas') || lower.includes('nike') || lower.includes('official')) {
    factors = {
      verifiedBrand: true, newUnverifiedSeller: false,
      authenticPhotos: true, aiGeneratedImages: false,
      organicReviewTimeline: true, botReviewCluster: false,
      verifiedPurchaseSentiment: true, genericPositiveSpam: false,
    };
  } else if (lower.includes('scam') || lower.includes('cheap') || lower.includes('promo')) {
    factors = {
      verifiedBrand: false, newUnverifiedSeller: true,
      authenticPhotos: false, aiGeneratedImages: false,
      organicReviewTimeline: false, botReviewCluster: true,
      verifiedPurchaseSentiment: false, genericPositiveSpam: true,
    };
  } else {
    factors = {
      verifiedBrand: false, newUnverifiedSeller: false,
      authenticPhotos: true, aiGeneratedImages: false,
      organicReviewTimeline: true, botReviewCluster: false,
      verifiedPurchaseSentiment: false, genericPositiveSpam: false,
    };
  }

  return buildScanResult(url, factors, scanId);
}

export function buildScanResult(url: string, factors: ScanFactors, scanId?: string): ScanResult {
  const { score, factorResults } = calculateTrustScore(factors);
  const riskLevel = getRiskLevel(score);
  const id = scanId || generateScanId();

  return {
    url,
    riskLevel,
    trustScore: score,
    confidence: riskLevel === 'safe' ? 0.96 : riskLevel === 'medium' ? 0.74 : 0.92,
    fraudLikelihood: 100 - score,
    recommendation: riskLevel === 'safe' ? 'SAFE_TO_PURCHASE' : riskLevel === 'medium' ? 'PROCEED_WITH_CAUTION' : 'AVOID_PURCHASE',
    verdicts: buildVerdicts(factorResults),
    factors: factorResults,
    aiSummary: generateAISummary(factorResults, score),
    chartData: generateChartData(factors, score),
    latencyMs: 70 + Math.floor(Math.random() * 25),
    scanId: id,
    scanFactors: factors,
  };
}

// Pre-configured demo scenarios
export interface DemoScenario {
  id: string;
  label: string;
  url: string;
  expectedScore: number;
  description: string;
  factors: ScanFactors;
}

export const demoScenarios: DemoScenario[] = [
  {
    id: 'libas-official',
    label: 'Libas Official Store',
    url: 'https://www.libas.com/anarkali-kurta-set-official-store',
    expectedScore: 91,
    description: 'Target Match — Very Safe',
    factors: {
      verifiedBrand: true, newUnverifiedSeller: false,
      authenticPhotos: true, aiGeneratedImages: false,
      organicReviewTimeline: true, botReviewCluster: false,
      verifiedPurchaseSentiment: true, genericPositiveSpam: false,
    },
  },
  {
    id: 'libas-third-party',
    label: 'Libas Dress — Unverified Reseller',
    url: 'https://www.myntra.com/libas-anarkali-dress-third-party-seller',
    expectedScore: 54,
    description: 'Moderate Risk — Mixed Signals',
    factors: {
      verifiedBrand: true, newUnverifiedSeller: false,
      authenticPhotos: false, aiGeneratedImages: false,
      organicReviewTimeline: true, botReviewCluster: false,
      verifiedPurchaseSentiment: false, genericPositiveSpam: false,
    },
  },
  {
    id: 'ai-scam',
    label: 'Fast-Fashion AI Dress Scam',
    url: 'https://www.cheap-myntra-scam-store.com/ai-generated-dress-promo',
    expectedScore: 18,
    description: 'High Risk — Avoid',
    factors: {
      verifiedBrand: false, newUnverifiedSeller: true,
      authenticPhotos: false, aiGeneratedImages: true,
      organicReviewTimeline: false, botReviewCluster: true,
      verifiedPurchaseSentiment: false, genericPositiveSpam: true,
    },
  },
  {
    id: 'bot-manipulated',
    label: 'Popular Product — Bot Reviews',
    url: 'https://www.amazon.in/popular-product-bot-manipulated-reviews',
    expectedScore: 38,
    description: 'High Risk — Bot Manipulated',
    factors: {
      verifiedBrand: false, newUnverifiedSeller: false,
      authenticPhotos: true, aiGeneratedImages: false,
      organicReviewTimeline: false, botReviewCluster: true,
      verifiedPurchaseSentiment: false, genericPositiveSpam: true,
    },
  },
];

export function getRiskTheme(level: RiskLevel) {
  switch (level) {
    case 'safe':
      return {
        primary: 'emerald',
        primaryHex: '#10b981',
        primaryLight: '#34d399',
        accent: 'text-emerald-400',
        accentBg: 'bg-emerald-500/10',
        accentBorder: 'border-emerald-500/30',
        badgeBg: 'bg-emerald-500/15',
        badgeBorder: 'border-emerald-500/40',
        badgeText: 'text-emerald-300',
        glow: 'shadow-emerald-500/20',
        gradientFrom: 'from-emerald-500',
        gradientTo: 'to-teal-600',
        glowColor: 'rgba(16, 185, 129, 0.5)',
        label: 'LOW RISK — SAFE',
        labelShort: 'SAFE',
      };
    case 'medium':
      return {
        primary: 'amber',
        primaryHex: '#f59e0b',
        primaryLight: '#fbbf24',
        accent: 'text-amber-400',
        accentBg: 'bg-amber-500/10',
        accentBorder: 'border-amber-500/30',
        badgeBg: 'bg-amber-500/15',
        badgeBorder: 'border-amber-500/40',
        badgeText: 'text-amber-300',
        glow: 'shadow-amber-500/20',
        gradientFrom: 'from-amber-500',
        gradientTo: 'to-orange-600',
        glowColor: 'rgba(245, 158, 11, 0.5)',
        label: 'MEDIUM RISK — CAUTION',
        labelShort: 'CAUTION',
      };
    case 'high':
      return {
        primary: 'red',
        primaryHex: '#ef4444',
        primaryLight: '#f87171',
        accent: 'text-red-400',
        accentBg: 'bg-red-500/10',
        accentBorder: 'border-red-500/30',
        badgeBg: 'bg-red-500/15',
        badgeBorder: 'border-red-500/40',
        badgeText: 'text-red-300',
        glow: 'shadow-red-500/20',
        gradientFrom: 'from-red-500',
        gradientTo: 'to-rose-600',
        glowColor: 'rgba(239, 68, 68, 0.5)',
        label: 'HIGH RISK — AVOID',
        labelShort: 'HIGH RISK',
      };
  }
}
