import 'package:flutter/material.dart';
import '../constants/app_constants.dart';

/// CareBridge Accessibility Utilities
/// Enforces WCAG 2.1 AA+ compliance for rural, elderly, and underserved communities.
class AccessibilityUtils {
  AccessibilityUtils._();

  /// Wraps a widget in a minimum 48x48dp interactive box
  static Widget ensureMinTouchTarget({
    required Widget child,
    double minWidth = AppConstants.minTouchTargetSize,
    double minHeight = AppConstants.minTouchTargetSize,
    Alignment alignment = Alignment.center,
  }) {
    return ConstrainedBox(
      constraints: BoxConstraints(
        minWidth: minWidth,
        minHeight: minHeight,
      ),
      child: Align(
        alignment: alignment,
        child: child,
      ),
    );
  }

  /// Calculates clamped text scale factor to prevent catastrophic layout overflow
  /// while still honoring user's accessibility text scaling preferences up to 1.6x.
  static double getClampedTextScale(BuildContext context, {double maxScale = 1.6}) {
    final double textScaler = MediaQuery.textScalerOf(context).scale(1.0);
    return textScaler.clamp(1.0, maxScale);
  }

  /// Creates a screen-reader announcement wrapper
  static Widget semanticHeader({
    required String label,
    required Widget child,
  }) {
    return Semantics(
      header: true,
      label: label,
      child: child,
    );
  }

  /// Creates an accessible interactive card with explicit semantic hints
  static Widget semanticButton({
    required String label,
    required String hint,
    required VoidCallback onTap,
    required Widget child,
    bool isEnabled = true,
  }) {
    return Semantics(
      button: true,
      enabled: isEnabled,
      label: label,
      hint: hint,
      child: child,
    );
  }
}
