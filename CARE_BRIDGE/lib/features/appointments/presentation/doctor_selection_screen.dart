import 'package:flutter/material.dart';
import 'package:care_bridge/app/theme/app_colors.dart';
import 'package:care_bridge/app/theme/app_dimensions.dart';
import 'package:care_bridge/app/theme/app_text_styles.dart';
import 'package:care_bridge/shared/widgets/care_bridge_button.dart';
import 'package:care_bridge/shared/widgets/care_bridge_card.dart';
import 'package:care_bridge/shared/widgets/care_bridge_state_widgets.dart';
import 'booking_flow_wrapper.dart';

class DoctorSelectionScreen extends StatelessWidget {
  final VoidCallback onNext;
  final VoidCallback onBack;

  const DoctorSelectionScreen({
    super.key,
    required this.onNext,
    required this.onBack,
  });

  @override
  Widget build(BuildContext context) {
    final controller = BookingScope.of(context);
    final hospitalName = controller.selectedHospital?.name ?? '';

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
            _buildProgressHeader('Step 3 of 5', 'Select Doctor at $hospitalName'),
            Expanded(
              child: controller.isLoadingDoctors
                  ? const CareBridgeLoading(message: 'Loading doctors...')
                  : controller.doctors.isEmpty
                      ? const CareBridgeEmptyState(
                          title: 'No Doctors Available',
                          description: 'No available doctors found for this hospital.',
                          icon: Icons.person_off_outlined,
                        )
                      : ListView.separated(
                          padding: AppDimensions.screenPadding,
                          itemCount: controller.doctors.length,
                          separatorBuilder: (context, index) => const SizedBox(height: AppDimensions.space12),
                          itemBuilder: (context, index) {
                            final doctor = controller.doctors[index];
                            final isSelected = controller.selectedDoctor == doctor;

                            return CareBridgeCard(
                              title: doctor.name,
                              subtitle: doctor.specialization,
                              leadingIcon: CircleAvatar(
                                radius: 20.0,
                                backgroundColor: isSelected ? AppColors.primary : AppColors.primaryLight,
                                child: Icon(
                                  Icons.person_rounded,
                                  color: isSelected ? AppColors.textOnPrimary : AppColors.primary,
                                  size: 22.0,
                                ),
                              ),
                              trailingAction: isSelected
                                  ? const Icon(
                                      Icons.check_circle_rounded,
                                      color: AppColors.primary,
                                      size: 24.0,
                                    )
                                  : null,
                              onTap: doctor.isAvailable ? () => controller.selectDoctor(doctor) : null,
                              backgroundColor: isSelected
                                  ? AppColors.primaryLight.withValues(alpha: 0.5)
                                  : AppColors.surface,
                              child: Text(
                                '${doctor.qualification} • ${doctor.experienceYears} yrs exp',
                                style: AppTextStyles.caption.copyWith(
                                  color: AppColors.textSecondary,
                                ),
                              ),
                            );
                          },
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
                      onPressed: onBack,
                    ),
                  ),
                  const SizedBox(width: AppDimensions.space12),
                  Expanded(
                    flex: 2,
                    child: CareBridgeButton.primary(
                      label: 'Continue to Schedule',
                      onPressed: controller.canProceedToDateTime ? onNext : null,
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
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }
}
