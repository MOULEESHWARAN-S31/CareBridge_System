import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:care_bridge/core/services/session_service.dart';
import 'package:care_bridge/features/authentication/data/mock_auth_repository.dart';
import 'package:care_bridge/features/authentication/presentation/authentication_controller.dart';
import 'package:care_bridge/features/authentication/presentation/otp_verification_screen.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('CareBridge Unique Random OTP & Popup Notification Tests', () {
    late SessionService sessionService;
    late MockAuthRepository authRepository;
    late AuthenticationController authController;

    setUp(() async {
      SharedPreferences.setMockInitialValues({});
      sessionService = SessionService();
      authRepository = MockAuthRepository(sessionService: sessionService);
      authController = AuthenticationController(
        repository: authRepository,
        sessionService: sessionService,
        enableCountdownTimer: false,
      );
    });

    test('1. OTP format, 6-digit length, and range 100000-999999', () async {
      await authController.sendOtp('9876543210');
      final otp = authController.currentOtp;

      expect(otp.length, equals(6));
      final numericOtp = int.parse(otp);
      expect(numericOtp, greaterThanOrEqualTo(100000));
      expect(numericOtp, lessThanOrEqualTo(999999));
    });

    test('2. Consecutive generated OTPs never match across resends', () async {
      String previousOtp = '';
      for (int i = 0; i < 50; i++) {
        await authController.sendOtp('9876543210');
        final currentOtp = authController.currentOtp;

        expect(currentOtp.length, equals(6));
        expect(int.parse(currentOtp), greaterThanOrEqualTo(100000));
        expect(int.parse(currentOtp), lessThanOrEqualTo(999999));
        if (previousOtp.isNotEmpty) {
          expect(currentOtp, isNot(equals(previousOtp)));
        }
        previousOtp = currentOtp;
      }
    });

    test('3. Old OTP is immediately invalidated when new OTP is generated', () async {
      await authController.sendOtp('9876543210');
      final firstOtp = authController.currentOtp;

      // Resend generates new OTP and invalidates first OTP
      await authController.resendOtp();
      final secondOtp = authController.currentOtp;

      expect(secondOtp, isNot(equals(firstOtp)));

      // Verifying first (old) OTP must fail
      expect(
        () async => await authRepository.verifyOtp('9876543210', firstOtp),
        throwsA(isA<FormatException>()),
      );

      // Verifying second (current) OTP must succeed
      final user = await authController.verifyOtp(secondOtp);
      expect(user, isTrue);
    });

    testWidgets('4. Initial OTP screen entry displays OTP Notification Popup Dialog',
        (WidgetTester tester) async {
      await authController.sendOtp('9876543210');
      final currentOtp = authController.currentOtp;

      await tester.pumpWidget(
        MaterialApp(
          home: CareBridgeAuthScope(
            controller: authController,
            child: const OtpVerificationScreen(),
          ),
        ),
      );

      // Trigger post-frame callback
      await tester.pumpAndSettle();

      // Verify OTP Popup Dialog Title, Message, OTP Code, and OK Button
      expect(find.text('OTP Notification'), findsOneWidget);
      expect(find.text('Your verification OTP is:'), findsOneWidget);
      expect(find.text(currentOtp), findsOneWidget);
      expect(find.text('This is a prototype OTP.'), findsOneWidget);
      expect(find.text('OK'), findsOneWidget);

      // Tap OK dismisses popup dialog
      await tester.tap(find.text('OK'));
      await tester.pumpAndSettle();

      expect(find.text('OTP Notification'), findsNothing);
    });

    testWidgets('5. Resend OTP generates new OTP and shows updated Popup Dialog',
        (WidgetTester tester) async {
      await authController.sendOtp('9876543210');
      final initialOtp = authController.currentOtp;

      await tester.pumpWidget(
        MaterialApp(
          home: CareBridgeAuthScope(
            controller: authController,
            child: const OtpVerificationScreen(),
          ),
        ),
      );
      await tester.pumpAndSettle();

      // Dismiss initial popup
      await tester.tap(find.text('OK'));
      await tester.pumpAndSettle();

      // Tap Resend OTP
      await tester.tap(find.text('Resend OTP'));
      await tester.pumpAndSettle();

      final newOtp = authController.currentOtp;
      expect(newOtp, isNot(equals(initialOtp)));

      // Verify new OTP Popup Dialog is shown with updated OTP
      expect(find.text('OTP Notification'), findsOneWidget);
      expect(find.text(newOtp), findsOneWidget);
    });
  });
}
