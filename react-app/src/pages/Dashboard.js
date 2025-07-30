import React, { useState } from 'react';
import Header from '../components/Header';
import ControlsPanel from '../components/ControlsPanel';
import ResultsPanel from '../components/ResultsPanel';
import ChatWidget from '../components/ChatWidget';
import ModelInsights from '../components/ModelInsights';
import { predictImage } from '../api/predict';

export default function Dashboard() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  //const [confidence, setConfidence] = useState(0.5);

  const handleDetect = async (file) => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setResult(null);
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      // formData.append('confidence', currentConfidence);

      const data = await predictImage(formData);
      setResult(data);
    } catch (err) {
      setError(err.message || "Detection failed.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header />
      <main className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <div className="lg:col-span-1 space-y-8">
          <ControlsPanel
            onDetect={handleDetect}
            // confidence={confidence}
            // onConfidenceChange={setConfidence}
            isLoading={isLoading}
            error={error}
          />
          <ModelInsights />
        </div>
        <div className="lg:col-span-2">
          <ResultsPanel result={result} isLoading={isLoading} />
        </div>
      </main>
      <ChatWidget />
    </div>
  );
}