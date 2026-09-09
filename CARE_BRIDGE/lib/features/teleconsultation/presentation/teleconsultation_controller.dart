import 'package:flutter/foundation.dart';
import '../../appointments/domain/appointment_slot.dart';
import '../../appointments/domain/doctor.dart';
import '../data/mock_teleconsultation_repository.dart';
import '../domain/teleconsultation.dart';
import '../domain/teleconsultation_repository.dart';

class TeleconsultationController extends ChangeNotifier {
  final TeleconsultationRepository _repository;

  TeleconsultationController({TeleconsultationRepository? repository})
      : _repository = repository ?? MockTeleconsultationRepository();

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  String? _errorMessage;
  String? get errorMessage => _errorMessage;

  List<Doctor> _doctors = [];
  List<Doctor> get doctors => _doctors;

  List<Doctor> _filteredDoctors = [];
  List<Doctor> get filteredDoctors => _filteredDoctors;

  List<String> _specializations = [];
  List<String> get specializations => _specializations;

  String _searchQuery = '';
  String get searchQuery => _searchQuery;

  String? _selectedSpecialization;
  String? get selectedSpecialization => _selectedSpecialization;

  bool _onlyAvailable = false;
  bool get onlyAvailable => _onlyAvailable;

  // Booking Flow State
  Doctor? _selectedDoctor;
  Doctor? get selectedDoctor => _selectedDoctor;

  ConsultationType _selectedType = ConsultationType.video;
  ConsultationType get selectedType => _selectedType;

  DateTime _selectedDate = DateTime.now().add(const Duration(days: 1));
  DateTime get selectedDate => _selectedDate;

  List<AppointmentSlot> _availableSlots = [];
  List<AppointmentSlot> get availableSlots => _availableSlots;

  AppointmentSlot? _selectedSlot;
  AppointmentSlot? get selectedSlot => _selectedSlot;

  bool _isLoadingSlots = false;
  bool get isLoadingSlots => _isLoadingSlots;

  bool _isBooking = false;
  bool get isBooking => _isBooking;

  Teleconsultation? _lastScheduledConsultation;
  Teleconsultation? get lastScheduledConsultation => _lastScheduledConsultation;

  List<Teleconsultation> _consultations = [];
  List<Teleconsultation> get consultations => _consultations;

  Future<void> loadDoctors() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _doctors = await _repository.getTeleconsultationDoctors();
      final specs = _doctors.map((d) => d.specialization).toSet().toList()..sort();
      _specializations = specs;
      _applyFilters();
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void setSearchQuery(String query) {
    _searchQuery = query;
    _applyFilters();
    notifyListeners();
  }

  void setSpecialization(String? spec) {
    _selectedSpecialization = spec;
    _applyFilters();
    notifyListeners();
  }

  void setAvailabilityFilter(bool onlyAvailable) {
    _onlyAvailable = onlyAvailable;
    _applyFilters();
    notifyListeners();
  }

  void _applyFilters() {
    _filteredDoctors = _doctors.where((doctor) {
      if (_onlyAvailable && !doctor.isAvailable) {
        return false;
      }
      if (_selectedSpecialization != null &&
          _selectedSpecialization!.isNotEmpty &&
          doctor.specialization != _selectedSpecialization) {
        return false;
      }
      if (_searchQuery.trim().isNotEmpty) {
        final q = _searchQuery.toLowerCase();
        final matchesName = doctor.name.toLowerCase().contains(q);
        final matchesSpec = doctor.specialization.toLowerCase().contains(q);
        final matchesQual = doctor.qualification.toLowerCase().contains(q);
        if (!matchesName && !matchesSpec && !matchesQual) {
          return false;
        }
      }
      return true;
    }).toList();
  }

  void selectDoctor(Doctor doctor) {
    _selectedDoctor = doctor;
    _selectedType = ConsultationType.video;
    final now = DateTime.now();
    _selectedDate = DateTime(now.year, now.month, now.day + 1);
    _selectedSlot = null;
    loadSlotsForSelectedDoctorAndDate();
    notifyListeners();
  }

  void setConsultationType(ConsultationType type) {
    _selectedType = type;
    notifyListeners();
  }

  Future<void> setDate(DateTime date) async {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final targetDate = DateTime(date.year, date.month, date.day);
    if (targetDate.isBefore(today)) {
      // Cannot select past date
      return;
    }
    _selectedDate = targetDate;
    _selectedSlot = null; // Clear slot selection when date changes
    await loadSlotsForSelectedDoctorAndDate();
    notifyListeners();
  }

  void selectSlot(AppointmentSlot slot) {
    _selectedSlot = slot;
    notifyListeners();
  }

  Future<void> loadSlotsForSelectedDoctorAndDate() async {
    if (_selectedDoctor == null) return;
    _isLoadingSlots = true;
    notifyListeners();

    try {
      _availableSlots = await _repository.getAvailableSlots(
        _selectedDoctor!.id,
        _selectedDate,
      );
    } catch (_) {
      _availableSlots = [];
    } finally {
      _isLoadingSlots = false;
      notifyListeners();
    }
  }

  Future<Teleconsultation?> confirmBooking({
    required String patientName,
    required String patientAbhaId,
    String? patientAbhaNumber,
    String? patientPhone,
  }) async {
    if (_selectedDoctor == null || _selectedSlot == null) {
      return null;
    }

    _isBooking = true;
    notifyListeners();

    try {
      final consultation = Teleconsultation(
        id: '',
        doctorId: _selectedDoctor!.id,
        doctorName: _selectedDoctor!.name,
        doctorSpecialization: _selectedDoctor!.specialization,
        doctorQualification: _selectedDoctor!.qualification,
        patientName: patientName,
        patientAbhaId: patientAbhaId,
        patientAbhaNumber: patientAbhaNumber,
        patientPhone: patientPhone,
        type: _selectedType,
        date: _selectedDate,
        timeSlot: _selectedSlot!.displayTime,
        status: ConsultationStatus.scheduled,
        createdAt: DateTime.now(),
      );

      final scheduled = await _repository.scheduleTeleconsultation(consultation);
      _lastScheduledConsultation = scheduled;
      await loadConsultations();
      return scheduled;
    } catch (e) {
      _errorMessage = e.toString();
      return null;
    } finally {
      _isBooking = false;
      notifyListeners();
    }
  }

  Future<void> loadConsultations() async {
    try {
      _consultations = await _repository.getTeleconsultations();
      notifyListeners();
    } catch (_) {}
  }

  void resetBookingState() {
    _selectedDoctor = null;
    _selectedSlot = null;
    _availableSlots = [];
    _lastScheduledConsultation = null;
    notifyListeners();
  }
}
