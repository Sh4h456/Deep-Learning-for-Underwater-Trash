// src/pages/ComparisonPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { comparisonMetrics, comparisonImages } from '../data/comparisonData';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

// A component for each row in the comparison table
const MetricRow = ({ metric, yolov7, yolov8 }) => {
  const isBetter = yolov8 > yolov7;
  // For inference time, lower is better
  const isTimeBetter = metric === 'Inference Time (ms)' && yolov8 < yolov7;
  
  return (
    <tr className="border-b border-gray-700 last:border-b-0">
      <td className="p-4 font-medium text-gray-300">{metric}</td>
      <td className="p-4 text-center font-mono">{yolov7}{metric !== 'Inference Time (ms)' ? '%' : 'ms'}</td>
      <td className="p-4 text-center font-mono font-bold text-cyan-400 flex items-center justify-center space-x-2">
        <span>{yolov8}{metric !== 'Inference Time (ms)' ? '%' : 'ms'}</span>
        {(isBetter || isTimeBetter) && <CheckCircle size={18} className="text-green-500" />}
      </td>
    </tr>
  );
};

export default function ComparisonPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header and Back Button */}
        <div className="mb-8">
          <Link to="/dashboard" className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300">
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-4xl font-bold mt-4">YOLOv7 vs. YOLOv8 Comparison</h1>
          <p className="text-gray-400 mt-2">A direct comparison of key performance indicators between the two models.</p>
        </div>

        {/* Section 1: Visual Comparison */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">Visual Comparison</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="font-semibold mb-2 text-gray-400">Original Image</h3>
              <img src={comparisonImages.original} alt="Original" className="rounded-lg shadow-md" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-2 text-gray-400">YOLOv7 Result</h3>
              <img src={comparisonImages.yolov7} alt="YOLOv7 Result" className="rounded-lg shadow-md" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-2 text-gray-400">YOLOv8 Result (Improved)</h3>
              <img src={comparisonImages.yolov8} alt="YOLOv8 Result" className="rounded-lg shadow-md border-2 border-cyan-500" />
            </div>
          </div>
        </div>

        {/* Section 2: Quantitative Metrics */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">Quantitative Metrics</h2>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-600 bg-gray-700/50">
                <th className="p-4 uppercase text-sm font-bold text-gray-400">Metric</th>
                <th className="p-4 uppercase text-sm font-bold text-gray-400 text-center">YOLOv7</th>
                <th className="p-4 uppercase text-sm font-bold text-gray-400 text-center">YOLOv8 (Selected)</th>
              </tr>
            </thead>
            <tbody>
              {comparisonMetrics.map(item => (
                <MetricRow key={item.metric} metric={item.metric} yolov7={item.metric.includes('%') ? (item.yolov7 * 100).toFixed(1) : item.yolov7} yolov8={item.metric.includes('%') ? (item.yolov8 * 100).toFixed(1) : item.yolov8} />
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Section 3: Conclusion */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Conclusion</h2>
          <p className="text-gray-300 leading-relaxed">
            While both models demonstrate strong performance, YOLOv8 shows a notable improvement across all key metrics, including a higher mAP and recall. Furthermore, its lower inference time indicates greater efficiency. These results justify the selection of YOLOv8 for the AquaVision project, as it provides a better balance of accuracy and speed for real-world debris detection.
          </p>
        </div>

      </div>
    </div>
  );
}