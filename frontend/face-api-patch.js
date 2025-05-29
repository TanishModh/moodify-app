const fs = require('fs');
const path = require('path');

// Path to the problematic file in face-api.js
const targetFile = path.join(process.cwd(), 'node_modules/face-api.js/build/es6/env/index.js');

// Check if the file exists
if (fs.existsSync(targetFile)) {
  console.log(`Patching ${targetFile}`);
  
  // Read the file
  let content = fs.readFileSync(targetFile, 'utf8');
  
  // Replace the problematic import
  content = content.replace(`import * as fs from 'fs';`, `// Removed fs import for browser compatibility`);
  
  // Make isNodejs() always return false in browser environment
  content = content.replace(
    `export function isNodejs() { return typeof module !== 'undefined' && !!module.exports }`,
    `export function isNodejs() { return false; }`
  );
  
  // Remove any fs.existsSync calls
  content = content.replace(/fs\.existsSync\([^)]+\)/g, 'false');
  
  // Write the modified content back
  fs.writeFileSync(targetFile, content, 'utf8');
  
  console.log('Successfully patched face-api.js for browser compatibility');
} else {
  console.log('face-api.js file not found, skipping patch');
}
