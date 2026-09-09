class BookedAppointment {
  final String id; // Format: CB-APT-XXXX
  final String patientProfileId;
  final String hospitalId;
  final String hospitalName;
  final String doctorId;
  final String doctorName;
  final String specialization;
  final DateTime appointmentDate;
  final String appointmentTime;
  final String contactPhone;
  final String status;
  final DateTime createdAt;

  const BookedAppointment({
    required this.id,
    required this.patientProfileId,
    required this.hospitalId,
    required this.hospitalName,
    required this.doctorId,
    required this.doctorName,
    required this.specialization,
    required this.appointmentDate,
    required this.appointmentTime,
    required this.contactPhone,
    required this.status,
    required this.createdAt,
  });

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is BookedAppointment &&
          runtimeType == other.runtimeType &&
          id == other.id;

  @override
  int get hashCode => id.hashCode;
}
