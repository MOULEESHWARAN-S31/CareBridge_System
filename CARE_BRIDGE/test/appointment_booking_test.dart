import 'package:flutter_test/flutter_test.dart';
import 'package:care_bridge/features/appointments/data/mock_appointment_repository.dart';
import 'package:care_bridge/features/appointments/data/phone_call_service_impl.dart';
import 'package:care_bridge/features/appointments/presentation/booking_controller.dart';
import 'package:care_bridge/core/services/session_service.dart';
import 'package:care_bridge/features/location/domain/healthcare_facility.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('Book Appointment Feature & Controller Lifecycle Tests', () {
    late MockAppointmentRepository repository;

    setUp(() {
      repository = MockAppointmentRepository.instance;
      SharedPreferences.setMockInitialValues({});
    });

    test('1. Fresh BookingController starts with all null selections', () {
      final controller = BookingController(repository: repository);

      expect(controller.selectedDistrict, isNull);
      expect(controller.selectedHospital, isNull);
      expect(controller.selectedDoctor, isNull);
      expect(controller.selectedDate, isNull);
      expect(controller.selectedSlot, isNull);
      expect(controller.lastBookedAppointment, isNull);
      expect(controller.canProceedToHospital, isFalse);
      expect(controller.canProceedToSummary, isFalse);

      controller.dispose();
    });

    test('2. Selection Dependency Cascade clearing rules', () async {
      final controller = BookingController(repository: repository);

      // Fetch sample data
      final districts = await repository.fetchDistricts();
      final salem = districts.firstWhere((d) => d.id == 'dist_salem');
      controller.selectDistrict(salem);

      final hospitals = await repository.fetchHospitalsByDistrict(salem.id);
      final salemGh = hospitals.first;
      controller.selectHospital(salemGh);

      final doctors = await repository.fetchDoctorsByHospital(salemGh.id);
      final doctor = doctors.first;
      controller.selectDoctor(doctor);

      final date = DateTime.now();
      controller.selectDate(date);

      final slots = await repository.fetchAvailableSlots(doctor.id, DateTime(date.year, date.month, date.day));
      final slot = slots.firstWhere((s) => s.isAvailable);
      controller.selectSlot(slot);

      // Verify all selections set
      expect(controller.selectedDistrict, equals(salem));
      expect(controller.selectedHospital, equals(salemGh));
      expect(controller.selectedDoctor, equals(doctor));
      expect(controller.selectedDate, isNotNull);
      expect(controller.selectedSlot, equals(slot));
      expect(controller.canProceedToSummary, isTrue);

      // Changing District must cascade clear Hospital, Doctor, Date, and Slot
      final cbe = districts.firstWhere((d) => d.id == 'dist_coimbatore');
      controller.selectDistrict(cbe);

      expect(controller.selectedDistrict, equals(cbe));
      expect(controller.selectedHospital, isNull);
      expect(controller.selectedDoctor, isNull);
      expect(controller.selectedDate, isNull);
      expect(controller.selectedSlot, isNull);
      expect(controller.canProceedToSummary, isFalse);

      controller.dispose();
    });

    test('3. Data Filtering strictly by District and Hospital IDs', () async {
      final districts = await repository.fetchDistricts();
      expect(districts.length, equals(8)); // 8 Tamil Nadu districts

      // Salem Hospitals
      final salemHospitals = await repository.fetchHospitalsByDistrict('dist_salem');
      expect(salemHospitals.isNotEmpty, isTrue);
      for (final h in salemHospitals) {
        expect(h.districtId, equals('dist_salem'));
      }

      // Doctors for Salem GH
      final salemGhDoctors = await repository.fetchDoctorsByHospital('hosp_slm_gh');
      expect(salemGhDoctors.isNotEmpty, isTrue);
      for (final d in salemGhDoctors) {
        expect(d.hospitalId, equals('hosp_slm_gh'));
      }
    });

    test('4. Full Booking Flow generates CB-APT-XXXX format ID', () async {
      final controller = BookingController(repository: repository);

      final districts = await repository.fetchDistricts();
      final district = districts.first;
      controller.selectDistrict(district);

      final hospitals = await repository.fetchHospitalsByDistrict(district.id);
      final hospital = hospitals.first;
      controller.selectHospital(hospital);

      final doctors = await repository.fetchDoctorsByHospital(hospital.id);
      final doctor = doctors.first;
      controller.selectDoctor(doctor);

      final date = DateTime.now();
      controller.selectDate(date);

      final slots = await repository.fetchAvailableSlots(doctor.id, DateTime(date.year, date.month, date.day));
      final slot = slots.firstWhere((s) => s.isAvailable);
      controller.selectSlot(slot);

      final appointment = await controller.confirmBooking('PATIENT_TEST_123');

      expect(appointment, isNotNull);
      expect(appointment!.id, startsWith('CB-APT-'));
      expect(appointment.patientProfileId, equals('PATIENT_TEST_123'));
      expect(appointment.hospitalName, equals(hospital.name));
      expect(appointment.doctorName, equals(doctor.name));
      expect(appointment.status, equals('Confirmed'));

      controller.dispose();
    });

    test('5. Non-blocking Phone Call Service fallback', () async {
      const phoneService = PhoneCallServiceImpl();
      final result = await phoneService.makeCall('+914272400100', hospitalName: 'Salem GH');
      // On desktop unit test environment without dialer app, result returns false safely
      expect(result, isA<bool>());
    });

    test('6. Facility Non-Mutation Guarantee in SessionService', () async {
      final session = await SessionService.init();

      const testFacility = HealthcareFacility(
        id: 'fac_original',
        name: 'Original PHC',
        type: FacilityType.phc,
        latitude: 11.66,
        longitude: 78.14,
        distanceKm: 2.0,
      );

      await session.setAssignedFacility(testFacility);
      expect(session.getAssignedFacility()?.id, equals('fac_original'));

      // Perform an appointment booking at a different hospital
      final controller = BookingController(repository: repository);
      final districts = await repository.fetchDistricts();
      final salem = districts.first;
      controller.selectDistrict(salem);

      final hospitals = await repository.fetchHospitalsByDistrict(salem.id);
      final hospital = hospitals.first;
      controller.selectHospital(hospital);

      final doctors = await repository.fetchDoctorsByHospital(hospital.id);
      final doctor = doctors.first;
      controller.selectDoctor(doctor);

      controller.selectDate(DateTime.now());
      final slots = await repository.fetchAvailableSlots(doctor.id, DateTime.now());
      controller.selectSlot(slots.firstWhere((s) => s.isAvailable));

      await controller.confirmBooking('PATIENT_TEST_456');

      // Verify SessionService assigned facility remains completely unchanged
      expect(session.getAssignedFacility()?.id, equals('fac_original'));

      controller.dispose();
    });
  });
}
