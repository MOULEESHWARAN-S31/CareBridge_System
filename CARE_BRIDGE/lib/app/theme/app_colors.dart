import 'package:flutter/material.dart';

/// Centralized CareBridge Color Palette
/// Designed for high contrast, trustworthiness, and clear healthcare context.
class AppColors {
  AppColors._();

  // Primary - Deep Healthcare Blue
  static const Color primary = Color(0xFF0F4C81);
  static const Color primaryDark = Color(0xFF0A3358);
  static const Color primaryLight = Color(0xFFE8F1F8);
  static const Color primaryContainer = Color(0xFFD6E4F0);

  // Secondary - Healthcare Teal / Cyan
  static const Color secondary = Color(0xFF028090);
  static const Color secondaryDark = Color(0xFF015A66);
  static const Color secondaryLight = Color(0xFFE0F2F1);
  static const Color secondaryContainer = Color(0xFFB2DFDB);

  // Accent - Subtle Healthcare Green (growth, healing, vital signs)
  static const Color accent = Color(0xFF1E824C);
  static const Color accentLight = Color(0xFFE8F5E9);

  // Background & Surfaces
  static const Color background = Color(0xFFF8FAFC);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color surfaceVariant = Color(0xFFF1F5F9);
  static const Color surfaceMuted = Color(0xFFE2E8F0);

  // High-Contrast Accessible Typography
  static const Color textPrimary = Color(0xFF0F172A);
  static const Color textSecondary = Color(0xFF334155);
  static const Color textMuted = Color(0xFF64748B);
  static const Color textOnPrimary = Color(0xFFFFFFFF);
  static const Color textOnDark = Color(0xFFF8FAFC);

  // Emergency & Critical (Reserved for emergencies, critical alerts, shortages)
  static const Color emergency = Color(0xFFB91C1C);
  static const Color emergencyLight = Color(0xFFFEF2F2);
  static const Color critical = Color(0xFFDC2626);
  static const Color error = Color(0xFFC62828);
  static const Color errorLight = Color(0xFFFFEBEE);

  // System States
  static const Color warning = Color(0xFFD97706);
  static const Color warningLight = Color(0xFFFFFBEB);
  static const Color success = Color(0xFF059669);
  static const Color successLight = Color(0xFFECFDF5);
  static const Color info = Color(0xFF0284C7);
  static const Color infoLight = Color(0xFFF0F9FF);

  // Dividers, Borders & Disabled
  static const Color border = Color(0xFFCBD5E1);
  static const Color borderLight = Color(0xFFE2E8F0);
  static const Color divider = Color(0xFFE2E8F0);
  static const Color disabled = Color(0xFF94A3B8);
  static const Color disabledSurface = Color(0xFFF1F5F9);

  // Shimmer / Skeletons
  static const Color shimmerBase = Color(0xFFE2E8F0);
  static const Color shimmerHighlight = Color(0xFFF8FAFC);
}
