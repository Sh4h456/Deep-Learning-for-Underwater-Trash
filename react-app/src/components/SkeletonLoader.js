// src/components/SkeletonLoader.js
import React from 'react';

export default function SkeletonLoader() {
  return (
    <div className="lg:col-span-2 space-y-8 animate-pulse">
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <div className="h-7 bg-gray-700 rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-700 rounded-lg"></div>
          <div className="h-64 bg-gray-700 rounded-lg"></div>
        </div>
      </div>
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <div className="h-7 bg-gray-700 rounded w-1/2 mb-6"></div>
        <div className="space-y-4">
          <div className="h-5 bg-gray-700 rounded w-full"></div>
          <div className="h-5 bg-gray-700 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  );
}
