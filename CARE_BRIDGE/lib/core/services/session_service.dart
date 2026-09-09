import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../../features/abha/domain/abha_profile.dart';
import '../../features/authentication/domain/auth_user.dart';
import '../../features/location/domain/healthcare_facility.dart';
import '../../features/profile/domain/emergency_contact.dart';

/// Lightweight Session Service for CareBridge.
/// Manages persistent session restoration, introductory onboarding state,
/// active ABHA profile, and location/facility setup flags.
class SessionService {
  static const String _keyOnboardingSeen = 'carebridge_onboarding_seen';
  static const String _keyIsAuthenticated = 'carebridge_is_authenticated';
  static const String _keyProfileCompleted = 'carebridge_profile_completed';
  static const String _keyUserData = 'carebridge_user_data';

  // Workflow keys for ABHA profile and location selection
  static const String _keyActiveAbhaProfile = 'carebridge_active_abha_profile';
  static const String _keyAssignedFacility = 'carebridge_assigned_facility';
  static const String _keyLastVisitedFacility = 'carebridge_last_visited_facility';
  static const String _keyLocationSetupComplete = 'carebridge_location_setup_complete';
  static const String _keyEmergencyContacts = 'carebridge_emergency_contacts';
  static const String _keyPreferredLanguage = 'carebridge_preferred_language';

  final SharedPreferences? _preferences;

  // In-memory fallback for testing or before preferences initialize
  bool _inMemoryOnboardingSeen = false;
  bool _inMemoryIsAuthenticated = false;
  bool _inMemoryProfileCompleted = false;
  bool _inMemoryLocationSetupComplete = false;
  AuthUser? _inMemoryUser;
  AbhaProfile? _inMemoryAbhaProfile;
  HealthcareFacility? _inMemoryAssignedFacility;
  HealthcareFacility? _inMemoryLastVisitedFacility;
  List<EmergencyContact> _inMemoryEmergencyContacts = [];
  String? _inMemoryPreferredLanguage;

  SessionService([this._preferences]);

  static Future<SessionService> init() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      return SessionService(prefs);
    } catch (_) {
      // Graceful fallback for test or headless environments
      return SessionService();
    }
  }

  /// Whether introductory onboarding was seen / completed / skipped
  bool isOnboardingSeen() {
    if (_preferences != null) {
      return _preferences.getBool(_keyOnboardingSeen) ?? false;
    }
    return _inMemoryOnboardingSeen;
  }

  Future<void> setOnboardingSeen(bool value) async {
    _inMemoryOnboardingSeen = value;
    if (_preferences != null) {
      await _preferences.setBool(_keyOnboardingSeen, value);
    }
  }

  /// Whether an authenticated session exists
  bool isAuthenticated() {
    if (_preferences != null) {
      return _preferences.getBool(_keyIsAuthenticated) ?? false;
    }
    return _inMemoryIsAuthenticated;
  }

  /// Whether the patient profile setup has been completed
  bool isProfileCompleted() {
    if (_preferences != null) {
      return _preferences.getBool(_keyProfileCompleted) ?? false;
    }
    return _inMemoryProfileCompleted;
  }

  /// Whether first-login location setup is complete
  bool isLocationSetupComplete() {
    if (_preferences != null) {
      return _preferences.getBool(_keyLocationSetupComplete) ?? false;
    }
    return _inMemoryLocationSetupComplete;
  }

  Future<void> setLocationSetupComplete(bool value) async {
    _inMemoryLocationSetupComplete = value;
    if (_preferences != null) {
      await _preferences.setBool(_keyLocationSetupComplete, value);
    }
  }

  /// Gets stored authenticated user profile
  AuthUser? getStoredUser() {
    if (_preferences != null) {
      final jsonStr = _preferences.getString(_keyUserData);
      if (jsonStr != null && jsonStr.isNotEmpty) {
        try {
          final Map<String, dynamic> map = jsonDecode(jsonStr) as Map<String, dynamic>;
          return AuthUser.fromJson(map);
        } catch (_) {
          return null;
        }
      }
      return null;
    }
    return _inMemoryUser;
  }

  /// Active ABHA Profile
  AbhaProfile? getActiveAbhaProfile() {
    if (_preferences != null) {
      final jsonStr = _preferences.getString(_keyActiveAbhaProfile);
      if (jsonStr != null && jsonStr.isNotEmpty) {
        try {
          return AbhaProfile.fromJson(jsonDecode(jsonStr) as Map<String, dynamic>);
        } catch (_) {
          return null;
        }
      }
      return null;
    }
    return _inMemoryAbhaProfile;
  }

  /// Active ABHA Profile ID
  String? getActiveAbhaProfileId() => getActiveAbhaProfile()?.id;

  Future<void> setActiveAbhaProfile(AbhaProfile profile) async {
    _inMemoryAbhaProfile = profile;
    if (_preferences != null) {
      await _preferences.setString(_keyActiveAbhaProfile, jsonEncode(profile.toJson()));
    }
  }

  /// Assigned Facility (Default / Registered / Closest PHC)
  HealthcareFacility? getAssignedFacility() {
    if (_preferences != null) {
      final jsonStr = _preferences.getString(_keyAssignedFacility);
      if (jsonStr != null && jsonStr.isNotEmpty) {
        try {
          return HealthcareFacility.fromJson(jsonDecode(jsonStr) as Map<String, dynamic>);
        } catch (_) {
          return null;
        }
      }
      return null;
    }
    return _inMemoryAssignedFacility;
  }

  Future<void> setAssignedFacility(HealthcareFacility facility) async {
    _inMemoryAssignedFacility = facility;
    if (_preferences != null) {
      await _preferences.setString(_keyAssignedFacility, jsonEncode(facility.toJson()));
    }
  }

  /// Last Visited Facility
  HealthcareFacility? getLastVisitedFacility() {
    if (_preferences != null) {
      final jsonStr = _preferences.getString(_keyLastVisitedFacility);
      if (jsonStr != null && jsonStr.isNotEmpty) {
        try {
          return HealthcareFacility.fromJson(jsonDecode(jsonStr) as Map<String, dynamic>);
        } catch (_) {
          return null;
        }
      }
      return null;
    }
    return _inMemoryLastVisitedFacility;
  }

  Future<void> setLastVisitedFacility(HealthcareFacility facility) async {
    _inMemoryLastVisitedFacility = facility;
    if (_preferences != null) {
      await _preferences.setString(_keyLastVisitedFacility, jsonEncode(facility.toJson()));
    }
  }

  /// Persists authenticated user and sets session flags
  Future<void> saveSession(AuthUser user) async {
    _inMemoryIsAuthenticated = true;
    _inMemoryProfileCompleted = user.profileCompleted;
    _inMemoryUser = user;

    if (_preferences != null) {
      await _preferences.setBool(_keyIsAuthenticated, true);
      await _preferences.setBool(_keyProfileCompleted, user.profileCompleted);
      await _preferences.setString(_keyUserData, jsonEncode(user.toJson()));
    }
  }

  /// Clears authenticated session (logout) while preserving onboardingSeen
  Future<void> clearSession() async {
    _inMemoryIsAuthenticated = false;
    _inMemoryProfileCompleted = false;
    _inMemoryLocationSetupComplete = false;
    _inMemoryUser = null;
    _inMemoryAbhaProfile = null;
    _inMemoryAssignedFacility = null;
    _inMemoryLastVisitedFacility = null;

    if (_preferences != null) {
      await _preferences.remove(_keyIsAuthenticated);
      await _preferences.remove(_keyProfileCompleted);
      await _preferences.remove(_keyUserData);
      await _preferences.remove(_keyActiveAbhaProfile);
      await _preferences.remove(_keyAssignedFacility);
      await _preferences.remove(_keyLastVisitedFacility);
      await _preferences.remove(_keyLocationSetupComplete);
    }
  }

  /// Retrieves list of emergency contacts. Initial state is empty.
  List<EmergencyContact> getEmergencyContacts() {
    if (_preferences != null) {
      final jsonStr = _preferences.getString(_keyEmergencyContacts);
      if (jsonStr != null && jsonStr.isNotEmpty) {
        try {
          final list = jsonDecode(jsonStr) as List<dynamic>;
          return list
              .map((item) => EmergencyContact.fromJson(item as Map<String, dynamic>))
              .toList();
        } catch (_) {
          return [];
        }
      }
      return [];
    }
    return List.unmodifiable(_inMemoryEmergencyContacts);
  }

  /// Persists emergency contacts list.
  Future<void> saveEmergencyContacts(List<EmergencyContact> contacts) async {
    _inMemoryEmergencyContacts = List.from(contacts);
    if (_preferences != null) {
      final jsonStr = jsonEncode(contacts.map((c) => c.toJson()).toList());
      await _preferences.setString(_keyEmergencyContacts, jsonStr);
    }
  }

  /// Preferred application language (e.g. 'ta', 'en')
  String? getPreferredLanguage() {
    if (_preferences != null) {
      return _preferences.getString(_keyPreferredLanguage);
    }
    return _inMemoryPreferredLanguage;
  }

  /// Sets and persists preferred application language
  Future<void> setPreferredLanguage(String languageCode) async {
    _inMemoryPreferredLanguage = languageCode;
    if (_preferences != null) {
      await _preferences.setString(_keyPreferredLanguage, languageCode);
    }
  }

  /// Resets all local data (useful in testing)
  Future<void> resetAll() async {
    _inMemoryOnboardingSeen = false;
    _inMemoryIsAuthenticated = false;
    _inMemoryProfileCompleted = false;
    _inMemoryLocationSetupComplete = false;
    _inMemoryUser = null;
    _inMemoryAbhaProfile = null;
    _inMemoryAssignedFacility = null;
    _inMemoryLastVisitedFacility = null;
    _inMemoryEmergencyContacts = [];
    _inMemoryPreferredLanguage = null;

    if (_preferences != null) {
      await _preferences.clear();
    }
  }
}

