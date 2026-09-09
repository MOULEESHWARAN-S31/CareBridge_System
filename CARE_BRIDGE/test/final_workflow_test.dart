import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:care_bridge/app/routes/app_routes.dart';
import 'package:care_bridge/core/services/session_service.dart';
import 'package:care_bridge/features/abha/data/mock_abha_repository.dart';
import 'package:care_bridge/features/abha/domain/abha_profile.dart';
import 'package:care_bridge/features/abha/presentation/abha_no_profile_screen.dart';
import 'package:care_bridge/features/abha/presentation/abha_profile_select_screen.dart';
import 'package:care_bridge/features/location/data/location_service_impl.dart';
import 'package:care_bridge/features/location/presentation/location_permission_screen.dart';

void main() {
  group('CareBridge Final Auth, ABHA & Location Workflow Unit & Widget Tests', () {
    late SessionService sessionService;

    setUp(() async {
      sessionService = SessionService();
      await sessionService.resetAll();
    });

    test('MockAbhaRepository fetches profiles for mobile number', () async {
      final repo = MockAbhaRepository(simulatedDelayMs: 0);

      // Default phone returns mock profiles
      final profiles = await repo.fetchProfilesForMobile('9876543210');
      expect(profiles.length, equals(2));
      expect(profiles.first.name, equals('Ramesh Kumar'));
      expect(profiles.first.relationship, equals('Self'));

      // Phone ending in 0000 returns empty list
      final emptyProfiles = await repo.fetchProfilesForMobile('987650000');
      expect(emptyProfiles, isEmpty);
    });

    test('LocationServiceImpl returns sample facilities and calculates distance', () async {
      final locService = LocationServiceImpl();
      final facilities = await locService.getFacilities();

      expect(facilities.length, greaterThanOrEqualTo(3));
      final firstFac = facilities.first;
      expect(firstFac.name, contains('Primary Health Centre'));

      final distLabel = firstFac.distanceLabel(11.6643, 78.1460);
      expect(distLabel, contains('km away'));
    });

    testWidgets('AbhaProfileSelectScreen renders profiles and allows selection', (tester) async {
      final mockProfiles = [
        const AbhaProfile(
          id: 'abha_1',
          name: 'Ramesh Kumar',
          abhaNumber: '12-3456-7890-1234',
          abhaAddress: 'ramesh.k@abdm',
          relationship: 'Self',
          mobileNumber: '9876543210',
        ),
      ];

      await tester.pumpWidget(
        MaterialApp(
          onGenerateRoute: AppRoutes.onGenerateRoute,
          home: AbhaProfileSelectScreen(profiles: mockProfiles),
        ),
      );

      expect(find.text('Connect ABHA Card'), findsOneWidget);
      expect(find.text('Ramesh Kumar'), findsOneWidget);
      expect(find.text('ABHA: 12-3456-7890-1234'), findsOneWidget);
    });

    testWidgets('AbhaNoProfileScreen renders no profile warning and actions', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: AbhaNoProfileScreen(mobileNumber: '9876543210'),
        ),
      );

      expect(find.text('No ABHA Profile Found'), findsOneWidget);
      expect(find.text('Create Your ABHA Card'), findsOneWidget);
      expect(find.text('Skip for Now & Continue'), findsOneWidget);
    });

    testWidgets('LocationPermissionScreen renders explanation and buttons', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: LocationPermissionScreen(),
        ),
      );

      expect(find.text('Find Nearby Care'), findsOneWidget);
      expect(find.text('Enable Location Access'), findsOneWidget);
      expect(find.text('Skip & Use Default Region (Salem)'), findsOneWidget);
    });
  });
}
