import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'supported_locales.dart';

/// Centralized localization architecture for CareBridge.
/// Prepared for English, Tamil, and future regional Indian languages.
class AppLocalizations {
  final Locale locale;

  AppLocalizations(this.locale);

  static AppLocalizations of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations) ??
        AppLocalizations(SupportedLocales.english);
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  static const List<Locale> supportedLocales = [
    Locale('en'),
    Locale('ta'),
    Locale('hi'),
  ];

  String _get(String key, String fallback) {
    return _localizedValues[locale.languageCode]?[key] ??
        _localizedValues['en']?[key] ??
        fallback;
  }

  // Core navigation labels
  String get tabHome => _get('tabHome', 'Home');
  String get tabAppointments => _get('tabAppointments', 'Appointments');
  String get tabCare => _get('tabCare', 'Care');
  String get tabRecords => _get('tabRecords', 'Records');
  String get tabProfile => _get('tabProfile', 'Profile');

  // Branding
  String get appName => 'CareBridge';
  String get tagline => _get('tagline', 'Bridging People to Better Healthcare');

  // Common actions
  String get continueBtn => _get('continueBtn', 'Continue');
  String get nextBtn => _get('nextBtn', 'Next');
  String get backBtn => _get('backBtn', 'Back');
  String get skipBtn => _get('skipBtn', 'Skip');
  String get getStartedBtn => _get('getStartedBtn', 'Get Started');
  String get cancelBtn => _get('cancelBtn', 'Cancel');
  String get logoutBtn => _get('logoutBtn', 'Log out');

  // Auth / Login
  String get loginTitle => _get('loginTitle', 'Welcome back');
  String get loginSubtitle => _get('loginSubtitle', 'Enter your mobile number');
  String get mobileNumberLabel => _get('mobileNumberLabel', 'Mobile number');
  String get loginPrivacyNote => _get(
        'loginPrivacyNote',
        "We'll use your mobile number to securely verify your identity.",
      );

  // OTP
  String get otpTitle => _get('otpTitle', 'Verify your mobile number');
  String get otpSubtitle => _get('otpSubtitle', "We've sent a 6-digit verification code to");
  String get verifyBtn => _get('verifyBtn', 'Verify');
  String get resendOtpBtn => _get('resendOtpBtn', 'Resend OTP');
  String get changeMobileBtn => _get('changeMobileBtn', 'Change mobile number');

  // Profile Setup
  String get profileSetupTitle => _get('profileSetupTitle', 'Set up your profile');
  String get profileSetupSubtitle =>
      _get('profileSetupSubtitle', "Let's personalize CareBridge for you.");
  String get fullNameLabel => _get('fullNameLabel', 'Full name');
  String get preferredLanguageLabel => _get('preferredLanguageLabel', 'Preferred language');
  String get dobLabel => _get('dobLabel', 'Date of birth (Optional)');
  String get genderLabel => _get('genderLabel', 'Gender (Optional)');
  String get consentLabel => _get(
        'consentLabel',
        'I understand and agree to continue. CareBridge will use this information solely to personalize healthcare services.',
      );

  // Logout
  String get logoutConfirmTitle => _get('logoutConfirmTitle', 'Log out?');
  String get logoutConfirmMessage =>
      _get('logoutConfirmMessage', 'Are you sure you want to log out of CareBridge?');

  // Step 3 Dashboard Getters
  String get greetingMorning => _get('greetingMorning', 'Good morning');
  String get greetingAfternoon => _get('greetingAfternoon', 'Good afternoon');
  String get greetingEvening => _get('greetingEvening', 'Good evening');
  String get greetingFallback => _get('greetingFallback', 'Hello');
  String get homeGreetingSubtitle =>
      _get('homeGreetingSubtitle', 'How can we help you today?');
  String get healthStatusTitle => _get('healthStatusTitle', 'Your Health Status');
  String get healthStatusCheck => _get('healthStatusCheck', 'Health Check Status');
  String get healthStatusDoingWell =>
      _get('healthStatusDoingWell', "You're doing well • Keep following your health routine.");
  String get healthStatusUpdatedToday =>
      _get('healthStatusUpdatedToday', 'Last updated: Today');
  String get quickActionsTitle => _get('quickActionsTitle', 'Quick Actions');
  String get quickActionBookDoctor =>
      _get('quickActionBookDoctor', 'Book Doctor');
  String get quickActionTalkDoctor =>
      _get('quickActionTalkDoctor', 'Talk to Doctor');
  String get quickActionFindHospital =>
      _get('quickActionFindHospital', 'Find Hospital');
  String get quickActionEmergency => _get('quickActionEmergency', 'Emergency');
  String get emergencyAssistanceTitle =>
      _get('emergencyAssistanceTitle', 'Emergency Assistance');
  String get emergencyAssistanceMsg => _get(
        'emergencyAssistanceMsg',
        'If this is a medical emergency, call 108 or seek immediate medical assistance.',
      );
  String get call108Btn => _get('call108Btn', 'Call 108');
  String get upcomingAppointmentTitle =>
      _get('upcomingAppointmentTitle', 'Upcoming Appointment');
  String get noUpcomingAppointments =>
      _get('noUpcomingAppointments', 'No upcoming appointments');
  String get bookConsultationPrompt =>
      _get('bookConsultationPrompt', 'Book a consultation when you need care.');
  String get viewAppointmentBtn =>
      _get('viewAppointmentBtn', 'View Appointment');
  String get viewAllBtn => _get('viewAllBtn', 'View all');
  String get referralTitle => _get('referralTitle', 'Referral Status');
  String get noActiveReferrals => _get('noActiveReferrals', 'No active referrals');
  String get viewReferralBtn => _get('viewReferralBtn', 'View Referral');
  String get healthAlertsTitle => _get('healthAlertsTitle', 'Health Alerts');
  String get noHealthAlerts => _get('noHealthAlerts', 'No active health alerts');
  String get medicineAvailabilityTitle =>
      _get('medicineAvailabilityTitle', 'Medicine Availability');
  String get viewMedicinesBtn => _get('viewMedicinesBtn', 'View Medicines');
  String get noMedicinesAvailable =>
      _get('noMedicinesAvailable', 'No medicine records available');
  String get nearbyHealthCampsTitle =>
      _get('nearbyHealthCampsTitle', 'Nearby Health Camps');
  String get noHealthCamps =>
      _get('noHealthCamps', 'No health camps scheduled nearby');
  String get assistantCardTitle =>
      _get('assistantCardTitle', 'CareBridge Assistant');
  String get assistantCardSubtitle =>
      _get('assistantCardSubtitle', 'Have a question about healthcare?');
  String get askAssistantBtn => _get('askAssistantBtn', 'Ask CareBridge');
  String get assistantSoonMsg =>
      _get('assistantSoonMsg', 'The healthcare assistant will be available soon.');
  String get openAssistantSemantic =>
      _get('openAssistantSemantic', 'Open CareBridge Assistant');
  String get doctorConsultationSoonMsg =>
      _get('doctorConsultationSoonMsg', 'Doctor consultation will be available soon.');
  String get needEmergencyHelpTitle =>
      _get('needEmergencyHelpTitle', 'Need Emergency Help?');
  String get emergencyHelpSubtitle => _get(
        'emergencyHelpSubtitle',
        'For serious emergencies, seek immediate medical attention.',
      );
  String get notificationsTitle => _get('notificationsTitle', 'Notifications');
  String get noNotifications =>
      _get('noNotifications', 'No new notifications at this time.');
  String get markAllRead => _get('markAllRead', 'Mark all as read');

  // Step 4 Health Records Getters
  String get recordsTitle => _get('recordsTitle', 'Health Records');
  String get recordsSubtitle =>
      _get('recordsSubtitle', 'Your health information in one place');
  String get recordsSummaryTitle =>
      _get('recordsSummaryTitle', 'Records Summary');
  String get allRecords => _get('allRecords', 'All');
  String get categoryMedicalRecords =>
      _get('categoryMedicalRecords', 'Medical Records');
  String get categoryLabReports =>
      _get('categoryLabReports', 'Lab Reports');
  String get categoryPrescriptions =>
      _get('categoryPrescriptions', 'Prescriptions');
  String get categoryVaccinations =>
      _get('categoryVaccinations', 'Vaccinations');
  String get categoryOtherDocuments =>
      _get('categoryOtherDocuments', 'Other Documents');
  String get recentRecordsTitle =>
      _get('recentRecordsTitle', 'Recent Records');
  String get searchRecordsHint =>
      _get('searchRecordsHint', 'Search by title, hospital, doctor...');
  String get noHealthRecordsYet =>
      _get('noHealthRecordsYet', 'No health records yet');
  String get noHealthRecordsDesc => _get(
        'noHealthRecordsDesc',
        'Your medical consultations, lab reports, and prescriptions will appear here.',
      );
  String get noRecordsFound => _get('noRecordsFound', 'No records found');
  String get tryDifferentSearch => _get(
        'tryDifferentSearch',
        'Try a different search term or category filter.',
      );
  String get emptyCategoryRecords =>
      _get('emptyCategoryRecords', 'No records available in this category');
  String get recordDetailsTitle =>
      _get('recordDetailsTitle', 'Record Details');
  String get viewDetailsBtn => _get('viewDetailsBtn', 'View Details');
  String get facilityLabel => _get('facilityLabel', 'Healthcare Facility');
  String get doctorLabel => _get('doctorLabel', 'Doctor / Provider');
  String get dateLabel => _get('dateLabel', 'Date');
  String get recordTypeLabel => _get('recordTypeLabel', 'Record Type');
  String get clinicalSummaryTitle => _get('clinicalSummaryTitle', 'Summary');
  String get structuredDetailsTitle =>
      _get('structuredDetailsTitle', 'Test Results & Observations');
  String get documentPreviewTitle =>
      _get('documentPreviewTitle', 'Document Preview');
  String get documentPreviewPlaceholder => _get(
        'documentPreviewPlaceholder',
        'This health document will be available here in a future version.',
      );
  String get downloadBtn => _get('downloadBtn', 'Download');
  String get shareBtn => _get('shareBtn', 'Share');
  String get printBtn => _get('printBtn', 'Print');
  String get featureAvailableFutureMsg => _get(
        'featureAvailableFutureMsg',
        'This feature will be available in a future version.',
      );
  String get nonDiagnosticDisclaimer => _get(
        'nonDiagnosticDisclaimer',
        'Demonstration data for informational record-keeping only. Not a medical diagnosis or clinical prescription.',
      );

  // ABHA Connection Screen
  String get abhaConnectTitle =>
      _get('abhaConnectTitle', 'Connect with your\nABHA Card');
  String get abhaConnectSubtitle => _get(
        'abhaConnectSubtitle',
        'Connect your existing ABHA account to securely access your healthcare information.',
      );
  String get abhaWhatIsIt => _get(
        'abhaWhatIsIt',
        'ABHA (Ayushman Bharat Health Account) is your unique digital health ID that links all your medical records securely.',
      );
  String get abhaConnectBtn => _get('abhaConnectBtn', 'Connect with ABHA');
  String get abhaCreateBtn => _get('abhaCreateBtn', 'Create your ABHA Card');
  String get abhaPrototypeDisclaimer => _get(
        'abhaPrototypeDisclaimer',
        'ABHA integration will securely connect your health information in the full version of CareBridge.',
      );

  // Book Appointment Getters
  String get bookAppointmentTitle => _get('bookAppointmentTitle', 'Book Appointment');
  String get selectDistrictStep => _get('selectDistrictStep', 'Select District');
  String get selectHospitalStep => _get('selectHospitalStep', 'Select Hospital');
  String get selectDoctorStep => _get('selectDoctorStep', 'Select Doctor');
  String get selectDateTimeStep => _get('selectDateTimeStep', 'Select Date & Time');
  String get summaryStep => _get('summaryStep', 'Appointment Summary');
  String get callHospitalBtn => _get('callHospitalBtn', 'Call Hospital');
  String get confirmAppointmentBtn => _get('confirmAppointmentBtn', 'Confirm Appointment');
  String get appointmentConfirmedTitle => _get('appointmentConfirmedTitle', 'Appointment Confirmed!');

  // Manual Entry & Healthcare Discovery Getters
  String get recordCategoriesTitle => _get('recordCategoriesTitle', 'Record Categories');
  String get manualEntryBtn => _get('manualEntryBtn', 'Manual Entry');
  String get addLabReport => _get('addLabReport', 'Add Lab Report');
  String get manualEntrySubtitle => _get('manualEntrySubtitle', 'Enter lab test values manually to store in your record');
  String get reportTitleLabel => _get('reportTitleLabel', 'Report Title');
  String get reportTitleHint => _get('reportTitleHint', 'e.g. Blood Sugar, Complete Lipid Panel');
  String get facilityHint => _get('facilityHint', 'e.g. Primary Health Centre');
  String get doctorHint => _get('doctorHint', 'e.g. Dr. K. Sharma');
  String get clinicalSummaryHint => _get('clinicalSummaryHint', 'Brief summary or notes from the test');
  String get testResultLabel => _get('testResultLabel', 'Key Test Value / Result (Optional)');
  String get testResultHint => _get('testResultHint', 'e.g. 110 mg/dL');
  String get titleRequired => _get('titleRequired', 'Please enter a report title');
  String get facilityRequired => _get('facilityRequired', 'Please enter a facility name');
  String get saveRecordBtn => _get('saveRecordBtn', 'Save Record');
  String get manuallyEnteredBadge => _get('manuallyEnteredBadge', 'Manually Entered');
  String get searchResultsTitle => _get('searchResultsTitle', 'Search Results');
  String get showAllRecords => _get('showAllRecords', 'Show All Records');
  String get publicHealthServicesTitle => _get('publicHealthServicesTitle', 'Public Healthcare Services');
  String get publicHealthServicesSubtitle => _get('publicHealthServicesSubtitle', 'Locate nearby government hospitals and primary health centres');
  String get hospitalsTitle => _get('hospitalsTitle', 'Hospitals');
  String get hospitalsSubtitle => _get('hospitalsSubtitle', 'District HQ, sub-district and specialty government hospitals');
  String get phcsTitle => _get('phcsTitle', 'Primary Health Centres (PHCs)');
  String get phcsSubtitle => _get('phcsSubtitle', 'Community & urban primary health centres near your village/city');
  String get findDoctorTitle => _get('findDoctorTitle', 'Find Doctor');
  String get findDoctorSubtitle => _get('findDoctorSubtitle', 'Specialists & general physicians');
  String get emergencyServicesTitle => _get('emergencyServicesTitle', 'Emergency Services');
  String get emergencyServicesSubtitle => _get('emergencyServicesSubtitle', 'Dial 108 ambulance response');
  String get filterDistrict => _get('filterDistrict', 'District');
  String get filterCity => _get('filterCity', 'City');
  String get filterNearby => _get('filterNearby', 'Nearby');
  String get selectDistrict => _get('selectDistrict', 'Select District');
  String get selectCity => _get('selectCity', 'Select City');
  String get allDistricts => _get('allDistricts', 'All Districts');
  String get allCities => _get('allCities', 'All Cities');
  String get noFacilitiesFound => _get('noFacilitiesFound', 'No Healthcare Facilities Found');
  String get tryDifferentFilter => _get('tryDifferentFilter', 'Try selecting a different district or city filter.');
  String get locationRequiredMsg => _get('locationRequiredMsg', 'Location is required to find nearby facilities.');
  String get enableLocationBtn => _get('enableLocationBtn', 'Enable Location / Get GPS');
  String get getDirectionsBtn => _get('getDirectionsBtn', 'Get Directions');
  String get openInGoogleMaps => _get('openInGoogleMaps', 'Open in Google Maps');
  String get mapsLaunchFailed => _get('mapsLaunchFailed', 'Could not open maps application');
  String get servicesOfferedTitle => _get('servicesOfferedTitle', 'Services Offered');

  // ABHA Mobile Lookup & Profile Selection Getters
  String get selectProfile => _get('selectProfile', 'Select Profile');
  String get noAbhaProfileFound => _get('noAbhaProfileFound', 'No ABHA Profile Found');
  String get createAbhaCard => _get('createAbhaCard', 'Create ABHA Card');
  String get abhaRegistration => _get('abhaRegistration', 'ABHA Registration');
  String get patientProfile => _get('patientProfile', 'Patient Profile');
  String get retryBtn => _get('retryBtn', 'Retry');
  String get somethingWentWrong => _get('somethingWentWrong', 'Something went wrong');
  String get abhaProfilesFound => _get('abhaProfilesFound', 'ABHA Profiles Found');
  String get checkingAbhaRecords => _get('checkingAbhaRecords', 'Checking ABHA Records');
  String get searchingAbhaProfiles => _get('searchingAbhaProfiles', 'Searching for ABHA profiles linked to your registered mobile number...');
  String get connectSelectedProfile => _get('connectSelectedProfile', 'Connect Selected Profile');

  // Healthcare & Emergency Update Getters
  String get governmentHospitals => _get('governmentHospitals', 'Government Hospitals');
  String get privateHospitals => _get('privateHospitals', 'Private Hospitals');
  String get overallHospitals => _get('overallHospitals', 'Overall Hospitals');
  String get filterGovernment => _get('filterGovernment', 'Government');
  String get filterPrivate => _get('filterPrivate', 'Private');
  String get filterOverall => _get('filterOverall', 'Overall');
  String get emergency108Title => _get('emergency108Title', '108 Emergency Service');
  String get emergency108Subtitle => _get('emergency108Subtitle', 'Immediate ambulance assistance');
  String get teleconsultationAudioTitle => _get('teleconsultationAudioTitle', 'Teleconsultation (Audio)');
  String get teleconsultationAudioSubtitle => _get('teleconsultationAudioSubtitle', 'Talk to a doctor by voice');
  String get calling108Msg => _get('calling108Msg', 'Initiating emergency 108 ambulance call...');
  String get connectingAudioConsultation => _get('connectingAudioConsultation', 'Connecting to audio teleconsultation...');
  String get selectSpecialization => _get('selectSpecialization', 'Select Specialization');
  String get allSpecializations => _get('allSpecializations', 'All Specializations');
  String get hospitalTypeLabel => _get('hospitalTypeLabel', 'Hospital Type');
  String get noDoctorsFound => _get('noDoctorsFound', 'No Doctors Found');
  String get tryDifferentDoctorFilter => _get('tryDifferentDoctorFilter', 'Try selecting a different hospital type or specialization.');

  // Find Doctor & Health Records Update Getters
  String get bookAppointmentAction => _get('bookAppointmentAction', 'Book Appointment');
  String get addManualLabReportBtn => _get('addManualLabReportBtn', '+ Add Manual Lab Report');
  String get uploadDocumentBtn => _get('uploadDocumentBtn', 'Upload Document');
  String get replaceDocumentBtn => _get('replaceDocumentBtn', 'Replace');
  String get removeDocumentBtn => _get('removeDocumentBtn', 'Remove');
  String get noDocumentSelected => _get('noDocumentSelected', 'No document selected');
  String get attachedDocumentLabel => _get('attachedDocumentLabel', 'Attached Document');
  String get fileNotSupported => _get('fileNotSupported', 'File type not supported. Please upload a PDF, JPG, or PNG.');
  String get fileTooLarge => _get('fileTooLarge', 'File is too large. Maximum size is 10 MB.');
  String get documentSelectedMsg => _get('documentSelectedMsg', 'Document selected successfully');
  String get doctorDetailsTitle => _get('doctorDetailsTitle', 'Doctor Details');
  String get qualificationLabel => _get('qualificationLabel', 'Qualification');
  String get experienceLabel => _get('experienceLabel', 'Experience');
  String get experienceYears => _get('experienceYears', 'years experience');
  String get availabilityLabel => _get('availabilityLabel', 'Availability');
  String get doctorAvailable => _get('doctorAvailable', 'Available');
  String get doctorOnLeave => _get('doctorOnLeave', 'On Leave');
  String get testCategoryLabel => _get('testCategoryLabel', 'Test Category');
  String get testCategoryHint => _get('testCategoryHint', 'e.g. Pathology, Biochemistry, Radiology');

  // Profile, OPD Card, Care Medical & Prescription Ordering Getters
  String get myAbhaCardTitle => _get('myAbhaCardTitle', 'My Health ID / ABHA');
  String get myAbhaCardSubtitle => _get('myAbhaCardSubtitle', 'My Health ID / My ABHA Card');
  String get myAbhaCard => _get('myAbhaCard', 'My ABHA Card');
  String get myHealthId => _get('myHealthId', 'My Health ID');
  String get qrCode => _get('qrCode', 'QR Code');
  String get scanQrPrompt => _get('scanQrPrompt', 'Scan this QR code at hospital counters for instant registration');
  String get emergencyContactsTitle => _get('emergencyContactsTitle', 'Emergency Contacts');
  String get emergencyContactsSubtitle => _get('emergencyContactsSubtitle', 'Add and manage emergency contacts');
  String get noEmergencyContacts => _get('noEmergencyContacts', 'No emergency contacts added.');
  String get addEmergencyContactBtn => _get('addEmergencyContactBtn', '+ Add Emergency Contact');
  String get editContactBtn => _get('editContactBtn', 'Edit');
  String get deleteContactBtn => _get('deleteContactBtn', 'Delete');
  String get contactNameLabel => _get('contactNameLabel', 'Contact Name');
  String get relationshipLabel => _get('relationshipLabel', 'Relationship');
  String get mobileNumberFieldLabel => _get('mobileNumberFieldLabel', 'Mobile Number');
  String get saveContactBtn => _get('saveContactBtn', 'Save Contact');
  String get contactNameRequired => _get('contactNameRequired', 'Contact name is required');
  String get validMobileRequired => _get('validMobileRequired', 'Please enter a valid 10-digit mobile number');
  String get confirmDeleteTitle => _get('confirmDeleteTitle', 'Delete Contact?');
  String get confirmDeleteMsg => _get('confirmDeleteMsg', 'Are you sure you want to remove this emergency contact?');
  String get languageSettingsTitle => _get('languageSettingsTitle', 'Language');
  String get tamilLang => _get('tamilLang', 'Tamil');
  String get englishLang => _get('englishLang', 'English');
  String get opdCardTitle => _get('opdCardTitle', 'OPD Card');
  String get opdCardSubtitle => _get('opdCardSubtitle', 'Digital Outpatient Department registration card');
  String get downloadOpdCardBtn => _get('downloadOpdCardBtn', 'Download OPD Card');
  String get downloadingOpdCard => _get('downloadingOpdCard', 'Generating and downloading OPD Card PDF...');
  String get opdCardDownloaded => _get('opdCardDownloaded', 'OPD Card downloaded successfully');
  String get opdNumberLabel => _get('opdNumberLabel', 'OPD No');
  String get patientIdLabel => _get('patientIdLabel', 'Patient ID');
  String get patientNameLabel => _get('patientNameLabel', 'Patient Name');
  String get registrationDateLabel => _get('registrationDateLabel', 'Registration Date');
  String get medicalTitle => _get('medicalTitle', 'Medical');
  String get medicalSubtitle => _get('medicalSubtitle', 'Nearby medical stores and pharmacies');
  String get nearbyMedicalStores => _get('nearbyMedicalStores', 'Nearby Medical Stores');
  String get open24x7 => _get('open24x7', 'Open 24x7');
  String get orderMedicinesBtn => _get('orderMedicinesBtn', 'Order Medicines');
  String get orderMedicinesSubtitle => _get('orderMedicinesSubtitle', 'Order prescribed medicines from this record');
  String get selectMedicinesTitle => _get('selectMedicinesTitle', 'Select Medicines');
  String get reviewOrderTitle => _get('reviewOrderTitle', 'Order Summary');
  String get confirmOrderBtn => _get('confirmOrderBtn', 'Confirm Order');
  String get orderSuccessTitle => _get('orderSuccessTitle', 'Order Placed Successfully');
  String get orderSuccessSubtitle => _get('orderSuccessSubtitle', 'Your medicine order has been received.');
  String get orderIdLabel => _get('orderIdLabel', 'Order ID');
  String get medicinesCountLabel => _get('medicinesCountLabel', 'Medicines');
  String get pickupFacilityLabel => _get('pickupFacilityLabel', 'Pickup / Delivery Facility');
  String get backToRecordsBtn => _get('backToRecordsBtn', 'Back to Records');

  // Teleconsultation Feature Getters
  String get teleconsultationTitle => _get('teleconsultationTitle', 'Teleconsultation');
  String get teleconsultationSubtitle => _get('teleconsultationSubtitle', 'Consult with qualified government & private doctors remotely');
  String get searchDoctorHint => _get('searchDoctorHint', 'Search doctor by name or specialty...');
  String get filterSpecialization => _get('filterSpecialization', 'Specialization');
  String get filterAvailability => _get('filterAvailability', 'Availability');
  String get availableNow => _get('availableNow', 'Available Now');
  String get allAvailability => _get('allAvailability', 'All Doctors');
  String get bookTeleconsultationBtn => _get('bookTeleconsultationBtn', 'Book Consultation');
  String get consultationTypeTitle => _get('consultationTypeTitle', 'Consultation Type');
  String get consultationTypeVideo => _get('consultationTypeVideo', 'Video Call');
  String get consultationTypeAudio => _get('consultationTypeAudio', 'Audio Call');
  String get consultationTypeChat => _get('consultationTypeChat', 'Chat');
  String get consultationTypeVideoDesc => _get('consultationTypeVideoDesc', 'Face-to-face video consultation with your doctor');
  String get consultationTypeAudioDesc => _get('consultationTypeAudioDesc', 'Direct voice consultation with your doctor');
  String get consultationTypeChatDesc => _get('consultationTypeChatDesc', 'Text messaging consultation with your doctor');
  String get selectDateTitle => _get('selectDateTitle', 'Select Date');
  String get selectTimeSlotTitle => _get('selectTimeSlotTitle', 'Select Time Slot');
  String get noSlotsAvailable => _get('noSlotsAvailable', 'No time slots available for this date.');
  String get consultationSummaryTitle => _get('consultationSummaryTitle', 'Consultation Summary');
  String get consultationDetailsSection => _get('consultationDetailsSection', 'Consultation Details');
  String get patientDetailsSection => _get('patientDetailsSection', 'Patient Details');
  String get confirmAndScheduleBtn => _get('confirmAndScheduleBtn', 'Confirm & Schedule Consultation');
  String get consultationScheduledTitle => _get('consultationScheduledTitle', 'Consultation Scheduled!');
  String get consultationScheduledSubtitle => _get('consultationScheduledSubtitle', 'Your remote consultation has been successfully booked.');
  String get consultationIdLabel => _get('consultationIdLabel', 'Consultation ID');
  String get addToAppointmentsBtn => _get('addToAppointmentsBtn', 'Add to Appointments');
  String get doneBtn => _get('doneBtn', 'Done');
  String get teleconsultationBadge => _get('teleconsultationBadge', 'Teleconsultation');
  String get joinConsultationBtn => _get('joinConsultationBtn', 'Join Consultation');
  String get prototypeConsultationNotice => _get('prototypeConsultationNotice', 'Prototype Teleconsultation Simulation');
  String get connectingToDoctor => _get('connectingToDoctor', 'Connecting to doctor...');
  String get consultationConnected => _get('consultationConnected', 'Connected');
  String get muteMic => _get('muteMic', 'Mute');
  String get unmuteMic => _get('unmuteMic', 'Unmute');
  String get cameraOn => _get('cameraOn', 'Turn Off Video');
  String get cameraOff => _get('cameraOff', 'Turn On Video');
  String get switchCamera => _get('switchCamera', 'Flip Camera');
  String get endConsultationBtn => _get('endConsultationBtn', 'End Consultation');
  String get consultationEndedTitle => _get('consultationEndedTitle', 'Consultation Ended');
  String get callDurationLabel => _get('callDurationLabel', 'Call Duration');
  String get returnToHomeBtn => _get('returnToHomeBtn', 'Return to Home');
  String get viewSummaryBtn => _get('viewSummaryBtn', 'View Summary');
  String get chatInputHint => _get('chatInputHint', 'Type a message to doctor...');
  String get sendBtn => _get('sendBtn', 'Send');
  String get slotRequiredMsg => _get('slotRequiredMsg', 'Please select a time slot to continue');
  String get dateRequiredMsg => _get('dateRequiredMsg', 'Please select a consultation date');

  // Base localized dictionary
  static final Map<String, Map<String, String>> _localizedValues = {
    'en': {
      'tabHome': 'Home',
      'tabAppointments': 'Appointments',
      'tabCare': 'Care',
      'tabRecords': 'Records',
      'tabProfile': 'Profile',
      'tagline': 'Bridging People to Better Healthcare',
      'continueBtn': 'Continue',
      'nextBtn': 'Next',
      'backBtn': 'Back',
      'skipBtn': 'Skip',
      'getStartedBtn': 'Get Started',
      'cancelBtn': 'Cancel',
      'logoutBtn': 'Log out',
      'loginTitle': 'Welcome back',
      'loginSubtitle': 'Enter your mobile number',
      'mobileNumberLabel': 'Mobile number',
      'loginPrivacyNote': "We'll use your mobile number to securely verify your identity.",
      'otpTitle': 'Verify your mobile number',
      'otpSubtitle': "We've sent a 6-digit verification code to",
      'verifyBtn': 'Verify',
      'resendOtpBtn': 'Resend OTP',
      'changeMobileBtn': 'Change mobile number',
      'profileSetupTitle': 'Set up your profile',
      'profileSetupSubtitle': "Let's personalize CareBridge for you.",
      'fullNameLabel': 'Full name',
      'preferredLanguageLabel': 'Preferred language',
      'dobLabel': 'Date of birth (Optional)',
      'genderLabel': 'Gender (Optional)',
      'consentLabel':
          'I understand and agree to continue. CareBridge will use this information solely to personalize healthcare services.',
      'logoutConfirmTitle': 'Log out?',
      'logoutConfirmMessage': 'Are you sure you want to log out of CareBridge?',
      'greetingMorning': 'Good morning',
      'greetingAfternoon': 'Good afternoon',
      'greetingEvening': 'Good evening',
      'greetingFallback': 'Hello',
      'homeGreetingSubtitle': 'How can we help you today?',
      'healthStatusTitle': 'Your Health Status',
      'healthStatusCheck': 'Health Check Status',
      'healthStatusDoingWell': "You're doing well • Keep following your health routine.",
      'healthStatusUpdatedToday': 'Last updated: Today',
      'quickActionsTitle': 'Quick Actions',
      'quickActionBookDoctor': 'Book Doctor',
      'quickActionTalkDoctor': 'Talk to Doctor',
      'quickActionFindHospital': 'Find Hospital',
      'quickActionEmergency': 'Emergency',
      'emergencyAssistanceTitle': 'Emergency Assistance',
      'emergencyAssistanceMsg':
          'If this is a medical emergency, call 108 or seek immediate medical assistance.',
      'call108Btn': 'Call 108',
      'upcomingAppointmentTitle': 'Upcoming Appointment',
      'noUpcomingAppointments': 'No upcoming appointments',
      'bookConsultationPrompt': 'Book a consultation when you need care.',
      'viewAppointmentBtn': 'View Appointment',
      'viewAllBtn': 'View all',
      'referralTitle': 'Referral Status',
      'noActiveReferrals': 'No active referrals',
      'viewReferralBtn': 'View Referral',
      'healthAlertsTitle': 'Health Alerts',
      'noHealthAlerts': 'No active health alerts',
      'medicineAvailabilityTitle': 'Medicine Availability',
      'viewMedicinesBtn': 'View Medicines',
      'noMedicinesAvailable': 'No medicine records available',
      'nearbyHealthCampsTitle': 'Nearby Health Camps',
      'noHealthCamps': 'No health camps scheduled nearby',
      'assistantCardTitle': 'CareBridge Assistant',
      'assistantCardSubtitle': 'Have a question about healthcare?',
      'askAssistantBtn': 'Ask CareBridge',
      'assistantSoonMsg': 'The healthcare assistant will be available soon.',
      'openAssistantSemantic': 'Open CareBridge Assistant',
      'doctorConsultationSoonMsg': 'Doctor consultation will be available soon.',
      'needEmergencyHelpTitle': 'Need Emergency Help?',
      'emergencyHelpSubtitle': 'For serious emergencies, seek immediate medical attention.',
      'notificationsTitle': 'Notifications',
      'noNotifications': 'No new notifications at this time.',
      'markAllRead': 'Mark all as read',
      'recordsTitle': 'Health Records',
      'recordsSubtitle': 'Your health information in one place',
      'recordsSummaryTitle': 'Records Summary',
      'allRecords': 'All',
      'categoryMedicalRecords': 'Medical Records',
      'categoryLabReports': 'Lab Reports',
      'categoryPrescriptions': 'Prescriptions',
      'categoryVaccinations': 'Vaccinations',
      'categoryOtherDocuments': 'Other Documents',
      'recentRecordsTitle': 'Recent Records',
      'searchRecordsHint': 'Search by title, hospital, doctor...',
      'noHealthRecordsYet': 'No health records yet',
      'noHealthRecordsDesc':
          'Your medical consultations, lab reports, and prescriptions will appear here.',
      'noRecordsFound': 'No records found',
      'tryDifferentSearch': 'Try a different search term or category filter.',
      'emptyCategoryRecords': 'No records available in this category',
      'recordDetailsTitle': 'Record Details',
      'viewDetailsBtn': 'View Details',
      'facilityLabel': 'Healthcare Facility',
      'doctorLabel': 'Doctor / Provider',
      'dateLabel': 'Date',
      'recordTypeLabel': 'Record Type',
      'clinicalSummaryTitle': 'Summary',
      'structuredDetailsTitle': 'Test Results & Observations',
      'documentPreviewTitle': 'Document Preview',
      'documentPreviewPlaceholder':
          'This health document will be available here in a future version.',
      'downloadBtn': 'Download',
      'shareBtn': 'Share',
      'printBtn': 'Print',
      'featureAvailableFutureMsg':
          'This feature will be available in a future version.',
      'nonDiagnosticDisclaimer':
          'Demonstration data for informational record-keeping only. Not a medical diagnosis or clinical prescription.',
      'abhaConnectTitle': 'Connect with your\nABHA Card',
      'abhaConnectSubtitle':
          'Connect your existing ABHA account to securely access your healthcare information.',
      'abhaWhatIsIt':
          'ABHA (Ayushman Bharat Health Account) is your unique digital health ID that links all your medical records securely.',
      'abhaConnectBtn': 'Connect with ABHA',
      'abhaCreateBtn': 'Create your ABHA Card',
      'abhaPrototypeDisclaimer':
          'ABHA integration will securely connect your health information in the full version of CareBridge.',
      'selectProfile': 'Select Profile',
      'noAbhaProfileFound': 'No ABHA Profile Found',
      'createAbhaCard': 'Create Your ABHA Card',
      'abhaRegistration': 'ABHA Registration',
      'patientProfile': 'Patient Profile',
      'retryBtn': 'Retry',
      'somethingWentWrong': 'Something went wrong. Please check your connection and try again.',
      'abhaProfilesFound': 'ABHA Profiles Found',
      'checkingAbhaRecords': 'Checking ABHA Records',
      'searchingAbhaProfiles': 'Searching for ABHA profiles linked to your registered mobile number...',
      'connectSelectedProfile': 'Connect Selected Profile',
      'governmentHospitals': 'Government Hospitals',
      'privateHospitals': 'Private Hospitals',
      'overallHospitals': 'Overall Hospitals',
      'filterGovernment': 'Government',
      'filterPrivate': 'Private',
      'filterOverall': 'Overall',
      'emergency108Title': '108 Emergency Service',
      'emergency108Subtitle': 'Immediate ambulance assistance',
      'teleconsultationAudioTitle': 'Teleconsultation (Audio)',
      'teleconsultationAudioSubtitle': 'Talk to a doctor by voice',
      'calling108Msg': 'Initiating emergency 108 ambulance call...',
      'connectingAudioConsultation': 'Connecting to audio teleconsultation...',
      'selectSpecialization': 'Select Specialization',
      'allSpecializations': 'All Specializations',
      'hospitalTypeLabel': 'Hospital Type',
      'noDoctorsFound': 'No Doctors Found',
      'tryDifferentDoctorFilter': 'Try selecting a different hospital type or specialization.',
      'bookAppointmentAction': 'Book Appointment',
      'addManualLabReportBtn': '+ Add Manual Lab Report',
      'uploadDocumentBtn': 'Upload Document',
      'replaceDocumentBtn': 'Replace',
      'removeDocumentBtn': 'Remove',
      'noDocumentSelected': 'No document selected',
      'attachedDocumentLabel': 'Attached Document',
      'fileNotSupported': 'File type not supported. Please upload a PDF, JPG, or PNG.',
      'fileTooLarge': 'File is too large. Maximum size is 10 MB.',
      'documentSelectedMsg': 'Document selected successfully',
      'doctorDetailsTitle': 'Doctor Details',
      'qualificationLabel': 'Qualification',
      'experienceLabel': 'Experience',
      'experienceYears': 'years experience',
      'availabilityLabel': 'Availability',
      'doctorAvailable': 'Available',
      'doctorOnLeave': 'On Leave',
      'testCategoryLabel': 'Test Category',
      'testCategoryHint': 'e.g. Pathology, Biochemistry, Radiology',
      'myAbhaCardTitle': 'My Health ID / ABHA',
      'myAbhaCardSubtitle': 'My Health ID / My ABHA Card',
      'myAbhaCard': 'My ABHA Card',
      'myHealthId': 'My Health ID',
      'qrCode': 'QR Code',
      'scanQrPrompt': 'Scan this QR code at hospital counters for instant registration',
      'emergencyContactsTitle': 'Emergency Contacts',
      'emergencyContactsSubtitle': 'Add and manage emergency contacts',
      'noEmergencyContacts': 'No emergency contacts added.',
      'addEmergencyContactBtn': '+ Add Emergency Contact',
      'editContactBtn': 'Edit',
      'deleteContactBtn': 'Delete',
      'contactNameLabel': 'Contact Name',
      'relationshipLabel': 'Relationship',
      'mobileNumberFieldLabel': 'Mobile Number',
      'saveContactBtn': 'Save Contact',
      'contactNameRequired': 'Contact name is required',
      'validMobileRequired': 'Please enter a valid 10-digit mobile number',
      'confirmDeleteTitle': 'Delete Contact?',
      'confirmDeleteMsg': 'Are you sure you want to remove this emergency contact?',
      'languageSettingsTitle': 'Language',
      'tamilLang': 'Tamil',
      'englishLang': 'English',
      'opdCardTitle': 'OPD Card',
      'opdCardSubtitle': 'Digital Outpatient Department registration card',
      'downloadOpdCardBtn': 'Download OPD Card',
      'downloadingOpdCard': 'Generating and downloading OPD Card PDF...',
      'opdCardDownloaded': 'OPD Card downloaded successfully',
      'opdNumberLabel': 'OPD No',
      'patientIdLabel': 'Patient ID',
      'patientNameLabel': 'Patient Name',
      'registrationDateLabel': 'Registration Date',
      'medicalTitle': 'Medical',
      'medicalSubtitle': 'Nearby medical stores and pharmacies',
      'nearbyMedicalStores': 'Nearby Medical Stores',
      'open24x7': 'Open 24x7',
      'orderMedicinesBtn': 'Order Medicines',
      'orderMedicinesSubtitle': 'Order prescribed medicines from this record',
      'selectMedicinesTitle': 'Select Medicines',
      'reviewOrderTitle': 'Order Summary',
      'confirmOrderBtn': 'Confirm Order',
      'orderSuccessTitle': 'Order Placed Successfully',
      'orderSuccessSubtitle': 'Your medicine order has been received.',
      'orderIdLabel': 'Order ID',
      'medicinesCountLabel': 'Medicines',
      'pickupFacilityLabel': 'Pickup / Delivery Facility',
      'backToRecordsBtn': 'Back to Records',
      'teleconsultationTitle': 'Teleconsultation',
      'teleconsultationSubtitle': 'Consult with qualified government & private doctors remotely',
      'searchDoctorHint': 'Search doctor by name or specialty...',
      'filterSpecialization': 'Specialization',
      'filterAvailability': 'Availability',
      'availableNow': 'Available Now',
      'allAvailability': 'All Doctors',
      'bookTeleconsultationBtn': 'Book Consultation',
      'consultationTypeTitle': 'Consultation Type',
      'consultationTypeVideo': 'Video Call',
      'consultationTypeAudio': 'Audio Call',
      'consultationTypeChat': 'Chat',
      'consultationTypeVideoDesc': 'Face-to-face video consultation with your doctor',
      'consultationTypeAudioDesc': 'Direct voice consultation with your doctor',
      'consultationTypeChatDesc': 'Text messaging consultation with your doctor',
      'selectDateTitle': 'Select Date',
      'selectTimeSlotTitle': 'Select Time Slot',
      'noSlotsAvailable': 'No time slots available for this date.',
      'consultationSummaryTitle': 'Consultation Summary',
      'consultationDetailsSection': 'Consultation Details',
      'patientDetailsSection': 'Patient Details',
      'confirmAndScheduleBtn': 'Confirm & Schedule Consultation',
      'consultationScheduledTitle': 'Consultation Scheduled!',
      'consultationScheduledSubtitle': 'Your remote consultation has been successfully booked.',
      'consultationIdLabel': 'Consultation ID',
      'addToAppointmentsBtn': 'Add to Appointments',
      'doneBtn': 'Done',
      'teleconsultationBadge': 'Teleconsultation',
      'joinConsultationBtn': 'Join Consultation',
      'prototypeConsultationNotice': 'Prototype Teleconsultation Simulation',
      'connectingToDoctor': 'Connecting to doctor...',
      'consultationConnected': 'Connected',
      'muteMic': 'Mute',
      'unmuteMic': 'Unmute',
      'cameraOn': 'Turn Off Video',
      'cameraOff': 'Turn On Video',
      'switchCamera': 'Flip Camera',
      'endConsultationBtn': 'End Consultation',
      'consultationEndedTitle': 'Consultation Ended',
      'callDurationLabel': 'Call Duration',
      'returnToHomeBtn': 'Return to Home',
      'viewSummaryBtn': 'View Summary',
      'chatInputHint': 'Type a message to doctor...',
      'sendBtn': 'Send',
      'slotRequiredMsg': 'Please select a time slot to continue',
      'dateRequiredMsg': 'Please select a consultation date',
    },
    'ta': {
      'tabHome': 'முகப்பு',
      'tabAppointments': 'பதிவுகள்',
      'tabCare': 'சிகிச்சை',
      'tabRecords': 'ஆவணங்கள்',
      'tabProfile': 'சுயவிவரம்',
      'tagline': 'மக்களை சிறந்த சுகாதாரத்துடன் இணைத்தல்',
      'continueBtn': 'தொடரவும்',
      'nextBtn': 'அடுத்து',
      'backBtn': 'பின்செல்',
      'skipBtn': 'தவிர்',
      'getStartedBtn': 'தொடங்குங்கள்',
      'cancelBtn': 'ரத்து செய்',
      'logoutBtn': 'வெளியேறு',
      'loginTitle': 'மீண்டும் வருக',
      'loginSubtitle': 'உங்கள் கைபேசி எண்ணை உள்ளிடவும்',
      'mobileNumberLabel': 'கைபேசி எண்',
      'loginPrivacyNote': 'உங்கள் அடையாளத்தை சரிபார்க்க மட்டுமே கைபேசி எண் பயன்படுத்தப்படும்.',
      'otpTitle': 'கைபேசி எண்ணை சரிபார்க்கவும்',
      'otpSubtitle': '6 இலக்க சரிபார்ப்புக் குறியீடு அனுப்பப்பட்டுள்ளது:',
      'verifyBtn': 'சரிபார்',
      'resendOtpBtn': 'மீண்டும் அனுப்பு',
      'changeMobileBtn': 'எண்ணை மாற்றுக',
      'profileSetupTitle': 'சுயவிவரத்தை அமைக்கவும்',
      'profileSetupSubtitle': 'உங்களுக்கான சேவைகளை தனிப்பயனாக்குங்கள்.',
      'fullNameLabel': 'முழுப் பெயர்',
      'preferredLanguageLabel': 'விருப்ப மொழி',
      'dobLabel': 'பிறந்த தேதி (விருப்பத்தேர்வு)',
      'genderLabel': 'பாலினம் (விருப்பத்தேர்வு)',
      'consentLabel':
          'நான் புரிந்து கொண்டு தொடர ஒப்புக்கொள்கிறேன். சுகாதார சேவைகளை வழங்க மட்டுமே இந்த தகவல் பயன்படுத்தப்படும்.',
      'logoutConfirmTitle': 'வெளியேறவா?',
      'logoutConfirmMessage': 'CareBridge பயன்பாட்டிலிருந்து வெளியேற உறுதியாக இருக்கிறீர்களா?',
      'greetingMorning': 'காலை வணக்கம்',
      'greetingAfternoon': 'மதிய வணக்கம்',
      'greetingEvening': 'மாலை வணக்கம்',
      'greetingFallback': 'வணக்கம்',
      'homeGreetingSubtitle': 'இன்று நாங்கள் உங்களுக்கு எவ்வாறு உதவலாம்?',
      'healthStatusTitle': 'உங்கள் சுகாதார நிலை',
      'healthStatusCheck': 'சுகாதார பரிசோதனை நிலை',
      'healthStatusDoingWell': 'நீங்கள் நலமாக உள்ளீர்கள் • சுகாதார வழக்கத்தை தொடருங்கள்.',
      'healthStatusUpdatedToday': 'கடைசியாக புதுப்பிக்கப்பட்டது: இன்று',
      'quickActionsTitle': 'விரைவு நடவடிக்கைகள்',
      'quickActionBookDoctor': 'மருத்துவர் பதிவு',
      'quickActionTalkDoctor': 'மருத்துவரிடம் பேசுங்கள்',
      'quickActionFindHospital': 'மருத்துவமனை காண்க',
      'quickActionEmergency': 'அவசரம்',
      'emergencyAssistanceTitle': 'அவசர உதவி',
      'emergencyAssistanceMsg':
          'இது மருத்துவ அவசரநிலை என்றால், 108 ஐ அழைக்கவும் அல்லது உடனடி மருத்துவ உதவியை நாடவும்.',
      'call108Btn': '108 ஐ அழைக்கவும்',
      'upcomingAppointmentTitle': 'வரவிருக்கும் மருத்துவ சந்திப்பு',
      'noUpcomingAppointments': 'வரவிருக்கும் சந்திப்புகள் எதுவும் இல்லை',
      'bookConsultationPrompt': 'உங்களுக்கு சிகிச்சை தேவைப்படும்போது முன்பதிவு செய்யுங்கள்.',
      'viewAppointmentBtn': 'சந்திப்பைக் காண்க',
      'viewAllBtn': 'அனைத்தையும் காண்க',
      'referralTitle': 'பரிந்துரை நிலை',
      'noActiveReferrals': 'செயலில் உள்ள பரிந்துரைகள் எதுவும் இல்லை',
      'viewReferralBtn': 'பரிந்துரையைக் காண்க',
      'healthAlertsTitle': 'சுகாதார எச்சரிக்கைகள்',
      'noHealthAlerts': 'செயலில் உள்ள எச்சரிக்கைகள் இல்லை',
      'medicineAvailabilityTitle': 'மருந்து இருப்பு',
      'viewMedicinesBtn': 'மருந்துகளைக் காண்க',
      'noMedicinesAvailable': 'மருந்து தகவல்கள் இல்லை',
      'nearbyHealthCampsTitle': 'அருகிலுள்ள மருத்துவ முகாம்கள்',
      'noHealthCamps': 'அருகில் எந்த மருத்துவ முகாம்களும் இல்லை',
      'assistantCardTitle': 'CareBridge உதவியாளர்',
      'assistantCardSubtitle': 'சுகாதாரம் பற்றி கேள்வி உள்ளதா?',
      'askAssistantBtn': 'கேர்பிரிட்ஜிடம் கேளுங்கள்',
      'assistantSoonMsg': 'சுகாதார உதவியாளர் விரைவில் கிடைக்கும்.',
      'openAssistantSemantic': 'கேர்பிரிட்ஜ் உதவியாளரைத் திறக்கவும்',
      'doctorConsultationSoonMsg': 'மருத்துவர் ஆலோசனை விரைவில் கிடைக்கும்.',
      'needEmergencyHelpTitle': 'அவசர உதவி தேவையா?',
      'emergencyHelpSubtitle': 'தீவிர அவசரநிலைகளுக்கு, உடனடி மருத்துவ சிகிச்சையை நாடுங்கள்.',
      'notificationsTitle': 'அறிவிப்புகள்',
      'noNotifications': 'தற்போது புதிய அறிவிப்புகள் எதுவும் இல்லை.',
      'markAllRead': 'அனைத்தையும் படித்ததாகக் குறிக்கவும்',
      'recordsTitle': 'சுகாதார ஆவணங்கள்',
      'recordsSubtitle': 'உங்கள் சுகாதார தகவல்கள் அனைத்தும் ஒரே இடத்தில்',
      'recordsSummaryTitle': 'ஆவணங்களின் சுருக்கம்',
      'allRecords': 'அனைத்தும்',
      'categoryMedicalRecords': 'மருத்துவ ஆவணங்கள்',
      'categoryLabReports': 'பரிசோதனை அறிக்கைகள்',
      'categoryPrescriptions': 'மருந்து சீட்டுகள்',
      'categoryVaccinations': 'தடுப்பூசிகள்',
      'categoryOtherDocuments': 'பிற ஆவணங்கள்',
      'recentRecordsTitle': 'சமீபத்திய ஆவணங்கள்',
      'searchRecordsHint': 'ஆவணம், மருத்துவமனை அல்லது மருத்துவர் பெயரைத் தேடுக...',
      'noHealthRecordsYet': 'சுகாதார ஆவணங்கள் எதுவும் இல்லை',
      'noHealthRecordsDesc':
          'உங்கள் மருத்துவ ஆலோசனைகள், பரிசோதனை அறிக்கைகள் மற்றும் மருந்து சீட்டுகள் இங்கு தோன்றும்.',
      'noRecordsFound': 'ஆவணங்கள் எதுவும் கிடைக்கவில்லை',
      'tryDifferentSearch': 'வேறு தேடல் சொல் அல்லது வகையைத் தேர்ந்தெடுக்கவும்.',
      'emptyCategoryRecords': 'இந்த பிரிவில் ஆவணங்கள் எதுவும் இல்லை',
      'recordDetailsTitle': 'ஆவண விவரங்கள்',
      'viewDetailsBtn': 'விவரங்களைக் காண்க',
      'facilityLabel': 'சுகாதார மையம்',
      'doctorLabel': 'மருத்துவர்',
      'dateLabel': 'தேதி',
      'recordTypeLabel': 'ஆவண வகை',
      'clinicalSummaryTitle': 'சுருக்கம்',
      'structuredDetailsTitle': 'பரிசோதனை முடிவுகள்',
      'documentPreviewTitle': 'ஆவண முன்னோட்டம்',
      'documentPreviewPlaceholder':
          'இந்த சுகாதார ஆவணம் எதிர்கால பதிப்பில் இங்கு கிடைக்கும்.',
      'downloadBtn': 'பதிவிறக்கு',
      'shareBtn': 'பகிர்',
      'printBtn': 'அச்சிடு',
      'featureAvailableFutureMsg': 'இந்த வசதி எதிர்கால பதிப்பில் கிடைக்கும்.',
      'nonDiagnosticDisclaimer':
          'தகவல் பதிவிற்கான மாதிரித் தரவு மட்டுமே. மருத்துவக் கண்டறிதல் அல்லது சிகிச்சை அல்ல.',
      'abhaConnectTitle': 'உங்கள் ABHA கார்டுடன்\nஇணைக்கவும்',
      'abhaConnectSubtitle':
          'உங்கள் சுகாதார தகவல்களை பாதுகாப்பாக அணுக ABHA கணக்கை இணைக்கவும்.',
      'abhaWhatIsIt':
          'ABHA என்பது உங்கள் தனிப்பட்ட டிஜிட்டல் சுகாதார அடையாளம் ஆகும், இது உங்கள் மருத்துவ பதிவுகளை பாதுகாப்பாக இணைக்கிறது.',
      'abhaConnectBtn': 'ABHA உடன் இணைக்கவும்',
      'abhaCreateBtn': 'உங்கள் ABHA கார்டை உருவாக்கவும்',
      'abhaPrototypeDisclaimer':
          'CareBridge இன் முழுமையான பதிப்பில் ABHA உங்கள் சுகாதார தகவல்களை பாதுகாப்பாக இணைக்கும்.',
      'recordCategoriesTitle': 'ஆவணப் பிரிவுகள்',
      'manualEntryBtn': 'கையேடு பதிவு',
      'addLabReport': 'பரிசோதனை அறிக்கை சேர்க்க',
      'manualEntrySubtitle': 'உங்கள் பதிவில் சேமிக்க பரிசோதனை மதிப்புகளை கைமுறையாக உள்ளிடவும்',
      'reportTitleLabel': 'அறிக்கை தலைப்பு',
      'reportTitleHint': 'எ.கா. ரத்த சர்க்கரை, லிபிட் பரிசோதனை',
      'facilityHint': 'எ.கா. ஆரம்ப சுகாதார நிலையம்',
      'doctorHint': 'எ.கா. டாக்டர் கே. சர்மா',
      'clinicalSummaryHint': 'பரிசோதனையின் சுருக்கம் அல்லது குறிப்புகள்',
      'testResultLabel': 'முக்கிய பரிசோதனை முடிவு (விருப்பத்தேர்வு)',
      'testResultHint': 'எ.கா. 110 mg/dL',
      'titleRequired': 'அறிக்கை தலைப்பை உள்ளிடவும்',
      'facilityRequired': 'சுகாதார மையத்தின் பெயரை உள்ளிடவும்',
      'saveRecordBtn': 'பதிவைச் சேமிக்கவும்',
      'manuallyEnteredBadge': 'கைமுறையாக பதிவிடப்பட்டது',
      'searchResultsTitle': 'தேடல் முடிவுகள்',
      'showAllRecords': 'அனைத்து ஆவணங்களையும் காட்டு',
      'publicHealthServicesTitle': 'பொது சுகாதார சேவைகள்',
      'publicHealthServicesSubtitle': 'அருகிலுள்ள அரசு மருத்துவமனைகள் மற்றும் ஆரம்ப சுகாதார நிலையங்களைக் கண்டறியவும்',
      'hospitalsTitle': 'மருத்துவமனைகள்',
      'hospitalsSubtitle': 'மாவட்ட தலைமை மற்றும் சிறப்பு அரசு மருத்துவமனைகள்',
      'phcsTitle': 'ஆரம்ப சுகாதார நிலையங்கள் (PHC)',
      'phcsSubtitle': 'கிராமப்புற மற்றும் நகர்ப்புற ஆரம்ப சுகாதார நிலையங்கள்',
      'findDoctorTitle': 'மருத்துவரைத் தேடுக',
      'findDoctorSubtitle': 'சிறப்பு மற்றும் பொது மருத்துவர்கள்',
      'emergencyServicesTitle': 'அவசர கால சேவைகள்',
      'emergencyServicesSubtitle': '108 ஆம்புலன்ஸ் சேவை',
      'filterDistrict': 'மாவட்டம்',
      'filterCity': 'நகரம்',
      'filterNearby': 'அருகில்',
      'selectDistrict': 'மாவட்டத்தைத் தேர்ந்தெடுக்கவும்',
      'selectCity': 'நகரத்தைத் தேர்ந்தெடுக்கவும்',
      'allDistricts': 'அனைத்து மாவட்டங்களும்',
      'allCities': 'அனைத்து நகரங்களும்',
      'noFacilitiesFound': 'சுகாதார மையங்கள் எதுவும் கிடைக்கவில்லை',
      'tryDifferentFilter': 'வேறு மாவட்டம் அல்லது நகரத்தைத் தேர்ந்தெடுத்து முயற்சிக்கவும்.',
      'locationRequiredMsg': 'அருகிலுள்ள மையங்களைக் கண்டறிய இருப்பிட அனுமதி தேவை.',
      'enableLocationBtn': 'இருப்பிடத்தை இயக்கு',
      'getDirectionsBtn': 'திசைகளைப் பெறுக',
      'openInGoogleMaps': 'கூகிள் மேப்ஸில் திறக்கவும்',
      'mapsLaunchFailed': 'வரைபடப் பயன்பாட்டைத் திறக்க முடியவில்லை',
      'servicesOfferedTitle': 'வழங்கப்படும் சேவைகள்',
      'selectProfile': 'சுயவிவரத்தைத் தேர்ந்தெடுக்கவும்',
      'noAbhaProfileFound': 'ABHA சுயவிவரம் எதுவும் கிடைக்கவில்லை',
      'createAbhaCard': 'ABHA அட்டை உருவாக்கவும்',
      'abhaRegistration': 'ABHA பதிவு',
      'patientProfile': 'நோயாளி சுயவிவரம்',
      'retryBtn': 'மீண்டும் முயற்சிக்கவும்',
      'somethingWentWrong': 'ஏதோ தவறு நடந்துவிட்டது. மீண்டும் முயற்சிக்கவும்.',
      'abhaProfilesFound': 'ABHA சுயவிவரங்கள் கண்டறியப்பட்டன',
      'checkingAbhaRecords': 'ABHA பதிவுகளை சரிபார்க்கிறது',
      'searchingAbhaProfiles': 'பதிவுசெய்யப்பட்ட கைபேசி எண்ணுடன் இணைக்கப்பட்ட ABHA சுயவிவரங்களைத் தேடுகிறது...',
      'connectSelectedProfile': 'தேர்ந்தெடுக்கப்பட்ட சுயவிவரத்தை இணைக்கவும்',
      'governmentHospitals': 'அரசு மருத்துவமனைகள்',
      'privateHospitals': 'தனியார் மருத்துவமனைகள்',
      'overallHospitals': 'அனைத்து மருத்துவமனைகள்',
      'filterGovernment': 'அரசு',
      'filterPrivate': 'தனியார்',
      'filterOverall': 'அனைத்தும்',
      'emergency108Title': '108 அவசர சேவை',
      'emergency108Subtitle': 'உடனடி ஆம்புலன்ஸ் உதவி',
      'teleconsultationAudioTitle': 'தொலைமருத்துவம் (ஆடியோ)',
      'teleconsultationAudioSubtitle': 'குரல் மூலம் மருத்துவரிடம் பேசுங்கள்',
      'calling108Msg': '108 ஆம்புலன்ஸ் அவசர அழைப்பு தொடங்குகிறது...',
      'connectingAudioConsultation': 'ஆடியோ தொலைமருத்துவத்துடன் இணைகிறது...',
      'selectSpecialization': 'சிறப்புப் பிரிவைத் தேர்ந்தெடுக்கவும்',
      'allSpecializations': 'அனைத்து சிறப்புப் பிரிவுகளும்',
      'hospitalTypeLabel': 'மருத்துவமனை வகை',
      'noDoctorsFound': 'மருத்துவர்கள் எவரும் இல்லை',
      'tryDifferentDoctorFilter': 'வேறு மருத்துவமனை வகை அல்லது சிறப்புப் பிரிவைத் தேர்ந்தெடுக்கவும்.',
      'bookAppointmentAction': 'முன்பதிவு செய்',
      'addManualLabReportBtn': '+ கைமுறையாக ஆய்வக அறிக்கை சேர்க்கவும்',
      'uploadDocumentBtn': 'ஆவணத்தை பதிவேற்றவும்',
      'replaceDocumentBtn': 'மாற்றவும்',
      'removeDocumentBtn': 'நீக்கவும்',
      'noDocumentSelected': 'ஆவணம் எதுவும் தேர்ந்தெடுக்கப்படவில்லை',
      'attachedDocumentLabel': 'இணைக்கப்பட்ட ஆவணம்',
      'fileNotSupported': 'கோப்பு வகை ஆதரிக்கப்படவில்லை. PDF, JPG, அல்லது PNG பதிவேற்றவும்.',
      'fileTooLarge': 'கோப்பு மிகவும் பெரியது. அதிகபட்ச அளவு 10 MB.',
      'documentSelectedMsg': 'ஆவணம் வெற்றிகரமாக தேர்ந்தெடுக்கப்பட்டது',
      'doctorDetailsTitle': 'மருத்துவர் விவரங்கள்',
      'qualificationLabel': 'தகுதி',
      'experienceLabel': 'அனுபவம்',
      'experienceYears': 'ஆண்டுகள் அனுபவம்',
      'availabilityLabel': 'இருப்பு நிலை',
      'doctorAvailable': 'இருக்கிறார்',
      'doctorOnLeave': 'விடுப்பில்',
      'testCategoryLabel': 'பரிசோதனை பிரிவு',
      'testCategoryHint': 'எ.கா. நோயியல், உயிர்வேதியியல்',
      'myAbhaCardTitle': 'என் சுகாதார ஐடி / ஆபா',
      'myAbhaCardSubtitle': 'என் சுகாதார ஐடி / என் ஆபா கார்டு',
      'myAbhaCard': 'என் ஆபா கார்டு',
      'myHealthId': 'என் சுகாதார ஐடி',
      'qrCode': 'க்யூஆர் குறியீடு',
      'scanQrPrompt': 'உடனடி பதிவுக்கு மருத்துவமனை கவுண்ட்டரில் இந்த க்யூஆர் குறியீட்டை ஸ்கேன் செய்யவும்',
      'emergencyContactsTitle': 'அவசர தொடர்புகள்',
      'emergencyContactsSubtitle': 'அவசர தொடர்புகளை சேர்க்கவும் மற்றும் நிர்வகிக்கவும்',
      'noEmergencyContacts': 'அவசர தொடர்புகள் எதுவும் சேர்க்கப்படவில்லை.',
      'addEmergencyContactBtn': '+ அவசர தொடர்பைச் சேர்',
      'editContactBtn': 'திருத்து',
      'deleteContactBtn': 'நீக்கு',
      'contactNameLabel': 'தொடர்பு பெயர்',
      'relationshipLabel': 'உறவுமுறை',
      'mobileNumberFieldLabel': 'கைபேசி எண்',
      'saveContactBtn': 'தொடர்பை சேமி',
      'contactNameRequired': 'தொடர்பு பெயர் தேவை',
      'validMobileRequired': 'சரியான 10 இலக்க கைபேசி எண்ணை உள்ளிடவும்',
      'confirmDeleteTitle': 'தொடர்பை நீக்கவா?',
      'confirmDeleteMsg': 'இந்த அவசர தொடர்பை நிச்சயமாக நீக்க விரும்புகிறீர்களா?',
      'languageSettingsTitle': 'மொழி',
      'tamilLang': 'தமிழ்',
      'englishLang': 'ஆங்கிலம்',
      'opdCardTitle': 'வெளிநோயாளி அட்டை (OPD Card)',
      'opdCardSubtitle': 'டிஜிட்டல் வெளிநோயாளி பிரிவு பதிவு அட்டை',
      'downloadOpdCardBtn': 'OPD அட்டையைப் பதிவிறக்குக',
      'downloadingOpdCard': 'OPD அட்டை PDF உருவாக்கப்பட்டு பதிவிறக்கப்படுகிறது...',
      'opdCardDownloaded': 'OPD அட்டை வெற்றிகரமாக பதிவிறக்கப்பட்டது',
      'opdNumberLabel': 'ஓபிடி எண்',
      'patientIdLabel': 'நோயாளி ஐடி',
      'patientNameLabel': 'நோயாளி பெயர்',
      'registrationDateLabel': 'பதிவு தேதி',
      'medicalTitle': 'மருந்தகம்',
      'medicalSubtitle': 'அருகிலுள்ள மருந்தகங்கள் மற்றும் மருந்துக் கடைகள்',
      'nearbyMedicalStores': 'அருகிலுள்ள மருந்துக் கடைகள்',
      'open24x7': '24x7 இயங்கும்',
      'orderMedicinesBtn': 'மருந்துகளை ஆர்டர் செய்',
      'orderMedicinesSubtitle': 'இந்த மருந்துச் சீட்டிலிருந்து மருந்துகளை ஆர்டர் செய்யவும்',
      'selectMedicinesTitle': 'மருந்துகளைத் தேர்ந்தெடுக்கவும்',
      'reviewOrderTitle': 'ஆர்டர் சுருக்கம்',
      'confirmOrderBtn': 'ஆர்டரை உறுதிப்படுத்து',
      'orderSuccessTitle': 'ஆர்டர் வெற்றிகரமாக பதிவு செய்யப்பட்டது',
      'orderSuccessSubtitle': 'உங்கள் மருந்து ஆர்டர் பெறப்பட்டது.',
      'orderIdLabel': 'ஆர்டர் ஐடி',
      'medicinesCountLabel': 'மருந்துகள்',
      'pickupFacilityLabel': 'பெறும் / டெலிவரி நிலையம்',
      'backToRecordsBtn': 'ஆவணங்களுக்குத் திரும்பு',
      'teleconsultationTitle': 'தொலைதூர மருத்துவ ஆலோசனை',
      'teleconsultationSubtitle': 'அரசு மற்றும் தனியார் மருத்துவர்களுடன் தொலைதூரத்தில் ஆலோசிக்கவும்',
      'searchDoctorHint': 'மருத்துவர் பெயர் அல்லது துறையைத் தேடுக...',
      'filterSpecialization': 'மருத்துவத் துறை',
      'filterAvailability': 'கிடைக்கும் தன்மை',
      'availableNow': 'தற்போது கிடைக்கும்',
      'allAvailability': 'அனைத்து மருத்துவர்கள்',
      'bookTeleconsultationBtn': 'ஆலோசனை முன்பதிவு',
      'consultationTypeTitle': 'ஆலோசனை வகை',
      'consultationTypeVideo': 'வீடியோ அழைப்பு',
      'consultationTypeAudio': 'ஆடியோ அழைப்பு',
      'consultationTypeChat': 'உரையாடல் (Chat)',
      'consultationTypeVideoDesc': 'மருத்துவருடன் நேரடி வீடியோ ஆலோசனை',
      'consultationTypeAudioDesc': 'மருத்துவருடன் நேரடி குரல் அழைப்பு ஆலோசனை',
      'consultationTypeChatDesc': 'மருத்துவருடன் குறுஞ்செய்தி உரையாடல்',
      'selectDateTitle': 'தேதியைத் தேர்ந்தெடுக்கவும்',
      'selectTimeSlotTitle': 'நேர இடைவெளியைத் தேர்ந்தெடுக்கவும்',
      'noSlotsAvailable': 'இந்த தேதியில் நேர இடைவெளிகள் கிடைக்கவில்லை.',
      'consultationSummaryTitle': 'ஆலோசனை சுருக்கம்',
      'consultationDetailsSection': 'ஆலோசனை விவரங்கள்',
      'patientDetailsSection': 'நோயாளி விவரங்கள்',
      'confirmAndScheduleBtn': 'உறுதிசெய்து முன்பதிவு செய்க',
      'consultationScheduledTitle': 'ஆலோசனை பதிவு செய்யப்பட்டது!',
      'consultationScheduledSubtitle': 'உங்கள் தொலைதூர ஆலோசனை வெற்றிகரமாக முன்பதிவு செய்யப்பட்டது.',
      'consultationIdLabel': 'ஆலோசனை ஐடி',
      'addToAppointmentsBtn': 'சந்திப்புகளில் சேர்க்கவும்',
      'doneBtn': 'முடிந்தது',
      'teleconsultationBadge': 'தொலைதூர ஆலோசனை',
      'joinConsultationBtn': 'ஆலோசனையில் இணைக',
      'prototypeConsultationNotice': 'மாதிரி தொலைதூர மருத்துவ உருவகப்படுத்துதல்',
      'connectingToDoctor': 'மருத்துவருடன் இணைகிறது...',
      'consultationConnected': 'இணைக்கப்பட்டது',
      'muteMic': 'ஒலியடக்கு',
      'unmuteMic': 'ஒலி இயக்கு',
      'cameraOn': 'வீடியோ நிறுத்து',
      'cameraOff': 'வீடியோ இயக்கு',
      'switchCamera': 'கேமரா மாற்று',
      'endConsultationBtn': 'அழைப்பை முடிக்கவும்',
      'consultationEndedTitle': 'ஆலோசனை முடிந்தது',
      'callDurationLabel': 'அழைப்பு நேரம்',
      'returnToHomeBtn': 'முகப்புக்குத் திரும்பு',
      'viewSummaryBtn': 'சுருக்கத்தைக் காண்க',
      'chatInputHint': 'மருத்துவருக்கு செய்தி அனுப்பவும்...',
      'sendBtn': 'அனுப்புக',
      'slotRequiredMsg': 'தொடர ஒரு நேர இடைவெளியைத் தேர்ந்தெடுக்கவும்',
      'dateRequiredMsg': 'ஆலோசனை தேதியைத் தேர்ந்தெடுக்கவும்',
    },
    'hi': {
      'tabHome': 'होम',
      'tabAppointments': 'अपॉइंटमेंट्स',
      'tabCare': 'देखभाल',
      'tabRecords': 'रिकॉर्ड्स',
      'tabProfile': 'प्रोफ़ाइल',
      'tagline': 'लोगों को बेहतर स्वास्थ्य सेवा से जोड़ना',
      'continueBtn': 'जारी रखें',
      'nextBtn': 'आगे',
      'backBtn': 'पीछे',
      'skipBtn': 'छोड़ें',
      'getStartedBtn': 'शुरू करें',
      'cancelBtn': 'रद्द करें',
      'logoutBtn': 'लॉग आउट',
      'loginTitle': 'वापसी पर स्वागत है',
      'loginSubtitle': 'अपना मोबाइल नंबर दर्ज करें',
      'mobileNumberLabel': 'मोबाइल नंबर',
      'loginPrivacyNote': 'आपकी पहचान सत्यापित करने के लिए मोबाइल नंबर का उपयोग किया जाएगा।',
      'otpTitle': 'मोबाइल नंबर सत्यापित करें',
      'otpSubtitle': '6 अंकों का सत्यापन कोड भेजा गया है:',
      'verifyBtn': 'सत्यापित करें',
      'resendOtpBtn': 'पुनः ओटीपी भेजें',
      'changeMobileBtn': 'मोबाइल नंबर बदलें',
      'profileSetupTitle': 'अपनी प्रोफ़ाइल बनाएं',
      'profileSetupSubtitle': 'आइए आपके लिए CareBridge को अनुकूलित करें।',
      'fullNameLabel': 'पूरा नाम',
      'preferredLanguageLabel': 'पसंदीदा भाषा',
      'dobLabel': 'जन्म तिथि (वैकल्पिक)',
      'genderLabel': 'लिंग (वैकल्पिक)',
      'consentLabel':
          'मैं समझता हूं और सहमत हूं। इस जानकारी का उपयोग स्वास्थ्य सेवा को अनुकूलित करने के लिए किया जाएगा।',
      'logoutConfirmTitle': 'लॉग आउट करें?',
      'logoutConfirmMessage': 'क्या आप CareBridge से लॉग आउट करना चाहते हैं?',
      'greetingMorning': 'सुप्रभात',
      'greetingAfternoon': 'शुभ दोपहर',
      'greetingEvening': 'शुभ संध्या',
      'greetingFallback': 'नमस्ते',
      'homeGreetingSubtitle': 'आज हम आपकी कैसे मदद कर सकते हैं?',
      'healthStatusTitle': 'आपकी स्वास्थ्य स्थिति',
      'healthStatusCheck': 'स्वास्थ्य जांच स्थिति',
      'healthStatusDoingWell': 'आप स्वस्थ हैं • अपनी स्वास्थ्य दिनचर्या जारी रखें।',
      'healthStatusUpdatedToday': 'अंतिम अपडेट: आज',
      'quickActionsTitle': 'त्वरित कार्य',
      'quickActionBookDoctor': 'डॉक्टर बुक करें',
      'quickActionTalkDoctor': 'डॉक्टर से बात करें',
      'quickActionFindHospital': 'अस्पताल खोजें',
      'quickActionEmergency': 'आपातकालीन',
      'emergencyAssistanceTitle': 'आपातकालीन सहायता',
      'emergencyAssistanceMsg':
          'यदि यह एक चिकित्सा आपात स्थिति है, तो 108 पर कॉल करें या तत्काल चिकित्सा सहायता लें।',
      'call108Btn': '108 पर कॉल करें',
      'upcomingAppointmentTitle': 'आगामी नियुक्ति',
      'noUpcomingAppointments': 'कोई आगामी नियुक्ति नहीं',
      'bookConsultationPrompt': 'आवश्यकता होने पर परामर्श बुक करें।',
      'viewAppointmentBtn': 'नियुक्ति देखें',
      'viewAllBtn': 'सभी देखें',
      'referralTitle': 'रेफरल स्थिति',
      'noActiveReferrals': 'कोई सक्रिय रेफरल नहीं',
      'viewReferralBtn': 'रेफरल देखें',
      'healthAlertsTitle': 'स्वास्थ्य अलर्ट',
      'noHealthAlerts': 'कोई सक्रिय अलर्ट नहीं',
      'medicineAvailabilityTitle': 'दवा उपलब्धता',
      'viewMedicinesBtn': 'दवाएं देखें',
      'noMedicinesAvailable': 'कोई दवा रिकॉर्ड उपलब्ध नहीं',
      'nearbyHealthCampsTitle': 'निकटवर्ती स्वास्थ्य शिविर',
      'noHealthCamps': 'निकट कोई स्वास्थ्य शिविर नहीं',
      'assistantCardTitle': 'केयरब्रिज सहायक',
      'assistantCardSubtitle': 'स्वास्थ्य सेवा के बारे में कोई प्रश्न है?',
      'askAssistantBtn': 'केयरब्रिज से पूछें',
      'assistantSoonMsg': 'स्वास्थ्य सहायक जल्द ही उपलब्ध होगा।',
      'openAssistantSemantic': 'केयरब्रिज सहायक खोलें',
      'doctorConsultationSoonMsg': 'डॉक्टर परामर्श जल्द ही उपलब्ध होगा।',
      'needEmergencyHelpTitle': 'आपातकालीन सहायता चाहिए?',
      'emergencyHelpSubtitle': 'गंभीर आपात स्थितियों के लिए, तत्काल चिकित्सा सहायता लें।',
      'notificationsTitle': 'सूचनाएं',
      'noNotifications': 'इस समय कोई नई सूचनाएं नहीं हैं।',
      'markAllRead': 'सभी को पढ़ा हुआ चिह्नित करें',
      'recordsTitle': 'स्वास्थ्य रिकॉर्ड्स',
      'recordsSubtitle': 'आपकी स्वास्थ्य जानकारी एक ही स्थान पर',
      'recordsSummaryTitle': 'रिकॉर्ड सारांश',
      'allRecords': 'सभी',
      'categoryMedicalRecords': 'चिकित्सा रिकॉर्ड्स',
      'categoryLabReports': 'लैब रिपोर्ट',
      'categoryPrescriptions': 'दवा के पर्चे',
      'categoryVaccinations': 'टीकाकरण',
      'categoryOtherDocuments': 'अन्य दस्तावेज',
      'recentRecordsTitle': 'हाल के रिकॉर्ड्स',
      'searchRecordsHint': 'शीर्षक, अस्पताल, डॉक्टर द्वारा खोजें...',
      'noHealthRecordsYet': 'अभी कोई स्वास्थ्य रिकॉर्ड नहीं है',
      'noHealthRecordsDesc':
          'आपके चिकित्सीय परामर्श, लैब रिपोर्ट और दवा के पर्चे यहां दिखाई देंगे।',
      'noRecordsFound': 'कोई रिकॉर्ड नहीं मिला',
      'tryDifferentSearch': 'अलग खोज शब्द या श्रेणी फ़िल्टर आज़माएं।',
      'emptyCategoryRecords': 'इस श्रेणी में कोई रिकॉर्ड उपलब्ध नहीं है',
      'recordDetailsTitle': 'रिकॉर्ड विवरण',
      'viewDetailsBtn': 'विवरण देखें',
      'facilityLabel': 'स्वास्थ्य सुविधा',
      'doctorLabel': 'डॉक्टर / प्रदाता',
      'dateLabel': 'तारीख',
      'recordTypeLabel': 'रिकॉर्ड का प्रकार',
      'clinicalSummaryTitle': 'सारांश',
      'structuredDetailsTitle': 'परीक्षण परिणाम और विवरण',
      'documentPreviewTitle': 'दस्तावेज़ पूर्वावलोकन',
      'documentPreviewPlaceholder':
          'यह स्वास्थ्य दस्तावेज़ भविष्य के संस्करण में यहां उपलब्ध होगा।',
      'downloadBtn': 'डाउनलोड',
      'shareBtn': 'साझा करें',
      'printBtn': 'प्रिंट',
      'featureAvailableFutureMsg': 'यह सुविधा भविष्य के संस्करण में उपलब्ध होगी।',
      'nonDiagnosticDisclaimer':
          'केवल सूचनात्मक रिकॉर्ड रखने के लिए प्रदर्शन डेटा। कोई चिकित्सीय निदान या उपचार सलाह नहीं।',
      'abhaConnectTitle': 'अपने ABHA कार्ड से\nकनेक्ट करें',
      'abhaConnectSubtitle':
          'अपनी स्वास्थ्य जानकारी सुरक्षित रूप से एक्सेस करने के लिए अपना ABHA खाता कनेक्ट करें।',
      'abhaWhatIsIt':
          'ABHA (आयुष्मान भारत स्वास्थ्य खाता) आपकी विशिष्ट डिजिटल स्वास्थ्य आईडी है जो आपके सभी चिकित्सा रिकॉर्ड को सुरक्षित रूप से जोड़ती है।',
      'abhaConnectBtn': 'ABHA से कनेक्ट करें',
      'abhaCreateBtn': 'अपना ABHA कार्ड बनाएं',
      'abhaPrototypeDisclaimer':
          'CareBridge के पूर्ण संस्करण में ABHA आपकी स्वास्थ्य जानकारी को सुरक्षित रूप से कनेक्ट करेगा।',
      'recordCategoriesTitle': 'रिकॉर्ड श्रेणियां',
      'manualEntryBtn': 'मैनुअल प्रविष्टि',
      'addLabReport': 'लैब रिपोर्ट जोड़ें',
      'manualEntrySubtitle': 'अपने रिकॉर्ड में सहेजने के लिए परीक्षण मान मैन्युअल रूप से दर्ज करें',
      'reportTitleLabel': 'रिपोर्ट का शीर्षक',
      'reportTitleHint': 'उदा. ब्लड शुगर, लिपिड प्रोफाइल',
      'facilityHint': 'उदा. प्राथमिक स्वास्थ्य केंद्र',
      'doctorHint': 'उदा. डॉ. के. शर्मा',
      'clinicalSummaryHint': 'परीक्षण के संक्षिप्त नोट्स',
      'testResultLabel': 'मुख्य परीक्षण मान (वैकल्पिक)',
      'testResultHint': 'उदा. 110 mg/dL',
      'titleRequired': 'कृपया रिपोर्ट का शीर्षक दर्ज करें',
      'facilityRequired': 'कृपया स्वास्थ्य केंद्र का नाम दर्ज करें',
      'saveRecordBtn': 'रिकॉर्ड सहेजें',
      'manuallyEnteredBadge': 'मैन्युअल प्रविष्ट',
      'searchResultsTitle': 'खोज परिणाम',
      'showAllRecords': 'सभी रिकॉर्ड दिखाएं',
      'publicHealthServicesTitle': 'सार्वजनिक स्वास्थ्य सेवाएं',
      'publicHealthServicesSubtitle': 'निकटतम सरकारी अस्पताल और प्राथमिक स्वास्थ्य केंद्र खोजें',
      'hospitalsTitle': 'अस्पताल',
      'hospitalsSubtitle': 'जिला मुख्यालय और सरकारी अस्पताल',
      'phcsTitle': 'प्राथमिक स्वास्थ्य केंद्र (PHC)',
      'phcsSubtitle': 'सामुदायिक और प्राथमिक स्वास्थ्य केंद्र',
      'findDoctorTitle': 'डॉक्टर खोजें',
      'findDoctorSubtitle': 'विशेषज्ञ और सामान्य डॉक्टर',
      'emergencyServicesTitle': 'आपातकालीन सेवाएं',
      'emergencyServicesSubtitle': '108 एम्बुलेंस सेवा',
      'filterDistrict': 'जिला',
      'filterCity': 'शहर',
      'filterNearby': 'निकटतम',
      'selectDistrict': 'जिला चुनें',
      'selectCity': 'शहर चुनें',
      'allDistricts': 'सभी जिले',
      'allCities': 'सभी शहर',
      'noFacilitiesFound': 'कोई स्वास्थ्य केंद्र नहीं मिला',
      'tryDifferentFilter': 'कृपया अलग जिला या शहर फ़िल्टर चुनें।',
      'locationRequiredMsg': 'निकटतम सुविधाएं खोजने के लिए स्थान आवश्यक है।',
      'enableLocationBtn': 'स्थान चालू करें',
      'getDirectionsBtn': 'दिशा-निर्देश प्राप्त करें',
      'openInGoogleMaps': 'गूगल मैप्स में खोलें',
      'mapsLaunchFailed': 'मैप्स ऐप नहीं खोला जा सका',
      'servicesOfferedTitle': 'उपलब्ध सेवाएं',
      'selectProfile': 'प्रोफ़ाइल चुनें',
      'noAbhaProfileFound': 'कोई आभा प्रोफ़ाइल नहीं मिली',
      'createAbhaCard': 'आभा कार्ड बनाएं',
      'abhaRegistration': 'आभा पंजीकरण',
      'patientProfile': 'रोगी प्रोफ़ाइल',
      'retryBtn': 'पुनः प्रयास करें',
      'somethingWentWrong': 'कुछ गलत हो गया। कृपया पुनः प्रयास करें।',
      'abhaProfilesFound': 'आभा प्रोफ़ाइल मिलीं',
      'checkingAbhaRecords': 'आभा रिकॉर्ड्स की जांच हो रही है',
      'searchingAbhaProfiles': 'पंजीकृत मोबाइल नंबर से जुड़ी आभा प्रोफ़ाइल खोजी जा रही हैं...',
      'connectSelectedProfile': 'चयनित प्रोफ़ाइल कनेक्ट करें',
      'governmentHospitals': 'सरकारी अस्पताल',
      'privateHospitals': 'निजी अस्पताल',
      'overallHospitals': 'सभी अस्पताल',
      'filterGovernment': 'सरकारी',
      'filterPrivate': 'निजी',
      'filterOverall': 'सभी',
      'emergency108Title': '108 आपातकालीन सेवा',
      'emergency108Subtitle': 'तत्काल एम्बुलेंस सहायता',
      'teleconsultationAudioTitle': 'टेलीकंसल्टेशन (ऑडियो)',
      'teleconsultationAudioSubtitle': 'आवाज़ के ज़रिए डॉक्टर से बात करें',
      'calling108Msg': '108 आपातकालीन एम्बुलेंस कॉल शुरू की जा रही है...',
      'connectingAudioConsultation': 'ऑडियो टेलीकंसल्टेशन से जोड़ा जा रहा है...',
      'selectSpecialization': 'विशेषज्ञता चुनें',
      'allSpecializations': 'सभी विशेषज्ञताएं',
      'hospitalTypeLabel': 'अस्पताल का प्रकार',
      'noDoctorsFound': 'कोई डॉक्टर नहीं मिला',
      'tryDifferentDoctorFilter': 'कृपया अलग अस्पताल प्रकार या विशेषज्ञता चुनें।',
      'bookAppointmentAction': 'अपॉइंटमेंट बुक करें',
      'addManualLabReportBtn': '+ मैनुअल लैब रिपोर्ट जोड़ें',
      'uploadDocumentBtn': 'दस्तावेज़ अपलोड करें',
      'replaceDocumentBtn': 'बदलें',
      'removeDocumentBtn': 'हटाएं',
      'noDocumentSelected': 'कोई दस्तावेज़ चयनित नहीं',
      'attachedDocumentLabel': 'संलग्न दस्तावेज़',
      'fileNotSupported': 'फ़ाइल प्रकार समर्थित नहीं है। कृपया PDF, JPG, या PNG अपलोड करें।',
      'fileTooLarge': 'फ़ाइल बहुत बड़ी है। अधिकतम आकार 10 MB है।',
      'documentSelectedMsg': 'दस्तावेज़ सफलतापूर्वक चुना गया',
      'doctorDetailsTitle': 'डॉक्टर विवरण',
      'qualificationLabel': 'योग्यता',
      'experienceLabel': 'अनुभव',
      'experienceYears': 'वर्षों का अनुभव',
      'availabilityLabel': 'उपलब्धता',
      'doctorAvailable': 'उपलब्ध',
      'doctorOnLeave': 'छुट्टी पर',
      'testCategoryLabel': 'परीक्षण श्रेणी',
      'testCategoryHint': 'उदा. पैथोलॉजी, बायोकेमिस्ट्री',
      'myAbhaCardTitle': 'मेरा स्वास्थ्य आईडी / आभा',
      'myAbhaCardSubtitle': 'मेरा स्वास्थ्य आईडी / मेरा आभा कार्ड',
      'myAbhaCard': 'मेरा आभा कार्ड',
      'myHealthId': 'मेरा स्वास्थ्य आईडी',
      'qrCode': 'क्यूआर कोड',
      'scanQrPrompt': 'त्वरित पंजीकरण के लिए अस्पताल काउंटर पर यह क्यूआर कोड स्कैन करें',
      'emergencyContactsTitle': 'आपातकालीन संपर्क',
      'emergencyContactsSubtitle': 'आपातकालीन संपर्क जोड़ें और प्रबंधित करें',
      'noEmergencyContacts': 'कोई आपातकालीन संपर्क नहीं जोड़ा गया।',
      'addEmergencyContactBtn': '+ आपातकालीन संपर्क जोड़ें',
      'editContactBtn': 'संपादित करें',
      'deleteContactBtn': 'हटाएं',
      'contactNameLabel': 'संपर्क नाम',
      'relationshipLabel': 'संबंध',
      'mobileNumberFieldLabel': 'मोबाइल नंबर',
      'saveContactBtn': 'संपर्क सहेजें',
      'contactNameRequired': 'संपर्क नाम आवश्यक है',
      'validMobileRequired': 'कृपया वैध 10 अंकों का मोबाइल नंबर दर्ज करें',
      'confirmDeleteTitle': 'संपर्क हटाएं?',
      'confirmDeleteMsg': 'क्या आप वाकई इस आपातकालीन संपर्क को हटाना चाहते हैं?',
      'languageSettingsTitle': 'भाषा',
      'tamilLang': 'तमिल',
      'englishLang': 'अंग्रेज़ी',
      'opdCardTitle': 'ओपीडी कार्ड',
      'opdCardSubtitle': 'डिजिटल बाह्य रोगी विभाग पंजीकरण कार्ड',
      'downloadOpdCardBtn': 'ओपीडी कार्ड डाउनलोड करें',
      'downloadingOpdCard': 'ओपीडी कार्ड पीडीएफ तैयार और डाउनलोड किया जा रहा है...',
      'opdCardDownloaded': 'ओपीडी कार्ड सफलतापूर्वक डाउनलोड हो गया',
      'opdNumberLabel': 'ओपीडी सं.',
      'patientIdLabel': 'रोगी आईडी',
      'patientNameLabel': 'रोगी का नाम',
      'registrationDateLabel': 'पंजीकरण तिथि',
      'medicalTitle': 'दवा की दुकान',
      'medicalSubtitle': 'निकटतम दवा स्टोर और फार्मेसियां',
      'nearbyMedicalStores': 'निकटवर्ती दवा की दुकानें',
      'open24x7': '24x7 खुला',
      'orderMedicinesBtn': 'दवाएं ऑर्डर करें',
      'orderMedicinesSubtitle': 'इस पर्चे से दवाएं ऑर्डर करें',
      'selectMedicinesTitle': 'दवाएं चुनें',
      'reviewOrderTitle': 'ऑर्डर सारांश',
      'confirmOrderBtn': 'ऑर्डर की पुष्टि करें',
      'orderSuccessTitle': 'ऑर्डर सफलतापूर्वक दिया गया',
      'orderSuccessSubtitle': 'आपका दवा ऑर्डर प्राप्त हो गया है।',
      'orderIdLabel': 'ऑर्डर आईडी',
      'medicinesCountLabel': 'दवाएं',
      'pickupFacilityLabel': 'पिकअप / डिलीवरी सुविधा',
      'backToRecordsBtn': 'रिकॉर्ड पर वापस जाएं',
      'teleconsultationTitle': 'टेलीकंसल्टेशन',
      'teleconsultationSubtitle': 'योग्य सरकारी और निजी डॉक्टरों से दूरस्थ परामर्श लें',
      'searchDoctorHint': 'डॉक्टर का नाम या विशेषज्ञता खोजें...',
      'filterSpecialization': 'विशेषज्ञता',
      'filterAvailability': 'उपलब्धता',
      'availableNow': 'अभी उपलब्ध',
      'allAvailability': 'सभी डॉक्टर',
      'bookTeleconsultationBtn': 'परामर्श बुक करें',
      'consultationTypeTitle': 'परामर्श प्रकार',
      'consultationTypeVideo': 'वीडियो कॉल',
      'consultationTypeAudio': 'ऑडियो कॉल',
      'consultationTypeChat': 'चैट',
      'consultationTypeVideoDesc': 'अपने डॉक्टर के साथ आमने-सामने वीडियो परामर्श',
      'consultationTypeAudioDesc': 'अपने डॉक्टर के साथ सीधी वॉयस कॉल परामर्श',
      'consultationTypeChatDesc': 'अपने डॉक्टर के साथ टेक्स्ट संदेश परामर्श',
      'selectDateTitle': 'तिथि चुनें',
      'selectTimeSlotTitle': 'समय स्लॉट चुनें',
      'noSlotsAvailable': 'इस तिथि के लिए कोई स्लॉट उपलब्ध नहीं है।',
      'consultationSummaryTitle': 'परामर्श सारांश',
      'consultationDetailsSection': 'परामर्श विवरण',
      'patientDetailsSection': 'रोगी का विवरण',
      'confirmAndScheduleBtn': 'पुष्टि करें और परामर्श निर्धारित करें',
      'consultationScheduledTitle': 'परामर्श निर्धारित हुआ!',
      'consultationScheduledSubtitle': 'आपका दूरस्थ परामर्श सफलतापूर्वक बुक हो गया है।',
      'consultationIdLabel': 'परामर्श आईडी',
      'addToAppointmentsBtn': 'अपॉइंटमेंट्स में जोड़ें',
      'doneBtn': 'हो गया',
      'teleconsultationBadge': 'टेलीकंसल्टेशन',
      'joinConsultationBtn': 'परामर्श में शामिल हों',
      'prototypeConsultationNotice': 'प्रोटोटाइप टेलीकंसल्टेशन सिमुलेशन',
      'connectingToDoctor': 'डॉक्टर से जुड़ रहा है...',
      'consultationConnected': 'कनेक्ट हो गया',
      'muteMic': 'म्यूट करें',
      'unmuteMic': 'अनम्यूट करें',
      'cameraOn': 'वीडियो बंद करें',
      'cameraOff': 'वीडियो चालू करें',
      'switchCamera': 'कैमरा बदलें',
      'endConsultationBtn': 'परामर्श समाप्त करें',
      'consultationEndedTitle': 'परामर्श समाप्त हुआ',
      'callDurationLabel': 'कॉल अवधि',
      'returnToHomeBtn': 'होम पर वापस जाएं',
      'viewSummaryBtn': 'सारांश देखें',
      'chatInputHint': 'डॉक्टर को संदेश लिखें...',
      'sendBtn': 'भेजें',
      'slotRequiredMsg': 'जारी रखने के लिए कृपया एक समय स्लॉट चुनें',
      'dateRequiredMsg': 'कृपया परामर्श तिथि चुनें',
    },
  };
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  bool isSupported(Locale locale) {
    return ['en', 'ta', 'hi'].contains(locale.languageCode);
  }

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(AppLocalizations(locale));
  }

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}
