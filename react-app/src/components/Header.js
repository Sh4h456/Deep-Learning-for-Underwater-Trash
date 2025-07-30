// src/components/Header.js
import React from 'react';

export default function Header() {
  return (
    <header className="bg-gray-800/50 text-center p-6 border-b border-gray-700">
      <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 tracking-wider">AquaVision</h1>
      <p className="text-gray-400 mt-2">Advanced Underwater Object Detection</p>
    </header>
  );
}
