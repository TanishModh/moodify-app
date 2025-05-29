#!/bin/bash

# Run the normal build
npm run build

# Path to face-api.js module
FILE_PATH="./node_modules/face-api.js/build/es6/env/index.js"

# Check if the file exists
if [ -f "$FILE_PATH" ]; then
  echo "Patching face-api.js for browser compatibility..."
  
  # Replace fs import with empty object
  sed -i 's/import \* as fs from '\''fs'\'';/const fs = {};/g' "$FILE_PATH"
  
  # Make isNodejs always return false
  sed -i 's/export function isNodejs() { return typeof module !== '\''undefined'\'' \&\& !!module.exports }/export function isNodejs() { return false; }/g' "$FILE_PATH"
  
  echo "Successfully patched face-api.js"
fi

# Run build again after patching
npm run build
