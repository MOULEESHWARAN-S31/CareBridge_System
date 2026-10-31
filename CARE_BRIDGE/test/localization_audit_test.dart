import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:care_bridge/core/localization/app_localizations.dart';
import 'package:care_bridge/core/localization/supported_locales.dart';
import 'package:care_bridge/features/appointments/domain/doctor.dart';
import 'package:care_bridge/features/appointments/domain/hospital.dart';

void main() {
  group('CareBridge Multilingual System — Comprehensive Localization Audit', () {
    const all23LanguageCodes = [
      'en', // English
      'as', // Assamese
      'bn', // Bengali
      'brx', // Bodo
      'doi', // Dogri
      'gu', // Gujarati
      'hi', // Hindi
      'kn', // Kannada
      'ks', // Kashmiri (RTL)
      'kok', // Konkani
      'mai', // Maithili
      'ml', // Malayalam
      'mni', // Manipuri
      'mr', // Marathi
      'ne', // Nepali
      'or', // Odia
      'pa', // Punjabi
      'sa', // Sanskrit
      'sat', // Santali
      'sd', // Sindhi (RTL)
      'ta', // Tamil
      'te', // Telugu
      'ur', // Urdu (RTL)
    ];

    test('1. ARB Resources: All 23 ARB files exist and have complete, non-empty keys', () {
      final l10nDir = Directory('lib/l10n');
      expect(l10nDir.existsSync(), isTrue, reason: 'lib/l10n directory must exist');

      final englishArbFile = File('lib/l10n/app_en.arb');
      expect(englishArbFile.existsSync(), isTrue, reason: 'Canonical English ARB must exist');

      final enJson = jsonDecode(englishArbFile.readAsStringSync()) as Map<String, dynamic>;
      final canonicalKeys = enJson.keys.where((k) => !k.startsWith('@')).toSet();
      expect(canonicalKeys.length, greaterThanOrEqualTo(300), reason: 'Canonical ARB must have >= 300 keys');

      for (final code in all23LanguageCodes) {
        final arbFile = File('lib/l10n/app_$code.arb');
        expect(arbFile.existsSync(), isTrue, reason: 'ARB file for $code (app_$code.arb) must exist');

        final arbContent = jsonDecode(arbFile.readAsStringSync()) as Map<String, dynamic>;
        final keys = arbContent.keys.where((k) => !k.startsWith('@')).toSet();

        // Check key count
        expect(keys.length, equals(canonicalKeys.length),
            reason: 'Locale $code key count (${keys.length}) must match canonical count (${canonicalKeys.length})');

        // Check for empty translations
        for (final key in keys) {
          final val = arbContent[key];
          expect(val != null && val.toString().trim().isNotEmpty, isTrue,
              reason: 'Locale $code key "$key" must not be empty or null');
        }
      }
    });

    test('2. SupportedLocales: Correctly declares all 23 Indian scheduled languages + English', () {
      expect(SupportedLocales.all.length, equals(23));

      final configuredCodes = SupportedLocales.all.map((l) => l.languageCode).toSet();
      for (final expected in all23LanguageCodes) {
        expect(configuredCodes.contains(expected), isTrue,
            reason: 'Locale code $expected must be included in SupportedLocales.all');
      }

      // Check RTL script definitions
      expect(SupportedLocales.isRtl(const Locale('ur')), isTrue, reason: 'Urdu must be RTL');
      expect(SupportedLocales.isRtl(const Locale('ks')), isTrue, reason: 'Kashmiri must be RTL');
      expect(SupportedLocales.isRtl(const Locale('sd')), isTrue, reason: 'Sindhi must be RTL');

      expect(SupportedLocales.isRtl(const Locale('en')), isFalse, reason: 'English must be LTR');
      expect(SupportedLocales.isRtl(const Locale('ta')), isFalse, reason: 'Tamil must be LTR');
      expect(SupportedLocales.isRtl(const Locale('hi')), isFalse, reason: 'Hindi must be LTR');
      expect(SupportedLocales.isRtl(const Locale('te')), isFalse, reason: 'Telugu must be LTR');

      // Check Directionality
      expect(SupportedLocales.getTextDirection(const Locale('ur')), equals(TextDirection.rtl));
      expect(SupportedLocales.getTextDirection(const Locale('ta')), equals(TextDirection.ltr));

      // Native names non-empty
      for (final locale in SupportedLocales.all) {
        final nativeName = SupportedLocales.getNativeName(locale);
        expect(nativeName.isNotEmpty, isTrue, reason: 'Native name for ${locale.languageCode} must not be empty');
        final fullName = SupportedLocales.getLanguageName(locale);
        expect(fullName.isNotEmpty, isTrue, reason: 'Full language name for ${locale.languageCode} must not be empty');
      }
    });

    test('3. Doctor Localization: Transliterated names & translated specializations across languages', () {
      final doctor = Doctor(
        id: 'doc-1',
        name: 'Dr. Ravi Kumar',
        specialization: 'General Medicine',
        qualification: 'MBBS, MD',
        experienceYears: 12,
        isAvailable: true,
        hospitalId: 'hosp-1',
        nameTranslations: const {
          'ta': 'டாக்டர் ரவி குமார்',
          'hi': 'डॉ. रवि कुमार',
          'te': 'డాక్టర్ రవి కుమార్',
          'kn': 'ಡಾ. ರವಿ ಕುಮಾರ್',
          'ml': 'ഡോ. രവി കുമാർ',
          'mr': 'डॉ. रवी कुमार',
          'bn': 'ডাঃ রবি কুমার',
          'gu': 'ડો. રવિ કુમાર',
          'pa': 'ਡਾ. ਰਵੀ ਕੁਮਾਰ',
          'ur': 'ڈاکٹر روی کمار',
        },
        specializationTranslations: const {
          'ta': 'பொது மருத்துவம்',
          'hi': 'सामान्य चिकित्सा',
          'te': 'సాధారణ వైద్యం',
          'kn': 'ಸಾಮಾನ್ಯ ವೈದ್ಯಕೀಯ',
          'ml': 'ജനറൽ മെഡിസിൻ',
          'mr': 'सामान्य औषधोपचार',
          'bn': 'সাধারণ চিকিৎসা',
          'gu': 'જનરલ મેડિસિન',
          'pa': 'ਜਨਰਲ ਮੈਡੀਸਨ',
          'ur': 'جنرل میڈیسن',
        },
      );

      // Official name preserved for identity and official records
      expect(doctor.name, equals('Dr. Ravi Kumar'));
      expect(doctor.qualification, equals('MBBS, MD'));

      // Display name in English
      expect(doctor.getDisplayName('en'), equals('Dr. Ravi Kumar'));

      // Reviewed transliterations in Indian languages
      expect(doctor.getDisplayName('ta'), equals('டாக்டர் ரவி குமார்'));
      expect(doctor.getDisplayName('hi'), equals('डॉ. रवि कुमार'));
      expect(doctor.getDisplayName('te'), equals('డాక్టర్ రవి కుమార్'));
      expect(doctor.getDisplayName('ur'), equals('ڈاکٹر روی کمار'));

      // Specializations in Indian languages
      expect(doctor.getDisplaySpecialization('ta'), equals('பொது மருத்துவம்'));
      expect(doctor.getDisplaySpecialization('hi'), equals('सामान्य चिकित्सा'));
      expect(doctor.getDisplaySpecialization('ur'), equals('جنرل میڈیسن'));

      // Fallback behavior for unlisted languages
      expect(doctor.getDisplayName('unknown'), equals('Dr. Ravi Kumar'));
      expect(doctor.getDisplaySpecialization('unknown'), equals('General Medicine'));
    });

    test('4. Hospital Localization: Localized names & types without modifying identifiers/coordinates', () {
      final hospital = Hospital(
        id: 'hosp-1',
        name: 'Salem Government Headquarters Hospital',
        districtId: 'dist-1',
        locationName: 'Salem',
        type: 'District Hospital',
        address: 'Collectorate Road, Salem',
        contactNumber: '0427-2450100',
        nameTranslations: const {
          'ta': 'சேலம் அரசு தலைமை மருத்துவமனை',
          'hi': 'सलेम सरकारी मुख्यालय अस्पताल',
          'te': 'సేలం ప్రభుత్వ ప్రధాన ఆసుపత్రి',
          'ur': 'سیلم سرکاری ہیڈ کوارٹر ہسپتال',
        },
        typeTranslations: const {
          'ta': 'மாவட்ட மருத்துவமனை',
          'hi': 'जिला अस्पताल',
          'te': 'జిల్లా ఆసుపత్రి',
          'ur': 'ضلعی ہسپتال',
        },
      );

      // Official record integrity preserved
      expect(hospital.id, equals('hosp-1'));
      expect(hospital.name, equals('Salem Government Headquarters Hospital'));
      expect(hospital.contactNumber, equals('0427-2450100'));

      // Localized display
      expect(hospital.getDisplayName('ta'), equals('சேலம் அரசு தலைமை மருத்துவமனை'));
      expect(hospital.getDisplayName('hi'), equals('सलेम सरकारी मुख्यालय अस्पताल'));
      expect(hospital.getDisplayName('ur'), equals('سیلم سرکاری ہیڈ کوارٹر ہسپتال'));

      expect(hospital.getDisplayType('ta'), equals('மாவட்ட மருத்துவமனை'));
      expect(hospital.getDisplayType('hi'), equals('जिला अस्पताल'));
      expect(hospital.getDisplayType('ur'), equals('ضلعی ہسپتال'));

      // Fallback
      expect(hospital.getDisplayName('unknown'), equals('Salem Government Headquarters Hospital'));
    });

    test('5. AppLocalizations: Loads all 23 locales offline without missing keys', () async {
      for (final code in all23LanguageCodes) {
        final loc = AppLocalizations(Locale(code));
        expect(loc, isNotNull);

        // Core UI navigation labels
        expect(loc.tabHome.isNotEmpty, isTrue, reason: '$code tabHome missing');
        expect(loc.tabAppointments.isNotEmpty, isTrue, reason: '$code tabAppointments missing');
        expect(loc.tabCare.isNotEmpty, isTrue, reason: '$code tabCare missing');
        expect(loc.tabRecords.isNotEmpty, isTrue, reason: '$code tabRecords missing');
        expect(loc.tabProfile.isNotEmpty, isTrue, reason: '$code tabProfile missing');

        // Emergency & Healthcare safety critical strings
        expect(loc.quickActionEmergency.isNotEmpty, isTrue, reason: '$code quickActionEmergency missing');
        expect(loc.emergencyAssistanceMsg.isNotEmpty, isTrue, reason: '$code emergencyAssistanceMsg missing');
        expect(loc.call108Btn.isNotEmpty, isTrue, reason: '$code call108Btn missing');

        // Assistant keys
        expect(loc.assistantCardTitle.isNotEmpty, isTrue, reason: '$code assistantCardTitle missing');
        expect(loc.askAssistantBtn.isNotEmpty, isTrue, reason: '$code askAssistantBtn missing');

        // Booking flow keys
        expect(loc.bookAppointmentTitle.isNotEmpty, isTrue, reason: '$code bookAppointmentTitle missing');
        expect(loc.loadingDoctors.isNotEmpty, isTrue, reason: '$code loadingDoctors missing');
        expect(loc.yearsExpLabel.isNotEmpty, isTrue, reason: '$code yearsExpLabel missing');
      }
    });

    test('6. AppLocalizations Delegate: Supports all 23 locales in Flutter pipeline', () {
      const delegate = AppLocalizations.delegate;
      for (final code in all23LanguageCodes) {
        expect(delegate.isSupported(Locale(code)), isTrue,
            reason: 'AppLocalizationsDelegate must support locale $code');
      }
      expect(delegate.isSupported(const Locale('fr')), isFalse,
          reason: 'Unsupported foreign language should return false');
    });
  });
}
