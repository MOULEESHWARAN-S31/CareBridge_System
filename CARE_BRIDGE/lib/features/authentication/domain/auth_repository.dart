import 'auth_user.dart';

/// Abstract Authentication Repository Contract.
/// Provides pure domain boundary isolating UI from mock/real implementations.
abstract class AuthRepository {
  /// Development/Demo OTP hint string
  String get demoOtp;

  /// Current active 6-digit OTP string
  String get currentOtp;

  /// Validates phone number and initiates mock OTP dispatch
  Future<bool> sendOtp(String phoneNumber);

  /// Validates OTP and creates initial uncompleted user session
  Future<AuthUser?> verifyOtp(String phoneNumber, String otp);

  /// Completes required patient profile details
  Future<AuthUser> completeProfileSetup({
    required String name,
    required String language,
    DateTime? dateOfBirth,
    String? gender,
  });

  /// Restores authenticated session from local persistent storage
  Future<AuthUser?> restoreSession();

  /// Logs out current patient and clears persistent session
  Future<void> logout();
}
