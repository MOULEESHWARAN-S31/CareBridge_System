const fs = require('fs');
const path = require('path');

const l10nDir = path.join(__dirname, '../../CARE_BRIDGE/lib/l10n');
const ALL_LOCALES = [
  'en', 'as', 'bn', 'brx', 'doi', 'gu', 'hi', 'kn', 'ks', 'kok',
  'mai', 'ml', 'mni', 'mr', 'ne', 'or', 'pa', 'sa', 'sat', 'sd',
  'ta', 'te', 'ur'
];

// Load all ARB files
const arbMaps = {};
for (const loc of ALL_LOCALES) {
  const filePath = path.join(l10nDir, `app_${loc}.arb`);
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  delete raw['@@locale'];
  arbMaps[loc] = raw;
}

const enMap = arbMaps['en'];
const allKeys = Object.keys(enMap);

let code = `import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'supported_locales.dart';

/// Centralized localization architecture for CareBridge.
/// Full production coverage for all 22 Indian Scheduled Languages + English (23 total).
class AppLocalizations {
  final Locale locale;

  AppLocalizations(this.locale);

  static AppLocalizations of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations) ??
        AppLocalizations(SupportedLocales.english);
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  static const List<Locale> supportedLocales = SupportedLocales.all;

  String _get(String key, String fallback) {
    final lang = locale.languageCode.toLowerCase();
    return _localizedValues[lang]?[key] ??
        _localizedValues['en']?[key] ??
        fallback;
  }

  /// Dynamic key resolver
  String translate(String key, [String? fallback]) {
    return _get(key, fallback ?? key);
  }

  // --- Getters for All Fixed UI Strings ---
`;

for (const key of allKeys) {
  const fallbackStr = enMap[key].replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
  code += `  String get ${key} => _get('${key}', '${fallbackStr}');\n`;
}

code += `\n  // Base localized dictionary for all 23 supported Indian languages + English\n`;
code += `  static final Map<String, Map<String, String>> _localizedValues = {\n`;

for (const loc of ALL_LOCALES) {
  code += `    '${loc}': {\n`;
  const map = arbMaps[loc];
  for (const [k, v] of Object.entries(map)) {
    const escaped = v.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
    code += `      '${k}': '${escaped}',\n`;
  }
  code += `    },\n`;
}

code += `  };\n}\n\n`;

code += `class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  bool isSupported(Locale locale) {
    return SupportedLocales.all.any((l) => l.languageCode == locale.languageCode.toLowerCase());
  }

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(AppLocalizations(locale));
  }

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}
`;

const targetPath = path.join(__dirname, '../../CARE_BRIDGE/lib/core/localization/app_localizations.dart');
fs.writeFileSync(targetPath, code, 'utf8');
console.log(`[✓] Successfully compiled app_localizations.dart (${allKeys.length} getters across 23 languages)`);
