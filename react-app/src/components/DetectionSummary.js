// src/components/DetectionSummary.js
import React from 'react';

export default function DetectionSummary({ summary }) {
  if (!summary) return null;
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
      <h2 className="text-2xl font-semibold mb-4 border-b border-gray-600 pb-3">Detection Summary</h2>
      {Object.keys(summary).length > 0 ? (
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="p-3 text-gray-400 font-medium">Class Detected</th>
              <th className="p-3 text-gray-400 font-medium text-center">Count</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(summary).map(([key, count]) => (
              <tr key={key} className="border-b border-gray-800 last:border-b-0">
                <td className="p-3 font-semibold">{key}</td>
                <td className="p-3 text-center">{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-400">No objects were detected.</p>
      )}
    </div>
  );
}
