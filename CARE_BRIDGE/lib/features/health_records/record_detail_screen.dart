import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_dimensions.dart';
import '../../app/theme/app_text_styles.dart';
import '../../core/localization/app_localizations.dart';
import '../../shared/models/mock_models.dart';
import '../../shared/widgets/care_bridge_button.dart';
import '../../shared/widgets/care_bridge_card.dart';
import '../../shared/widgets/care_bridge_status_chip.dart';
import 'medicine_order_screen.dart';

/// Dedicated Health Record Detail Screen (Step 4)
/// Displays complete record metadata, clinical summary, structured non-diagnostic
/// observations, document preview placeholder, and mock action buttons.
class RecordDetailScreen extends StatelessWidget {
  final HealthRecordItem record;

  const RecordDetailScreen({
    super.key,
    required this.record,
  });

  void _showFutureFeatureMessage(BuildContext context, String message) {
    ScaffoldMessenger.of(context).hideCurrentSnackBar();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        duration: const Duration(seconds: 3),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  IconData _categoryIcon(HealthRecordCategory category) {
    switch (category) {
      case HealthRecordCategory.medicalRecords:
        return Icons.medical_services_rounded;
      case HealthRecordCategory.labReports:
        return Icons.biotech_rounded;
      case HealthRecordCategory.prescriptions:
        return Icons.medication_rounded;
      case HealthRecordCategory.vaccinations:
        return Icons.vaccines_rounded;
      case HealthRecordCategory.otherDocuments:
        return Icons.description_rounded;
    }
  }

  String _localizedCategoryName(HealthRecordCategory category, AppLocalizations loc) {
    switch (category) {
      case HealthRecordCategory.medicalRecords:
        return loc.categoryMedicalRecords;
      case HealthRecordCategory.labReports:
        return loc.categoryLabReports;
      case HealthRecordCategory.prescriptions:
        return loc.categoryPrescriptions;
      case HealthRecordCategory.vaccinations:
        return loc.categoryVaccinations;
      case HealthRecordCategory.otherDocuments:
        return loc.categoryOtherDocuments;
    }
  }

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context);
    final categoryName = _localizedCategoryName(record.category, loc);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text(loc.recordDetailsTitle),
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: AppDimensions.screenPadding,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header Card with Category & Title
            _buildHeaderCard(context, loc, categoryName),

            const SizedBox(height: AppDimensions.space16),

            // Metadata Card (Facility, Doctor, Date)
            _buildMetadataCard(context, loc),

            const SizedBox(height: AppDimensions.space16),

            // Summary Section
            _buildSummarySection(loc),

            if (record.details.isNotEmpty) ...[
              const SizedBox(height: AppDimensions.space16),
              _buildStructuredDetailsSection(loc),
            ],

            const SizedBox(height: AppDimensions.space16),

            // Document Viewer Placeholder
            _buildDocumentViewerPlaceholder(loc),

            const SizedBox(height: AppDimensions.space20),

            // Action Buttons (Download / Share / Print)
            _buildActionButtons(context, loc),

            const SizedBox(height: AppDimensions.space16),

            // Non-diagnostic disclaimer banner
            _buildDisclaimerBanner(loc),

            const SizedBox(height: AppDimensions.space32),
          ],
        ),
      ),
    );
  }

  Widget _buildHeaderCard(BuildContext context, AppLocalizations loc, String categoryName) {
    final iconData = _categoryIcon(record.category);

    return Container(
      width: double.infinity,
      padding: AppDimensions.cardPadding,
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: AppDimensions.roundedMedium,
        border: Border.all(color: AppColors.borderLight),
        boxShadow: const [
          BoxShadow(
            color: Color(0x0A0F172A),
            blurRadius: 6,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: AppColors.primaryLight,
                  borderRadius: AppDimensions.roundedSmall,
                ),
                child: Icon(
                  iconData,
                  color: AppColors.primary,
                  size: AppDimensions.iconMedium,
                ),
              ),
              const SizedBox(width: AppDimensions.space12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      categoryName,
                      style: AppTextStyles.label.copyWith(
                        color: AppColors.primary,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: AppDimensions.space4),
                    CareBridgeStatusChip(
                      status: record.status,
                      isDense: true,
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: AppDimensions.space12),
          Text(
            record.title,
            style: AppTextStyles.heading2.copyWith(fontSize: 20.0),
          ),
        ],
      ),
    );
  }

  Widget _buildMetadataCard(BuildContext context, AppLocalizations loc) {
    return CareBridgeCard(
      title: loc.facilityLabel,
      padding: AppDimensions.cardPadding,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildInfoRow(
            icon: Icons.calendar_today_rounded,
            label: loc.dateLabel,
            value: record.date,
          ),
          const Divider(height: AppDimensions.space20, color: AppColors.borderLight),
          _buildInfoRow(
            icon: Icons.local_hospital_rounded,
            label: loc.facilityLabel,
            value: record.facility,
          ),
          if (record.doctor != null) ...[
            const Divider(height: AppDimensions.space20, color: AppColors.borderLight),
            _buildInfoRow(
              icon: Icons.person_outline_rounded,
              label: loc.doctorLabel,
              value: record.doctor!,
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildInfoRow({
    required IconData icon,
    required String label,
    required String value,
  }) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: AppDimensions.iconSmall, color: AppColors.textSecondary),
        const SizedBox(width: AppDimensions.space12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: AppTextStyles.caption.copyWith(color: AppColors.textSecondary),
              ),
              const SizedBox(height: AppDimensions.space2),
              Text(
                value,
                style: AppTextStyles.bodyLarge.copyWith(fontWeight: FontWeight.w500),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildSummarySection(AppLocalizations loc) {
    return CareBridgeCard(
      title: loc.clinicalSummaryTitle,
      padding: AppDimensions.cardPadding,
      child: Text(
        record.summary,
        style: AppTextStyles.body.copyWith(
          color: AppColors.textPrimary,
          height: 1.5,
        ),
      ),
    );
  }

  Widget _buildStructuredDetailsSection(AppLocalizations loc) {
    return CareBridgeCard(
      title: loc.structuredDetailsTitle,
      padding: AppDimensions.cardPadding,
      child: Column(
        children: record.details.map((field) {
          return Padding(
            padding: const EdgeInsets.only(bottom: AppDimensions.space12),
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.all(AppDimensions.space12),
              decoration: BoxDecoration(
                color: AppColors.background,
                borderRadius: AppDimensions.roundedSmall,
                border: Border.all(color: AppColors.borderLight),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    field.label,
                    style: AppTextStyles.body.copyWith(
                      fontWeight: FontWeight.w600,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: AppDimensions.space4),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        field.value,
                        style: AppTextStyles.bodyLarge.copyWith(
                          color: AppColors.primary,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      if (field.referenceRange != null) ...[
                        const SizedBox(height: AppDimensions.space2),
                        Text(
                          'Ref: ${field.referenceRange!}',
                          style: AppTextStyles.caption.copyWith(
                            color: AppColors.textSecondary,
                          ),
                        ),
                      ],
                    ],
                  ),
                ],
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildDocumentViewerPlaceholder(AppLocalizations loc) {
    return Container(
      width: double.infinity,
      padding: AppDimensions.cardPadding,
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: AppDimensions.roundedMedium,
        border: Border.all(color: AppColors.borderLight, width: 1.2),
      ),
      child: Column(
        children: [
          Row(
            children: [
              const Icon(
                Icons.picture_as_pdf_rounded,
                color: AppColors.secondary,
                size: AppDimensions.iconMedium,
              ),
              const SizedBox(width: AppDimensions.space8),
              Text(
                loc.documentPreviewTitle,
                style: AppTextStyles.heading3,
              ),
            ],
          ),
          const SizedBox(height: AppDimensions.space16),
          Container(
            height: 140,
            width: double.infinity,
            decoration: BoxDecoration(
              color: AppColors.background,
              borderRadius: AppDimensions.roundedSmall,
              border: Border.all(
                color: AppColors.borderLight,
                style: BorderStyle.solid,
              ),
            ),
            child: Center(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: AppDimensions.space16),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(
                      Icons.file_present_rounded,
                      size: AppDimensions.iconLarge,
                      color: AppColors.textSecondary,
                    ),
                    const SizedBox(height: AppDimensions.space8),
                    Text(
                      loc.documentPreviewPlaceholder,
                      textAlign: TextAlign.center,
                      style: AppTextStyles.bodySmall.copyWith(
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButtons(BuildContext context, AppLocalizations loc) {
    final isPrescription = record.category == HealthRecordCategory.prescriptions;

    return Column(
      children: [
        if (isPrescription) ...[
          CareBridgeButton.primary(
            key: const Key('order_medicines_button'),
            label: loc.orderMedicinesBtn,
            icon: Icons.shopping_bag_outlined,
            isFullWidth: true,
            onPressed: () {
              Navigator.of(context).push(
                MaterialPageRoute<void>(
                  builder: (_) => MedicineOrderScreen(prescription: record),
                ),
              );
            },
          ),
          const SizedBox(height: AppDimensions.space12),
        ],
        Row(
          children: [
            Expanded(
              child: CareBridgeButton(
                label: loc.downloadBtn,
                icon: Icons.download_rounded,
                variant: CareBridgeButtonVariant.secondary,
                onPressed: () => _showFutureFeatureMessage(
                  context,
                  loc.featureAvailableFutureMsg,
                ),
              ),
            ),
            const SizedBox(width: AppDimensions.space12),
            Expanded(
              child: CareBridgeButton(
                label: loc.shareBtn,
                icon: Icons.share_rounded,
                variant: CareBridgeButtonVariant.outlined,
                onPressed: () => _showFutureFeatureMessage(
                  context,
                  loc.featureAvailableFutureMsg,
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildDisclaimerBanner(AppLocalizations loc) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppDimensions.space12),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: AppDimensions.roundedSmall,
        border: Border.all(color: AppColors.borderLight),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(
            Icons.info_outline_rounded,
            size: AppDimensions.iconSmall,
            color: AppColors.textSecondary,
          ),
          const SizedBox(width: AppDimensions.space8),
          Expanded(
            child: Text(
              loc.nonDiagnosticDisclaimer,
              style: AppTextStyles.caption.copyWith(
                color: AppColors.textSecondary,
                height: 1.4,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
