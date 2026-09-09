import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../app/routes/app_routes.dart';
import '../../../app/theme/app_colors.dart';
import '../../../app/theme/app_dimensions.dart';
import '../../../app/theme/app_text_styles.dart';
import '../../../core/localization/app_localizations.dart';
import '../../../core/utils/accessibility_utils.dart';
import '../../../shared/widgets/care_bridge_button.dart';
import 'authentication_controller.dart';

/// Patient OTP Verification Screen with Prototype OTP Popup Notification Dialog.
class OtpVerificationScreen extends StatefulWidget {
  const OtpVerificationScreen({super.key});

  @override
  State<OtpVerificationScreen> createState() => _OtpVerificationScreenState();
}

class _OtpVerificationScreenState extends State<OtpVerificationScreen> {
  final TextEditingController _otpController = TextEditingController();
  String? _localError;

  @override
  void initState() {
    super.initState();
    // Post-frame callback ensures initial OTP popup is displayed safely after first frame render
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) {
        final controller = CareBridgeAuthScope.of(context);
        _showOtpDialog(context, controller.currentOtp);
      }
    });
  }

  @override
  void dispose() {
    _otpController.dispose();
    super.dispose();
  }

  void _showOtpDialog(BuildContext context, String otp) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (dialogCtx) => AlertDialog(
        shape: const RoundedRectangleBorder(borderRadius: AppDimensions.roundedLarge),
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(AppDimensions.space6),
              decoration: const BoxDecoration(
                color: AppColors.primaryLight,
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.mark_email_unread_rounded,
                color: AppColors.primary,
                size: AppDimensions.iconMedium,
              ),
            ),
            const SizedBox(width: AppDimensions.space10),
            Expanded(
              child: Semantics(
                label: 'OTP Notification Modal',
                child: Text(
                  'OTP Notification',
                  style: AppTextStyles.heading2.copyWith(fontSize: 18.0),
                ),
              ),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Text(
              'Your verification OTP is:',
              textAlign: TextAlign.center,
              style: AppTextStyles.body.copyWith(color: AppColors.textSecondary),
            ),
            const SizedBox(height: AppDimensions.space16),
            Semantics(
              label: 'Verification OTP code $otp',
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 12.0),
                decoration: BoxDecoration(
                  color: AppColors.primaryLight,
                  borderRadius: AppDimensions.roundedMedium,
                  border: Border.all(color: AppColors.primary.withValues(alpha: 0.3), width: 1.5),
                ),
                child: Text(
                  otp,
                  style: AppTextStyles.display.copyWith(
                    fontSize: 32.0,
                    letterSpacing: 8.0,
                    color: AppColors.primary,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
            const SizedBox(height: AppDimensions.space16),
            Text(
              'This is a prototype OTP.',
              textAlign: TextAlign.center,
              style: AppTextStyles.caption.copyWith(
                color: AppColors.textMuted,
                fontStyle: FontStyle.italic,
              ),
            ),
          ],
        ),
        actions: [
          CareBridgeButton.primary(
            label: 'OK',
            isFullWidth: true,
            onPressed: () => Navigator.of(dialogCtx).pop(),
          ),
        ],
      ),
    );
  }

  void _verifyOtp() async {
    final otp = _otpController.text.trim();
    if (otp.length != 6) {
      setState(() {
        _localError = 'Please enter all 6 digits of the OTP.';
      });
      return;
    }

    setState(() {
      _localError = null;
    });

    final controller = CareBridgeAuthScope.of(context);
    final success = await controller.verifyOtp(otp);

    if (success && mounted) {
      // After successful OTP verification, navigate to ABHA Lookup screen with verified phone number
      Navigator.of(context).pushReplacementNamed(
        AppRoutes.abhaLookup,
        arguments: controller.currentPhoneNumber,
      );
    }
  }

  Future<void> _handleResendOtp() async {
    final controller = CareBridgeAuthScope.of(context);
    if (!controller.canResendOtp) return;

    final success = await controller.resendOtp();
    if (success && mounted) {
      _otpController.clear();
      _showOtpDialog(context, controller.currentOtp);
    }
  }

  void _changeNumber() {
    final controller = CareBridgeAuthScope.of(context);
    controller.resetToLogin();
    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    final localizations = AppLocalizations.of(context);
    final controller = CareBridgeAuthScope.of(context);
    final bool isLoading = controller.status == AuthStatus.loading;
    final displayError = _localError ?? controller.errorMessage;

    final phone = controller.currentPhoneNumber;
    final formattedPhone = phone.length == 10
        ? '+91 ${phone.substring(0, 5)} ${phone.substring(5)}'
        : '+91 $phone';

    return Scaffold(
      backgroundColor: AppColors.surface,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        elevation: 0,
        leading: AccessibilityUtils.ensureMinTouchTarget(
          child: IconButton(
            icon: const Icon(Icons.arrow_back_rounded),
            tooltip: localizations.backBtn,
            onPressed: _changeNumber,
          ),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: AppDimensions.screenPadding,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                localizations.otpTitle,
                style: AppTextStyles.heading1,
              ),
              const SizedBox(height: AppDimensions.space4),
              Text(
                '${localizations.otpSubtitle} $formattedPhone',
                style: AppTextStyles.body.copyWith(color: AppColors.textSecondary),
              ),

              const SizedBox(height: AppDimensions.space12),

              // Change mobile number action
              AccessibilityUtils.ensureMinTouchTarget(
                alignment: Alignment.centerLeft,
                child: TextButton.icon(
                  onPressed: _changeNumber,
                  icon: const Icon(Icons.edit_outlined, size: 16.0),
                  label: Text(localizations.changeMobileBtn),
                  style: TextButton.styleFrom(
                    foregroundColor: AppColors.primary,
                    padding: EdgeInsets.zero,
                  ),
                ),
              ),

              const SizedBox(height: AppDimensions.space16),

              // Demo mode hint banner showing current dynamic OTP
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(
                  horizontal: AppDimensions.space12,
                  vertical: AppDimensions.space10,
                ),
                decoration: BoxDecoration(
                  color: AppColors.warningLight,
                  borderRadius: AppDimensions.roundedSmall,
                  border: Border.all(color: const Color(0xFFFDE68A), width: 1.0),
                ),
                child: Row(
                  children: [
                    const Icon(
                      Icons.code_rounded,
                      color: AppColors.warning,
                      size: 20.0,
                    ),
                    const SizedBox(width: AppDimensions.space8),
                    Expanded(
                      child: Text(
                        'Demo Mode: Use OTP ${controller.currentOtp}',
                        style: AppTextStyles.caption.copyWith(
                          color: const Color(0xFF92400E),
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: AppDimensions.space24),

              // Accessible 6-Digit OTP Field
              Text(
                'Enter 6-Digit OTP',
                style: AppTextStyles.label.copyWith(color: AppColors.textPrimary),
              ),
              const SizedBox(height: AppDimensions.space8),

              AccessibilityUtils.ensureMinTouchTarget(
                child: TextField(
                  controller: _otpController,
                  keyboardType: TextInputType.number,
                  textAlign: TextAlign.center,
                  style: AppTextStyles.display.copyWith(
                    letterSpacing: 14.0,
                    fontWeight: FontWeight.bold,
                    color: AppColors.primary,
                  ),
                  inputFormatters: [
                    FilteringTextInputFormatter.digitsOnly,
                    LengthLimitingTextInputFormatter(6),
                  ],
                  decoration: InputDecoration(
                    hintText: '------',
                    hintStyle: AppTextStyles.display.copyWith(
                      letterSpacing: 14.0,
                      color: AppColors.textMuted,
                    ),
                    errorText: displayError,
                    contentPadding: const EdgeInsets.symmetric(vertical: AppDimensions.space16),
                  ),
                  onChanged: (val) {
                    if (_localError != null) {
                      setState(() {
                        _localError = null;
                      });
                    }
                    controller.clearError();
                    if (val.length == 6) {
                      _verifyOtp();
                    }
                  },
                ),
              ),

              const SizedBox(height: AppDimensions.space24),

              // Resend OTP Countdown & Button
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  if (controller.canResendOtp) ...[
                    TextButton(
                      onPressed: isLoading ? null : _handleResendOtp,
                      child: Text(
                        localizations.resendOtpBtn,
                        style: AppTextStyles.button.copyWith(color: AppColors.primary),
                      ),
                    ),
                  ] else ...[
                    Text(
                      'Resend OTP in ${controller.otpCountdownSeconds}s',
                      style: AppTextStyles.bodySmall.copyWith(
                        color: AppColors.textMuted,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ],
              ),

              const SizedBox(height: AppDimensions.space24),

              // Verify Button
              CareBridgeButton.primary(
                isFullWidth: true,
                isLoading: isLoading,
                label: localizations.verifyBtn,
                icon: Icons.verified_user_rounded,
                onPressed: isLoading ? null : _verifyOtp,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
