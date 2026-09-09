// ignore_for_file: non_constant_identifier_names

/// CareBridge ABHA Profile Domain Model.
///
/// Represents a single Ayushman Bharat Health Account profile linked to a
/// mobile number. A single mobile number may have multiple ABHA profiles
/// (e.g., self + family members).
class AbhaProfile {
  final String id;
  final String name;
  final String abhaNumber;
  final String abhaAddress;
  final String relationship;
  final String mobileNumber;
  final String gender;
  final String dateOfBirth;
  final String? address;
  final String? district;
  final String? city;
  final String? state;
  final String? pincode;
  final String? email;
  final String? createdAt;

  const AbhaProfile({
    required this.id,
    required this.name,
    required this.abhaNumber,
    required this.abhaAddress,
    required this.relationship,
    required this.mobileNumber,
    this.gender = 'Male',
    this.dateOfBirth = '1985-01-01',
    this.address,
    this.district,
    this.city,
    this.state,
    this.pincode,
    this.email,
    this.createdAt,
  });

  // Aliases for user convenience and backward compatibility
  String get fullName => name;
  String get full_name => name;
  String get maskedAbhaId => abhaNumber;
  String get abhaId => id.isNotEmpty ? id : abhaNumber;
  String get abha_id => abhaId;
  String get relation => relationship;
  String get mobile_number => mobileNumber;
  String get date_of_birth => dateOfBirth;
  String get created_at => createdAt ?? '';

  /// Calculated age from dateOfBirth (YYYY-MM-DD) if parseable
  int? get age {
    try {
      final dob = DateTime.parse(dateOfBirth);
      final now = DateTime.now();
      int years = now.year - dob.year;
      if (now.month < dob.month || (now.month == dob.month && now.day < dob.day)) {
        years--;
      }
      return years >= 0 ? years : null;
    } catch (_) {
      return null;
    }
  }

  AbhaProfile copyWith({
    String? id,
    String? name,
    String? abhaNumber,
    String? abhaAddress,
    String? relationship,
    String? mobileNumber,
    String? gender,
    String? dateOfBirth,
    String? address,
    String? district,
    String? city,
    String? state,
    String? pincode,
    String? email,
    String? createdAt,
  }) {
    return AbhaProfile(
      id: id ?? this.id,
      name: name ?? this.name,
      abhaNumber: abhaNumber ?? this.abhaNumber,
      abhaAddress: abhaAddress ?? this.abhaAddress,
      relationship: relationship ?? this.relationship,
      mobileNumber: mobileNumber ?? this.mobileNumber,
      gender: gender ?? this.gender,
      dateOfBirth: dateOfBirth ?? this.dateOfBirth,
      address: address ?? this.address,
      district: district ?? this.district,
      city: city ?? this.city,
      state: state ?? this.state,
      pincode: pincode ?? this.pincode,
      email: email ?? this.email,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'abha_id': abha_id,
      'name': name,
      'full_name': name,
      'abhaNumber': abhaNumber,
      'abhaAddress': abhaAddress,
      'relationship': relationship,
      'mobileNumber': mobileNumber,
      'mobile_number': mobileNumber,
      'gender': gender,
      'dateOfBirth': dateOfBirth,
      'date_of_birth': dateOfBirth,
      'address': address,
      'district': district,
      'city': city,
      'state': state,
      'pincode': pincode,
      'email': email,
      'created_at': createdAt,
    };
  }

  factory AbhaProfile.fromJson(Map<String, dynamic> map) {
    return AbhaProfile(
      id: map['id'] as String? ?? (map['abha_id'] as String? ?? ''),
      name: map['name'] as String? ?? (map['full_name'] as String? ?? (map['fullName'] as String? ?? '')),
      abhaNumber: map['abhaNumber'] as String? ?? (map['maskedAbhaId'] as String? ?? (map['abha_id'] as String? ?? '')),
      abhaAddress: map['abhaAddress'] as String? ?? '',
      relationship: map['relationship'] as String? ?? (map['relation'] as String? ?? 'Self'),
      mobileNumber: map['mobileNumber'] as String? ?? (map['mobile_number'] as String? ?? ''),
      gender: map['gender'] as String? ?? 'Male',
      dateOfBirth: map['dateOfBirth'] as String? ?? (map['date_of_birth'] as String? ?? '1985-01-01'),
      address: map['address'] as String?,
      district: map['district'] as String?,
      city: map['city'] as String?,
      state: map['state'] as String?,
      pincode: map['pincode'] as String?,
      email: map['email'] as String?,
      createdAt: map['created_at'] as String? ?? (map['createdAt'] as String?),
    );
  }

  @override
  String toString() =>
      'AbhaProfile(id: $id, name: $name, relationship: $relationship)';
}
