import 'package:flutter/foundation.dart';
import '../../../core/services/api_service.dart';
import '../domain/appointment_repository.dart';
import '../domain/appointment_slot.dart';
import '../domain/booked_appointment.dart';
import '../domain/district.dart';
import '../domain/doctor.dart';
import '../domain/hospital.dart';
import 'mock_appointment_repository.dart';

/// Live REST API implementation of [AppointmentRepository] with automatic offline fallback.
class ApiAppointmentRepository implements AppointmentRepository {
  static final ApiAppointmentRepository instance = ApiAppointmentRepository._();
  ApiAppointmentRepository._();
  factory ApiAppointmentRepository() => instance;

  final ApiService _apiService = ApiService.instance;
  final MockAppointmentRepository _fallback = MockAppointmentRepository.instance;

  @override
  Future<List<District>> fetchDistricts() {
    return _fallback.fetchDistricts();
  }

  @override
  District? findDistrictById(String districtId) {
    return _fallback.findDistrictById(districtId);
  }

  @override
  Hospital? findHospitalById(String hospitalId) {
    return _fallback.findHospitalById(hospitalId);
  }

  @override
  Future<List<Hospital>> fetchAllHospitals() async {
    try {
      final response = await _apiService.get('/facilities');
      if (response is List && response.isNotEmpty) {
        return response.map((item) {
          final m = item as Map<String, dynamic>;
          final dist = m['district']?.toString().toLowerCase() ?? 'salem';
          final distId = 'dist_$dist';
          return Hospital(
            id: m['id']?.toString() ?? 'hosp_${m['name']}',
            name: m['name']?.toString() ?? 'Hospital',
            districtId: distId,
            locationName: m['district']?.toString() ?? 'Salem',
            type: m['type']?.toString() ?? 'Government Hospital',
            contactNumber: m['contact_number']?.toString() ?? '+914272400100',
            address: '${m['name']}, ${m['district'] ?? 'Salem'}',
            latitude: m['latitude'] != null ? double.tryParse(m['latitude'].toString()) : 11.6643,
            longitude: m['longitude'] != null ? double.tryParse(m['longitude'].toString()) : 78.1460,
            hospitalType: 'Government',
          );
        }).toList();
      }
    } catch (e) {
      debugPrint('ApiAppointmentRepository: Backend facilities fetch failed, using fallback ($e)');
    }
    return _fallback.fetchAllHospitals();
  }

  @override
  Future<List<Hospital>> fetchHospitalsByDistrict(String districtId) async {
    final all = await fetchAllHospitals();
    return all.where((h) => h.districtId.toLowerCase() == districtId.toLowerCase()).toList();
  }

  @override
  Future<List<Doctor>> fetchAllDoctors() async {
    try {
      final response = await _apiService.get('/doctors');
      if (response is List && response.isNotEmpty) {
        return response.map((item) {
          final m = item as Map<String, dynamic>;
          return Doctor(
            id: m['id']?.toString() ?? 'doc_1',
            name: m['name']?.toString() ?? 'Doctor',
            hospitalId: m['facility_id']?.toString() ?? 'hosp_slm_gh',
            specialization: m['specialization']?.toString() ?? 'General Medicine',
            qualification: m['qualification']?.toString() ?? 'MBBS, MD',
            experienceYears: m['experience_years'] != null
                ? int.tryParse(m['experience_years'].toString()) ?? 8
                : 8,
            isAvailable: true,
          );
        }).toList();
      }
    } catch (e) {
      debugPrint('ApiAppointmentRepository: Backend doctors fetch failed, using fallback ($e)');
    }
    return _fallback.fetchAllDoctors();
  }

  @override
  Future<List<Doctor>> fetchDoctorsByHospital(String hospitalId) async {
    final all = await fetchAllDoctors();
    final matching = all.where((d) => d.hospitalId == hospitalId).toList();
    if (matching.isNotEmpty) return matching;
    return _fallback.fetchDoctorsByHospital(hospitalId);
  }

  @override
  Future<List<AppointmentSlot>> fetchAvailableSlots(String doctorId, DateTime date) {
    return _fallback.fetchAvailableSlots(doctorId, date);
  }

  @override
  Future<BookedAppointment> createAppointment({
    required String patientProfileId,
    required Hospital hospital,
    required Doctor doctor,
    required DateTime date,
    required AppointmentSlot slot,
  }) async {
    try {
      final formattedDate =
          '${date.year.toString().padLeft(4, '0')}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}';
      final response = await _apiService.post(
        '/appointments',
        body: {
          'patient_profile_id': patientProfileId,
          'hospital_id': hospital.id,
          'doctor_id': doctor.id,
          'appointment_date': formattedDate,
          'appointment_time': slot.displayTime,
          'status': 'Confirmed',
        },
      );

      if (response is Map<String, dynamic>) {
        return BookedAppointment(
          id: response['id']?.toString() ?? 'CB-APT-${DateTime.now().millisecondsSinceEpoch % 10000}',
          patientProfileId: patientProfileId,
          hospitalId: hospital.id,
          hospitalName: hospital.name,
          doctorId: doctor.id,
          doctorName: doctor.name,
          specialization: doctor.specialization,
          appointmentDate: date,
          appointmentTime: slot.displayTime,
          contactPhone: hospital.contactNumber,
          status: 'Confirmed',
          createdAt: DateTime.now(),
        );
      }
    } catch (e) {
      debugPrint('ApiAppointmentRepository: Backend createAppointment failed, using fallback ($e)');
    }

    return _fallback.createAppointment(
      patientProfileId: patientProfileId,
      hospital: hospital,
      doctor: doctor,
      date: date,
      slot: slot,
    );
  }

  @override
  Future<List<BookedAppointment>> fetchPatientAppointments(String patientProfileId) async {
    try {
      final response = await _apiService.get(
        '/appointments',
        queryParams: {'patientProfileId': patientProfileId},
      );
      if (response is List && response.isNotEmpty) {
        return response.map((item) {
          final m = item as Map<String, dynamic>;
          final dateStr = m['appointment_date']?.toString() ?? DateTime.now().toIso8601String();
          final parsedDate = DateTime.tryParse(dateStr) ?? DateTime.now();
          return BookedAppointment(
            id: m['id']?.toString() ?? 'CB-APT-1001',
            patientProfileId: m['patient_profile_id']?.toString() ?? patientProfileId,
            hospitalId: m['hospital_id']?.toString() ?? '',
            hospitalName: m['hospital_name']?.toString() ?? 'Government Hospital',
            doctorId: m['doctor_id']?.toString() ?? '',
            doctorName: m['doctor_name']?.toString() ?? 'Dr. On Duty',
            specialization: m['specialization']?.toString() ?? 'General Medicine',
            appointmentDate: parsedDate,
            appointmentTime: m['appointment_time']?.toString() ?? '09:00 AM',
            contactPhone: m['contact_phone']?.toString() ?? '',
            status: m['status']?.toString() ?? 'Confirmed',
            createdAt: DateTime.now(),
          );
        }).toList();
      }
    } catch (e) {
      debugPrint('ApiAppointmentRepository: Backend fetchPatientAppointments failed, using fallback ($e)');
    }
    return _fallback.fetchPatientAppointments(patientProfileId);
  }
}
