class Hospital {
  final String id;
  final String name;
  final String districtId;
  final String locationName;
  final String type;
  final String contactNumber;
  final String address;
  final double? latitude;
  final double? longitude;
  final String hospitalType;

  bool get isGovernment => hospitalType.toLowerCase() == 'government';
  bool get isPrivate => hospitalType.toLowerCase() == 'private';

  const Hospital({
    required this.id,
    required this.name,
    required this.districtId,
    required this.locationName,
    required this.type,
    required this.contactNumber,
    required this.address,
    this.latitude,
    this.longitude,
    this.hospitalType = 'Government',
  });

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Hospital &&
          runtimeType == other.runtimeType &&
          id == other.id;

  @override
  int get hashCode => id.hashCode;
}
