import 'package:flutter/material.dart';
import '../domain/district.dart';
import '../domain/doctor.dart';
import '../domain/hospital.dart';
import 'booking_controller.dart';
import 'district_selection_screen.dart';
import 'hospital_selection_screen.dart';
import 'doctor_selection_screen.dart';
import 'appointment_date_time_screen.dart';
import 'appointment_summary_screen.dart';
import 'appointment_success_screen.dart';

/// Arguments for launching the booking wizard with an optional preselected doctor
class BookingFlowArgs {
  final Doctor? initialDoctor;
  final Hospital? initialHospital;
  final District? initialDistrict;

  const BookingFlowArgs({
    this.initialDoctor,
    this.initialHospital,
    this.initialDistrict,
  });
}

/// InheritedNotifier providing [BookingController] to all child screens in the wizard.
class BookingScope extends InheritedNotifier<BookingController> {
  const BookingScope({
    super.key,
    required BookingController controller,
    required super.child,
  }) : super(notifier: controller);

  static BookingController of(BuildContext context) {
    final scope = context.dependOnInheritedWidgetOfExactType<BookingScope>();
    assert(scope != null, 'No BookingScope found in context');
    return scope!.notifier!;
  }
}

/// Main wizard flow container managing the fresh [BookingController] lifecycle.
class BookingFlowWrapper extends StatefulWidget {
  final Doctor? initialDoctor;
  final Hospital? initialHospital;
  final District? initialDistrict;

  const BookingFlowWrapper({
    super.key,
    this.initialDoctor,
    this.initialHospital,
    this.initialDistrict,
  });

  @override
  State<BookingFlowWrapper> createState() => _BookingFlowWrapperState();
}

class _BookingFlowWrapperState extends State<BookingFlowWrapper> {
  late final BookingController _controller;
  late final PageController _pageController;

  @override
  void initState() {
    super.initState();
    _controller = BookingController();
    final hasPreselectedDoctor =
        widget.initialDoctor != null && widget.initialHospital != null;
    _pageController = PageController(initialPage: hasPreselectedDoctor ? 3 : 0);

    if (hasPreselectedDoctor) {
      _controller.preselectDoctor(
        doctor: widget.initialDoctor!,
        hospital: widget.initialHospital!,
        district: widget.initialDistrict,
      );
    }
  }

  @override
  void dispose() {
    _pageController.dispose();
    // Safely disposes the BookingController to prevent memory leaks
    _controller.dispose();
    super.dispose();
  }

  void _nextPage() {
    _pageController.nextPage(
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeInOut,
    );
  }

  void _previousPage() {
    _pageController.previousPage(
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeInOut,
    );
  }

  @override
  Widget build(BuildContext context) {
    return BookingScope(
      controller: _controller,
      child: Scaffold(
        body: PageView(
          controller: _pageController,
          physics: const NeverScrollableScrollPhysics(),
          children: [
            DistrictSelectionScreen(
              onNext: _nextPage,
            ),
            HospitalSelectionScreen(
              onNext: _nextPage,
              onBack: _previousPage,
            ),
            DoctorSelectionScreen(
              onNext: _nextPage,
              onBack: _previousPage,
            ),
            AppointmentDateTimeScreen(
              onNext: _nextPage,
              onBack: _previousPage,
            ),
            AppointmentSummaryScreen(
              onNext: _nextPage,
              onBack: _previousPage,
            ),
            const AppointmentSuccessScreen(),
          ],
        ),
      ),
    );
  }
}
