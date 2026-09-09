import 'package:flutter/material.dart';
import '../../../app/routes/app_routes.dart';
import '../../../app/theme/app_colors.dart';
import '../../../app/theme/app_dimensions.dart';
import '../../../app/theme/app_text_styles.dart';
import '../../../core/constants/app_constants.dart';
import '../../../core/localization/app_localizations.dart';
import '../../../core/localization/supported_locales.dart';
import '../../../core/utils/accessibility_utils.dart';
import '../../../shared/widgets/care_bridge_button.dart';
import '../../../shared/widgets/care_bridge_logo.dart';
import '../../authentication/presentation/authentication_controller.dart';

/// Introductory Patient Onboarding Screen
/// 4 short, accessible slides with live language selection.
class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  Future<void> _completeIntroAndGoToLogin() async {
    final controller = CareBridgeAuthScope.of(context);
    // Explicitly mark introductory onboarding as seen (without marking profile completed)
    await controller.markOnboardingSeen();

    if (mounted) {
      Navigator.of(context).pushReplacementNamed(AppRoutes.login);
    }
  }

  void _nextPage() {
    if (_currentPage < 3) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 250),
        curve: Curves.easeInOut,
      );
    } else {
      _completeIntroAndGoToLogin();
    }
  }

  void _previousPage() {
    if (_currentPage > 0) {
      _pageController.previousPage(
        duration: const Duration(milliseconds: 250),
        curve: Curves.easeInOut,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final localizations = AppLocalizations.of(context);
    final controller = CareBridgeAuthScope.of(context);

    return Scaffold(
      backgroundColor: AppColors.surface,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        elevation: 0,
        leading: _currentPage > 0
            ? AccessibilityUtils.ensureMinTouchTarget(
                child: IconButton(
                  icon: const Icon(Icons.arrow_back_rounded),
                  tooltip: localizations.backBtn,
                  onPressed: _previousPage,
                ),
              )
            : null,
        actions: [
          if (_currentPage < 3)
            AccessibilityUtils.ensureMinTouchTarget(
              child: TextButton(
                onPressed: _completeIntroAndGoToLogin,
                child: Text(
                  localizations.skipBtn,
                  style: AppTextStyles.button.copyWith(color: AppColors.textSecondary),
                ),
              ),
            ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: PageView(
                controller: _pageController,
                onPageChanged: (index) {
                  setState(() {
                    _currentPage = index;
                  });
                },
                children: [
                  // Slide 1: Welcome
                  _buildSlide(
                    icon: Icons.health_and_safety_rounded,
                    iconColor: AppColors.primary,
                    iconBgColor: AppColors.primaryLight,
                    showLogo: true,
                    title: 'Welcome to CareBridge',
                    subtitle: AppConstants.appTagline,
                    description:
                        'Easily find nearby healthcare services, manage doctor consultations, and receive public health updates for your community.',
                  ),

                  // Slide 2: Healthcare Closer to You
                  _buildSlide(
                    icon: Icons.near_me_rounded,
                    iconColor: AppColors.secondary,
                    iconBgColor: AppColors.secondaryLight,
                    title: 'Healthcare, closer to you',
                    subtitle: 'Designed for rural & community access',
                    description:
                        'Connect with Primary Health Centres, dispensaries, and health camps right in your neighborhood.',
                  ),

                  // Slide 3: Control & Privacy
                  _buildSlide(
                    icon: Icons.shield_rounded,
                    iconColor: AppColors.accent,
                    iconBgColor: AppColors.accentLight,
                    title: 'Your health information, under your control',
                    subtitle: 'Consent-driven healthcare assistance',
                    description:
                        'Your healthcare information is accessed only with your explicit permission, keeping your privacy secure.',
                  ),

                  // Slide 4: Language Selection
                  _buildLanguageSlide(controller),
                ],
              ),
            ),

            // Bottom controls: Page Indicator & Action Button
            Padding(
              padding: AppDimensions.screenPadding,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Progress Dots
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: List.generate(4, (index) {
                      final bool isActive = _currentPage == index;
                      return AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        margin: const EdgeInsets.symmetric(horizontal: 4.0),
                        width: isActive ? 24.0 : 8.0,
                        height: 8.0,
                        decoration: BoxDecoration(
                          color: isActive ? AppColors.primary : AppColors.border,
                          borderRadius: BorderRadius.circular(4.0),
                        ),
                      );
                    }),
                  ),
                  const SizedBox(height: AppDimensions.space20),

                  // Primary Button
                  CareBridgeButton.primary(
                    isFullWidth: true,
                    label: _currentPage == 3
                        ? localizations.getStartedBtn
                        : localizations.nextBtn,
                    icon: _currentPage == 3 ? Icons.check_circle_rounded : Icons.arrow_forward_rounded,
                    onPressed: _nextPage,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSlide({
    required IconData icon,
    required Color iconColor,
    required Color iconBgColor,
    required String title,
    required String subtitle,
    required String description,
    bool showLogo = false,
  }) {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: AppDimensions.space24),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const SizedBox(height: AppDimensions.space24),
          if (showLogo) ...[
            const CareBridgeLogo(size: 80.0),
            const SizedBox(height: AppDimensions.space20),
          ] else ...[
            Container(
              width: 88,
              height: 88,
              decoration: BoxDecoration(
                color: iconBgColor,
                shape: BoxShape.circle,
              ),
              child: Icon(icon, size: 44.0, color: iconColor),
            ),
            const SizedBox(height: AppDimensions.space28),
          ],
          Text(
            title,
            textAlign: TextAlign.center,
            style: AppTextStyles.heading1.copyWith(fontSize: 23.0),
          ),
          const SizedBox(height: AppDimensions.space8),
          Text(
            subtitle,
            textAlign: TextAlign.center,
            style: AppTextStyles.bodyLarge.copyWith(
              color: AppColors.secondary,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: AppDimensions.space16),
          Text(
            description,
            textAlign: TextAlign.center,
            style: AppTextStyles.body.copyWith(
              color: AppColors.textSecondary,
              height: 1.5,
            ),
          ),
          const SizedBox(height: AppDimensions.space24),
        ],
      ),
    );
  }

  Widget _buildLanguageSlide(AuthenticationController controller) {
    final currentCode = Localizations.localeOf(context).languageCode;

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: AppDimensions.space24),
      child: Column(
        children: [
          const SizedBox(height: AppDimensions.space16),
          Container(
            width: 72,
            height: 72,
            decoration: const BoxDecoration(
              color: AppColors.primaryLight,
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.translate_rounded,
              size: 36.0,
              color: AppColors.primary,
            ),
          ),
          const SizedBox(height: AppDimensions.space20),
          Text(
            'Choose your language',
            textAlign: TextAlign.center,
            style: AppTextStyles.heading1.copyWith(fontSize: 23.0),
          ),
          const SizedBox(height: AppDimensions.space6),
          Text(
            'நீங்கள் விரும்பும் மொழியைத் தேர்ந்தெடுக்கவும்',
            textAlign: TextAlign.center,
            style: AppTextStyles.bodySmall.copyWith(color: AppColors.textMuted),
          ),
          const SizedBox(height: AppDimensions.space24),

          // Supported Language Options
          ...SupportedLocales.all.map((loc) {
            final isSelected = loc.languageCode == currentCode;
            return Padding(
              padding: const EdgeInsets.only(bottom: AppDimensions.space12),
              child: AccessibilityUtils.ensureMinTouchTarget(
                child: Material(
                  color: isSelected ? AppColors.primaryLight : AppColors.surface,
                  shape: RoundedRectangleBorder(
                    borderRadius: AppDimensions.roundedMedium,
                    side: BorderSide(
                      color: isSelected ? AppColors.primary : AppColors.borderLight,
                      width: isSelected ? 2.0 : 1.0,
                    ),
                  ),
                  child: InkWell(
                    onTap: () {
                      controller.setLocale(loc.languageCode);
                    },
                    borderRadius: AppDimensions.roundedMedium,
                    child: Padding(
                      padding: const EdgeInsets.symmetric(
                        horizontal: AppDimensions.space16,
                        vertical: AppDimensions.space16,
                      ),
                      child: Row(
                        children: [
                          Icon(
                            isSelected ? Icons.radio_button_checked_rounded : Icons.radio_button_off_rounded,
                            color: isSelected ? AppColors.primary : AppColors.textMuted,
                          ),
                          const SizedBox(width: AppDimensions.space12),
                          Expanded(
                            child: Text(
                              SupportedLocales.getLanguageName(loc),
                              style: AppTextStyles.heading3.copyWith(
                                color: isSelected ? AppColors.primary : AppColors.textPrimary,
                                fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                              ),
                            ),
                          ),
                          if (isSelected)
                            const Icon(
                              Icons.check_rounded,
                              color: AppColors.primary,
                              size: 20,
                            ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            );
          }),
        ],
      ),
    );
  }
}
