import 'dart:io';
import 'package:flutter_test/flutter_test.dart';
import 'package:care_bridge/features/abha/data/mock_abha_repository.dart';

void main() {
  group('MockAbhaRepository Dataset Scenarios', () {
    late MockAbhaRepository repo;

    setUp(() {
      repo = MockAbhaRepository();
    });

    test('9876500001 returns exactly 1 profile (Self)', () async {
      final profiles = await repo.fetchProfilesForMobile('9876500001');
      expect(profiles.length, 1);
      expect(profiles.first.relationship, 'Self');
      expect(profiles.first.name, 'Ramesh Kumar');
      expect(profiles.first.district, 'Salem');
    });

    test('9876500002 returns exactly 2 profiles (Self, Spouse)', () async {
      final profiles = await repo.fetchProfilesForMobile('9876500002');
      expect(profiles.length, 2);
      expect(profiles.map((p) => p.relationship).toList(), containsAll(['Self', 'Spouse']));
    });

    test('9876500003 returns exactly 3 profiles (Self, Spouse, Child)', () async {
      final profiles = await repo.fetchProfilesForMobile('9876500003');
      expect(profiles.length, 3);
      expect(profiles.map((p) => p.relationship).toList(), containsAll(['Self', 'Spouse', 'Child']));
    });

    test('9876500004 returns exactly 4 profiles (Self, Spouse, Child, Parent)', () async {
      final profiles = await repo.fetchProfilesForMobile('9876500004');
      expect(profiles.length, 4);
      expect(
        profiles.map((p) => p.relationship).toList(),
        containsAll(['Self', 'Spouse', 'Child', 'Parent']),
      );
    });

    test('9876543210 returns default 2 profiles for CareBridge demo', () async {
      final profiles = await repo.fetchProfilesForMobile('9876543210');
      expect(profiles.length, 2);
      expect(profiles[0].name, 'Ramesh Kumar');
      expect(profiles[1].name, 'Sunita Kumar');
    });

    test('9876500000 returns 0 profiles to trigger No ABHA Profile Found flow', () async {
      final profiles = await repo.fetchProfilesForMobile('9876500000');
      expect(profiles, isEmpty);
    });

    test('Any mobile number ending in 0000 returns 0 profiles', () async {
      final profiles = await repo.fetchProfilesForMobile('9988770000');
      expect(profiles, isEmpty);
    });

    test('All mock profiles have valid non-empty fields and supported constraints', () async {
      final testNumbers = ['9876500001', '9876500002', '9876500003', '9876500004', '9876543210'];
      final supportedRelationships = {'Self', 'Spouse', 'Child', 'Parent'};
      final supportedGenders = {'Male', 'Female', 'Other'};
      final seenAbhaIds = <String>{};

      for (final number in testNumbers) {
        final profiles = await repo.fetchProfilesForMobile(number);
        for (final profile in profiles) {
          expect(profile.id.isNotEmpty, isTrue);
          expect(profile.name.isNotEmpty, isTrue);
          expect(profile.abhaAddress.contains('@abdm'), isTrue);
          expect(profile.abhaNumber.isNotEmpty, isTrue);
          expect(supportedRelationships.contains(profile.relationship), isTrue);
          expect(supportedGenders.contains(profile.gender), isTrue);
          expect(profile.district != null && profile.district!.isNotEmpty, isTrue);
          expect(profile.state != null && profile.state!.isNotEmpty, isTrue);
          expect(profile.pincode != null && profile.pincode!.isNotEmpty, isTrue);

          // Unique ID check within scenario sets
          seenAbhaIds.add(profile.id);
        }
      }
      expect(seenAbhaIds.length, greaterThanOrEqualTo(10));
    });
  });

  group('Database Static File Integrity Checks (Non-Live)', () {
    test('carebridge_schema.sql contains required tables, constraints, and indexes', () {
      final file = File('database/carebridge_schema.sql');
      expect(file.existsSync(), isTrue, reason: 'database/carebridge_schema.sql must exist');

      final content = file.readAsStringSync();
      expect(content, contains('CREATE TABLE IF NOT EXISTS abha_profiles'));
      expect(content, contains('mobile_number VARCHAR(15) NOT NULL'));
      expect(content, contains('abha_id VARCHAR(32) NOT NULL UNIQUE'));
      expect(content, contains('abha_address VARCHAR(100) NOT NULL UNIQUE'));
      expect(content, contains("CHECK (relationship IN ('Self', 'Spouse', 'Child', 'Parent'))"));
      expect(content, contains('idx_abha_profiles_mobile'));
      expect(content, contains('idx_abha_profiles_district'));
    });

    test('carebridge_seed.sql contains authoritative 36 profiles and required test numbers', () {
      final file = File('database/carebridge_seed.sql');
      expect(file.existsSync(), isTrue, reason: 'database/carebridge_seed.sql must exist');

      final content = file.readAsStringSync();
      expect(content, contains('9876500001'));
      expect(content, contains('9876500002'));
      expect(content, contains('9876500003'));
      expect(content, contains('9876500004'));
      expect(content, contains('9876543210'));
      expect(content.contains('9876500000'), isFalse, reason: 'Zero-profile number should not be seeded');

      // Check occurrences of abha_id pattern: XX-XXXX-XXXX-XXXX
      final idMatches = RegExp(r"'\d{2}-\d{4}-\d{4}-\d{4}'").allMatches(content);
      expect(idMatches.length, 36, reason: 'Must contain exactly 36 synthetic profile seeds');
    });

    test('carebridge_setup.sql and database/README.md exist with proper configuration', () {
      final setupFile = File('database/carebridge_setup.sql');
      expect(setupFile.existsSync(), isTrue);

      final readmeFile = File('database/README.md');
      expect(readmeFile.existsSync(), isTrue);
      final readmeContent = readmeFile.readAsStringSync();
      expect(readmeContent, contains('<POSTGRESQL_INSTALL_PATH>'));
      expect(readmeContent, contains('ORDER BY id'));
      expect(readmeContent.toLowerCase(), contains('never connects directly to postgresql'));
    });
  });
}
