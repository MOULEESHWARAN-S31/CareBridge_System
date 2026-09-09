import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_dimensions.dart';
import '../../app/theme/app_text_styles.dart';
import 'care_bridge_status_chip.dart';

/// Reusable Accessible Card for CareBridge
class CareBridgeCard extends StatelessWidget {
  final String title;
  final String? subtitle;
  final Widget? leadingIcon;
  final Widget? trailingAction;
  final CareBridgeStatus? status;
  final String? statusLabel;
  final VoidCallback? onTap;
  final EdgeInsetsGeometry? padding;
  final Color? backgroundColor;
  final Color? borderColor;
  final Widget? child;

  const CareBridgeCard({
    super.key,
    required this.title,
    this.subtitle,
    this.leadingIcon,
    this.trailingAction,
    this.status,
    this.statusLabel,
    this.onTap,
    this.padding,
    this.backgroundColor,
    this.borderColor,
    this.child,
  });

  @override
  Widget build(BuildContext context) {
    final Widget cardContent = Padding(
      padding: padding ?? AppDimensions.cardPadding,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (leadingIcon != null) ...[
                Padding(
                  padding: const EdgeInsets.only(right: AppDimensions.space12, top: 2.0),
                  child: leadingIcon!,
                ),
              ],
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: AppTextStyles.heading3,
                    ),
                    if (subtitle != null) ...[
                      const SizedBox(height: AppDimensions.space4),
                      Text(
                        subtitle!,
                        style: AppTextStyles.bodySmall,
                      ),
                    ],
                  ],
                ),
              ),
              if (status != null) ...[
                const SizedBox(width: AppDimensions.space8),
                CareBridgeStatusChip(
                  status: status!,
                  customLabel: statusLabel,
                  isDense: true,
                ),
              ],
              if (trailingAction != null) ...[
                const SizedBox(width: AppDimensions.space8),
                trailingAction!,
              ],
            ],
          ),
          if (child != null) ...[
            const SizedBox(height: AppDimensions.space12),
            child!,
          ],
        ],
      ),
    );

    return Material(
      color: backgroundColor ?? AppColors.surface,
      elevation: AppDimensions.elevationLow,
      shadowColor: const Color(0x0A0F172A),
      shape: RoundedRectangleBorder(
        borderRadius: AppDimensions.roundedMedium,
        side: BorderSide(
          color: borderColor ?? AppColors.borderLight,
          width: 1.0,
        ),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: AppDimensions.roundedMedium,
        child: cardContent,
      ),
    );
  }
}
