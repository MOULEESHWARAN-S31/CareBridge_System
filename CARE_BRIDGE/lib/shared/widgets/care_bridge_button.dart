import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_dimensions.dart';
import '../../app/theme/app_text_styles.dart';
import '../../core/utils/accessibility_utils.dart';

enum CareBridgeButtonVariant {
  primary,
  secondary,
  outlined,
  text,
  emergency,
}

/// Accessible CareBridge Button Component
/// Supports 5 distinct variants with a guaranteed >=48dp touch target.
class CareBridgeButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final CareBridgeButtonVariant variant;
  final IconData? icon;
  final bool isLoading;
  final bool isFullWidth;
  final String? semanticHint;

  const CareBridgeButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.variant = CareBridgeButtonVariant.primary,
    this.icon,
    this.isLoading = false,
    this.isFullWidth = false,
    this.semanticHint,
  });

  const CareBridgeButton.primary({
    super.key,
    required this.label,
    required this.onPressed,
    this.icon,
    this.isLoading = false,
    this.isFullWidth = false,
    this.semanticHint,
  }) : variant = CareBridgeButtonVariant.primary;

  const CareBridgeButton.secondary({
    super.key,
    required this.label,
    required this.onPressed,
    this.icon,
    this.isLoading = false,
    this.isFullWidth = false,
    this.semanticHint,
  }) : variant = CareBridgeButtonVariant.secondary;

  const CareBridgeButton.outlined({
    super.key,
    required this.label,
    required this.onPressed,
    this.icon,
    this.isLoading = false,
    this.isFullWidth = false,
    this.semanticHint,
  }) : variant = CareBridgeButtonVariant.outlined;

  const CareBridgeButton.text({
    super.key,
    required this.label,
    required this.onPressed,
    this.icon,
    this.isLoading = false,
    this.isFullWidth = false,
    this.semanticHint,
  }) : variant = CareBridgeButtonVariant.text;

  const CareBridgeButton.emergency({
    super.key,
    required this.label,
    required this.onPressed,
    this.icon = Icons.emergency_rounded,
    this.isLoading = false,
    this.isFullWidth = false,
    this.semanticHint,
  }) : variant = CareBridgeButtonVariant.emergency;

  @override
  Widget build(BuildContext context) {
    final bool isEnabled = onPressed != null && !isLoading;

    Widget buttonWidget;
    switch (variant) {
      case CareBridgeButtonVariant.primary:
        buttonWidget = _buildElevated(
          bgColor: AppColors.primary,
          fgColor: AppColors.textOnPrimary,
        );
        break;
      case CareBridgeButtonVariant.secondary:
        buttonWidget = _buildElevated(
          bgColor: AppColors.secondary,
          fgColor: AppColors.textOnPrimary,
        );
        break;
      case CareBridgeButtonVariant.emergency:
        buttonWidget = _buildElevated(
          bgColor: AppColors.emergency,
          fgColor: AppColors.textOnPrimary,
        );
        break;
      case CareBridgeButtonVariant.outlined:
        buttonWidget = _buildOutlined();
        break;
      case CareBridgeButtonVariant.text:
        buttonWidget = _buildText();
        break;
    }

    return Semantics(
      button: true,
      enabled: isEnabled,
      label: label,
      hint: semanticHint,
      child: AccessibilityUtils.ensureMinTouchTarget(
        alignment: isFullWidth ? Alignment.center : Alignment.centerLeft,
        child: SizedBox(
          width: isFullWidth ? double.infinity : null,
          child: buttonWidget,
        ),
      ),
    );
  }

  Widget _buildContent(Color contentColor) {
    if (isLoading) {
      return SizedBox(
        width: 22,
        height: 22,
        child: CircularProgressIndicator(
          strokeWidth: 2.4,
          valueColor: AlwaysStoppedAnimation<Color>(contentColor),
        ),
      );
    }

    if (icon != null) {
      return Row(
        mainAxisSize: isFullWidth ? MainAxisSize.max : MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: AppDimensions.iconMedium, color: contentColor),
          const SizedBox(width: AppDimensions.space8),
          Flexible(
            child: Text(
              label,
              style: AppTextStyles.button.copyWith(color: contentColor),
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      );
    }

    return Text(
      label,
      style: AppTextStyles.button.copyWith(color: contentColor),
      overflow: TextOverflow.ellipsis,
    );
  }

  Widget _buildElevated({required Color bgColor, required Color fgColor}) {
    return ElevatedButton(
      onPressed: isLoading ? null : onPressed,
      style: ElevatedButton.styleFrom(
        backgroundColor: bgColor,
        foregroundColor: fgColor,
        disabledBackgroundColor: AppColors.disabledSurface,
        disabledForegroundColor: AppColors.disabled,
        minimumSize: const Size(AppDimensions.minTouchTarget, AppDimensions.buttonHeight),
        shape: RoundedRectangleBorder(borderRadius: AppDimensions.roundedMedium),
      ),
      child: _buildContent(fgColor),
    );
  }

  Widget _buildOutlined() {
    return OutlinedButton(
      onPressed: isLoading ? null : onPressed,
      style: OutlinedButton.styleFrom(
        foregroundColor: AppColors.primary,
        side: const BorderSide(color: AppColors.primary, width: 1.5),
        minimumSize: const Size(AppDimensions.minTouchTarget, AppDimensions.buttonHeight),
        shape: RoundedRectangleBorder(borderRadius: AppDimensions.roundedMedium),
      ),
      child: _buildContent(AppColors.primary),
    );
  }

  Widget _buildText() {
    return TextButton(
      onPressed: isLoading ? null : onPressed,
      style: TextButton.styleFrom(
        foregroundColor: AppColors.primary,
        minimumSize: const Size(AppDimensions.minTouchTarget, AppDimensions.buttonHeightSmall),
        shape: RoundedRectangleBorder(borderRadius: AppDimensions.roundedSmall),
      ),
      child: _buildContent(AppColors.primary),
    );
  }
}
