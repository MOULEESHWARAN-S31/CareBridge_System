import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:care_bridge/app/routes/app_routes.dart';
import 'package:care_bridge/core/localization/app_localizations.dart';
import 'package:care_bridge/core/services/session_service.dart';
import 'package:care_bridge/features/abha/data/mock_abha_repository.dart';
import 'package:care_bridge/features/abha/domain/abha_profile.dart';
import 'package:care_bridge/features/abha/domain/abha_repository.dart';
import 'package:care_bridge/features/abha/presentation/abha_lookup_screen.dart';
import 'package:care_bridge/features/abha/presentation/abha_no_profile_screen.dart';
import 'package:care_bridge/features/abha/presentation/abha_profile_select_screen.dart';
import 'package:care_bridge/features/authentication/data/mock_auth_repository.dart';
import 'package:care_bridge/features/authentication/domain/auth_user.dart';
import 'package:care_bridge/features/authentication/presentation/authentication_controller.dart';
import 'package:care_bridge/features/authentication/presentation/otp_verification_screen.dart';
import 'package:care_bridge/features/authentication/presentation/patient_profile_setup_screen.dart';
import 'package:care_bridge/features/location/domain/healthcare_facility.dart';

class FailingAbhaRepository implements AbhaRepository {
  @override
  Future<List<AbhaProfile>> fetchProfilesForMobile(String mobileNumber) async {
    throw Exception('Database connection error');
  }

  @override
  Future<List<AbhaProfile>> findProfilesByMobile(String mobileNumber) async {
    throw Exception('Database connection error');
  }

  @override
  Future<void> selectProfile(AbhaProfile profile) async {}
}

void main() {
  group('CareBridge ABHA Mobile Lookup, Login & Profile Selection Flow Tests', () {
    late SessionService sessionService;
    late MockAbhaRepository abhaRepo;

    setUp(() async {
      sessionService = SessionService();
      await sessionService.resetAll();
      abhaRepo = MockAbhaRepository(simulatedDelayMs: 0);
    });

    Future<void> pumpTransition(WidgetTester tester) async {
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 100));
      await tester.pump(const Duration(milliseconds: 350));
      await tester.pump(const Duration(milliseconds: 100));
    }

    // 1. OTP verification leads to ABHA lookup.
    testWidgets('1. OTP verification leads to ABHA lookup', (tester) async {
      final authRepo = MockAuthRepository(sessionService: sessionService);
      final controller = AuthenticationController(
        repository: authRepo,
        sessionService: sessionService,
        enableCountdownTimer: false,
      );

      await controller.sendOtp('9876543210');

      await tester.pumpWidget(
        MaterialApp(
          localizationsDelegates: const [AppLocalizations.delegate],
          home: CareBridgeAuthScope(
            controller: controller,
            child: const OtpVerificationScreen(),
          ),
          onGenerateRoute: AppRoutes.onGenerateRoute,
        ),
      );
      await pumpTransition(tester);

      // Dismiss initial popup dialog
      if (find.text('OK').evaluate().isNotEmpty) {
        await tester.tap(find.text('OK'));
        await pumpTransition(tester);
      }

      // Enter OTP
      await tester.enterText(find.byType(TextField), controller.currentOtp);
      await pumpTransition(tester);

      // Confirms navigation to ABHA lookup screen
      expect(find.byType(AbhaLookupScreen), findsOneWidget);
    });

    // 2. Mobile 9876500001 returns exactly 1 profile.
    test('2. Mobile 9876500001 returns exactly 1 profile', () async {
      final profiles = await abhaRepo.findProfilesByMobile('9876500001');
      expect(profiles.length, 1);
      expect(profiles.first.relationship, 'Self');
      expect(profiles.first.name, 'Ramesh Kumar');
    });

    // 3. Mobile 9876500002 returns exactly 2 profiles.
    test('3. Mobile 9876500002 returns exactly 2 profiles', () async {
      final profiles = await abhaRepo.findProfilesByMobile('9876500002');
      expect(profiles.length, 2);
      expect(profiles.map((p) => p.relationship).toList(), containsAll(['Self', 'Spouse']));
    });

    // 4. Mobile 9876500003 returns exactly 3 profiles.
    test('4. Mobile 9876500003 returns exactly 3 profiles', () async {
      final profiles = await abhaRepo.findProfilesByMobile('9876500003');
      expect(profiles.length, 3);
      expect(profiles.map((p) => p.relationship).toList(), containsAll(['Self', 'Spouse', 'Child']));
    });

    // 5. Mobile 9876500004 returns exactly 4 profiles.
    test('5. Mobile 9876500004 returns exactly 4 profiles', () async {
      final profiles = await abhaRepo.findProfilesByMobile('9876500004');
      expect(profiles.length, 4);
      expect(
        profiles.map((p) => p.relationship).toList(),
        containsAll(['Self', 'Spouse', 'Child', 'Parent']),
      );
    });

    // 6. Mobile 9876543210 returns exactly 2 profiles.
    test('6. Mobile 9876543210 returns exactly 2 profiles', () async {
      final profiles = await abhaRepo.findProfilesByMobile('9876543210');
      expect(profiles.length, 2);
    });

    // 7. Mobile 9876500000 returns zero profiles.
    test('7. Mobile 9876500000 returns zero profiles', () async {
      final profiles = await abhaRepo.findProfilesByMobile('9876500000');
      expect(profiles, isEmpty);
    });

    // 8. One profile opens Patient Profile directly.
    testWidgets('8. One profile opens Patient Profile directly', (tester) async {
      final authRepo = MockAuthRepository(sessionService: sessionService);
      final controller = AuthenticationController(
        repository: authRepo,
        sessionService: sessionService,
        enableCountdownTimer: false,
      );
      await sessionService.saveSession(
        const AuthUser(
          id: 'u1',
          phoneNumber: '9876500001',
          displayName: 'Ramesh Kumar',
          preferredLanguage: 'en',
          profileCompleted: false,
        ),
      );

      await tester.pumpWidget(
        MaterialApp(
          localizationsDelegates: const [AppLocalizations.delegate],
          builder: (context, child) => CareBridgeAuthScope(
            controller: controller,
            child: child!,
          ),
          home: AbhaLookupScreen(
            repository: abhaRepo,
            sessionService: sessionService,
            initialMobileNumber: '9876500001',
          ),
          onGenerateRoute: AppRoutes.onGenerateRoute,
        ),
      );

      await pumpTransition(tester);

      // For 1 profile, directly opens Patient Profile (PatientProfileSetupScreen) without Select Profile
      expect(find.byType(PatientProfileSetupScreen), findsOneWidget);
      expect(find.byType(AbhaProfileSelectScreen), findsNothing);
      expect(sessionService.getActiveAbhaProfile()?.name, 'Ramesh Kumar');
    });

    // 9. Multiple profiles open Select Profile.
    testWidgets('9. Multiple profiles open Select Profile', (tester) async {
      final authRepo = MockAuthRepository(sessionService: sessionService);
      final controller = AuthenticationController(
        repository: authRepo,
        sessionService: sessionService,
        enableCountdownTimer: false,
      );

      await tester.pumpWidget(
        MaterialApp(
          localizationsDelegates: const [AppLocalizations.delegate],
          builder: (context, child) => CareBridgeAuthScope(
            controller: controller,
            child: child!,
          ),
          home: AbhaLookupScreen(
            repository: abhaRepo,
            sessionService: sessionService,
            initialMobileNumber: '9876500002',
          ),
          onGenerateRoute: AppRoutes.onGenerateRoute,
        ),
      );

      await pumpTransition(tester);

      // For >= 2 profiles, opens Select Profile
      expect(find.byType(AbhaProfileSelectScreen), findsOneWidget);
      expect(find.text('Priya Sundaram'), findsOneWidget);
      expect(find.text('Karthik Sundaram'), findsOneWidget);
    });

    // 10. Selecting a profile stores the correct ABHA profile ID.
    testWidgets('10. Selecting a profile stores the correct ABHA profile ID', (tester) async {
      final profiles = await abhaRepo.findProfilesByMobile('9876500002');
      final authRepo = MockAuthRepository(sessionService: sessionService);
      final controller = AuthenticationController(
        repository: authRepo,
        sessionService: sessionService,
        enableCountdownTimer: false,
      );

      await tester.pumpWidget(
        MaterialApp(
          localizationsDelegates: const [AppLocalizations.delegate],
          builder: (context, child) => CareBridgeAuthScope(
            controller: controller,
            child: child!,
          ),
          home: AbhaProfileSelectScreen(
            profiles: profiles,
            sessionService: sessionService,
          ),
          onGenerateRoute: AppRoutes.onGenerateRoute,
        ),
      );
      await pumpTransition(tester);

      // Select the second profile (Karthik Sundaram)
      await tester.tap(find.text('Karthik Sundaram'));
      await pumpTransition(tester);

      // Confirm selection
      await tester.tap(find.text('Connect Selected Profile'));
      await pumpTransition(tester);

      // Verifies active profile ID matches Karthik's profile
      expect(sessionService.getActiveAbhaProfileId(), '34-5678-9012-2002');
      expect(sessionService.getActiveAbhaProfile()?.name, 'Karthik Sundaram');
    });

    // 11. Different profiles linked to the same mobile remain distinct.
    test('11. Different profiles linked to the same mobile remain distinct', () async {
      final profiles = await abhaRepo.findProfilesByMobile('9876500003');
      expect(profiles.length, 3);

      final p1 = profiles[0];
      final p2 = profiles[1];
      final p3 = profiles[2];

      expect(p1.id, isNot(equals(p2.id)));
      expect(p2.id, isNot(equals(p3.id)));
      expect(p1.name, 'Murugan Palani');
      expect(p2.name, 'Lakshmi Murugan');
      expect(p3.name, 'Kavin Murugan');
      expect(p1.relationship, 'Self');
      expect(p2.relationship, 'Spouse');
      expect(p3.relationship, 'Child');
    });

    // 12. Zero profiles show Create ABHA Card.
    testWidgets('12. Zero profiles show Create ABHA Card', (tester) async {
      final authRepo = MockAuthRepository(sessionService: sessionService);
      final controller = AuthenticationController(
        repository: authRepo,
        sessionService: sessionService,
        enableCountdownTimer: false,
      );

      await tester.pumpWidget(
        MaterialApp(
          localizationsDelegates: const [AppLocalizations.delegate],
          home: CareBridgeAuthScope(
            controller: controller,
            child: AbhaLookupScreen(
              repository: abhaRepo,
              sessionService: sessionService,
              initialMobileNumber: '9876500000',
            ),
          ),
          onGenerateRoute: AppRoutes.onGenerateRoute,
        ),
      );

      await pumpTransition(tester);

      expect(find.byType(AbhaNoProfileScreen), findsOneWidget);
      expect(find.textContaining('Create'), findsAtLeastNWidgets(1));
    });

    testWidgets('12b. Non-existent arbitrary mobile numbers show Create ABHA Card', (tester) async {
      final authRepo = MockAuthRepository(sessionService: sessionService);
      final controller = AuthenticationController(
        repository: authRepo,
        sessionService: sessionService,
        enableCountdownTimer: false,
      );

      await tester.pumpWidget(
        MaterialApp(
          localizationsDelegates: const [AppLocalizations.delegate],
          home: CareBridgeAuthScope(
            controller: controller,
            child: AbhaLookupScreen(
              repository: abhaRepo,
              sessionService: sessionService,
              initialMobileNumber: '9842199887', // Arbitrary number not in dataset
            ),
          ),
          onGenerateRoute: AppRoutes.onGenerateRoute,
        ),
      );

      await pumpTransition(tester);

      expect(find.byType(AbhaNoProfileScreen), findsOneWidget);
      expect(find.textContaining('Create'), findsAtLeastNWidgets(1));
    });

    // 13. Repository/database errors are not treated as zero profiles.
    testWidgets('13. Repository/database errors are not treated as zero profiles', (tester) async {
      final authRepo = MockAuthRepository(sessionService: sessionService);
      final controller = AuthenticationController(
        repository: authRepo,
        sessionService: sessionService,
        enableCountdownTimer: false,
      );

      await tester.pumpWidget(
        MaterialApp(
          localizationsDelegates: const [AppLocalizations.delegate],
          home: CareBridgeAuthScope(
            controller: controller,
            child: AbhaLookupScreen(
              repository: FailingAbhaRepository(),
              sessionService: sessionService,
              initialMobileNumber: '9876543210',
            ),
          ),
          onGenerateRoute: AppRoutes.onGenerateRoute,
        ),
      );

      await pumpTransition(tester);

      // Must NOT navigate to AbhaNoProfileScreen
      expect(find.byType(AbhaNoProfileScreen), findsNothing);

      // Must display localized error message and retry button
      expect(find.text('Retry'), findsOneWidget);
      expect(find.textContaining('Something went wrong'), findsOneWidget);
    });

    // 14. Selected ABHA profile survives the expected session lifecycle.
    test('14. Selected ABHA profile survives the expected session lifecycle', () async {
      final profile = AbhaProfile(
        id: '12-3456-7890-1001',
        name: 'Ramesh Kumar',
        abhaNumber: '12-3456-7890-1001',
        abhaAddress: 'ramesh.kumar@abdm',
        relationship: 'Self',
        mobileNumber: '9876500001',
        district: 'Salem',
        state: 'Tamil Nadu',
        pincode: '636001',
      );

      await sessionService.setActiveAbhaProfile(profile);
      await sessionService.saveSession(
        AuthUser(
          id: 'u1',
          phoneNumber: '9876500001',
          displayName: profile.fullName,
          preferredLanguage: 'en',
          profileCompleted: true,
          abhaNumber: profile.abhaNumber,
          abhaAddress: profile.abhaAddress,
        ),
      );

      expect(sessionService.isAuthenticated(), isTrue);
      expect(sessionService.getActiveAbhaProfileId(), '12-3456-7890-1001');
      expect(sessionService.getActiveAbhaProfile()?.name, 'Ramesh Kumar');
    });

    // 15. ABHA profile selection does not overwrite Assigned Facility.
    test('15. ABHA profile selection does not overwrite Assigned Facility', () async {
      const existingAssignedFacility = HealthcareFacility(
        id: 'phc_salem_main',
        name: 'Salem Urban PHC',
        type: FacilityType.phc,
        district: 'Salem',
        address: 'Salem City',
        latitude: 11.6643,
        longitude: 78.1460,
      );
      await sessionService.setAssignedFacility(existingAssignedFacility);

      // Now set/select an ABHA profile
      final profile = AbhaProfile(
        id: '45-6789-0123-3001',
        name: 'Murugan Palani',
        abhaNumber: '45-6789-0123-3001',
        abhaAddress: 'murugan.palani@abdm',
        relationship: 'Self',
        mobileNumber: '9876500003',
        district: 'Madurai',
        state: 'Tamil Nadu',
        pincode: '625001',
      );
      await sessionService.setActiveAbhaProfile(profile);

      // Assigned facility remains unchanged
      final assigned = sessionService.getAssignedFacility();
      expect(assigned, isNotNull);
      expect(assigned!.id, 'phc_salem_main');
      expect(assigned.name, 'Salem Urban PHC');
    });

    // 16. ABHA profile selection does not overwrite Last Visited Facility.
    test('16. ABHA profile selection does not overwrite Last Visited Facility', () async {
      const existingLastVisitedFacility = HealthcareFacility(
        id: 'hosp_gh_salem',
        name: 'Government Mohan Kumaramangalam Medical College Hospital',
        type: FacilityType.hospital,
        district: 'Salem',
        address: 'Fort Road, Salem',
        latitude: 11.6583,
        longitude: 78.1584,
      );
      await sessionService.setLastVisitedFacility(existingLastVisitedFacility);

      // Select profile
      final profile = AbhaProfile(
        id: '78-9012-3456-4001',
        name: 'Selvi Anbarasan',
        abhaNumber: '78-9012-3456-4001',
        abhaAddress: 'selvi.anbarasan@abdm',
        relationship: 'Self',
        mobileNumber: '9876500004',
        district: 'Trichy',
        state: 'Tamil Nadu',
        pincode: '620001',
      );
      await sessionService.setActiveAbhaProfile(profile);

      // Last visited facility remains unchanged
      final lastVisited = sessionService.getLastVisitedFacility();
      expect(lastVisited, isNotNull);
      expect(lastVisited!.id, 'hosp_gh_salem');
      expect(lastVisited.name, 'Government Mohan Kumaramangalam Medical College Hospital');
    });
  });
}
