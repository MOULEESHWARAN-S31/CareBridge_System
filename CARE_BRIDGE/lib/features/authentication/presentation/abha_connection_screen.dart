import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../app/routes/app_routes.dart';
import '../../../app/theme/app_colors.dart';
import '../../../app/theme/app_dimensions.dart';
import '../../../app/theme/app_text_styles.dart';
import '../../../core/constants/app_constants.dart';
import '../../../core/localization/app_localizations.dart';
import '../../../core/utils/accessibility_utils.dart';
import '../../../shared/widgets/care_bridge_button.dart';
import '../../../shared/widgets/care_bridge_logo.dart';

/// CareBridge ABHA Connection Screen
///
/// Shown immediately after successful OTP verification.
/// Provides two options:
///   1. Connect with existing ABHA account (mock/prototype)
///   2. Create a new ABHA account (opens official ABDM registration URL)
class AbhaConnectionScreen extends StatefulWidget {
  const AbhaConnectionScreen({super.key});

  @override
  State<AbhaConnectionScreen> createState() => _AbhaConnectionScreenState();
}

class _AbhaConnectionScreenState extends State<AbhaConnectionScreen> {
  bool _isConnecting = false;
  bool _isLaunchingUrl = false;

  /// Mock: Proceeds to patient home dashboard as if ABHA was connected.
  Future<void> _connectWithAbha() async {
    setState(() => _isConnecting = true);

    // Simulate a brief connection attempt for prototype realism
    await Future<void>.delayed(const Duration(milliseconds: 800));

    if (!mounted) return;
    setState(() => _isConnecting = false);

    Navigator.of(context).pushNamedAndRemoveUntil(
      AppRoutes.main,
      (route) => false,
    );
  }

  /// Opens the official ABHA registration page in an external browser.
  Future<void> _createAbhaCard() async {
    setState(() => _isLaunchingUrl = true);

    try {
      final uri = Uri.parse(AppConstants.abhaRegistrationUrl);
      final bool launched = await launchUrl(
        uri,
        mode: LaunchMode.externalApplication,
      );
      if (!launched && mounted) {
        _showLaunchError();
      }
    } catch (_) {
      if (mounted) _showLaunchError();
    } finally {
      if (mounted) setState(() => _isLaunchingUrl = false);
    }
  }

  void _showLaunchError() {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          'Could not open the ABHA website. Please visit '
          '${AppConstants.abhaRegistrationUrl} in your browser.',
          style: AppTextStyles.bodySmall.copyWith(color: Colors.white),
        ),
        backgroundColor: AppColors.textPrimary,
        duration: const Duration(seconds: 5),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  void _skipForNow() {
    Navigator.of(context).pushNamedAndRemoveUntil(
      AppRoutes.main,
      (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context);
    final bool anyLoading = _isConnecting || _isLaunchingUrl;

    return Scaffold(
      backgroundColor: AppColors.surface,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        elevation: 0,
        // Allow going back to the login/OTP entry if needed
        leading: AccessibilityUtils.ensureMinTouchTarget(
          child: IconButton(
            icon: const Icon(Icons.arrow_back_rounded),
            tooltip: loc.backBtn,
            onPressed: anyLoading ? null : () => Navigator.of(context).pop(),
          ),
        ),
        actions: [
          // Skip action in top-right for users who want to proceed without ABHA
          TextButton(
            onPressed: anyLoading ? null : _skipForNow,
            child: Text(
              loc.skipBtn,
              style: AppTextStyles.button.copyWith(
                color: AppColors.textSecondary,
              ),
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: AppDimensions.screenPadding,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(height: AppDimensions.space24),

              // CareBridge Logo
              const CareBridgeLogo(size: 80.0),

              const SizedBox(height: AppDimensions.space32),

              // Main Heading
              Semantics(
                header: true,
                child: Text(
                  loc.abhaConnectTitle,
                  style: AppTextStyles.heading1.copyWith(
                    color: AppColors.primary,
                    fontSize: 26.0,
                  ),
                  textAlign: TextAlign.center,
                ),
              ),

              const SizedBox(height: AppDimensions.space12),

              // Supporting description
              Text(
                loc.abhaConnectSubtitle,
                style: AppTextStyles.body.copyWith(
                  color: AppColors.textSecondary,
                  height: 1.5,
                ),
                textAlign: TextAlign.center,
              ),

              const SizedBox(height: AppDimensions.space32),

              // ABHA Info Card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(AppDimensions.space16),
                decoration: BoxDecoration(
                  color: AppColors.primaryLight,
                  borderRadius: AppDimensions.roundedMedium,
                  border: Border.all(
                    color: AppColors.primary.withValues(alpha: 0.25),
                  ),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(AppDimensions.space8),
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: AppColors.primary.withValues(alpha: 0.15),
                            blurRadius: 6,
                          ),
                        ],
                      ),
                      child: const Icon(
                        Icons.health_and_safety_rounded,
                        color: AppColors.primary,
                        size: 22.0,
                      ),
                    ),
                    const SizedBox(width: AppDimensions.space12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'What is ABHA?',
                            style: AppTextStyles.label.copyWith(
                              color: AppColors.primary,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          const SizedBox(height: AppDimensions.space4),
                          Text(
                            loc.abhaWhatIsIt,
                            style: AppTextStyles.bodySmall.copyWith(
                              color: AppColors.textPrimary,
                              height: 1.4,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: AppDimensions.space32),

              // Primary Action: Connect with existing ABHA
              Semantics(
                label: loc.abhaConnectBtn,
                button: true,
                child: CareBridgeButton.primary(
                  isFullWidth: true,
                  isLoading: _isConnecting,
                  label: loc.abhaConnectBtn,
                  icon: Icons.link_rounded,
                  onPressed: anyLoading ? null : _connectWithAbha,
                ),
              ),

              const SizedBox(height: AppDimensions.space12),

              // Secondary Action: Create new ABHA card (external URL)
              Semantics(
                label: loc.abhaCreateBtn,
                button: true,
                child: CareBridgeButton.outlined(
                  isFullWidth: true,
                  isLoading: _isLaunchingUrl,
                  label: loc.abhaCreateBtn,
                  icon: Icons.open_in_new_rounded,
                  onPressed: anyLoading ? null : _createAbhaCard,
                ),
              ),

              const SizedBox(height: AppDimensions.space32),

              // Prototype disclaimer
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: AppDimensions.space12,
                  vertical: AppDimensions.space10,
                ),
                decoration: BoxDecoration(
                  color: const Color(0xFFFFFBEB),
                  borderRadius: AppDimensions.roundedSmall,
                  border: Border.all(color: const Color(0xFFFDE68A)),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(
                      Icons.info_outline_rounded,
                      color: AppColors.warning,
                      size: 18.0,
                    ),
                    const SizedBox(width: AppDimensions.space8),
                    Expanded(
                      child: Text(
                        loc.abhaPrototypeDisclaimer,
                        style: AppTextStyles.caption.copyWith(
                          color: const Color(0xFF92400E),
                          height: 1.4,
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: AppDimensions.space24),

              // Tagline footer
              Text(
                'Your health. Your control.',
                style: AppTextStyles.caption.copyWith(
                  color: AppColors.textMuted,
                  fontStyle: FontStyle.italic,
                ),
                textAlign: TextAlign.center,
              ),

              const SizedBox(height: AppDimensions.space16),
            ],
          ),
        ),
      ),
    );
  }
}
