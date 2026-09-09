import 'package:flutter/material.dart';
import '../../../app/theme/app_colors.dart';
import '../../../core/localization/app_localizations.dart';
import '../../appointments/domain/doctor.dart';

class TeleconsultationDoctorDetailModal extends StatelessWidget {
  final Doctor doctor;
  final VoidCallback onBookPressed;

  const TeleconsultationDoctorDetailModal({
    super.key,
    required this.doctor,
    required this.onBookPressed,
  });

  static void show(
    BuildContext context, {
    required Doctor doctor,
    required VoidCallback onBookPressed,
  }) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => TeleconsultationDoctorDetailModal(
        doctor: doctor,
        onBookPressed: onBookPressed,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context);

    return Container(
      decoration: const BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
      child: SafeArea(
        top: false,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Center(
              child: Container(
                width: 44,
                height: 4,
                decoration: BoxDecoration(
                  color: AppColors.border,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 20),
            Row(
              children: [
                CircleAvatar(
                  radius: 36,
                  backgroundColor: AppColors.primaryLight,
                  child: const Icon(
                    Icons.person_rounded,
                    size: 40,
                    color: AppColors.primary,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        doctor.name,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w700,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        doctor.specialization,
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: AppColors.primary,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: doctor.isAvailable
                              ? AppColors.successLight
                              : AppColors.surfaceMuted,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: doctor.isAvailable
                                ? AppColors.success
                                : AppColors.border,
                            width: 0.8,
                          ),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            CircleAvatar(
                              radius: 3.5,
                              backgroundColor: doctor.isAvailable
                                  ? AppColors.success
                                  : AppColors.textMuted,
                            ),
                            const SizedBox(width: 5),
                            Text(
                              doctor.isAvailable
                                  ? loc.doctorAvailable
                                  : loc.doctorOnLeave,
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                                color: doctor.isAvailable
                                    ? AppColors.success
                                    : AppColors.textMuted,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),
            const Divider(color: AppColors.divider, height: 1),
            const SizedBox(height: 16),
            _buildDetailRow(
              icon: Icons.school_outlined,
              label: loc.qualificationLabel,
              value: doctor.qualification,
            ),
            const SizedBox(height: 12),
            _buildDetailRow(
              icon: Icons.work_outline_rounded,
              label: loc.experienceLabel,
              value: '${doctor.experienceYears} ${loc.experienceYears}',
            ),
            const SizedBox(height: 12),
            _buildDetailRow(
              icon: Icons.videocam_outlined,
              label: loc.consultationTypeTitle,
              value: '${loc.consultationTypeVideo}, ${loc.consultationTypeAudio}, ${loc.consultationTypeChat}',
            ),
            const SizedBox(height: 28),
            ElevatedButton.icon(
              onPressed: doctor.isAvailable ? onBookPressed : null,
              icon: const Icon(Icons.calendar_month_rounded, size: 20),
              label: Text(
                loc.bookTeleconsultationBtn,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                ),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                elevation: 0,
              ),
            ),
            const SizedBox(height: 8),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow({
    required IconData icon,
    required String label,
    required String value,
  }) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 20, color: AppColors.textMuted),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: const TextStyle(
                  fontSize: 12,
                  color: AppColors.textMuted,
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                value,
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimary,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
