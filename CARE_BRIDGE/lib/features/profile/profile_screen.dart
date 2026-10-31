// ignore_for_file: deprecated_member_use
import 'package:flutter/material.dart';
import '../../app/routes/app_routes.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_dimensions.dart';
import '../../app/theme/app_text_styles.dart';
import '../../core/constants/app_constants.dart';
import '../../core/localization/app_localizations.dart';
import '../../core/localization/supported_locales.dart';
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
/// Emergency Contacts management, and complete 23-language multilingual selector.
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

  void _showAllLanguagesSheet(
    BuildContext context,
    AuthenticationController authController,
    String activeLang,
  ) {
    final loc = AppLocalizations.of(context);

    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20.0)),
      ),
      builder: (modalContext) {
        String searchQuery = '';

        return StatefulBuilder(
          builder: (context, setModalState) {
            final filteredLocales = SupportedLocales.all.where((locale) {
              final query = searchQuery.trim().toLowerCase();
              if (query.isEmpty) return true;
              final name = SupportedLocales.getLanguageName(locale).toLowerCase();
              final native = SupportedLocales.getNativeName(locale).toLowerCase();
              final english = SupportedLocales.getEnglishName(locale).toLowerCase();
              return name.contains(query) || native.contains(query) || english.contains(query);
            }).toList();

            return DraggableScrollableSheet(
              expand: false,
              initialChildSize: 0.75,
              maxChildSize: 0.95,
              minChildSize: 0.5,
              builder: (context, scrollController) {
                return Column(
                  children: [
                    // Sheet Handle
                    Container(
                      margin: const EdgeInsets.only(top: 12.0, bottom: 8.0),
                      width: 40.0,
                      height: 4.0,
                      decoration: BoxDecoration(
                        color: AppColors.border,
                        borderRadius: BorderRadius.circular(2.0),
                      ),
                    ),

                    // Header
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 8.0),
                      child: Row(
                        children: [
                          const Icon(Icons.translate_rounded, color: AppColors.primary),
                          const SizedBox(width: 12.0),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  loc.languageSelectorTitle,
                                  style: AppTextStyles.heading2.copyWith(fontSize: 18.0),
                                ),
                                Text(
                                  '22 Indian Scheduled Languages + English',
                                  style: AppTextStyles.caption.copyWith(color: AppColors.textMuted),
                                ),
                              ],
                            ),
                          ),
                          IconButton(
                            icon: const Icon(Icons.close_rounded),
                            onPressed: () => Navigator.of(context).pop(),
                          ),
                        ],
                      ),
                    ),

                    // Search input
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 8.0),
                      child: TextField(
                        decoration: InputDecoration(
                          hintText: loc.languageSearchHint,
                          prefixIcon: const Icon(Icons.search_rounded, size: 20.0),
                          filled: true,
                          fillColor: AppColors.surface,
                          contentPadding: const EdgeInsets.symmetric(vertical: 10.0, horizontal: 16.0),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12.0),
                            borderSide: const BorderSide(color: AppColors.borderLight),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12.0),
                            borderSide: const BorderSide(color: AppColors.borderLight),
                          ),
                        ),
                        onChanged: (val) {
                          setModalState(() {
                            searchQuery = val;
                          });
                        },
                      ),
                    ),

                    const Divider(height: 1),

                    // Languages List
                    Expanded(
                      child: ListView.separated(
                        controller: scrollController,
                        itemCount: filteredLocales.length,
                        separatorBuilder: (context, index) => const Divider(height: 1, indent: 20),
                        itemBuilder: (context, index) {
                          final locale = filteredLocales[index];
                          final code = locale.languageCode;
                          final isSelected = activeLang == code;

                          return ListTile(
                            leading: Container(
                              width: 38.0,
                              height: 38.0,
                              decoration: BoxDecoration(
                                color: isSelected ? AppColors.primaryLight : AppColors.surface,
                                shape: BoxShape.circle,
                                border: Border.all(
                                  color: isSelected ? AppColors.primary : AppColors.borderLight,
                                  width: 1.5,
                                ),
                              ),
                              child: Center(
                                child: Text(
                                  code.toUpperCase(),
                                  style: TextStyle(
                                    fontSize: 11.0,
                                    fontWeight: FontWeight.bold,
                                    color: isSelected ? AppColors.primary : AppColors.textMuted,
                                  ),
                                ),
                              ),
                            ),
                            title: Text(
                              SupportedLocales.getLanguageName(locale),
                              style: AppTextStyles.body.copyWith(
                                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                                color: isSelected ? AppColors.primary : AppColors.textPrimary,
                              ),
                            ),
                            subtitle: SupportedLocales.isRtl(locale)
                                ? const Text('Right-to-Left (RTL)', style: TextStyle(fontSize: 11.0, color: AppColors.textMuted))
                                : null,
                            trailing: isSelected
                                ? const Icon(Icons.check_circle_rounded, color: AppColors.primary)
                                : const Icon(Icons.radio_button_unchecked_rounded, color: AppColors.textMuted, size: 20.0),
                            onTap: () {
                              authController.setLocale(code);
                              Navigator.of(context).pop();
                            },
                          );
                        },
                      ),
                    ),
                  ],
                );
              },
            );
          },
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
    final activeLang = currentLocaleCode;

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
                  ListTile(
                    key: const Key('profile_menu_my_abha_card'),
                    leading: const Icon(Icons.credit_card_rounded, color: AppColors.primary),
                    title: Text(loc.myAbhaCardTitle, style: AppTextStyles.heading3.copyWith(fontSize: 15.0)),
                    subtitle: Text(loc.myAbhaCardSubtitle, style: AppTextStyles.caption),
                    trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 14.0, color: AppColors.textMuted),
                    onTap: () {
                      MyAbhaCardDialog.show(context);
                    },
                  ),
                  const Divider(height: 1, indent: 56),
                  ListTile(
                    key: const Key('profile_menu_opd_card'),
                    leading: const Icon(Icons.local_hospital_outlined, color: AppColors.secondary),
                    title: Text(loc.opdCardTitle, style: AppTextStyles.heading3.copyWith(fontSize: 15.0)),
                    subtitle: Text(loc.opdCardSubtitle, style: AppTextStyles.caption),
                    trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 14.0, color: AppColors.textMuted),
                    onTap: () {
                      OpdCardDialog.show(context);
                    },
                  ),
                  const Divider(height: 1, indent: 56),
                  ListTile(
                    key: const Key('profile_menu_emergency_contacts'),
                    leading: const Icon(Icons.contact_phone_outlined, color: AppColors.emergency),
                    title: Text(loc.emergencyContactsTitle, style: AppTextStyles.heading3.copyWith(fontSize: 15.0)),
                    subtitle: Text(loc.emergencyContactsSubtitle, style: AppTextStyles.caption),
                    trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 14.0, color: AppColors.textMuted),
                    onTap: () {
                      Navigator.of(context).push(
                        MaterialPageRoute<void>(
                          builder: (_) => const EmergencyContactsScreen(),
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),

            const SizedBox(height: AppDimensions.space20),

            // 2. Language Settings Card (All 23 Supported Indian Languages)
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  loc.languageSettingsTitle,
                  style: AppTextStyles.heading2,
                ),
                TextButton.icon(
                  onPressed: () => _showAllLanguagesSheet(context, authController, activeLang),
                  icon: const Icon(Icons.translate_rounded, size: 16.0),
                  label: const Text('All 23 Languages'),
                ),
              ],
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
                  RadioListTile<String>(
                    key: const Key('language_option_ta'),
                    value: 'ta',
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
                    onChanged: (val) {
                      if (val != null) {
                        authController.setLocale(val);
                      }
                    },
                  ),
                  const Divider(height: 1, indent: 16),
                  RadioListTile<String>(
                    key: const Key('language_option_en'),
                    value: 'en',
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
                    onChanged: (val) {
                      if (val != null) {
                        authController.setLocale(val);
                      }
                    },
                  ),
                  const Divider(height: 1, indent: 16),
                  RadioListTile<String>(
                    key: const Key('language_option_hi'),
                    value: 'hi',
                    groupValue: activeLang,
                    activeColor: AppColors.primary,
                    title: Row(
                      children: [
                        Text(
                          loc.hindiLang,
                          style: AppTextStyles.body.copyWith(
                            fontWeight: activeLang == 'hi' ? FontWeight.bold : FontWeight.normal,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          '(हिन्दी)',
                          style: AppTextStyles.caption.copyWith(color: AppColors.textSecondary),
                        ),
                      ],
                    ),
                    onChanged: (val) {
                      if (val != null) {
                        authController.setLocale(val);
                      }
                    },
                  ),
                  const Divider(height: 1, indent: 16),
                  ListTile(
                    leading: const Icon(Icons.language_rounded, color: AppColors.primary),
                    title: Text(
                      loc.languageSelectorTitle,
                      style: AppTextStyles.heading3.copyWith(fontSize: 15.0),
                    ),
                    subtitle: Text(
                      '${SupportedLocales.getLanguageName(Locale(activeLang))} • 23 Languages',
                      style: AppTextStyles.caption.copyWith(color: AppColors.textSecondary),
                    ),
                    trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 14.0, color: AppColors.textMuted),
                    onTap: () => _showAllLanguagesSheet(context, authController, activeLang),
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
                    title: Text(loc.notificationsAndAlerts, style: AppTextStyles.heading3.copyWith(fontSize: 15.0)),
                    trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 14.0, color: AppColors.textMuted),
                    onTap: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text(loc.notificationsConfiguredMsg)),
                      );
                    },
                  ),
                  const Divider(height: 1, indent: 56),
                  ListTile(
                    leading: const Icon(Icons.shield_outlined, color: Color(0xFF0284C7)),
                    title: Text(loc.consentAndPrivacy, style: AppTextStyles.heading3.copyWith(fontSize: 15.0)),
                    trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 14.0, color: AppColors.textMuted),
                    onTap: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text(loc.consentConfiguredMsg)),
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
                  const SizedBox(height: 4),
                  Text(
                    '23 Supported Indian Languages Supported',
                    style: AppTextStyles.caption.copyWith(color: AppColors.textMuted, fontSize: 11.0),
                  ),
                ],
              ),
            ),

            const SizedBox(height: AppDimensions.space32),
          ],
        ),
      ),
    );
  }

  Widget _buildUserHeader(
    BuildContext context,
    String name,
    String phone,
    String location,
  ) {
    return Container(
      padding: const EdgeInsets.all(AppDimensions.space16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: AppDimensions.roundedMedium,
        border: Border.all(color: AppColors.borderLight),
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 30.0,
            backgroundColor: AppColors.primaryLight,
            child: Text(
              name.isNotEmpty ? name[0].toUpperCase() : 'U',
              style: AppTextStyles.heading1.copyWith(color: AppColors.primary),
            ),
          ),
          const SizedBox(width: AppDimensions.space16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  style: AppTextStyles.heading2.copyWith(fontSize: 18.0),
                ),
                const SizedBox(height: 4.0),
                Text(
                  phone,
                  style: AppTextStyles.bodySmall.copyWith(color: AppColors.textMuted),
                ),
                const SizedBox(height: 2.0),
                Row(
                  children: [
                    const Icon(Icons.location_on_outlined, size: 14.0, color: AppColors.primary),
                    const SizedBox(width: 4.0),
                    Text(
                      location,
                      style: AppTextStyles.caption.copyWith(color: AppColors.textSecondary),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
