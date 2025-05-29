// This file provides empty implementations for Node.js modules
// that are used by face-api.js but not available in the browser
window.process = window.process || {};
window.process.env = window.process.env || {};
window.fs = {};
window.Buffer = window.Buffer || require('buffer').Buffer;
