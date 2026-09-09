import 'package:care_bridge/app/app.dart';
import 'package:care_bridge/app/routes/app_routes.dart';
import 'package:care_bridge/core/constants/app_constants.dart';
import 'package:care_bridge/core/services/session_service.dart';
import 'package:care_bridge/features/authentication/data/mock_auth_repository.dart';
import 'package:care_bridge/features/authentication/domain/auth_user.dart';
import 'package:care_bridge/features/authentication/presentation/authentication_controller.dart';
import 'package:care_bridge/features/navigation/main_shell_screen.dart';
import 'package:care_bridge/shared/services/mock_data_service.dart';
import 'package:care_bridge/shared/widgets/care_bridge_button.dart';
import 'package:care_bridge/shared/widgets/care_bridge_logo.dart';
import 'package:care_bridge/shared/widgets/care_bridge_search_bar.dart';
import 'package:care_bridge/shared/widgets/care_bridge_state_widgets.dart';
import 'package:care_bridge/shared/widgets/care_bridge_status_chip.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:shared_preferences/shared_preferences.dart';

void main() {
  setUpAll(() {
    TestWidgetsFlutterBinding.ensureInitialized();
    SharedPreferences.setMockInitialValues({});
  });

  group('CareBridge Step 1 Regression Tests', () {
    testWidgets('5-tab Navigation Test in MainShellScreen', (WidgetTester tester) async {
      final session = SessionService();
      final repo = MockAuthRepository(sessionService: session);
      final controller = AuthenticationController(repository: repo, sessionService: session);

      await tester.pumpWidget(
        CareBridgeAuthScope(
          controller: controller,
          child: const MaterialApp(
            home: MainShellScreen(),
          ),
        ),
      );
      await tester.pumpAndSettle();

      // 1. Home Tab is active
      expect(find.text('Quick Actions'), findsOneWidget);
      expect(find.text('Community Health Status'), findsNothing);

      // 2. Tap Appointments Tab
      await tester.tap(find.text('Appointments'));
      await tester.pumpAndSettle();
      expect(find.text('Upcoming'), findsOneWidget);
      expect(find.text('Past Consultations'), findsOneWidget);

      // 3. Tap Care Tab
      await tester.tap(find.text('Care'));
      await tester.pumpAndSettle();
      expect(find.text('Public Healthcare Services'), findsOneWidget);
      expect(find.text('Find Doctor'), findsOneWidget);

      // 4. Tap Records Tab
      await tester.tap(find.text('Records'));
      await tester.pumpAndSettle();
      expect(find.text('Health Records'), findsOneWidget);
      expect(find.text('Record Categories'), findsOneWidget);

      // 5. Tap Profile Tab
      await tester.tap(find.text('Profile'));
      await tester.pumpAndSettle();
      expect(find.text('Demo User'), findsOneWidget);
      expect(find.text('My Health ID / ABHA'), findsOneWidget);

      // Return to Home Tab
      await tester.tap(find.text('Home'));
      await tester.pumpAndSettle();
      expect(find.text('Quick Actions'), findsOneWidget);
      expect(find.text('Community Health Status'), findsNothing);
    });

    testWidgets('CareBridge Logo fallback test', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: CareBridgeLogo(size: 64.0),
          ),
        ),
      );
      await tester.pump();
      expect(find.byType(CareBridgeLogo), findsOneWidget);
    });

    testWidgets('CareBridge Accessibility Text Scaling Test (1.6x)', (WidgetTester tester) async {
      tester.view.platformDispatcher.textScaleFactorTestValue = 1.6;
      addTearDown(() => tester.view.platformDispatcher.clearTextScaleFactorTestValue());

      final session = SessionService();
      final repo = MockAuthRepository(sessionService: session);
      final controller = AuthenticationController(repository: repo, sessionService: session);

      await tester.pumpWidget(
        CareBridgeAuthScope(
          controller: controller,
          child: const MaterialApp(
            home: MainShellScreen(),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('Good morning,'), findsOneWidget);
      expect(find.text('Quick Actions'), findsOneWidget);
      expect(find.text('Community Health Status'), findsNothing);
    });

    testWidgets('CareBridge Reusable Buttons Variants Test', (WidgetTester tester) async {
      bool primaryPressed = false;
      bool emergencyPressed = false;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: Column(
              children: [
                CareBridgeButton.primary(
                  label: 'Book Consultation',
                  onPressed: () => primaryPressed = true,
                ),
                CareBridgeButton.secondary(
                  label: 'Reschedule',
                  onPressed: () {},
                ),
                CareBridgeButton.outlined(
                  label: 'View History',
                  onPressed: () {},
                ),
                CareBridgeButton.text(
                  label: 'Learn More',
                  onPressed: () {},
                ),
                CareBridgeButton.emergency(
                  label: 'Dial 108',
                  onPressed: () => emergencyPressed = true,
                ),
              ],
            ),
          ),
        ),
      );

      expect(find.text('Book Consultation'), findsOneWidget);
      expect(find.text('Dial 108'), findsOneWidget);

      await tester.tap(find.text('Book Consultation'));
      expect(primaryPressed, isTrue);

      await tester.tap(find.text('Dial 108'));
      expect(emergencyPressed, isTrue);
    });

    testWidgets('CareBridge Status Chip Semantic Icons & Text Test', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Column(
              children: [
                CareBridgeStatusChip(status: CareBridgeStatus.available),
                CareBridgeStatusChip(status: CareBridgeStatus.unavailable),
                CareBridgeStatusChip(status: CareBridgeStatus.pending),
                CareBridgeStatusChip(status: CareBridgeStatus.confirmed),
                CareBridgeStatusChip(status: CareBridgeStatus.completed),
                CareBridgeStatusChip(status: CareBridgeStatus.critical),
                CareBridgeStatusChip(status: CareBridgeStatus.warning),
              ],
            ),
          ),
        ),
      );

      expect(find.text('Available'), findsOneWidget);
      expect(find.text('Unavailable'), findsOneWidget);
      expect(find.text('Pending'), findsOneWidget);
      expect(find.text('Confirmed'), findsOneWidget);
      expect(find.text('Completed'), findsOneWidget);
      expect(find.text('Critical'), findsOneWidget);
      expect(find.text('Warning'), findsOneWidget);

      expect(find.byIcon(Icons.check_circle_rounded), findsOneWidget);
      expect(find.byIcon(Icons.cancel_rounded), findsOneWidget);
      expect(find.byIcon(Icons.hourglass_top_rounded), findsOneWidget);
      expect(find.byIcon(Icons.verified_rounded), findsOneWidget);
      expect(find.byIcon(Icons.task_alt_rounded), findsOneWidget);
      expect(find.byIcon(Icons.warning_rounded), findsOneWidget);
      expect(find.byIcon(Icons.report_problem_rounded), findsOneWidget);
    });

    testWidgets('CareBridge Search Bar Input and Clear Test', (WidgetTester tester) async {
      String query = '';
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: CareBridgeSearchBar(
              onChanged: (val) => query = val,
            ),
          ),
        ),
      );

      await tester.enterText(find.byType(TextField), 'Paracetamol');
      await tester.pump();
      expect(query, 'Paracetamol');
      expect(find.byIcon(Icons.clear_rounded), findsOneWidget);

      await tester.tap(find.byIcon(Icons.clear_rounded));
      await tester.pump();
      expect(query, '');
    });

    testWidgets('CareBridge State Widgets Smoke Test', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Column(
              children: [
                CareBridgeLoading(message: 'Loading PHC Data...'),
                CareBridgeEmptyState(
                  title: 'No Records Found',
                  description: 'No medical files uploaded yet.',
                ),
                CareBridgeErrorState(
                  message: 'Failed to connect to network.',
                ),
              ],
            ),
          ),
        ),
      );

      expect(find.text('Loading PHC Data...'), findsOneWidget);
      expect(find.text('No Records Found'), findsOneWidget);
      expect(find.text('Failed to connect to network.'), findsOneWidget);
    });

    test('MockDataService Isolation Test', () {
      final service = MockDataService.instance;

      final user = service.getUserProfile();
      expect(user.name, 'Demo User');
      expect(user.preferredLanguage, contains('Tamil'));
      expect(user.location, contains('Village A'));

      final appointment = service.getUpcomingAppointment();
      expect(appointment.doctorName, 'Dr. General Medicine');
      expect(appointment.status, CareBridgeStatus.confirmed);

      final referral = service.getActiveReferral();
      expect(referral.fromFacility, contains('Village A'));

      final alert = service.getHealthAlert();
      expect(alert.severity, CareBridgeStatus.warning);

      final medicines = service.getEssentialMedicines();
      expect(medicines, isNotEmpty);
      expect(medicines.first.name, contains('Paracetamol'));

      // Blood availability feature has been removed — no getBloodAvailability() method exists.
      // The absence is verified at compile-time (no reference compiles).
    });
  });

  group('CareBridge Step 2 Authentication & Onboarding Tests', () {
    testWidgets('Fresh Install: Splash navigates to Onboarding', (WidgetTester tester) async {
      final session = SessionService();
      await tester.pumpWidget(CareBridgeApp(sessionService: session));

      // Verify splash branding
      expect(find.text('CareBridge'), findsWidgets);
      expect(find.text('Bridging People to Better Healthcare'), findsWidgets);

      // Settle past splash screen timer
      await tester.pumpAndSettle(const Duration(milliseconds: 2000));

      // Verify first slide of Onboarding
      expect(find.text('Welcome to CareBridge'), findsOneWidget);
      expect(find.text('Skip'), findsOneWidget);
    });

    testWidgets('Onboarding slide progression, language selection and completion',
        (WidgetTester tester) async {
      final session = SessionService();
      await tester.pumpWidget(CareBridgeApp(sessionService: session));
      await tester.pumpAndSettle(const Duration(milliseconds: 2000));

      // Slide 1 -> Slide 2
      expect(find.text('Welcome to CareBridge'), findsOneWidget);
      await tester.tap(find.text('Next'));
      await tester.pumpAndSettle();

      // Slide 2 -> Slide 3
      expect(find.text('Healthcare, closer to you'), findsOneWidget);
      await tester.tap(find.text('Next'));
      await tester.pumpAndSettle();

      // Slide 3 -> Slide 4
      expect(find.text('Your health information, under your control'), findsOneWidget);
      await tester.tap(find.text('Next'));
      await tester.pumpAndSettle();

      // Slide 4: Choose language
      expect(find.text('Choose your language'), findsOneWidget);
      expect(find.text('Get Started'), findsOneWidget);

      // Select Tamil
      await tester.tap(find.text('தமிழ் (Tamil)'));
      await tester.pumpAndSettle();

      // Tap Get Started -> Should mark onboardingSeen and navigate to Login
      await tester.tap(find.text('தொடங்குங்கள்'));
      await tester.pumpAndSettle();

      expect(session.isOnboardingSeen(), isTrue);
      expect(session.isProfileCompleted(), isFalse);
      // Arrived at Login screen
      expect(find.text('மீண்டும் வருக'), findsOneWidget); // Tamil for 'Welcome back'
    });

    testWidgets('Onboarding Skip navigates to Login and preserves profile uncompleted',
        (WidgetTester tester) async {
      final session = SessionService();
      await tester.pumpWidget(CareBridgeApp(sessionService: session));
      await tester.pumpAndSettle(const Duration(milliseconds: 2000));

      expect(find.text('Skip'), findsOneWidget);
      await tester.tap(find.text('Skip'));
      await tester.pumpAndSettle();

      expect(session.isOnboardingSeen(), isTrue);
      expect(session.isProfileCompleted(), isFalse);
      expect(find.text('Welcome back'), findsOneWidget);
    });

    testWidgets('Login mobile validation (invalid input error vs valid input)',
        (WidgetTester tester) async {
      final session = SessionService();
      await session.setOnboardingSeen(true);

      await tester.pumpWidget(CareBridgeApp(sessionService: session));
      await tester.pumpAndSettle(const Duration(milliseconds: 2000));

      // At Login Screen
      expect(find.text('Welcome back'), findsOneWidget);

      // Tap continue with empty phone
      await tester.tap(find.text('Continue'));
      await tester.pumpAndSettle();
      expect(find.text('Please enter your mobile number.'), findsOneWidget);

      // Enter invalid phone
      await tester.enterText(find.byType(TextField), '12345');
      await tester.tap(find.text('Continue'));
      await tester.pumpAndSettle();
      expect(find.text('Please enter a valid 10-digit mobile number.'), findsOneWidget);

      // Enter valid Indian phone starting with 9
      await tester.enterText(find.byType(TextField), '9876543210');
      await tester.tap(find.text('Continue'));
      await tester.pumpAndSettle(const Duration(milliseconds: 600));

      // Should advance to OTP verification screen
      expect(find.text('Verify your mobile number'), findsOneWidget);
      expect(find.textContaining('98765 43210'), findsOneWidget);
    });

    testWidgets('OTP Verification (invalid OTP, change number, valid OTP progression)',
        (WidgetTester tester) async {
      final session = SessionService();
      await session.setOnboardingSeen(true);

      final repo = MockAuthRepository(sessionService: session);
      final controller = AuthenticationController(
        repository: repo,
        sessionService: session,
        enableCountdownTimer: false,
      );

      await tester.pumpWidget(
        CareBridgeApp(
          sessionService: session,
          authRepository: repo,
          authController: controller,
          initialRoute: AppRoutes.login,
        ),
      );
      await tester.pumpAndSettle();

      // Enter phone number and advance to OTP
      await tester.enterText(find.byType(TextField), '9876543210');
      await tester.tap(find.text('Continue'));
      await tester.pumpAndSettle();

      expect(find.text('Verify your mobile number'), findsOneWidget);
      expect(find.textContaining('Demo Mode: Use OTP'), findsOneWidget);

      // Dismiss initial OTP popup dialog if open
      if (find.text('OK').evaluate().isNotEmpty) {
        await tester.tap(find.text('OK'));
        await tester.pumpAndSettle();
      }

      // 1. Enter invalid OTP
      await tester.enterText(find.byType(TextField), '000000');
      await tester.pumpAndSettle();
      expect(
        find.text('The OTP you entered is incorrect. Please try again.'),
        findsOneWidget,
      );

      // 2. Change mobile number action pops back to login
      await tester.tap(find.text('Change mobile number'));
      await tester.pumpAndSettle();
      expect(find.text('Welcome back'), findsOneWidget);

      // Re-enter and proceed to OTP
      await tester.enterText(find.byType(TextField), '9876543210');
      await tester.tap(find.text('Continue'));
      await tester.pumpAndSettle();
      expect(find.text('Verify your mobile number'), findsOneWidget);

      // Dismiss OTP popup dialog if open
      if (find.text('OK').evaluate().isNotEmpty) {
        await tester.tap(find.text('OK'));
        await tester.pumpAndSettle();
      }

      // 3. Enter valid dynamic current OTP -> should navigate to ABHA Lookup / Selection screen
      await tester.enterText(find.byType(TextField), controller.currentOtp);
      await tester.pump();
      await tester.pump(const Duration(seconds: 1));
      await tester.pump(const Duration(seconds: 1));

      // After valid OTP, user should see ABHA profile selection or lookup screen
      expect(find.textContaining('ABHA'), findsAtLeastNWidgets(1));
    });

    testWidgets('Patient Profile Setup validation, consent, and completion',
        (WidgetTester tester) async {
      tester.view.physicalSize = const Size(800, 1200);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      final session = SessionService();
      await session.setOnboardingSeen(true);

      final repo = MockAuthRepository(sessionService: session);
      final controller = AuthenticationController(
        repository: repo,
        sessionService: session,
        enableCountdownTimer: false,
      );
      await controller.sendOtp('9876543210');
      await controller.verifyOtp(controller.currentOtp);

      await tester.pumpWidget(
        CareBridgeApp(
          sessionService: session,
          authRepository: repo,
          authController: controller,
          initialRoute: AppRoutes.profileSetup,
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('Set up your profile'), findsWidgets);

      // Submit without name and without consent
      await tester.tap(find.text('Continue'));
      await tester.pumpAndSettle();
      expect(find.text('Please enter your full name.'), findsOneWidget);
      expect(find.text('Please agree to continue.'), findsOneWidget);

      // Fill in name
      await tester.enterText(find.byType(TextField), 'Mouleeshwaran R');

      // Check consent
      await tester.tap(find.byType(Checkbox));
      await tester.pumpAndSettle();

      // Submit valid profile
      await tester.tap(find.text('Continue'));
      await tester.pumpAndSettle(const Duration(milliseconds: 600));

      // Successfully authenticated & navigated to MainShellScreen with Home tab
      expect(session.isAuthenticated(), isTrue);
      expect(session.isProfileCompleted(), isTrue);
      expect(find.text('Hello, Mouleeshwaran R'), findsOneWidget);
    });

    testWidgets('Logout flow: confirmation modal, session cleared, routes to Login',
        (WidgetTester tester) async {
      tester.view.physicalSize = const Size(800, 1200);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      final session = SessionService();
      await session.setOnboardingSeen(true);
      await session.saveSession(
        const AuthUser(
          id: 'usr_test',
          phoneNumber: '9876543210',
          displayName: 'Mouleeshwaran R',
          preferredLanguage: 'en',
          profileCompleted: true,
        ),
      );

      final repo = MockAuthRepository(sessionService: session);
      final controller = AuthenticationController(
        repository: repo,
        sessionService: session,
        enableCountdownTimer: false,
      );
      await controller.restoreSession();

      await tester.pumpWidget(
        CareBridgeApp(
          sessionService: session,
          authRepository: repo,
          authController: controller,
          initialRoute: AppRoutes.profile,
        ),
      );
      await tester.pumpAndSettle();

      // On Profile screen with authenticated patient name
      expect(find.text('Mouleeshwaran R'), findsOneWidget);

      // Tap Log out
      expect(find.text('Log out'), findsOneWidget);
      await tester.tap(find.text('Log out'));
      await tester.pumpAndSettle();

      // Confirmation modal
      expect(find.text('Log out?'), findsOneWidget);
      expect(find.text('Are you sure you want to log out of CareBridge?'), findsOneWidget);

      // Confirm Logout in modal
      await tester.tap(find.text('Log out').last);
      await tester.pumpAndSettle(const Duration(milliseconds: 600));

      // Session cleared and returned to Login
      expect(session.isAuthenticated(), isFalse);
      expect(find.text('Welcome back'), findsOneWidget);
    });

    testWidgets('Returning User: Splash restores authenticated session to Main',
        (WidgetTester tester) async {
      final session = SessionService();
      await session.setOnboardingSeen(true);
      await session.saveSession(
        const AuthUser(
          id: 'usr_returning',
          phoneNumber: '9876543210',
          displayName: 'Returning Patient',
          preferredLanguage: 'en',
          profileCompleted: true,
        ),
      );

      await tester.pumpWidget(CareBridgeApp(sessionService: session));
      expect(find.text('CareBridge'), findsWidgets);

      // Settle past splash
      await tester.pumpAndSettle(const Duration(milliseconds: 2000));

      // Automatically restored to MainShellScreen with patient name
      expect(find.text('Hello, Returning Patient'), findsOneWidget);
    });

    testWidgets('Protected Route Guard redirects unauthenticated user to Login',
        (WidgetTester tester) async {
      final session = SessionService();
      await session.setOnboardingSeen(true);
      // unauthenticated

      await tester.pumpWidget(
        CareBridgeApp(
          sessionService: session,
          initialRoute: AppRoutes.main,
        ),
      );
      await tester.pumpAndSettle();

      // Guard redirected to Login
      expect(find.text('Welcome back'), findsOneWidget);
    });
  });

  group('CareBridge ABHA Connection Screen Tests', () {
    testWidgets('ABHA screen renders heading, both action buttons, and disclaimer',
        (WidgetTester tester) async {
      final session = SessionService();
      await session.setOnboardingSeen(true);

      final repo = MockAuthRepository(sessionService: session);
      final controller = AuthenticationController(
        repository: repo,
        sessionService: session,
        enableCountdownTimer: false,
      );

      await tester.pumpWidget(
        CareBridgeApp(
          sessionService: session,
          authRepository: repo,
          authController: controller,
          initialRoute: AppRoutes.abhaConnection,
        ),
      );
      await tester.pump();
      await tester.pump(const Duration(seconds: 1));
      await tester.pumpAndSettle();

      // Heading and profiles in AbhaProfileSelectScreen
      expect(find.text('Connect ABHA Card'), findsOneWidget);
      expect(find.text('Ramesh Kumar'), findsOneWidget);

      // Buttons present
      expect(find.text('Connect Selected Profile'), findsOneWidget);
      expect(find.text('Create New ABHA Card'), findsOneWidget);
    });

    testWidgets('ABHA Connect button navigates to location permission or home',
        (WidgetTester tester) async {
      final session = SessionService();
      await session.setOnboardingSeen(true);
      // Simulate authenticated state so protected route allows access
      await session.saveSession(
        const AuthUser(
          id: 'usr_test',
          phoneNumber: '9876543210',
          displayName: 'Test Patient',
          preferredLanguage: 'en',
          profileCompleted: false,
        ),
      );

      final repo = MockAuthRepository(sessionService: session);
      final controller = AuthenticationController(
        repository: repo,
        sessionService: session,
        enableCountdownTimer: false,
      );
      await controller.restoreSession();

      await tester.pumpWidget(
        CareBridgeApp(
          sessionService: session,
          authRepository: repo,
          authController: controller,
          initialRoute: AppRoutes.abhaConnection,
        ),
      );
      await tester.pump();
      await tester.pump(const Duration(seconds: 1));
      await tester.pumpAndSettle();

      expect(find.text('Connect Selected Profile'), findsOneWidget);
      await tester.tap(find.text('Connect Selected Profile'));
      await tester.pump();
      await tester.pump(const Duration(seconds: 1));
      await tester.pumpAndSettle();

      // Should have navigated to LocationPermissionScreen or Home
      expect(find.textContaining('Care'), findsAtLeastNWidgets(1));
    });

    test('ABHA registration URL constant is correct', () {
      expect(
        AppConstants.abhaRegistrationUrl,
        'https://abha.abdm.gov.in/abha/v3/register',
      );
    });
  });

  group('CareBridge Step 3 Patient Home Dashboard Tests', () {
    testWidgets('Dashboard renders with authenticated patient personalization and all sections',
        (WidgetTester tester) async {
      tester.view.physicalSize = const Size(800, 1600);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      final session = SessionService();
      await session.setOnboardingSeen(true);
      await session.saveSession(
        const AuthUser(
          id: 'usr_moulee',
          phoneNumber: '9876543210',
          displayName: 'Mouleeshwaran R',
          preferredLanguage: 'en',
          profileCompleted: true,
        ),
      );

      final repo = MockAuthRepository(sessionService: session);
      final controller = AuthenticationController(
        repository: repo,
        sessionService: session,
        enableCountdownTimer: false,
      );
      await controller.restoreSession();

      await tester.pumpWidget(
        CareBridgeApp(
          sessionService: session,
          authRepository: repo,
          authController: controller,
          initialRoute: AppRoutes.main,
        ),
      );
      await tester.pumpAndSettle();

      // 1. Header with dynamic greeting and patient avatar
      expect(find.text('Good morning,'), findsOneWidget);
      expect(find.text('Hello, Mouleeshwaran R'), findsOneWidget);
      expect(find.text('How can we help you today?'), findsOneWidget);
      expect(find.text('M'), findsOneWidget); // Initial in avatar
      expect(find.byIcon(Icons.notifications_outlined), findsOneWidget);

      // 2. Health Status Banner & ABHA card removed from Home
      expect(find.text('Community Health Status'), findsNothing);
      expect(find.text('Assigned Healthcare Facility'), findsNothing);

      // 3. Quick Actions
      expect(find.text('Quick Actions'), findsOneWidget);
      expect(find.text('Book Doctor'), findsOneWidget);
      expect(find.text('Talk to Doctor'), findsOneWidget);
      expect(find.text('Find Hospital'), findsOneWidget);
      expect(find.text('Emergency'), findsOneWidget);

      // 4. Upcoming Appointment, Referral Status, Health Alerts removed from Home
      expect(find.text('Upcoming Appointment'), findsNothing);
      expect(find.text('Referral Status'), findsNothing);
      expect(find.text('Health Alerts'), findsNothing);

      // 4b. Subtitles removed from Quick Action cards
      expect(find.text('Primary Health Centre'), findsNothing);
      expect(find.text('Teleconsultation'), findsNothing);
      expect(find.text('Bed & doctor availability'), findsNothing);
      expect(find.text('Ambulance 108'), findsNothing);
      expect(find.text('PHC & Hospitals'), findsNothing);
      expect(find.text('Prescriptions & history'), findsNothing);
      expect(find.text('Tokens & schedules'), findsNothing);
      expect(find.text('Diagnostic test reports'), findsNothing);

      // 5. Secondary sections below Quick Actions removed from Home
      expect(find.text('Medicine Availability'), findsNothing);
      expect(find.text('Paracetamol 500mg'), findsNothing);
      expect(find.text('Blood Availability'), findsNothing);
      expect(find.text('Nearby Health Camps'), findsNothing);
      expect(find.text('General Health Screening'), findsNothing);

      // 10. CareBridge Assistant NOT displayed as normal content card, but as floating AI button
      expect(find.text('Ask CareBridge'), findsNothing);
      expect(find.byKey(const Key('floating_assistant_button')), findsOneWidget);
      expect(find.byType(FloatingActionButton), findsOneWidget);

      // 11. Emergency Help section removed from Home
      expect(find.text('Need Emergency Help?'), findsNothing);
    });

    testWidgets('Quick Actions navigation and dialog interactions',
        (WidgetTester tester) async {
      tester.view.physicalSize = const Size(800, 1600);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      final session = SessionService();
      await session.setOnboardingSeen(true);
      await session.saveSession(
        const AuthUser(
          id: 'usr_test',
          phoneNumber: '9876543210',
          displayName: 'Test Patient',
          profileCompleted: true,
        ),
      );

      final repo = MockAuthRepository(sessionService: session);
      final controller = AuthenticationController(
        repository: repo,
        sessionService: session,
        enableCountdownTimer: false,
      );
      await controller.restoreSession();

      await tester.pumpWidget(
        CareBridgeApp(
          sessionService: session,
          authRepository: repo,
          authController: controller,
          initialRoute: AppRoutes.main,
        ),
      );
      await tester.pumpAndSettle();

      // 1. Book Doctor -> opens Book Appointment wizard
      await tester.tap(find.text('Book Doctor'));
      await tester.pumpAndSettle();
      expect(find.text('STEP 1 OF 5'), findsOneWidget);
      expect(find.text('Select District'), findsOneWidget);

      // Back to Home
      await tester.tap(find.byIcon(Icons.arrow_back_rounded));
      await tester.pumpAndSettle();

      // 2. Talk to Doctor -> navigates to teleconsultation
      await tester.tap(find.text('Talk to Doctor'));
      await tester.pumpAndSettle();
      await tester.tap(find.byIcon(Icons.arrow_back_rounded));
      await tester.pumpAndSettle();

      // 3. Find Hospital -> switches to Care tab
      await tester.tap(find.text('Find Hospital'));
      await tester.pumpAndSettle();
      expect(find.text('Hospitals'), findsOneWidget);

      // Switch back to Home tab
      await tester.tap(find.text('Home'));
      await tester.pumpAndSettle();

      // 4. Quick Action Emergency -> displays new Emergency options
      await tester.tap(find.text('Emergency'));
      await tester.pumpAndSettle();
      expect(find.text('Emergency'), findsWidgets);
      expect(find.text('108 Emergency Service'), findsOneWidget);
      expect(find.text('Teleconsultation (Audio)'), findsOneWidget);
      await tester.tap(find.text('Cancel'));
      await tester.pumpAndSettle();

      // 5. Profile Avatar -> navigates to Profile tab
      await tester.tap(find.text('T')); // Initial of Test Patient
      await tester.pumpAndSettle();
      expect(find.text('Test Patient'), findsOneWidget);
      expect(find.text('Log out'), findsOneWidget);
    });

    testWidgets('Modals: Notifications sheet and Assistant entry dialog',
        (WidgetTester tester) async {
      tester.view.physicalSize = const Size(800, 1600);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      final session = SessionService();
      await session.setOnboardingSeen(true);
      await session.saveSession(
        const AuthUser(
          id: 'usr_test',
          phoneNumber: '9876543210',
          displayName: 'Test Patient',
          profileCompleted: true,
        ),
      );

      final repo = MockAuthRepository(sessionService: session);
      final controller = AuthenticationController(
        repository: repo,
        sessionService: session,
        enableCountdownTimer: false,
      );
      await controller.restoreSession();

      await tester.pumpWidget(
        CareBridgeApp(
          sessionService: session,
          authRepository: repo,
          authController: controller,
          initialRoute: AppRoutes.main,
        ),
      );
      await tester.pumpAndSettle();

      // 1. Open Notifications bottom sheet
      await tester.tap(find.byIcon(Icons.notifications_outlined));
      await tester.pumpAndSettle();
      expect(find.text('Notifications'), findsOneWidget);
      expect(find.text('Mark all as read'), findsOneWidget);

      // Dismiss notifications sheet
      await tester.tap(find.text('Mark all as read'));
      await tester.pumpAndSettle();
      await tester.pump(const Duration(seconds: 3));
      await tester.pumpAndSettle();

      // 2. Tap Floating CareBridge Assistant button
      await tester.tap(find.byKey(const Key('floating_assistant_button')));
      await tester.pumpAndSettle();
      expect(find.text('The healthcare assistant will be available soon.'), findsOneWidget);
      await tester.tap(find.text('OK'));
      await tester.pumpAndSettle();

      // 3. Verify Emergency Help section is NOT on Home, and Emergency Quick Action works
      expect(find.text('Need Emergency Help?'), findsNothing);
      await tester.tap(find.text('Emergency'));
      await tester.pumpAndSettle();
      expect(find.text('Emergency Assistance'), findsOneWidget);
      await tester.tap(find.text('Cancel'));
      await tester.pumpAndSettle();
    });

    testWidgets('CareBridge Home Secondary Sections and Floating Assistant Verification',
        (WidgetTester tester) async {
      tester.view.physicalSize = const Size(800, 1600);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      final session = SessionService();
      await session.setOnboardingSeen(true);
      await session.saveSession(
        const AuthUser(
          id: 'usr_home_verify',
          phoneNumber: '9876543210',
          displayName: 'Verification User',
          profileCompleted: true,
        ),
      );

      final repo = MockAuthRepository(sessionService: session);
      final controller = AuthenticationController(
        repository: repo,
        sessionService: session,
        enableCountdownTimer: false,
      );
      await controller.restoreSession();

      await tester.pumpWidget(
        CareBridgeApp(
          sessionService: session,
          authRepository: repo,
          authController: controller,
          initialRoute: AppRoutes.main,
        ),
      );
      await tester.pumpAndSettle();

      // 1. Upcoming Appointments, Referral Status, Health Alerts are ABSENT from Home
      expect(find.text('Upcoming Appointment'), findsNothing);
      expect(find.text('Referral Status'), findsNothing);
      expect(find.text('Health Alerts'), findsNothing);

      // 2. Subtitles removed from all 8 Quick Action cards
      expect(find.text('Primary Health Centre'), findsNothing);
      expect(find.text('Teleconsultation'), findsNothing);
      expect(find.text('Bed & doctor availability'), findsNothing);
      expect(find.text('Ambulance 108'), findsNothing);
      expect(find.text('PHC & Hospitals'), findsNothing);
      expect(find.text('Prescriptions & history'), findsNothing);
      expect(find.text('Tokens & schedules'), findsNothing);
      expect(find.text('Diagnostic test reports'), findsNothing);

      // 3. All 8 Quick Action cards still exist
      expect(find.text('Book Doctor'), findsOneWidget);
      expect(find.text('Talk to Doctor'), findsOneWidget);
      expect(find.text('Find Hospital'), findsOneWidget);
      expect(find.text('Emergency'), findsOneWidget);
      expect(find.text('Healthcare Services'), findsOneWidget);
      expect(find.text('Medical Records'), findsOneWidget);
      expect(find.text('My Appointments'), findsOneWidget);
      expect(find.text('Lab Reports'), findsOneWidget);

      // 4. Medicine Availability and Nearby Health Camps are ABSENT from Home
      expect(find.text('Medicine Availability'), findsNothing);
      expect(find.text('Paracetamol 500mg'), findsNothing);
      expect(find.text('Nearby Health Camps'), findsNothing);
      expect(find.text('General Health Screening'), findsNothing);

      // 6. CareBridge Assistant is NOT displayed as a normal content card
      expect(find.text('Ask CareBridge'), findsNothing);

      // 7. Floating CareBridge Assistant button exists
      expect(find.byKey(const Key('floating_assistant_button')), findsOneWidget);
      expect(find.byType(FloatingActionButton), findsOneWidget);

      // 8. Tapping the floating assistant opens the EXISTING assistant functionality
      await tester.tap(find.byKey(const Key('floating_assistant_button')));
      await tester.pumpAndSettle();
      expect(find.text('CareBridge Assistant'), findsOneWidget);
      expect(find.text('The healthcare assistant will be available soon.'), findsOneWidget);
      await tester.tap(find.text('OK'));
      await tester.pumpAndSettle();

      // 9. Emergency Help is NOT displayed on Home
      expect(find.text('Need Emergency Help?'), findsNothing);

      // 10. Existing Book Doctor action still works
      await tester.tap(find.text('Book Doctor'));
      await tester.pumpAndSettle();
      expect(find.text('STEP 1 OF 5'), findsOneWidget);
      await tester.tap(find.byIcon(Icons.arrow_back_rounded));
      await tester.pumpAndSettle();

      // 11. Existing Talk to Doctor action navigates to teleconsultation
      await tester.tap(find.text('Talk to Doctor'));
      await tester.pumpAndSettle();
      await tester.tap(find.byIcon(Icons.arrow_back_rounded));
      await tester.pumpAndSettle();

      // 12. Existing Find Hospital action still works
      await tester.tap(find.text('Find Hospital'));
      await tester.pumpAndSettle();
      expect(find.text('Hospitals'), findsOneWidget);

      // 13. Bottom navigation still works (switch back to Home)
      await tester.tap(find.text('Home'));
      await tester.pumpAndSettle();
      expect(find.text('Quick Actions'), findsOneWidget);

      // 14. Existing Emergency feature functionality still works via Quick Action
      await tester.tap(find.text('Emergency'));
      await tester.pumpAndSettle();
      expect(find.text('Emergency Assistance'), findsOneWidget);
      await tester.tap(find.text('Cancel'));
      await tester.pumpAndSettle();

      // 15. Verify other bottom navigation tabs work
      await tester.tap(find.text('Appointments'));
      await tester.pumpAndSettle();
      expect(find.text('Past Consultations'), findsOneWidget);
      await tester.tap(find.text('Home'));
      await tester.pumpAndSettle();
    });

    testWidgets('Accessibility text scaling at 1.0x, 1.3x, and 1.6x does not overflow',
        (WidgetTester tester) async {
      tester.view.physicalSize = const Size(800, 1600);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      final session = SessionService();
      await session.setOnboardingSeen(true);
      await session.saveSession(
        const AuthUser(
          id: 'usr_a11y',
          phoneNumber: '9876543210',
          displayName: 'Accessible User',
          profileCompleted: true,
        ),
      );

      for (final scale in [1.0, 1.3, 1.6]) {
        await tester.pumpWidget(
          MediaQuery(
            data: MediaQueryData(textScaler: TextScaler.linear(scale)),
            child: CareBridgeApp(
              sessionService: session,
              initialRoute: AppRoutes.main,
            ),
          ),
        );
        await tester.pumpAndSettle();

        expect(find.text('Good morning,'), findsOneWidget);
        expect(find.text('Hello, Accessible User'), findsOneWidget);
        expect(find.text('Community Health Status'), findsNothing);
        expect(find.text('Quick Actions'), findsOneWidget);
        expect(find.text('Book Doctor'), findsOneWidget);
      }
    });
  });

  group('CareBridge Step 4 Health Records Module Tests', () {
    testWidgets('Health Records screen renders header, summary counters, category chips, and recent records',
        (WidgetTester tester) async {
      tester.view.physicalSize = const Size(400, 1000);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      final session = SessionService();
      await session.setOnboardingSeen(true);
      await session.saveSession(
        const AuthUser(
          id: 'usr_step4',
          phoneNumber: '9876543210',
          displayName: 'Ravi Kumar',
          profileCompleted: true,
        ),
      );

      await tester.pumpWidget(
        CareBridgeApp(
          sessionService: session,
          initialRoute: AppRoutes.records,
        ),
      );
      await tester.pumpAndSettle();

      // Header & Personalization
      expect(find.text('Health Records'), findsOneWidget);
      expect(find.text('Your health information in one place'), findsOneWidget);
      expect(find.text('Ravi'), findsOneWidget);

      // Search Bar
      expect(find.byType(CareBridgeSearchBar), findsOneWidget);

      // Categories
      expect(find.text('Record Categories'), findsOneWidget);
      expect(find.text('Medical Records'), findsWidgets);
      expect(find.text('Lab Reports'), findsWidgets);
      expect(find.text('Prescriptions'), findsWidgets);
      expect(find.text('Vaccinations'), findsWidgets);
      expect(find.text('Other Documents'), findsWidgets);

      // Recent Records Section removed — verify Category cards & Manual entry exist
      expect(find.text('Manual Entry'), findsOneWidget);
    });

    testWidgets('Search filters records and displays friendly empty state when no match',
        (WidgetTester tester) async {
      tester.view.physicalSize = const Size(400, 1000);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      final session = SessionService();
      await session.setOnboardingSeen(true);
      await session.saveSession(
        const AuthUser(
          id: 'usr_search',
          phoneNumber: '9876543210',
          displayName: 'Priya',
          profileCompleted: true,
        ),
      );

      await tester.pumpWidget(
        CareBridgeApp(
          sessionService: session,
          initialRoute: AppRoutes.records,
        ),
      );
      await tester.pumpAndSettle();

      // Enter search query "blood"
      await tester.enterText(find.byType(TextField), 'blood');
      await tester.pumpAndSettle();

      await tester.drag(find.byType(CustomScrollView), const Offset(0, -300));
      await tester.pumpAndSettle();
      expect(find.text('Complete Blood Count (CBC)'), findsOneWidget);
      expect(find.text('General Medical Consultation'), findsNothing);

      // Enter non-matching query
      await tester.enterText(find.byType(TextField), 'xyznonexistent123');
      await tester.pumpAndSettle();

      expect(find.text('No records found'), findsOneWidget);
      expect(find.text('Try a different search term or category filter.'), findsOneWidget);

      // Clear search via clear icon in search bar
      await tester.tap(find.byIcon(Icons.clear_rounded));
      await tester.pumpAndSettle();

      expect(find.byKey(const Key('record_category_card_labReports')), findsOneWidget);
      expect(find.byKey(const Key('record_category_card_medicalRecords')), findsOneWidget);
    });

    testWidgets('Category chips filter records and restore all on selection toggle',
        (WidgetTester tester) async {
      tester.view.physicalSize = const Size(600, 1200);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      final session = SessionService();
      await session.setOnboardingSeen(true);
      await session.saveSession(
        const AuthUser(
          id: 'usr_cat',
          phoneNumber: '9876543210',
          displayName: 'Priya',
          profileCompleted: true,
        ),
      );

      await tester.pumpWidget(
        CareBridgeApp(
          sessionService: session,
          initialRoute: AppRoutes.records,
        ),
      );
      await tester.pumpAndSettle();

      // Tap "Lab Reports" category card
      await tester.tap(find.byKey(const Key('record_category_card_labReports')));
      await tester.pumpAndSettle();

      expect(find.text('Complete Blood Count (CBC)'), findsOneWidget);
      expect(find.text('General Medical Consultation'), findsNothing);

      // Tap "Show All Records" action to reset
      await tester.tap(find.text('Show All Records'));
      await tester.pumpAndSettle();

      expect(find.text('Complete Blood Count (CBC)'), findsOneWidget);
      expect(find.text('General Medical Consultation'), findsOneWidget);
    });

    testWidgets('Record details navigation, clinical summary, structured fields, and mock actions',
        (WidgetTester tester) async {
      tester.view.physicalSize = const Size(400, 1000);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      final session = SessionService();
      await session.setOnboardingSeen(true);
      await session.saveSession(
        const AuthUser(
          id: 'usr_detail',
          phoneNumber: '9876543210',
          displayName: 'Kavitha',
          profileCompleted: true,
        ),
      );

      await tester.pumpWidget(
        CareBridgeApp(
          sessionService: session,
          initialRoute: AppRoutes.records,
        ),
      );
      await tester.pumpAndSettle();

      await tester.drag(find.byType(CustomScrollView), const Offset(0, -300));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Complete Blood Count (CBC)').first);
      await tester.pumpAndSettle();

      // Verified on Record Detail Screen
      expect(find.text('Record Details'), findsOneWidget);
      expect(find.text('Complete Blood Count (CBC)'), findsOneWidget);
      expect(find.text('Government District Hospital'), findsOneWidget);
      expect(find.text('Dr. R. Sundaram (Pathologist)'), findsOneWidget);
      expect(find.text('12 Aug 2026'), findsOneWidget);

      // Clinical Summary & Structured observations
      expect(find.text('Summary'), findsOneWidget);
      expect(find.textContaining('Routine complete blood count check'), findsOneWidget);
      expect(find.text('Test Results & Observations'), findsOneWidget);
      expect(find.text('Hemoglobin'), findsOneWidget);
      expect(find.text('13.8 g/dL'), findsOneWidget);
      expect(find.text('Ref: 13.0 - 17.0 g/dL'), findsOneWidget);

      // Document Preview Placeholder
      expect(find.text('Document Preview'), findsOneWidget);
      expect(
        find.text('This health document will be available here in a future version.'),
        findsOneWidget,
      );

      // Action buttons & future feature message
      await tester.scrollUntilVisible(find.text('Download'), 300);
      await tester.tap(find.text('Download'));
      await tester.pump();
      expect(
        find.text('This feature will be available in a future version.'),
        findsOneWidget,
      );

      // Back navigation returns to Records screen
      await tester.tap(find.byType(BackButton));
      await tester.pumpAndSettle();

      expect(find.text('Health Records'), findsOneWidget);
    });

    testWidgets('Health records renders in Tamil without error',
        (WidgetTester tester) async {
      tester.view.physicalSize = const Size(400, 1000);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      final sessionTa = SessionService();
      await sessionTa.setOnboardingSeen(true);
      await sessionTa.saveSession(
        const AuthUser(
          id: 'usr_locale_ta',
          phoneNumber: '9876543210',
          displayName: 'Demo',
          preferredLanguage: 'ta',
          profileCompleted: true,
        ),
      );

      // Tamil Localization
      await tester.pumpWidget(
        CareBridgeApp(
          sessionService: sessionTa,
          initialRoute: AppRoutes.records,
        ),
      );
      await tester.pumpAndSettle();
      expect(find.text('சுகாதார ஆவணங்கள்'), findsOneWidget);
      expect(find.text('ஆவணப் பிரிவுகள்'), findsOneWidget);
    });

    testWidgets('Health records renders in Hindi without error',
        (WidgetTester tester) async {
      tester.view.physicalSize = const Size(400, 1000);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      final sessionHi = SessionService();
      await sessionHi.setOnboardingSeen(true);
      await sessionHi.saveSession(
        const AuthUser(
          id: 'usr_locale_hi',
          phoneNumber: '9876543210',
          displayName: 'Demo',
          preferredLanguage: 'hi',
          profileCompleted: true,
        ),
      );

      // Hindi Localization
      await tester.pumpWidget(
        CareBridgeApp(
          sessionService: sessionHi,
          initialRoute: AppRoutes.records,
        ),
      );
      await tester.pumpAndSettle();
      expect(find.text('स्वास्थ्य रिकॉर्ड्स'), findsOneWidget);
      expect(find.text('रिकॉर्ड श्रेणियां'), findsOneWidget);
    });

    testWidgets('Health Records and Details accessibility text scaling (1.0x, 1.3x, 1.6x) does not overflow',
        (WidgetTester tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      final session = SessionService();
      await session.setOnboardingSeen(true);
      await session.saveSession(
        const AuthUser(
          id: 'usr_a11y_records',
          phoneNumber: '9876543210',
          displayName: 'A11y Patient',
          profileCompleted: true,
        ),
      );

      for (final scale in [1.0, 1.3, 1.6]) {
        await tester.pumpWidget(
          MediaQuery(
            data: MediaQueryData(textScaler: TextScaler.linear(scale)),
            child: CareBridgeApp(
              sessionService: session,
              initialRoute: AppRoutes.records,
            ),
          ),
        );
        await tester.pumpAndSettle();

        expect(find.text('Health Records'), findsOneWidget);
        expect(find.text('Record Categories'), findsOneWidget);
        expect(find.text('Manual Entry'), findsOneWidget);
      }
    });
  });
}

