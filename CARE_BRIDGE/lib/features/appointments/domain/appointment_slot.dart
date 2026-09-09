class AppointmentSlot {
  final String id;
  final String doctorId;
  final DateTime date;
  final String startTime;
  final String endTime;
  final bool isAvailable;

  const AppointmentSlot({
    required this.id,
    required this.doctorId,
    required this.date,
    required this.startTime,
    required this.endTime,
    this.isAvailable = true,
  });

  String get displayTime => '$startTime - $endTime';

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is AppointmentSlot &&
          runtimeType == other.runtimeType &&
          id == other.id;

  @override
  int get hashCode => id.hashCode;
}
