import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For routing
import '../styles/LandingPage.css';

export default function LandingPage() {
  const [diving, setDiving] = useState(false);
  const navigate = useNavigate();

  const handleDiveClick = () => {
    setDiving(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500); // Match with transition duration in CSS
  };

  return (
    <div className={`landing-container ${diving ? 'diving' : ''}`}>
      <div className="content">
        <main className="px-6 py-12 max-w-3xl mx-auto text-center">
          <h4 className="title">AquaVision</h4>
          <p className="subtitle">
            AquaVision is an AI-powered web app for detecting marine debris in underwater images using advanced deep learning models.
          </p>
          <button
            onClick={handleDiveClick}
            className="dive-button"
          >
            Dive In
          </button>
        </main>
      </div>
    </div>
  );
}
