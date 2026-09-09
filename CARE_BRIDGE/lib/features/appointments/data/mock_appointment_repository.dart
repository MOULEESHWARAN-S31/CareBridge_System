import '../domain/appointment_repository.dart';
import '../domain/district.dart';
import '../domain/hospital.dart';
import '../domain/doctor.dart';
import '../domain/appointment_slot.dart';
import '../domain/booked_appointment.dart';

class MockAppointmentRepository implements AppointmentRepository {
  static final MockAppointmentRepository instance = MockAppointmentRepository._();
  MockAppointmentRepository._();
  factory MockAppointmentRepository() => instance;

  final List<BookedAppointment> _patientAppointments = [];
  int _appointmentCounter = 1001;

  static const List<District> _districts = [
    District(id: 'dist_salem', name: 'Salem', state: 'Tamil Nadu', code: 'SLM'),
    District(id: 'dist_coimbatore', name: 'Coimbatore', state: 'Tamil Nadu', code: 'CBE'),
    District(id: 'dist_chennai', name: 'Chennai', state: 'Tamil Nadu', code: 'MAA'),
    District(id: 'dist_madurai', name: 'Madurai', state: 'Tamil Nadu', code: 'MDU'),
    District(id: 'dist_trichy', name: 'Tiruchirappalli', state: 'Tamil Nadu', code: 'TPJ'),
    District(id: 'dist_erode', name: 'Erode', state: 'Tamil Nadu', code: 'ED'),
    District(id: 'dist_namakkal', name: 'Namakkal', state: 'Tamil Nadu', code: 'NMK'),
    District(id: 'dist_dharmapuri', name: 'Dharmapuri', state: 'Tamil Nadu', code: 'DMP'),
  ];

  static const List<Hospital> _hospitals = [
    // Salem
    Hospital(
      id: 'hosp_slm_gh',
      name: 'Government Mohan Kumaramangalam Medical College Hospital',
      districtId: 'dist_salem',
      locationName: 'Gorimedu, Salem',
      type: 'Government Medical College Hospital',
      contactNumber: '+914272400100',
      address: 'Steel Plant Road, Gorimedu, Salem - 636030',
      latitude: 11.6643,
      longitude: 78.1460,
    ),
    Hospital(
      id: 'hosp_slm_phc',
      name: 'Primary Health Centre - Omalur',
      districtId: 'dist_salem',
      locationName: 'Omalur, Salem',
      type: 'Primary Health Centre (PHC)',
      contactNumber: '+914272450211',
      address: 'Main Road, Omalur, Salem - 636455',
      latitude: 11.7450,
      longitude: 78.0410,
    ),
    // Coimbatore
    Hospital(
      id: 'hosp_cbe_gh',
      name: 'Coimbatore Medical College Hospital',
      districtId: 'dist_coimbatore',
      locationName: 'Trichy Road, Coimbatore',
      type: 'Government Medical College Hospital',
      contactNumber: '+914222300051',
      address: 'Trichy Road, Coimbatore - 641018',
      latitude: 11.0018,
      longitude: 76.9629,
    ),
    Hospital(
      id: 'hosp_cbe_phc',
      name: 'Upgraded Primary Health Centre - Pollachi',
      districtId: 'dist_coimbatore',
      locationName: 'Pollachi, Coimbatore',
      type: 'Upgraded Primary Health Centre',
      contactNumber: '+914259223344',
      address: 'Palani Road, Pollachi - 642001',
      latitude: 10.6609,
      longitude: 77.0048,
    ),
    // Chennai
    Hospital(
      id: 'hosp_maa_gh',
      name: 'Rajiv Gandhi Government General Hospital',
      districtId: 'dist_chennai',
      locationName: 'EVR Periyar Salai, Chennai',
      type: 'Government General Hospital',
      contactNumber: '+914425305000',
      address: 'EVR Periyar Salai, Park Town, Chennai - 600003',
      latitude: 13.0805,
      longitude: 80.2764,
    ),
    Hospital(
      id: 'hosp_maa_stanley',
      name: 'Government Stanley Medical College Hospital',
      districtId: 'dist_chennai',
      locationName: 'Royapuram, Chennai',
      type: 'Government Medical College Hospital',
      contactNumber: '+914425281351',
      address: 'Old Jail Road, Royapuram, Chennai - 600013',
      latitude: 13.1077,
      longitude: 80.2878,
    ),
    // Madurai
    Hospital(
      id: 'hosp_mdu_gh',
      name: 'Government Rajaji Hospital',
      districtId: 'dist_madurai',
      locationName: 'Goripalayam, Madurai',
      type: 'Government General Hospital',
      contactNumber: '+914522532536',
      address: 'Panagal Road, Goripalayam, Madurai - 625020',
      latitude: 9.9288,
      longitude: 78.1256,
    ),
    // Trichy
    Hospital(
      id: 'hosp_tpj_gh',
      name: 'Mahatma Gandhi Memorial Government Hospital',
      districtId: 'dist_trichy',
      locationName: 'Puthur, Tiruchirappalli',
      type: 'Government General Hospital',
      contactNumber: '+914312770055',
      address: 'Collectorate Compound, Puthur, Trichy - 620017',
      latitude: 10.8158,
      longitude: 78.6865,
    ),
    // Erode
    Hospital(
      id: 'hosp_ed_gh',
      name: 'District Headquarter Hospital - Erode',
      districtId: 'dist_erode',
      locationName: 'Perundurai Road, Erode',
      type: 'District Headquarters Hospital',
      contactNumber: '+914242258354',
      address: 'Perundurai Road, Erode - 638011',
      latitude: 11.3410,
      longitude: 77.7172,
    ),
    // Namakkal
    Hospital(
      id: 'hosp_nmk_gh',
      name: 'Government Medical College Hospital - Namakkal',
      districtId: 'dist_namakkal',
      locationName: 'Mohanur Road, Namakkal',
      type: 'Government Medical College Hospital',
      contactNumber: '+914286220555',
      address: 'Mohanur Road, Namakkal - 637001',
      latitude: 11.2189,
      longitude: 78.1674,
    ),
    // Dharmapuri
    Hospital(
      id: 'hosp_dmp_gh',
      name: 'Government Dharmapuri Medical College Hospital',
      districtId: 'dist_dharmapuri',
      locationName: 'Pennagaram Road, Dharmapuri',
      type: 'Government Medical College Hospital',
      contactNumber: '+914342230500',
      address: 'Pennagaram Road, Dharmapuri - 636701',
      latitude: 12.1311,
      longitude: 78.1584,
    ),
    // Private Hospitals
    Hospital(
      id: 'hosp_slm_kauvery',
      name: 'Kauvery Hospital - Salem',
      districtId: 'dist_salem',
      locationName: 'Meyyanur, Salem',
      type: 'Private Multi-Specialty Hospital',
      contactNumber: '+914272777000',
      address: 'Meyyanur Road, Salem - 636004',
      latitude: 11.6620,
      longitude: 78.1420,
      hospitalType: 'Private',
    ),
    Hospital(
      id: 'hosp_cbe_psg',
      name: 'PSG Hospitals',
      districtId: 'dist_coimbatore',
      locationName: 'Peelamedu, Coimbatore',
      type: 'Private Super-Specialty Hospital',
      contactNumber: '+914222570170',
      address: 'Avinashi Road, Peelamedu, Coimbatore - 641004',
      latitude: 11.0260,
      longitude: 77.0010,
      hospitalType: 'Private',
    ),
    Hospital(
      id: 'hosp_maa_apollo',
      name: 'Apollo Hospitals - Greams Road',
      districtId: 'dist_chennai',
      locationName: 'Thousand Lights, Chennai',
      type: 'Private Multi-Specialty Hospital',
      contactNumber: '+914428290200',
      address: '21 Greams Lane, Thousand Lights, Chennai - 600006',
      latitude: 13.0600,
      longitude: 80.2520,
      hospitalType: 'Private',
    ),
  ];

  static const List<Doctor> _doctors = [
    // Salem GH
    Doctor(
      id: 'doc_slm_1',
      name: 'Dr. K. Arulmurugan, MD',
      hospitalId: 'hosp_slm_gh',
      specialization: 'General Medicine',
      qualification: 'MBBS, MD (General Medicine)',
      experienceYears: 14,
    ),
    Doctor(
      id: 'doc_slm_2',
      name: 'Dr. S. Meenakshi, MS',
      hospitalId: 'hosp_slm_gh',
      specialization: 'Obstetrics & Gynaecology',
      qualification: 'MBBS, MS (OBG), DGO',
      experienceYears: 11,
    ),
    Doctor(
      id: 'doc_slm_3',
      name: 'Dr. P. Ramesh, DCH',
      hospitalId: 'hosp_slm_gh',
      specialization: 'Paediatrics',
      qualification: 'MBBS, DCH',
      experienceYears: 8,
    ),
    // Salem PHC Omalur
    Doctor(
      id: 'doc_slm_phc_1',
      name: 'Dr. R. Vignesh, MBBS',
      hospitalId: 'hosp_slm_phc',
      specialization: 'General Medical Officer',
      qualification: 'MBBS (PHC Medical Officer)',
      experienceYears: 5,
    ),
    // Coimbatore GH
    Doctor(
      id: 'doc_cbe_1',
      name: 'Dr. M. Soundararajan, DM',
      hospitalId: 'hosp_cbe_gh',
      specialization: 'Cardiology',
      qualification: 'MBBS, MD, DM (Cardiology)',
      experienceYears: 18,
    ),
    Doctor(
      id: 'doc_cbe_2',
      name: 'Dr. V. Deepa, MS',
      hospitalId: 'hosp_cbe_gh',
      specialization: 'General Surgery',
      qualification: 'MBBS, MS (Surgery)',
      experienceYears: 12,
    ),
    // Coimbatore PHC
    Doctor(
      id: 'doc_cbe_phc_1',
      name: 'Dr. N. Elango, MBBS',
      hospitalId: 'hosp_cbe_phc',
      specialization: 'General Medicine',
      qualification: 'MBBS',
      experienceYears: 6,
    ),
    // Chennai RGGGH
    Doctor(
      id: 'doc_maa_1',
      name: 'Dr. T. Sivaraman, MD',
      hospitalId: 'hosp_maa_gh',
      specialization: 'General Medicine',
      qualification: 'MBBS, MD',
      experienceYears: 20,
    ),
    Doctor(
      id: 'doc_maa_2',
      name: 'Dr. A. Radhika, MD',
      hospitalId: 'hosp_maa_gh',
      specialization: 'Dermatology',
      qualification: 'MBBS, MD (DVL)',
      experienceYears: 15,
    ),
    // Chennai Stanley
    Doctor(
      id: 'doc_maa_stanley_1',
      name: 'Dr. G. Balaji, MS',
      hospitalId: 'hosp_maa_stanley',
      specialization: 'Orthopaedics',
      qualification: 'MBBS, MS (Ortho)',
      experienceYears: 16,
    ),
    // Madurai Rajaji
    Doctor(
      id: 'doc_mdu_1',
      name: 'Dr. C. Kannan, MD',
      hospitalId: 'hosp_mdu_gh',
      specialization: 'General Medicine',
      qualification: 'MBBS, MD',
      experienceYears: 13,
    ),
    // Trichy MGM
    Doctor(
      id: 'doc_tpj_1',
      name: 'Dr. E. Saravanan, MS',
      hospitalId: 'hosp_tpj_gh',
      specialization: 'ENT Specialist',
      qualification: 'MBBS, MS (ENT)',
      experienceYears: 10,
    ),
    // Erode GH
    Doctor(
      id: 'doc_ed_1',
      name: 'Dr. B. Mohan, MD',
      hospitalId: 'hosp_ed_gh',
      specialization: 'General Medicine',
      qualification: 'MBBS, MD',
      experienceYears: 9,
    ),
    // Namakkal GH
    Doctor(
      id: 'doc_nmk_1',
      name: 'Dr. K. Sathya, MS',
      hospitalId: 'hosp_nmk_gh',
      specialization: 'Obstetrics & Gynaecology',
      qualification: 'MBBS, MS (OBG)',
      experienceYears: 7,
    ),
    // Dharmapuri GH
    Doctor(
      id: 'doc_dmp_1',
      name: 'Dr. D. Periasamy, MD',
      hospitalId: 'hosp_dmp_gh',
      specialization: 'General Medicine',
      qualification: 'MBBS, MD',
      experienceYears: 12,
    ),
    // Private Hospital Doctors
    Doctor(
      id: 'doc_slm_pvt_1',
      name: 'Dr. K. Ananth, MD, DM',
      hospitalId: 'hosp_slm_kauvery',
      specialization: 'Neurology',
      qualification: 'MBBS, MD, DM (Neurology)',
      experienceYears: 16,
    ),
    Doctor(
      id: 'doc_cbe_pvt_1',
      name: 'Dr. R. Nandhakumar, MD, DM',
      hospitalId: 'hosp_cbe_psg',
      specialization: 'Cardiology',
      qualification: 'MBBS, MD, DM (Cardio)',
      experienceYears: 14,
    ),
    Doctor(
      id: 'doc_maa_pvt_1',
      name: 'Dr. Preetha Reddy, MD',
      hospitalId: 'hosp_maa_apollo',
      specialization: 'General Medicine',
      qualification: 'MBBS, MD',
      experienceYears: 18,
    ),
  ];

  @override
  Future<List<District>> fetchDistricts() async {
    await Future.delayed(const Duration(milliseconds: 100));
    return _districts;
  }

  @override
  Future<List<Hospital>> fetchAllHospitals() async {
    await Future.delayed(const Duration(milliseconds: 100));
    return _hospitals;
  }

  @override
  Future<List<Hospital>> fetchHospitalsByDistrict(String districtId) async {
    await Future.delayed(const Duration(milliseconds: 100));
    return _hospitals.where((h) => h.districtId == districtId).toList();
  }

  @override
  Future<List<Doctor>> fetchAllDoctors() async {
    await Future.delayed(const Duration(milliseconds: 100));
    return _doctors;
  }

  @override
  Future<List<Doctor>> fetchDoctorsByHospital(String hospitalId) async {
    await Future.delayed(const Duration(milliseconds: 100));
    return _doctors.where((d) => d.hospitalId == hospitalId).toList();
  }

  @override
  Hospital? findHospitalById(String hospitalId) {
    try {
      return _hospitals.firstWhere((h) => h.id == hospitalId);
    } catch (_) {
      return null;
    }
  }

  @override
  District? findDistrictById(String districtId) {
    try {
      return _districts.firstWhere((d) => d.id == districtId);
    } catch (_) {
      return null;
    }
  }

  @override
  Future<List<AppointmentSlot>> fetchAvailableSlots(String doctorId, DateTime date) async {
    await Future.delayed(const Duration(milliseconds: 300));
    // Generate deterministic time slots for requested doctor & date
    final dateOnly = DateTime(date.year, date.month, date.day);
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
        startTime: '09:30 AM',
        endTime: '10:00 AM',
        isAvailable: true,
      ),
      AppointmentSlot(
        id: 'slot_${doctorId}_${dateOnly.millisecondsSinceEpoch}_3',
        doctorId: doctorId,
        date: dateOnly,
        startTime: '10:00 AM',
        endTime: '10:30 AM',
        isAvailable: false, // booked slot demo
      ),
      AppointmentSlot(
        id: 'slot_${doctorId}_${dateOnly.millisecondsSinceEpoch}_4',
        doctorId: doctorId,
        date: dateOnly,
        startTime: '10:30 AM',
        endTime: '11:00 AM',
        isAvailable: true,
      ),
      AppointmentSlot(
        id: 'slot_${doctorId}_${dateOnly.millisecondsSinceEpoch}_5',
        doctorId: doctorId,
        date: dateOnly,
        startTime: '11:00 AM',
        endTime: '11:30 AM',
        isAvailable: true,
      ),
      AppointmentSlot(
        id: 'slot_${doctorId}_${dateOnly.millisecondsSinceEpoch}_6',
        doctorId: doctorId,
        date: dateOnly,
        startTime: '02:00 PM',
        endTime: '02:30 PM',
        isAvailable: true,
      ),
      AppointmentSlot(
        id: 'slot_${doctorId}_${dateOnly.millisecondsSinceEpoch}_7',
        doctorId: doctorId,
        date: dateOnly,
        startTime: '02:30 PM',
        endTime: '03:00 PM',
        isAvailable: true,
      ),
    ];
  }

  @override
  Future<BookedAppointment> createAppointment({
    required String patientProfileId,
    required Hospital hospital,
    required Doctor doctor,
    required DateTime date,
    required AppointmentSlot slot,
  }) async {
    await Future.delayed(const Duration(milliseconds: 500));
    final idStr = 'CB-APT-${_appointmentCounter++}';
    final appointment = BookedAppointment(
      id: idStr,
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
    _patientAppointments.insert(0, appointment);
    return appointment;
  }

  @override
  Future<List<BookedAppointment>> fetchPatientAppointments(String patientProfileId) async {
    await Future.delayed(const Duration(milliseconds: 200));
    return _patientAppointments.where((a) => a.patientProfileId == patientProfileId).toList();
  }
}
