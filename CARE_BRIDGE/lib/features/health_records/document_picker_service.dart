import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_dimensions.dart';
import '../../app/theme/app_text_styles.dart';

/// Represents a document/file selected for a health record
class SelectedDocument {
  final String name;
  final String type;
  final int sizeBytes;
  final String? path;

  const SelectedDocument({
    required this.name,
    required this.type,
    required this.sizeBytes,
    this.path,
  });

  String get sizeFormatted {
    if (sizeBytes < 1024) return '$sizeBytes B';
    if (sizeBytes < 1024 * 1024) {
      return '${(sizeBytes / 1024).toStringAsFixed(1)} KB';
    }
    return '${(sizeBytes / (1024 * 1024)).toStringAsFixed(1)} MB';
  }
}

/// Abstract service for selecting documents with validation
abstract class DocumentPickerService {
  static const int maxSizeBytes = 10 * 1024 * 1024; // 10 MB limit
  static const List<String> supportedExtensions = ['pdf', 'jpg', 'jpeg', 'png'];

  static bool isSupportedType(String filename) {
    final ext = filename.split('.').last.toLowerCase();
    return supportedExtensions.contains(ext);
  }

  static bool isAllowedSize(int bytes) {
    return bytes <= maxSizeBytes;
  }

  Future<SelectedDocument?> pickDocument(BuildContext context);
}

/// Standard prototype document picker displaying accessible document options
class PrototypeDocumentPickerService implements DocumentPickerService {
  const PrototypeDocumentPickerService();

  static final List<SelectedDocument> availableSampleDocuments = [
    const SelectedDocument(
      name: 'blood_test_report.pdf',
      type: 'pdf',
      sizeBytes: 1258291, // 1.2 MB
      path: '/documents/blood_test_report.pdf',
    ),
    const SelectedDocument(
      name: 'lipid_profile_report.pdf',
      type: 'pdf',
      sizeBytes: 870400, // 850 KB
      path: '/documents/lipid_profile_report.pdf',
    ),
    const SelectedDocument(
      name: 'chest_xray_scan.png',
      type: 'png',
      sizeBytes: 2516582, // 2.4 MB
      path: '/documents/chest_xray_scan.png',
    ),
    const SelectedDocument(
      name: 'prescription_slip.jpg',
      type: 'jpg',
      sizeBytes: 1153433, // 1.1 MB
      path: '/documents/prescription_slip.jpg',
    ),
    // Test files for validation
    const SelectedDocument(
      name: 'oversized_mri_scan.pdf',
      type: 'pdf',
      sizeBytes: 13107200, // 12.5 MB (>10MB)
      path: '/documents/oversized_mri_scan.pdf',
    ),
    const SelectedDocument(
      name: 'patient_notes.txt',
      type: 'txt', // unsupported
      sizeBytes: 45056,
      path: '/documents/patient_notes.txt',
    ),
  ];

  @override
  Future<SelectedDocument?> pickDocument(BuildContext context) async {
    return showModalBottomSheet<SelectedDocument>(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24.0)),
      ),
      builder: (sheetCtx) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(AppDimensions.space20),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Center(
                  child: Container(
                    width: 40,
                    height: 4,
                    decoration: BoxDecoration(
                      color: AppColors.borderLight,
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                ),
                const SizedBox(height: AppDimensions.space16),
                Row(
                  children: [
                    const Icon(
                      Icons.folder_shared_rounded,
                      color: AppColors.primary,
                      size: AppDimensions.iconMedium,
                    ),
                    const SizedBox(width: AppDimensions.space10),
                    Expanded(
                      child: Text(
                        'Select Document',
                        style: AppTextStyles.heading2.copyWith(fontSize: 18.0),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: AppDimensions.space4),
                Text(
                  'Supported formats: PDF, JPG, PNG (Max 10 MB)',
                  style: AppTextStyles.caption.copyWith(color: AppColors.textSecondary),
                ),
                const SizedBox(height: AppDimensions.space16),
                const Divider(),
                Flexible(
                  child: ListView.separated(
                    shrinkWrap: true,
                    itemCount: availableSampleDocuments.length,
                    separatorBuilder: (context, index) => const Divider(height: 1),
                    itemBuilder: (ctx, index) {
                      final doc = availableSampleDocuments[index];
                      final isPdf = doc.type == 'pdf';
                      final isImg = doc.type == 'png' || doc.type == 'jpg' || doc.type == 'jpeg';

                      return ListTile(
                        key: Key('sample_doc_${doc.name.replaceAll('.', '_')}'),
                        leading: CircleAvatar(
                          backgroundColor: isPdf
                              ? AppColors.emergencyLight
                              : isImg
                                  ? AppColors.secondaryLight
                                  : AppColors.borderLight,
                          child: Icon(
                            isPdf
                                ? Icons.picture_as_pdf_rounded
                                : isImg
                                    ? Icons.image_rounded
                                    : Icons.insert_drive_file_rounded,
                            color: isPdf
                                ? AppColors.emergency
                                : isImg
                                    ? AppColors.secondary
                                    : AppColors.textSecondary,
                            size: 20.0,
                          ),
                        ),
                        title: Text(
                          doc.name,
                          style: AppTextStyles.body.copyWith(fontWeight: FontWeight.w600),
                        ),
                        subtitle: Text(
                          '${doc.type.toUpperCase()} • ${doc.sizeFormatted}',
                          style: AppTextStyles.caption.copyWith(color: AppColors.textSecondary),
                        ),
                        onTap: () => Navigator.of(sheetCtx).pop(doc),
                      );
                    },
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
