import 'package:flutter/material.dart';
import '../../app/routes/app_routes.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_dimensions.dart';
import '../../app/theme/app_text_styles.dart';
import '../../core/localization/app_localizations.dart';
import '../../shared/models/mock_models.dart';
import '../../shared/services/mock_data_service.dart';
import '../../shared/widgets/care_bridge_button.dart';
import '../../shared/widgets/care_bridge_card.dart';
import '../teleconsultation/data/mock_teleconsultation_repository.dart';
import '../teleconsultation/domain/teleconsultation.dart';

/// CareBridge Appointments Screen Placeholder (Step 1 Foundation)
class AppointmentsScreen extends StatefulWidget {
  const AppointmentsScreen({super.key});

  @override
  State<AppointmentsScreen> createState() => _AppointmentsScreenState();
}

class _AppointmentsScreenState extends State<AppointmentsScreen>
    with SingleTickerProviderStateMixin {
  late final TabController _tabController;
  List<Teleconsultation> _teleconsultations = [];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _loadTeleconsultations();
  }

  Future<void> _loadTeleconsultations() async {
    final items = await MockTeleconsultationRepository().getTeleconsultations();
    if (mounted) {
      setState(() {
        _teleconsultations = items.toList();
      });
    }
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final mockService = MockDataService.instance;
    final upcomingAppointments = mockService.getAppointments();
    final pastAppointments = mockService.getPastAppointments();

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Appointments'),
        bottom: TabBar(
          controller: _tabController,
          labelColor: AppColors.primary,
          unselectedLabelColor: AppColors.textMuted,
          indicatorColor: AppColors.primary,
          indicatorWeight: 3.0,
          labelStyle: AppTextStyles.button.copyWith(fontSize: 14.5),
          unselectedLabelStyle: AppTextStyles.button.copyWith(
            fontSize: 14.5,
            fontWeight: FontWeight.normal,
          ),
          tabs: const [
            Tab(text: 'Upcoming'),
            Tab(text: 'Past Consultations'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildUpcomingList(context, upcomingAppointments),
          _buildPastList(context, pastAppointments),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          Navigator.of(context).pushNamed(AppRoutes.bookAppointment);
        },
        backgroundColor: AppColors.primary,
        foregroundColor: AppColors.textOnPrimary,
        icon: const Icon(Icons.add_rounded),
        label: const Text('Book Appointment'),
      ),
    );
  }

  Widget _buildUpcomingList(BuildContext context, List<AppointmentItem> list) {
    final loc = AppLocalizations.of(context);
    final totalCount = _teleconsultations.length + list.length;

    if (totalCount == 0) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.event_busy_rounded, size: 56, color: AppColors.textMuted),
              const SizedBox(height: 16),
              Text(
                loc.noUpcomingAppointments,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                loc.bookConsultationPrompt,
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 13, color: AppColors.textMuted),
              ),
            ],
          ),
        ),
      );
    }

    return ListView.separated(
      padding: AppDimensions.screenPadding,
      itemCount: totalCount,
      separatorBuilder: (context, index) => const SizedBox(height: AppDimensions.space12),
      itemBuilder: (context, index) {
        if (index < _teleconsultations.length) {
          final tele = _teleconsultations[index];
          return _buildTeleconsultationCard(context, loc, tele);
        }

        final item = list[index - _teleconsultations.length];
        return CareBridgeCard(
          title: item.doctorName,
          subtitle: item.specialty,
          leadingIcon: const Icon(
            Icons.medical_services_rounded,
            color: AppColors.primary,
            size: AppDimensions.iconLarge,
          ),
          status: item.status,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Divider(),
              const SizedBox(height: AppDimensions.space8),
              Row(
                children: [
                  const Icon(Icons.location_on_outlined, size: 16.0, color: AppColors.textMuted),
                  const SizedBox(width: AppDimensions.space4),
                  Expanded(
                    child: Text(
                      item.hospitalName,
                      style: AppTextStyles.bodySmall,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: AppDimensions.space6),
              Wrap(
                alignment: WrapAlignment.spaceBetween,
                crossAxisAlignment: WrapCrossAlignment.center,
                spacing: AppDimensions.space8,
                runSpacing: AppDimensions.space4,
                children: [
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.calendar_today_rounded, size: 16.0, color: AppColors.textMuted),
                      const SizedBox(width: AppDimensions.space4),
                      Text(
                        '${item.date} • ${item.time}',
                        style: AppTextStyles.bodySmall.copyWith(
                          fontWeight: FontWeight.w600,
                          color: AppColors.textPrimary,
                        ),
                      ),
                    ],
                  ),
                  if (item.tokenNumber != null)
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: AppColors.primaryLight,
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        'Token: ${item.tokenNumber}',
                        style: AppTextStyles.label.copyWith(
                          color: AppColors.primary,
                          fontSize: 12.0,
                        ),
                      ),
                    ),
                ],
              ),
              const SizedBox(height: AppDimensions.space12),
              Row(
                children: [
                  Expanded(
                    child: CareBridgeButton.outlined(
                      label: 'View Details',
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('Appointment details for ${item.doctorName} (Mock)'),
                          ),
                        );
                      },
                    ),
                  ),
                  const SizedBox(width: AppDimensions.space12),
                  Expanded(
                    child: CareBridgeButton.secondary(
                      label: 'Reschedule',
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Rescheduling will be enabled in future steps.'),
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildTeleconsultationCard(
      BuildContext context, AppLocalizations loc, Teleconsultation tele) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.primary.withValues(alpha: 0.3)),
        boxShadow: [
          BoxShadow(
            color: AppColors.primary.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              CircleAvatar(
                radius: 24,
                backgroundColor: AppColors.primaryLight,
                child: Icon(
                  tele.type.icon,
                  color: AppColors.primary,
                  size: 26,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      tele.doctorName,
                      style: const TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      tele.doctorSpecialization,
                      style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: AppColors.primary,
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: AppColors.primaryLight,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.primary.withValues(alpha: 0.4)),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(tele.type.icon, size: 12, color: AppColors.primary),
                    const SizedBox(width: 4),
                    Text(
                      loc.teleconsultationBadge,
                      style: const TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        color: AppColors.primary,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const Divider(color: AppColors.divider, height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  const Icon(Icons.calendar_month_rounded,
                      size: 15, color: AppColors.textMuted),
                  const SizedBox(width: 5),
                  Text(
                    '${tele.date.day.toString().padLeft(2, '0')}/${tele.date.month.toString().padLeft(2, '0')}/${tele.date.year} • ${tele.timeSlot}',
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textPrimary,
                    ),
                  ),
                ],
              ),
              Text(
                tele.id,
                style: const TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textMuted,
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          SizedBox(
            width: double.infinity,
            height: 42,
            child: ElevatedButton.icon(
              onPressed: () {
                Navigator.of(context).pushNamed(
                  AppRoutes.teleconsultationCall,
                  arguments: tele,
                ).then((_) => _loadTeleconsultations());
              },
              icon: Icon(tele.type.icon, size: 18),
              label: Text(
                loc.joinConsultationBtn,
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                ),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
                elevation: 0,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPastList(BuildContext context, List<AppointmentItem> list) {
    return ListView.separated(
      padding: AppDimensions.screenPadding,
      itemCount: list.length,
      separatorBuilder: (context, index) => const SizedBox(height: AppDimensions.space12),
      itemBuilder: (context, index) {
        final item = list[index];
        return CareBridgeCard(
          title: item.doctorName,
          subtitle: item.specialty,
          leadingIcon: const Icon(
            Icons.history_rounded,
            color: AppColors.textMuted,
            size: AppDimensions.iconLarge,
          ),
          status: item.status,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Divider(),
              const SizedBox(height: AppDimensions.space8),
              Row(
                children: [
                  const Icon(Icons.location_on_outlined, size: 16.0, color: AppColors.textMuted),
                  const SizedBox(width: AppDimensions.space4),
                  Expanded(
                    child: Text(
                      item.hospitalName,
                      style: AppTextStyles.bodySmall,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: AppDimensions.space4),
              Row(
                children: [
                  const Icon(Icons.event_available_rounded, size: 16.0, color: AppColors.textMuted),
                  const SizedBox(width: AppDimensions.space4),
                  Text(
                    '${item.date} • ${item.time}',
                    style: AppTextStyles.bodySmall.copyWith(
                      color: AppColors.textSecondary,
                    ),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }
}
