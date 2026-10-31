const fs = require('fs');
const path = require('path');

const l10nDir = path.join(__dirname, '../../CARE_BRIDGE/lib/l10n');
const ALL_LOCALES = [
  'as', 'bn', 'brx', 'doi', 'gu', 'kn', 'ks', 'kok',
  'mai', 'ml', 'mni', 'mr', 'ne', 'or', 'pa', 'sa', 'sat', 'sd',
  'te', 'ur'
];

let dartCode = `/// Regional Translations for 20 Indian Scheduled Languages.
/// Offline in-memory dictionary backing official ARB resource files.
const Map<String, Map<String, String>> regionalTranslations = {
`;

for (const loc of ALL_LOCALES) {
  const filePath = path.join(l10nDir, `app_${loc}.arb`);
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  delete raw['@@locale'];

  dartCode += `  '${loc}': {\n`;
  for (const [k, v] of Object.entries(raw)) {
    // Escape single quotes and backslashes for valid Dart string
    const escaped = v.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\$/g, '\\$');
    dartCode += `    '${k}': '${escaped}',\n`;
  }
  dartCode += `  },\n`;
}

dartCode += `};\n`;

const targetFile = path.join(__dirname, '../../CARE_BRIDGE/lib/core/localization/regional_translations.dart');
fs.writeFileSync(targetFile, dartCode, 'utf8');
console.log('[✓] Successfully generated regional_translations.dart');
