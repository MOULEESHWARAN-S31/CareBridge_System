import 'package:flutter/foundation.dart';
import '../data/api_appointment_repository.dart';
import '../domain/appointment_repository.dart';
import '../domain/appointment_slot.dart';
import '../domain/booked_appointment.dart';
import '../domain/district.dart';
import '../domain/doctor.dart';
import '../domain/hospital.dart';

class BookingController extends ChangeNotifier {
  final AppointmentRepository repository;

  BookingController({AppointmentRepository? repository})
      : repository = repository ?? ApiAppointmentRepository.instance {
    loadDistricts();
  }

  bool _isDisposed = false;

  @override
  void dispose() {
    _isDisposed = true;
    super.dispose();
  }

  @override
  void notifyListeners() {
    if (!_isDisposed) {
      super.notifyListeners();
    }
  }

  District? _selectedDistrict;
  Hospital? _selectedHospital;
  Doctor? _selectedDoctor;
  DateTime? _selectedDate;
  AppointmentSlot? _selectedSlot;

  List<District> _districts = [];
  List<Hospital> _hospitals = [];
  List<Doctor> _doctors = [];
  List<AppointmentSlot> _slots = [];

  bool _isLoadingDistricts = false;
  bool _isLoadingHospitals = false;
  bool _isLoadingDoctors = false;
  bool _isLoadingSlots = false;
  bool _isBookingInProcess = false;

  String? _errorMessage;
  BookedAppointment? _lastBookedAppointment;

  // Getters
  District? get selectedDistrict => _selectedDistrict;
  Hospital? get selectedHospital => _selectedHospital;
  Doctor? get selectedDoctor => _selectedDoctor;
  DateTime? get selectedDate => _selectedDate;
  AppointmentSlot? get selectedSlot => _selectedSlot;

  List<District> get districts => List.unmodifiable(_districts);
  List<Hospital> get hospitals => List.unmodifiable(_hospitals);
  List<Doctor> get doctors => List.unmodifiable(_doctors);
  List<AppointmentSlot> get slots => List.unmodifiable(_slots);

  bool get isLoadingDistricts => _isLoadingDistricts;
  bool get isLoadingHospitals => _isLoadingHospitals;
  bool get isLoadingDoctors => _isLoadingDoctors;
  bool get isLoadingSlots => _isLoadingSlots;
  bool get isBookingInProcess => _isBookingInProcess;

  String? get errorMessage => _errorMessage;
  BookedAppointment? get lastBookedAppointment => _lastBookedAppointment;

  bool get canProceedToHospital => _selectedDistrict != null;
  bool get canProceedToDoctor => _selectedHospital != null;
  bool get canProceedToDateTime => _selectedDoctor != null;
  bool get canProceedToSummary =>
      _selectedDistrict != null &&
      _selectedHospital != null &&
      _selectedDoctor != null &&
      _selectedDate != null &&
      _selectedSlot != null;

  Future<void> loadDistricts() async {
    _isLoadingDistricts = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _districts = await repository.fetchDistricts();
    } catch (e) {
      _errorMessage = 'Failed to load districts. Please try again.';
    } finally {
      _isLoadingDistricts = false;
      notifyListeners();
    }
  }

  /// Preselects doctor and hospital (e.g. from Find Doctor screen)
  /// Seeds available choices and transitions to date/time selection step
  void preselectDoctor({
    required Doctor doctor,
    required Hospital hospital,
    District? district,
  }) {
    District? resolvedDistrict = district;
    if (resolvedDistrict == null) {
      try {
        resolvedDistrict = repository.findDistrictById(hospital.districtId);
      } catch (_) {}
    }

    _selectedDistrict = resolvedDistrict;
    _selectedHospital = hospital;
    _selectedDoctor = doctor;
    _selectedDate = null;
    _selectedSlot = null;
    _slots = [];

    // Seed lists so backwards navigation retains selections
    if (!_hospitals.contains(hospital)) {
      _hospitals = [hospital, ..._hospitals];
    }
    if (!_doctors.contains(doctor)) {
      _doctors = [doctor, ..._doctors];
    }

    notifyListeners();

    // Asynchronously load sibling doctors and hospitals for full context
    _loadDoctors(hospital.id);
    _loadHospitals(hospital.districtId);
  }

  void selectDistrict(District district) {
    if (_selectedDistrict == district) return;
    _selectedDistrict = district;
    // Cascade clear downstream choices
    _selectedHospital = null;
    _selectedDoctor = null;
    _selectedDate = null;
    _selectedSlot = null;
    _hospitals = [];
    _doctors = [];
    _slots = [];
    notifyListeners();

    _loadHospitals(district.id);
  }

  Future<void> _loadHospitals(String districtId) async {
    _isLoadingHospitals = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _hospitals = await repository.fetchHospitalsByDistrict(districtId);
    } catch (e) {
      _errorMessage = 'Failed to load hospitals for the selected district.';
    } finally {
      _isLoadingHospitals = false;
      notifyListeners();
    }
  }

  void selectHospital(Hospital hospital) {
    if (_selectedHospital == hospital) return;
    _selectedHospital = hospital;
    // Cascade clear downstream choices
    _selectedDoctor = null;
    _selectedDate = null;
    _selectedSlot = null;
    _doctors = [];
    _slots = [];
    notifyListeners();

    _loadDoctors(hospital.id);
  }

  Future<void> _loadDoctors(String hospitalId) async {
    _isLoadingDoctors = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _doctors = await repository.fetchDoctorsByHospital(hospitalId);
    } catch (e) {
      _errorMessage = 'Failed to load doctors for the selected hospital.';
    } finally {
      _isLoadingDoctors = false;
      notifyListeners();
    }
  }

  void selectDoctor(Doctor doctor) {
    if (_selectedDoctor == doctor) return;
    _selectedDoctor = doctor;
    // Cascade clear downstream choices
    _selectedDate = null;
    _selectedSlot = null;
    _slots = [];
    notifyListeners();
  }

  void selectDate(DateTime date) {
    final dateOnly = DateTime(date.year, date.month, date.day);
    if (_selectedDate == dateOnly) return;
    _selectedDate = dateOnly;
    _selectedSlot = null;
    _slots = [];
    notifyListeners();

    if (_selectedDoctor != null) {
      _loadSlots(_selectedDoctor!.id, dateOnly);
    }
  }

  Future<void> _loadSlots(String doctorId, DateTime date) async {
    _isLoadingSlots = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _slots = await repository.fetchAvailableSlots(doctorId, date);
    } catch (e) {
      _errorMessage = 'Failed to load time slots.';
    } finally {
      _isLoadingSlots = false;
      notifyListeners();
    }
  }

  void selectSlot(AppointmentSlot slot) {
    _selectedSlot = slot;
    notifyListeners();
  }

  Future<BookedAppointment?> confirmBooking(String patientProfileId) async {
    if (!canProceedToSummary) {
      _errorMessage = 'Please complete all selections before confirming.';
      notifyListeners();
      return null;
    }

    _isBookingInProcess = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final appointment = await repository.createAppointment(
        patientProfileId: patientProfileId,
        hospital: _selectedHospital!,
        doctor: _selectedDoctor!,
        date: _selectedDate!,
        slot: _selectedSlot!,
      );
      _lastBookedAppointment = appointment;
      _isBookingInProcess = false;
      notifyListeners();
      return appointment;
    } catch (e) {
      _isBookingInProcess = false;
      _errorMessage = 'Failed to confirm appointment. Please try again.';
      notifyListeners();
      return null;
    }
  }
}
