import '../../appointments/data/mock_appointment_repository.dart';
import '../../appointments/domain/appointment_slot.dart';
import '../../appointments/domain/doctor.dart';
import '../domain/teleconsultation.dart';
import '../domain/teleconsultation_repository.dart';

class MockTeleconsultationRepository implements TeleconsultationRepository {
  static final MockTeleconsultationRepository _instance =
      MockTeleconsultationRepository._internal();
  factory MockTeleconsultationRepository() => _instance;

  MockTeleconsultationRepository._internal() {
    _initDefaultConsultations();
  }

  int _nextId = 1001;
  final List<Teleconsultation> _consultations = [];

  void _initDefaultConsultations() {
    if (_consultations.isEmpty) {
      final now = DateTime.now();
      _consultations.add(
        Teleconsultation(
          id: 'CB-TC-1001',
          doctorId: 'doc_slm_1',
          doctorName: 'Dr. K. Arulmurugan, MD',
          doctorSpecialization: 'General Medicine',
          doctorQualification: 'MBBS, MD (General Medicine)',
          patientName: 'Priya Sharma',
          patientAbhaId: 'priya.sharma@abdm',
          patientAbhaNumber: '91-4521-8832-1940',
          patientPhone: '9876543210',
          type: ConsultationType.video,
          date: now.add(const Duration(days: 1)),
          timeSlot: '10:00 AM - 10:30 AM',
          status: ConsultationStatus.scheduled,
          createdAt: now.subtract(const Duration(hours: 2)),
        ),
      );
      _nextId = 1002;
    }
  }

  void resetForTesting() {
    _consultations.clear();
    _nextId = 1001;
    _initDefaultConsultations();
  }

  @override
  Future<List<Doctor>> getTeleconsultationDoctors() async {
    final allDoctors = await MockAppointmentRepository().fetchAllDoctors();
    return allDoctors;
  }

  @override
  Future<List<AppointmentSlot>> getAvailableSlots(
      String doctorId, DateTime date) async {
    final dateOnly = DateTime(date.year, date.month, date.day);
    // Return structured morning and evening slots
    return [
      AppointmentSlot(
        id: 'slot_${doctorId}_${dateOnly.millisecondsSinceEpoch}_1',
        doctorId: doctorId,
        date: dateOnly,
        startTime: '09:00 AM',
        endTime: '09:30 AM',
        isAvailable: true,
      ),
      AppointmentSlot(
        id: 'slot_${doctorId}_${dateOnly.millisecondsSinceEpoch}_2',
        doctorId: doctorId,
        date: dateOnly,
        startTime: '10:00 AM',
        endTime: '10:30 AM',
        isAvailable: true,
      ),
      AppointmentSlot(
        id: 'slot_${doctorId}_${dateOnly.millisecondsSinceEpoch}_3',
        doctorId: doctorId,
        date: dateOnly,
        startTime: '11:30 AM',
        endTime: '12:00 PM',
        isAvailable: true,
      ),
      AppointmentSlot(
        id: 'slot_${doctorId}_${dateOnly.millisecondsSinceEpoch}_4',
        doctorId: doctorId,
        date: dateOnly,
        startTime: '02:00 PM',
        endTime: '02:30 PM',
        isAvailable: true,
      ),
      AppointmentSlot(
        id: 'slot_${doctorId}_${dateOnly.millisecondsSinceEpoch}_5',
        doctorId: doctorId,
        date: dateOnly,
        startTime: '03:30 PM',
        endTime: '04:00 PM',
        isAvailable: true,
      ),
      AppointmentSlot(
        id: 'slot_${doctorId}_${dateOnly.millisecondsSinceEpoch}_6',
        doctorId: doctorId,
        date: dateOnly,
        startTime: '05:00 PM',
        endTime: '05:30 PM',
        isAvailable: true,
      ),
    ];
  }

  @override
  Future<Teleconsultation> scheduleTeleconsultation(
      Teleconsultation consultation) async {
    final generatedId = 'CB-TC-${_nextId.toString().padLeft(4, '0')}';
    _nextId++;

    final newConsultation = consultation.copyWith(
      id: generatedId,
      createdAt: DateTime.now(),
      status: ConsultationStatus.scheduled,
    );

    _consultations.insert(0, newConsultation);
    return newConsultation;
  }

  @override
  Future<List<Teleconsultation>> getTeleconsultations() async {
    return List.unmodifiable(_consultations);
  }

  @override
  Future<Teleconsultation?> getTeleconsultationById(String id) async {
    try {
      return _consultations.firstWhere((c) => c.id == id);
    } catch (_) {
      return null;
    }
  }

  @override
  Future<void> updateConsultationStatus(
    String id,
    ConsultationStatus status, {
    Duration? duration,
    String? notes,
  }) async {
    final index = _consultations.indexWhere((c) => c.id == id);
    if (index != -1) {
      final existing = _consultations[index];
      _consultations[index] = existing.copyWith(
        status: status,
        duration: duration ?? existing.duration,
        notes: notes ?? existing.notes,
      );
    }
  }
}
