#!/usr/bin/env bash
# exit on error
set -o errexit

echo "--- Installing Python Dependencies ---"
pip install -r requirements.txt

# --- Applying Custom Ultralytics Patch ---
# 1. Find the installed library path
ULTRALYTICS_PATH=$(python -c "import os, ultralytics; print(os.path.dirname(ultralytics.__file__))")
echo "Ultralytics installed at: $ULTRALYTICS_PATH"

# 2. Copy your custom module file(s)
#    !!!! IMPORTANT: Remember to edit this line with your actual module filenames !!!!
echo "Copying custom modules..."
cp custom_ultralytics_files/custom_modules.py "$ULTRALYTICS_PATH/nn/custom_modules.py"
echo "Custom modules copied."

# --- THIS IS THE NEW LINE YOU ASKED FOR ---
# 3. Copy your custom tasks.py file, overwriting the original
echo "Copying custom tasks.py..."
cp custom_ultralytics_files/tasks.py "$ULTRALYTICS_PATH/nn/tasks.py"
echo "tasks.py copied successfully."
# --- END OF NEW PART ---

# --- Building React Frontend ---
echo "Navigating to frontend directory..."
cd ../react-app

echo "Installing frontend dependencies..."
npm install

echo "Building production frontend..."
npm run build
echo "Frontend build complete."