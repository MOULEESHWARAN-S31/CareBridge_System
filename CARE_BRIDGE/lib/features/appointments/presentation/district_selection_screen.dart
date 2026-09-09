import 'package:flutter/material.dart';
import 'package:care_bridge/app/theme/app_colors.dart';
import 'package:care_bridge/app/theme/app_dimensions.dart';
import 'package:care_bridge/app/theme/app_text_styles.dart';
import 'package:care_bridge/shared/widgets/care_bridge_button.dart';
import 'package:care_bridge/shared/widgets/care_bridge_card.dart';
import 'package:care_bridge/shared/widgets/care_bridge_state_widgets.dart';
import 'booking_flow_wrapper.dart';

class DistrictSelectionScreen extends StatelessWidget {
  final VoidCallback onNext;

  const DistrictSelectionScreen({
    super.key,
    required this.onNext,
  });

  @override
  Widget build(BuildContext context) {
    final controller = BookingScope.of(context);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Book Appointment'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Progress Indicator Header
            _buildProgressHeader('Step 1 of 5', 'Select District'),
            Expanded(
              child: controller.isLoadingDistricts
                  ? const CareBridgeLoading(message: 'Loading districts...')
                  : controller.districts.isEmpty
                      ? const CareBridgeEmptyState(
                          title: 'No Districts Available',
                          description: 'Please check back later or refresh.',
                          icon: Icons.map_outlined,
                        )
                      : ListView.separated(
                          padding: AppDimensions.screenPadding,
                          itemCount: controller.districts.length,
                          separatorBuilder: (context, index) => const SizedBox(height: AppDimensions.space10),
                          itemBuilder: (context, index) {
                            final district = controller.districts[index];
                            final isSelected = controller.selectedDistrict == district;

                            return CareBridgeCard(
                              title: district.name,
                              subtitle: '${district.state} • ${district.code}',
                              leadingIcon: Container(
                                padding: const EdgeInsets.all(AppDimensions.space6),
                                decoration: BoxDecoration(
                                  color: isSelected ? AppColors.primary : AppColors.background,
                                  shape: BoxShape.circle,
                                ),
                                child: Icon(
                                  Icons.location_city_rounded,
                                  color: isSelected ? AppColors.textOnPrimary : AppColors.primary,
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
                              onTap: () => controller.selectDistrict(district),
                              backgroundColor: isSelected
                                  ? AppColors.primaryLight.withValues(alpha: 0.5)
                                  : AppColors.surface,
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
              child: CareBridgeButton.primary(
                label: 'Continue to Hospitals',
                isFullWidth: true,
                onPressed: controller.canProceedToHospital ? onNext : null,
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
            style: AppTextStyles.heading2.copyWith(fontSize: 20.0),
          ),
        ],
      ),
    );
  }
}
