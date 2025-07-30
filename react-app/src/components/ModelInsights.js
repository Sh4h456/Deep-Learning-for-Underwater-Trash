// src/components/ModelInsights.js
import React from 'react'; // Removed useState
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, GitCompareArrows } from 'lucide-react';
// We no longer need the Modal component in this file

export default function ModelInsights() {
  const navigate = useNavigate();
  // We no longer need any state here

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
      <h2 className="text-2xl font-semibold mb-4 border-b border-gray-600 pb-3">Model Insights</h2>
      <div className="space-y-4">
        
        <button onClick={() => navigate('/performance')} className="w-full flex items-center justify-center space-x-3 bg-gray-700 text-gray-300 font-medium py-3 px-4">
          <BrainCircuit size={20} />
          <span>View Training Performance</span>
        </button>
        
        {/* --- THIS IS THE CHANGE --- */}
        <button 
          onClick={() => navigate('/comparison')} // <-- 3. Navigate on click
          className="w-full flex items-center justify-center space-x-3 bg-gray-700 text-gray-300 font-medium py-3 px-4">
          <GitCompareArrows size={20} />
          <span>Compare v7 vs v8 Results</span>
        </button>

      </div>
    </div>
    
  );
}