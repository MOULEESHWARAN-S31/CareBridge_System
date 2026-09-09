import 'package:flutter/material.dart';
import 'package:care_bridge/app/theme/app_colors.dart';
import 'package:care_bridge/app/theme/app_dimensions.dart';
import 'package:care_bridge/app/theme/app_text_styles.dart';
import 'package:care_bridge/shared/widgets/care_bridge_button.dart';
import 'package:care_bridge/shared/widgets/care_bridge_card.dart';
import 'package:care_bridge/shared/widgets/care_bridge_state_widgets.dart';
import 'booking_flow_wrapper.dart';
import '../data/phone_call_service_impl.dart';
import '../domain/hospital.dart';

class HospitalSelectionScreen extends StatelessWidget {
  final VoidCallback onNext;
  final VoidCallback onBack;

  const HospitalSelectionScreen({
    super.key,
    required this.onNext,
    required this.onBack,
  });

  Future<void> _makeHospitalCall(BuildContext context, Hospital hospital) async {
    const phoneService = PhoneCallServiceImpl();
    final success = await phoneService.makeCall(
      hospital.contactNumber,
      hospitalName: hospital.name,
    );

    if (!context.mounted) return;

    if (!success) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Calling ${hospital.contactNumber} (${hospital.name})...'),
          backgroundColor: AppColors.primary,
          duration: const Duration(seconds: 3),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final controller = BookingScope.of(context);
    final districtName = controller.selectedDistrict?.name ?? '';

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
            _buildProgressHeader('Step 2 of 5', 'Select Hospital in $districtName'),
            Expanded(
              child: controller.isLoadingHospitals
                  ? const CareBridgeLoading(message: 'Loading hospitals...')
                  : controller.hospitals.isEmpty
                      ? CareBridgeEmptyState(
                          title: 'No Hospitals Found',
                          description: 'No registered hospitals found in $districtName.',
                          icon: Icons.local_hospital_outlined,
                        )
                      : ListView.separated(
                          padding: AppDimensions.screenPadding,
                          itemCount: controller.hospitals.length,
                          separatorBuilder: (context, index) => const SizedBox(height: AppDimensions.space12),
                          itemBuilder: (context, index) {
                            final hospital = controller.hospitals[index];
                            final isSelected = controller.selectedHospital == hospital;

                            return CareBridgeCard(
                              title: hospital.name,
                              subtitle: hospital.type,
                              leadingIcon: Container(
                                padding: const EdgeInsets.all(AppDimensions.space6),
                                decoration: BoxDecoration(
                                  color: isSelected ? AppColors.primary : AppColors.secondaryLight,
                                  shape: BoxShape.circle,
                                ),
                                child: Icon(
                                  Icons.local_hospital_rounded,
                                  color: isSelected ? AppColors.textOnPrimary : AppColors.secondary,
                                  size: 20.0,
                                ),
                              ),
                              trailingAction: isSelected
                                  ? const Icon(
                                      Icons.check_circle_rounded,
                                      color: AppColors.primary,
                                      size: 24.0,
                                    )
                                  : null,
                              onTap: () => controller.selectHospital(hospital),
                              backgroundColor: isSelected
                                  ? AppColors.primaryLight.withValues(alpha: 0.5)
                                  : AppColors.surface,
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      const Icon(
                                        Icons.location_on_outlined,
                                        size: 14.0,
                                        color: AppColors.textMuted,
                                      ),
                                      const SizedBox(width: 4.0),
                                      Expanded(
                                        child: Text(
                                          hospital.address,
                                          style: AppTextStyles.caption.copyWith(
                                            color: AppColors.textSecondary,
                                          ),
                                          maxLines: 1,
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                      ),
                                    ],
                                  ),
                                  const Divider(height: 20),
                                  // Non-blocking Call Action
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      Row(
                                        children: [
                                          const Icon(Icons.phone_rounded, size: 16.0, color: AppColors.secondary),
                                          const SizedBox(width: 6.0),
                                          Text(
                                            hospital.contactNumber,
                                            style: AppTextStyles.bodySmall.copyWith(
                                              fontWeight: FontWeight.w600,
                                              color: AppColors.textPrimary,
                                            ),
                                          ),
                                        ],
                                      ),
                                      CareBridgeButton.outlined(
                                        label: 'Call Hospital',
                                        icon: Icons.call_rounded,
                                        onPressed: () => _makeHospitalCall(context, hospital),
                                      ),
                                    ],
                                  ),
                                ],
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
                      label: 'Continue to Doctors',
                      onPressed: controller.canProceedToDoctor ? onNext : null,
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
