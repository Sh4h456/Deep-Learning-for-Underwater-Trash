// src/api/predict.js

export const predictImage = async (formData) => {
  const response = await fetch('http://127.0.0.1:5001/api/predict', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) throw new Error('Prediction failed');
  return response.json();
};
