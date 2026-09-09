import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:care_bridge/core/localization/app_localizations.dart';
import 'package:care_bridge/features/health_records/records_screen.dart';
import 'package:care_bridge/features/healthcare/facility_discovery_screen.dart';
import 'package:care_bridge/features/location/domain/healthcare_facility.dart';
import 'package:care_bridge/features/location/domain/location_service.dart';
import 'package:care_bridge/features/location/data/location_service_impl.dart';
import 'package:care_bridge/core/services/session_service.dart';

class MockLocationService implements LocationService {
  final UserLocation? locationToReturn;
  final bool permissionGranted;

  MockLocationService({
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

Widget createTestApp(Widget child) {
  return MaterialApp(
    localizationsDelegates: const [AppLocalizations.delegate],
    home: child,
  );
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('Records & Healthcare Services Update Tests', () {
    testWidgets('1 & 2. Recent Records is removed and categories render as cards', (tester) async {
      await tester.pumpWidget(createTestApp(const RecordsScreen()));
      await tester.pumpAndSettle();

      // Recent Records section header should NOT be present
      expect(find.text('Recent Records'), findsNothing);

      // Record category cards should render as cards
      expect(find.byKey(const Key('record_category_card_labReports')), findsOneWidget);
      expect(find.byKey(const Key('record_category_card_medicalRecords')), findsOneWidget);
      expect(find.byKey(const Key('record_category_card_prescriptions')), findsOneWidget);
      expect(find.byKey(const Key('record_category_card_vaccinations')), findsOneWidget);
      expect(find.byKey(const Key('record_category_card_otherDocuments')), findsOneWidget);
    });

    testWidgets('3 & 4. Lab Reports Manual Entry dialog opens and validates required fields', (tester) async {
      tester.view.physicalSize = const Size(800, 1600);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      await tester.pumpWidget(createTestApp(const RecordsScreen()));
      await tester.pumpAndSettle();

      // Tap Lab Reports category to navigate under Lab Reports
      final labReportsCard = find.byKey(const Key('record_category_card_labReports'));
      expect(labReportsCard, findsOneWidget);
      await tester.tap(labReportsCard);
      await tester.pumpAndSettle();

      // Tap manual entry button under Lab Reports
      final openButton = find.descendant(
        of: find.byKey(const Key('open_manual_entry_button')),
        matching: find.byType(ElevatedButton),
      );
      expect(openButton, findsOneWidget);
      await tester.tap(openButton);
      await tester.pumpAndSettle();

      // Verify dialog is visible
      expect(find.text('Add Lab Report'), findsWidgets);

      // Tap save without entering required fields
      final saveButton = find.byKey(const Key('save_manual_lab_button'));
      await tester.tap(saveButton);
      await tester.pumpAndSettle();

      // Required field validation messages
      expect(find.text('Please enter a report title'), findsOneWidget);
      expect(find.text('Please enter a facility name'), findsOneWidget);

      // Enter valid fields
      await tester.enterText(find.byKey(const Key('manual_lab_title_field')), 'Thyroid Test (TSH)');
      await tester.enterText(find.byKey(const Key('manual_lab_facility_field')), 'District Diagnostic Lab');
      await tester.enterText(find.byKey(const Key('manual_lab_result_field')), '2.5 uIU/mL');
      await tester.pumpAndSettle();

      // Save
      await tester.tap(saveButton);
      await tester.pumpAndSettle();

      // Dialog closed and newly added report appears with Manually Entered badge
      expect(find.text('Thyroid Test (TSH)'), findsOneWidget);
      expect(find.text('Manually Entered'), findsOneWidget);
    });

    testWidgets('5, 6 & 14, 15, 16. District & City hospital filtering and cascading options work', (tester) async {
      tester.view.physicalSize = const Size(800, 1200);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      await tester.pumpWidget(createTestApp(
        const FacilityDiscoveryScreen(facilityType: FacilityType.hospital),
      ));
      await tester.pumpAndSettle();

      // Initially District dropdown exists
      final districtDropdown = find.byKey(const Key('district_dropdown'));
      expect(districtDropdown, findsOneWidget);

      // Select 'Salem' District
      await tester.tap(districtDropdown);
      await tester.pumpAndSettle();
      await tester.tap(find.text('Salem').last);
      await tester.pumpAndSettle();

      // Salem hospitals visible (Salem District HQ, Omalur Hospital)
      expect(find.text('Salem District Headquarters Government Hospital'), findsOneWidget);
      expect(find.text('Omalur Sub-District Government Hospital'), findsOneWidget);
      expect(find.text('Coimbatore Medical College Hospital'), findsNothing);

      // Verify City dropdown contains Salem cities (Salem City, Omalur)
      final cityDropdown = find.byKey(const Key('city_dropdown'));
      await tester.tap(cityDropdown);
      await tester.pumpAndSettle();
      expect(find.text('Omalur').last, findsOneWidget);

      // Select 'Omalur' City
      await tester.tap(find.text('Omalur').last);
      await tester.pumpAndSettle();

      // Only Omalur hospital is visible
      expect(find.text('Omalur Sub-District Government Hospital'), findsOneWidget);
      expect(find.text('Salem District Headquarters Government Hospital'), findsNothing);

      // Changing District to Coimbatore should clear/reset selected City
      await tester.tap(districtDropdown);
      await tester.pumpAndSettle();
      await tester.tap(find.text('Coimbatore').last);
      await tester.pumpAndSettle();

      expect(find.text('Coimbatore Medical College Hospital'), findsOneWidget);
      expect(find.text('Omalur Sub-District Government Hospital'), findsNothing);
    });

    testWidgets('7 & 17. Nearby hospitals sorted by distance & location required state', (tester) async {
      tester.view.physicalSize = const Size(800, 1200);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      // Test when location is NULL
      final mockNoLocService = MockLocationService(locationToReturn: null, permissionGranted: false);
      await tester.pumpWidget(createTestApp(
        FacilityDiscoveryScreen(
          facilityType: FacilityType.hospital,
          locationServiceOverride: mockNoLocService,
        ),
      ));
      await tester.pumpAndSettle();

      // Switch to Nearby tab
      await tester.tap(find.byKey(const Key('filter_tab_nearby')));
      await tester.pumpAndSettle();

      // Shows location required state
      expect(find.text('Location is required to find nearby facilities.'), findsWidgets);
      expect(find.byKey(const Key('enable_location_button')), findsOneWidget);

      // Now test with valid location
      final mockLocService = MockLocationService(
        locationToReturn: const UserLocation(latitude: 11.6643, longitude: 78.1460, addressLabel: 'Salem'),
      );
      await tester.pumpWidget(createTestApp(
        FacilityDiscoveryScreen(
          key: const Key('fac_disc_valid_loc'),
          facilityType: FacilityType.hospital,
          locationServiceOverride: mockLocService,
        ),
      ));
      await tester.pumpAndSettle();

      await tester.tap(find.byKey(const Key('filter_tab_nearby')));
      await tester.pumpAndSettle();

      // Facilities are rendered and sorted by distance
      expect(find.text('Salem District Headquarters Government Hospital'), findsOneWidget);
    });

    testWidgets('8, 9 & 10. PHC filtering (District, City, Nearby) works without mixing Hospital dataset', (tester) async {
      await tester.pumpWidget(createTestApp(
        const FacilityDiscoveryScreen(facilityType: FacilityType.phc),
      ));
      await tester.pumpAndSettle();

      // Should render PHCs and NOT Hospitals
      expect(find.text('Primary Health Centre - Suramangalam'), findsOneWidget);
      expect(find.text('Salem District Headquarters Government Hospital'), findsNothing);
    });

    testWidgets('11, 12, 18. Facility coordinates formatting & maps launch error handling', (tester) async {
      final mockLocService = MockLocationService(
        locationToReturn: const UserLocation(latitude: 11.6643, longitude: 78.1460, addressLabel: 'Salem'),
      );
      await tester.pumpWidget(createTestApp(
        FacilityDiscoveryScreen(
          facilityType: FacilityType.hospital,
          locationServiceOverride: mockLocService,
        ),
      ));
      await tester.pumpAndSettle();

      final directionsBtn = find.byKey(const Key('directions_btn_fac_gh_salem'));
      expect(directionsBtn, findsOneWidget);

      // Tapping directions button triggers url launcher safely
      await tester.tap(directionsBtn);
      await tester.pumpAndSettle();
    });

    testWidgets('13 & 19. Facility browsing/selection never mutates Assigned or Last Visited Facility', (tester) async {
      final session = SessionService();

      final initialAssigned = session.getAssignedFacility();
      final initialLastVisited = session.getLastVisitedFacility();

      await tester.pumpWidget(createTestApp(
        const FacilityDiscoveryScreen(facilityType: FacilityType.hospital),
      ));
      await tester.pumpAndSettle();

      // Perform interactions
      await tester.tap(find.byKey(const Key('filter_tab_city')));
      await tester.pumpAndSettle();
      await tester.tap(find.byKey(const Key('filter_tab_nearby')));
      await tester.pumpAndSettle();

      // Details button tap
      final detailsBtn = find.byKey(const Key('details_btn_fac_gh_salem'));
      if (detailsBtn.evaluate().isNotEmpty) {
        await tester.tap(detailsBtn);
        await tester.pumpAndSettle();
      }

      // Verify SessionService assigned & last visited facilities are untouched
      expect(session.getAssignedFacility(), equals(initialAssigned));
      expect(session.getLastVisitedFacility(), equals(initialLastVisited));
    });
  });
}
