import 'package:flutter/material.dart';
import 'package:care_bridge/app/theme/app_colors.dart';
import 'package:care_bridge/app/theme/app_dimensions.dart';
import 'package:care_bridge/app/theme/app_text_styles.dart';
import 'package:care_bridge/shared/widgets/care_bridge_button.dart';
import 'package:care_bridge/shared/widgets/care_bridge_card.dart';
import 'booking_flow_wrapper.dart';

class AppointmentSuccessScreen extends StatelessWidget {
  const AppointmentSuccessScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = BookingScope.of(context);
    final appointment = controller.lastBookedAppointment;

    final formattedDate = appointment != null
        ? '${appointment.appointmentDate.day.toString().padLeft(2, '0')}/${appointment.appointmentDate.month.toString().padLeft(2, '0')}/${appointment.appointmentDate.year}'
        : '';

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Padding(
          padding: AppDimensions.screenPadding,
          child: Column(
            children: [
              const Spacer(),

              // Success Icon Container
              Container(
                width: 90.0,
                height: 90.0,
                decoration: const BoxDecoration(
                  color: AppColors.successLight,
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.check_circle_rounded,
                  color: AppColors.success,
                  size: 64.0,
                ),
              ),
              const SizedBox(height: AppDimensions.space20),

              Text(
                'Appointment Confirmed!',
                style: AppTextStyles.heading1.copyWith(
                  color: AppColors.success,
                  fontSize: 24.0,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: AppDimensions.space8),

              if (appointment != null) ...[
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14.0, vertical: 6.0),
                  decoration: BoxDecoration(
                    color: AppColors.primaryLight,
                    borderRadius: BorderRadius.circular(16.0),
                  ),
                  child: Text(
                    'Booking ID: ${appointment.id}',
                    style: AppTextStyles.bodySmall.copyWith(
                      color: AppColors.primary,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                const SizedBox(height: AppDimensions.space20),

                CareBridgeCard(
                  title: 'Booking Details',
                  leadingIcon: const Icon(Icons.receipt_long_rounded, color: AppColors.primary),
                  child: Column(
                    children: [
                      _buildSummaryRow('Hospital', appointment.hospitalName),
                      const Divider(height: 16),
                      _buildSummaryRow('Doctor', '${appointment.doctorName} (${appointment.specialization})'),
                      const Divider(height: 16),
                      _buildSummaryRow('Date & Time', '$formattedDate • ${appointment.appointmentTime}'),
                      const Divider(height: 16),
                      _buildSummaryRow('Status', appointment.status, valueColor: AppColors.success),
                    ],
                  ),
                ),
              ],

              const SizedBox(height: AppDimensions.space20),

              // Prototype Disclaimer Box
              Container(
                padding: const EdgeInsets.all(AppDimensions.space12),
                decoration: BoxDecoration(
                  color: AppColors.accentLight.withValues(alpha: 0.5),
                  borderRadius: AppDimensions.roundedMedium,
                  border: Border.all(color: AppColors.accent.withValues(alpha: 0.3)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.info_outline_rounded, color: AppColors.accent),
                    const SizedBox(width: AppDimensions.space10),
                    Expanded(
                      child: Text(
                        'Demo Notice: This appointment is registered in prototype mode for CareBridge demonstration.',
                        style: AppTextStyles.caption.copyWith(color: AppColors.textPrimary),
                      ),
                    ),
                  ],
                ),
              ),

              const Spacer(),

              // Done Button returning to Home/Appointments
              CareBridgeButton.primary(
                label: 'Done',
                isFullWidth: true,
                onPressed: () {
                  Navigator.of(context).popUntil((route) => route.isFirst);
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSummaryRow(String label, String value, {Color? valueColor}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: AppTextStyles.caption.copyWith(color: AppColors.textSecondary),
        ),
        Expanded(
          child: Text(
            value,
            textAlign: TextAlign.end,
            style: AppTextStyles.bodySmall.copyWith(
              fontWeight: FontWeight.bold,
              color: valueColor ?? AppColors.textPrimary,
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ),
      ],
    );
  }
}
