const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../../CARE_BRIDGE/lib/l10n/seed_translations.json'), 'utf8'));

const enKeys = new Set(Object.keys(data.en));
const taKeys = new Set(Object.keys(data.ta));
const hiKeys = new Set(Object.keys(data.hi));

const unionKeys = new Set([...enKeys, ...taKeys, ...hiKeys]);
console.log('Union keys count:', unionKeys.size);

const missingInEn = [...unionKeys].filter(k => !enKeys.has(k));
console.log('Missing in En count:', missingInEn.length, missingInEn);
