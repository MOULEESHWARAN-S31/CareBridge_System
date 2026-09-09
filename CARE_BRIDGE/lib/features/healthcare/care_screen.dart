import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_dimensions.dart';
import '../../app/theme/app_text_styles.dart';
import '../../core/localization/app_localizations.dart';
import '../../features/location/domain/healthcare_facility.dart';
import '../../shared/widgets/care_bridge_card.dart';
import '../../shared/widgets/care_bridge_emergency_dialog.dart';
import '../../shared/widgets/care_bridge_search_bar.dart';
import 'doctor_discovery_screen.dart';
import 'facility_discovery_screen.dart';

import '../../features/location/domain/location_service.dart';

/// CareBridge Healthcare Services Screen
class CareScreen extends StatelessWidget {
  final LocationService? locationServiceOverride;

  const CareScreen({
    super.key,
    this.locationServiceOverride,
  });

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text(loc.tabCare),
      ),
      body: SingleChildScrollView(
        padding: AppDimensions.screenPadding,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            CareBridgeSearchBar(
              hintText: loc.searchRecordsHint,
            ),
            const SizedBox(height: AppDimensions.space20),
            Text(
              loc.publicHealthServicesTitle,
              style: AppTextStyles.heading2,
            ),
            const SizedBox(height: AppDimensions.space4),
            Text(
              loc.publicHealthServicesSubtitle,
              style: AppTextStyles.bodySmall,
            ),
            const SizedBox(height: AppDimensions.space16),

            // Hospitals Card
            CareBridgeCard(
              key: const Key('service_hospitals_card'),
              title: loc.hospitalsTitle,
              subtitle: loc.hospitalsSubtitle,
              leadingIcon: Container(
                padding: const EdgeInsets.all(AppDimensions.space12),
                decoration: BoxDecoration(
                  color: AppColors.secondaryLight,
                  borderRadius: AppDimensions.roundedMedium,
                ),
                child: const Icon(
                  Icons.local_hospital_rounded,
                  color: AppColors.secondary,
                  size: AppDimensions.iconMedium,
                ),
              ),
              trailingAction: const Icon(
                Icons.arrow_forward_ios_rounded,
                size: 14.0,
                color: AppColors.textMuted,
              ),
              onTap: () {
                Navigator.of(context).push(
                  MaterialPageRoute<void>(
                    builder: (_) => const FacilityDiscoveryScreen(
                      facilityType: FacilityType.hospital,
                    ),
                  ),
                );
              },
            ),
            const SizedBox(height: AppDimensions.space12),

            // Find Doctor Card
            CareBridgeCard(
              key: const Key('service_find_doctor_card'),
              title: loc.findDoctorTitle,
              subtitle: loc.findDoctorSubtitle,
              leadingIcon: Container(
                padding: const EdgeInsets.all(AppDimensions.space12),
                decoration: BoxDecoration(
                  color: AppColors.primaryLight,
                  borderRadius: AppDimensions.roundedMedium,
                ),
                child: const Icon(
                  Icons.person_search_rounded,
                  color: AppColors.primary,
                  size: AppDimensions.iconMedium,
                ),
              ),
              trailingAction: const Icon(
                Icons.arrow_forward_ios_rounded,
                size: 14.0,
                color: AppColors.textMuted,
              ),
              onTap: () {
                Navigator.of(context).push(
                  MaterialPageRoute<void>(
                    builder: (_) => const DoctorDiscoveryScreen(),
                  ),
                );
              },
            ),
            // Medical / Pharmacies Card
            CareBridgeCard(
              key: const Key('service_medical_card'),
              title: loc.medicalTitle,
              subtitle: loc.medicalSubtitle,
              leadingIcon: Container(
                padding: const EdgeInsets.all(AppDimensions.space12),
                decoration: BoxDecoration(
                  color: AppColors.primaryLight,
                  borderRadius: AppDimensions.roundedMedium,
                ),
                child: const Icon(
                  Icons.local_pharmacy_rounded,
                  color: AppColors.primary,
                  size: AppDimensions.iconMedium,
                ),
              ),
              trailingAction: const Icon(
                Icons.arrow_forward_ios_rounded,
                size: 14.0,
                color: AppColors.textMuted,
              ),
              onTap: () {
                Navigator.of(context).push(
                  MaterialPageRoute<void>(
                    builder: (_) => FacilityDiscoveryScreen(
                      facilityType: FacilityType.medical,
                      locationServiceOverride: locationServiceOverride,
                    ),
                  ),
                );
              },
            ),
            const SizedBox(height: AppDimensions.space12),

            // Emergency Services Card
            CareBridgeCard(
              key: const Key('service_emergency_card'),
              title: loc.emergencyServicesTitle,
              subtitle: loc.emergencyServicesSubtitle,
              backgroundColor: AppColors.emergencyLight,
              borderColor: AppColors.emergency.withValues(alpha: 0.5),
              leadingIcon: Container(
                padding: const EdgeInsets.all(AppDimensions.space12),
                decoration: BoxDecoration(
                  color: AppColors.emergencyLight,
                  borderRadius: AppDimensions.roundedMedium,
                ),
                child: const Icon(
                  Icons.emergency_rounded,
                  color: AppColors.emergency,
                  size: AppDimensions.iconMedium,
                ),
              ),
              trailingAction: const Icon(
                Icons.arrow_forward_ios_rounded,
                size: 14.0,
                color: AppColors.emergency,
              ),
              onTap: () {
                showCareBridgeEmergencyDialog(context, loc);
              },
            ),
          ],
        ),
      ),
    );
  }
}
