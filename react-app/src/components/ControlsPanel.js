// src/components/ControlsPanel.js
import React, { useState } from 'react';
import { Upload} from 'lucide-react';

export default function ControlsPanel({ onDetect, isLoading, error }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // This function is now for the button click
  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedFile) {
      // Use the onDetect prop to trigger detection in the parent
      onDetect(selectedFile); 
    } else {
      alert("Please select a file first.");
    }
  };



  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
      <h2 className="text-2xl font-semibold mb-4 border-b border-gray-600 pb-3">Controls</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {previewUrl && (
          <div>
            <label className="text-sm font-medium text-gray-400 mb-2 block">Image Preview:</label>
            <img src={previewUrl} alt="Preview" className="rounded-lg max-h-48 w-full object-cover" />
          </div>
        )}
        
        <div>
          <label htmlFor="file" className="flex items-center space-x-2 text-gray-400 font-medium mb-2">
            <Upload size={20} />
            <span>{selectedFile ? 'Change Image File' : '1. Upload Image File'}</span>
          </label>
          <input 
            type="file" 
            id="file" 
            onChange={handleFileChange} 
            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-900/50 file:text-cyan-300 hover:file:bg-cyan-900" 
            required
          />
        </div>
        
        
        
        {error && <p className="text-red-400 text-sm bg-red-900/30 p-3 rounded-lg">{error}</p>}
        
        {/* --- THE DETECT BUTTON IS BACK --- */}
        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-cyan-500 text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-cyan-400 transition-all duration-200 shadow-md disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Analyzing...' : 'Detect Debris'}
        </button>
      </form>
    </div>
  );
}