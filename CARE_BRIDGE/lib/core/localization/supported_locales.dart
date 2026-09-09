import 'package:flutter/material.dart';

/// Supported Locales in CareBridge.
/// Prepared for English, Tamil, and scalable to additional Indian languages.
class SupportedLocales {
  SupportedLocales._();

  static const Locale english = Locale('en', 'US');
  static const Locale tamil = Locale('ta', 'IN');
  static const Locale hindi = Locale('hi', 'IN');

  static const List<Locale> all = [
    english,
    tamil,
    hindi,
  ];

  static String getLanguageName(Locale locale) {
    switch (locale.languageCode) {
      case 'ta':
        return 'தமிழ் (Tamil)';
      case 'hi':
        return 'हिन्दी (Hindi)';
      case 'en':
      default:
        return 'English';
    }
  }
}
