import 'dart:math' as math;

/// Healthcare facility type in the CareBridge system.
enum FacilityType {
  hospital,
  phc,
  medical;

  String get displayName {
    switch (this) {
      case FacilityType.hospital:
        return 'Hospital';
      case FacilityType.phc:
        return 'PHC';
      case FacilityType.medical:
        return 'Medical Store';
    }
  }
}

/// CareBridge Healthcare Facility Domain Model.
class HealthcareFacility {
  final String id;
  final String name;
  final FacilityType type;
  final String district;
  final String city;
  final double latitude;
  final double longitude;
  final String locationName;
  final String? address;
  final String? contactPhone;
  final bool is24x7;
  final List<String> services;
  final String hospitalType;
  final double? distanceKm;

  String? get contactNumber => contactPhone;

  bool get isGovernment => hospitalType.toLowerCase() == 'government';
  bool get isPrivate => hospitalType.toLowerCase() == 'private';

  const HealthcareFacility({
    required this.id,
    required this.name,
    required this.type,
    required this.latitude,
    required this.longitude,
    this.district = 'Salem',
    this.city = 'Salem City',
    this.locationName = '',
    this.address,
    this.contactPhone,
    this.is24x7 = true,
    this.services = const [],
    this.hospitalType = 'Government',
    this.distanceKm,
  });

  /// Calculates Haversine distance in kilometres to another coordinate.
  double calculateDistance(double patLat, double patLng) {
    const double earthRadiusKm = 6371.0;
    final dLat = _toRad(patLat - latitude);
    final dLng = _toRad(patLng - longitude);
    final a = math.sin(dLat / 2) * math.sin(dLat / 2) +
        math.cos(_toRad(latitude)) *
            math.cos(_toRad(patLat)) *
            math.sin(dLng / 2) *
            math.sin(dLng / 2);
    final c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a));
    return earthRadiusKm * c;
  }

  static double _toRad(double deg) => deg * math.pi / 180.0;

  /// Human-readable distance label.
  String distanceLabel([double? patLat, double? patLng]) {
    final dist = (patLat != null && patLng != null)
        ? calculateDistance(patLat, patLng)
        : (distanceKm ?? 0.0);
    if (dist < 1.0) {
      return '${(dist * 1000).round()} m away';
    }
    return '${dist.toStringAsFixed(1)} km away';
  }

  HealthcareFacility copyWith({
    String? id,
    String? name,
    FacilityType? type,
    String? district,
    String? city,
    double? latitude,
    double? longitude,
    String? locationName,
    String? address,
    String? contactPhone,
    bool? is24x7,
    List<String>? services,
    String? hospitalType,
    double? distanceKm,
  }) {
    return HealthcareFacility(
      id: id ?? this.id,
      name: name ?? this.name,
      type: type ?? this.type,
      district: district ?? this.district,
      city: city ?? this.city,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
      locationName: locationName ?? this.locationName,
      address: address ?? this.address,
      contactPhone: contactPhone ?? this.contactPhone,
      is24x7: is24x7 ?? this.is24x7,
      services: services ?? this.services,
      hospitalType: hospitalType ?? this.hospitalType,
      distanceKm: distanceKm ?? this.distanceKm,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'type': type.name,
      'district': district,
      'city': city,
      'latitude': latitude,
      'longitude': longitude,
      'locationName': locationName,
      'address': address,
      'contactPhone': contactPhone,
      'is24x7': is24x7,
      'services': services,
      'hospitalType': hospitalType,
      'distanceKm': distanceKm,
    };
  }

  factory HealthcareFacility.fromJson(Map<String, dynamic> map) {
    final typeStr = map['type'] as String? ?? 'hospital';
    return HealthcareFacility(
      id: map['id'] as String? ?? '',
      name: map['name'] as String? ?? '',
      type: FacilityType.values.firstWhere(
        (e) => e.name == typeStr,
        orElse: () => FacilityType.hospital,
      ),
      district: map['district'] as String? ?? 'Salem',
      city: map['city'] as String? ?? 'Salem City',
      latitude: (map['latitude'] as num?)?.toDouble() ?? 0.0,
      longitude: (map['longitude'] as num?)?.toDouble() ?? 0.0,
      locationName: map['locationName'] as String? ?? '',
      address: map['address'] as String?,
      contactPhone: map['contactPhone'] as String?,
      is24x7: map['is24x7'] as bool? ?? true,
      services: (map['services'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      hospitalType: map['hospitalType'] as String? ?? 'Government',
      distanceKm: (map['distanceKm'] as num?)?.toDouble(),
    );
  }

  @override
  String toString() =>
      'HealthcareFacility(id: $id, name: $name, type: ${type.displayName})';
}
