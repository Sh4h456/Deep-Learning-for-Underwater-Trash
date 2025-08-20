// src/api/predict.js

export const predictImage = async (formData) => {
  const response = await fetch('http://127.0.0.1:5001/api/predict', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) throw new Error('Prediction failed');
  return response.json();
};

export const predictVideo = async (formData) => {
  try {
    const response = await fetch('/api/predict-video', { // <--- New endpoint
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error("There was an error with the video prediction:", error);
    throw error;
  }
};