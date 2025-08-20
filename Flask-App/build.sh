#!/usr/bin/env bash
# exit on error
set -o errexit

echo "--- Installing Python Dependencies ---"
pip install -r requirements.txt

# --- Applying Custom Ultralytics Patch ---
# 1. Find the installed library path
# --- THIS IS THE FIX ---
# We pipe the output to `tail -n 1` to grab only the last line (the actual path)
ULTRALYTICS_PATH=$(python -c "import os, ultralytics; print(os.path.dirname(ultralytics.__file__))" | tail -n 1)
echo "Ultralytics installed at: $ULTRALYTICS_PATH"

# 2. Copy your custom file(s) to the correct location
#    !!!! IMPORTANT: EDIT THIS LINE with your actual filenames !!!!
echo "Applying custom patch..."
cp custom_ultralytics_files/custom_modules.py "$ULTRALYTICS_PATH/nn/custom_modules.py"
cp custom_ultralytics_files/tasks.py "$ULTRALYTICS_PATH/nn/tasks.py"
echo "Patch applied."

# --- Building React Frontend ---
echo "Navigating to frontend directory..."
cd ../react-app

echo "Installing frontend dependencies..."
npm install

echo "Building production frontend..."
npm run build
echo "Frontend build complete."