import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_dimensions.dart';
import '../../app/theme/app_text_styles.dart';
import '../../core/localization/app_localizations.dart';
import '../../shared/models/mock_models.dart';
import '../../shared/widgets/care_bridge_button.dart';
import '../../shared/widgets/care_bridge_card.dart';
import 'medicine_order_models.dart';

/// Screen managing medicine ordering flow from a prescription:
/// Step 1: Select Medicines
/// Step 2: Order Summary
/// Step 3: Order Success
class MedicineOrderScreen extends StatefulWidget {
  final HealthRecordItem prescription;

  const MedicineOrderScreen({
    super.key,
    required this.prescription,
  });

  @override
  State<MedicineOrderScreen> createState() => _MedicineOrderScreenState();
}

class _MedicineOrderScreenState extends State<MedicineOrderScreen> {
  int _currentStep = 0; // 0: Select, 1: Summary, 2: Success
  late List<PrescriptionMedicine> _medicines;
  MedicineOrder? _confirmedOrder;

  @override
  void initState() {
    super.initState();
    _parseMedicines();
  }

  void _parseMedicines() {
    if (widget.prescription.details.isNotEmpty) {
      _medicines = widget.prescription.details.map((field) {
        return PrescriptionMedicine.fromDetail(field.label, field.value);
      }).toList();
    } else {
      // Fallback if prescription details list was empty
      _medicines = [
        PrescriptionMedicine(
          name: 'Paracetamol 500mg',
          dosage: '1 tablet',
          frequency: 'Twice daily',
          duration: '5 days',
          isSelected: true,
        ),
        PrescriptionMedicine(
          name: 'Cetirizine 10mg',
          dosage: '1 tablet',
          frequency: 'Once at bedtime',
          duration: '5 days',
          isSelected: true,
        ),
      ];
    }
  }

  List<PrescriptionMedicine> get _selectedMedicines =>
      _medicines.where((m) => m.isSelected).toList();

  void _confirmOrder() {
    final order = MedicineOrder(
      orderId: MedicineOrder.generateOrderId(),
      prescriptionId: widget.prescription.id,
      prescriptionTitle: widget.prescription.title,
      facility: widget.prescription.facility,
      items: _selectedMedicines,
      orderDate: DateTime.now(),
    );

    setState(() {
      _confirmedOrder = order;
      _currentStep = 2; // Move to Success
    });
  }

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context);

    String title;
    switch (_currentStep) {
      case 0:
        title = loc.selectMedicinesTitle;
        break;
      case 1:
        title = loc.reviewOrderTitle;
        break;
      case 2:
      default:
        title = loc.orderSuccessTitle;
        break;
    }

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text(title),
        automaticallyImplyLeading: _currentStep != 2,
        leading: _currentStep == 1
            ? IconButton(
                icon: const Icon(Icons.arrow_back_rounded),
                onPressed: () => setState(() => _currentStep = 0),
              )
            : null,
      ),
      body: SingleChildScrollView(
        padding: AppDimensions.screenPadding,
        child: _buildBody(loc),
      ),
    );
  }

  Widget _buildBody(AppLocalizations loc) {
    switch (_currentStep) {
      case 0:
        return _buildSelectionStep(loc);
      case 1:
        return _buildSummaryStep(loc);
      case 2:
      default:
        return _buildSuccessStep(loc);
    }
  }

  // Step 1: Select Medicines
  Widget _buildSelectionStep(AppLocalizations loc) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Prescription Info Card
        CareBridgeCard(
          title: widget.prescription.title,
          subtitle: '${widget.prescription.facility} • ${widget.prescription.date}',
          leadingIcon: Container(
            padding: const EdgeInsets.all(AppDimensions.space8),
            decoration: BoxDecoration(
              color: AppColors.primaryLight,
              borderRadius: AppDimensions.roundedSmall,
            ),
            child: const Icon(Icons.medication_rounded, color: AppColors.primary),
          ),
        ),
        const SizedBox(height: AppDimensions.space20),

        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              loc.selectMedicinesTitle,
              style: AppTextStyles.heading2,
            ),
            TextButton(
              onPressed: () {
                final allSelected = _medicines.every((m) => m.isSelected);
                setState(() {
                  for (final m in _medicines) {
                    m.isSelected = !allSelected;
                  }
                });
              },
              child: Text(
                _medicines.every((m) => m.isSelected) ? 'Deselect All' : 'Select All',
              ),
            ),
          ],
        ),
        const SizedBox(height: AppDimensions.space8),

        // Medicines Checklist
        Material(
          color: AppColors.surface,
          shape: RoundedRectangleBorder(
            borderRadius: AppDimensions.roundedMedium,
            side: const BorderSide(color: AppColors.borderLight),
          ),
          child: ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _medicines.length,
            separatorBuilder: (context, index) => const Divider(height: 1, indent: 56),
            itemBuilder: (context, index) {
              final med = _medicines[index];
              return CheckboxListTile(
                key: Key('medicine_checkbox_$index'),
                value: med.isSelected,
                activeColor: AppColors.primary,
                controlAffinity: ListTileControlAffinity.leading,
                title: Text(
                  med.name,
                  style: AppTextStyles.heading3.copyWith(fontSize: 15.0),
                ),
                subtitle: Text(
                  '${med.dosage} • ${med.frequency} • ${med.duration}',
                  style: AppTextStyles.bodySmall.copyWith(color: AppColors.textSecondary),
                ),
                onChanged: (val) {
                  setState(() {
                    med.isSelected = val ?? false;
                  });
                },
              );
            },
          ),
        ),
        const SizedBox(height: AppDimensions.space24),

        // Continue Button
        CareBridgeButton.primary(
          key: const Key('continue_to_summary_button'),
          label: loc.continueBtn,
          isFullWidth: true,
          onPressed: _selectedMedicines.isEmpty
              ? null
              : () => setState(() => _currentStep = 1),
        ),
      ],
    );
  }

  // Step 2: Review Order Summary
  Widget _buildSummaryStep(AppLocalizations loc) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          loc.reviewOrderTitle,
          style: AppTextStyles.heading2,
        ),
        const SizedBox(height: AppDimensions.space12),

        // Prescription & Facility Summary
        Container(
          width: double.infinity,
          padding: AppDimensions.cardPadding,
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: AppDimensions.roundedMedium,
            border: Border.all(color: AppColors.borderLight),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildSummaryRow('Prescription', widget.prescription.title),
              const Divider(height: 16),
              _buildSummaryRow('Prescription ID', widget.prescription.id),
              const Divider(height: 16),
              _buildSummaryRow(loc.pickupFacilityLabel, widget.prescription.facility),
            ],
          ),
        ),
        const SizedBox(height: AppDimensions.space20),

        Text(
          loc.medicinesCountLabel,
          style: AppTextStyles.heading2,
        ),
        const SizedBox(height: AppDimensions.space12),

        // Selected Medicines List
        Material(
          color: AppColors.surface,
          shape: RoundedRectangleBorder(
            borderRadius: AppDimensions.roundedMedium,
            side: const BorderSide(color: AppColors.borderLight),
          ),
          child: ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _selectedMedicines.length,
            separatorBuilder: (context, index) => const Divider(height: 1),
            itemBuilder: (context, index) {
              final med = _selectedMedicines[index];
              return Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: AppDimensions.space16,
                  vertical: AppDimensions.space12,
                ),
                child: Row(
                  children: [
                    const Icon(Icons.check_circle_rounded, color: AppColors.primary, size: 20),
                    const SizedBox(width: AppDimensions.space12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            med.name,
                            style: AppTextStyles.body.copyWith(fontWeight: FontWeight.w600),
                          ),
                          Text(
                            '${med.dosage} • ${med.frequency} (${med.duration})',
                            style: AppTextStyles.caption.copyWith(color: AppColors.textSecondary),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ),
        const SizedBox(height: AppDimensions.space24),

        // Confirm Order Button
        CareBridgeButton.primary(
          key: const Key('confirm_medicine_order_button'),
          label: loc.confirmOrderBtn,
          icon: Icons.check_circle_outline_rounded,
          isFullWidth: true,
          onPressed: _confirmOrder,
        ),
      ],
    );
  }

  // Step 3: Order Success
  Widget _buildSuccessStep(AppLocalizations loc) {
    final order = _confirmedOrder;
    if (order == null) return const SizedBox.shrink();

    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          const SizedBox(height: AppDimensions.space24),
          Container(
            padding: const EdgeInsets.all(AppDimensions.space20),
            decoration: BoxDecoration(
              color: AppColors.primaryLight,
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.check_circle_rounded,
              color: AppColors.primary,
              size: 56.0,
            ),
          ),
          const SizedBox(height: AppDimensions.space20),
          Text(
            loc.orderSuccessTitle,
            textAlign: TextAlign.center,
            style: AppTextStyles.heading1.copyWith(fontSize: 22.0),
          ),
          const SizedBox(height: AppDimensions.space8),
          Text(
            loc.orderSuccessSubtitle,
            textAlign: TextAlign.center,
            style: AppTextStyles.body.copyWith(color: AppColors.textSecondary),
          ),
          const SizedBox(height: AppDimensions.space24),

          // Order ID Card
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(AppDimensions.space16),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: AppDimensions.roundedMedium,
              border: Border.all(color: AppColors.primary.withValues(alpha: 0.3)),
            ),
            child: Column(
              children: [
                Text(
                  loc.orderIdLabel,
                  style: AppTextStyles.caption.copyWith(
                    color: AppColors.textSecondary,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: AppDimensions.space4),
                SelectableText(
                  order.orderId,
                  key: const Key('order_success_id'),
                  style: AppTextStyles.heading2.copyWith(
                    color: AppColors.primary,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 1.0,
                  ),
                ),
                const SizedBox(height: AppDimensions.space8),
                Text(
                  '${order.items.length} ${loc.medicinesCountLabel} • ${order.facility}',
                  textAlign: TextAlign.center,
                  style: AppTextStyles.bodySmall.copyWith(color: AppColors.textSecondary),
                ),
              ],
            ),
          ),
          const SizedBox(height: AppDimensions.space32),

          // Back to Records Button
          CareBridgeButton.primary(
            key: const Key('back_to_records_button'),
            label: loc.backToRecordsBtn,
            isFullWidth: true,
            onPressed: () => Navigator.of(context).pop(),
          ),
        ],
      ),
    );
  }

  Widget _buildSummaryRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: AppTextStyles.bodySmall.copyWith(color: AppColors.textSecondary),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: Text(
            value,
            textAlign: TextAlign.end,
            style: AppTextStyles.body.copyWith(fontWeight: FontWeight.w600),
          ),
        ),
      ],
    );
  }
}
