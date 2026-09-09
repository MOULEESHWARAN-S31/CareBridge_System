import 'package:flutter/material.dart';

/// Centralized Spacing and Dimensional Tokens for CareBridge.
class AppDimensions {
  AppDimensions._();

  // Spacing & Padding
  static const double space2 = 2.0;
  static const double space4 = 4.0;
  static const double space6 = 6.0;
  static const double space8 = 8.0;
  static const double space10 = 10.0;
  static const double space12 = 12.0;
  static const double space14 = 14.0;
  static const double space16 = 16.0;
  static const double space20 = 20.0;
  static const double space24 = 24.0;
  static const double space28 = 28.0;
  static const double space32 = 32.0;
  static const double space40 = 40.0;
  static const double space48 = 48.0;

  // Standard Margins
  static const EdgeInsets screenPadding = EdgeInsets.symmetric(
    horizontal: space16,
    vertical: space16,
  );

  static const EdgeInsets cardPadding = EdgeInsets.all(space16);
  static const EdgeInsets cardPaddingDense = EdgeInsets.all(space12);

  // Border Radii
  static const double radiusSmall = 8.0;
  static const double radiusMedium = 12.0;
  static const double radiusLarge = 16.0;
  static const double radiusExtraLarge = 24.0;
  static const double radiusCircular = 999.0;

  static const BorderRadius roundedSmall = BorderRadius.all(Radius.circular(radiusSmall));
  static const BorderRadius roundedMedium = BorderRadius.all(Radius.circular(radiusMedium));
  static const BorderRadius roundedLarge = BorderRadius.all(Radius.circular(radiusLarge));
  static const BorderRadius roundedFull = BorderRadius.all(Radius.circular(radiusCircular));

  // Touch Target & Heights
  static const double minTouchTarget = 48.0;
  static const double buttonHeight = 52.0;
  static const double buttonHeightSmall = 40.0;
  static const double inputHeight = 56.0;

  // Icon Sizes
  static const double iconSmall = 18.0;
  static const double iconMedium = 24.0;
  static const double iconLarge = 32.0;
  static const double iconXLarge = 48.0;

  // Elevations
  static const double elevationNone = 0.0;
  static const double elevationLow = 1.0;
  static const double elevationMedium = 3.0;
  static const double elevationHigh = 6.0;
}
