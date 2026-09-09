import 'package:flutter/material.dart';
import 'package:care_bridge/app/theme/app_colors.dart';
import 'package:care_bridge/app/theme/app_dimensions.dart';
import 'package:care_bridge/app/theme/app_text_styles.dart';
import 'package:care_bridge/core/services/session_service.dart';
import 'package:care_bridge/shared/widgets/care_bridge_button.dart';
import 'package:care_bridge/shared/widgets/care_bridge_card.dart';
import 'booking_flow_wrapper.dart';

class AppointmentSummaryScreen extends StatelessWidget {
  final VoidCallback onNext;
  final VoidCallback onBack;

  const AppointmentSummaryScreen({
    super.key,
    required this.onNext,
    required this.onBack,
  });

  Future<void> _handleConfirm(BuildContext context) async {
    final controller = BookingScope.of(context);
    final session = await SessionService.init();
    final abhaProfile = session.getActiveAbhaProfile();
    final patientProfileId = abhaProfile?.id ?? 'PATIENT_GUEST';

    final appointment = await controller.confirmBooking(patientProfileId);

    if (appointment != null && context.mounted) {
      onNext();
    }
  }

  @override
  Widget build(BuildContext context) {
    final controller = BookingScope.of(context);
    final district = controller.selectedDistrict;
    final hospital = controller.selectedHospital;
    final doctor = controller.selectedDoctor;
    final date = controller.selectedDate;
    final slot = controller.selectedSlot;

    final formattedDate = date != null
        ? '${date.day.toString().padLeft(2, '0')}/${date.month.toString().padLeft(2, '0')}/${date.year}'
        : '';

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Book Appointment'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded),
          onPressed: onBack,
        ),
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Progress Header
            _buildProgressHeader('Step 5 of 5', 'Confirm Appointment Details'),
            Expanded(
              child: SingleChildScrollView(
                padding: AppDimensions.screenPadding,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    if (controller.errorMessage != null) ...[
                      Container(
                        padding: const EdgeInsets.all(AppDimensions.space12),
                        decoration: BoxDecoration(
                          color: AppColors.emergencyLight,
                          borderRadius: AppDimensions.roundedMedium,
                          border: Border.all(color: AppColors.emergency),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.error_outline_rounded, color: AppColors.emergency),
                            const SizedBox(width: AppDimensions.space8),
                            Expanded(
                              child: Text(
                                controller.errorMessage!,
                                style: AppTextStyles.bodySmall.copyWith(color: AppColors.emergency),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: AppDimensions.space16),
                    ],

                    // Patient Details Card
                    FutureBuilder<SessionService>(
                      future: SessionService.init(),
                      builder: (context, snapshot) {
                        final abha = snapshot.data?.getActiveAbhaProfile();
                        return CareBridgeCard(
                          title: 'Patient Profile',
                          leadingIcon: const Icon(Icons.person_outline_rounded, color: AppColors.primary),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                abha?.fullName ?? 'Patient User',
                                style: AppTextStyles.body.copyWith(fontWeight: FontWeight.bold),
                              ),
                              if (abha != null)
                                Text(
                                  'ABHA No: ${abha.abhaNumber}',
                                  style: AppTextStyles.caption.copyWith(color: AppColors.textSecondary),
                                ),
                            ],
                          ),
                        );
                      },
                    ),
                    const SizedBox(height: AppDimensions.space12),

                    // Appointment Overview Card
                    CareBridgeCard(
                      title: 'Appointment Summary',
                      leadingIcon: const Icon(Icons.medical_services_outlined, color: AppColors.primary),
                      child: Column(
                        children: [
                          _buildDetailRow(
                            icon: Icons.location_city_rounded,
                            label: 'District',
                            value: district?.name ?? '-',
                          ),
                          const Divider(height: 16),
                          _buildDetailRow(
                            icon: Icons.local_hospital_rounded,
                            label: 'Hospital',
                            value: hospital?.name ?? '-',
                            subValue: hospital?.address,
                          ),
                          const Divider(height: 16),
                          _buildDetailRow(
                            icon: Icons.person_rounded,
                            label: 'Doctor',
                            value: doctor?.name ?? '-',
                            subValue: doctor?.specialization,
                          ),
                          const Divider(height: 16),
                          _buildDetailRow(
                            icon: Icons.calendar_today_rounded,
                            label: 'Date & Time',
                            value: '$formattedDate at ${slot?.displayTime ?? '-'}',
                          ),
                          const Divider(height: 16),
                          _buildDetailRow(
                            icon: Icons.phone_rounded,
                            label: 'Hospital Contact',
                            value: hospital?.contactNumber ?? '-',
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            // Action Footer
            Container(
              padding: AppDimensions.screenPadding,
              decoration: const BoxDecoration(
                color: AppColors.surface,
                border: Border(top: BorderSide(color: AppColors.borderLight)),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: CareBridgeButton.outlined(
                      label: 'Back',
                      onPressed: controller.isBookingInProcess ? null : onBack,
                    ),
                  ),
                  const SizedBox(width: AppDimensions.space12),
                  Expanded(
                    flex: 2,
                    child: CareBridgeButton.primary(
                      label: controller.isBookingInProcess ? 'Confirming...' : 'Confirm Appointment',
                      onPressed: controller.canProceedToSummary && !controller.isBookingInProcess
                          ? () => _handleConfirm(context)
                          : null,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow({
    required IconData icon,
    required String label,
    required String value,
    String? subValue,
  }) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 20.0, color: AppColors.primary),
        const SizedBox(width: AppDimensions.space10),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: AppTextStyles.caption.copyWith(color: AppColors.textSecondary),
              ),
              Text(
                value,
                style: AppTextStyles.body.copyWith(
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimary,
                ),
              ),
              if (subValue != null)
                Text(
                  subValue,
                  style: AppTextStyles.caption.copyWith(color: AppColors.primary),
                ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildProgressHeader(String stepText, String titleText) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppDimensions.space16),
      color: AppColors.surface,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            stepText.toUpperCase(),
            style: AppTextStyles.label.copyWith(
              color: AppColors.primary,
              fontWeight: FontWeight.bold,
              letterSpacing: 1.1,
            ),
          ),
          const SizedBox(height: 2.0),
          Text(
            titleText,
            style: AppTextStyles.heading2.copyWith(fontSize: 18.0),
          ),
        ],
      ),
    );
  }
}
