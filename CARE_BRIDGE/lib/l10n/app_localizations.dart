import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;

import 'app_localizations_as.dart';
import 'app_localizations_bn.dart';
import 'app_localizations_br.dart';
import 'app_localizations_doi.dart';
import 'app_localizations_en.dart';
import 'app_localizations_gu.dart';
import 'app_localizations_hi.dart';
import 'app_localizations_kn.dart';
import 'app_localizations_kok.dart';
import 'app_localizations_ks.dart';
import 'app_localizations_mai.dart';
import 'app_localizations_ml.dart';
import 'app_localizations_mni.dart';
import 'app_localizations_mr.dart';
import 'app_localizations_ne.dart';
import 'app_localizations_or.dart';
import 'app_localizations_pa.dart';
import 'app_localizations_sa.dart';
import 'app_localizations_sat.dart';
import 'app_localizations_sd.dart';
import 'app_localizations_ta.dart';
import 'app_localizations_te.dart';
import 'app_localizations_ur.dart';

// ignore_for_file: type=lint

/// Callers can lookup localized strings with an instance of AppGenLocalizations
/// returned by `AppGenLocalizations.of(context)`.
///
/// Applications need to include `AppGenLocalizations.delegate()` in their app's
/// `localizationDelegates` list, and the locales they support in the app's
/// `supportedLocales` list. For example:
///
/// ```dart
/// import 'l10n/app_localizations.dart';
///
/// return MaterialApp(
///   localizationsDelegates: AppGenLocalizations.localizationsDelegates,
///   supportedLocales: AppGenLocalizations.supportedLocales,
///   home: MyApplicationHome(),
/// );
/// ```
///
/// ## Update pubspec.yaml
///
/// Please make sure to update your pubspec.yaml to include the following
/// packages:
///
/// ```yaml
/// dependencies:
///   # Internationalization support.
///   flutter_localizations:
///     sdk: flutter
///   intl: any # Use the pinned version from flutter_localizations
///
///   # Rest of dependencies
/// ```
///
/// ## iOS Applications
///
/// iOS applications define key application metadata, including supported
/// locales, in an Info.plist file that is built into the application bundle.
/// To configure the locales supported by your app, you’ll need to edit this
/// file.
///
/// First, open your project’s ios/Runner.xcworkspace Xcode workspace file.
/// Then, in the Project Navigator, open the Info.plist file under the Runner
/// project’s Runner folder.
///
/// Next, select the Information Property List item, select Add Item from the
/// Editor menu, then select Localizations from the pop-up menu.
///
/// Select and expand the newly-created Localizations item then, for each
/// locale your application supports, add a new item and select the locale
/// you wish to add from the pop-up menu in the Value field. This list should
/// be consistent with the languages listed in the AppGenLocalizations.supportedLocales
/// property.
abstract class AppGenLocalizations {
  AppGenLocalizations(String locale)
    : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static AppGenLocalizations of(BuildContext context) {
    return Localizations.of<AppGenLocalizations>(context, AppGenLocalizations)!;
  }

  static const LocalizationsDelegate<AppGenLocalizations> delegate =
      _AppGenLocalizationsDelegate();

  /// A list of this localizations delegate along with the default localizations
  /// delegates.
  ///
  /// Returns a list of localizations delegates containing this delegate along with
  /// GlobalMaterialLocalizations.delegate, GlobalCupertinoLocalizations.delegate,
  /// and GlobalWidgetsLocalizations.delegate.
  ///
  /// Additional delegates can be added by appending to this list in
  /// MaterialApp. This list does not have to be used at all if a custom list
  /// of delegates is preferred or required.
  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates =
      <LocalizationsDelegate<dynamic>>[
        delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
      ];

  /// A list of this localizations delegate's supported locales.
  static const List<Locale> supportedLocales = <Locale>[
    Locale('as'),
    Locale('bn'),
    Locale('br'),
    Locale('doi'),
    Locale('en'),
    Locale('gu'),
    Locale('hi'),
    Locale('kn'),
    Locale('kok'),
    Locale('ks'),
    Locale('mai'),
    Locale('ml'),
    Locale('mni'),
    Locale('mr'),
    Locale('ne'),
    Locale('or'),
    Locale('pa'),
    Locale('sa'),
    Locale('sat'),
    Locale('sd'),
    Locale('ta'),
    Locale('te'),
    Locale('ur'),
  ];

  /// User interface string for tabHome
  ///
  /// In en, this message translates to:
  /// **'Home'**
  String get tabHome;

  /// User interface string for tabAppointments
  ///
  /// In en, this message translates to:
  /// **'Appointments'**
  String get tabAppointments;

  /// User interface string for tabCare
  ///
  /// In en, this message translates to:
  /// **'Care'**
  String get tabCare;

  /// User interface string for tabRecords
  ///
  /// In en, this message translates to:
  /// **'Records'**
  String get tabRecords;

  /// User interface string for tabProfile
  ///
  /// In en, this message translates to:
  /// **'Profile'**
  String get tabProfile;

  /// User interface string for tagline
  ///
  /// In en, this message translates to:
  /// **'Bridging People to Better Healthcare'**
  String get tagline;

  /// User interface string for continueBtn
  ///
  /// In en, this message translates to:
  /// **'Continue'**
  String get continueBtn;

  /// User interface string for nextBtn
  ///
  /// In en, this message translates to:
  /// **'Next'**
  String get nextBtn;

  /// User interface string for backBtn
  ///
  /// In en, this message translates to:
  /// **'Back'**
  String get backBtn;

  /// User interface string for skipBtn
  ///
  /// In en, this message translates to:
  /// **'Skip'**
  String get skipBtn;

  /// User interface string for getStartedBtn
  ///
  /// In en, this message translates to:
  /// **'Get Started'**
  String get getStartedBtn;

  /// User interface string for cancelBtn
  ///
  /// In en, this message translates to:
  /// **'Cancel'**
  String get cancelBtn;

  /// User interface string for logoutBtn
  ///
  /// In en, this message translates to:
  /// **'Log out'**
  String get logoutBtn;

  /// User interface string for loginTitle
  ///
  /// In en, this message translates to:
  /// **'Welcome back'**
  String get loginTitle;

  /// User interface string for loginSubtitle
  ///
  /// In en, this message translates to:
  /// **'Enter your mobile number'**
  String get loginSubtitle;

  /// User interface string for mobileNumberLabel
  ///
  /// In en, this message translates to:
  /// **'Mobile number'**
  String get mobileNumberLabel;

  /// User interface string for loginPrivacyNote
  ///
  /// In en, this message translates to:
  /// **'\"We\'ll use your mobile number to securely verify your identity.\"'**
  String get loginPrivacyNote;

  /// User interface string for otpTitle
  ///
  /// In en, this message translates to:
  /// **'Verify your mobile number'**
  String get otpTitle;

  /// User interface string for otpSubtitle
  ///
  /// In en, this message translates to:
  /// **'\"We\'ve sent a 6-digit verification code to\"'**
  String get otpSubtitle;

  /// User interface string for verifyBtn
  ///
  /// In en, this message translates to:
  /// **'Verify'**
  String get verifyBtn;

  /// User interface string for resendOtpBtn
  ///
  /// In en, this message translates to:
  /// **'Resend OTP'**
  String get resendOtpBtn;

  /// User interface string for changeMobileBtn
  ///
  /// In en, this message translates to:
  /// **'Change mobile number'**
  String get changeMobileBtn;

  /// User interface string for profileSetupTitle
  ///
  /// In en, this message translates to:
  /// **'Set up your profile'**
  String get profileSetupTitle;

  /// User interface string for profileSetupSubtitle
  ///
  /// In en, this message translates to:
  /// **'\"Let\'s personalize CareBridge for you.\"'**
  String get profileSetupSubtitle;

  /// User interface string for fullNameLabel
  ///
  /// In en, this message translates to:
  /// **'Full name'**
  String get fullNameLabel;

  /// User interface string for preferredLanguageLabel
  ///
  /// In en, this message translates to:
  /// **'Preferred language'**
  String get preferredLanguageLabel;

  /// User interface string for dobLabel
  ///
  /// In en, this message translates to:
  /// **'Date of birth (Optional)'**
  String get dobLabel;

  /// User interface string for genderLabel
  ///
  /// In en, this message translates to:
  /// **'Gender (Optional)'**
  String get genderLabel;

  /// User interface string for consentLabel
  ///
  /// In en, this message translates to:
  /// **'I understand and agree to continue. CareBridge will use this information solely to personalize healthcare services.'**
  String get consentLabel;

  /// User interface string for logoutConfirmTitle
  ///
  /// In en, this message translates to:
  /// **'Log out?'**
  String get logoutConfirmTitle;

  /// User interface string for logoutConfirmMessage
  ///
  /// In en, this message translates to:
  /// **'Are you sure you want to log out of CareBridge?'**
  String get logoutConfirmMessage;

  /// User interface string for greetingMorning
  ///
  /// In en, this message translates to:
  /// **'Good morning'**
  String get greetingMorning;

  /// User interface string for greetingAfternoon
  ///
  /// In en, this message translates to:
  /// **'Good afternoon'**
  String get greetingAfternoon;

  /// User interface string for greetingEvening
  ///
  /// In en, this message translates to:
  /// **'Good evening'**
  String get greetingEvening;

  /// User interface string for greetingFallback
  ///
  /// In en, this message translates to:
  /// **'Hello'**
  String get greetingFallback;

  /// User interface string for homeGreetingSubtitle
  ///
  /// In en, this message translates to:
  /// **'How can we help you today?'**
  String get homeGreetingSubtitle;

  /// User interface string for healthStatusTitle
  ///
  /// In en, this message translates to:
  /// **'Your Health Status'**
  String get healthStatusTitle;

  /// User interface string for healthStatusCheck
  ///
  /// In en, this message translates to:
  /// **'Health Check Status'**
  String get healthStatusCheck;

  /// User interface string for healthStatusDoingWell
  ///
  /// In en, this message translates to:
  /// **'\"You\'re doing well • Keep following your health routine.\"'**
  String get healthStatusDoingWell;

  /// User interface string for healthStatusUpdatedToday
  ///
  /// In en, this message translates to:
  /// **'Last updated: Today'**
  String get healthStatusUpdatedToday;

  /// User interface string for quickActionsTitle
  ///
  /// In en, this message translates to:
  /// **'Quick Actions'**
  String get quickActionsTitle;

  /// User interface string for quickActionBookDoctor
  ///
  /// In en, this message translates to:
  /// **'Book Doctor'**
  String get quickActionBookDoctor;

  /// User interface string for quickActionTalkDoctor
  ///
  /// In en, this message translates to:
  /// **'Talk to Doctor'**
  String get quickActionTalkDoctor;

  /// User interface string for quickActionFindHospital
  ///
  /// In en, this message translates to:
  /// **'Find Hospital'**
  String get quickActionFindHospital;

  /// User interface string for quickActionEmergency
  ///
  /// In en, this message translates to:
  /// **'Emergency'**
  String get quickActionEmergency;

  /// User interface string for emergencyAssistanceTitle
  ///
  /// In en, this message translates to:
  /// **'Emergency Assistance'**
  String get emergencyAssistanceTitle;

  /// User interface string for emergencyAssistanceMsg
  ///
  /// In en, this message translates to:
  /// **'If this is a medical emergency, call 108 or seek immediate medical assistance.'**
  String get emergencyAssistanceMsg;

  /// User interface string for call108Btn
  ///
  /// In en, this message translates to:
  /// **'Call 108'**
  String get call108Btn;

  /// User interface string for upcomingAppointmentTitle
  ///
  /// In en, this message translates to:
  /// **'Upcoming Appointment'**
  String get upcomingAppointmentTitle;

  /// User interface string for noUpcomingAppointments
  ///
  /// In en, this message translates to:
  /// **'No upcoming appointments'**
  String get noUpcomingAppointments;

  /// User interface string for bookConsultationPrompt
  ///
  /// In en, this message translates to:
  /// **'Book a consultation when you need care.'**
  String get bookConsultationPrompt;

  /// User interface string for viewAppointmentBtn
  ///
  /// In en, this message translates to:
  /// **'View Appointment'**
  String get viewAppointmentBtn;

  /// User interface string for viewAllBtn
  ///
  /// In en, this message translates to:
  /// **'View all'**
  String get viewAllBtn;

  /// User interface string for referralTitle
  ///
  /// In en, this message translates to:
  /// **'Referral Status'**
  String get referralTitle;

  /// User interface string for noActiveReferrals
  ///
  /// In en, this message translates to:
  /// **'No active referrals'**
  String get noActiveReferrals;

  /// User interface string for viewReferralBtn
  ///
  /// In en, this message translates to:
  /// **'View Referral'**
  String get viewReferralBtn;

  /// User interface string for healthAlertsTitle
  ///
  /// In en, this message translates to:
  /// **'Health Alerts'**
  String get healthAlertsTitle;

  /// User interface string for noHealthAlerts
  ///
  /// In en, this message translates to:
  /// **'No active health alerts'**
  String get noHealthAlerts;

  /// User interface string for medicineAvailabilityTitle
  ///
  /// In en, this message translates to:
  /// **'Medicine Availability'**
  String get medicineAvailabilityTitle;

  /// User interface string for viewMedicinesBtn
  ///
  /// In en, this message translates to:
  /// **'View Medicines'**
  String get viewMedicinesBtn;

  /// User interface string for noMedicinesAvailable
  ///
  /// In en, this message translates to:
  /// **'No medicine records available'**
  String get noMedicinesAvailable;

  /// User interface string for nearbyHealthCampsTitle
  ///
  /// In en, this message translates to:
  /// **'Nearby Health Camps'**
  String get nearbyHealthCampsTitle;

  /// User interface string for noHealthCamps
  ///
  /// In en, this message translates to:
  /// **'No health camps scheduled nearby'**
  String get noHealthCamps;

  /// User interface string for assistantCardTitle
  ///
  /// In en, this message translates to:
  /// **'CareBridge Assistant'**
  String get assistantCardTitle;

  /// User interface string for assistantCardSubtitle
  ///
  /// In en, this message translates to:
  /// **'Have a question about healthcare?'**
  String get assistantCardSubtitle;

  /// User interface string for askAssistantBtn
  ///
  /// In en, this message translates to:
  /// **'Ask CareBridge'**
  String get askAssistantBtn;

  /// User interface string for assistantSoonMsg
  ///
  /// In en, this message translates to:
  /// **'The healthcare assistant will be available soon.'**
  String get assistantSoonMsg;

  /// User interface string for openAssistantSemantic
  ///
  /// In en, this message translates to:
  /// **'Open CareBridge Assistant'**
  String get openAssistantSemantic;

  /// User interface string for doctorConsultationSoonMsg
  ///
  /// In en, this message translates to:
  /// **'Doctor consultation will be available soon.'**
  String get doctorConsultationSoonMsg;

  /// User interface string for needEmergencyHelpTitle
  ///
  /// In en, this message translates to:
  /// **'Need Emergency Help?'**
  String get needEmergencyHelpTitle;

  /// User interface string for emergencyHelpSubtitle
  ///
  /// In en, this message translates to:
  /// **'For serious emergencies, seek immediate medical attention.'**
  String get emergencyHelpSubtitle;

  /// User interface string for notificationsTitle
  ///
  /// In en, this message translates to:
  /// **'Notifications'**
  String get notificationsTitle;

  /// User interface string for noNotifications
  ///
  /// In en, this message translates to:
  /// **'No new notifications at this time.'**
  String get noNotifications;

  /// User interface string for markAllRead
  ///
  /// In en, this message translates to:
  /// **'Mark all as read'**
  String get markAllRead;

  /// User interface string for recordsTitle
  ///
  /// In en, this message translates to:
  /// **'Health Records'**
  String get recordsTitle;

  /// User interface string for recordsSubtitle
  ///
  /// In en, this message translates to:
  /// **'Your health information in one place'**
  String get recordsSubtitle;

  /// User interface string for recordsSummaryTitle
  ///
  /// In en, this message translates to:
  /// **'Records Summary'**
  String get recordsSummaryTitle;

  /// User interface string for allRecords
  ///
  /// In en, this message translates to:
  /// **'All'**
  String get allRecords;

  /// User interface string for categoryMedicalRecords
  ///
  /// In en, this message translates to:
  /// **'Medical Records'**
  String get categoryMedicalRecords;

  /// User interface string for categoryLabReports
  ///
  /// In en, this message translates to:
  /// **'Lab Reports'**
  String get categoryLabReports;

  /// User interface string for categoryPrescriptions
  ///
  /// In en, this message translates to:
  /// **'Prescriptions'**
  String get categoryPrescriptions;

  /// User interface string for categoryVaccinations
  ///
  /// In en, this message translates to:
  /// **'Vaccinations'**
  String get categoryVaccinations;

  /// User interface string for categoryOtherDocuments
  ///
  /// In en, this message translates to:
  /// **'Other Documents'**
  String get categoryOtherDocuments;

  /// User interface string for recentRecordsTitle
  ///
  /// In en, this message translates to:
  /// **'Recent Records'**
  String get recentRecordsTitle;

  /// User interface string for searchRecordsHint
  ///
  /// In en, this message translates to:
  /// **'Search by title, hospital, doctor...'**
  String get searchRecordsHint;

  /// User interface string for noHealthRecordsYet
  ///
  /// In en, this message translates to:
  /// **'No health records yet'**
  String get noHealthRecordsYet;

  /// User interface string for noHealthRecordsDesc
  ///
  /// In en, this message translates to:
  /// **'Your medical consultations, lab reports, and prescriptions will appear here.'**
  String get noHealthRecordsDesc;

  /// User interface string for noRecordsFound
  ///
  /// In en, this message translates to:
  /// **'No records found'**
  String get noRecordsFound;

  /// User interface string for tryDifferentSearch
  ///
  /// In en, this message translates to:
  /// **'Try a different search term or category filter.'**
  String get tryDifferentSearch;

  /// User interface string for emptyCategoryRecords
  ///
  /// In en, this message translates to:
  /// **'No records available in this category'**
  String get emptyCategoryRecords;

  /// User interface string for recordDetailsTitle
  ///
  /// In en, this message translates to:
  /// **'Record Details'**
  String get recordDetailsTitle;

  /// User interface string for viewDetailsBtn
  ///
  /// In en, this message translates to:
  /// **'View Details'**
  String get viewDetailsBtn;

  /// User interface string for facilityLabel
  ///
  /// In en, this message translates to:
  /// **'Healthcare Facility'**
  String get facilityLabel;

  /// User interface string for doctorLabel
  ///
  /// In en, this message translates to:
  /// **'Doctor / Provider'**
  String get doctorLabel;

  /// User interface string for dateLabel
  ///
  /// In en, this message translates to:
  /// **'Date'**
  String get dateLabel;

  /// User interface string for recordTypeLabel
  ///
  /// In en, this message translates to:
  /// **'Record Type'**
  String get recordTypeLabel;

  /// User interface string for clinicalSummaryTitle
  ///
  /// In en, this message translates to:
  /// **'Summary'**
  String get clinicalSummaryTitle;

  /// User interface string for structuredDetailsTitle
  ///
  /// In en, this message translates to:
  /// **'Test Results & Observations'**
  String get structuredDetailsTitle;

  /// User interface string for documentPreviewTitle
  ///
  /// In en, this message translates to:
  /// **'Document Preview'**
  String get documentPreviewTitle;

  /// User interface string for documentPreviewPlaceholder
  ///
  /// In en, this message translates to:
  /// **'This health document will be available here in a future version.'**
  String get documentPreviewPlaceholder;

  /// User interface string for downloadBtn
  ///
  /// In en, this message translates to:
  /// **'Download'**
  String get downloadBtn;

  /// User interface string for shareBtn
  ///
  /// In en, this message translates to:
  /// **'Share'**
  String get shareBtn;

  /// User interface string for printBtn
  ///
  /// In en, this message translates to:
  /// **'Print'**
  String get printBtn;

  /// User interface string for featureAvailableFutureMsg
  ///
  /// In en, this message translates to:
  /// **'This feature will be available in a future version.'**
  String get featureAvailableFutureMsg;

  /// User interface string for nonDiagnosticDisclaimer
  ///
  /// In en, this message translates to:
  /// **'Demonstration data for informational record-keeping only. Not a medical diagnosis or clinical prescription.'**
  String get nonDiagnosticDisclaimer;

  /// User interface string for abhaConnectTitle
  ///
  /// In en, this message translates to:
  /// **'Connect with your\nABHA Card'**
  String get abhaConnectTitle;

  /// User interface string for abhaConnectSubtitle
  ///
  /// In en, this message translates to:
  /// **'Connect your existing ABHA account to securely access your healthcare information.'**
  String get abhaConnectSubtitle;

  /// User interface string for abhaWhatIsIt
  ///
  /// In en, this message translates to:
  /// **'ABHA (Ayushman Bharat Health Account) is your unique digital health ID that links all your medical records securely.'**
  String get abhaWhatIsIt;

  /// User interface string for abhaConnectBtn
  ///
  /// In en, this message translates to:
  /// **'Connect with ABHA'**
  String get abhaConnectBtn;

  /// User interface string for abhaCreateBtn
  ///
  /// In en, this message translates to:
  /// **'Create your ABHA Card'**
  String get abhaCreateBtn;

  /// User interface string for abhaPrototypeDisclaimer
  ///
  /// In en, this message translates to:
  /// **'ABHA integration will securely connect your health information in the full version of CareBridge.'**
  String get abhaPrototypeDisclaimer;

  /// User interface string for selectProfile
  ///
  /// In en, this message translates to:
  /// **'Select Profile'**
  String get selectProfile;

  /// User interface string for noAbhaProfileFound
  ///
  /// In en, this message translates to:
  /// **'No ABHA Profile Found'**
  String get noAbhaProfileFound;

  /// User interface string for createAbhaCard
  ///
  /// In en, this message translates to:
  /// **'Create Your ABHA Card'**
  String get createAbhaCard;

  /// User interface string for abhaRegistration
  ///
  /// In en, this message translates to:
  /// **'ABHA Registration'**
  String get abhaRegistration;

  /// User interface string for patientProfile
  ///
  /// In en, this message translates to:
  /// **'Patient Profile'**
  String get patientProfile;

  /// User interface string for retryBtn
  ///
  /// In en, this message translates to:
  /// **'Retry'**
  String get retryBtn;

  /// User interface string for somethingWentWrong
  ///
  /// In en, this message translates to:
  /// **'Something went wrong. Please check your connection and try again.'**
  String get somethingWentWrong;

  /// User interface string for abhaProfilesFound
  ///
  /// In en, this message translates to:
  /// **'ABHA Profiles Found'**
  String get abhaProfilesFound;

  /// User interface string for checkingAbhaRecords
  ///
  /// In en, this message translates to:
  /// **'Checking ABHA Records'**
  String get checkingAbhaRecords;

  /// User interface string for searchingAbhaProfiles
  ///
  /// In en, this message translates to:
  /// **'Searching for ABHA profiles linked to your registered mobile number...'**
  String get searchingAbhaProfiles;

  /// User interface string for connectSelectedProfile
  ///
  /// In en, this message translates to:
  /// **'Connect Selected Profile'**
  String get connectSelectedProfile;

  /// User interface string for governmentHospitals
  ///
  /// In en, this message translates to:
  /// **'Government Hospitals'**
  String get governmentHospitals;

  /// User interface string for privateHospitals
  ///
  /// In en, this message translates to:
  /// **'Private Hospitals'**
  String get privateHospitals;

  /// User interface string for overallHospitals
  ///
  /// In en, this message translates to:
  /// **'Overall Hospitals'**
  String get overallHospitals;

  /// User interface string for filterGovernment
  ///
  /// In en, this message translates to:
  /// **'Government'**
  String get filterGovernment;

  /// User interface string for filterPrivate
  ///
  /// In en, this message translates to:
  /// **'Private'**
  String get filterPrivate;

  /// User interface string for filterOverall
  ///
  /// In en, this message translates to:
  /// **'Overall'**
  String get filterOverall;

  /// User interface string for emergency108Title
  ///
  /// In en, this message translates to:
  /// **'108 Emergency Service'**
  String get emergency108Title;

  /// User interface string for emergency108Subtitle
  ///
  /// In en, this message translates to:
  /// **'Immediate ambulance assistance'**
  String get emergency108Subtitle;

  /// User interface string for teleconsultationAudioTitle
  ///
  /// In en, this message translates to:
  /// **'Teleconsultation (Audio)'**
  String get teleconsultationAudioTitle;

  /// User interface string for teleconsultationAudioSubtitle
  ///
  /// In en, this message translates to:
  /// **'Talk to a doctor by voice'**
  String get teleconsultationAudioSubtitle;

  /// User interface string for calling108Msg
  ///
  /// In en, this message translates to:
  /// **'Initiating emergency 108 ambulance call...'**
  String get calling108Msg;

  /// User interface string for connectingAudioConsultation
  ///
  /// In en, this message translates to:
  /// **'Connecting to audio teleconsultation...'**
  String get connectingAudioConsultation;

  /// User interface string for selectSpecialization
  ///
  /// In en, this message translates to:
  /// **'Select Specialization'**
  String get selectSpecialization;

  /// User interface string for allSpecializations
  ///
  /// In en, this message translates to:
  /// **'All Specializations'**
  String get allSpecializations;

  /// User interface string for hospitalTypeLabel
  ///
  /// In en, this message translates to:
  /// **'Hospital Type'**
  String get hospitalTypeLabel;

  /// User interface string for noDoctorsFound
  ///
  /// In en, this message translates to:
  /// **'No Doctors Found'**
  String get noDoctorsFound;

  /// User interface string for tryDifferentDoctorFilter
  ///
  /// In en, this message translates to:
  /// **'Try selecting a different hospital type or specialization.'**
  String get tryDifferentDoctorFilter;

  /// User interface string for bookAppointmentAction
  ///
  /// In en, this message translates to:
  /// **'Book Appointment'**
  String get bookAppointmentAction;

  /// User interface string for addManualLabReportBtn
  ///
  /// In en, this message translates to:
  /// **'+ Add Manual Lab Report'**
  String get addManualLabReportBtn;

  /// User interface string for uploadDocumentBtn
  ///
  /// In en, this message translates to:
  /// **'Upload Document'**
  String get uploadDocumentBtn;

  /// User interface string for replaceDocumentBtn
  ///
  /// In en, this message translates to:
  /// **'Replace'**
  String get replaceDocumentBtn;

  /// User interface string for removeDocumentBtn
  ///
  /// In en, this message translates to:
  /// **'Remove'**
  String get removeDocumentBtn;

  /// User interface string for noDocumentSelected
  ///
  /// In en, this message translates to:
  /// **'No document selected'**
  String get noDocumentSelected;

  /// User interface string for attachedDocumentLabel
  ///
  /// In en, this message translates to:
  /// **'Attached Document'**
  String get attachedDocumentLabel;

  /// User interface string for fileNotSupported
  ///
  /// In en, this message translates to:
  /// **'File type not supported. Please upload a PDF, JPG, or PNG.'**
  String get fileNotSupported;

  /// User interface string for fileTooLarge
  ///
  /// In en, this message translates to:
  /// **'File is too large. Maximum size is 10 MB.'**
  String get fileTooLarge;

  /// User interface string for documentSelectedMsg
  ///
  /// In en, this message translates to:
  /// **'Document selected successfully'**
  String get documentSelectedMsg;

  /// User interface string for doctorDetailsTitle
  ///
  /// In en, this message translates to:
  /// **'Doctor Details'**
  String get doctorDetailsTitle;

  /// User interface string for qualificationLabel
  ///
  /// In en, this message translates to:
  /// **'Qualification'**
  String get qualificationLabel;

  /// User interface string for experienceLabel
  ///
  /// In en, this message translates to:
  /// **'Experience'**
  String get experienceLabel;

  /// User interface string for experienceYears
  ///
  /// In en, this message translates to:
  /// **'years experience'**
  String get experienceYears;

  /// User interface string for availabilityLabel
  ///
  /// In en, this message translates to:
  /// **'Availability'**
  String get availabilityLabel;

  /// User interface string for doctorAvailable
  ///
  /// In en, this message translates to:
  /// **'Available'**
  String get doctorAvailable;

  /// User interface string for doctorOnLeave
  ///
  /// In en, this message translates to:
  /// **'On Leave'**
  String get doctorOnLeave;

  /// User interface string for testCategoryLabel
  ///
  /// In en, this message translates to:
  /// **'Test Category'**
  String get testCategoryLabel;

  /// User interface string for testCategoryHint
  ///
  /// In en, this message translates to:
  /// **'e.g. Pathology, Biochemistry, Radiology'**
  String get testCategoryHint;

  /// User interface string for myAbhaCardTitle
  ///
  /// In en, this message translates to:
  /// **'My Health ID / ABHA'**
  String get myAbhaCardTitle;

  /// User interface string for myAbhaCardSubtitle
  ///
  /// In en, this message translates to:
  /// **'My Health ID / My ABHA Card'**
  String get myAbhaCardSubtitle;

  /// User interface string for myAbhaCard
  ///
  /// In en, this message translates to:
  /// **'My ABHA Card'**
  String get myAbhaCard;

  /// User interface string for myHealthId
  ///
  /// In en, this message translates to:
  /// **'My Health ID'**
  String get myHealthId;

  /// User interface string for qrCode
  ///
  /// In en, this message translates to:
  /// **'QR Code'**
  String get qrCode;

  /// User interface string for scanQrPrompt
  ///
  /// In en, this message translates to:
  /// **'Scan this QR code at hospital counters for instant registration'**
  String get scanQrPrompt;

  /// User interface string for emergencyContactsTitle
  ///
  /// In en, this message translates to:
  /// **'Emergency Contacts'**
  String get emergencyContactsTitle;

  /// User interface string for emergencyContactsSubtitle
  ///
  /// In en, this message translates to:
  /// **'Add and manage emergency contacts'**
  String get emergencyContactsSubtitle;

  /// User interface string for noEmergencyContacts
  ///
  /// In en, this message translates to:
  /// **'No emergency contacts added.'**
  String get noEmergencyContacts;

  /// User interface string for addEmergencyContactBtn
  ///
  /// In en, this message translates to:
  /// **'+ Add Emergency Contact'**
  String get addEmergencyContactBtn;

  /// User interface string for editContactBtn
  ///
  /// In en, this message translates to:
  /// **'Edit'**
  String get editContactBtn;

  /// User interface string for deleteContactBtn
  ///
  /// In en, this message translates to:
  /// **'Delete'**
  String get deleteContactBtn;

  /// User interface string for contactNameLabel
  ///
  /// In en, this message translates to:
  /// **'Contact Name'**
  String get contactNameLabel;

  /// User interface string for relationshipLabel
  ///
  /// In en, this message translates to:
  /// **'Relationship'**
  String get relationshipLabel;

  /// User interface string for mobileNumberFieldLabel
  ///
  /// In en, this message translates to:
  /// **'Mobile Number'**
  String get mobileNumberFieldLabel;

  /// User interface string for saveContactBtn
  ///
  /// In en, this message translates to:
  /// **'Save Contact'**
  String get saveContactBtn;

  /// User interface string for contactNameRequired
  ///
  /// In en, this message translates to:
  /// **'Contact name is required'**
  String get contactNameRequired;

  /// User interface string for validMobileRequired
  ///
  /// In en, this message translates to:
  /// **'Please enter a valid 10-digit mobile number'**
  String get validMobileRequired;

  /// User interface string for confirmDeleteTitle
  ///
  /// In en, this message translates to:
  /// **'Delete Contact?'**
  String get confirmDeleteTitle;

  /// User interface string for confirmDeleteMsg
  ///
  /// In en, this message translates to:
  /// **'Are you sure you want to remove this emergency contact?'**
  String get confirmDeleteMsg;

  /// User interface string for languageSettingsTitle
  ///
  /// In en, this message translates to:
  /// **'Language'**
  String get languageSettingsTitle;

  /// User interface string for tamilLang
  ///
  /// In en, this message translates to:
  /// **'Tamil'**
  String get tamilLang;

  /// User interface string for englishLang
  ///
  /// In en, this message translates to:
  /// **'English'**
  String get englishLang;

  /// User interface string for opdCardTitle
  ///
  /// In en, this message translates to:
  /// **'OPD Card'**
  String get opdCardTitle;

  /// User interface string for opdCardSubtitle
  ///
  /// In en, this message translates to:
  /// **'Digital Outpatient Department registration card'**
  String get opdCardSubtitle;

  /// User interface string for downloadOpdCardBtn
  ///
  /// In en, this message translates to:
  /// **'Download OPD Card'**
  String get downloadOpdCardBtn;

  /// User interface string for downloadingOpdCard
  ///
  /// In en, this message translates to:
  /// **'Generating and downloading OPD Card PDF...'**
  String get downloadingOpdCard;

  /// User interface string for opdCardDownloaded
  ///
  /// In en, this message translates to:
  /// **'OPD Card downloaded successfully'**
  String get opdCardDownloaded;

  /// User interface string for opdNumberLabel
  ///
  /// In en, this message translates to:
  /// **'OPD No'**
  String get opdNumberLabel;

  /// User interface string for patientIdLabel
  ///
  /// In en, this message translates to:
  /// **'Patient ID'**
  String get patientIdLabel;

  /// User interface string for patientNameLabel
  ///
  /// In en, this message translates to:
  /// **'Patient Name'**
  String get patientNameLabel;

  /// User interface string for registrationDateLabel
  ///
  /// In en, this message translates to:
  /// **'Registration Date'**
  String get registrationDateLabel;

  /// User interface string for medicalTitle
  ///
  /// In en, this message translates to:
  /// **'Medical'**
  String get medicalTitle;

  /// User interface string for medicalSubtitle
  ///
  /// In en, this message translates to:
  /// **'Nearby medical stores and pharmacies'**
  String get medicalSubtitle;

  /// User interface string for nearbyMedicalStores
  ///
  /// In en, this message translates to:
  /// **'Nearby Medical Stores'**
  String get nearbyMedicalStores;

  /// User interface string for open24x7
  ///
  /// In en, this message translates to:
  /// **'Open 24x7'**
  String get open24x7;

  /// User interface string for orderMedicinesBtn
  ///
  /// In en, this message translates to:
  /// **'Order Medicines'**
  String get orderMedicinesBtn;

  /// User interface string for orderMedicinesSubtitle
  ///
  /// In en, this message translates to:
  /// **'Order prescribed medicines from this record'**
  String get orderMedicinesSubtitle;

  /// User interface string for selectMedicinesTitle
  ///
  /// In en, this message translates to:
  /// **'Select Medicines'**
  String get selectMedicinesTitle;

  /// User interface string for reviewOrderTitle
  ///
  /// In en, this message translates to:
  /// **'Order Summary'**
  String get reviewOrderTitle;

  /// User interface string for confirmOrderBtn
  ///
  /// In en, this message translates to:
  /// **'Confirm Order'**
  String get confirmOrderBtn;

  /// User interface string for orderSuccessTitle
  ///
  /// In en, this message translates to:
  /// **'Order Placed Successfully'**
  String get orderSuccessTitle;

  /// User interface string for orderSuccessSubtitle
  ///
  /// In en, this message translates to:
  /// **'Your medicine order has been received.'**
  String get orderSuccessSubtitle;

  /// User interface string for orderIdLabel
  ///
  /// In en, this message translates to:
  /// **'Order ID'**
  String get orderIdLabel;

  /// User interface string for medicinesCountLabel
  ///
  /// In en, this message translates to:
  /// **'Medicines'**
  String get medicinesCountLabel;

  /// User interface string for pickupFacilityLabel
  ///
  /// In en, this message translates to:
  /// **'Pickup / Delivery Facility'**
  String get pickupFacilityLabel;

  /// User interface string for backToRecordsBtn
  ///
  /// In en, this message translates to:
  /// **'Back to Records'**
  String get backToRecordsBtn;

  /// User interface string for teleconsultationTitle
  ///
  /// In en, this message translates to:
  /// **'Teleconsultation'**
  String get teleconsultationTitle;

  /// User interface string for teleconsultationSubtitle
  ///
  /// In en, this message translates to:
  /// **'Consult with qualified government & private doctors remotely'**
  String get teleconsultationSubtitle;

  /// User interface string for searchDoctorHint
  ///
  /// In en, this message translates to:
  /// **'Search doctor by name or specialty...'**
  String get searchDoctorHint;

  /// User interface string for filterSpecialization
  ///
  /// In en, this message translates to:
  /// **'Specialization'**
  String get filterSpecialization;

  /// User interface string for filterAvailability
  ///
  /// In en, this message translates to:
  /// **'Availability'**
  String get filterAvailability;

  /// User interface string for availableNow
  ///
  /// In en, this message translates to:
  /// **'Available Now'**
  String get availableNow;

  /// User interface string for allAvailability
  ///
  /// In en, this message translates to:
  /// **'All Doctors'**
  String get allAvailability;

  /// User interface string for bookTeleconsultationBtn
  ///
  /// In en, this message translates to:
  /// **'Book Consultation'**
  String get bookTeleconsultationBtn;

  /// User interface string for consultationTypeTitle
  ///
  /// In en, this message translates to:
  /// **'Consultation Type'**
  String get consultationTypeTitle;

  /// User interface string for consultationTypeVideo
  ///
  /// In en, this message translates to:
  /// **'Video Call'**
  String get consultationTypeVideo;

  /// User interface string for consultationTypeAudio
  ///
  /// In en, this message translates to:
  /// **'Audio Call'**
  String get consultationTypeAudio;

  /// User interface string for consultationTypeChat
  ///
  /// In en, this message translates to:
  /// **'Chat'**
  String get consultationTypeChat;

  /// User interface string for consultationTypeVideoDesc
  ///
  /// In en, this message translates to:
  /// **'Face-to-face video consultation with your doctor'**
  String get consultationTypeVideoDesc;

  /// User interface string for consultationTypeAudioDesc
  ///
  /// In en, this message translates to:
  /// **'Direct voice consultation with your doctor'**
  String get consultationTypeAudioDesc;

  /// User interface string for consultationTypeChatDesc
  ///
  /// In en, this message translates to:
  /// **'Text messaging consultation with your doctor'**
  String get consultationTypeChatDesc;

  /// User interface string for selectDateTitle
  ///
  /// In en, this message translates to:
  /// **'Select Date'**
  String get selectDateTitle;

  /// User interface string for selectTimeSlotTitle
  ///
  /// In en, this message translates to:
  /// **'Select Time Slot'**
  String get selectTimeSlotTitle;

  /// User interface string for noSlotsAvailable
  ///
  /// In en, this message translates to:
  /// **'No time slots available for this date.'**
  String get noSlotsAvailable;

  /// User interface string for consultationSummaryTitle
  ///
  /// In en, this message translates to:
  /// **'Consultation Summary'**
  String get consultationSummaryTitle;

  /// User interface string for consultationDetailsSection
  ///
  /// In en, this message translates to:
  /// **'Consultation Details'**
  String get consultationDetailsSection;

  /// User interface string for patientDetailsSection
  ///
  /// In en, this message translates to:
  /// **'Patient Details'**
  String get patientDetailsSection;

  /// User interface string for confirmAndScheduleBtn
  ///
  /// In en, this message translates to:
  /// **'Confirm & Schedule Consultation'**
  String get confirmAndScheduleBtn;

  /// User interface string for consultationScheduledTitle
  ///
  /// In en, this message translates to:
  /// **'Consultation Scheduled!'**
  String get consultationScheduledTitle;

  /// User interface string for consultationScheduledSubtitle
  ///
  /// In en, this message translates to:
  /// **'Your remote consultation has been successfully booked.'**
  String get consultationScheduledSubtitle;

  /// User interface string for consultationIdLabel
  ///
  /// In en, this message translates to:
  /// **'Consultation ID'**
  String get consultationIdLabel;

  /// User interface string for addToAppointmentsBtn
  ///
  /// In en, this message translates to:
  /// **'Add to Appointments'**
  String get addToAppointmentsBtn;

  /// User interface string for doneBtn
  ///
  /// In en, this message translates to:
  /// **'Done'**
  String get doneBtn;

  /// User interface string for teleconsultationBadge
  ///
  /// In en, this message translates to:
  /// **'Teleconsultation'**
  String get teleconsultationBadge;

  /// User interface string for joinConsultationBtn
  ///
  /// In en, this message translates to:
  /// **'Join Consultation'**
  String get joinConsultationBtn;

  /// User interface string for prototypeConsultationNotice
  ///
  /// In en, this message translates to:
  /// **'Prototype Teleconsultation Simulation'**
  String get prototypeConsultationNotice;

  /// User interface string for connectingToDoctor
  ///
  /// In en, this message translates to:
  /// **'Connecting to doctor...'**
  String get connectingToDoctor;

  /// User interface string for consultationConnected
  ///
  /// In en, this message translates to:
  /// **'Connected'**
  String get consultationConnected;

  /// User interface string for muteMic
  ///
  /// In en, this message translates to:
  /// **'Mute'**
  String get muteMic;

  /// User interface string for unmuteMic
  ///
  /// In en, this message translates to:
  /// **'Unmute'**
  String get unmuteMic;

  /// User interface string for cameraOn
  ///
  /// In en, this message translates to:
  /// **'Turn Off Video'**
  String get cameraOn;

  /// User interface string for cameraOff
  ///
  /// In en, this message translates to:
  /// **'Turn On Video'**
  String get cameraOff;

  /// User interface string for switchCamera
  ///
  /// In en, this message translates to:
  /// **'Flip Camera'**
  String get switchCamera;

  /// User interface string for endConsultationBtn
  ///
  /// In en, this message translates to:
  /// **'End Consultation'**
  String get endConsultationBtn;

  /// User interface string for consultationEndedTitle
  ///
  /// In en, this message translates to:
  /// **'Consultation Ended'**
  String get consultationEndedTitle;

  /// User interface string for callDurationLabel
  ///
  /// In en, this message translates to:
  /// **'Call Duration'**
  String get callDurationLabel;

  /// User interface string for returnToHomeBtn
  ///
  /// In en, this message translates to:
  /// **'Return to Home'**
  String get returnToHomeBtn;

  /// User interface string for viewSummaryBtn
  ///
  /// In en, this message translates to:
  /// **'View Summary'**
  String get viewSummaryBtn;

  /// User interface string for chatInputHint
  ///
  /// In en, this message translates to:
  /// **'Type a message to doctor...'**
  String get chatInputHint;

  /// User interface string for sendBtn
  ///
  /// In en, this message translates to:
  /// **'Send'**
  String get sendBtn;

  /// User interface string for slotRequiredMsg
  ///
  /// In en, this message translates to:
  /// **'Please select a time slot to continue'**
  String get slotRequiredMsg;

  /// User interface string for dateRequiredMsg
  ///
  /// In en, this message translates to:
  /// **'Please select a consultation date'**
  String get dateRequiredMsg;

  /// User interface string for chooseLanguageTitle
  ///
  /// In en, this message translates to:
  /// **'Choose Language'**
  String get chooseLanguageTitle;

  /// User interface string for searchLanguageHint
  ///
  /// In en, this message translates to:
  /// **'Search language...'**
  String get searchLanguageHint;

  /// User interface string for changeLanguageSubtitle
  ///
  /// In en, this message translates to:
  /// **'Tap to change'**
  String get changeLanguageSubtitle;

  /// User interface string for notificationsHealthAlertsTitle
  ///
  /// In en, this message translates to:
  /// **'Notifications & Health Alerts'**
  String get notificationsHealthAlertsTitle;

  /// User interface string for consentPrivacyTitle
  ///
  /// In en, this message translates to:
  /// **'Consent & Privacy'**
  String get consentPrivacyTitle;

  /// User interface string for notificationsConfigured
  ///
  /// In en, this message translates to:
  /// **'Notifications settings configured.'**
  String get notificationsConfigured;

  /// User interface string for consentPrivacyConfigured
  ///
  /// In en, this message translates to:
  /// **'Consent & Privacy configured.'**
  String get consentPrivacyConfigured;

  /// User interface string for nhmAbdmCompliant
  ///
  /// In en, this message translates to:
  /// **'National Health Mission • ABDM Compliant'**
  String get nhmAbdmCompliant;

  /// User interface string for appVersionStep
  ///
  /// In en, this message translates to:
  /// **'CareBridge v1.0.0 (Step 1)'**
  String get appVersionStep;

  /// User interface string for tapToChange
  ///
  /// In en, this message translates to:
  /// **'Tap to change'**
  String get tapToChange;

  /// User interface string for quickActionHealthcareServices
  ///
  /// In en, this message translates to:
  /// **'Healthcare Services'**
  String get quickActionHealthcareServices;

  /// User interface string for myAppointmentsTitle
  ///
  /// In en, this message translates to:
  /// **'My Appointments'**
  String get myAppointmentsTitle;

  /// User interface string for okBtn
  ///
  /// In en, this message translates to:
  /// **'OK'**
  String get okBtn;

  /// User interface string for closeTooltip
  ///
  /// In en, this message translates to:
  /// **'Close'**
  String get closeTooltip;

  /// User interface string for tooltipHome
  ///
  /// In en, this message translates to:
  /// **'Navigate to Home Tab'**
  String get tooltipHome;

  /// User interface string for tooltipAppointments
  ///
  /// In en, this message translates to:
  /// **'Navigate to Appointments Tab'**
  String get tooltipAppointments;

  /// User interface string for tooltipCare
  ///
  /// In en, this message translates to:
  /// **'Navigate to Care Tab'**
  String get tooltipCare;

  /// User interface string for tooltipRecords
  ///
  /// In en, this message translates to:
  /// **'Navigate to Health Records Tab'**
  String get tooltipRecords;

  /// User interface string for tooltipProfile
  ///
  /// In en, this message translates to:
  /// **'Navigate to Profile Tab'**
  String get tooltipProfile;

  /// User interface string for bookAppointmentTitle
  ///
  /// In en, this message translates to:
  /// **'Book Appointment'**
  String get bookAppointmentTitle;

  /// User interface string for step1SelectDistrict
  ///
  /// In en, this message translates to:
  /// **'Step 1 of 5'**
  String get step1SelectDistrict;

  /// User interface string for selectDistrictTitle
  ///
  /// In en, this message translates to:
  /// **'Select District'**
  String get selectDistrictTitle;

  /// User interface string for loadingDistricts
  ///
  /// In en, this message translates to:
  /// **'Loading districts...'**
  String get loadingDistricts;

  /// User interface string for noDistrictsAvailable
  ///
  /// In en, this message translates to:
  /// **'No Districts Available'**
  String get noDistrictsAvailable;

  /// User interface string for noDistrictsDesc
  ///
  /// In en, this message translates to:
  /// **'Please check back later or refresh.'**
  String get noDistrictsDesc;

  /// User interface string for continueToHospitals
  ///
  /// In en, this message translates to:
  /// **'Continue to Hospitals'**
  String get continueToHospitals;

  /// User interface string for step2SelectHospital
  ///
  /// In en, this message translates to:
  /// **'Step 2 of 5'**
  String get step2SelectHospital;

  /// User interface string for selectHospitalIn
  ///
  /// In en, this message translates to:
  /// **'Select Hospital in'**
  String get selectHospitalIn;

  /// User interface string for loadingHospitals
  ///
  /// In en, this message translates to:
  /// **'Loading hospitals...'**
  String get loadingHospitals;

  /// User interface string for noHospitalsAvailable
  ///
  /// In en, this message translates to:
  /// **'No Hospitals Available'**
  String get noHospitalsAvailable;

  /// User interface string for noHospitalsDesc
  ///
  /// In en, this message translates to:
  /// **'No hospitals found in this district.'**
  String get noHospitalsDesc;

  /// User interface string for callingHospital
  ///
  /// In en, this message translates to:
  /// **'Calling'**
  String get callingHospital;

  /// User interface string for continueToDoctors
  ///
  /// In en, this message translates to:
  /// **'Continue to Doctors'**
  String get continueToDoctors;

  /// User interface string for step3SelectDoctor
  ///
  /// In en, this message translates to:
  /// **'Step 3 of 5'**
  String get step3SelectDoctor;

  /// User interface string for selectDoctorAt
  ///
  /// In en, this message translates to:
  /// **'Select Doctor at'**
  String get selectDoctorAt;

  /// User interface string for loadingDoctors
  ///
  /// In en, this message translates to:
  /// **'Loading doctors...'**
  String get loadingDoctors;

  /// User interface string for noDoctorsAvailable
  ///
  /// In en, this message translates to:
  /// **'No Doctors Available'**
  String get noDoctorsAvailable;

  /// User interface string for noDoctorsDesc
  ///
  /// In en, this message translates to:
  /// **'No available doctors found for this hospital.'**
  String get noDoctorsDesc;

  /// User interface string for continueToDateTime
  ///
  /// In en, this message translates to:
  /// **'Continue to Date & Time'**
  String get continueToDateTime;

  /// User interface string for step4SelectDateTime
  ///
  /// In en, this message translates to:
  /// **'Step 4 of 5'**
  String get step4SelectDateTime;

  /// User interface string for selectDateTimeFor
  ///
  /// In en, this message translates to:
  /// **'Select Date & Time for'**
  String get selectDateTimeFor;

  /// User interface string for selectDateHeader
  ///
  /// In en, this message translates to:
  /// **'Select Date'**
  String get selectDateHeader;

  /// User interface string for availableSlotsHeader
  ///
  /// In en, this message translates to:
  /// **'Available Slots'**
  String get availableSlotsHeader;

  /// User interface string for morningSlots
  ///
  /// In en, this message translates to:
  /// **'Morning Slots'**
  String get morningSlots;

  /// User interface string for afternoonSlots
  ///
  /// In en, this message translates to:
  /// **'Afternoon Slots'**
  String get afternoonSlots;

  /// User interface string for eveningSlots
  ///
  /// In en, this message translates to:
  /// **'Evening Slots'**
  String get eveningSlots;

  /// User interface string for continueToSummary
  ///
  /// In en, this message translates to:
  /// **'Continue to Summary'**
  String get continueToSummary;

  /// User interface string for step5ConfirmDetails
  ///
  /// In en, this message translates to:
  /// **'Step 5 of 5'**
  String get step5ConfirmDetails;

  /// User interface string for confirmAppointmentDetails
  ///
  /// In en, this message translates to:
  /// **'Confirm Appointment Details'**
  String get confirmAppointmentDetails;

  /// User interface string for patientProfileSection
  ///
  /// In en, this message translates to:
  /// **'Patient Profile'**
  String get patientProfileSection;

  /// User interface string for appointmentSummaryTitle
  ///
  /// In en, this message translates to:
  /// **'Appointment Summary'**
  String get appointmentSummaryTitle;

  /// User interface string for districtLabel
  ///
  /// In en, this message translates to:
  /// **'District'**
  String get districtLabel;

  /// User interface string for hospitalLabel
  ///
  /// In en, this message translates to:
  /// **'Hospital'**
  String get hospitalLabel;

  /// User interface string for dateTimeLabel
  ///
  /// In en, this message translates to:
  /// **'Date & Time'**
  String get dateTimeLabel;

  /// User interface string for hospitalContactLabel
  ///
  /// In en, this message translates to:
  /// **'Hospital Contact'**
  String get hospitalContactLabel;

  /// User interface string for confirmAppointmentBtn
  ///
  /// In en, this message translates to:
  /// **'Confirm Appointment'**
  String get confirmAppointmentBtn;

  /// User interface string for confirmingStatus
  ///
  /// In en, this message translates to:
  /// **'Confirming...'**
  String get confirmingStatus;

  /// User interface string for appointmentConfirmedTitle
  ///
  /// In en, this message translates to:
  /// **'Appointment Confirmed!'**
  String get appointmentConfirmedTitle;

  /// User interface string for bookingIdLabel
  ///
  /// In en, this message translates to:
  /// **'Booking ID'**
  String get bookingIdLabel;

  /// User interface string for bookingDetailsTitle
  ///
  /// In en, this message translates to:
  /// **'Booking Details'**
  String get bookingDetailsTitle;

  /// User interface string for statusLabel
  ///
  /// In en, this message translates to:
  /// **'Status'**
  String get statusLabel;

  /// User interface string for prototypeNotice
  ///
  /// In en, this message translates to:
  /// **'Demo Notice: This appointment is registered in prototype mode for CareBridge demonstration.'**
  String get prototypeNotice;

  /// User interface string for upcomingTab
  ///
  /// In en, this message translates to:
  /// **'Upcoming'**
  String get upcomingTab;

  /// User interface string for pastConsultationsTab
  ///
  /// In en, this message translates to:
  /// **'Past Consultations'**
  String get pastConsultationsTab;

  /// User interface string for tokenLabel
  ///
  /// In en, this message translates to:
  /// **'Token'**
  String get tokenLabel;

  /// User interface string for rescheduleBtn
  ///
  /// In en, this message translates to:
  /// **'Reschedule'**
  String get rescheduleBtn;

  /// User interface string for rescheduleComingSoon
  ///
  /// In en, this message translates to:
  /// **'Rescheduling will be enabled in future steps.'**
  String get rescheduleComingSoon;

  /// User interface string for nearbyHealthcareSetup
  ///
  /// In en, this message translates to:
  /// **'Nearby Healthcare Setup'**
  String get nearbyHealthcareSetup;

  /// User interface string for findNearbyCare
  ///
  /// In en, this message translates to:
  /// **'Find Nearby Care'**
  String get findNearbyCare;

  /// User interface string for locationPermissionDesc
  ///
  /// In en, this message translates to:
  /// **'CareBridge uses your location to discover nearby Primary Health Centres (PHCs), district hospitals, and emergency medical services.'**
  String get locationPermissionDesc;

  /// User interface string for discoverPhcsTitle
  ///
  /// In en, this message translates to:
  /// **'Discover Primary Health Centres'**
  String get discoverPhcsTitle;

  /// User interface string for discoverPhcsDesc
  ///
  /// In en, this message translates to:
  /// **'Locate government PHCs and CHCs near your village or town.'**
  String get discoverPhcsDesc;

  /// User interface string for emergencyHospitalsTitle
  ///
  /// In en, this message translates to:
  /// **'24x7 Emergency Hospitals'**
  String get emergencyHospitalsTitle;

  /// User interface string for emergencyHospitalsDesc
  ///
  /// In en, this message translates to:
  /// **'Find emergency facilities and ambulance contacts instantly.'**
  String get emergencyHospitalsDesc;

  /// User interface string for enableLocationAccess
  ///
  /// In en, this message translates to:
  /// **'Enable Location Access'**
  String get enableLocationAccess;

  /// User interface string for skipUseDefaultRegion
  ///
  /// In en, this message translates to:
  /// **'Skip & Use Default Region (Salem)'**
  String get skipUseDefaultRegion;

  /// User interface string for primaryHealthcareFacilityTitle
  ///
  /// In en, this message translates to:
  /// **'Primary Healthcare Facility'**
  String get primaryHealthcareFacilityTitle;

  /// User interface string for nearbyFacilitiesSubtitle
  ///
  /// In en, this message translates to:
  /// **'Select your primary facility to receive care updates, appointments, and record syncing.'**
  String get nearbyFacilitiesSubtitle;

  /// User interface string for facilitiesNearYou
  ///
  /// In en, this message translates to:
  /// **'Facilities Near You'**
  String get facilitiesNearYou;

  /// User interface string for patientAccessTitle
  ///
  /// In en, this message translates to:
  /// **'Patient Access'**
  String get patientAccessTitle;

  /// User interface string for loginDemoNotice
  ///
  /// In en, this message translates to:
  /// **'Demo Mode: Enter any 10-digit number (e.g. 9876543210). Verification OTP will be generated.'**
  String get loginDemoNotice;

  /// User interface string for abdmTitle
  ///
  /// In en, this message translates to:
  /// **'Ayushman Bharat Digital Mission'**
  String get abdmTitle;

  /// User interface string for connectAbhaCardTitle
  ///
  /// In en, this message translates to:
  /// **'Connect ABHA Card'**
  String get connectAbhaCardTitle;

  /// User interface string for noAbhaCardLinkedDesc
  ///
  /// In en, this message translates to:
  /// **'No existing ABHA card was found linked to mobile number'**
  String get noAbhaCardLinkedDesc;

  /// User interface string for whatIsAbha
  ///
  /// In en, this message translates to:
  /// **'What is ABHA?'**
  String get whatIsAbha;

  /// User interface string for whatIsAbhaDesc
  ///
  /// In en, this message translates to:
  /// **'ABHA (Ayushman Bharat Health Account) is a 14-digit digital ID that links all your health records across hospitals, PHCs, and diagnostic labs nationwide.'**
  String get whatIsAbhaDesc;

  /// User interface string for skipForNowContinue
  ///
  /// In en, this message translates to:
  /// **'Skip for Now & Continue'**
  String get skipForNowContinue;

  /// User interface string for couldNotOpenAbhaPage
  ///
  /// In en, this message translates to:
  /// **'Could not open ABHA registration page'**
  String get couldNotOpenAbhaPage;

  /// User interface string for welcomeToCareBridge
  ///
  /// In en, this message translates to:
  /// **'Welcome to CareBridge'**
  String get welcomeToCareBridge;

  /// User interface string for onboardingWelcomeDesc
  ///
  /// In en, this message translates to:
  /// **'Easily find nearby healthcare services, manage doctor consultations, and receive public health updates for your community.'**
  String get onboardingWelcomeDesc;

  /// User interface string for onboardingHealthcareCloser
  ///
  /// In en, this message translates to:
  /// **'Healthcare, closer to you'**
  String get onboardingHealthcareCloser;

  /// User interface string for onboardingRuralAccess
  ///
  /// In en, this message translates to:
  /// **'Designed for rural & community access'**
  String get onboardingRuralAccess;

  /// User interface string for onboardingRuralDesc
  ///
  /// In en, this message translates to:
  /// **'Connect with Primary Health Centres, dispensaries, and health camps right in your neighborhood.'**
  String get onboardingRuralDesc;

  /// User interface string for onboardingControlPrivacy
  ///
  /// In en, this message translates to:
  /// **'Your health information, under your control'**
  String get onboardingControlPrivacy;

  /// User interface string for onboardingConsentAssistance
  ///
  /// In en, this message translates to:
  /// **'Consent-driven healthcare assistance'**
  String get onboardingConsentAssistance;

  /// User interface string for onboardingConsentDesc
  ///
  /// In en, this message translates to:
  /// **'Your healthcare information is accessed only with your explicit permission, keeping your privacy secure.'**
  String get onboardingConsentDesc;

  /// User interface string for chooseYourLanguage
  ///
  /// In en, this message translates to:
  /// **'Choose your language'**
  String get chooseYourLanguage;

  /// User interface string for selectAllBtn
  ///
  /// In en, this message translates to:
  /// **'Select All'**
  String get selectAllBtn;

  /// User interface string for deselectAllBtn
  ///
  /// In en, this message translates to:
  /// **'Deselect All'**
  String get deselectAllBtn;

  /// User interface string for prescriptionLabel
  ///
  /// In en, this message translates to:
  /// **'Prescription'**
  String get prescriptionLabel;

  /// User interface string for prescriptionIdLabel
  ///
  /// In en, this message translates to:
  /// **'Prescription ID'**
  String get prescriptionIdLabel;

  /// User interface string for relationshipHint
  ///
  /// In en, this message translates to:
  /// **'e.g. Father, Mother, Spouse'**
  String get relationshipHint;

  /// User interface string for emergencyContactFallback
  ///
  /// In en, this message translates to:
  /// **'Emergency Contact'**
  String get emergencyContactFallback;

  /// User interface string for saveFacilityContinue
  ///
  /// In en, this message translates to:
  /// **'Save Facility & Continue to Dashboard'**
  String get saveFacilityContinue;

  /// User interface string for loadingTimeSlots
  ///
  /// In en, this message translates to:
  /// **'Loading time slots...'**
  String get loadingTimeSlots;

  /// User interface string for noSlotsAvailableDesc
  ///
  /// In en, this message translates to:
  /// **'No available slots for the selected date. Please pick another date.'**
  String get noSlotsAvailableDesc;

  /// User interface string for addressLabel
  ///
  /// In en, this message translates to:
  /// **'Address'**
  String get addressLabel;

  /// User interface string for nearbyFacilitiesTitle
  ///
  /// In en, this message translates to:
  /// **'Nearby Healthcare Facilities'**
  String get nearbyFacilitiesTitle;

  /// User interface string for createNewAbhaCard
  ///
  /// In en, this message translates to:
  /// **'Create New ABHA Card'**
  String get createNewAbhaCard;

  /// User interface string for selectAbhaProfilePrompt
  ///
  /// In en, this message translates to:
  /// **'Select the ABHA card profile you wish to link with CareBridge.'**
  String get selectAbhaProfilePrompt;

  /// User interface string for enterMobileValidation
  ///
  /// In en, this message translates to:
  /// **'Please enter your mobile number.'**
  String get enterMobileValidation;

  /// User interface string for enterValidMobileValidation
  ///
  /// In en, this message translates to:
  /// **'Please enter a valid 10-digit mobile number.'**
  String get enterValidMobileValidation;
}

class _AppGenLocalizationsDelegate
    extends LocalizationsDelegate<AppGenLocalizations> {
  const _AppGenLocalizationsDelegate();

  @override
  Future<AppGenLocalizations> load(Locale locale) {
    return SynchronousFuture<AppGenLocalizations>(
      lookupAppGenLocalizations(locale),
    );
  }

  @override
  bool isSupported(Locale locale) => <String>[
    'as',
    'bn',
    'br',
    'doi',
    'en',
    'gu',
    'hi',
    'kn',
    'kok',
    'ks',
    'mai',
    'ml',
    'mni',
    'mr',
    'ne',
    'or',
    'pa',
    'sa',
    'sat',
    'sd',
    'ta',
    'te',
    'ur',
  ].contains(locale.languageCode);

  @override
  bool shouldReload(_AppGenLocalizationsDelegate old) => false;
}

AppGenLocalizations lookupAppGenLocalizations(Locale locale) {
  // Lookup logic when only language code is specified.
  switch (locale.languageCode) {
    case 'as':
      return AppGenLocalizationsAs();
    case 'bn':
      return AppGenLocalizationsBn();
    case 'br':
      return AppGenLocalizationsBr();
    case 'doi':
      return AppGenLocalizationsDoi();
    case 'en':
      return AppGenLocalizationsEn();
    case 'gu':
      return AppGenLocalizationsGu();
    case 'hi':
      return AppGenLocalizationsHi();
    case 'kn':
      return AppGenLocalizationsKn();
    case 'kok':
      return AppGenLocalizationsKok();
    case 'ks':
      return AppGenLocalizationsKs();
    case 'mai':
      return AppGenLocalizationsMai();
    case 'ml':
      return AppGenLocalizationsMl();
    case 'mni':
      return AppGenLocalizationsMni();
    case 'mr':
      return AppGenLocalizationsMr();
    case 'ne':
      return AppGenLocalizationsNe();
    case 'or':
      return AppGenLocalizationsOr();
    case 'pa':
      return AppGenLocalizationsPa();
    case 'sa':
      return AppGenLocalizationsSa();
    case 'sat':
      return AppGenLocalizationsSat();
    case 'sd':
      return AppGenLocalizationsSd();
    case 'ta':
      return AppGenLocalizationsTa();
    case 'te':
      return AppGenLocalizationsTe();
    case 'ur':
      return AppGenLocalizationsUr();
  }

  throw FlutterError(
    'AppGenLocalizations.delegate failed to load unsupported locale "$locale". This is likely '
    'an issue with the localizations generation tool. Please file an issue '
    'on GitHub with a reproducible sample app and the gen-l10n configuration '
    'that was used.',
  );
}
