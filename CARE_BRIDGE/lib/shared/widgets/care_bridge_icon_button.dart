import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_dimensions.dart';
import '../../core/utils/accessibility_utils.dart';

/// Accessible CareBridge Icon Button
/// Guarantees a minimum 48x48dp touch target and clear semantic labeling.
class CareBridgeIconButton extends StatelessWidget {
  final IconData icon;
  final String tooltip;
  final VoidCallback? onPressed;
  final Color? color;
  final Color? backgroundColor;
  final double size;

  const CareBridgeIconButton({
    super.key,
    required this.icon,
    required this.tooltip,
    required this.onPressed,
    this.color,
    this.backgroundColor,
    this.size = AppDimensions.iconMedium,
  });

  @override
  Widget build(BuildContext context) {
    return AccessibilityUtils.ensureMinTouchTarget(
      child: Tooltip(
        message: tooltip,
        child: Semantics(
          button: true,
          label: tooltip,
          enabled: onPressed != null,
          child: Material(
            color: backgroundColor ?? Colors.transparent,
            shape: const CircleBorder(),
            child: InkWell(
              customBorder: const CircleBorder(),
              onTap: onPressed,
              child: Padding(
                padding: const EdgeInsets.all(AppDimensions.space12),
                child: Icon(
                  icon,
                  size: size,
                  color: onPressed == null
                      ? AppColors.disabled
                      : (color ?? AppColors.textPrimary),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
