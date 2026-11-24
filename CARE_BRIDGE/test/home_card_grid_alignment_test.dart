import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:care_bridge/app/app.dart';
import 'package:care_bridge/app/routes/app_routes.dart';
import 'package:care_bridge/core/services/session_service.dart';
import 'package:care_bridge/features/authentication/domain/auth_user.dart';
import 'package:care_bridge/features/authentication/data/mock_auth_repository.dart';
import 'package:care_bridge/features/authentication/presentation/authentication_controller.dart';

void main() {
  setUpAll(() {
    TestWidgetsFlutterBinding.ensureInitialized();
    SharedPreferences.setMockInitialValues({});
  });

  group('Home Screen Card Grid Alignment & Text Wrapping Verification', () {
    late SessionService session;
    late MockAuthRepository repo;
    late AuthenticationController controller;

    setUp(() async {
      session = SessionService();
      await session.setOnboardingSeen(true);
      await session.saveSession(
        const AuthUser(
          id: 'usr_grid_test',
          phoneNumber: '9876543210',
          displayName: 'Grid Tester',
          preferredLanguage: 'en',
          profileCompleted: true,
        ),
      );

      repo = MockAuthRepository(sessionService: session);
      controller = AuthenticationController(
        repository: repo,
        sessionService: session,
        enableCountdownTimer: false,
      );
      await controller.restoreSession();
    });

    testWidgets('1 & 2. All 8 cards have equal widths and equal heights in mobile 2-column grid',
        (WidgetTester tester) async {
      tester.view.physicalSize = const Size(390, 844); // iPhone 12/13/14 standard
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      await tester.pumpWidget(
        CareBridgeApp(
          sessionService: session,
          authRepository: repo,
          authController: controller,
          initialRoute: AppRoutes.main,
        ),
      );
      await tester.pumpAndSettle();

      // Find the text for all 8 cards
      final cardLabels = [
        'Book Doctor',
        'Talk to Doctor',
        'Find Hospital',
        'Emergency',
        'Healthcare Services',
        'Medical Records',
        'My Appointments',
        'Lab Reports',
      ];

      for (final label in cardLabels) {
        expect(find.text(label), findsOneWidget);
      }

      // Verify each card's parent Material has identical size
      final cardMaterials = cardLabels.map((label) {
        return find.ancestor(of: find.text(label), matching: find.byType(Material)).first;
      }).toList();

      final firstSize = tester.getSize(cardMaterials[0]);
      for (int i = 1; i < cardMaterials.length; i++) {
        final size = tester.getSize(cardMaterials[i]);
        expect(size.width, equals(firstSize.width),
            reason: 'Card $i width must exactly match Card 0 width');
        expect(size.height, equals(firstSize.height),
            reason: 'Card $i height must exactly match Card 0 height');
      }
    });

    testWidgets('3 & 4. Icons align consistently and titles are horizontally centered without ellipsis',
        (WidgetTester tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      await tester.pumpWidget(
        CareBridgeApp(
          sessionService: session,
          authRepository: repo,
          authController: controller,
          initialRoute: AppRoutes.main,
        ),
      );
      await tester.pumpAndSettle();

      // Verify Row 1 icons have identical top Y position
      final bookDoctorIcon = tester.getTopLeft(find.byIcon(Icons.calendar_month_rounded));
      final talkDoctorIcon = tester.getTopLeft(find.byIcon(Icons.video_call_rounded));
      expect(bookDoctorIcon.dy, equals(talkDoctorIcon.dy),
          reason: 'Row 1 icons must have identical vertical baseline');

      // Verify Row 2 icons have identical top Y position
      final hospitalIcon = tester.getTopLeft(find.byIcon(Icons.local_hospital_rounded));
      final emergencyIcon = tester.getTopLeft(find.byIcon(Icons.emergency_rounded));
      expect(hospitalIcon.dy, equals(emergencyIcon.dy),
          reason: 'Row 2 icons must have identical vertical baseline');

      // Verify Text alignment is centered and wraps without ellipsis
      final healthcareServicesText = tester.widget<Text>(find.text('Healthcare Services'));
      expect(healthcareServicesText.textAlign, equals(TextAlign.center));
      expect(healthcareServicesText.softWrap, isTrue);
      expect(healthcareServicesText.overflow, isNull);

      final myAppointmentsText = tester.widget<Text>(find.text('My Appointments'));
      expect(myAppointmentsText.textAlign, equals(TextAlign.center));
      expect(myAppointmentsText.softWrap, isTrue);
      expect(myAppointmentsText.overflow, isNull);
    });

    testWidgets('5 & 6. Responsiveness across screen widths (320px, 360px, 430px, 768px) without overflow',
        (WidgetTester tester) async {
      for (final width in [320.0, 360.0, 430.0, 768.0]) {
        tester.view.physicalSize = Size(width, 900);
        tester.view.devicePixelRatio = 1.0;

        await tester.pumpWidget(
          CareBridgeApp(
            sessionService: session,
            authRepository: repo,
            authController: controller,
            initialRoute: AppRoutes.main,
          ),
        );
        await tester.pumpAndSettle();

        expect(find.text('Healthcare Services'), findsOneWidget);
        expect(find.text('My Appointments'), findsOneWidget);
        expect(find.text('Emergency'), findsOneWidget);
        expect(tester.takeException(), isNull,
            reason: 'Zero overflow exceptions on width $width');
      }

      tester.view.resetPhysicalSize();
      tester.view.resetDevicePixelRatio();
    });

    testWidgets('7 & 8. Floating assistant clearance & card navigation actions work',
        (WidgetTester tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      await tester.pumpWidget(
        CareBridgeApp(
          sessionService: session,
          authRepository: repo,
          authController: controller,
          initialRoute: AppRoutes.main,
        ),
      );
      await tester.pumpAndSettle();

      // Floating assistant exists
      expect(find.byKey(const Key('floating_assistant_button')), findsOneWidget);

      // Scroll to the bottom of the home screen
      await tester.drag(find.byType(SingleChildScrollView), const Offset(0, -500));
      await tester.pumpAndSettle();

      // Lab Reports (bottom-right card) is fully visible and tappable
      expect(find.text('Lab Reports'), findsOneWidget);
      await tester.tap(find.text('Lab Reports'));
      await tester.pumpAndSettle();

      // Should have navigated to Records tab (index 3)
      expect(find.text('Health Records'), findsOneWidget);
    });

    testWidgets('9. Multilingual card titles render in Tamil and Hindi without overflow',
        (WidgetTester tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      // Test Tamil localization
      final sessionTa = SessionService();
      await sessionTa.setOnboardingSeen(true);
      await sessionTa.saveSession(
        const AuthUser(
          id: 'usr_ta',
          phoneNumber: '9876543210',
          displayName: 'தமிழன்',
          preferredLanguage: 'ta',
          profileCompleted: true,
        ),
      );

      await tester.pumpWidget(
        CareBridgeApp(
          sessionService: sessionTa,
          initialRoute: AppRoutes.main,
          initialLocale: const Locale('ta'),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('மருத்துவர் பதிவு'), findsOneWidget);
      expect(find.text('அவசரம்'), findsOneWidget);
      expect(find.text('சுகாதார சேவைகள்'), findsOneWidget);
      expect(find.text('எனது சந்திப்புகள்'), findsOneWidget);
      expect(tester.takeException(), isNull);

      // Test Hindi localization
      final sessionHi = SessionService();
      await sessionHi.setOnboardingSeen(true);
      await sessionHi.saveSession(
        const AuthUser(
          id: 'usr_hi',
          phoneNumber: '9876543210',
          displayName: 'परीक्षार्थी',
          preferredLanguage: 'hi',
          profileCompleted: true,
        ),
      );

      await tester.pumpWidget(
        CareBridgeApp(
          sessionService: sessionHi,
          initialRoute: AppRoutes.main,
          initialLocale: const Locale('hi'),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('डॉक्टर बुक करें'), findsOneWidget);
      expect(find.text('आपातकालीन'), findsOneWidget);
      expect(find.text('स्वास्थ्य सेवाएं'), findsOneWidget);
      expect(find.text('मेरी नियुक्तियां'), findsOneWidget);
      expect(tester.takeException(), isNull);
    });
  });
}
