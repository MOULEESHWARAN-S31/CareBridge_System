import 'package:flutter/material.dart';
import 'package:care_bridge/app/theme/app_colors.dart';
import 'package:care_bridge/app/theme/app_dimensions.dart';
import 'package:care_bridge/app/theme/app_text_styles.dart';
import 'package:care_bridge/shared/widgets/care_bridge_button.dart';
import 'package:care_bridge/shared/widgets/care_bridge_state_widgets.dart';
import 'booking_flow_wrapper.dart';

class AppointmentDateTimeScreen extends StatefulWidget {
  final VoidCallback onNext;
  final VoidCallback onBack;

  const AppointmentDateTimeScreen({
    super.key,
    required this.onNext,
    required this.onBack,
  });

  @override
  State<AppointmentDateTimeScreen> createState() => _AppointmentDateTimeScreenState();
}

class _AppointmentDateTimeScreenState extends State<AppointmentDateTimeScreen> {
  @override
  void initState() {
    super.initState();
    // Pre-select today if no date selected yet
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final controller = BookingScope.of(context);
      if (controller.selectedDate == null) {
        controller.selectDate(DateTime.now());
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final controller = BookingScope.of(context);
    final doctorName = controller.selectedDoctor?.name ?? '';
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);

    // Generate upcoming 14 days list for horizontal date picker
    final availableDates = List.generate(14, (i) => today.add(Duration(days: i)));

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Book Appointment'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded),
          onPressed: widget.onBack,
        ),
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Progress Header
            _buildProgressHeader('Step 4 of 5', 'Select Date & Time for $doctorName'),
            Expanded(
              child: SingleChildScrollView(
                padding: AppDimensions.screenPadding,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // 1. Horizontal Date Picker
                    Text(
                      'Select Date',
                      style: AppTextStyles.heading3,
                    ),
                    const SizedBox(height: AppDimensions.space10),
                    SizedBox(
                      height: 80.0,
                      child: ListView.separated(
                        scrollDirection: Axis.horizontal,
                        itemCount: availableDates.length,
                        separatorBuilder: (context, index) => const SizedBox(width: AppDimensions.space8),
                        itemBuilder: (context, index) {
                          final date = availableDates[index];
                          final isSelected = controller.selectedDate != null &&
                              controller.selectedDate!.year == date.year &&
                              controller.selectedDate!.month == date.month &&
                              controller.selectedDate!.day == date.day;

                          final dayName = _getDayAbbreviation(date.weekday);
                          final dayNum = date.day.toString();
                          final monthName = _getMonthAbbreviation(date.month);

                          return InkWell(
                            onTap: () => controller.selectDate(date),
                            borderRadius: AppDimensions.roundedMedium,
                            child: Container(
                              width: 68.0,
                              padding: const EdgeInsets.symmetric(vertical: 8.0),
                              decoration: BoxDecoration(
                                color: isSelected ? AppColors.primary : AppColors.surface,
                                borderRadius: AppDimensions.roundedMedium,
                                border: Border.all(
                                  color: isSelected ? AppColors.primary : AppColors.border,
                                  width: isSelected ? 2.0 : 1.0,
                                ),
                              ),
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Text(
                                    dayName,
                                    style: AppTextStyles.caption.copyWith(
                                      color: isSelected ? AppColors.textOnPrimary : AppColors.textSecondary,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                  Text(
                                    dayNum,
                                    style: AppTextStyles.heading2.copyWith(
                                      color: isSelected ? AppColors.textOnPrimary : AppColors.textPrimary,
                                      fontSize: 18.0,
                                    ),
                                  ),
                                  Text(
                                    monthName,
                                    style: AppTextStyles.caption.copyWith(
                                      color: isSelected ? AppColors.textOnPrimary : AppColors.textMuted,
                                      fontSize: 10.0,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                    const SizedBox(height: AppDimensions.space24),

                    // 2. Select Time Slot
                    Text(
                      'Available Time Slots',
                      style: AppTextStyles.heading3,
                    ),
                    const SizedBox(height: AppDimensions.space10),
                    if (controller.isLoadingSlots)
                      const CareBridgeLoading(message: 'Loading time slots...')
                    else if (controller.slots.isEmpty)
                      const CareBridgeEmptyState(
                        title: 'No Slots Available',
                        description: 'No available slots for the selected date. Please pick another date.',
                        icon: Icons.event_busy_outlined,
                      )
                    else
                      GridView.builder(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 2,
                          childAspectRatio: 2.6,
                          crossAxisSpacing: AppDimensions.space10,
                          mainAxisSpacing: AppDimensions.space10,
                        ),
                        itemCount: controller.slots.length,
                        itemBuilder: (context, index) {
                          final slot = controller.slots[index];
                          final isSelected = controller.selectedSlot == slot;
                          final isAvailable = slot.isAvailable;

                          return InkWell(
                            onTap: isAvailable ? () => controller.selectSlot(slot) : null,
                            borderRadius: AppDimensions.roundedMedium,
                            child: Container(
                              decoration: BoxDecoration(
                                color: !isAvailable
                                    ? AppColors.surface.withValues(alpha: 0.4)
                                    : isSelected
                                        ? AppColors.primary
                                        : AppColors.surface,
                                borderRadius: AppDimensions.roundedMedium,
                                border: Border.all(
                                  color: !isAvailable
                                      ? AppColors.borderLight
                                      : isSelected
                                          ? AppColors.primary
                                          : AppColors.border,
                                ),
                              ),
                              alignment: Alignment.center,
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(
                                    Icons.access_time_rounded,
                                    size: 16.0,
                                    color: !isAvailable
                                        ? AppColors.textMuted
                                        : isSelected
                                            ? AppColors.textOnPrimary
                                            : AppColors.primary,
                                  ),
                                  const SizedBox(width: 6.0),
                                  Text(
                                    slot.startTime,
                                    style: AppTextStyles.bodySmall.copyWith(
                                      fontWeight: FontWeight.bold,
                                      color: !isAvailable
                                          ? AppColors.textMuted
                                          : isSelected
                                              ? AppColors.textOnPrimary
                                              : AppColors.textPrimary,
                                      decoration: !isAvailable ? TextDecoration.lineThrough : null,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
                  ],
                ),
              ),
            ),
            // Action Footer
            Container(
              padding: AppDimensions.screenPadding,
              decoration: const BoxDecoration(
                color: AppColors.surface,
                border: Border(top: BorderSide(color: AppColors.borderLight)),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: CareBridgeButton.outlined(
                      label: 'Back',
                      onPressed: widget.onBack,
                    ),
                  ),
                  const SizedBox(width: AppDimensions.space12),
                  Expanded(
                    flex: 2,
                    child: CareBridgeButton.primary(
                      label: 'Review Summary',
                      onPressed: (controller.selectedDate != null && controller.selectedSlot != null)
                          ? widget.onNext
                          : null,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _getDayAbbreviation(int weekday) {
    switch (weekday) {
      case DateTime.monday:
        return 'MON';
      case DateTime.tuesday:
        return 'TUE';
      case DateTime.wednesday:
        return 'WED';
      case DateTime.thursday:
        return 'THU';
      case DateTime.friday:
        return 'FRI';
      case DateTime.saturday:
        return 'SAT';
      case DateTime.sunday:
        return 'SUN';
      default:
        return '';
    }
  }

  String _getMonthAbbreviation(int month) {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return months[month - 1];
  }

  Widget _buildProgressHeader(String stepText, String titleText) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppDimensions.space16),
      color: AppColors.surface,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            stepText.toUpperCase(),
            style: AppTextStyles.label.copyWith(
              color: AppColors.primary,
              fontWeight: FontWeight.bold,
              letterSpacing: 1.1,
            ),
          ),
          const SizedBox(height: 2.0),
          Text(
            titleText,
            style: AppTextStyles.heading2.copyWith(fontSize: 18.0),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }
}
