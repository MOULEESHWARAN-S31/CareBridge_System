import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../app/routes/app_routes.dart';
import '../../../app/theme/app_colors.dart';
import '../../../app/theme/app_dimensions.dart';
import '../../../app/theme/app_text_styles.dart';
import '../../../core/localization/app_localizations.dart';
import '../../../core/utils/accessibility_utils.dart';
import '../../../shared/widgets/care_bridge_button.dart';
import '../../../shared/widgets/care_bridge_logo.dart';
import 'authentication_controller.dart';

/// Patient Mobile Number Login Screen
class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _phoneController = TextEditingController();
  String? _validationError;

  @override
  void dispose() {
    _phoneController.dispose();
    super.dispose();
  }

  void _validateAndSubmit() async {
    final rawNumber = _phoneController.text.trim();
    final cleanNumber = rawNumber.replaceAll(RegExp(r'\s+|-'), '');

    if (cleanNumber.isEmpty) {
      setState(() {
        _validationError = 'Please enter your mobile number.';
      });
      return;
    }

    if (!RegExp(r'^[6-9]\d{9}$').hasMatch(cleanNumber)) {
      setState(() {
        _validationError = 'Please enter a valid 10-digit mobile number.';
      });
      return;
    }

    setState(() {
      _validationError = null;
    });

    final controller = CareBridgeAuthScope.of(context);
    final success = await controller.sendOtp(cleanNumber);

    if (success && mounted) {
      Navigator.of(context).pushNamed(AppRoutes.otp);
    }
  }

  @override
  Widget build(BuildContext context) {
    final localizations = AppLocalizations.of(context);
    final controller = CareBridgeAuthScope.of(context);
    final bool isLoading = controller.status == AuthStatus.loading;
    final displayError = _validationError ?? controller.errorMessage;

    return Scaffold(
      backgroundColor: AppColors.surface,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        elevation: 0,
        title: const Text('Patient Access'),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: AppDimensions.screenPadding,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: AppDimensions.space12),

              // Logo & App Identity
              const Center(
                child: CareBridgeLogo(size: 68.0),
              ),

              const SizedBox(height: AppDimensions.space24),

              Text(
                localizations.loginTitle,
                style: AppTextStyles.heading1,
              ),
              const SizedBox(height: AppDimensions.space4),
              Text(
                localizations.loginSubtitle,
                style: AppTextStyles.body.copyWith(color: AppColors.textSecondary),
              ),

              const SizedBox(height: AppDimensions.space20),

              // Demo Mode Notice Banner
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(
                  horizontal: AppDimensions.space12,
                  vertical: AppDimensions.space10,
                ),
                decoration: BoxDecoration(
                  color: AppColors.infoLight,
                  borderRadius: AppDimensions.roundedSmall,
                  border: Border.all(color: const Color(0xFFBAE6FD), width: 1.0),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(
                      Icons.info_outline_rounded,
                      color: AppColors.info,
                      size: 20.0,
                    ),
                    const SizedBox(width: AppDimensions.space8),
                    Expanded(
                      child: Text(
                        'Demo Mode: Enter any 10-digit number (e.g. 9876543210). Verification OTP will be generated.',
                        style: AppTextStyles.caption.copyWith(
                          color: const Color(0xFF0369A1),
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: AppDimensions.space20),

              // Mobile Number Input Field
              Text(
                localizations.mobileNumberLabel,
                style: AppTextStyles.label.copyWith(color: AppColors.textPrimary),
              ),
              const SizedBox(height: AppDimensions.space8),

              AccessibilityUtils.ensureMinTouchTarget(
                child: TextField(
                  controller: _phoneController,
                  keyboardType: TextInputType.phone,
                  inputFormatters: [
                    FilteringTextInputFormatter.digitsOnly,
                    LengthLimitingTextInputFormatter(10),
                  ],
                  style: AppTextStyles.heading2.copyWith(letterSpacing: 1.5),
                  decoration: InputDecoration(
                    prefixIcon: Container(
                      padding: const EdgeInsets.symmetric(horizontal: AppDimensions.space12),
                      margin: const EdgeInsets.only(right: AppDimensions.space8),
                      decoration: const BoxDecoration(
                        border: Border(
                          right: BorderSide(color: AppColors.border, width: 1.0),
                        ),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.phone_iphone_rounded, color: AppColors.primary, size: 20),
                          const SizedBox(width: AppDimensions.space6),
                          Text(
                            '+91',
                            style: AppTextStyles.heading3.copyWith(
                              color: AppColors.textPrimary,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),
                    hintText: '98765 43210',
                    errorText: displayError,
                  ),
                  onChanged: (_) {
                    if (_validationError != null) {
                      setState(() {
                        _validationError = null;
                      });
                    }
                    controller.clearError();
                  },
                ),
              ),

              const SizedBox(height: AppDimensions.space24),

              // Continue Button
              CareBridgeButton.primary(
                isFullWidth: true,
                isLoading: isLoading,
                label: localizations.continueBtn,
                icon: Icons.arrow_forward_rounded,
                onPressed: isLoading ? null : _validateAndSubmit,
              ),

              const SizedBox(height: AppDimensions.space20),

              // Privacy & Identity Verification Note
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Icon(
                    Icons.lock_outline_rounded,
                    size: 16.0,
                    color: AppColors.textMuted,
                  ),
                  const SizedBox(width: AppDimensions.space8),
                  Expanded(
                    child: Text(
                      localizations.loginPrivacyNote,
                      style: AppTextStyles.caption.copyWith(
                        color: AppColors.textMuted,
                        height: 1.4,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
