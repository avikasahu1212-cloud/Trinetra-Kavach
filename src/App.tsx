import { useState, useCallback } from 'react';
import HeroState from '@/components/HeroState';
import ScanningAnimation from '@/components/ScanningAnimation';
import Dashboard from '@/components/Dashboard';
import { evaluateURL, buildScanResult, type ScanResult, type ScanFactors } from '@/lib/evaluateURL';

type AppState = 'hero' | 'scanning' | 'results';

function App() {
  const [state, setState] = useState<AppState>('hero');
  const [scannedUrl, setScannedUrl] = useState('');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

  const handleScan = (url: string) => {
    setScannedUrl(url);
    setScanResult(evaluateURL(url));
    setState('scanning');
  };

  const handleScanComplete = () => {
    setState('results');
  };

  const handleReset = () => {
    setState('hero');
    setScannedUrl('');
    setScanResult(null);
  };

  const handleFactorsChange = useCallback((factors: ScanFactors) => {
    setScanResult((prev) => (prev ? buildScanResult(prev.url, factors, prev.scanId) : prev));
  }, []);

  return (
    <div className="min-h-screen bg-[#07090d]">
      {state === 'hero' && <HeroState onScan={handleScan} />}
      {state === 'scanning' && scanResult && (
        <ScanningAnimation url={scannedUrl} result={scanResult} onComplete={handleScanComplete} />
      )}
      {state === 'results' && scanResult && (
        <Dashboard
          result={scanResult}
          factors={scanResult.scanFactors}
          onFactorsChange={handleFactorsChange}
          onReset={handleReset}
        />
      )}
    </div>
  );
}

export default App;
