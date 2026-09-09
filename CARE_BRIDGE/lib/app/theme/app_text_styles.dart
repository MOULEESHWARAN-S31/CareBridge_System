import 'package:flutter/material.dart';
import 'app_colors.dart';

/// Centralized Typography System for CareBridge.
/// Highly readable sans-serif typography tuned for accessibility and low digital literacy.
class AppTextStyles {
  AppTextStyles._();

  static const String fontFamily = 'Roboto';

  // Display - Splash / Hero statements
  static const TextStyle display = TextStyle(
    fontFamily: fontFamily,
    fontSize: 28.0,
    fontWeight: FontWeight.w700,
    color: AppColors.textPrimary,
    letterSpacing: -0.5,
    height: 1.25,
  );

  // Heading 1 - Screen titles
  static const TextStyle heading1 = TextStyle(
    fontFamily: fontFamily,
    fontSize: 24.0,
    fontWeight: FontWeight.w700,
    color: AppColors.textPrimary,
    letterSpacing: -0.3,
    height: 1.3,
  );

  // Heading 2 - Section titles
  static const TextStyle heading2 = TextStyle(
    fontFamily: fontFamily,
    fontSize: 20.0,
    fontWeight: FontWeight.w600,
    color: AppColors.textPrimary,
    letterSpacing: -0.2,
    height: 1.35,
  );

  // Heading 3 - Card titles / Group headers
  static const TextStyle heading3 = TextStyle(
    fontFamily: fontFamily,
    fontSize: 17.0,
    fontWeight: FontWeight.w600,
    color: AppColors.textPrimary,
    height: 1.4,
  );

  // Body Large - Emphasized body text, subtitles
  static const TextStyle bodyLarge = TextStyle(
    fontFamily: fontFamily,
    fontSize: 16.0,
    fontWeight: FontWeight.w400,
    color: AppColors.textPrimary,
    height: 1.5,
  );

  // Body - Standard reading text
  static const TextStyle body = TextStyle(
    fontFamily: fontFamily,
    fontSize: 15.0,
    fontWeight: FontWeight.w400,
    color: AppColors.textSecondary,
    height: 1.5,
  );

  // Body Small - Secondary descriptions, metadata
  static const TextStyle bodySmall = TextStyle(
    fontFamily: fontFamily,
    fontSize: 13.5,
    fontWeight: FontWeight.w400,
    color: AppColors.textMuted,
    height: 1.4,
  );

  // Label - Badges, form labels, metadata tags
  static const TextStyle label = TextStyle(
    fontFamily: fontFamily,
    fontSize: 13.0,
    fontWeight: FontWeight.w600,
    color: AppColors.textSecondary,
    letterSpacing: 0.2,
    height: 1.3,
  );

  // Button - Action labels
  static const TextStyle button = TextStyle(
    fontFamily: fontFamily,
    fontSize: 15.0,
    fontWeight: FontWeight.w600,
    letterSpacing: 0.3,
    height: 1.2,
  );

  // Caption - Footnotes, timestamps, disclaimers
  static const TextStyle caption = TextStyle(
    fontFamily: fontFamily,
    fontSize: 12.0,
    fontWeight: FontWeight.w500,
    color: AppColors.textMuted,
    height: 1.3,
  );
}
