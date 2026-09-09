import 'package:flutter/material.dart';
import '../../app/routes/app_routes.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_dimensions.dart';
import '../../app/theme/app_text_styles.dart';
import '../../core/localization/app_localizations.dart';
import '../../core/utils/accessibility_utils.dart';
import '../../features/authentication/presentation/authentication_controller.dart';
import '../../shared/services/mock_data_service.dart';
import '../../shared/widgets/care_bridge_button.dart';
import '../../shared/widgets/care_bridge_emergency_dialog.dart';
import '../../shared/widgets/care_bridge_logo.dart';

/// CareBridge Patient Home Dashboard (Step 3)
///
/// Designed specifically for patients in rural and underserved communities.
/// Fully connected to the authenticated patient session, dynamic greetings,
/// accessible public-health status, quick actions, appointment tracker,
/// referral updates, public health alerts, medicine availability,
/// outreach health camps, assistant entry, and emergency assistance.
class HomeScreen extends StatelessWidget {
  final ValueChanged<int>? onNavigateTab;

  const HomeScreen({
    super.key,
    this.onNavigateTab,
  });

  void _navigateToTab(BuildContext context, int tabIndex, String routeFallback) {
    if (onNavigateTab != null) {
      onNavigateTab!(tabIndex);
    } else {
      Navigator.of(context).pushNamed(routeFallback);
    }
  }

  void _showEmergencyDialog(BuildContext context, AppLocalizations loc) {
    showCareBridgeEmergencyDialog(context, loc);
  }

  void _showAssistantDialog(BuildContext context, AppLocalizations loc) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
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
                Icons.support_agent_rounded,
                color: AppColors.primary,
                size: AppDimensions.iconMedium,
              ),
            ),
            const SizedBox(width: AppDimensions.space10),
            Expanded(
              child: Text(
                loc.assistantCardTitle,
                style: AppTextStyles.heading2.copyWith(fontSize: 18.0),
              ),
            ),
          ],
        ),
        content: Text(
          loc.assistantSoonMsg,
          style: AppTextStyles.body.copyWith(color: AppColors.textPrimary),
        ),
        actions: [
          CareBridgeButton.primary(
            label: 'OK',
            onPressed: () => Navigator.of(ctx).pop(),
          ),
        ],
      ),
    );
  }

  void _showNotificationsSheet(BuildContext context, AppLocalizations loc) {
    final mockService = MockDataService.instance;
    final alerts = mockService.getHealthAlerts();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20.0)),
      ),
      builder: (ctx) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(AppDimensions.space20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    loc.notificationsTitle,
                    style: AppTextStyles.heading2,
                  ),
                  IconButton(
                    icon: const Icon(Icons.close_rounded),
                    tooltip: 'Close',
                    onPressed: () => Navigator.of(ctx).pop(),
                  ),
                ],
              ),
              const Divider(),
              const SizedBox(height: AppDimensions.space8),
              if (alerts.isEmpty)
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: AppDimensions.space24),
                  child: Center(
                    child: Text(
                      loc.noNotifications,
                      style: AppTextStyles.body.copyWith(color: AppColors.textMuted),
                    ),
                  ),
                )
              else
                ...alerts.map(
                  (alert) => ListTile(
                    contentPadding: EdgeInsets.zero,
                    leading: Container(
                      padding: const EdgeInsets.all(AppDimensions.space8),
                      decoration: const BoxDecoration(
                        color: AppColors.warningLight,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.campaign_rounded,
                        color: AppColors.warning,
                        size: 20.0,
                      ),
                    ),
                    title: Text(
                      alert.title,
                      style: AppTextStyles.body.copyWith(fontWeight: FontWeight.w600),
                    ),
                    subtitle: Text(
                      '${alert.issuedDate} • ${alert.description}',
                      style: AppTextStyles.caption.copyWith(color: AppColors.textSecondary),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ),
              const SizedBox(height: AppDimensions.space16),
              CareBridgeButton.primary(
                label: loc.markAllRead,
                isFullWidth: true,
                onPressed: () {
                  Navigator.of(ctx).pop();
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(loc.noNotifications),
                      duration: const Duration(seconds: 2),
                    ),
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final localizations = AppLocalizations.of(context);
    final mockService = MockDataService.instance;
    final fallbackUser = mockService.getUserProfile();

    // Authenticated patient name from Step 2 session
    String displayName = '';
    try {
      final authUser = CareBridgeAuthScope.of(context).currentUser;
      if (authUser != null && authUser.displayName.isNotEmpty) {
        displayName = authUser.displayName;
      }
    } catch (_) {}

    if (displayName.isEmpty) {
      displayName = fallbackUser.name;
    }

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 960),
            child: SingleChildScrollView(
              padding: AppDimensions.screenPadding,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // 1. Header: Greeting + Profile Button + Notifications
                  _buildHeader(context, localizations, displayName),

                  const SizedBox(height: AppDimensions.space20),

                  // 2. Large 2-column Healthcare Feature Grid
                  _buildQuickActions(context, localizations),

                  const SizedBox(height: AppDimensions.space24),
                ],
              ),
            ),
          ),
        ),
      ),
      floatingActionButton: _buildFloatingAssistantButton(context, localizations),
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. Header with Greeting, Profile Avatar, and Notifications
  // ─────────────────────────────────────────────────────────────────────────────
  Widget _buildHeader(
    BuildContext context,
    AppLocalizations loc,
    String displayName,
  ) {
    final String initial = displayName.isNotEmpty ? displayName[0].toUpperCase() : 'P';

    return Row(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        const CareBridgeLogo(size: 44.0),
        const SizedBox(width: AppDimensions.space12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                'Good morning,',
                style: AppTextStyles.bodySmall.copyWith(
                  color: AppColors.textSecondary,
                ),
              ),
              Text(
                'Hello, $displayName',
                style: AppTextStyles.heading2.copyWith(
                  color: AppColors.primary,
                  fontSize: 18.0,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 2.0),
              Text(
                loc.homeGreetingSubtitle,
                style: AppTextStyles.bodySmall.copyWith(
                  color: AppColors.textSecondary,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),

        // Notifications Icon Button (with unread indicator)
        AccessibilityUtils.ensureMinTouchTarget(
          child: Stack(
            alignment: Alignment.topRight,
            children: [
              IconButton(
                icon: const Icon(
                  Icons.notifications_outlined,
                  color: AppColors.textPrimary,
                  size: 24.0,
                ),
                tooltip: loc.notificationsTitle,
                onPressed: () => _showNotificationsSheet(context, loc),
              ),
              Positioned(
                right: 8,
                top: 8,
                child: Container(
                  width: 8.0,
                  height: 8.0,
                  decoration: const BoxDecoration(
                    color: AppColors.emergency,
                    shape: BoxShape.circle,
                  ),
                ),
              ),
            ],
          ),
        ),

        const SizedBox(width: AppDimensions.space4),

        // Profile Avatar Button -> /profile
        AccessibilityUtils.ensureMinTouchTarget(
          child: Tooltip(
            message: loc.tabProfile,
            child: InkWell(
              onTap: () => _navigateToTab(context, 4, AppRoutes.profile),
              borderRadius: BorderRadius.circular(22.0),
              child: Container(
                width: 42.0,
                height: 42.0,
                decoration: BoxDecoration(
                  color: AppColors.primary,
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.primary.withValues(alpha: 0.25),
                      blurRadius: 6.0,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                alignment: Alignment.center,
                child: Text(
                  initial,
                  style: AppTextStyles.heading3.copyWith(
                    color: AppColors.textOnPrimary,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. Large 2-Column Feature Grid (Healthcare Dashboard)
  // ─────────────────────────────────────────────────────────────────────────────
  Widget _buildQuickActions(BuildContext context, AppLocalizations loc) {
    final List<_QuickActionItem> actions = [
      _QuickActionItem(
        title: loc.quickActionBookDoctor,
        icon: Icons.calendar_month_rounded,
        color: const Color(0xFF00796B),
        bgColor: const Color(0xFFE8F5E9),
        borderColor: const Color(0xFFC8E6C9),
        onTap: () => Navigator.of(context).pushNamed(AppRoutes.bookAppointment),
      ),
      _QuickActionItem(
        title: loc.quickActionTalkDoctor,
        icon: Icons.video_call_rounded,
        color: const Color(0xFF0288D1),
        bgColor: const Color(0xFFE1F5FE),
        borderColor: const Color(0xFFB3E5FC),
        onTap: () => Navigator.of(context).pushNamed(AppRoutes.teleconsultation),
      ),
      _QuickActionItem(
        title: loc.quickActionFindHospital,
        icon: Icons.local_hospital_rounded,
        color: const Color(0xFF5E35B1),
        bgColor: const Color(0xFFEDE7F6),
        borderColor: const Color(0xFFD1C4E9),
        onTap: () => _navigateToTab(context, 2, AppRoutes.care),
      ),
      _QuickActionItem(
        key: const Key('quick_action_emergency'),
        title: loc.quickActionEmergency,
        icon: Icons.emergency_rounded,
        color: AppColors.emergency,
        bgColor: AppColors.emergencyLight,
        borderColor: const Color(0xFFFFCDD2),
        isEmergency: true,
        badge: '108',
        onTap: () => _showEmergencyDialog(context, loc),
      ),
      _QuickActionItem(
        title: 'Healthcare Services',
        icon: Icons.domain_rounded,
        color: const Color(0xFF00838F),
        bgColor: const Color(0xFFE0F7FA),
        borderColor: const Color(0xFFB2EBF2),
        onTap: () => _navigateToTab(context, 2, AppRoutes.care),
      ),
      _QuickActionItem(
        title: loc.categoryMedicalRecords,
        icon: Icons.folder_shared_rounded,
        color: const Color(0xFFD84315),
        bgColor: const Color(0xFFFBE9E7),
        borderColor: const Color(0xFFFFCCBC),
        onTap: () => _navigateToTab(context, 3, AppRoutes.records),
      ),
      _QuickActionItem(
        title: 'My Appointments',
        icon: Icons.event_available_rounded,
        color: const Color(0xFF2E7D32),
        bgColor: const Color(0xFFE8F5E9),
        borderColor: const Color(0xFFC8E6C9),
        onTap: () => _navigateToTab(context, 1, AppRoutes.appointments),
      ),
      _QuickActionItem(
        title: loc.categoryLabReports,
        icon: Icons.science_rounded,
        color: const Color(0xFF4527A0),
        bgColor: const Color(0xFFEDE7F6),
        borderColor: const Color(0xFFD1C4E9),
        onTap: () => _navigateToTab(context, 3, AppRoutes.records),
      ),
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          loc.quickActionsTitle,
          style: AppTextStyles.heading2,
        ),
        const SizedBox(height: AppDimensions.space12),
        LayoutBuilder(
          builder: (context, constraints) {
            final double maxWidth = constraints.maxWidth;
            final int crossAxisCount = maxWidth > 650 ? 4 : 2;
            final double spacing = AppDimensions.space12;
            final double itemWidth = (maxWidth - (spacing * (crossAxisCount - 1))) / crossAxisCount;

            return Wrap(
              spacing: spacing,
              runSpacing: spacing,
              children: actions.map((item) {
                return SizedBox(
                  width: itemWidth,
                  child: _buildFeatureCard(context, item),
                );
              }).toList(),
            );
          },
        ),
      ],
    );
  }

  Widget _buildFeatureCard(BuildContext context, _QuickActionItem item) {
    return AccessibilityUtils.ensureMinTouchTarget(
      child: Semantics(
        button: true,
        label: item.title,
        child: Material(
          key: item.key,
          color: item.bgColor,
          borderRadius: BorderRadius.circular(20.0),
          child: InkWell(
            onTap: item.onTap,
            borderRadius: BorderRadius.circular(20.0),
            child: Container(
              padding: const EdgeInsets.symmetric(
                horizontal: AppDimensions.space12,
                vertical: AppDimensions.space16,
              ),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(20.0),
                border: Border.all(
                  color: item.borderColor ?? item.color.withValues(alpha: 0.25),
                  width: item.isEmergency ? 1.5 : 1.0,
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.02),
                    blurRadius: 6.0,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Top Centered Icon container
                  Stack(
                    alignment: Alignment.center,
                    children: [
                      Container(
                        width: 56.0,
                        height: 56.0,
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.92),
                          shape: BoxShape.circle,
                          boxShadow: [
                            BoxShadow(
                              color: item.color.withValues(alpha: 0.12),
                              blurRadius: 8.0,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        child: Icon(
                          item.icon,
                          color: item.color,
                          size: 30.0,
                        ),
                      ),
                      if (item.badge != null)
                        Positioned(
                          top: 0,
                          right: 0,
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1.5),
                            decoration: BoxDecoration(
                              color: item.color,
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              item.badge!,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 9.0,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: AppDimensions.space12),
                  // Title
                  Text(
                    item.title,
                    textAlign: TextAlign.center,
                    style: AppTextStyles.heading3.copyWith(
                      fontSize: 15.0,
                      fontWeight: FontWeight.bold,
                      color: item.isEmergency ? AppColors.emergency : AppColors.textPrimary,
                      height: 1.2,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Floating CareBridge AI Assistant Button
  // ─────────────────────────────────────────────────────────────────────────────
  Widget _buildFloatingAssistantButton(BuildContext context, AppLocalizations loc) {
    return Semantics(
      button: true,
      label: loc.openAssistantSemantic,
      child: Tooltip(
        message: loc.assistantCardTitle,
        child: FloatingActionButton(
          heroTag: null,
          key: const Key('floating_assistant_button'),
          onPressed: () => _showAssistantDialog(context, loc),
          backgroundColor: Colors.transparent,
          elevation: 6.0,
          highlightElevation: 9.0,
          shape: const CircleBorder(),
          child: Container(
            width: 58.0,
            height: 58.0,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: const LinearGradient(
                colors: [Color(0xFF0F766E), Color(0xFF0D9488)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              boxShadow: [
                BoxShadow(
                  color: AppColors.primary.withValues(alpha: 0.35),
                  blurRadius: 10.0,
                  offset: const Offset(0, 4),
                ),
              ],
              border: Border.all(
                color: Colors.white.withValues(alpha: 0.3),
                width: 1.5,
              ),
            ),
            child: Stack(
              alignment: Alignment.center,
              children: [
                const Icon(
                  Icons.support_agent_rounded,
                  color: Colors.white,
                  size: 30.0,
                ),
                Positioned(
                  top: 7,
                  right: 7,
                  child: Container(
                    padding: const EdgeInsets.all(2.0),
                    decoration: const BoxDecoration(
                      color: Color(0xFFF59E0B),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.auto_awesome,
                      color: Colors.white,
                      size: 10.0,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _QuickActionItem {
  final Key? key;
  final String title;
  final IconData icon;
  final Color color;
  final Color bgColor;
  final Color? borderColor;
  final bool isEmergency;
  final String? badge;
  final VoidCallback onTap;

  const _QuickActionItem({
    this.key,
    required this.title,
    required this.icon,
    required this.color,
    required this.bgColor,
    this.borderColor,
    this.isEmergency = false,
    this.badge,
    required this.onTap,
  });
}
