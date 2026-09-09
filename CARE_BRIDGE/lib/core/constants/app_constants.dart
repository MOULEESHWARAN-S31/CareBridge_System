/// CareBridge Application Constants
/// Centralized constants for application identity, branding, and placeholders.
class AppConstants {
  AppConstants._();

  static const String appName = 'CareBridge';
  static const String appTagline = 'Bridging People to Better Healthcare';
  static const String appVersion = '1.0.0 (Step 1)';

  // Asset paths
  static const String logoAssetPath = 'assets/images/logo.png';

  // Accessibility defaults
  static const double minTouchTargetSize = 48.0;

  // Emergency contact helpline (standard national emergency / ambulance in India)
  static const String emergencyNumber = '108';
  static const String nationalEmergencyHelpline = emergencyNumber;
  static const String nationalHealthHelpline = '1075';

  // ABHA (Ayushman Bharat Health Account) Registration URL
  static const String abhaRegistrationUrl =
      'https://abha.abdm.gov.in/abha/v3/register';
}

