// src/pages/PerformancePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { metrics, chartData } from '../data/performanceData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowLeft } from 'lucide-react';

// A reusable card component for displaying a single metric 
const MetricCard = ({ title, value, description }) => (
  <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg transition-all duration-300 ease-in-out hover:border-cyan-500 hover:scale-105 hover:shadow-cyan-500/20">
    <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">{title}</h3>
    <p className="text-4xl font-bold text-cyan-400 mt-2">{(value * 100).toFixed(1)}%</p>
    <p className="text-gray-500 mt-2">{description}</p>
  </div>
);

export default function PerformancePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        
        <div className="mb-8">
          <Link to="/dashboard" className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors">
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-4xl font-bold mt-4">Model Training Performance</h1>
          <p className="text-gray-400 mt-2">An overview of the YOLOv8 model's performance metrics after training.</p>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard title="mAP@.50-.95" value={metrics.map50_95} description="Average precision over multiple IoU thresholds." />
          <MetricCard title="mAP@.50" value={metrics.map50} description="Precision at an IoU threshold of 50%." />
          <MetricCard title="Precision" value={metrics.precision} description="Accuracy of positive predictions." />
          <MetricCard title="Recall" value={metrics.recall} description="Ability to find all relevant instances." />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* mAP Progress Chart */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">mAP Progress</h2>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                <XAxis dataKey="epoch" stroke="#a0aec0" label={{ value: 'Epoch', position: 'insideBottom', offset: -10 }} />
                <YAxis stroke="#a0aec0" 
                ticks ={[0, 0.2, 0.4, 0.6, 0.75]} />
                <Tooltip contentStyle={{ backgroundColor: '#1a202c', border: '1px solid #4a5568' }} />
                {/* --- FIX #1: Adjusted Legend Position --- */}
                <Legend verticalAlign="top" height={36} />
                <Line type="monotone" dataKey="mAP" stroke="#4299e1" name="mAP Score" dot={false} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Training Loss Chart */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Training Loss Progress</h2>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                <XAxis dataKey="epoch" stroke="#a0aec0" label={{ value: 'Epoch', position: 'insideBottom', offset: -10 }} />
                <YAxis stroke="#a0aec0" ticks={[0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5]}  />
                <Tooltip contentStyle={{ backgroundColor: '#1a202c', border: '1px solid #4a5568' }} />
                {/* --- FIX #1: Adjusted Legend Position --- */}
                <Legend verticalAlign="top" height={36} />
                {/* --- FIX #2: Corrected dataKey for the Loss data --- */}
                <Line type="monotone" dataKey="train_loss" stroke="#f56565" name="Training Loss" dot={false} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

        </div>

      </div>
    </div>
  );
}