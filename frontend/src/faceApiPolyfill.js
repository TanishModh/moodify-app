// This file provides polyfills for face-api.js to work in browser environments
// It will be imported before any face-api.js code

// Mock the fs module
if (typeof window !== 'undefined') {
  window.fs = {
    existsSync: () => false,
    readFileSync: () => null,
    promises: {
      readFile: () => Promise.resolve(null)
    }
  };
  
  // Mock Buffer
  if (!window.Buffer) {
    window.Buffer = {
      from: (arr) => arr
    };
  }
  
  // Set environment variables
  window.process = window.process || {};
  window.process.env = window.process.env || {};
}
