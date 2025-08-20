// src/components/DetectionSummary.js
import React from 'react';

export default function DetectionSummary({ summary, title }) { // Notice 'title' is received here
  // If there's no summary data, we can show a placeholder within the component.
  if (!summary || Object.keys(summary).length === 0) {
    return (
       <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        {/* THIS IS THE FIX: Use the 'title' prop instead of hardcoded text */}
        <h2 className="text-xl font-bold text-cyan-400 mb-4">{title}</h2>
        <p className="text-gray-400">No objects were found in this summary.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      {/* THIS IS THE FIX: Use the 'title' prop instead of hardcoded text */}
      <h2 className="text-xl font-bold text-cyan-400 mb-4">{title}</h2>
      
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-600">
            <th className="p-2 text-gray-300 font-semibold">Class Detected</th>
            <th className="p-2 text-gray-300 font-semibold text-right">Count</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(summary).map(([className, count]) => (
            <tr key={className} className="border-b border-gray-700 last:border-b-0">
              <td className="p-2 text-gray-100 capitalize">{className.replace('_', ' ')}</td>
              <td className="p-2 text-gray-100 text-right">{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}