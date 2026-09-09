import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:care_bridge/core/localization/app_localizations.dart';
import 'package:care_bridge/features/healthcare/care_screen.dart';
import 'package:care_bridge/features/healthcare/facility_discovery_screen.dart';
import 'package:care_bridge/features/healthcare/doctor_discovery_screen.dart';
import 'package:care_bridge/features/home/home_screen.dart';
import 'package:care_bridge/features/location/domain/healthcare_facility.dart';
import 'package:care_bridge/features/location/domain/location_service.dart';
import 'package:care_bridge/features/location/data/location_service_impl.dart';
import 'package:care_bridge/features/appointments/data/mock_appointment_repository.dart';
import 'package:care_bridge/shared/widgets/care_bridge_emergency_dialog.dart';

class MockTestLocationService implements LocationService {
  final UserLocation? locationToReturn;
  final bool permissionGranted;

  MockTestLocationService({
    this.locationToReturn,
    this.permissionGranted = true,
  });

  @override
  Future<bool> isPermissionGranted() async => permissionGranted;

  @override
  Future<bool> requestPermission() async => permissionGranted;

  @override
  Future<UserLocation?> getCurrentLocation() async => locationToReturn;

  @override
  Future<List<HealthcareFacility>> getFacilities() async =>
      LocationServiceImpl.sampleFacilities;

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

Widget createCareTestApp(Widget child) {
  return MaterialApp(
    localizationsDelegates: const [AppLocalizations.delegate],
    home: child,
  );
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('Section 20 Tests — Care Section & Emergency UI Update', () {
    // ==========================================
    // HOSPITALS (1 to 8)
    // ==========================================
    group('Hospitals Filtering Tests', () {
      testWidgets('1. Government filter returns only Government Hospitals', (tester) async {
        await tester.pumpWidget(createCareTestApp(
          const FacilityDiscoveryScreen(facilityType: FacilityType.hospital),
        ));
        await tester.pumpAndSettle();

        // Tap Government Hospitals filter chip
        final govChip = find.byKey(const Key('filter_hospital_government'));
        expect(govChip, findsOneWidget);
        await tester.tap(govChip);
        await tester.pumpAndSettle();

        // Salem GH (Government) must appear
        expect(find.text('Salem District Headquarters Government Hospital'), findsOneWidget);
        // Kauvery Hospital (Private) must NOT appear
        expect(find.text('Kauvery Hospital - Salem'), findsNothing);
      });

      testWidgets('2. Private filter returns only Private Hospitals', (tester) async {
        await tester.pumpWidget(createCareTestApp(
          const FacilityDiscoveryScreen(facilityType: FacilityType.hospital),
        ));
        await tester.pumpAndSettle();

        // Tap Private Hospitals filter chip
        final pvtChip = find.byKey(const Key('filter_hospital_private'));
        expect(pvtChip, findsOneWidget);
        await tester.tap(pvtChip);
        await tester.pumpAndSettle();

        // Kauvery Hospital (Private) must appear
        expect(find.text('Kauvery Hospital - Salem'), findsOneWidget);
        // Salem GH (Government) must NOT appear
        expect(find.text('Salem District Headquarters Government Hospital'), findsNothing);
      });

      testWidgets('3. Overall returns all Hospitals', (tester) async {
        tester.view.physicalSize = const Size(800, 1600);
        tester.view.devicePixelRatio = 1.0;
        addTearDown(() {
          tester.view.resetPhysicalSize();
          tester.view.resetDevicePixelRatio();
        });

        await tester.pumpWidget(createCareTestApp(
          const FacilityDiscoveryScreen(facilityType: FacilityType.hospital),
        ));
        await tester.pumpAndSettle();

        // Filter by Salem district
        final districtDropdown = find.byKey(const Key('district_dropdown'));
        await tester.tap(districtDropdown);
        await tester.pumpAndSettle();
        await tester.tap(find.text('Salem').last);
        await tester.pumpAndSettle();

        // By default or tapping Overall
        final overallChip = find.byKey(const Key('filter_hospital_overall'));
        expect(overallChip, findsOneWidget);
        await tester.tap(overallChip);
        await tester.pumpAndSettle();

        // Both Government and Private hospitals must appear in overall list
        expect(find.text('Salem District Headquarters Government Hospital'), findsOneWidget);
        expect(find.text('Kauvery Hospital - Salem'), findsOneWidget);
      });

      testWidgets('4. Existing district filtering still works', (tester) async {
        await tester.pumpWidget(createCareTestApp(
          const FacilityDiscoveryScreen(facilityType: FacilityType.hospital),
        ));
        await tester.pumpAndSettle();

        // Select Coimbatore District
        final districtDropdown = find.byKey(const Key('district_dropdown'));
        await tester.tap(districtDropdown);
        await tester.pumpAndSettle();
        await tester.tap(find.text('Coimbatore').last);
        await tester.pumpAndSettle();

        // Coimbatore hospitals visible
        expect(find.text('Coimbatore Medical College Hospital'), findsOneWidget);
        // Salem hospital not visible
        expect(find.text('Salem District Headquarters Government Hospital'), findsNothing);
      });

      testWidgets('5. Existing city filtering still works', (tester) async {
        await tester.pumpWidget(createCareTestApp(
          const FacilityDiscoveryScreen(facilityType: FacilityType.hospital),
        ));
        await tester.pumpAndSettle();

        // Select Salem district
        final districtDropdown = find.byKey(const Key('district_dropdown'));
        await tester.tap(districtDropdown);
        await tester.pumpAndSettle();
        await tester.tap(find.text('Salem').last);
        await tester.pumpAndSettle();

        // Select Omalur city
        final cityDropdown = find.byKey(const Key('city_dropdown'));
        await tester.tap(cityDropdown);
        await tester.pumpAndSettle();
        await tester.tap(find.text('Omalur').last);
        await tester.pumpAndSettle();

        // Only Omalur hospital is visible
        expect(find.text('Omalur Sub-District Government Hospital'), findsOneWidget);
        expect(find.text('Salem District Headquarters Government Hospital'), findsNothing);
      });

      testWidgets('6. Existing nearby filtering still works', (tester) async {
        tester.view.physicalSize = const Size(800, 1600);
        tester.view.devicePixelRatio = 1.0;
        addTearDown(() {
          tester.view.resetPhysicalSize();
          tester.view.resetDevicePixelRatio();
        });

        final mockLocService = MockTestLocationService(
          locationToReturn: const UserLocation(
            latitude: 11.6643,
            longitude: 78.1460,
            addressLabel: 'Salem',
          ),
        );
        await tester.pumpWidget(createCareTestApp(
          FacilityDiscoveryScreen(
            key: const Key('fac_disc_valid_loc'),
            facilityType: FacilityType.hospital,
            locationServiceOverride: mockLocService,
          ),
        ));
        await tester.pumpAndSettle();

        // Tap Nearby tab
        await tester.tap(find.byKey(const Key('filter_tab_nearby')));
        await tester.pumpAndSettle();

        // Nearby hospitals are sorted and rendered
        expect(find.text('Salem District Headquarters Government Hospital'), findsOneWidget);
      });

      testWidgets('7. Existing search still works', (tester) async {
        await tester.pumpWidget(createCareTestApp(
          const FacilityDiscoveryScreen(facilityType: FacilityType.hospital),
        ));
        await tester.pumpAndSettle();

        // Enter search query
        final searchField = find.byKey(const Key('hospital_search_bar'));
        expect(searchField, findsOneWidget);
        await tester.enterText(searchField, 'Kauvery');
        await tester.pumpAndSettle();

        // Kauvery should be found, Salem GH filtered out
        expect(find.text('Kauvery Hospital - Salem'), findsOneWidget);
        expect(find.text('Salem District Headquarters Government Hospital'), findsNothing);
      });

      testWidgets('8. Combining hospital type + district works correctly', (tester) async {
        await tester.pumpWidget(createCareTestApp(
          const FacilityDiscoveryScreen(facilityType: FacilityType.hospital),
        ));
        await tester.pumpAndSettle();

        // Select Salem district
        final districtDropdown = find.byKey(const Key('district_dropdown'));
        await tester.tap(districtDropdown);
        await tester.pumpAndSettle();
        await tester.tap(find.text('Salem').last);
        await tester.pumpAndSettle();

        // Tap Private filter
        final pvtChip = find.byKey(const Key('filter_hospital_private'));
        await tester.tap(pvtChip);
        await tester.pumpAndSettle();

        // Only Private Salem hospitals displayed
        expect(find.text('Kauvery Hospital - Salem'), findsOneWidget);
        expect(find.text('Salem District Headquarters Government Hospital'), findsNothing);
        expect(find.text('PSG Hospitals'), findsNothing); // Coimbatore private hospital
      });
    });

    // ==========================================
    // FIND A DOCTOR (9 to 13)
    // ==========================================
    group('Find A Doctor Filtering Tests', () {
      testWidgets('9. Government filter returns doctors from Government Hospitals', (tester) async {
        final mockRepo = MockAppointmentRepository();
        await tester.pumpWidget(createCareTestApp(
          DoctorDiscoveryScreen(repositoryOverride: mockRepo),
        ));
        await tester.pumpAndSettle();

        // Tap Government filter
        final govChip = find.byKey(const Key('filter_doctor_government'));
        expect(govChip, findsOneWidget);
        await tester.tap(govChip);
        await tester.pumpAndSettle();

        // Dr. K. Arulmurugan is at Salem District HQ (Government)
        expect(find.textContaining('Arulmurugan'), findsOneWidget);
        // Dr. K. Ananth is at Kauvery Hospital (Private) - should NOT appear
        expect(find.textContaining('Ananth'), findsNothing);
      });

      testWidgets('10. Private filter returns doctors from Private Hospitals', (tester) async {
        final mockRepo = MockAppointmentRepository();
        await tester.pumpWidget(createCareTestApp(
          DoctorDiscoveryScreen(repositoryOverride: mockRepo),
        ));
        await tester.pumpAndSettle();

        // Tap Private filter
        final pvtChip = find.byKey(const Key('filter_doctor_private'));
        expect(pvtChip, findsOneWidget);
        await tester.tap(pvtChip);
        await tester.pumpAndSettle();

        // Dr. K. Ananth (Private - Kauvery Hospital) should appear
        expect(find.textContaining('Ananth'), findsOneWidget);
        // Dr. K. Arulmurugan (Government) should NOT appear
        expect(find.textContaining('Arulmurugan'), findsNothing);
      });

      testWidgets('11. Overall returns doctors from both Government and Private', (tester) async {
        tester.view.physicalSize = const Size(800, 1600);
        tester.view.devicePixelRatio = 1.0;
        addTearDown(() {
          tester.view.resetPhysicalSize();
          tester.view.resetDevicePixelRatio();
        });

        final mockRepo = MockAppointmentRepository();
        await tester.pumpWidget(createCareTestApp(
          DoctorDiscoveryScreen(repositoryOverride: mockRepo),
        ));
        await tester.pumpAndSettle();

        // Select Salem district so both Salem Government and Private doctors are loaded in view
        final districtDropdown = find.byKey(const Key('doctor_district_dropdown'));
        await tester.tap(districtDropdown);
        await tester.pumpAndSettle();
        await tester.tap(find.text('Salem').last);
        await tester.pumpAndSettle();

        // Tap Overall filter
        final overallChip = find.byKey(const Key('filter_doctor_overall'));
        expect(overallChip, findsOneWidget);
        await tester.tap(overallChip);
        await tester.pumpAndSettle();

        // Both Government and Private doctors must appear
        expect(find.textContaining('Arulmurugan'), findsOneWidget);
        expect(find.textContaining('Ananth'), findsOneWidget);
      });

      testWidgets('12. Existing doctor search/filtering continues working', (tester) async {
        final mockRepo = MockAppointmentRepository();
        await tester.pumpWidget(createCareTestApp(
          DoctorDiscoveryScreen(repositoryOverride: mockRepo),
        ));
        await tester.pumpAndSettle();

        // Search for 'Cardiology'
        final searchBar = find.byKey(const Key('doctor_search_bar'));
        expect(searchBar, findsOneWidget);
        await tester.enterText(searchBar, 'Cardiology');
        await tester.pumpAndSettle();

        // Cardiologists should appear (Dr. M. Soundararajan)
        expect(find.textContaining('Soundararajan'), findsOneWidget);
        // Dr. K. Ananth is Neurologist - should NOT appear
        expect(find.textContaining('Ananth'), findsNothing);
      });

      testWidgets('13. Combining doctor type + specialization works correctly', (tester) async {
        final mockRepo = MockAppointmentRepository();
        await tester.pumpWidget(createCareTestApp(
          DoctorDiscoveryScreen(repositoryOverride: mockRepo),
        ));
        await tester.pumpAndSettle();

        // Filter by Private
        await tester.tap(find.byKey(const Key('filter_doctor_private')));
        await tester.pumpAndSettle();

        // Select Neurology specialization
        final specDropdown = find.byKey(const Key('doctor_specialization_dropdown'));
        await tester.tap(specDropdown);
        await tester.pumpAndSettle();
        await tester.tap(find.text('Neurology').last);
        await tester.pumpAndSettle();

        // Dr. K. Ananth is Private Neurologist
        expect(find.textContaining('Ananth'), findsOneWidget);
        // Dr. K. Arulmurugan is Government General Medicine
        expect(find.textContaining('Arulmurugan'), findsNothing);
      });
    });

    // ==========================================
    // CARE (14 to 15)
    // ==========================================
    group('Care Screen Tests', () {
      testWidgets('14. Primary Health Care is not displayed', (tester) async {
        await tester.pumpWidget(createCareTestApp(
          const CareScreen(),
        ));
        await tester.pumpAndSettle();

        // "Primary Health Care" should NOT be displayed
        expect(find.text('Primary Health Care'), findsNothing);
        expect(find.byKey(const Key('service_phcs_card')), findsNothing);
      });

      testWidgets('15. Other Care functionality remains available', (tester) async {
        await tester.pumpWidget(createCareTestApp(
          const CareScreen(),
        ));
        await tester.pumpAndSettle();

        // Other care options should be available
        expect(find.byKey(const Key('service_hospitals_card')), findsOneWidget);
        expect(find.byKey(const Key('service_find_doctor_card')), findsOneWidget);
        expect(find.byKey(const Key('service_emergency_card')), findsOneWidget);
      });
    });

    // ==========================================
    // EMERGENCY (16 to 21)
    // ==========================================
    group('Emergency Section Tests', () {
      testWidgets('16. Emergency card remains available on Home', (tester) async {
        await tester.pumpWidget(createCareTestApp(
          const HomeScreen(),
        ));
        await tester.pumpAndSettle();

        // Quick action emergency card exists
        expect(find.byKey(const Key('quick_action_emergency')), findsOneWidget);
        // No subtitle under emergency card
        expect(find.text('Ambulance 108'), findsNothing);
      });

      testWidgets('17, 18, 19. Tapping Emergency opens dialog with exactly the two requested options', (tester) async {
        await tester.pumpWidget(createCareTestApp(
          const HomeScreen(),
        ));
        await tester.pumpAndSettle();

        // Tap Emergency card
        await tester.tap(find.byKey(const Key('quick_action_emergency')));
        await tester.pumpAndSettle();

        // Two options displayed
        expect(find.byKey(const Key('emergency_option_108')), findsOneWidget);
        expect(find.text('108 Emergency Service'), findsOneWidget);
        expect(find.byKey(const Key('emergency_option_teleconsultation')), findsOneWidget);
        expect(find.text('Teleconsultation (Audio)'), findsOneWidget);
      });

      testWidgets('20. Selecting 108 uses existing emergency call functionality', (tester) async {
        bool call108Triggered = false;

        await tester.pumpWidget(createCareTestApp(
          Builder(builder: (context) {
            return Scaffold(
              body: ElevatedButton(
                onPressed: () {
                  showCareBridgeEmergencyDialog(
                    context,
                    null,
                    () {
                      call108Triggered = true;
                    },
                  );
                },
                child: const Text('Open Emergency'),
              ),
            );
          }),
        ));
        await tester.pumpAndSettle();

        await tester.tap(find.text('Open Emergency'));
        await tester.pumpAndSettle();

        // Tap 108 option
        await tester.tap(find.byKey(const Key('emergency_option_108')));
        await tester.pumpAndSettle();

        expect(call108Triggered, isTrue);
      });

      testWidgets('21. Selecting Audio Teleconsultation uses existing teleconsultation functionality', (tester) async {
        bool teleconsultationTriggered = false;

        await tester.pumpWidget(createCareTestApp(
          Builder(builder: (context) {
            return Scaffold(
              body: ElevatedButton(
                onPressed: () {
                  showCareBridgeEmergencyDialog(
                    context,
                    null,
                    null,
                    () {
                      teleconsultationTriggered = true;
                    },
                  );
                },
                child: const Text('Open Emergency'),
              ),
            );
          }),
        ));
        await tester.pumpAndSettle();

        await tester.tap(find.text('Open Emergency'));
        await tester.pumpAndSettle();

        // Tap Audio Teleconsultation option
        await tester.tap(find.byKey(const Key('emergency_option_teleconsultation')));
        await tester.pumpAndSettle();

        expect(teleconsultationTriggered, isTrue);
      });
    });
  });
}
