import React from 'react';
import SkeletonLoader from './SkeletonLoader';

const API_BASE_URL = 'http://127.0.0.1:5001';

export default function ResultsPanel({ result, isLoading }) {
  // 1. Loading and initial states (no changes here)
  if (isLoading) return <SkeletonLoader />;

  if (!result) {
    return (
      <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 h-full flex flex-col justify-center items-center text-center">
        <h2 className="text-2xl font-semibold mb-2">Results Panel</h2>
        {/* Updated text to be more generic */}
        <p className="text-gray-400">Upload a file to see the results here.</p>
      </div>
    );
  }

  // --- 2. NEW: CHECK THE RESULT TYPE AND RENDER ACCORDINGLY ---

  // If the result is a VIDEO, render the video player
  if (result.type === 'video') {
    const videoUrl = `${API_BASE_URL}${result.url}`;
    return (
      <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
        <h2 className="text-2xl font-semibold mb-4 border-b border-gray-600 pb-3">Processed Video</h2>
        <video
          width="100%"
          controls
          autoPlay
          muted // Muted is often required by browsers for autoplay
          key={videoUrl} // Important for re-rendering if the URL changes
          className="rounded-lg"
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  // If the result is an IMAGE, render your existing three-panel comparison view
  if (result.type === 'image') {
    const originalImageUrl = result.original_image_url ? `${API_BASE_URL}${result.original_image_url}` : null;
    const detectionImageUrl = result.predicted_image_url ? `${API_BASE_URL}${result.predicted_image_url}` : null;
    const groundTruthImageUrl = result.ground_truth_image_url ? `${API_BASE_URL}${result.ground_truth_image_url}` : null;

    return (
      <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
        <h2 className="text-2xl font-semibold mb-4 border-b border-gray-600 pb-3">Detection Images</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Panel 1: Original Image */}
          <div>
            <h3 className="text-lg font-medium text-gray-400 mb-2 text-center">Original Image</h3>
            {originalImageUrl ? (
              <img src={originalImageUrl} alt="Original" className="rounded-lg shadow-md w-full" />
            ) : (
              <p className="text-gray-500 text-center">No original image available</p>
            )}
          </div>
          {/* Panel 2: Ground Truth Image */}
          {groundTruthImageUrl ? (
            <div>
              <h3 className="text-lg font-medium text-gray-400 mb-2 text-center">Ground Truth</h3>
              <img src={groundTruthImageUrl} alt="Ground Truth" className="rounded-lg shadow-md w-full" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-gray-600 rounded-lg p-4 h-full">
              <h3 className="text-lg font-medium text-gray-400 mb-2 text-center">Ground Truth</h3>
              <p className="text-center text-sm">Not available</p>
            </div>
          )}
          {/* Panel 3: Detection Result */}
          <div>
            <h3 className="text-lg font-medium text-gray-400 mb-2 text-center">Detection Result</h3>
            {detectionImageUrl ? (
              <img src={detectionImageUrl} alt="Detection" className="rounded-lg shadow-md w-full" />
            ) : (
              <p className="text-gray-500 text-center">No detection image available</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Fallback in case result type is unknown
  return null; 
}