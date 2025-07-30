// src/data/performanceData.js

// You can get these numbers from your YOLOv8 training output (e.g., from results.csv)
export const metrics = {
  map50_95: 0.501, // mAP50-95 (mean Average Precision)
  map50: 0.682,    // mAP50 (mAP at IoU threshold of 0.5)
  precision: 0.727,
  recall: 0.627,
};


export const chartData = [
  { epoch: 1, train_loss: 3.17, mAP: 0.01 },
  { epoch: 10, train_loss: 1.45, mAP: 0.27 },
  { epoch: 20, train_loss: 1.26, mAP: 0.48 },
  { epoch: 30, train_loss: 1.16, mAP: 0.55 },
  { epoch: 50, train_loss: 1.03, mAP: 0.63 },
  { epoch: 70, train_loss: 0.94, mAP: 0.66 },
  { epoch: 90, train_loss: 0.84, mAP: 0.67 },
  { epoch: 110, train_loss: 0.76, mAP: 0.67 },
  { epoch: 125, train_loss: 0.65, mAP: 0.68 },
  
];