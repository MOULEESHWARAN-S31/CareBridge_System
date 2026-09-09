class Doctor {
  final String id;
  final String name;
  final String hospitalId;
  final String specialization;
  final String qualification;
  final int experienceYears;
  final bool isAvailable;

  const Doctor({
    required this.id,
    required this.name,
    required this.hospitalId,
    required this.specialization,
    required this.qualification,
    required this.experienceYears,
    this.isAvailable = true,
  });

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Doctor &&
          runtimeType == other.runtimeType &&
          id == other.id;

  @override
  int get hashCode => id.hashCode;
}
