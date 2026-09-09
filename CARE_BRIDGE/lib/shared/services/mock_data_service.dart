import '../models/mock_models.dart';
import '../widgets/care_bridge_status_chip.dart';

/// Isolated Mock Data Service for CareBridge Step 1.
/// Provides realistic dummy data for UI rendering.
/// In future steps, this will be swapped for real repository/API implementations.
class MockDataService {
  MockDataService._();

  static final MockDataService instance = MockDataService._();

  /// Mock User Profile
  UserProfile getUserProfile() {
    return const UserProfile(
      id: 'usr_001',
      name: 'Demo User',
      mobileNumber: '+91 98765 43210',
      preferredLanguage: 'Tamil (தமிழ்)',
      location: 'Village A, Block 3, District Rural',
      abhaNumber: '91-1234-5678-9012',
    );
  }

  /// Mock Upcoming Appointment
  AppointmentItem getUpcomingAppointment() {
    return const AppointmentItem(
      id: 'apt_101',
      doctorName: 'Dr. General Medicine',
      specialty: 'Community Health & Internal Medicine',
      hospitalName: 'Government Primary Health Centre',
      date: '10 September 2026',
      time: '10:30 AM',
      status: CareBridgeStatus.confirmed,
      tokenNumber: 'A-24',
    );
  }

  /// Mock List of All Appointments (Upcoming & Past)
  List<AppointmentItem> getAppointments() {
    return const [
      AppointmentItem(
        id: 'apt_101',
        doctorName: 'Dr. General Medicine',
        specialty: 'Community Health & Internal Medicine',
        hospitalName: 'Government Primary Health Centre',
        date: '10 September 2026',
        time: '10:30 AM',
        status: CareBridgeStatus.confirmed,
        tokenNumber: 'A-24',
      ),
      AppointmentItem(
        id: 'apt_102',
        doctorName: 'Dr. S. Ramanathan',
        specialty: 'Pediatrics',
        hospitalName: 'Taluk District Hospital',
        date: '18 September 2026',
        time: '02:00 PM',
        status: CareBridgeStatus.pending,
        tokenNumber: 'P-09',
      ),
    ];
  }

  List<AppointmentItem> getPastAppointments() {
    return const [
      AppointmentItem(
        id: 'apt_098',
        doctorName: 'Dr. K. Malathi',
        specialty: 'Obstetrics & Gynecology',
        hospitalName: 'Sub-District Hospital',
        date: '12 August 2026',
        time: '11:00 AM',
        status: CareBridgeStatus.completed,
        tokenNumber: 'C-15',
      ),
      AppointmentItem(
        id: 'apt_085',
        doctorName: 'Dr. V. Anand',
        specialty: 'Ophthalmology',
        hospitalName: 'Mobile Vision Clinic',
        date: '28 July 2026',
        time: '09:30 AM',
        status: CareBridgeStatus.completed,
        tokenNumber: 'V-04',
      ),
    ];
  }

  /// Mock Referral
  ReferralItem getActiveReferral() {
    return const ReferralItem(
      id: 'ref_301',
      fromFacility: 'Village A Sub-Centre',
      toFacility: 'District Headquarters Hospital',
      specialty: 'Cardiology Assessment',
      validUntil: '30 September 2026',
      status: CareBridgeStatus.confirmed,
    );
  }

  /// Mock Health Alert
  HealthAlertItem getHealthAlert() {
    return const HealthAlertItem(
      id: 'alt_401',
      title: 'Seasonal Monsoon Health Advisory',
      description: 'Drink boiled water and report persistent fever to the nearest ASHA worker.',
      area: 'District Rural Zone',
      severity: CareBridgeStatus.warning,
      issuedDate: '02 September 2026',
    );
  }

  /// Mock Essential Medicines
  List<MedicineItem> getEssentialMedicines() {
    return const [
      MedicineItem(
        id: 'med_01',
        name: 'Paracetamol 500mg',
        dosage: 'Oral Tablet',
        pharmacyName: 'Primary Health Centre Pharmacy',
        status: CareBridgeStatus.available,
        stockCount: 420,
      ),
      MedicineItem(
        id: 'med_02',
        name: 'Metformin 500mg',
        dosage: 'Oral Tablet',
        pharmacyName: 'Primary Health Centre Pharmacy',
        status: CareBridgeStatus.available,
        stockCount: 180,
      ),
      MedicineItem(
        id: 'med_03',
        name: 'Amoxicillin 250mg',
        dosage: 'Oral Capsule',
        pharmacyName: 'Sub-Centre Dispensary',
        status: CareBridgeStatus.unavailable,
        stockCount: 0,
      ),
    ];
  }


  /// Mock List of Health Alerts
  List<HealthAlertItem> getHealthAlerts() {
    return const [
      HealthAlertItem(
        id: 'alt_401',
        title: 'Seasonal Flu Precautions',
        description: 'Drink boiled water, stay hydrated, and report persistent fever to the nearest ASHA worker.',
        area: 'District Rural Zone',
        severity: CareBridgeStatus.warning,
        issuedDate: 'Today',
      ),
      HealthAlertItem(
        id: 'alt_402',
        title: 'Vaccination Camp Nearby',
        description: 'Routine immunization & booster doses available at the Primary Health Centre.',
        area: 'Sub-District Health Centre',
        severity: CareBridgeStatus.available,
        issuedDate: 'Saturday • 9:00 AM',
      ),
    ];
  }

  /// Mock List of Health Camps
  List<HealthCampItem> getHealthCamps() {
    return const [
      HealthCampItem(
        id: 'cmp_501',
        title: 'General Health Screening',
        organizer: 'Primary Health Centre & Rotary Club',
        location: 'Primary Health Centre',
        date: 'Saturday',
        timing: '9:00 AM',
        servicesOffered: 'BP & Glucose screening, Free basic medicines',
      ),
      HealthCampItem(
        id: 'cmp_502',
        title: 'Free Health Check-up',
        organizer: 'District Rural Health Mission',
        location: 'Community Centre',
        date: 'Next Monday',
        timing: '10:00 AM',
        servicesOffered: 'Maternal health, Pediatric review, Nutrition advice',
      ),
    ];
  }

  /// Internal list of health records supporting dynamic additions (e.g. manual entries)
  final List<HealthRecordItem> _healthRecords = [
    const HealthRecordItem(
      id: 'rec_001',
      title: 'Complete Blood Count (CBC)',
      category: HealthRecordCategory.labReports,
      facility: 'Government District Hospital',
      doctor: 'Dr. R. Sundaram (Pathologist)',
      date: '12 Aug 2026',
      summary: 'Routine complete blood count check. Hemoglobin and platelet counts within expected ranges.',
      details: [
        RecordDetailField(
          label: 'Hemoglobin',
          value: '13.8 g/dL',
          referenceRange: '13.0 - 17.0 g/dL',
        ),
        RecordDetailField(
          label: 'Total Leukocyte Count (WBC)',
          value: '6,400 cells/mcL',
          referenceRange: '4,000 - 11,000 cells/mcL',
        ),
        RecordDetailField(
          label: 'Platelet Count',
          value: '2.4 Lakhs/mcL',
          referenceRange: '1.5 - 4.5 Lakhs/mcL',
        ),
        RecordDetailField(
          label: 'RBC Count',
          value: '4.7 million/mcL',
          referenceRange: '4.5 - 5.5 million/mcL',
        ),
      ],
      status: CareBridgeStatus.confirmed,
      hasDocument: true,
    ),
    const HealthRecordItem(
      id: 'rec_002',
      title: 'General Medical Consultation',
      category: HealthRecordCategory.medicalRecords,
      facility: 'Primary Health Centre, Village A',
      doctor: 'Dr. K. Malathi',
      date: '08 Aug 2026',
      summary: 'Seasonal check-up for mild viral throat discomfort. Vitals monitored and oral hydration recommended.',
      details: [
        RecordDetailField(
          label: 'Blood Pressure',
          value: '120/80 mmHg',
          referenceRange: '90/60 - 120/80 mmHg',
        ),
        RecordDetailField(
          label: 'Pulse Rate',
          value: '74 bpm',
          referenceRange: '60 - 100 bpm',
        ),
        RecordDetailField(
          label: 'Body Temperature',
          value: '98.4 °F',
          referenceRange: '97.8 - 99.0 °F',
        ),
        RecordDetailField(
          label: 'Oxygen Saturation (SpO2)',
          value: '98%',
          referenceRange: '95 - 100%',
        ),
      ],
      status: CareBridgeStatus.completed,
      hasDocument: true,
    ),
    const HealthRecordItem(
      id: 'rec_003',
      title: 'Outpatient Prescription',
      category: HealthRecordCategory.prescriptions,
      facility: 'Government Hospital Dispensary',
      doctor: 'Dr. S. Ramanathan',
      date: '08 Aug 2026',
      summary: 'Standard 5-day medicine course prescribed for seasonal allergy and nutritional supplement.',
      details: [
        RecordDetailField(
          label: 'Paracetamol 500mg',
          value: '1 tablet twice daily after meals (3 days)',
        ),
        RecordDetailField(
          label: 'Cetirizine 10mg',
          value: '1 tablet at bedtime (5 days)',
        ),
        RecordDetailField(
          label: 'Vitamin B-Complex',
          value: '1 capsule once daily in morning (15 days)',
        ),
      ],
      status: CareBridgeStatus.available,
      hasDocument: true,
    ),
    const HealthRecordItem(
      id: 'rec_004',
      title: 'COVID-19 Booster Vaccination',
      category: HealthRecordCategory.vaccinations,
      facility: 'Primary Health Centre Immunization Wing',
      doctor: 'Staff Nurse Lakshmi',
      date: '20 Jul 2026',
      summary: 'Precautionary booster dose administered. Certificate verified and record updated.',
      details: [
        RecordDetailField(
          label: 'Vaccine Name',
          value: 'Corbevax / Covishield Booster',
        ),
        RecordDetailField(
          label: 'Batch Number',
          value: 'COV-8942-B',
        ),
        RecordDetailField(
          label: 'Dose Number',
          value: 'Precaution Dose (Dose 3)',
        ),
        RecordDetailField(
          label: 'Site of Administration',
          value: 'Left Deltoid Muscle',
        ),
      ],
      status: CareBridgeStatus.confirmed,
      hasDocument: true,
    ),
    const HealthRecordItem(
      id: 'rec_005',
      title: 'Fasting Blood Glucose',
      category: HealthRecordCategory.labReports,
      facility: 'Sub-District Diagnostic Lab',
      doctor: 'Dr. V. Anand',
      date: '15 Jul 2026',
      summary: 'Routine fasting plasma glucose test performed following 10-hour overnight fast.',
      details: [
        RecordDetailField(
          label: 'Fasting Blood Sugar',
          value: '96 mg/dL',
          referenceRange: '70 - 99 mg/dL',
        ),
        RecordDetailField(
          label: 'Post Prandial Blood Sugar',
          value: '124 mg/dL',
          referenceRange: '< 140 mg/dL',
        ),
        RecordDetailField(
          label: 'HbA1c',
          value: '5.4%',
          referenceRange: '< 5.7% (Normal)',
        ),
      ],
      status: CareBridgeStatus.confirmed,
      hasDocument: true,
    ),
    const HealthRecordItem(
      id: 'rec_006',
      title: 'Tetanus Toxoid (TT) Injection',
      category: HealthRecordCategory.vaccinations,
      facility: 'Village A Sub-Centre',
      doctor: 'ANM Sister Revathi',
      date: '04 Jun 2026',
      summary: 'Prophylactic tetanus booster dose administered after minor scrape injury.',
      details: [
        RecordDetailField(
          label: 'Vaccine',
          value: 'Tetanus Toxoid 0.5ml',
        ),
        RecordDetailField(
          label: 'Batch Number',
          value: 'TT-3310-M',
        ),
        RecordDetailField(
          label: 'Route',
          value: 'Intramuscular',
        ),
      ],
      status: CareBridgeStatus.completed,
      hasDocument: true,
    ),
    const HealthRecordItem(
      id: 'rec_007',
      title: 'Cardiology Assessment Summary',
      category: HealthRecordCategory.medicalRecords,
      facility: 'District Headquarters Hospital',
      doctor: 'Dr. P. Venkat (Cardiologist)',
      date: '22 May 2026',
      summary: 'Clinical review of baseline ECG and cardiac rhythm. Normal sinus rhythm observed.',
      details: [
        RecordDetailField(
          label: 'Resting Heart Rate',
          value: '72 bpm',
          referenceRange: '60 - 100 bpm',
        ),
        RecordDetailField(
          label: 'ECG Rhythm',
          value: 'Normal Sinus Rhythm',
          referenceRange: 'Normal',
        ),
        RecordDetailField(
          label: 'Follow-up Recommendation',
          value: 'Annual preventative health review',
        ),
      ],
      status: CareBridgeStatus.confirmed,
      hasDocument: true,
    ),
    const HealthRecordItem(
      id: 'rec_008',
      title: 'Hospital Discharge Summary',
      category: HealthRecordCategory.otherDocuments,
      facility: 'Government District Hospital, Taluk',
      doctor: 'Dr. M. Senthil',
      date: '14 Feb 2026',
      summary: 'Short-stay observational discharge summary. Patient recovered and discharged in stable condition.',
      details: [
        RecordDetailField(
          label: 'Admission Reason',
          value: 'Acute Dehydration & Mild Gastroenteritis',
        ),
        RecordDetailField(
          label: 'Hospital Stay Duration',
          value: '2 Days (48 Hours)',
        ),
        RecordDetailField(
          label: 'Condition at Discharge',
          value: 'Stable, Fully Hydrated, Vitals Normal',
        ),
      ],
      status: CareBridgeStatus.completed,
      hasDocument: true,
    ),
  ];

  /// Mock List of Health Records (Step 4)
  List<HealthRecordItem> getHealthRecords() {
    return List.unmodifiable(_healthRecords);
  }

  /// Add a manually entered or newly ingested health record
  void addHealthRecord(HealthRecordItem record) {
    _healthRecords.insert(0, record);
  }
}
