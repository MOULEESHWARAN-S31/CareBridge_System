/// Domain model representing a patient's personal emergency contact.
class EmergencyContact {
  final String id;
  final String name;
  final String relationship;
  final String mobileNumber;

  const EmergencyContact({
    required this.id,
    required this.name,
    required this.relationship,
    required this.mobileNumber,
  });

  EmergencyContact copyWith({
    String? id,
    String? name,
    String? relationship,
    String? mobileNumber,
  }) {
    return EmergencyContact(
      id: id ?? this.id,
      name: name ?? this.name,
      relationship: relationship ?? this.relationship,
      mobileNumber: mobileNumber ?? this.mobileNumber,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'relationship': relationship,
      'mobileNumber': mobileNumber,
    };
  }

  factory EmergencyContact.fromJson(Map<String, dynamic> json) {
    return EmergencyContact(
      id: json['id'] as String? ?? '',
      name: json['name'] as String? ?? '',
      relationship: json['relationship'] as String? ?? '',
      mobileNumber: json['mobileNumber'] as String? ?? '',
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is EmergencyContact &&
          runtimeType == other.runtimeType &&
          id == other.id;

  @override
  int get hashCode => id.hashCode;
}
