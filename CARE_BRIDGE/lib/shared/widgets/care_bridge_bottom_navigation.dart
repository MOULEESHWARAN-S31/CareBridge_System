import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_dimensions.dart';
import '../../core/localization/app_localizations.dart';

/// CareBridge Bottom Navigation Bar
/// 5 Primary Tabs: Home, Appointments, Care, Records, Profile.
/// Built with accessible semantics, clear icons, and distinct active states.
class CareBridgeBottomNavigation extends StatelessWidget {
  final int currentIndex;
  final ValueChanged<int> onTabSelected;

  const CareBridgeBottomNavigation({
    super.key,
    required this.currentIndex,
    required this.onTabSelected,
  });

  @override
  Widget build(BuildContext context) {
    final localizations = AppLocalizations.of(context);

    return Container(
      decoration: const BoxDecoration(
        color: AppColors.surface,
        border: Border(
          top: BorderSide(color: AppColors.borderLight, width: 1.0),
        ),
        boxShadow: [
          BoxShadow(
            color: Color(0x0A0F172A),
            blurRadius: 8,
            offset: Offset(0, -2),
          ),
        ],
      ),
      child: NavigationBar(
        selectedIndex: currentIndex,
        onDestinationSelected: onTabSelected,
        backgroundColor: AppColors.surface,
        surfaceTintColor: Colors.transparent,
        indicatorColor: AppColors.primaryContainer,
        height: 68,
        labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
        destinations: [
          NavigationDestination(
            icon: const Icon(Icons.home_outlined, size: AppDimensions.iconMedium),
            selectedIcon: const Icon(
              Icons.home_rounded,
              size: AppDimensions.iconMedium,
              color: AppColors.primary,
            ),
            label: localizations.tabHome,
            tooltip: 'Navigate to Home Tab',
          ),
          NavigationDestination(
            icon: const Icon(Icons.calendar_month_outlined, size: AppDimensions.iconMedium),
            selectedIcon: const Icon(
              Icons.calendar_month_rounded,
              size: AppDimensions.iconMedium,
              color: AppColors.primary,
            ),
            label: localizations.tabAppointments,
            tooltip: 'Navigate to Appointments Tab',
          ),
          NavigationDestination(
            icon: const Icon(Icons.medical_services_outlined, size: AppDimensions.iconMedium),
            selectedIcon: const Icon(
              Icons.medical_services_rounded,
              size: AppDimensions.iconMedium,
              color: AppColors.primary,
            ),
            label: localizations.tabCare,
            tooltip: 'Navigate to Care Tab',
          ),
          NavigationDestination(
            icon: const Icon(Icons.folder_shared_outlined, size: AppDimensions.iconMedium),
            selectedIcon: const Icon(
              Icons.folder_shared_rounded,
              size: AppDimensions.iconMedium,
              color: AppColors.primary,
            ),
            label: localizations.tabRecords,
            tooltip: 'Navigate to Health Records Tab',
          ),
          NavigationDestination(
            icon: const Icon(Icons.person_outline_rounded, size: AppDimensions.iconMedium),
            selectedIcon: const Icon(
              Icons.person_rounded,
              size: AppDimensions.iconMedium,
              color: AppColors.primary,
            ),
            label: localizations.tabProfile,
            tooltip: 'Navigate to Profile Tab',
          ),
        ],
      ),
    );
  }
}
