import 'package:flutter/material.dart';
import '../../app/routes/app_routes.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_dimensions.dart';
import '../../app/theme/app_text_styles.dart';
import '../../core/constants/app_constants.dart';
import '../../core/localization/app_localizations.dart';
import '../../core/utils/accessibility_utils.dart';
import '../../shared/services/mock_data_service.dart';
import '../../shared/widgets/care_bridge_button.dart';
import '../authentication/presentation/authentication_controller.dart';
import 'emergency_contacts_screen.dart';
import 'my_abha_card_dialog.dart';
import 'opd_card_dialog.dart';

/// CareBridge Profile Screen
///
/// Provides access to My ABHA Card with dynamic QR Code, OPD Card with download,
/// Emergency Contacts management, and 2-option Language selector (Tamil & English).
class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  void _showLogoutDialog(BuildContext context) {
    final localizations = AppLocalizations.of(context);

    showDialog<void>(
      context: context,
      builder: (dialogContext) {
        return AlertDialog(
          title: Text(localizations.logoutConfirmTitle, style: AppTextStyles.heading2),
          content: Text(
            localizations.logoutConfirmMessage,
            style: AppTextStyles.body,
          ),
          actions: [
            CareBridgeButton.text(
              label: localizations.cancelBtn,
              onPressed: () => Navigator.of(dialogContext).pop(),
            ),
            CareBridgeButton.emergency(
              label: localizations.logoutBtn,
              onPressed: () async {
                Navigator.of(dialogContext).pop();
                final controller = CareBridgeAuthScope.of(context);
                await controller.logout();
                if (context.mounted) {
                  Navigator.of(context).pushNamedAndRemoveUntil(AppRoutes.login, (route) => false);
                }
              },
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context);
    final authController = CareBridgeAuthScope.of(context);
    final authUser = authController.currentUser;
    final fallbackUser = MockDataService.instance.getUserProfile();

    final String displayName = authUser != null && authUser.displayName.isNotEmpty
        ? authUser.displayName
        : fallbackUser.name;

    final String phoneNumber = authUser != null && authUser.phoneNumber.isNotEmpty
        ? (authUser.phoneNumber.length == 10
            ? '+91 ${authUser.phoneNumber.substring(0, 5)} ${authUser.phoneNumber.substring(5)}'
            : '+91 ${authUser.phoneNumber}')
        : fallbackUser.mobileNumber;

    final currentLocaleCode = Localizations.localeOf(context).languageCode;
    final activeLang = currentLocaleCode == 'ta' ? 'ta' : 'en';

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text(loc.tabProfile),
      ),
      body: SingleChildScrollView(
        padding: AppDimensions.screenPadding,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // User Header
            _buildUserHeader(context, displayName, phoneNumber, fallbackUser.location),

            const SizedBox(height: AppDimensions.space20),

            // 1. Healthcare Identity Actions Card Group
            Material(
              color: AppColors.surface,
              shape: RoundedRectangleBorder(
                borderRadius: AppDimensions.roundedMedium,
                side: const BorderSide(color: AppColors.borderLight, width: 1.0),
              ),
              child: Column(
                children: [
                  // My Health ID / My ABHA Card
                  ListTile(
                    key: const Key('profile_menu_my_abha_card'),
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: AppDimensions.space16,
                      vertical: AppDimensions.space4,
                    ),
                    leading: Container(
                      padding: const EdgeInsets.all(AppDimensions.space8),
                      decoration: BoxDecoration(
                        color: AppColors.primary.withValues(alpha: 0.1),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.qr_code_2_rounded, color: AppColors.primary, size: 24),
                    ),
                    title: Text(loc.myAbhaCardTitle, style: AppTextStyles.heading3.copyWith(fontSize: 15.5)),
                    subtitle: Text(loc.myAbhaCardSubtitle, style: AppTextStyles.bodySmall),
                    trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 14.0, color: AppColors.textMuted),
                    onTap: () => MyAbhaCardDialog.show(
                      context,
                      sessionService: authController.sessionService,
                    ),
                  ),
                  const Divider(height: 1, indent: 56),

                  // OPD Card
                  ListTile(
                    key: const Key('profile_menu_opd_card'),
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: AppDimensions.space16,
                      vertical: AppDimensions.space4,
                    ),
                    leading: Container(
                      padding: const EdgeInsets.all(AppDimensions.space8),
                      decoration: BoxDecoration(
                        color: AppColors.secondary.withValues(alpha: 0.1),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.assignment_ind_rounded, color: AppColors.secondary, size: 24),
                    ),
                    title: Text(loc.opdCardTitle, style: AppTextStyles.heading3.copyWith(fontSize: 15.5)),
                    subtitle: Text(loc.opdCardSubtitle, style: AppTextStyles.bodySmall),
                    trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 14.0, color: AppColors.textMuted),
                    onTap: () => OpdCardDialog.show(
                      context,
                      sessionService: authController.sessionService,
                    ),
                  ),
                  const Divider(height: 1, indent: 56),

                  // Emergency Contacts
                  ListTile(
                    key: const Key('profile_menu_emergency_contacts'),
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: AppDimensions.space16,
                      vertical: AppDimensions.space4,
                    ),
                    leading: Container(
                      padding: const EdgeInsets.all(AppDimensions.space8),
                      decoration: BoxDecoration(
                        color: AppColors.emergency.withValues(alpha: 0.1),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.contact_phone_rounded, color: AppColors.emergency, size: 24),
                    ),
                    title: Text(loc.emergencyContactsTitle, style: AppTextStyles.heading3.copyWith(fontSize: 15.5)),
                    subtitle: Text(loc.emergencyContactsSubtitle, style: AppTextStyles.bodySmall),
                    trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 14.0, color: AppColors.textMuted),
                    onTap: () {
                      Navigator.of(context).push(
                        MaterialPageRoute<void>(
                          builder: (_) => EmergencyContactsScreen(
                            sessionServiceOverride: authController.sessionService,
                          ),
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),

            const SizedBox(height: AppDimensions.space20),

            // 2. Language Settings Card (Tamil & English only)
            Text(
              loc.languageSettingsTitle,
              style: AppTextStyles.heading2,
            ),
            const SizedBox(height: AppDimensions.space8),
            Material(
              color: AppColors.surface,
              shape: RoundedRectangleBorder(
                borderRadius: AppDimensions.roundedMedium,
                side: const BorderSide(color: AppColors.borderLight, width: 1.0),
              ),
              child: Column(
                children: [
                  // ignore: deprecated_member_use
                  RadioListTile<String>(
                    key: const Key('language_option_ta'),
                    value: 'ta',
                    // ignore: deprecated_member_use
                    groupValue: activeLang,
                    activeColor: AppColors.primary,
                    title: Row(
                      children: [
                        Text(
                          loc.tamilLang,
                          style: AppTextStyles.body.copyWith(
                            fontWeight: activeLang == 'ta' ? FontWeight.bold : FontWeight.normal,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          '(தமிழ்)',
                          style: AppTextStyles.caption.copyWith(color: AppColors.textSecondary),
                        ),
                      ],
                    ),
                    // ignore: deprecated_member_use
                    onChanged: (val) {
                      if (val != null) {
                        authController.setLocale(val);
                      }
                    },
                  ),
                  const Divider(height: 1, indent: 16),
                  // ignore: deprecated_member_use
                  RadioListTile<String>(
                    key: const Key('language_option_en'),
                    value: 'en',
                    // ignore: deprecated_member_use
                    groupValue: activeLang,
                    activeColor: AppColors.primary,
                    title: Row(
                      children: [
                        Text(
                          loc.englishLang,
                          style: AppTextStyles.body.copyWith(
                            fontWeight: activeLang == 'en' ? FontWeight.bold : FontWeight.normal,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          '(English)',
                          style: AppTextStyles.caption.copyWith(color: AppColors.textSecondary),
                        ),
                      ],
                    ),
                    // ignore: deprecated_member_use
                    onChanged: (val) {
                      if (val != null) {
                        authController.setLocale(val);
                      }
                    },
                  ),
                ],
              ),
            ),

            const SizedBox(height: AppDimensions.space20),

            // 3. Secondary Settings (Notifications, Consent, App Settings)
            Material(
              color: AppColors.surface,
              shape: RoundedRectangleBorder(
                borderRadius: AppDimensions.roundedMedium,
                side: const BorderSide(color: AppColors.borderLight, width: 1.0),
              ),
              child: Column(
                children: [
                  ListTile(
                    leading: const Icon(Icons.notifications_none_rounded, color: Color(0xFFD97706)),
                    title: Text('Notifications & Health Alerts', style: AppTextStyles.heading3.copyWith(fontSize: 15.0)),
                    trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 14.0, color: AppColors.textMuted),
                    onTap: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Notifications settings configured.')),
                      );
                    },
                  ),
                  const Divider(height: 1, indent: 56),
                  ListTile(
                    leading: const Icon(Icons.shield_outlined, color: Color(0xFF0284C7)),
                    title: Text('Consent & Privacy', style: AppTextStyles.heading3.copyWith(fontSize: 15.0)),
                    trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 14.0, color: AppColors.textMuted),
                    onTap: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Consent & Privacy configured.')),
                      );
                    },
                  ),
                ],
              ),
            ),

            const SizedBox(height: AppDimensions.space20),

            // Logout Action Button
            AccessibilityUtils.ensureMinTouchTarget(
              child: Material(
                color: AppColors.emergencyLight,
                shape: RoundedRectangleBorder(
                  borderRadius: AppDimensions.roundedMedium,
                  side: BorderSide(color: AppColors.emergency.withValues(alpha: 0.3)),
                ),
                child: InkWell(
                  onTap: () => _showLogoutDialog(context),
                  borderRadius: AppDimensions.roundedMedium,
                  child: Padding(
                    padding: const EdgeInsets.symmetric(
                      horizontal: AppDimensions.space16,
                      vertical: AppDimensions.space14,
                    ),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(AppDimensions.space8),
                          decoration: const BoxDecoration(
                            color: AppColors.surface,
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            Icons.logout_rounded,
                            color: AppColors.emergency,
                            size: AppDimensions.iconMedium,
                          ),
                        ),
                        const SizedBox(width: AppDimensions.space16),
                        Expanded(
                          child: Text(
                            loc.logoutBtn,
                            style: AppTextStyles.heading3.copyWith(
                              color: AppColors.emergency,
                              fontSize: 15.5,
                            ),
                          ),
                        ),
                        const Icon(
                          Icons.arrow_forward_ios_rounded,
                          size: 14.0,
                          color: AppColors.emergency,
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),

            const SizedBox(height: AppDimensions.space24),

            // App Version footer
            Center(
              child: Column(
                children: [
                  Text(
                    '${AppConstants.appName} v${AppConstants.appVersion}',
                    style: AppTextStyles.caption.copyWith(color: AppColors.textMuted),
                  ),
                  const SizedBox(height: AppDimensions.space4),
                  Text(
                    'National Health Mission • ABDM Compliant',
                    style: AppTextStyles.caption.copyWith(color: AppColors.textMuted),
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppDimensions.space20),
          ],
        ),
      ),
    );
  }

  Widget _buildUserHeader(BuildContext context, String name, String phone, String location) {
    final initial = name.isNotEmpty ? name.substring(0, 1).toUpperCase() : 'U';

    return Container(
      width: double.infinity,
      padding: AppDimensions.cardPadding,
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: AppDimensions.roundedMedium,
        border: Border.all(color: AppColors.borderLight),
        boxShadow: const [
          BoxShadow(
            color: Color(0x080F172A),
            blurRadius: 6,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 32,
            backgroundColor: AppColors.primaryLight,
            child: Text(
              initial,
              style: AppTextStyles.display.copyWith(
                color: AppColors.primary,
                fontSize: 24.0,
              ),
            ),
          ),
          const SizedBox(width: AppDimensions.space16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  style: AppTextStyles.heading2,
                ),
                const SizedBox(height: AppDimensions.space4),
                Text(
                  phone,
                  style: AppTextStyles.body.copyWith(
                    color: AppColors.textSecondary,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: AppDimensions.space2),
                Text(
                  location,
                  style: AppTextStyles.bodySmall,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
