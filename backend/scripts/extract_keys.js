const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '../../CARE_BRIDGE/lib/core/localization/app_localizations.dart'), 'utf8');

function extractBlock(lang) {
  const match = content.match(new RegExp(`'${lang}':\\s*\\{([\\s\\S]*?)\\n\\s*\\},`));
  if (!match) return {};
  const block = match[1];
  const regex = /'([a-zA-Z0-9_]+)':\s*'([^']*)'/g;
  let m;
  const map = {};
  while ((m = regex.exec(block)) !== null) {
    map[m[1]] = m[2];
  }
  return map;
}

const en = extractBlock('en');
const ta = extractBlock('ta');
const hi = extractBlock('hi');

console.log('en keys:', Object.keys(en).length);
console.log('ta keys:', Object.keys(ta).length);
console.log('hi keys:', Object.keys(hi).length);

const all = { en, ta, hi };
fs.writeFileSync(path.join(__dirname, '../../CARE_BRIDGE/lib/l10n/seed_translations.json'), JSON.stringify(all, null, 2), 'utf8');
