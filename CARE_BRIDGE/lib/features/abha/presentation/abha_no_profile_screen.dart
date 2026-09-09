import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../app/routes/app_routes.dart';
import '../../../app/theme/app_colors.dart';
import '../../../app/theme/app_dimensions.dart';
import '../../../core/localization/app_localizations.dart';
import '../../../core/services/session_service.dart';
import '../domain/abha_profile.dart';

/// Screen 3: No ABHA Profile Found Screen.
/// Displayed when no ABHA profile is found for the patient's mobile number.
/// Provides a clear "Create ABHA Card" button leading through mock prototype registration
/// to the Patient Profile screen.
class AbhaNoProfileScreen extends StatelessWidget {
  final String mobileNumber;
  final SessionService? sessionService;

  const AbhaNoProfileScreen({
    super.key,
    required this.mobileNumber,
    this.sessionService,
  });

  Future<void> _launchAbhaRegistration(BuildContext context) async {
    final Uri url = Uri.parse('https://abha.abdm.gov.in/abha/v3/register');
    try {
      await launchUrl(url, mode: LaunchMode.externalApplication);
    } catch (_) {
      // Prototype external launch fallback
    }

    // After mock registration flow, create a synthetic registered profile and continue to Patient Profile
    final session = sessionService ?? await SessionService.init();
    final newMockProfile = AbhaProfile(
      id: 'ABHA-NEW-${DateTime.now().millisecondsSinceEpoch % 100000}',
      name: 'Registered Patient',
      abhaNumber: '99-8877-6655-4433',
      abhaAddress: 'patient.new@abdm',
      relationship: 'Self',
      mobileNumber: mobileNumber,
      district: 'Salem',
      state: 'Tamil Nadu',
      pincode: '636001',
    );
    await session.setActiveAbhaProfile(newMockProfile);

    final user = session.getStoredUser();
    if (user != null) {
      final updatedUser = user.copyWith(
        fullName: newMockProfile.fullName,
        gender: newMockProfile.gender,
        dateOfBirth: newMockProfile.dateOfBirth,
        abhaNumber: newMockProfile.abhaNumber,
        abhaAddress: newMockProfile.abhaAddress,
        profileCompleted: true,
      );
      await session.saveSession(updatedUser);
    }

    if (context.mounted) {
      Navigator.of(context).pushReplacementNamed(
        AppRoutes.profileSetup,
        arguments: newMockProfile,
      );
    }
  }

  Future<void> _skipAndContinue(BuildContext context) async {
    if (context.mounted) {
      Navigator.of(context).pushReplacementNamed(AppRoutes.profileSetup);
    }
  }

  @override
  Widget build(BuildContext context) {
    final localizations = AppLocalizations.of(context);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text(localizations.abhaRegistration),
        backgroundColor: AppColors.surface,
        foregroundColor: AppColors.textPrimary,
        elevation: 0,
        centerTitle: true,
      ),
      body: SafeArea(
        child: Padding(
          padding: AppDimensions.screenPadding,
          child: Column(
            children: [
              Expanded(
                child: SingleChildScrollView(
                  child: Column(
                    children: [
                      const SizedBox(height: AppDimensions.space16),
                      Container(
                        padding: const EdgeInsets.all(AppDimensions.space24),
                        decoration: BoxDecoration(
                          color: AppColors.warning.withValues(alpha: 0.1),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.error_outline_rounded,
                          size: 64,
                          color: AppColors.warning,
                        ),
                      ),
                      const SizedBox(height: AppDimensions.space24),
                      Text(
                        localizations.noAbhaProfileFound,
                        style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                              fontWeight: FontWeight.bold,
                              color: AppColors.textPrimary,
                            ),
                      ),
                      const SizedBox(height: AppDimensions.space8),
                      Text(
                        'No existing ABHA card was found linked to mobile number +91 $mobileNumber.',
                        textAlign: TextAlign.center,
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                              color: AppColors.textSecondary,
                            ),
                      ),
                      const SizedBox(height: AppDimensions.space32),
                      Container(
                        padding: const EdgeInsets.all(AppDimensions.space20),
                        decoration: BoxDecoration(
                          color: AppColors.surface,
                          borderRadius: AppDimensions.roundedMedium,
                          border: Border.all(color: AppColors.borderLight),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                const Icon(
                                  Icons.info_outline_rounded,
                                  color: AppColors.primary,
                                ),
                                const SizedBox(width: AppDimensions.space8),
                                Text(
                                  'What is ABHA?',
                                  style: Theme.of(context).textTheme.titleSmall?.copyWith(
                                        fontWeight: FontWeight.bold,
                                        color: AppColors.primary,
                                      ),
                                ),
                              ],
                            ),
                            const SizedBox(height: AppDimensions.space12),
                            const Text(
                              'ABHA (Ayushman Bharat Health Account) is a 14-digit digital ID that links all your health records across hospitals, PHCs, and diagnostic labs nationwide.',
                              style: TextStyle(
                                fontSize: 13,
                                height: 1.4,
                                color: AppColors.textPrimary,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              Column(
                children: [
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: () => _launchAbhaRegistration(context),
                      icon: const Icon(Icons.open_in_new_rounded, color: Colors.white),
                      label: Text(
                        localizations.createAbhaCard,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: const RoundedRectangleBorder(
                          borderRadius: AppDimensions.roundedMedium,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: AppDimensions.space12),
                  SizedBox(
                    width: double.infinity,
                    child: OutlinedButton(
                      onPressed: () => _skipAndContinue(context),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        side: const BorderSide(color: AppColors.borderLight),
                        shape: const RoundedRectangleBorder(
                          borderRadius: AppDimensions.roundedMedium,
                        ),
                      ),
                      child: const Text(
                        'Skip for Now & Continue',
                        style: TextStyle(
                          color: AppColors.textSecondary,
                          fontWeight: FontWeight.w600,
                        ),
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
