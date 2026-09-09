import '../widgets/care_bridge_status_chip.dart';

/// User Profile Model (Mock / UI placeholder)
class UserProfile {
  final String id;
  final String name;
  final String mobileNumber;
  final String preferredLanguage;
  final String location;
  final String abhaNumber;

  const UserProfile({
    required this.id,
    required this.name,
    required this.mobileNumber,
    required this.preferredLanguage,
    required this.location,
    required this.abhaNumber,
  });
}

/// Appointment Model (Mock / UI placeholder)
class AppointmentItem {
  final String id;
  final String doctorName;
  final String specialty;
  final String hospitalName;
  final String date;
  final String time;
  final CareBridgeStatus status;
  final String? tokenNumber;

  const AppointmentItem({
    required this.id,
    required this.doctorName,
    required this.specialty,
    required this.hospitalName,
    required this.date,
    required this.time,
    required this.status,
    this.tokenNumber,
  });
}

/// Referral Model (Mock / UI placeholder)
class ReferralItem {
  final String id;
  final String fromFacility;
  final String toFacility;
  final String specialty;
  final String validUntil;
  final CareBridgeStatus status;

  const ReferralItem({
    required this.id,
    required this.fromFacility,
    required this.toFacility,
    required this.specialty,
    required this.validUntil,
    required this.status,
  });
}

/// Health Alert Model (Mock / UI placeholder)
class HealthAlertItem {
  final String id;
  final String title;
  final String description;
  final String area;
  final CareBridgeStatus severity;
  final String issuedDate;

  const HealthAlertItem({
    required this.id,
    required this.title,
    required this.description,
    required this.area,
    required this.severity,
    required this.issuedDate,
  });
}

/// Medicine Availability Model (Mock / UI placeholder)
class MedicineItem {
  final String id;
  final String name;
  final String dosage;
  final String pharmacyName;
  final CareBridgeStatus status;
  final int stockCount;

  const MedicineItem({
    required this.id,
    required this.name,
    required this.dosage,
    required this.pharmacyName,
    required this.status,
    required this.stockCount,
  });
}


/// Health Camp Model (Mock / UI placeholder)
class HealthCampItem {
  final String id;
  final String title;
  final String organizer;
  final String location;
  final String date;
  final String timing;
  final String servicesOffered;

  const HealthCampItem({
    required this.id,
    required this.title,
    required this.organizer,
    required this.location,
    required this.date,
    required this.timing,
    required this.servicesOffered,
  });
}

/// Health Record Category Enum
enum HealthRecordCategory {
  medicalRecords,
  labReports,
  prescriptions,
  vaccinations,
  otherDocuments;

  String get displayName {
    switch (this) {
      case HealthRecordCategory.medicalRecords:
        return 'Medical Records';
      case HealthRecordCategory.labReports:
        return 'Lab Reports';
      case HealthRecordCategory.prescriptions:
        return 'Prescriptions';
      case HealthRecordCategory.vaccinations:
        return 'Vaccinations';
      case HealthRecordCategory.otherDocuments:
        return 'Other Documents';
    }
  }
}

/// Structured Key-Value Detail for Health Record Screen
class RecordDetailField {
  final String label;
  final String value;
  final String? referenceRange;

  const RecordDetailField({
    required this.label,
    required this.value,
    this.referenceRange,
  });
}

/// Health Record Item Model (Step 4)
class HealthRecordItem {
  final String id;
  final String title;
  final HealthRecordCategory category;
  final String facility;
  final String? doctor;
  final String date;
  final String summary;
  final List<RecordDetailField> details;
  final CareBridgeStatus status;
  final bool hasDocument;
  final bool isManualEntry;
  final String? attachmentName;
  final String? attachmentPath;
  final String? attachmentType;
  final int? attachmentSize;

  const HealthRecordItem({
    required this.id,
    required this.title,
    required this.category,
    required this.facility,
    this.doctor,
    required this.date,
    required this.summary,
    this.details = const [],
    this.status = CareBridgeStatus.confirmed,
    this.hasDocument = true,
    this.isManualEntry = false,
    this.attachmentName,
    this.attachmentPath,
    this.attachmentType,
    this.attachmentSize,
  });
}

