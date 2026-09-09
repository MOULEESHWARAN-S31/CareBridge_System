import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:care_bridge/core/localization/app_localizations.dart';
import 'package:care_bridge/core/services/session_service.dart';
import 'package:care_bridge/features/abha/domain/abha_profile.dart';
import 'package:care_bridge/features/profile/profile_screen.dart';
import 'package:care_bridge/features/profile/emergency_contacts_screen.dart';
import 'package:care_bridge/features/healthcare/care_screen.dart';
import 'package:care_bridge/features/location/domain/healthcare_facility.dart';
import 'package:care_bridge/features/location/domain/location_service.dart';
import 'package:care_bridge/features/location/data/location_service_impl.dart';
import 'package:care_bridge/features/health_records/record_detail_screen.dart';
import 'package:care_bridge/shared/models/mock_models.dart';
import 'package:care_bridge/shared/services/mock_data_service.dart';
import 'package:care_bridge/features/authentication/data/mock_auth_repository.dart';
import 'package:care_bridge/features/authentication/presentation/authentication_controller.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:qr_flutter/qr_flutter.dart';

class TestLocationService implements LocationService {
  final UserLocation? locationToReturn;
  final bool permissionGranted;

  TestLocationService({
    this.locationToReturn = const UserLocation(latitude: 11.6643, longitude: 78.1460),
    this.permissionGranted = true,
  });

  @override
  Future<bool> isPermissionGranted() async => permissionGranted;

  @override
  Future<bool> requestPermission() async => permissionGranted;

  @override
  Future<UserLocation?> getCurrentLocation() async => locationToReturn;

  @override
  Future<List<HealthcareFacility>> getFacilities() async => LocationServiceImpl.sampleFacilities;

  @override
  Future<List<HealthcareFacility>> getNearestFacilities(UserLocation userLoc) async {
    final list = LocationServiceImpl.sampleFacilities.map((f) {
      final dist = f.calculateDistance(userLoc.latitude, userLoc.longitude);
      return f.copyWith(distanceKm: dist);
    }).toList();
    list.sort((a, b) => (a.distanceKm ?? 0).compareTo(b.distanceKm ?? 0));
    return list;
  }
}

class TestAppHost extends StatefulWidget {
  final Widget child;
  final Locale initialLocale;
  final AuthenticationController? authController;
  final SessionService? sessionService;

  const TestAppHost({
    super.key,
    required this.child,
    this.initialLocale = const Locale('en'),
    this.authController,
    this.sessionService,
  });

  @override
  State<TestAppHost> createState() => _TestAppHostState();
}

class _TestAppHostState extends State<TestAppHost> {
  late Locale _locale;
  late final AuthenticationController _controller;

  @override
  void initState() {
    super.initState();
    _locale = widget.initialLocale;
    final effectiveSession = widget.sessionService ?? SessionService();
    _controller = widget.authController ??
        AuthenticationController(
          repository: MockAuthRepository(sessionService: effectiveSession),
          sessionService: effectiveSession,
          onLocaleChanged: (newLoc) => setState(() => _locale = newLoc),
        );
  }

  @override
  Widget build(BuildContext context) {
    return CareBridgeAuthScope(
      controller: _controller,
      child: MaterialApp(
        locale: _locale,
        supportedLocales: AppLocalizations.supportedLocales,
        localizationsDelegates: const [
          AppLocalizations.delegate,
          GlobalMaterialLocalizations.delegate,
          GlobalWidgetsLocalizations.delegate,
          GlobalCupertinoLocalizations.delegate,
        ],
        home: widget.child,
      ),
    );
  }
}

Widget createTestApp(
  Widget child, {
  Locale locale = const Locale('en'),
  AuthenticationController? authController,
  SessionService? sessionService,
}) {
  return TestAppHost(
    initialLocale: locale,
    authController: authController,
    sessionService: sessionService,
    child: child,
  );
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  setUp(() async {
    SharedPreferences.setMockInitialValues({});
  });

  group('1. Profile — My Health ID / My ABHA Card & Removal of Old Sections', () {
    testWidgets('1.1. My ABHA Card option appears in Profile, Family Members & old Emergency Contact are removed', (tester) async {
      tester.view.physicalSize = const Size(800, 1600);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      await tester.pumpWidget(createTestApp(const ProfileScreen()));
      await tester.pumpAndSettle();

      // My ABHA Card menu item is prominently displayed
      expect(find.byKey(const Key('profile_menu_my_abha_card')), findsOneWidget);
      expect(find.text('My Health ID / My ABHA Card'), findsOneWidget);

      // OPD Card menu item is prominently displayed
      expect(find.byKey(const Key('profile_menu_opd_card')), findsOneWidget);
      expect(find.text('OPD Card'), findsOneWidget);

      // Emergency Contacts menu item is displayed
      expect(find.byKey(const Key('profile_menu_emergency_contacts')), findsOneWidget);

      // Family Members must NOT be present
      expect(find.text('Family Members'), findsNothing);
      expect(find.byKey(const Key('profile_menu_family_members')), findsNothing);

      // Old static single emergency contact card must NOT be present
      expect(find.byKey(const Key('old_emergency_contact_card')), findsNothing);
    });

    testWidgets('1.2. My ABHA Card dialog displays active patient profile and dynamic QR code', (tester) async {
      tester.view.physicalSize = const Size(800, 1600);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      final session = SessionService();
      const customProfile = AbhaProfile(
        id: '99-8888-7777-6666',
        name: 'Mouleeshwaran S',
        abhaAddress: 'moulee@abdm',
        abhaNumber: '99-8888-7777-6666',
        gender: 'Male',
        dateOfBirth: '2001-08-20',
        mobileNumber: '9876543210',
        relationship: 'Self',
        address: '123 Anna Nagar',
        district: 'Salem',
        city: 'Salem',
        state: 'Tamil Nadu',
      );
      await session.setActiveAbhaProfile(customProfile);

      await tester.pumpWidget(createTestApp(const ProfileScreen(), sessionService: session));
      await tester.pumpAndSettle();

      // Open My ABHA Card
      await tester.tap(find.byKey(const Key('profile_menu_my_abha_card')));
      await tester.pumpAndSettle();

      // Verify active patient data in dialog
      expect(find.text('Mouleeshwaran S'), findsWidgets);
      expect(find.text('moulee@abdm'), findsWidgets);
      expect(find.text('99-8888-7777-6666'), findsWidgets);
      expect(find.textContaining('Male'), findsWidgets);
      expect(find.textContaining('2001-08-20'), findsWidgets);

      // Dynamic QR Code exists
      expect(find.byType(QrImageView), findsOneWidget);
    });
  });

  group('2. Emergency Contacts Management', () {
    testWidgets('2.1. Initial state is empty with No emergency contacts added', (tester) async {
      tester.view.physicalSize = const Size(800, 1600);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      await tester.pumpWidget(createTestApp(const EmergencyContactsScreen()));
      await tester.pumpAndSettle();

      // Must be empty initial state
      expect(find.text('No emergency contacts added.'), findsOneWidget);
      expect(find.byKey(const Key('add_emergency_contact_button')), findsOneWidget);
      expect(find.text('Father'), findsNothing);
      expect(find.text('Mother'), findsNothing);
    });

    testWidgets('2.2. Adding contact with validation, editing and deleting with confirmation', (tester) async {
      tester.view.physicalSize = const Size(800, 1600);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      final session = SessionService();
      await tester.pumpWidget(createTestApp(
        EmergencyContactsScreen(sessionServiceOverride: session),
        sessionService: session,
      ));
      await tester.pumpAndSettle();

      // Open Add dialog
      await tester.tap(find.byKey(const Key('add_emergency_contact_button')));
      await tester.pumpAndSettle();

      // Try to save empty form - validation triggers
      await tester.tap(find.byKey(const Key('save_emergency_contact_button')));
      await tester.pumpAndSettle();
      expect(find.text('Contact name is required'), findsOneWidget);

      // Fill in invalid phone
      await tester.enterText(find.byKey(const Key('emergency_contact_name_field')), 'Kavitha');
      await tester.enterText(find.byKey(const Key('emergency_contact_mobile_field')), '12345');
      await tester.tap(find.byKey(const Key('save_emergency_contact_button')));
      await tester.pumpAndSettle();
      expect(find.text('Please enter a valid 10-digit mobile number'), findsOneWidget);

      // Fill in valid details
      await tester.enterText(find.byKey(const Key('emergency_contact_mobile_field')), '9876543210');
      await tester.enterText(find.byKey(const Key('emergency_contact_relationship_field')), 'Sister');
      await tester.tap(find.byKey(const Key('save_emergency_contact_button')));
      await tester.pumpAndSettle();

      // Contact now visible in list
      expect(find.text('Kavitha'), findsOneWidget);
      expect(find.textContaining('Sister'), findsOneWidget);
      expect(find.textContaining('+91 98765 43210'), findsOneWidget);

      // SessionService has the persisted contact
      final contacts = session.getEmergencyContacts();
      expect(contacts.length, equals(1));
      expect(contacts.first.name, equals('Kavitha'));

      // Edit contact
      final editBtn = find.byKey(Key('edit_contact_${contacts.first.id}'));
      await tester.tap(editBtn);
      await tester.pumpAndSettle();

      await tester.enterText(find.byKey(const Key('emergency_contact_name_field')), 'Kavitha S');
      await tester.tap(find.byKey(const Key('save_emergency_contact_button')));
      await tester.pumpAndSettle();

      expect(find.text('Kavitha S'), findsOneWidget);
      expect(session.getEmergencyContacts().first.name, equals('Kavitha S'));

      // Delete contact with confirmation
      final deleteBtn = find.byKey(Key('delete_contact_${contacts.first.id}'));
      await tester.tap(deleteBtn);
      await tester.pumpAndSettle();

      expect(find.text('Delete Contact?'), findsOneWidget);
      await tester.tap(find.byKey(const Key('confirm_delete_contact_button')));
      await tester.pumpAndSettle();

      // Should return to empty state
      expect(find.text('No emergency contacts added.'), findsOneWidget);
      expect(session.getEmergencyContacts().isEmpty, isTrue);
    });
  });

  group('3. Language Selector — Tamil & English Only & Global Locale Updates', () {
    testWidgets('3.1. Shows exactly Tamil and English options and switches locale', (tester) async {
      tester.view.physicalSize = const Size(800, 1600);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      final session = SessionService();
      await tester.pumpWidget(createTestApp(const ProfileScreen(), sessionService: session));
      await tester.pumpAndSettle();

      // Check that Tamil and English options exist
      expect(find.byKey(const Key('language_option_ta')), findsOneWidget);
      expect(find.byKey(const Key('language_option_en')), findsOneWidget);

      // Hindi should NOT be in this language selector
      expect(find.byKey(const Key('language_option_hi')), findsNothing);

      // Switching to Tamil updates SessionService
      await tester.tap(find.byKey(const Key('language_option_ta')));
      await tester.pumpAndSettle();
      expect(session.getPreferredLanguage(), equals('ta'));

      // Switching back to English updates SessionService
      await tester.tap(find.byKey(const Key('language_option_en')));
      await tester.pumpAndSettle();
      expect(session.getPreferredLanguage(), equals('en'));
    });
  });

  group('4. OPD Card & Real PDF Generation', () {
    testWidgets('4.1. Displays active patient & facility details, QR Code, and generates PDF', (tester) async {
      tester.view.physicalSize = const Size(800, 1600);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      final session = SessionService();
      const patient = AbhaProfile(
        id: '12-3456-7890-9999',
        name: 'Anand Krishnan',
        abhaAddress: 'anand.k@abdm',
        abhaNumber: '12-3456-7890-9999',
        gender: 'Male',
        dateOfBirth: '1985-04-12',
        mobileNumber: '9123456780',
        relationship: 'Self',
        address: 'Main Road',
        district: 'Salem',
        city: 'Salem',
        state: 'Tamil Nadu',
      );
      const facility = HealthcareFacility(
        id: 'hosp_slm_gh',
        name: 'Salem District HQ Hospital',
        type: FacilityType.hospital,
        contactPhone: '0427-2400100',
        latitude: 11.6643,
        longitude: 78.1460,
      );
      await session.setActiveAbhaProfile(patient);
      await session.setAssignedFacility(facility);

      await tester.pumpWidget(createTestApp(const ProfileScreen(), sessionService: session));
      await tester.pumpAndSettle();

      // Open OPD Card
      await tester.tap(find.byKey(const Key('profile_menu_opd_card')));
      await tester.pumpAndSettle();

      // Details displayed
      expect(find.text('Anand Krishnan'), findsWidgets);
      expect(find.text('12-3456-7890-9999'), findsWidgets);
      expect(find.text('Salem District HQ Hospital'), findsWidgets);
      expect(find.textContaining('OPD-2026-'), findsWidgets);
      expect(find.byType(QrImageView), findsOneWidget);

      // Download button exists and can be tapped (generates actual PDF bytes)
      final downloadBtn = find.byKey(const Key('download_opd_card_button'));
      expect(downloadBtn, findsOneWidget);
      await tester.tap(downloadBtn);
      await tester.pump(const Duration(milliseconds: 100));

      // Facility & ABHA remain unchanged
      expect(session.getAssignedFacility()?.name, equals('Salem District HQ Hospital'));
      expect(session.getActiveAbhaProfile()?.name, equals('Anand Krishnan'));
    });
  });

  group('5. Care Section — Medical Stores / Pharmacies', () {
    testWidgets('5.1. Medical card opens nearby medical stores without changing assigned facility', (tester) async {
      tester.view.physicalSize = const Size(800, 1600);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      final session = SessionService();
      const initialAssigned = HealthcareFacility(
        id: 'assigned_phc_initial',
        name: 'Initial Assigned PHC',
        type: FacilityType.phc,
        contactPhone: '0427-123456',
        latitude: 11.6,
        longitude: 78.1,
      );
      await session.setAssignedFacility(initialAssigned);

      await tester.pumpWidget(
        createTestApp(
          CareScreen(
            locationServiceOverride: TestLocationService(),
          ),
        ),
      );
      await tester.pumpAndSettle();

      // Medical card is displayed in Care screen
      final medicalCard = find.byKey(const Key('service_medical_card'));
      expect(medicalCard, findsOneWidget);

      // Tap to open Medical Stores Discovery
      await tester.tap(medicalCard);
      await tester.pumpAndSettle();

      // Medical stores discovery screen opens
      expect(find.text('Nearby Medical Stores'), findsWidgets);

      // Medical stores from sample facilities are listed
      expect(find.textContaining('Pharmacy'), findsWidgets);

      // Assigned facility remains completely untouched
      expect(session.getAssignedFacility()?.id, equals('assigned_phc_initial'));
    });
  });

  group('6. Prescription Ordering — Medicine Selection & Order Success', () {
    testWidgets('6.1. Order Medicines from prescription generates order and leaves original prescription intact', (tester) async {
      tester.view.physicalSize = const Size(800, 2000);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      final initialPrescriptions = MockDataService.instance
          .getHealthRecords()
          .where((r) => r.category == HealthRecordCategory.prescriptions)
          .toList();
      expect(initialPrescriptions.isNotEmpty, isTrue);
      final testPrescription = initialPrescriptions.first;
      final originalDoctor = testPrescription.doctor;
      final originalFacility = testPrescription.facility;

      // Open Record Detail Screen for prescription
      await tester.pumpWidget(
        createTestApp(
          RecordDetailScreen(record: testPrescription),
        ),
      );
      await tester.pumpAndSettle();

      // Order Medicines button is present
      final orderBtn = find.byKey(const Key('order_medicines_button'));
      expect(orderBtn, findsOneWidget);

      // Tap Order Medicines
      await tester.ensureVisible(orderBtn);
      await tester.tap(orderBtn);
      await tester.pumpAndSettle();

      // Step 1: Medicine Selection Screen is displayed with checkboxes
      expect(find.text('Select Medicines'), findsWidgets);
      expect(find.byType(CheckboxListTile), findsWidgets);

      // Tap Continue to proceed to Summary
      final continueBtn = find.byKey(const Key('continue_to_summary_button'));
      expect(continueBtn, findsOneWidget);
      await tester.tap(continueBtn);
      await tester.pumpAndSettle();

      // Step 2: Order Summary is displayed
      expect(find.text('Order Summary'), findsWidgets);

      // Confirm Order button is enabled
      final confirmBtn = find.byKey(const Key('confirm_medicine_order_button'));
      expect(confirmBtn, findsOneWidget);

      await tester.tap(confirmBtn);
      await tester.pumpAndSettle();

      // Step 3: Order Success Screen is displayed with CB-MED-XXXX order ID
      expect(find.text('Order Placed Successfully'), findsWidgets);
      expect(find.textContaining('CB-MED-'), findsOneWidget);

      // Original prescription in mock service is 100% intact and unchanged
      final reloadedPrescription = MockDataService.instance
          .getHealthRecords()
          .firstWhere((r) => r.id == testPrescription.id);
      expect(reloadedPrescription.doctor, equals(originalDoctor));
      expect(reloadedPrescription.facility, equals(originalFacility));
    });
  });
}
