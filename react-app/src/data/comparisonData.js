// src/data/comparisonData.js

// Key performance metrics for a side-by-side table
export const comparisonMetrics = [
  { metric: 'mAP@.50-.95', yolov7: 0.45, yolov8: 0.50 },
  { metric: 'mAP@.50', yolov7: 0.61, yolov8: 0.68 },
  { metric: 'Precision', yolov7: 0.65, yolov8: 0.69 },
  { metric: 'Recall', yolov7: 0.62, yolov8: 0.70 },
  { metric: 'Inference Time (ms)', yolov7: 25, yolov8: 18 },
];

// URLs to your best example images for visual comparison
export const comparisonImages = {
  yolov7: '/images/v7+cbam.png', // An image with v7's bounding boxes
  yolov8: '/images/v8+cbam.png', // The SAME image with v8's bounding boxes
  original: '/images/original.png' // The original, unmarked image
};