import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_dimensions.dart';
import '../../app/theme/app_text_styles.dart';
import '../../core/constants/app_constants.dart';
import '../../core/localization/app_localizations.dart';
import '../../core/utils/accessibility_utils.dart';
import '../../features/appointments/data/phone_call_service_impl.dart';
import 'care_bridge_button.dart';
import 'care_bridge_card.dart';

/// Clean, accessible dialog displaying the two emergency options:
/// 1. 108 Emergency Service (Ambulance)
/// 2. Teleconsultation (Audio)
Future<void> showCareBridgeEmergencyDialog(
  BuildContext context, [
  AppLocalizations? loc,
  VoidCallback? onCall108Override,
  VoidCallback? onAudioTeleconsultationOverride,
]) {
  final l10n = loc ?? AppLocalizations.of(context);
  return showDialog<void>(
    context: context,
    builder: (ctx) => AlertDialog(
      shape: const RoundedRectangleBorder(borderRadius: AppDimensions.roundedLarge),
      title: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(AppDimensions.space8),
            decoration: const BoxDecoration(
              color: AppColors.emergencyLight,
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.emergency_rounded,
              color: AppColors.emergency,
              size: AppDimensions.iconMedium,
            ),
          ),
          const SizedBox(width: AppDimensions.space10),
          Expanded(
            child: Text(
              l10n.emergencyAssistanceTitle,
              style: AppTextStyles.heading2.copyWith(fontSize: 18.0),
            ),
          ),
        ],
      ),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Option 1: 108 Emergency Service
          AccessibilityUtils.ensureMinTouchTarget(
            child: CareBridgeCard(
              key: const Key('emergency_option_108'),
              title: l10n.emergency108Title,
              subtitle: l10n.emergency108Subtitle,
              backgroundColor: AppColors.emergencyLight,
              borderColor: AppColors.emergency.withValues(alpha: 0.5),
              leadingIcon: Container(
                padding: const EdgeInsets.all(AppDimensions.space8),
                decoration: const BoxDecoration(
                  color: Colors.white,
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.local_hospital_rounded,
                  color: AppColors.emergency,
                  size: 24.0,
                ),
              ),
              trailingAction: const Icon(
                Icons.phone_in_talk_rounded,
                color: AppColors.emergency,
                size: 20.0,
              ),
              onTap: () async {
                Navigator.of(ctx).pop();
                if (onCall108Override != null) {
                  onCall108Override();
                  return;
                }
                const phoneService = PhoneCallServiceImpl();
                await phoneService.makeCall(AppConstants.nationalEmergencyHelpline);
                if (context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(
                        'Calling ${AppConstants.nationalEmergencyHelpline}... (Demo Mode)',
                      ),
                      backgroundColor: AppColors.emergency,
                      duration: const Duration(seconds: 3),
                    ),
                  );
                }
              },
            ),
          ),
          const SizedBox(height: AppDimensions.space12),

          // Option 2: Teleconsultation (Audio)
          AccessibilityUtils.ensureMinTouchTarget(
            child: CareBridgeCard(
              key: const Key('emergency_option_teleconsultation'),
              title: l10n.teleconsultationAudioTitle,
              subtitle: l10n.teleconsultationAudioSubtitle,
              backgroundColor: AppColors.secondaryLight,
              borderColor: AppColors.secondary.withValues(alpha: 0.5),
              leadingIcon: Container(
                padding: const EdgeInsets.all(AppDimensions.space8),
                decoration: const BoxDecoration(
                  color: Colors.white,
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.phone_in_talk_rounded,
                  color: AppColors.secondary,
                  size: 24.0,
                ),
              ),
              trailingAction: const Icon(
                Icons.arrow_forward_ios_rounded,
                color: AppColors.secondary,
                size: 14.0,
              ),
              onTap: () {
                Navigator.of(ctx).pop();
                if (onAudioTeleconsultationOverride != null) {
                  onAudioTeleconsultationOverride();
                  return;
                }
                showDialog<void>(
                  context: context,
                  builder: (audioCtx) => AlertDialog(
                    shape: const RoundedRectangleBorder(
                      borderRadius: AppDimensions.roundedLarge,
                    ),
                    title: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(AppDimensions.space6),
                          decoration: const BoxDecoration(
                            color: AppColors.secondaryLight,
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            Icons.phone_in_talk_rounded,
                            color: AppColors.secondary,
                            size: AppDimensions.iconMedium,
                          ),
                        ),
                        const SizedBox(width: AppDimensions.space10),
                        Expanded(
                          child: Text(
                            l10n.teleconsultationAudioTitle,
                            style: AppTextStyles.heading2.copyWith(fontSize: 18.0),
                          ),
                        ),
                      ],
                    ),
                    content: Text(
                      l10n.doctorConsultationSoonMsg,
                      style: AppTextStyles.body.copyWith(color: AppColors.textPrimary),
                    ),
                    actions: [
                      CareBridgeButton.primary(
                        label: 'OK',
                        onPressed: () => Navigator.of(audioCtx).pop(),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
      actions: [
        CareBridgeButton.text(
          label: l10n.cancelBtn,
          onPressed: () => Navigator.of(ctx).pop(),
        ),
      ],
    ),
  );
}
