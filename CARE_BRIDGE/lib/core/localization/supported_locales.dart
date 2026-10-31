import 'package:flutter/material.dart';

/// Supported Locales in CareBridge.
/// Full coverage for all 22 Indian Scheduled Languages + English (23 total).
class SupportedLocales {
  SupportedLocales._();

  static const Locale english = Locale('en', 'US');
  static const Locale assamese = Locale('as', 'IN');
  static const Locale bengali = Locale('bn', 'IN');
  static const Locale bodo = Locale('brx', 'IN');
  static const Locale dogri = Locale('doi', 'IN');
  static const Locale gujarati = Locale('gu', 'IN');
  static const Locale hindi = Locale('hi', 'IN');
  static const Locale kannada = Locale('kn', 'IN');
  static const Locale kashmiri = Locale('ks', 'IN');
  static const Locale konkani = Locale('kok', 'IN');
  static const Locale maithili = Locale('mai', 'IN');
  static const Locale malayalam = Locale('ml', 'IN');
  static const Locale manipuri = Locale('mni', 'IN');
  static const Locale marathi = Locale('mr', 'IN');
  static const Locale nepali = Locale('ne', 'IN');
  static const Locale odia = Locale('or', 'IN');
  static const Locale punjabi = Locale('pa', 'IN');
  static const Locale sanskrit = Locale('sa', 'IN');
  static const Locale santali = Locale('sat', 'IN');
  static const Locale sindhi = Locale('sd', 'IN');
  static const Locale tamil = Locale('ta', 'IN');
  static const Locale telugu = Locale('te', 'IN');
  static const Locale urdu = Locale('ur', 'IN');

  /// Authoritative list of all 23 supported locales
  static const List<Locale> all = [
    english,
    tamil,
    hindi,
    assamese,
    bengali,
    bodo,
    dogri,
    gujarati,
    kannada,
    kashmiri,
    konkani,
    maithili,
    malayalam,
    manipuri,
    marathi,
    nepali,
    odia,
    punjabi,
    sanskrit,
    santali,
    sindhi,
    telugu,
    urdu,
  ];

  /// Right-to-Left (RTL) script locales
  static const Set<String> _rtlLanguageCodes = {'ur', 'ks', 'sd'};

  /// Checks if a given locale is Right-to-Left
  static bool isRtl(Locale locale) {
    return _rtlLanguageCodes.contains(locale.languageCode.toLowerCase());
  }

  /// Text direction for the given locale
  static TextDirection getTextDirection(Locale locale) {
    return isRtl(locale) ? TextDirection.rtl : TextDirection.ltr;
  }

  /// Language display name combining native script and English label
  static String getLanguageName(Locale locale) {
    switch (locale.languageCode.toLowerCase()) {
      case 'as':
        return 'অসমীয়া (Assamese)';
      case 'bn':
        return 'বাংলা (Bengali)';
      case 'brx':
        return 'बड़ो (Bodo)';
      case 'doi':
        return 'डोगरी (Dogri)';
      case 'gu':
        return 'ગુજરાતી (Gujarati)';
      case 'hi':
        return 'हिन्दी (Hindi)';
      case 'kn':
        return 'ಕನ್ನಡ (Kannada)';
      case 'ks':
        return 'کٲشُر (Kashmiri)';
      case 'kok':
        return 'कोंकणी (Konkani)';
      case 'mai':
        return 'मैथिली (Maithili)';
      case 'ml':
        return 'മലയാളം (Malayalam)';
      case 'mni':
        return 'মৈতৈলোন্ (Manipuri)';
      case 'mr':
        return 'मराठी (Marathi)';
      case 'ne':
        return 'नेपाली (Nepali)';
      case 'or':
        return 'ଓଡ଼ିଆ (Odia)';
      case 'pa':
        return 'ਪੰਜਾਬੀ (Punjabi)';
      case 'sa':
        return 'संस्कृतम् (Sanskrit)';
      case 'sat':
        return 'ᱥᱟᱱᱛᱟᱲᱤ (Santali)';
      case 'sd':
        return 'سنڌي (Sindhi)';
      case 'ta':
        return 'தமிழ் (Tamil)';
      case 'te':
        return 'తెలుగు (Telugu)';
      case 'ur':
        return 'اردو (Urdu)';
      case 'en':
      default:
        return 'English';
    }
  }

  /// Native script representation only
  static String getNativeName(Locale locale) {
    switch (locale.languageCode.toLowerCase()) {
      case 'as':
        return 'অসমীয়া';
      case 'bn':
        return 'বাংলা';
      case 'brx':
        return 'बड़ो';
      case 'doi':
        return 'डोगरी';
      case 'gu':
        return 'ગુજરાતી';
      case 'hi':
        return 'हिन्दी';
      case 'kn':
        return 'ಕನ್ನಡ';
      case 'ks':
        return 'کٲشُر';
      case 'kok':
        return 'कोंकणी';
      case 'mai':
        return 'मैथिली';
      case 'ml':
        return 'മലയാളം';
      case 'mni':
        return 'মৈতৈলোন্';
      case 'mr':
        return 'मराठी';
      case 'ne':
        return 'नेपाली';
      case 'or':
        return 'ଓଡ଼ିଆ';
      case 'pa':
        return 'ਪੰਜਾਬੀ';
      case 'sa':
        return 'संस्कृतम्';
      case 'sat':
        return 'ᱥᱟᱱᱛᱟᱲᱤ';
      case 'sd':
        return 'سنڌي';
      case 'ta':
        return 'தமிழ்';
      case 'te':
        return 'తెలుగు';
      case 'ur':
        return 'اردو';
      case 'en':
      default:
        return 'English';
    }
  }

  /// English name only
  static String getEnglishName(Locale locale) {
    switch (locale.languageCode.toLowerCase()) {
      case 'as':
        return 'Assamese';
      case 'bn':
        return 'Bengali';
      case 'brx':
        return 'Bodo';
      case 'doi':
        return 'Dogri';
      case 'gu':
        return 'Gujarati';
      case 'hi':
        return 'Hindi';
      case 'kn':
        return 'Kannada';
      case 'ks':
        return 'Kashmiri';
      case 'kok':
        return 'Konkani';
      case 'mai':
        return 'Maithili';
      case 'ml':
        return 'Malayalam';
      case 'mni':
        return 'Manipuri';
      case 'mr':
        return 'Marathi';
      case 'ne':
        return 'Nepali';
      case 'or':
        return 'Odia';
      case 'pa':
        return 'Punjabi';
      case 'sa':
        return 'Sanskrit';
      case 'sat':
        return 'Santali';
      case 'sd':
        return 'Sindhi';
      case 'ta':
        return 'Tamil';
      case 'te':
        return 'Telugu';
      case 'ur':
        return 'Urdu';
      case 'en':
      default:
        return 'English';
    }
  }

  /// Resolves matching supported locale from any string code (e.g. 'ta', 'ta_IN', 'ta-IN')
  static Locale fromLanguageCode(String? code) {
    if (code == null || code.trim().isEmpty) return english;
    final normalized = code.trim().toLowerCase().replaceAll('-', '_');
    final langCode = normalized.split('_').first;

    for (final loc in all) {
      if (loc.languageCode.toLowerCase() == langCode) {
        return loc;
      }
    }
    return english;
  }
}
