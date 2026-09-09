import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_dimensions.dart';
import '../../app/theme/app_text_styles.dart';
import '../../core/localization/app_localizations.dart';
import '../../shared/models/mock_models.dart';
import '../../shared/services/mock_data_service.dart';
import '../../shared/widgets/care_bridge_button.dart';
import 'document_picker_service.dart';

/// Modal dialog for manually creating and saving a Lab Report entry.
class ManualLabEntryDialog extends StatefulWidget {
  final VoidCallback onSaved;
  final DocumentPickerService? documentPickerOverride;

  const ManualLabEntryDialog({
    super.key,
    required this.onSaved,
    this.documentPickerOverride,
  });

  static Future<bool?> show(
    BuildContext context, {
    required VoidCallback onSaved,
    DocumentPickerService? documentPickerOverride,
  }) {
    return showDialog<bool>(
      context: context,
      barrierDismissible: true,
      builder: (_) => ManualLabEntryDialog(
        onSaved: onSaved,
        documentPickerOverride: documentPickerOverride,
      ),
    );
  }

  @override
  State<ManualLabEntryDialog> createState() => _ManualLabEntryDialogState();
}

class _ManualLabEntryDialogState extends State<ManualLabEntryDialog> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _categoryController = TextEditingController();
  final _facilityController = TextEditingController();
  final _doctorController = TextEditingController();
  final _summaryController = TextEditingController();
  final _testValueController = TextEditingController();
  DateTime _selectedDate = DateTime.now();

  late final DocumentPickerService _documentPicker;
  SelectedDocument? _attachedDocument;
  String? _documentErrorMessage;

  @override
  void initState() {
    super.initState();
    _documentPicker =
        widget.documentPickerOverride ?? const PrototypeDocumentPickerService();
  }

  @override
  void dispose() {
    _titleController.dispose();
    _categoryController.dispose();
    _facilityController.dispose();
    _doctorController.dispose();
    _summaryController.dispose();
    _testValueController.dispose();
    super.dispose();
  }

  String _formatDate(DateTime date) {
    final months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    final dayStr = date.day.toString().padLeft(2, '0');
    final monthStr = months[date.month - 1];
    return '$dayStr $monthStr ${date.year}';
  }

  Future<void> _selectDate(BuildContext context) async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: DateTime(2000),
      lastDate: DateTime.now(),
    );
    if (picked != null && picked != _selectedDate) {
      setState(() {
        _selectedDate = picked;
      });
    }
  }

  Future<void> _pickDocument(AppLocalizations loc) async {
    final doc = await _documentPicker.pickDocument(context);
    if (doc == null) return;

    // 1. Validate file format (PDF, JPG, JPEG, PNG)
    if (!DocumentPickerService.isSupportedType(doc.name)) {
      setState(() {
        _documentErrorMessage = loc.fileNotSupported;
      });
      return;
    }

    // 2. Validate file size (10 MB max)
    if (!DocumentPickerService.isAllowedSize(doc.sizeBytes)) {
      setState(() {
        _documentErrorMessage = loc.fileTooLarge;
      });
      return;
    }

    setState(() {
      _attachedDocument = doc;
      _documentErrorMessage = null;
    });

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('${doc.name}: ${loc.documentSelectedMsg}'),
          duration: const Duration(seconds: 2),
        ),
      );
    }
  }

  void _saveEntry(AppLocalizations loc) {
    if (!(_formKey.currentState?.validate() ?? false)) {
      return;
    }

    final newRecord = HealthRecordItem(
      id: 'manual_lab_${DateTime.now().millisecondsSinceEpoch}',
      title: _titleController.text.trim(),
      category: HealthRecordCategory.labReports,
      facility: _facilityController.text.trim(),
      doctor: _doctorController.text.trim().isNotEmpty
          ? _doctorController.text.trim()
          : null,
      date: _formatDate(_selectedDate),
      summary: _summaryController.text.trim().isNotEmpty
          ? _summaryController.text.trim()
          : 'Manually entered lab test report.',
      details: [
        if (_categoryController.text.trim().isNotEmpty)
          RecordDetailField(
            label: loc.testCategoryLabel,
            value: _categoryController.text.trim(),
          ),
        if (_testValueController.text.trim().isNotEmpty)
          RecordDetailField(
            label: 'Result Value',
            value: _testValueController.text.trim(),
          ),
      ],
      isManualEntry: true,
      hasDocument: _attachedDocument != null,
      attachmentName: _attachedDocument?.name,
      attachmentPath: _attachedDocument?.path,
      attachmentType: _attachedDocument?.type,
      attachmentSize: _attachedDocument?.sizeBytes,
    );

    MockDataService.instance.addHealthRecord(newRecord);
    widget.onSaved();
    Navigator.of(context).pop(true);
  }

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context);

    return Dialog(
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: AppDimensions.roundedLarge,
      ),
      insetPadding: const EdgeInsets.symmetric(
        horizontal: AppDimensions.space16,
        vertical: AppDimensions.space24,
      ),
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 480),
        child: Padding(
          padding: const EdgeInsets.all(AppDimensions.space20),
          child: SingleChildScrollView(
            child: Form(
              key: _formKey,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          loc.addLabReport,
                          style: AppTextStyles.heading2,
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close_rounded),
                        onPressed: () => Navigator.of(context).pop(false),
                      ),
                    ],
                  ),
                  const SizedBox(height: AppDimensions.space4),
                  Text(
                    loc.manualEntrySubtitle,
                    style: AppTextStyles.bodySmall,
                  ),
                  const SizedBox(height: AppDimensions.space16),

                  // Report Title
                  TextFormField(
                    key: const Key('manual_lab_title_field'),
                    controller: _titleController,
                    decoration: InputDecoration(
                      labelText: '${loc.reportTitleLabel} *',
                      hintText: loc.reportTitleHint,
                      border: const OutlineInputBorder(
                        borderRadius: AppDimensions.roundedMedium,
                      ),
                    ),
                    validator: (val) {
                      if (val == null || val.trim().isEmpty) {
                        return loc.titleRequired;
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: AppDimensions.space12),

                  // Test Category (Optional)
                  TextFormField(
                    key: const Key('manual_lab_category_field'),
                    controller: _categoryController,
                    decoration: InputDecoration(
                      labelText: loc.testCategoryLabel,
                      hintText: loc.testCategoryHint,
                      border: const OutlineInputBorder(
                        borderRadius: AppDimensions.roundedMedium,
                      ),
                    ),
                  ),
                  const SizedBox(height: AppDimensions.space12),

                  // Facility Name
                  TextFormField(
                    key: const Key('manual_lab_facility_field'),
                    controller: _facilityController,
                    decoration: InputDecoration(
                      labelText: '${loc.facilityLabel} *',
                      hintText: loc.facilityHint,
                      border: const OutlineInputBorder(
                        borderRadius: AppDimensions.roundedMedium,
                      ),
                    ),
                    validator: (val) {
                      if (val == null || val.trim().isEmpty) {
                        return loc.facilityRequired;
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: AppDimensions.space12),

                  // Doctor Name (Optional)
                  TextFormField(
                    key: const Key('manual_lab_doctor_field'),
                    controller: _doctorController,
                    decoration: InputDecoration(
                      labelText: loc.doctorLabel,
                      hintText: loc.doctorHint,
                      border: const OutlineInputBorder(
                        borderRadius: AppDimensions.roundedMedium,
                      ),
                    ),
                  ),
                  const SizedBox(height: AppDimensions.space12),

                  // Date Picker Field
                  InkWell(
                    key: const Key('manual_lab_date_picker'),
                    onTap: () => _selectDate(context),
                    borderRadius: AppDimensions.roundedMedium,
                    child: InputDecorator(
                      decoration: InputDecoration(
                        labelText: '${loc.dateLabel} *',
                        border: const OutlineInputBorder(
                          borderRadius: AppDimensions.roundedMedium,
                        ),
                        suffixIcon: const Icon(Icons.calendar_today_rounded),
                      ),
                      child: Text(
                        _formatDate(_selectedDate),
                        style: AppTextStyles.body,
                      ),
                    ),
                  ),
                  const SizedBox(height: AppDimensions.space12),

                  // Result / Summary (Optional)
                  TextFormField(
                    key: const Key('manual_lab_summary_field'),
                    controller: _summaryController,
                    maxLines: 2,
                    decoration: InputDecoration(
                      labelText: loc.clinicalSummaryTitle,
                      hintText: loc.clinicalSummaryHint,
                      border: const OutlineInputBorder(
                        borderRadius: AppDimensions.roundedMedium,
                      ),
                    ),
                  ),
                  const SizedBox(height: AppDimensions.space12),

                  // Key Result Field (Optional)
                  TextFormField(
                    key: const Key('manual_lab_result_field'),
                    controller: _testValueController,
                    decoration: InputDecoration(
                      labelText: loc.testResultLabel,
                      hintText: loc.testResultHint,
                      border: const OutlineInputBorder(
                        borderRadius: AppDimensions.roundedMedium,
                      ),
                    ),
                  ),
                  const SizedBox(height: AppDimensions.space16),

                  // Attached Document Section
                  Text(
                    loc.attachedDocumentLabel,
                    style: AppTextStyles.body.copyWith(fontWeight: FontWeight.w600),
                  ),
                  const SizedBox(height: AppDimensions.space8),
                  if (_attachedDocument == null)
                    Container(
                      key: const Key('document_upload_area'),
                      width: double.infinity,
                      padding: const EdgeInsets.symmetric(
                        horizontal: AppDimensions.space16,
                        vertical: AppDimensions.space20,
                      ),
                      decoration: BoxDecoration(
                        color: AppColors.background,
                        borderRadius: AppDimensions.roundedMedium,
                        border: Border.all(
                          color: _documentErrorMessage != null
                              ? AppColors.emergency
                              : AppColors.borderLight,
                          width: 1.2,
                        ),
                      ),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(
                            Icons.description_outlined,
                            size: 36.0,
                            color: AppColors.textSecondary,
                          ),
                          const SizedBox(height: AppDimensions.space8),
                          Text(
                            loc.noDocumentSelected,
                            style: AppTextStyles.bodySmall.copyWith(
                              color: AppColors.textSecondary,
                            ),
                          ),
                          const SizedBox(height: AppDimensions.space12),
                          ElevatedButton.icon(
                            key: const Key('upload_document_button'),
                            onPressed: () => _pickDocument(loc),
                            icon: const Icon(Icons.upload_file_rounded, size: 18.0),
                            label: Text(loc.uploadDocumentBtn),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.primary,
                              foregroundColor: AppColors.textOnPrimary,
                              shape: const RoundedRectangleBorder(
                                borderRadius: AppDimensions.roundedMedium,
                              ),
                            ),
                          ),
                        ],
                      ),
                    )
                  else
                    Container(
                      key: const Key('selected_document_card'),
                      width: double.infinity,
                      padding: const EdgeInsets.all(AppDimensions.space12),
                      decoration: BoxDecoration(
                        color: AppColors.primaryLight.withValues(alpha: 0.4),
                        borderRadius: AppDimensions.roundedMedium,
                        border: Border.all(
                          color: AppColors.primary.withValues(alpha: 0.3),
                        ),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Icon(
                                _attachedDocument!.type == 'pdf'
                                    ? Icons.picture_as_pdf_rounded
                                    : Icons.image_rounded,
                                color: _attachedDocument!.type == 'pdf'
                                    ? AppColors.emergency
                                    : AppColors.primary,
                                size: 28.0,
                              ),
                              const SizedBox(width: AppDimensions.space10),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      _attachedDocument!.name,
                                      key: const Key('selected_document_name'),
                                      style: AppTextStyles.body.copyWith(
                                        fontWeight: FontWeight.w600,
                                      ),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                    Text(
                                      '${_attachedDocument!.type.toUpperCase()} • ${_attachedDocument!.sizeFormatted}',
                                      style: AppTextStyles.caption.copyWith(
                                        color: AppColors.textSecondary,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: AppDimensions.space8),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.end,
                            children: [
                              TextButton.icon(
                                key: const Key('replace_document_button'),
                                onPressed: () => _pickDocument(loc),
                                icon: const Icon(Icons.refresh_rounded, size: 16.0),
                                label: Text(loc.replaceDocumentBtn),
                              ),
                              const SizedBox(width: AppDimensions.space8),
                              TextButton.icon(
                                key: const Key('remove_document_button'),
                                onPressed: () {
                                  setState(() {
                                    _attachedDocument = null;
                                    _documentErrorMessage = null;
                                  });
                                },
                                icon: const Icon(
                                  Icons.delete_outline_rounded,
                                  size: 16.0,
                                  color: AppColors.emergency,
                                ),
                                label: Text(
                                  loc.removeDocumentBtn,
                                  style: const TextStyle(color: AppColors.emergency),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  if (_documentErrorMessage != null) ...[
                    const SizedBox(height: AppDimensions.space6),
                    Text(
                      _documentErrorMessage!,
                      key: const Key('document_error_message'),
                      style: AppTextStyles.caption.copyWith(
                        color: AppColors.emergency,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],

                  const SizedBox(height: AppDimensions.space20),

                  // Action Buttons
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () => Navigator.of(context).pop(false),
                          style: OutlinedButton.styleFrom(
                            minimumSize: const Size(0, AppDimensions.buttonHeightSmall),
                            shape: const RoundedRectangleBorder(
                              borderRadius: AppDimensions.roundedMedium,
                            ),
                          ),
                          child: Text(loc.cancelBtn),
                        ),
                      ),
                      const SizedBox(width: AppDimensions.space12),
                      Expanded(
                        child: CareBridgeButton(
                          key: const Key('save_manual_lab_button'),
                          label: loc.saveRecordBtn,
                          onPressed: () => _saveEntry(loc),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
