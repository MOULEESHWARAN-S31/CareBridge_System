import 'dart:async';
import 'package:flutter/material.dart';
import '../../../core/services/session_service.dart';
import '../domain/auth_repository.dart';
import '../domain/auth_user.dart';

enum AuthStatus {
  unauthenticated,
  otpVerification,
  authenticated,
  onboardingRequired,
  loading,
  error,
}

/// Authentication Controller for CareBridge.
/// Owns authentication state machine, countdown timer, and session coordination.
class AuthenticationController extends ChangeNotifier {
  final AuthRepository repository;
  final SessionService sessionService;
  final ValueChanged<Locale>? onLocaleChanged;
  final bool enableCountdownTimer;

  AuthStatus _status = AuthStatus.unauthenticated;
  AuthUser? _currentUser;
  String _currentPhoneNumber = '';
  String? _errorMessage;

  // OTP Countdown Timer State
  Timer? _countdownTimer;
  int _otpCountdownSeconds = 30;

  AuthenticationController({
    required this.repository,
    required this.sessionService,
    this.onLocaleChanged,
    this.enableCountdownTimer = true,
  });

  // Getters
  AuthStatus get status => _status;
  AuthUser? get currentUser => _currentUser;
  String get currentPhoneNumber => _currentPhoneNumber;
  String? get errorMessage => _errorMessage;
  int get otpCountdownSeconds => _otpCountdownSeconds;
  bool get canResendOtp => _otpCountdownSeconds == 0;
  String get demoOtp => repository.demoOtp;
  String get currentOtp => repository.currentOtp;

  bool get isAuthenticated => sessionService.isAuthenticated() && _currentUser != null;
  bool get isOnboardingSeen => sessionService.isOnboardingSeen();
  bool get isProfileCompleted =>
      sessionService.isProfileCompleted() && (_currentUser?.profileCompleted ?? false);

  /// Initializes controller on startup, attempting to restore authenticated session
  Future<void> restoreSession() async {
    _status = AuthStatus.loading;
    notifyListeners();

    try {
      final user = await repository.restoreSession();
      if (user != null) {
        _currentUser = user;
        _status = user.profileCompleted
            ? AuthStatus.authenticated
            : AuthStatus.onboardingRequired;

        if (user.preferredLanguage.isNotEmpty) {
          onLocaleChanged?.call(Locale(user.preferredLanguage));
        }
      } else {
        _status = AuthStatus.unauthenticated;
      }
    } catch (_) {
      _status = AuthStatus.unauthenticated;
    }

    notifyListeners();
  }

  /// Explicitly marks introductory onboarding as seen
  Future<void> markOnboardingSeen() async {
    await sessionService.setOnboardingSeen(true);
    notifyListeners();
  }

  /// Changes application locale, persists it to session service, and notifies listeners
  void setLocale(String languageCode) {
    sessionService.setPreferredLanguage(languageCode);
    onLocaleChanged?.call(Locale(languageCode));
    if (_currentUser != null) {
      _currentUser = _currentUser!.copyWith(preferredLanguage: languageCode);
    }
    notifyListeners();
  }

  /// Sends mock OTP to patient mobile number
  Future<bool> sendOtp(String phoneNumber) async {
    _status = AuthStatus.loading;
    _errorMessage = null;
    notifyListeners();

    try {
      final success = await repository.sendOtp(phoneNumber);
      if (success) {
        _currentPhoneNumber = phoneNumber.replaceAll(RegExp(r'\s+|-'), '');
        _status = AuthStatus.otpVerification;
        _startOtpCountdown();
        notifyListeners();
        return true;
      }
    } on FormatException catch (e) {
      _errorMessage = e.message;
      _status = AuthStatus.error;
    } catch (e) {
      _errorMessage = 'Failed to request OTP. Please try again.';
      _status = AuthStatus.error;
    }

    notifyListeners();
    return false;
  }

  /// Verifies entered mock OTP
  Future<bool> verifyOtp(String otp) async {
    _status = AuthStatus.loading;
    _errorMessage = null;
    notifyListeners();

    try {
      final user = await repository.verifyOtp(_currentPhoneNumber, otp);
      if (user != null) {
        _stopOtpCountdown();
        _currentUser = user;
        _status = user.profileCompleted
            ? AuthStatus.authenticated
            : AuthStatus.onboardingRequired;
        notifyListeners();
        return true;
      }
    } on FormatException catch (e) {
      _errorMessage = e.message;
      _status = AuthStatus.otpVerification;
    } catch (e) {
      _errorMessage = 'Verification failed. Please try again.';
      _status = AuthStatus.otpVerification;
    }

    notifyListeners();
    return false;
  }

  /// Resends mock OTP and restarts countdown
  Future<bool> resendOtp() async {
    if (!canResendOtp) return false;

    _errorMessage = null;
    try {
      final success = await repository.sendOtp(_currentPhoneNumber);
      if (success) {
        _startOtpCountdown();
        notifyListeners();
        return true;
      }
    } catch (e) {
      _errorMessage = 'Could not resend OTP. Please try again.';
      notifyListeners();
    }
    return false;
  }

  /// Completes patient profile setup
  Future<bool> completeProfile({
    required String name,
    required String language,
    DateTime? dateOfBirth,
    String? gender,
  }) async {
    _status = AuthStatus.loading;
    _errorMessage = null;
    notifyListeners();

    try {
      final user = await repository.completeProfileSetup(
        name: name,
        language: language,
        dateOfBirth: dateOfBirth,
        gender: gender,
      );

      _currentUser = user;
      _status = AuthStatus.authenticated;
      onLocaleChanged?.call(Locale(language));
      notifyListeners();
      return true;
    } on FormatException catch (e) {
      _errorMessage = e.message;
      _status = AuthStatus.onboardingRequired;
    } catch (e) {
      _errorMessage = 'Failed to save profile. Please check your details.';
      _status = AuthStatus.onboardingRequired;
    }

    notifyListeners();
    return false;
  }

  /// Logs out patient and returns to unauthenticated state
  Future<void> logout() async {
    _stopOtpCountdown();
    await repository.logout();
    _currentUser = null;
    _currentPhoneNumber = '';
    _status = AuthStatus.unauthenticated;
    _errorMessage = null;
    notifyListeners();
  }

  /// Resets back to phone entry
  void resetToLogin() {
    _stopOtpCountdown();
    _status = AuthStatus.unauthenticated;
    _errorMessage = null;
    notifyListeners();
  }

  void clearError() {
    if (_errorMessage != null) {
      _errorMessage = null;
      notifyListeners();
    }
  }

  void _startOtpCountdown() {
    _stopOtpCountdown();
    _otpCountdownSeconds = 30;
    if (!enableCountdownTimer) {
      _otpCountdownSeconds = 0;
      return;
    }
    _countdownTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_otpCountdownSeconds > 0) {
        _otpCountdownSeconds--;
        notifyListeners();
      } else {
        _stopOtpCountdown();
        notifyListeners();
      }
    });
  }

  void _stopOtpCountdown() {
    _countdownTimer?.cancel();
    _countdownTimer = null;
  }

  @override
  void dispose() {
    _stopOtpCountdown();
    super.dispose();
  }
}

/// CareBridge Authentication Inherited Scope
/// Enables any widget to cleanly obtain and observe AuthenticationController.
class CareBridgeAuthScope extends InheritedNotifier<AuthenticationController> {
  const CareBridgeAuthScope({
    super.key,
    required AuthenticationController controller,
    required super.child,
  }) : super(notifier: controller);

  static AuthenticationController of(BuildContext context) {
    final scope = context.dependOnInheritedWidgetOfExactType<CareBridgeAuthScope>();
    assert(scope != null, 'No CareBridgeAuthScope found in widget tree.');
    return scope!.notifier!;
  }
}
