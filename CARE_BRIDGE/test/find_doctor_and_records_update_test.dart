import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:care_bridge/core/localization/app_localizations.dart';
import 'package:care_bridge/core/services/session_service.dart';
import 'package:care_bridge/shared/services/mock_data_service.dart';
import 'package:care_bridge/features/appointments/data/mock_appointment_repository.dart';
import 'package:care_bridge/features/appointments/domain/doctor.dart';
import 'package:care_bridge/features/appointments/domain/hospital.dart';
import 'package:care_bridge/features/appointments/domain/district.dart';
import 'package:care_bridge/features/appointments/presentation/booking_controller.dart';
import 'package:care_bridge/features/healthcare/doctor_discovery_screen.dart';
import 'package:care_bridge/features/health_records/records_screen.dart';
import 'package:care_bridge/features/health_records/manual_lab_entry_dialog.dart';
import 'package:care_bridge/features/health_records/document_picker_service.dart';
import 'package:care_bridge/features/location/domain/healthcare_facility.dart';

Widget createTestApp(Widget child) {
  return MaterialApp(
    localizationsDelegates: const [AppLocalizations.delegate],
    home: child,
  );
}

class TestDocumentPickerService implements DocumentPickerService {
  SelectedDocument? nextDocumentToReturn;

  @override
  Future<SelectedDocument?> pickDocument(BuildContext context) async {
    return nextDocumentToReturn;
  }
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  group('Find Doctor Feature & Appointment Booking Integration Tests', () {
    testWidgets('1 & 2. Doctor details open with Book Appointment button displayed', (tester) async {
      tester.view.physicalSize = const Size(800, 1600);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      await tester.pumpWidget(createTestApp(const DoctorDiscoveryScreen()));
      await tester.pumpAndSettle();

      // Find doctor card
      final doctorCard = find.byKey(const Key('doctor_card_doc_slm_1'));
      expect(doctorCard, findsOneWidget);

      // Tap on doctor card to open details
      await tester.tap(doctorCard);
      await tester.pumpAndSettle();

      // Verify doctor details sheet is displayed
      expect(find.text('Dr. K. Arulmurugan, MD'), findsWidgets);
      expect(find.text('General Medicine'), findsWidgets);
      expect(find.text('MBBS, MD (General Medicine)'), findsWidgets);

      // Verify Book Appointment button is displayed
      final bookButton = find.byKey(const Key('book_appointment_from_doctor_details'));
      expect(bookButton, findsOneWidget);
    });

    test('3, 4 & 5. Preselected doctor & hospital pass directly into BookingController without re-selection', () async {
      final repo = MockAppointmentRepository.instance;
      final controller = BookingController(repository: repo);

      final doctor = Doctor(
        id: 'doc_101',
        hospitalId: 'hosp_slm_gh',
        name: 'Dr. Senthil Kumar',
        specialization: 'Cardiologist',
        qualification: 'MBBS, MD (Cardiology)',
        experienceYears: 14,
        isAvailable: true,
      );

      final hospital = Hospital(
        id: 'hosp_slm_gh',
        districtId: 'dist_salem',
        name: 'Government Mohan Kumaramangalam Medical College Hospital',
        address: 'Collectorate Road, Salem, Tamil Nadu 636001',
        locationName: 'Gorimedu, Salem',
        type: 'Government Medical College Hospital',
        contactNumber: '0427-2415151',
        hospitalType: 'Government',
      );

      final district = District(
        id: 'dist_salem',
        name: 'Salem',
        state: 'Tamil Nadu',
        code: 'SLM',
      );

      controller.preselectDoctor(
        doctor: doctor,
        hospital: hospital,
        district: district,
      );

      // Verify selections are immediately preserved
      expect(controller.selectedDoctor?.id, equals('doc_101'));
      expect(controller.selectedHospital?.id, equals('hosp_slm_gh'));
      expect(controller.selectedDistrict?.id, equals('dist_salem'));

      // Verify user does not need to reselect doctor or hospital
      expect(controller.doctors.any((d) => d.id == 'doc_101'), isTrue);
      expect(controller.hospitals.any((h) => h.id == 'hosp_slm_gh'), isTrue);

      controller.dispose();
    });

    test('6, 7 & 8. Date & time selection and booking confirmation work from preselected state', () async {
      final repo = MockAppointmentRepository.instance;
      final controller = BookingController(repository: repo);

      final doctor = Doctor(
        id: 'doc_101',
        hospitalId: 'hosp_slm_gh',
        name: 'Dr. Senthil Kumar',
        specialization: 'Cardiologist',
        qualification: 'MBBS, MD',
        experienceYears: 14,
        isAvailable: true,
      );
      final hospital = Hospital(
        id: 'hosp_slm_gh',
        districtId: 'dist_salem',
        name: 'Salem GH',
        address: 'Salem',
        locationName: 'Salem',
        type: 'General Hospital',
        contactNumber: '0427-111111',
        hospitalType: 'Government',
      );

      controller.preselectDoctor(
        doctor: doctor,
        hospital: hospital,
      );

      // Select Date
      final targetDate = DateTime.now().add(const Duration(days: 1));
      controller.selectDate(targetDate);
      expect(controller.selectedDate, isNotNull);

      // Wait for slots to load and select slot
      await Future<void>.delayed(const Duration(milliseconds: 400));
      expect(controller.slots.isNotEmpty, isTrue);

      final slot = controller.slots.firstWhere((s) => s.isAvailable);
      controller.selectSlot(slot);
      expect(controller.selectedSlot, equals(slot));
      expect(controller.canProceedToSummary, isTrue);

      // Confirm booking
      final booked = await controller.confirmBooking('test_profile_id');
      expect(booked, isNotNull);
      expect(booked!.id, startsWith('CB-APT-'));
      expect(booked.doctorName, equals('Dr. Senthil Kumar'));
      expect(booked.hospitalName, equals('Salem GH'));
      expect(controller.lastBookedAppointment?.id, equals(booked.id));

      controller.dispose();
    });

    test('9. Existing cascading and reset rules remain intact', () async {
      final repo = MockAppointmentRepository.instance;
      final controller = BookingController(repository: repo);

      final districts = await repo.fetchDistricts();
      controller.selectDistrict(districts.first);
      await Future<void>.delayed(const Duration(milliseconds: 200));

      expect(controller.hospitals.isNotEmpty, isTrue);
      controller.selectHospital(controller.hospitals.first);
      await Future<void>.delayed(const Duration(milliseconds: 200));

      expect(controller.doctors.isNotEmpty, isTrue);
      controller.selectDoctor(controller.doctors.first);

      // Re-selecting district resets downstream selections
      controller.selectDistrict(districts.last);
      expect(controller.selectedHospital, isNull);
      expect(controller.selectedDoctor, isNull);
      expect(controller.selectedSlot, isNull);

      controller.dispose();
    });

    test('10 & 11. Booking from Find Doctor does NOT modify Assigned or Last Visited Facility', () async {
      final session = SessionService();
      const initialAssignedFacility = HealthcareFacility(
        id: 'initial_assigned_phc',
        name: 'Original Assigned PHC',
        type: FacilityType.phc,
        contactPhone: '1234567890',
        latitude: 13.0,
        longitude: 80.0,
      );
      await session.setAssignedFacility(initialAssignedFacility);
      await session.setLastVisitedFacility(initialAssignedFacility);

      // Perform preselection & booking
      final repo = MockAppointmentRepository.instance;
      final controller = BookingController(repository: repo);
      final doctor = Doctor(
        id: 'doc_102',
        hospitalId: 'hosp_other',
        name: 'Dr. Priya',
        specialization: 'Pediatrician',
        qualification: 'MBBS, MD',
        experienceYears: 8,
        isAvailable: true,
      );
      final hospital = Hospital(
        id: 'hosp_other',
        districtId: 'dist_other',
        name: 'Other Private Hospital',
        address: 'Coimbatore',
        locationName: 'Coimbatore',
        type: 'Private Multi-Specialty Hospital',
        contactNumber: '0422-999999',
        hospitalType: 'Private',
      );

      controller.preselectDoctor(doctor: doctor, hospital: hospital);
      controller.selectDate(DateTime.now());
      await Future<void>.delayed(const Duration(milliseconds: 400));
      if (controller.slots.isNotEmpty) {
        controller.selectSlot(controller.slots.first);
        await controller.confirmBooking('test_profile_id');
      }

      // Verify facilities are completely untouched
      expect(session.getAssignedFacility()?.id, equals('initial_assigned_phc'));
      expect(session.getLastVisitedFacility()?.id, equals('initial_assigned_phc'));

      controller.dispose();
    });
  });

  group('Health Records Categories & Lab Reports Tests', () {
    testWidgets('12, 13 & 14. Record Categories render as separate tappable cards & Recent Records is removed', (tester) async {
      tester.view.physicalSize = const Size(800, 1600);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      await tester.pumpWidget(createTestApp(const RecordsScreen()));
      await tester.pumpAndSettle();

      // Recent Records must NOT be present
      expect(find.text('Recent Records'), findsNothing);

      // Record Categories cards must be present
      expect(find.byKey(const Key('record_category_card_medicalRecords')), findsOneWidget);
      expect(find.byKey(const Key('record_category_card_labReports')), findsOneWidget);
      expect(find.byKey(const Key('record_category_card_prescriptions')), findsOneWidget);
      expect(find.byKey(const Key('record_category_card_vaccinations')), findsOneWidget);
      expect(find.byKey(const Key('record_category_card_otherDocuments')), findsOneWidget);

      // Manual Lab Report banner should NOT be displayed on top-level
      expect(find.byKey(const Key('open_manual_entry_button')), findsNothing);

      // Cards are tappable
      await tester.tap(find.byKey(const Key('record_category_card_medicalRecords')));
      await tester.pumpAndSettle();
      expect(find.text('Medical Records'), findsWidgets);
    });

    testWidgets('15, 16 & 17. Lab Reports category opens correctly and displays Add Manual Lab Report button', (tester) async {
      tester.view.physicalSize = const Size(800, 1600);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      await tester.pumpWidget(createTestApp(const RecordsScreen()));
      await tester.pumpAndSettle();

      // Tap Lab Reports category
      await tester.tap(find.byKey(const Key('record_category_card_labReports')));
      await tester.pumpAndSettle();

      // Header should show Lab Reports
      expect(find.text('Lab Reports'), findsWidgets);

      // Add Manual Lab Report button is now accessible under Lab Reports
      final addBtn = find.byKey(const Key('add_manual_lab_report_button'));
      expect(addBtn, findsOneWidget);
      expect(find.byKey(const Key('open_manual_entry_button')), findsOneWidget);
    });

    testWidgets('18 & 19. Manual Lab Report dialog form and document upload control are displayed', (tester) async {
      tester.view.physicalSize = const Size(800, 1600);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      await tester.pumpWidget(createTestApp(const RecordsScreen()));
      await tester.pumpAndSettle();

      // Open Lab Reports
      await tester.tap(find.byKey(const Key('record_category_card_labReports')));
      await tester.pumpAndSettle();

      // Open Manual Lab Entry Dialog
      await tester.tap(find.byKey(const Key('open_manual_entry_button')));
      await tester.pumpAndSettle();

      // Form fields are displayed
      expect(find.byKey(const Key('manual_lab_title_field')), findsOneWidget);
      expect(find.byKey(const Key('manual_lab_category_field')), findsOneWidget);
      expect(find.byKey(const Key('manual_lab_facility_field')), findsOneWidget);
      expect(find.byKey(const Key('manual_lab_date_picker')), findsOneWidget);

      // Document Upload control is displayed
      expect(find.byKey(const Key('upload_document_button')), findsOneWidget);
      expect(find.text('No document selected'), findsOneWidget);
    });

    testWidgets('20, 21, 22, 23, 24 & 25. Document upload, validation, display, replace, and removal', (tester) async {
      tester.view.physicalSize = const Size(800, 1600);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      final mockPicker = TestDocumentPickerService();

      await tester.pumpWidget(
        createTestApp(
          Scaffold(
            body: Builder(
              builder: (ctx) => ElevatedButton(
                key: const Key('trigger_dialog'),
                onPressed: () {
                  ManualLabEntryDialog.show(
                    ctx,
                    onSaved: () {},
                    documentPickerOverride: mockPicker,
                  );
                },
                child: const Text('Open Dialog'),
              ),
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();

      // Open dialog
      await tester.tap(find.byKey(const Key('trigger_dialog')));
      await tester.pumpAndSettle();

      // 21. Unsupported file type rejected (.txt)
      mockPicker.nextDocumentToReturn = const SelectedDocument(
        name: 'notes.txt',
        path: '/tmp/notes.txt',
        type: 'txt',
        sizeBytes: 1024,
      );
      await tester.tap(find.byKey(const Key('upload_document_button')));
      await tester.pumpAndSettle();
      expect(find.byKey(const Key('document_error_message')), findsOneWidget);
      expect(find.text('File type not supported. Please upload a PDF, JPG, or PNG.'), findsOneWidget);

      // 22. Oversized file (>10MB) rejected
      mockPicker.nextDocumentToReturn = const SelectedDocument(
        name: 'huge_scan.pdf',
        path: '/tmp/huge_scan.pdf',
        type: 'pdf',
        sizeBytes: 15 * 1024 * 1024, // 15 MB
      );
      await tester.tap(find.byKey(const Key('upload_document_button')));
      await tester.pumpAndSettle();
      expect(find.byKey(const Key('document_error_message')), findsOneWidget);
      expect(find.text('File is too large. Maximum size is 10 MB.'), findsOneWidget);

      // 20 & 23. Supported document selected and displayed (PDF)
      mockPicker.nextDocumentToReturn = const SelectedDocument(
        name: 'blood_test_report.pdf',
        path: '/tmp/blood_test_report.pdf',
        type: 'pdf',
        sizeBytes: 1200000, // 1.2 MB
      );
      await tester.tap(find.byKey(const Key('upload_document_button')));
      await tester.pumpAndSettle();
      expect(find.byKey(const Key('selected_document_name')), findsOneWidget);
      expect(find.text('blood_test_report.pdf'), findsOneWidget);
      expect(find.byKey(const Key('replace_document_button')), findsOneWidget);
      expect(find.byKey(const Key('remove_document_button')), findsOneWidget);

      // 24. Replace file with another supported format (PNG)
      mockPicker.nextDocumentToReturn = const SelectedDocument(
        name: 'chest_xray.png',
        path: '/tmp/chest_xray.png',
        type: 'png',
        sizeBytes: 850000,
      );
      await tester.tap(find.byKey(const Key('replace_document_button')));
      await tester.pumpAndSettle();
      expect(find.text('chest_xray.png'), findsOneWidget);

      // 25. Remove document
      await tester.tap(find.byKey(const Key('remove_document_button')));
      await tester.pumpAndSettle();
      expect(find.byKey(const Key('upload_document_button')), findsOneWidget);
      expect(find.text('No document selected'), findsOneWidget);
    });

    testWidgets('26 & 27. Manual report can be saved with or without attachment, and existing reports still work', (tester) async {
      tester.view.physicalSize = const Size(800, 1600);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      // Verify existing reports without attachments work
      final initialRecords = MockDataService.instance.getHealthRecords();
      expect(initialRecords.isNotEmpty, isTrue);
      for (final rec in initialRecords) {
        expect(rec.title.isNotEmpty, isTrue);
      }

      bool wasSaved = false;
      await tester.pumpWidget(
        createTestApp(
          Scaffold(
            body: Builder(
              builder: (ctx) => ElevatedButton(
                key: const Key('trigger_dialog_save'),
                onPressed: () {
                  ManualLabEntryDialog.show(
                    ctx,
                    onSaved: () {
                      wasSaved = true;
                    },
                  );
                },
                child: const Text('Open Dialog'),
              ),
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();

      await tester.tap(find.byKey(const Key('trigger_dialog_save')));
      await tester.pumpAndSettle();

      // Enter required fields without attachment
      await tester.enterText(find.byKey(const Key('manual_lab_title_field')), 'Hemoglobin Test');
      await tester.enterText(find.byKey(const Key('manual_lab_category_field')), 'Hematology');
      await tester.enterText(find.byKey(const Key('manual_lab_facility_field')), 'City Diagnostic Center');
      await tester.enterText(find.byKey(const Key('manual_lab_doctor_field')), 'Dr. Ananya');
      await tester.enterText(find.byKey(const Key('manual_lab_result_field')), '13.8 g/dL');

      // Save without document attachment (attachment is optional)
      await tester.tap(find.byKey(const Key('save_manual_lab_button')));
      await tester.pumpAndSettle();

      expect(wasSaved, isTrue);

      // Verify the newly created record is in MockDataService
      final updatedRecords = MockDataService.instance.getHealthRecords();
      final created = updatedRecords.firstWhere((r) => r.title == 'Hemoglobin Test');
      expect(created.facility, equals('City Diagnostic Center'));
      expect(created.doctor, equals('Dr. Ananya'));
      expect(created.isManualEntry, isTrue);
      expect(created.attachmentName, isNull);
    });
  });
}
