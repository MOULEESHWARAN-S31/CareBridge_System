import 'dart:async';
import 'package:flutter/material.dart';
import '../../app/routes/app_routes.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_dimensions.dart';
import '../../app/theme/app_text_styles.dart';
import '../../core/constants/app_constants.dart';
import '../../shared/widgets/care_bridge_logo.dart';
import '../authentication/presentation/authentication_controller.dart';

/// Professional CareBridge Splash Screen
/// Determines startup route: Onboarding, Login, Profile Setup, or Main.
class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  Timer? _splashTimer;

  @override
  void initState() {
    super.initState();
    _splashTimer = Timer(const Duration(milliseconds: 1600), () {
      if (mounted) {
        _navigateNext();
      }
    });
  }

  void _navigateNext() {
    try {
      final controller = CareBridgeAuthScope.of(context);

      String targetRoute;
      if (!controller.isOnboardingSeen) {
        targetRoute = AppRoutes.onboarding;
      } else if (!controller.isAuthenticated) {
        targetRoute = AppRoutes.login;
      } else {
        // Authenticated users go directly to the main dashboard
        targetRoute = AppRoutes.main;
      }

      Navigator.of(context).pushReplacementNamed(targetRoute);
    } catch (_) {
      // Fallback in environments where scope is not bound
      Navigator.of(context).pushReplacementNamed(AppRoutes.main);
    }
  }

  @override
  void dispose() {
    _splashTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.surface,
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: AppDimensions.screenPadding,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Spacer(flex: 2),
                const CareBridgeLogo(
                  size: 96.0,
                  showTagline: false,
                ),
                const SizedBox(height: AppDimensions.space24),
                const Text(
                  AppConstants.appName,
                  style: TextStyle(
                    fontFamily: AppTextStyles.fontFamily,
                    fontSize: 32.0,
                    fontWeight: FontWeight.w800,
                    color: AppColors.primary,
                    letterSpacing: -0.5,
                  ),
                ),
                const SizedBox(height: AppDimensions.space8),
                Text(
                  AppConstants.appTagline,
                  textAlign: TextAlign.center,
                  style: AppTextStyles.body.copyWith(
                    color: AppColors.textSecondary,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const Spacer(flex: 2),
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(
                      Icons.lock_outline_rounded,
                      size: 16.0,
                      color: AppColors.textMuted,
                    ),
                    const SizedBox(width: AppDimensions.space8),
                    Text(
                      'Public Health Access Platform',
                      style: AppTextStyles.caption.copyWith(color: AppColors.textMuted),
                    ),
                  ],
                ),
                const SizedBox(height: AppDimensions.space16),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
