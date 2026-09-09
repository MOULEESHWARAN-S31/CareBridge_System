import 'district.dart';
import 'hospital.dart';
import 'doctor.dart';
import 'appointment_slot.dart';
import 'booked_appointment.dart';

abstract class AppointmentRepository {
  Future<List<District>> fetchDistricts();
  Future<List<Hospital>> fetchAllHospitals();
  Future<List<Hospital>> fetchHospitalsByDistrict(String districtId);
  Future<List<Doctor>> fetchAllDoctors();
  Future<List<Doctor>> fetchDoctorsByHospital(String hospitalId);
  Future<List<AppointmentSlot>> fetchAvailableSlots(String doctorId, DateTime date);
  Future<BookedAppointment> createAppointment({
    required String patientProfileId,
    required Hospital hospital,
    required Doctor doctor,
    required DateTime date,
    required AppointmentSlot slot,
  });
  Future<List<BookedAppointment>> fetchPatientAppointments(String patientProfileId);
  Hospital? findHospitalById(String hospitalId);
  District? findDistrictById(String districtId);
}
