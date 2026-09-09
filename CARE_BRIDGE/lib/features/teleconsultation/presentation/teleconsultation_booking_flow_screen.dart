import 'package:flutter/material.dart';
import '../../../app/routes/app_routes.dart';
import '../../../app/theme/app_colors.dart';
import '../../../core/localization/app_localizations.dart';
import '../../../core/services/session_service.dart';
import '../../appointments/domain/doctor.dart';
import '../../authentication/presentation/authentication_controller.dart';
import '../domain/teleconsultation.dart';
import 'teleconsultation_controller.dart';

class TeleconsultationBookingFlowScreen extends StatefulWidget {
  final Doctor doctor;
  final TeleconsultationController controller;
  final SessionService? sessionServiceOverride;

  const TeleconsultationBookingFlowScreen({
    super.key,
    required this.doctor,
    required this.controller,
    this.sessionServiceOverride,
  });

  @override
  State<TeleconsultationBookingFlowScreen> createState() =>
      _TeleconsultationBookingFlowScreenState();
}

class _TeleconsultationBookingFlowScreenState
    extends State<TeleconsultationBookingFlowScreen> {
  int _currentStep = 0;
  Teleconsultation? _bookedConsultation;

  @override
  void initState() {
    super.initState();
    widget.controller.selectDoctor(widget.doctor);
  }

  SessionService _getSessionService() {
    if (widget.sessionServiceOverride != null) {
      return widget.sessionServiceOverride!;
    }
    try {
      return CareBridgeAuthScope.of(context).sessionService;
    } catch (_) {
      return SessionService();
    }
  }

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded, color: AppColors.textPrimary),
          onPressed: () {
            if (_bookedConsultation != null) {
              Navigator.of(context).pop();
            } else if (_currentStep > 0) {
              setState(() {
                _currentStep--;
              });
            } else {
              Navigator.of(context).pop();
            }
          },
        ),
        title: Text(
          _bookedConsultation != null
              ? loc.consultationScheduledTitle
              : loc.bookTeleconsultationBtn,
          style: const TextStyle(
            color: AppColors.textPrimary,
            fontSize: 18,
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
      body: AnimatedBuilder(
        animation: widget.controller,
        builder: (context, _) {
          if (_bookedConsultation != null) {
            return _buildSuccessView(loc, _bookedConsultation!);
          }

          return Column(
            children: [
              _buildStepIndicator(loc),
              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                  child: _buildCurrentStepContent(loc),
                ),
              ),
              _buildBottomAction(loc),
            ],
          );
        },
      ),
    );
  }

  Widget _buildStepIndicator(AppLocalizations loc) {
    final steps = [
      loc.consultationTypeTitle,
      loc.selectDateTimeStep,
      loc.consultationSummaryTitle,
    ];

    return Container(
      color: AppColors.surface,
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      child: Row(
        children: List.generate(steps.length, (index) {
          final isCompleted = _currentStep > index;
          final isCurrent = _currentStep == index;

          return Expanded(
            child: Row(
              children: [
                CircleAvatar(
                  radius: 12,
                  backgroundColor: isCompleted
                      ? AppColors.success
                      : isCurrent
                          ? AppColors.primary
                          : AppColors.borderLight,
                  child: isCompleted
                      ? const Icon(Icons.check, size: 14, color: Colors.white)
                      : Text(
                          '${index + 1}',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w700,
                            color: isCurrent ? Colors.white : AppColors.textMuted,
                          ),
                        ),
                ),
                const SizedBox(width: 6),
                Expanded(
                  child: Text(
                    steps[index],
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: isCurrent ? FontWeight.w700 : FontWeight.w500,
                      color: isCurrent
                          ? AppColors.textPrimary
                          : AppColors.textMuted,
                    ),
                  ),
                ),
                if (index < steps.length - 1)
                  Container(
                    width: 16,
                    height: 2,
                    color: isCompleted ? AppColors.success : AppColors.borderLight,
                    margin: const EdgeInsets.symmetric(horizontal: 4),
                  ),
              ],
            ),
          );
        }),
      ),
    );
  }

  Widget _buildCurrentStepContent(AppLocalizations loc) {
    switch (_currentStep) {
      case 0:
        return _buildTypeSelectionStep(loc);
      case 1:
        return _buildDateTimeStep(loc);
      case 2:
      default:
        return _buildSummaryStep(loc);
    }
  }

  // STEP 1: Type Selection
  Widget _buildTypeSelectionStep(AppLocalizations loc) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildDoctorBanner(loc),
        const SizedBox(height: 20),
        Text(
          loc.consultationTypeTitle,
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w700,
            color: AppColors.textPrimary,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          loc.teleconsultationSubtitle,
          style: const TextStyle(fontSize: 13, color: AppColors.textMuted),
        ),
        const SizedBox(height: 16),
        _buildTypeOption(
          type: ConsultationType.video,
          title: loc.consultationTypeVideo,
          desc: loc.consultationTypeVideoDesc,
          icon: Icons.videocam_rounded,
          badge: 'High Definition',
        ),
        const SizedBox(height: 12),
        _buildTypeOption(
          type: ConsultationType.audio,
          title: loc.consultationTypeAudio,
          desc: loc.consultationTypeAudioDesc,
          icon: Icons.phone_in_talk_rounded,
        ),
        const SizedBox(height: 12),
        _buildTypeOption(
          type: ConsultationType.chat,
          title: loc.consultationTypeChat,
          desc: loc.consultationTypeChatDesc,
          icon: Icons.chat_bubble_outline_rounded,
        ),
      ],
    );
  }

  Widget _buildDoctorBanner(AppLocalizations loc) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderLight),
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 26,
            backgroundColor: AppColors.primaryLight,
            child: const Icon(Icons.person, color: AppColors.primary, size: 28),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  widget.doctor.name,
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  widget.doctor.specialization,
                  style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: AppColors.primary,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  widget.doctor.qualification,
                  style: const TextStyle(fontSize: 11, color: AppColors.textMuted),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTypeOption({
    required ConsultationType type,
    required String title,
    required String desc,
    required IconData icon,
    String? badge,
  }) {
    final isSelected = widget.controller.selectedType == type;

    return InkWell(
      onTap: () => widget.controller.setConsultationType(type),
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primaryLight.withValues(alpha: 0.5) : AppColors.surface,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isSelected ? AppColors.primary : AppColors.borderLight,
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: isSelected ? AppColors.primary : AppColors.surfaceVariant,
                shape: BoxShape.circle,
              ),
              child: Icon(
                icon,
                color: isSelected ? Colors.white : AppColors.primary,
                size: 24,
              ),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        title,
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                          color: isSelected
                              ? AppColors.primaryDark
                              : AppColors.textPrimary,
                        ),
                      ),
                      if (badge != null) ...[
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: AppColors.successLight,
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            badge,
                            style: const TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w600,
                              color: AppColors.success,
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    desc,
                    style: const TextStyle(
                      fontSize: 12,
                      color: AppColors.textMuted,
                    ),
                  ),
                ],
              ),
            ),
            Icon(
              isSelected
                  ? Icons.radio_button_checked
                  : Icons.radio_button_off,
              color: isSelected ? AppColors.primary : AppColors.border,
            ),
          ],
        ),
      ),
    );
  }

  // STEP 2: Date & Time Slot Step
  Widget _buildDateTimeStep(AppLocalizations loc) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final daysList = List.generate(7, (i) => today.add(Duration(days: i + 1)));

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildDoctorBanner(loc),
        const SizedBox(height: 20),
        Text(
          loc.selectDateTitle,
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w700,
            color: AppColors.textPrimary,
          ),
        ),
        const SizedBox(height: 12),
        SizedBox(
          height: 74,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            itemCount: daysList.length,
            separatorBuilder: (_, _) => const SizedBox(width: 10),
            itemBuilder: (context, index) {
              final date = daysList[index];
              final isSelected = widget.controller.selectedDate.year == date.year &&
                  widget.controller.selectedDate.month == date.month &&
                  widget.controller.selectedDate.day == date.day;

              return InkWell(
                onTap: () => widget.controller.setDate(date),
                borderRadius: BorderRadius.circular(14),
                child: Container(
                  width: 68,
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  decoration: BoxDecoration(
                    color: isSelected ? AppColors.primary : AppColors.surface,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(
                      color: isSelected ? AppColors.primary : AppColors.borderLight,
                      width: 1.5,
                    ),
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        _getWeekDayName(date.weekday),
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          color: isSelected ? Colors.white70 : AppColors.textMuted,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${date.day}',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w800,
                          color: isSelected ? Colors.white : AppColors.textPrimary,
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
        const SizedBox(height: 24),
        Text(
          loc.selectTimeSlotTitle,
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w700,
            color: AppColors.textPrimary,
          ),
        ),
        const SizedBox(height: 12),
        if (widget.controller.isLoadingSlots)
          const Center(
            child: Padding(
              padding: EdgeInsets.all(24),
              child: CircularProgressIndicator(),
            ),
          )
        else if (widget.controller.availableSlots.isEmpty)
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Center(
              child: Text(
                loc.noSlotsAvailable,
                style: const TextStyle(color: AppColors.textMuted),
              ),
            ),
          )
        else
          Wrap(
            spacing: 10,
            runSpacing: 10,
            children: widget.controller.availableSlots.map((slot) {
              final isSelected = widget.controller.selectedSlot == slot;
              return InkWell(
                onTap: slot.isAvailable
                    ? () => widget.controller.selectSlot(slot)
                    : null,
                borderRadius: BorderRadius.circular(10),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                  decoration: BoxDecoration(
                    color: isSelected
                        ? AppColors.primary
                        : slot.isAvailable
                            ? AppColors.surface
                            : AppColors.disabledSurface,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(
                      color: isSelected
                          ? AppColors.primary
                          : slot.isAvailable
                              ? AppColors.borderLight
                              : AppColors.border,
                      width: 1.2,
                    ),
                  ),
                  child: Text(
                    slot.displayTime,
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: isSelected ? FontWeight.w700 : FontWeight.w600,
                      color: isSelected
                          ? Colors.white
                          : slot.isAvailable
                              ? AppColors.textPrimary
                              : AppColors.disabled,
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
      ],
    );
  }

  // STEP 3: Summary Step
  Widget _buildSummaryStep(AppLocalizations loc) {
    final session = _getSessionService();
    final profile = session.getActiveAbhaProfile();
    final patientName = profile?.fullName ?? 'Priya Sharma';
    final abhaId = profile?.abhaAddress ?? 'priya.sharma@abdm';
    final abhaNumber = profile?.abhaNumber ?? '91-4521-8832-1940';
    final mobileNumber = profile?.mobileNumber ?? '9876543210';

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Consultation Details Card
        Container(
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.borderLight),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const Icon(Icons.video_call_rounded,
                      color: AppColors.primary, size: 22),
                  const SizedBox(width: 8),
                  Text(
                    loc.consultationDetailsSection,
                    style: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textPrimary,
                    ),
                  ),
                ],
              ),
              const Divider(color: AppColors.divider, height: 24),
              _buildSummaryRow(
                label: loc.quickActionBookDoctor,
                value: widget.doctor.name,
              ),
              const SizedBox(height: 8),
              _buildSummaryRow(
                label: loc.filterSpecialization,
                value: widget.doctor.specialization,
              ),
              const SizedBox(height: 8),
              _buildSummaryRow(
                label: loc.consultationTypeTitle,
                value: widget.controller.selectedType.label,
              ),
              const SizedBox(height: 8),
              _buildSummaryRow(
                label: loc.selectDateTitle,
                value: _formatDate(widget.controller.selectedDate),
              ),
              const SizedBox(height: 8),
              _buildSummaryRow(
                label: loc.selectTimeSlotTitle,
                value: widget.controller.selectedSlot?.displayTime ?? '-',
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        // Patient Details Card
        Container(
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.borderLight),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const Icon(Icons.person_outline_rounded,
                      color: AppColors.primary, size: 22),
                  const SizedBox(width: 8),
                  Text(
                    loc.patientDetailsSection,
                    style: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textPrimary,
                    ),
                  ),
                ],
              ),
              const Divider(color: AppColors.divider, height: 24),
              _buildSummaryRow(
                label: loc.patientNameLabel,
                value: patientName,
              ),
              const SizedBox(height: 8),
              _buildSummaryRow(
                label: loc.myHealthId,
                value: abhaId,
              ),
              const SizedBox(height: 8),
              _buildSummaryRow(
                label: 'ABHA No',
                value: abhaNumber,
              ),
              const SizedBox(height: 8),
              _buildSummaryRow(
                label: loc.mobileNumberLabel,
                value: mobileNumber,
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildSummaryRow({required String label, required String value}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: const TextStyle(fontSize: 13, color: AppColors.textMuted),
        ),
        Flexible(
          child: Text(
            value,
            textAlign: TextAlign.end,
            style: const TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: AppColors.textPrimary,
            ),
          ),
        ),
      ],
    );
  }

  // BOTTOM ACTION BUTTON
  Widget _buildBottomAction(AppLocalizations loc) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
      decoration: BoxDecoration(
        color: AppColors.surface,
        border: const Border(top: BorderSide(color: AppColors.borderLight)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 10,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: SizedBox(
          width: double.infinity,
          height: 48,
          child: ElevatedButton(
            onPressed: _isNextEnabled() ? _handleNextStep : null,
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              elevation: 0,
            ),
            child: widget.controller.isBooking
                ? const SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: Colors.white,
                    ),
                  )
                : Text(
                    _currentStep == 2
                        ? loc.confirmAndScheduleBtn
                        : loc.nextBtn,
                    style: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
          ),
        ),
      ),
    );
  }

  bool _isNextEnabled() {
    if (_currentStep == 0) return true;
    if (_currentStep == 1) return widget.controller.selectedSlot != null;
    return !widget.controller.isBooking;
  }

  Future<void> _handleNextStep() async {
    if (_currentStep < 2) {
      setState(() {
        _currentStep++;
      });
    } else {
      final session = _getSessionService();
      final profile = session.getActiveAbhaProfile();
      final booked = await widget.controller.confirmBooking(
        patientName: profile?.fullName ?? 'Priya Sharma',
        patientAbhaId: profile?.abhaAddress ?? 'priya.sharma@abdm',
        patientAbhaNumber: profile?.abhaNumber ?? '91-4521-8832-1940',
        patientPhone: profile?.mobileNumber ?? '9876543210',
      );

      if (booked != null && mounted) {
        setState(() {
          _bookedConsultation = booked;
        });
      }
    }
  }

  // STEP 4: SUCCESS VIEW
  Widget _buildSuccessView(
      AppLocalizations loc, Teleconsultation consultation) {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(20),
            decoration: const BoxDecoration(
              color: AppColors.successLight,
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.check_circle_rounded,
              color: AppColors.success,
              size: 56,
            ),
          ),
          const SizedBox(height: 20),
          Text(
            loc.consultationScheduledTitle,
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w800,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            loc.consultationScheduledSubtitle,
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontSize: 14,
              color: AppColors.textMuted,
            ),
          ),
          const SizedBox(height: 28),
          // Consultation ID Highlight Card
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.primary, width: 1.5),
            ),
            child: Column(
              children: [
                Text(
                  loc.consultationIdLabel,
                  style: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textMuted,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  consultation.id,
                  style: const TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.w800,
                    color: AppColors.primary,
                    letterSpacing: 1.2,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          // Card Details
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.borderLight),
            ),
            child: Column(
              children: [
                _buildSummaryRow(
                  label: loc.quickActionBookDoctor,
                  value: consultation.doctorName,
                ),
                const SizedBox(height: 10),
                _buildSummaryRow(
                  label: loc.filterSpecialization,
                  value: consultation.doctorSpecialization,
                ),
                const SizedBox(height: 10),
                _buildSummaryRow(
                  label: loc.consultationTypeTitle,
                  value: consultation.type.label,
                ),
                const SizedBox(height: 10),
                _buildSummaryRow(
                  label: loc.selectDateTitle,
                  value: _formatDate(consultation.date),
                ),
                const SizedBox(height: 10),
                _buildSummaryRow(
                  label: loc.selectTimeSlotTitle,
                  value: consultation.timeSlot,
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),
          // Action Buttons
          SizedBox(
            width: double.infinity,
            height: 48,
            child: ElevatedButton.icon(
              onPressed: () {
                Navigator.of(context).pushReplacementNamed(
                  AppRoutes.appointments,
                );
              },
              icon: const Icon(Icons.calendar_today_rounded, size: 18),
              label: Text(
                loc.addToAppointmentsBtn,
                style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                elevation: 0,
              ),
            ),
          ),
          const SizedBox(height: 12),
          SizedBox(
            width: double.infinity,
            height: 48,
            child: OutlinedButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              style: OutlinedButton.styleFrom(
                foregroundColor: AppColors.textPrimary,
                side: const BorderSide(color: AppColors.border),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: Text(
                loc.doneBtn,
                style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
              ),
            ),
          ),
        ],
      ),
    );
  }

  String _getWeekDayName(int weekday) {
    switch (weekday) {
      case 1:
        return 'Mon';
      case 2:
        return 'Tue';
      case 3:
        return 'Wed';
      case 4:
        return 'Thu';
      case 5:
        return 'Fri';
      case 6:
        return 'Sat';
      case 7:
      default:
        return 'Sun';
    }
  }

  String _formatDate(DateTime date) {
    return '${date.day.toString().padLeft(2, '0')}/${date.month.toString().padLeft(2, '0')}/${date.year}';
  }
}
