import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_dimensions.dart';
import '../../app/theme/app_text_styles.dart';

enum CareBridgeStatus {
  available,
  unavailable,
  pending,
  confirmed,
  completed,
  critical,
  warning,
}

/// Accessible Status Chip
/// Combines high-contrast background, border, text label, AND distinct icon
/// to ensure color-blind and low-vision accessibility.
class CareBridgeStatusChip extends StatelessWidget {
  final CareBridgeStatus status;
  final String? customLabel;
  final bool isDense;

  const CareBridgeStatusChip({
    super.key,
    required this.status,
    this.customLabel,
    this.isDense = false,
  });

  @override
  Widget build(BuildContext context) {
    final _StatusConfig config = _getConfig(status);

    return Semantics(
      label: 'Status: ${customLabel ?? config.defaultLabel}',
      child: Container(
        padding: EdgeInsets.symmetric(
          horizontal: isDense ? AppDimensions.space8 : AppDimensions.space12,
          vertical: isDense ? AppDimensions.space4 : AppDimensions.space4 + 2,
        ),
        decoration: BoxDecoration(
          color: config.backgroundColor,
          borderRadius: AppDimensions.roundedFull,
          border: Border.all(color: config.borderColor, width: 1.2),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Icon(
              config.icon,
              size: isDense ? 14.0 : 16.0,
              color: config.textColor,
            ),
            const SizedBox(width: AppDimensions.space4 + 2),
            Text(
              customLabel ?? config.defaultLabel,
              style: AppTextStyles.label.copyWith(
                fontSize: isDense ? 12.0 : 13.0,
                color: config.textColor,
                fontWeight: FontWeight.w700,
              ),
            ),
          ],
        ),
      ),
    );
  }

  _StatusConfig _getConfig(CareBridgeStatus status) {
    switch (status) {
      case CareBridgeStatus.available:
        return const _StatusConfig(
          defaultLabel: 'Available',
          icon: Icons.check_circle_rounded,
          textColor: AppColors.success,
          backgroundColor: AppColors.successLight,
          borderColor: Color(0xFFA7F3D0),
        );
      case CareBridgeStatus.unavailable:
        return const _StatusConfig(
          defaultLabel: 'Unavailable',
          icon: Icons.cancel_rounded,
          textColor: AppColors.textMuted,
          backgroundColor: AppColors.disabledSurface,
          borderColor: AppColors.border,
        );
      case CareBridgeStatus.pending:
        return const _StatusConfig(
          defaultLabel: 'Pending',
          icon: Icons.hourglass_top_rounded,
          textColor: AppColors.warning,
          backgroundColor: AppColors.warningLight,
          borderColor: Color(0xFFFDE68A),
        );
      case CareBridgeStatus.confirmed:
        return const _StatusConfig(
          defaultLabel: 'Confirmed',
          icon: Icons.verified_rounded,
          textColor: AppColors.primary,
          backgroundColor: AppColors.primaryLight,
          borderColor: Color(0xFFBFDBFE),
        );
      case CareBridgeStatus.completed:
        return const _StatusConfig(
          defaultLabel: 'Completed',
          icon: Icons.task_alt_rounded,
          textColor: AppColors.secondary,
          backgroundColor: AppColors.secondaryLight,
          borderColor: Color(0xFF99F6E4),
        );
      case CareBridgeStatus.critical:
        return const _StatusConfig(
          defaultLabel: 'Critical',
          icon: Icons.warning_rounded,
          textColor: AppColors.critical,
          backgroundColor: AppColors.emergencyLight,
          borderColor: Color(0xFFFECACA),
        );
      case CareBridgeStatus.warning:
        return const _StatusConfig(
          defaultLabel: 'Warning',
          icon: Icons.report_problem_rounded,
          textColor: AppColors.warning,
          backgroundColor: AppColors.warningLight,
          borderColor: Color(0xFFFDE68A),
        );
    }
  }
}

class _StatusConfig {
  final String defaultLabel;
  final IconData icon;
  final Color textColor;
  final Color backgroundColor;
  final Color borderColor;

  const _StatusConfig({
    required this.defaultLabel,
    required this.icon,
    required this.textColor,
    required this.backgroundColor,
    required this.borderColor,
  });
}
