/// CareBridge Authenticated Patient Domain Model.
class AuthUser {
  final String id;
  final String phoneNumber;
  final String displayName;
  final String preferredLanguage;
  final DateTime? dateOfBirth;
  final String? gender;
  final String? abhaNumber;
  final String? abhaAddress;
  final bool profileCompleted;

  const AuthUser({
    required this.id,
    required this.phoneNumber,
    required this.displayName,
    this.preferredLanguage = 'en',
    this.dateOfBirth,
    this.gender,
    this.abhaNumber,
    this.abhaAddress,
    this.profileCompleted = false,
  });

  AuthUser copyWith({
    String? id,
    String? phoneNumber,
    String? displayName,
    String? fullName,
    String? preferredLanguage,
    dynamic dateOfBirth,
    String? gender,
    String? abhaNumber,
    String? abhaAddress,
    bool? profileCompleted,
  }) {
    DateTime? parsedDob;
    if (dateOfBirth is DateTime) {
      parsedDob = dateOfBirth;
    } else if (dateOfBirth is String) {
      parsedDob = DateTime.tryParse(dateOfBirth);
    } else {
      parsedDob = this.dateOfBirth;
    }

    return AuthUser(
      id: id ?? this.id,
      phoneNumber: phoneNumber ?? this.phoneNumber,
      displayName: displayName ?? (fullName ?? this.displayName),
      preferredLanguage: preferredLanguage ?? this.preferredLanguage,
      dateOfBirth: parsedDob,
      gender: gender ?? this.gender,
      abhaNumber: abhaNumber ?? this.abhaNumber,
      abhaAddress: abhaAddress ?? this.abhaAddress,
      profileCompleted: profileCompleted ?? this.profileCompleted,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'phoneNumber': phoneNumber,
      'displayName': displayName,
      'preferredLanguage': preferredLanguage,
      'dateOfBirth': dateOfBirth?.toIso8601String(),
      'gender': gender,
      'abhaNumber': abhaNumber,
      'abhaAddress': abhaAddress,
      'profileCompleted': profileCompleted,
    };
  }

  factory AuthUser.fromJson(Map<String, dynamic> map) {
    return AuthUser(
      id: map['id'] as String? ?? 'usr_${DateTime.now().millisecondsSinceEpoch}',
      phoneNumber: map['phoneNumber'] as String? ?? '',
      displayName: map['displayName'] as String? ?? '',
      preferredLanguage: map['preferredLanguage'] as String? ?? 'en',
      dateOfBirth: map['dateOfBirth'] != null
          ? DateTime.tryParse(map['dateOfBirth'] as String)
          : null,
      gender: map['gender'] as String?,
      abhaNumber: map['abhaNumber'] as String?,
      abhaAddress: map['abhaAddress'] as String?,
      profileCompleted: map['profileCompleted'] as bool? ?? false,
    );
  }
}
