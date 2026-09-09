import 'package:flutter/material.dart';
import '../../core/services/session_service.dart';
import '../../features/abha/domain/abha_profile.dart';
import '../../features/abha/presentation/abha_lookup_screen.dart';
import '../../features/abha/presentation/abha_no_profile_screen.dart';
import '../../features/abha/presentation/abha_profile_select_screen.dart';
import '../../features/appointments/presentation/booking_flow_wrapper.dart';
import '../../features/authentication/presentation/login_screen.dart';
import '../../features/authentication/presentation/otp_verification_screen.dart';
import '../../features/authentication/presentation/patient_profile_setup_screen.dart';
import '../../features/health_records/record_detail_screen.dart';
import '../../features/location/domain/location_service.dart';
import '../../features/location/presentation/location_permission_screen.dart';
import '../../features/location/presentation/nearest_facility_screen.dart';
import '../../features/navigation/main_shell_screen.dart';
import '../../features/onboarding/presentation/onboarding_screen.dart';
import '../../features/splash/splash_screen.dart';
import '../../features/teleconsultation/domain/teleconsultation.dart';
import '../../features/teleconsultation/presentation/teleconsultation_call_screen.dart';
import '../../features/teleconsultation/presentation/teleconsultation_screen.dart';
import '../../shared/models/mock_models.dart';
import '../../shared/services/mock_data_service.dart';

/// Centralized CareBridge Route Definitions and Route Generator.
/// Enforces protected navigation guards for unauthenticated states.
class AppRoutes {
  AppRoutes._();

  // Root & Foundation Routes
  static const String splash = '/';
  static const String onboarding = '/onboarding';
  static const String login = '/login';
  static const String otp = '/otp';
  static const String abhaConnection = '/abha-connection';
  static const String abhaLookup = '/abha-lookup';
  static const String abhaProfileSelect = '/abha-profile-select';
  static const String abhaNoProfile = '/abha-no-profile';
  static const String locationPermission = '/location-permission';
  static const String nearestFacility = '/nearest-facility';
  static const String profileSetup = '/profile-setup'; // retained for future use
  static const String main = '/main';

  // Feature Direct Navigation Routes (deep link into MainShellScreen tabs)
  static const String home = '/home';
  static const String appointments = '/appointments';
  static const String care = '/care';
  static const String records = '/records';
  static const String profile = '/profile';
  static const String recordDetail = '/record-detail';
  static const String bookAppointment = '/book-appointment';
  static const String teleconsultation = '/teleconsultation';
  static const String teleconsultationCall = '/teleconsultation-call';

  static SessionService? _sessionService;

  /// Registers session service for centralized route protection
  static void configure(SessionService sessionService) {
    _sessionService = sessionService;
  }

  /// Route generation mapping with authentication protection guards
  static Route<dynamic> onGenerateRoute(RouteSettings settings) {
    switch (settings.name) {
      case splash:
        return MaterialPageRoute<void>(
          settings: settings,
          builder: (_) => const SplashScreen(),
        );

      case onboarding:
        return MaterialPageRoute<void>(
          settings: settings,
          builder: (_) => const OnboardingScreen(),
        );

      case login:
        return MaterialPageRoute<void>(
          settings: settings,
          builder: (_) => const LoginScreen(),
        );

      case otp:
        return MaterialPageRoute<void>(
          settings: settings,
          builder: (_) => const OtpVerificationScreen(),
        );

      case abhaConnection:
      case abhaLookup:
        final phone = settings.arguments is String ? settings.arguments as String : null;
        return MaterialPageRoute<void>(
          settings: settings,
          builder: (_) => AbhaLookupScreen(initialMobileNumber: phone),
        );

      case abhaProfileSelect:
        final profiles = settings.arguments is List<AbhaProfile>
            ? settings.arguments as List<AbhaProfile>
            : <AbhaProfile>[];
        return MaterialPageRoute<void>(
          settings: settings,
          builder: (_) => AbhaProfileSelectScreen(profiles: profiles),
        );

      case abhaNoProfile:
        final phone = settings.arguments is String
            ? settings.arguments as String
            : '9876543210';
        return MaterialPageRoute<void>(
          settings: settings,
          builder: (_) => AbhaNoProfileScreen(mobileNumber: phone),
        );

      case locationPermission:
        return MaterialPageRoute<void>(
          settings: settings,
          builder: (_) => const LocationPermissionScreen(),
        );

      case nearestFacility:
        UserLocation? userLoc;
        if (settings.arguments is Map<String, dynamic>) {
          final args = settings.arguments as Map<String, dynamic>;
          if (args['location'] is UserLocation) {
            userLoc = args['location'] as UserLocation;
          }
        }
        return MaterialPageRoute<void>(
          settings: settings,
          builder: (_) => NearestFacilityScreen(initialUserLocation: userLoc),
        );

      case profileSetup:
        // Profile setup is retained for optional future use but is no longer
        // shown automatically after OTP verification.
        return MaterialPageRoute<void>(
          settings: settings,
          builder: (_) => const PatientProfileSetupScreen(),
        );

      case main:
      case home:
      case appointments:
      case care:
      case records:
      case profile:
        // Protected Route Guard — requires authentication only
        if (_sessionService != null) {
          if (!_sessionService!.isAuthenticated()) {
            return MaterialPageRoute<void>(
              settings: const RouteSettings(name: login),
              builder: (_) => const LoginScreen(),
            );
          }
        }

        int tabIndex = 0;
        if (settings.name == appointments) {
          tabIndex = 1;
        } else if (settings.name == care) {
          tabIndex = 2;
        } else if (settings.name == records) {
          tabIndex = 3;
        } else if (settings.name == profile) {
          tabIndex = 4;
        } else if (settings.arguments is int) {
          tabIndex = settings.arguments as int;
        }

        return MaterialPageRoute<void>(
          settings: settings,
          builder: (_) => MainShellScreen(initialTabIndex: tabIndex),
        );

      case recordDetail:
        final record = settings.arguments is HealthRecordItem
            ? settings.arguments as HealthRecordItem
            : MockDataService.instance.getHealthRecords().first;
        return MaterialPageRoute<void>(
          settings: settings,
          builder: (_) => RecordDetailScreen(record: record),
        );

      case bookAppointment:
        BookingFlowArgs? args;
        if (settings.arguments is BookingFlowArgs) {
          args = settings.arguments as BookingFlowArgs;
        }
        return MaterialPageRoute<void>(
          settings: settings,
          builder: (_) => BookingFlowWrapper(
            initialDoctor: args?.initialDoctor,
            initialHospital: args?.initialHospital,
            initialDistrict: args?.initialDistrict,
          ),
        );

      case teleconsultation:
        return MaterialPageRoute<void>(
          settings: settings,
          builder: (_) => const TeleconsultationScreen(),
        );

      case teleconsultationCall:
        if (settings.arguments is Teleconsultation) {
          return MaterialPageRoute<void>(
            settings: settings,
            builder: (_) => TeleconsultationCallScreen(
              consultation: settings.arguments as Teleconsultation,
            ),
          );
        }
        return MaterialPageRoute<void>(
          settings: settings,
          builder: (_) => const TeleconsultationScreen(),
        );

      default:
        return MaterialPageRoute<void>(
          settings: settings,
          builder: (_) => const SplashScreen(),
        );
    }
  }
}

