import React, { useState } from 'react';
import Header from '../components/Header';
import ControlsPanel from '../components/ControlsPanel';
import ResultsPanel from '../components/ResultsPanel';
import ChatWidget from '../components/ChatWidget';
import ModelInsights from '../components/ModelInsights';
import DetectionSummary from '../components/DetectionSummary'; 
// --- 1. IMPORT BOTH API FUNCTIONS ---
import { predictImage, predictVideo } from '../api/predict';

export default function Dashboard() {
  // --- 2. MANAGE THE SELECTED FILE STATE HERE ---
  const [selectedFile, setSelectedFile] = useState(null); 
  const [predictionResult, setPredictionResult] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- 3. NEW HANDLER FOR FILE SELECTION FROM ControlsPanel ---
  const handleFileChange = (file) => {
    setSelectedFile(file);
    setPredictionResult(null); // Clear previous results when a new file is chosen
    setError(null);
  };

  
  const handleDetect = async () => {
    if (!selectedFile) {
      setError("Please select a file first.");
      return;
    }

    setPredictionResult(null);
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      let data;
      // Check the file type to call the correct API
      if (selectedFile.type.startsWith('video/')) {
        const videoData = await predictVideo(formData);
        // Standardize the result object for the ResultsPanel
        data = { 
          type: 'video', 
          url: videoData.processed_video_url 
        };
      } else {
        const imageData = await predictImage(formData);
        // Standardize the result object
        data = { 
          type: 'image', 
          ...imageData 
        };
      }
      setPredictionResult(data);
    } catch (err) {
      setError(err.message || "Detection failed. Please try again.");
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
          {/* --- 5. PASS THE NEW STATE AND HANDLERS TO ControlsPanel --- */}
          <ControlsPanel
            selectedFile={selectedFile}
            onFileChange={handleFileChange}
            onDetect={handleDetect}
            isLoading={isLoading}
            error={error}
          />
          <ModelInsights />
        </div>
        
        <div className="lg:col-span-2 space-y-8">
          <ResultsPanel result={predictionResult} isLoading={isLoading} />
          
          {/* --- 6. ENSURE SUMMARIES ONLY SHOW FOR IMAGE RESULTS --- */}
          {predictionResult && predictionResult.type === 'image' && (
            <>
              <DetectionSummary 
                summary={predictionResult.prediction_summary} 
                title="Prediction Summary" 
              />
              {predictionResult.ground_truth_summary && (
                <DetectionSummary 
                  summary={predictionResult.ground_truth_summary} 
                  title="Ground Truth Summary" 
                />
              )}
            </>
          )}
        </div>

      </main>
      <ChatWidget />
    </div>
  );
}