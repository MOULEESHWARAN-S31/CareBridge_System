const fs = require('fs');
const path = require('path');

const originalContent = fs.readFileSync(path.join(__dirname, '../../CARE_BRIDGE/lib/core/localization/app_localizations.dart'), 'utf8');

// Match accurately inside the original app_localizations.dart
function extractMap(lang) {
  // Find where `'en': {` starts
  const startMarker = `'${lang}': {`;
  const startIdx = originalContent.indexOf(startMarker);
  if (startIdx === -1) return {};
  
  // Find closing `},`
  let depth = 0;
  let endIdx = -1;
  for (let i = startIdx + startMarker.length - 1; i < originalContent.length; i++) {
    if (originalContent[i] === '{') depth++;
    else if (originalContent[i] === '}') {
      depth--;
      if (depth === 0) {
        endIdx = i;
        break;
      }
    }
  }
  if (endIdx === -1) return {};
  
  const block = originalContent.substring(startIdx + startMarker.length, endIdx);
  const map = {};
  
  // Match 'key': 'val' or 'key': "val"
  // Handles multiline values
  const lines = block.split('\n');
  let currentKey = null;
  let currentVal = '';
  
  const keyValRegex = /^\s*['"]([a-zA-Z0-9_]+)['"]\s*:\s*(['"])([\s\S]*)/;
  
  for (const line of lines) {
    const kvMatch = line.match(keyValRegex);
    if (kvMatch) {
      if (currentKey) {
        map[currentKey] = currentVal.trim();
      }
      currentKey = kvMatch[1];
      const quote = kvMatch[2];
      const rest = kvMatch[3];
      
      if (rest.endsWith(quote + ',') || rest.endsWith(quote)) {
        currentVal = rest.substring(0, rest.lastIndexOf(quote));
        map[currentKey] = currentVal;
        currentKey = null;
        currentVal = '';
      } else {
        currentVal = rest;
      }
    } else if (currentKey) {
      const trimmed = line.trim();
      if (trimmed.endsWith("',") || trimmed.endsWith('",') || trimmed.endsWith("'") || trimmed.endsWith('"')) {
        const quote = trimmed.endsWith(',') ? trimmed[trimmed.length - 2] : trimmed[trimmed.length - 1];
        const valPart = trimmed.substring(0, trimmed.lastIndexOf(quote));
        currentVal += (currentVal ? ' ' : '') + valPart;
        map[currentKey] = currentVal;
        currentKey = null;
        currentVal = '';
      } else {
        currentVal += (currentVal ? ' ' : '') + trimmed;
      }
    }
  }
  
  return map;
}

const en = extractMap('en');
const ta = extractMap('ta');
const hi = extractMap('hi');

console.log('Clean en count:', Object.keys(en).length);
console.log('Clean ta count:', Object.keys(ta).length);
console.log('Clean hi count:', Object.keys(hi).length);

console.log('en[loginPrivacyNote]:', en['loginPrivacyNote']);
console.log('ta[loginPrivacyNote]:', ta['loginPrivacyNote']);
console.log('hi[loginPrivacyNote]:', hi['loginPrivacyNote']);
