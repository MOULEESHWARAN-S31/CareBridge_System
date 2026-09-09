import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../app/routes/app_routes.dart';
import '../../../app/theme/app_colors.dart';
import '../../../app/theme/app_dimensions.dart';
import '../../../core/localization/app_localizations.dart';
import '../../../core/services/session_service.dart';
import '../domain/abha_profile.dart';

/// Screen 2: ABHA Profile Selection Screen.
/// Displays multiple existing ABHA profiles found for the mobile number and lets the user choose one.
/// Displays Full Name, Date of Birth, Age, Gender, ABHA ID, and Relationship.
class AbhaProfileSelectScreen extends StatefulWidget {
  final List<AbhaProfile> profiles;
  final SessionService? sessionService;

  const AbhaProfileSelectScreen({
    super.key,
    required this.profiles,
    this.sessionService,
  });

  @override
  State<AbhaProfileSelectScreen> createState() => _AbhaProfileSelectScreenState();
}

class _AbhaProfileSelectScreenState extends State<AbhaProfileSelectScreen> {
  int _selectedIndex = 0;
  bool _isSubmitting = false;

  Future<void> _launchAbhaRegistration() async {
    final Uri url = Uri.parse('https://abha.abdm.gov.in/abha/v3/register');
    if (!await launchUrl(url, mode: LaunchMode.externalApplication)) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Could not open ABHA registration page')),
        );
      }
    }
  }

  Future<void> _confirmSelection() async {
    if (widget.profiles.isEmpty) return;

    setState(() {
      _isSubmitting = true;
    });

    final selectedProfile = widget.profiles[_selectedIndex];

    final session = widget.sessionService ?? await SessionService.init();
    await session.setActiveAbhaProfile(selectedProfile);

    final user = session.getStoredUser();
    if (user != null) {
      final updatedUser = user.copyWith(
        fullName: selectedProfile.fullName,
        gender: selectedProfile.gender,
        dateOfBirth: selectedProfile.dateOfBirth,
        abhaNumber: selectedProfile.abhaNumber,
        abhaAddress: selectedProfile.abhaAddress,
        profileCompleted: true,
      );
      await session.saveSession(updatedUser);
    }

    if (!mounted) return;

    // Follow the required core flow: Selected ABHA Profile -> Patient Profile
    Navigator.of(context).pushReplacementNamed(
      AppRoutes.profileSetup,
      arguments: selectedProfile,
    );
  }

  @override
  Widget build(BuildContext context) {
    final localizations = AppLocalizations.of(context);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Connect ABHA Card'),
        backgroundColor: AppColors.surface,
        foregroundColor: AppColors.textPrimary,
        elevation: 0,
        centerTitle: true,
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                padding: AppDimensions.screenPadding,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(AppDimensions.space16),
                      decoration: BoxDecoration(
                        color: AppColors.primary.withValues(alpha: 0.08),
                        borderRadius: AppDimensions.roundedMedium,
                        border: Border.all(color: AppColors.primary.withValues(alpha: 0.3)),
                      ),
                      child: Row(
                        children: [
                          const Icon(
                            Icons.verified_user_rounded,
                            color: AppColors.primary,
                            size: 28,
                          ),
                          const SizedBox(width: AppDimensions.space16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  localizations.abhaProfilesFound,
                                  style: Theme.of(context).textTheme.titleSmall?.copyWith(
                                        fontWeight: FontWeight.bold,
                                        color: AppColors.primary,
                                      ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  'Select the ABHA card profile you wish to link with CareBridge.',
                                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                        color: AppColors.textSecondary,
                                      ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: AppDimensions.space24),
                    Text(
                      '${localizations.selectProfile} (${widget.profiles.length})',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.bold,
                            color: AppColors.textPrimary,
                          ),
                    ),
                    const SizedBox(height: AppDimensions.space8),
                    ListView.separated(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: widget.profiles.length,
                      separatorBuilder: (context, index) =>
                          const SizedBox(height: AppDimensions.space16),
                      itemBuilder: (context, index) {
                        final profile = widget.profiles[index];
                        final isSelected = _selectedIndex == index;

                        return InkWell(
                          onTap: () {
                            setState(() {
                              _selectedIndex = index;
                            });
                          },
                          borderRadius: AppDimensions.roundedMedium,
                          child: Container(
                            padding: const EdgeInsets.all(AppDimensions.space16),
                            decoration: BoxDecoration(
                              color: AppColors.surface,
                              borderRadius: AppDimensions.roundedMedium,
                              border: Border.all(
                                color: isSelected ? AppColors.primary : AppColors.borderLight,
                                width: isSelected ? 2.0 : 1.0,
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withValues(alpha: 0.04),
                                  blurRadius: 8,
                                  offset: const Offset(0, 2),
                                ),
                              ],
                            ),
                            child: Row(
                              children: [
                                // ignore: deprecated_member_use
                                Radio<int>(
                                  value: index,
                                  // ignore: deprecated_member_use
                                  groupValue: _selectedIndex,
                                  activeColor: AppColors.primary,
                                  // ignore: deprecated_member_use
                                  onChanged: (val) {
                                    if (val != null) {
                                      setState(() {
                                        _selectedIndex = val;
                                      });
                                    }
                                  },
                                ),
                                const SizedBox(width: AppDimensions.space8),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        children: [
                                          Expanded(
                                            child: Text(
                                              profile.fullName,
                                              style: const TextStyle(
                                                fontSize: 16,
                                                fontWeight: FontWeight.bold,
                                                color: AppColors.textPrimary,
                                              ),
                                            ),
                                          ),
                                          const SizedBox(width: AppDimensions.space8),
                                          Container(
                                            padding: const EdgeInsets.symmetric(
                                              horizontal: 8,
                                              vertical: 2,
                                            ),
                                            decoration: BoxDecoration(
                                              color: AppColors.secondary.withValues(alpha: 0.15),
                                              borderRadius: BorderRadius.circular(12),
                                            ),
                                            child: Text(
                                              profile.relation,
                                              style: const TextStyle(
                                                fontSize: 11,
                                                fontWeight: FontWeight.w600,
                                                color: AppColors.secondary,
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 6),
                                      Row(
                                        children: [
                                          const Icon(
                                            Icons.cake_outlined,
                                            size: 14,
                                            color: AppColors.textSecondary,
                                          ),
                                          const SizedBox(width: 4),
                                          Text(
                                            'DOB: ${profile.dateOfBirth}',
                                            style: const TextStyle(
                                              fontSize: 13,
                                              color: AppColors.textSecondary,
                                            ),
                                          ),
                                          if (profile.age != null) ...[
                                            const SizedBox(width: 10),
                                            Text(
                                              '• Age: ${profile.age} yrs',
                                              style: const TextStyle(
                                                fontSize: 13,
                                                color: AppColors.textSecondary,
                                              ),
                                            ),
                                          ],
                                          const SizedBox(width: 10),
                                          Text(
                                            '• ${profile.gender}',
                                            style: const TextStyle(
                                              fontSize: 13,
                                              color: AppColors.textSecondary,
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 4),
                                      Row(
                                        children: [
                                          const Icon(
                                            Icons.badge_outlined,
                                            size: 14,
                                            color: AppColors.textSecondary,
                                          ),
                                          const SizedBox(width: 4),
                                          Text(
                                            'ABHA: ${profile.maskedAbhaId}',
                                            style: const TextStyle(
                                              fontSize: 13,
                                              fontWeight: FontWeight.w500,
                                              color: AppColors.textSecondary,
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 2),
                                      Row(
                                        children: [
                                          const Icon(
                                            Icons.alternate_email_rounded,
                                            size: 14,
                                            color: AppColors.textSecondary,
                                          ),
                                          const SizedBox(width: 4),
                                          Text(
                                            profile.abhaAddress,
                                            style: const TextStyle(
                                              fontSize: 13,
                                              color: AppColors.textSecondary,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
                    const SizedBox(height: AppDimensions.space32),
                    Center(
                      child: TextButton.icon(
                        onPressed: _launchAbhaRegistration,
                        icon: const Icon(Icons.add_card_rounded, color: AppColors.primary),
                        label: const Text(
                          'Create New ABHA Card',
                          style: TextStyle(
                            color: AppColors.primary,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            Container(
              padding: AppDimensions.screenPadding,
              decoration: BoxDecoration(
                color: AppColors.surface,
                border: const Border(top: BorderSide(color: AppColors.borderLight)),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.05),
                    blurRadius: 10,
                    offset: const Offset(0, -4),
                  ),
                ],
              ),
              child: SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _isSubmitting ? null : _confirmSelection,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: const RoundedRectangleBorder(
                      borderRadius: AppDimensions.roundedMedium,
                    ),
                  ),
                  child: _isSubmitting
                      ? const SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                          ),
                        )
                      : Text(
                          localizations.connectSelectedProfile,
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
