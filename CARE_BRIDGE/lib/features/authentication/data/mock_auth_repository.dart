import 'dart:math';
import '../../../core/services/session_service.dart';
import '../domain/auth_repository.dart';
import '../domain/auth_user.dart';

/// Mock Implementation of AuthRepository for Step 2 & OTP Updates.
/// Single source of truth for dynamic 6-digit random OTPs (100000–999999).
class MockAuthRepository implements AuthRepository {
  final SessionService sessionService;
  final Duration networkDelay;
  final Random _random = Random.secure();

  String? _currentOtp;
  String? _previousOtp;
  AuthUser? _currentUser;

  MockAuthRepository({
    required this.sessionService,
    this.networkDelay = Duration.zero,
  });

  @override
  String get demoOtp {
    _currentOtp ??= _generateUniqueOtp();
    return _currentOtp!;
  }

  @override
  String get currentOtp => demoOtp;

  String _generateUniqueOtp() {
    String newOtp;
    do {
      final number = 100000 + _random.nextInt(900000);
      newOtp = number.toString();
    } while (newOtp == _previousOtp);
    return newOtp;
  }

  @override
  Future<bool> sendOtp(String phoneNumber) async {
    if (networkDelay > Duration.zero) {
      await Future<void>.delayed(networkDelay);
    }

    // Validate 10-digit Indian mobile number starting with 6, 7, 8, or 9
    final cleanNumber = phoneNumber.replaceAll(RegExp(r'\s+|-'), '');
    final bool isValid = RegExp(r'^[6-9]\d{9}$').hasMatch(cleanNumber);

    if (!isValid) {
      throw const FormatException('Please enter a valid 10-digit mobile number.');
    }

    final newOtp = _generateUniqueOtp();
    _previousOtp = _currentOtp;
    _currentOtp = newOtp;

    return true;
  }

  @override
  Future<AuthUser?> verifyOtp(String phoneNumber, String otp) async {
    if (networkDelay > Duration.zero) {
      await Future<void>.delayed(networkDelay);
    }

    if (_currentOtp == null || otp != _currentOtp) {
      throw const FormatException('The OTP you entered is incorrect. Please try again.');
    }

    final cleanPhone = phoneNumber.replaceAll(RegExp(r'\s+|-'), '');

    // Check if user already exists in storage for this phone number
    final storedUser = sessionService.getStoredUser();
    if (storedUser != null && storedUser.phoneNumber == cleanPhone) {
      _currentUser = storedUser;
      await sessionService.saveSession(_currentUser!);
      return _currentUser;
    }

    // Otherwise create initial patient profile with profileCompleted = false
    _currentUser = AuthUser(
      id: 'pat_${cleanPhone.substring(cleanPhone.length - 4)}_${DateTime.now().millisecondsSinceEpoch % 10000}',
      phoneNumber: cleanPhone,
      displayName: '',
      profileCompleted: false,
    );

    await sessionService.saveSession(_currentUser!);
    return _currentUser;
  }

  @override
  Future<AuthUser> completeProfileSetup({
    required String name,
    required String language,
    DateTime? dateOfBirth,
    String? gender,
  }) async {
    if (networkDelay > Duration.zero) {
      await Future<void>.delayed(networkDelay);
    }

    final trimmedName = name.trim();
    if (trimmedName.isEmpty) {
      throw const FormatException('Please enter your full name.');
    }

    final current = _currentUser ?? sessionService.getStoredUser();
    if (current == null) {
      throw StateError('No active authentication session found.');
    }

    _currentUser = current.copyWith(
      displayName: trimmedName,
      preferredLanguage: language,
      dateOfBirth: dateOfBirth,
      gender: gender,
      profileCompleted: true,
    );

    await sessionService.saveSession(_currentUser!);
    return _currentUser!;
  }

  @override
  Future<AuthUser?> restoreSession() async {
    if (sessionService.isAuthenticated()) {
      _currentUser = sessionService.getStoredUser();
      return _currentUser;
    }
    return null;
  }

  @override
  Future<void> logout() async {
    _currentUser = null;
    await sessionService.clearSession();
  }
}
