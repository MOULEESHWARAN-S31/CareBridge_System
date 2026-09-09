import 'healthcare_facility.dart';

/// Location position payload.
class UserLocation {
  final double latitude;
  final double longitude;
  final String? addressLabel;

  const UserLocation({
    required this.latitude,
    required this.longitude,
    this.addressLabel,
  });
}

/// Interface for location services and healthcare facility discovery.
abstract class LocationService {
  /// Request GPS location permission from the device.
  Future<bool> requestPermission();

  /// Check if location permission is granted.
  Future<bool> isPermissionGranted();

  /// Get current user GPS location (or default/mock location).
  Future<UserLocation?> getCurrentLocation();

  /// Get list of sample/nearby facilities.
  Future<List<HealthcareFacility>> getFacilities();

  /// Find nearest facilities sorted by distance from [userLoc].
  Future<List<HealthcareFacility>> getNearestFacilities(UserLocation userLoc);
}
