const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '../../CARE_BRIDGE/lib/core/localization/app_localizations.dart'), 'utf8');

// Match: String get foo => _get('foo', 'Fallback value');
const getterRegex = /String get ([a-zA-Z0-9_]+)\s*=>\s*_get\(\s*['"]([^'"]+)['"]\s*,\s*['"]([\s\S]*?)['"]\s*\);/g;
let m;
const getterFallbacks = {};
while ((m = getterRegex.exec(content)) !== null) {
  getterFallbacks[m[2]] = m[3].replace(/\\'/g, "'");
}

console.log('Total getter fallbacks extracted:', Object.keys(getterFallbacks).length);

const seed = JSON.parse(fs.readFileSync(path.join(__dirname, '../../CARE_BRIDGE/lib/l10n/seed_translations.json'), 'utf8'));

// Fill missing in en with getter fallback
for (const key of Object.keys(seed.ta)) {
  if (!seed.en[key]) {
    seed.en[key] = getterFallbacks[key] || key;
  }
}

console.log('Complete EN keys count:', Object.keys(seed.en).length);
fs.writeFileSync(path.join(__dirname, '../../CARE_BRIDGE/lib/l10n/seed_translations.json'), JSON.stringify(seed, null, 2), 'utf8');
