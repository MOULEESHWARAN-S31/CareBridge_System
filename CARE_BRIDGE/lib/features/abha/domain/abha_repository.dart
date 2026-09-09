import 'abha_profile.dart';

/// Abstract repository interface for ABHA operations.
abstract class AbhaRepository {
  /// Look up ABHA profiles linked to a given mobile number.
  /// Returns a list of profiles (can be empty if no profiles exist).
  Future<List<AbhaProfile>> fetchProfilesForMobile(String mobileNumber);

  /// Find ABHA profiles linked to a given mobile number.
  /// Standard repository contract for ABHA mobile lookup.
  Future<List<AbhaProfile>> findProfilesByMobile(String mobileNumber) =>
      fetchProfilesForMobile(mobileNumber);

  /// Select/link an ABHA profile for the active session.
  Future<void> selectProfile(AbhaProfile profile);
}
