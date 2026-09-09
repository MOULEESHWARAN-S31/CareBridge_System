import '../../appointments/domain/appointment_slot.dart';
import '../../appointments/domain/doctor.dart';
import 'teleconsultation.dart';

abstract class TeleconsultationRepository {
  Future<List<Doctor>> getTeleconsultationDoctors();
  Future<List<AppointmentSlot>> getAvailableSlots(String doctorId, DateTime date);
  Future<Teleconsultation> scheduleTeleconsultation(Teleconsultation consultation);
  Future<List<Teleconsultation>> getTeleconsultations();
  Future<Teleconsultation?> getTeleconsultationById(String id);
  Future<void> updateConsultationStatus(
    String id,
    ConsultationStatus status, {
    Duration? duration,
    String? notes,
  });
}
