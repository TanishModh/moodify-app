const fs = require('fs');
const path = require('path');

// Create browser-compatible versions of problematic packages
const patchFile = (filePath, search, replacement) => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(search)) {
      content = content.replace(search, replacement);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Patched: ${filePath}`);
    }
  }
};

// Patch face-api.js to avoid requiring 'fs'
const faceApiEnvPath = path.resolve('./node_modules/face-api.js/build/es6/env/index.js');
patchFile(
  faceApiEnvPath,
  `import * as fs from 'fs';`,
  `const fs = {}; // Browser polyfill`
);

patchFile(
  faceApiEnvPath,
  `export function isNodejs() { return typeof module !== 'undefined' && !!module.exports }`,
  `export function isNodejs() { return false } // Always return false in browser`
);
