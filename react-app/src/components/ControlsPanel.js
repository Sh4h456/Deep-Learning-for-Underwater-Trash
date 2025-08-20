// src/components/ControlsPanel.js
import React, { useRef } from 'react'; // 1. Import useRef
import { Upload } from 'lucide-react';

export default function ControlsPanel({ 
  selectedFile, 
  onFileChange, 
  onDetect, 
  isLoading, 
  error 
}) {
  
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileChange(file);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedFile) {
      onDetect(); 
    } else {
      alert("Please select a file first.");
    }
  };

  const isVideo = selectedFile && selectedFile.type.startsWith('video/');
  const previewUrl = selectedFile ? URL.createObjectURL(selectedFile) : null;

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
      <h2 className="text-2xl font-semibold mb-4 border-b border-gray-600 pb-3">Controls</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {previewUrl && (
          <div>
            <label className="text-sm font-medium text-gray-400 mb-2 block">File Preview:</label>
            {isVideo ? (
              <video src={previewUrl} controls muted className="rounded-lg max-h-48 w-full object-cover" />
            ) : (
              <img src={previewUrl} alt="Preview" className="rounded-lg max-h-48 w-full object-cover" />
            )}
          </div>
        )}
        
        
        <div>
          <label className="flex items-center space-x-2 text-gray-400 font-medium mb-2">
            <Upload size={20} />
            <span>{selectedFile ? 'Change File' : '1. Upload File'}</span>
          </label>
          
          <div className="flex items-center space-x-4">
            {/* 3. The actual file input is now hidden */}
            <input 
              type="file" 
              id="file" 
              onChange={handleFileChange} 
              accept="image/*,video/*"
              className="hidden" 
              ref={fileInputRef}
              key={selectedFile ? selectedFile.name : 'empty'}
            />
            
            {/* 4. This is our new, styled "Choose File" button */}
            <button 
              type="button" 
              onClick={() => fileInputRef.current.click()}
              className="bg-cyan-900/50 text-cyan-300 font-semibold py-2 px-4 rounded-full text-sm hover:bg-cyan-900 whitespace-nowrap"
            >
              Choose File
            </button>

            {/* 5. This span displays the filename or the default text */}
            <span className="text-sm text-gray-400 truncate">
              {selectedFile ? selectedFile.name : 'No file chosen'}
            </span>
          </div>
        </div>
        
        {error && <p className="text-red-400 text-sm bg-red-900/30 p-3 rounded-lg">{error}</p>}
        
        <button 
          type="submit" 
          disabled={isLoading || !selectedFile}
          className="w-full bg-cyan-500 text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-cyan-400 transition-all duration-200 shadow-md disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Analyzing...' : 'Detect Objects'}
        </button>
      </form>
    </div>
  );
}