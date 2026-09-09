import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_dimensions.dart';
import '../../app/theme/app_text_styles.dart';
import '../../core/localization/app_localizations.dart';
import '../../core/services/session_service.dart';
import '../../features/abha/domain/abha_profile.dart';
import '../../features/authentication/presentation/authentication_controller.dart';
import '../../shared/widgets/care_bridge_button.dart';

/// Modal dialog displaying patient's official digital ABHA Identity Card
/// complete with dynamically generated QR code.
class MyAbhaCardDialog extends StatelessWidget {
  final AbhaProfile? profileOverride;

  static const AbhaProfile defaultFallbackProfile = AbhaProfile(
    id: '12-3456-7890-1001',
    abhaAddress: 'ramesh.kumar@abdm',
    abhaNumber: '12-3456-7890-1001',
    name: 'Ramesh Kumar',
    gender: 'Male',
    dateOfBirth: '1979-05-15',
    relationship: 'Self',
    mobileNumber: '9876500001',
    address: '14 Bazaar Street, Suramangalam',
    district: 'Salem',
    city: 'Salem',
    state: 'Tamil Nadu',
    pincode: '636001',
  );

  final SessionService? sessionServiceOverride;

  const MyAbhaCardDialog({
    super.key,
    this.profileOverride,
    this.sessionServiceOverride,
  });

  static Future<void> show(
    BuildContext context, {
    AbhaProfile? profile,
    SessionService? sessionService,
  }) {
    SessionService? effectiveSession = sessionService;
    if (effectiveSession == null) {
      try {
        effectiveSession = CareBridgeAuthScope.of(context).sessionService;
      } catch (_) {}
    }
    return showDialog<void>(
      context: context,
      barrierDismissible: true,
      builder: (_) => MyAbhaCardDialog(
        profileOverride: profile,
        sessionServiceOverride: effectiveSession,
      ),
    );
  }

  AbhaProfile _resolveActiveProfile() {
    if (profileOverride != null) return profileOverride!;
    final session = sessionServiceOverride ?? SessionService();
    final sessionProfile = session.getActiveAbhaProfile();
    if (sessionProfile != null) return sessionProfile;
    return defaultFallbackProfile;
  }

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context);
    final profile = _resolveActiveProfile();
    final qrPayload = profile.abhaAddress.isNotEmpty ? profile.abhaAddress : profile.abhaNumber;

    return Dialog(
      backgroundColor: Colors.transparent,
      insetPadding: const EdgeInsets.symmetric(
        horizontal: AppDimensions.space20,
        vertical: AppDimensions.space24,
      ),
      child: Container(
        constraints: const BoxConstraints(maxWidth: 440),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(20.0),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.15),
              blurRadius: 20.0,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Card Top Banner
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(
                horizontal: AppDimensions.space20,
                vertical: AppDimensions.space16,
              ),
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [AppColors.primary, AppColors.primaryDark],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.vertical(top: Radius.circular(20.0)),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(AppDimensions.space8),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.2),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.badge_rounded,
                      color: Colors.white,
                      size: 24.0,
                    ),
                  ),
                  const SizedBox(width: AppDimensions.space12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'CAREBRIDGE',
                          style: TextStyle(
                            color: Colors.white70,
                            fontSize: 11.0,
                            fontWeight: FontWeight.w700,
                            letterSpacing: 1.2,
                          ),
                        ),
                        Text(
                          loc.myAbhaCard,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 17.0,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close_rounded, color: Colors.white),
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                ],
              ),
            ),

            // Card Body
            Padding(
              padding: const EdgeInsets.all(AppDimensions.space20),
              child: Column(
                children: [
                  // Patient Name & Relation
                  Row(
                    children: [
                      CircleAvatar(
                        radius: 24,
                        backgroundColor: AppColors.primaryLight,
                        child: Text(
                          profile.name.isNotEmpty ? profile.name[0].toUpperCase() : 'P',
                          style: const TextStyle(
                            color: AppColors.primary,
                            fontWeight: FontWeight.bold,
                            fontSize: 20.0,
                          ),
                        ),
                      ),
                      const SizedBox(width: AppDimensions.space12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              profile.name,
                              style: AppTextStyles.heading2.copyWith(fontSize: 17.0),
                            ),
                            Text(
                              '${profile.gender} • ${profile.dateOfBirth}',
                              style: AppTextStyles.caption.copyWith(
                                color: AppColors.textSecondary,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: AppDimensions.space16),

                  // Info Box: ABHA ID & ABHA Address
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(AppDimensions.space12),
                    decoration: BoxDecoration(
                      color: AppColors.background,
                      borderRadius: AppDimensions.roundedMedium,
                      border: Border.all(color: AppColors.borderLight),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildInfoRow('ABHA ID', profile.abhaNumber),
                        const Divider(height: 16),
                        _buildInfoRow('ABHA Address', profile.abhaAddress),
                      ],
                    ),
                  ),
                  const SizedBox(height: AppDimensions.space20),

                  // Dynamic QR Code
                  Semantics(
                    label: '${loc.qrCode} for ${profile.name}',
                    child: Container(
                      key: const Key('abha_card_qr_code'),
                      padding: const EdgeInsets.all(AppDimensions.space12),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: AppDimensions.roundedMedium,
                        border: Border.all(color: AppColors.borderLight, width: 1.5),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.05),
                            blurRadius: 8,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: QrImageView(
                        data: qrPayload,
                        version: QrVersions.auto,
                        size: 160.0,
                        backgroundColor: Colors.white,
                        eyeStyle: const QrEyeStyle(
                          eyeShape: QrEyeShape.square,
                          color: AppColors.primary,
                        ),
                        dataModuleStyle: const QrDataModuleStyle(
                          dataModuleShape: QrDataModuleShape.square,
                          color: AppColors.textPrimary,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: AppDimensions.space8),
                  Text(
                    loc.scanQrPrompt,
                    textAlign: TextAlign.center,
                    style: AppTextStyles.caption.copyWith(
                      color: AppColors.textSecondary,
                      fontSize: 11.5,
                    ),
                  ),
                  const SizedBox(height: AppDimensions.space20),

                  // Done / Close button
                  CareBridgeButton.primary(
                    label: loc.continueBtn,
                    isFullWidth: true,
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: AppTextStyles.caption.copyWith(
            color: AppColors.textSecondary,
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(height: 2),
        SelectableText(
          value,
          style: AppTextStyles.body.copyWith(
            fontWeight: FontWeight.w700,
            color: AppColors.textPrimary,
            letterSpacing: 0.3,
          ),
        ),
      ],
    );
  }
}
