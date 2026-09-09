import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../core/constants/app_constants.dart';

/// CareBridge Logo Widget
/// Loads the official `assets/images/logo.png` asset.
/// If the asset cannot be loaded (e.g., in unit tests or headless runners),
/// it gracefully falls back to an accessible healthcare-bridge symbol.
class CareBridgeLogo extends StatelessWidget {
  final double size;
  final bool showTagline;
  final bool isDarkBackground;

  const CareBridgeLogo({
    super.key,
    this.size = 80.0,
    this.showTagline = false,
    this.isDarkBackground = false,
  });

  @override
  Widget build(BuildContext context) {
    return Semantics(
      label: 'CareBridge Application Logo',
      image: true,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Image.asset(
            AppConstants.logoAssetPath,
            width: size,
            height: size,
            fit: BoxFit.contain,
            errorBuilder: (context, error, stackTrace) {
              // Graceful fallback symbol: Healthcare cross + bridge arc
              return _buildFallbackLogo(size);
            },
          ),
          if (showTagline) ...[
            const SizedBox(height: 8.0),
            Text(
              AppConstants.appTagline,
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 14.0,
                fontWeight: FontWeight.w500,
                color: isDarkBackground ? AppColors.textOnDark : AppColors.textSecondary,
                letterSpacing: 0.2,
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildFallbackLogo(double s) {
    return Container(
      width: s,
      height: s,
      decoration: BoxDecoration(
        color: AppColors.primaryLight,
        borderRadius: BorderRadius.circular(s * 0.22),
        border: Border.all(color: AppColors.primary, width: 2),
      ),
      child: Center(
        child: Icon(
          Icons.health_and_safety_rounded,
          size: s * 0.58,
          color: AppColors.primary,
        ),
      ),
    );
  }
}
