import React from 'react';
import SkeletonLoader from './SkeletonLoader';
import DetectionSummary from './DetectionSummary';

const API_BASE_URL = 'http://127.0.0.1:5001';

export default function ResultsPanel({ result, isLoading }) {
  if (isLoading) return <SkeletonLoader />;

  if (!result) {
    return (
      <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 h-full flex flex-col justify-center items-center text-center">
        <h2 className="text-2xl font-semibold mb-2">Results Panel</h2>
        <p className="text-gray-400">Upload an image to see the results here.</p>
      </div>
    );
  }

  const originalImageUrl = result.original_image ? `${API_BASE_URL}${result.original_image}` : null;
  const detectionImageUrl = result.result_image ? `${API_BASE_URL}${result.result_image}` : null;

  return (
    <div className="lg:col-span-2 space-y-8">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
        <h2 className="text-2xl font-semibold mb-4 border-b border-gray-600 pb-3">Detection Images</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-400 mb-2 text-center">Original Image</h3>
            {originalImageUrl ? (
              <img src={originalImageUrl} alt="Original" className="rounded-lg shadow-md w-full" />
            ) : (
              <p className="text-gray-500 text-center">No original image available</p>
            )}
          </div>
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
      <DetectionSummary summary={result.summary} />
    </div>
  );
}
