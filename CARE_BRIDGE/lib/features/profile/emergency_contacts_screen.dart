import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_dimensions.dart';
import '../../app/theme/app_text_styles.dart';
import '../../core/localization/app_localizations.dart';
import '../../core/services/session_service.dart';
import '../../shared/widgets/care_bridge_button.dart';
import '../../shared/widgets/care_bridge_card.dart';
import 'domain/emergency_contact.dart';

/// Screen for managing patient emergency contacts (Add, Edit, Delete).
class EmergencyContactsScreen extends StatefulWidget {
  final SessionService? sessionServiceOverride;

  const EmergencyContactsScreen({
    super.key,
    this.sessionServiceOverride,
  });

  @override
  State<EmergencyContactsScreen> createState() => _EmergencyContactsScreenState();
}

class _EmergencyContactsScreenState extends State<EmergencyContactsScreen> {
  late final SessionService _sessionService;
  late List<EmergencyContact> _contacts;

  @override
  void initState() {
    super.initState();
    _sessionService = widget.sessionServiceOverride ?? SessionService();
    _loadContacts();
  }

  void _loadContacts() {
    setState(() {
      _contacts = List.from(_sessionService.getEmergencyContacts());
    });
  }

  Future<void> _saveContacts() async {
    await _sessionService.saveEmergencyContacts(_contacts);
    _loadContacts();
  }

  void _showAddEditDialog([EmergencyContact? existingContact]) {
    final loc = AppLocalizations.of(context);
    final isEditing = existingContact != null;

    final nameController = TextEditingController(text: existingContact?.name ?? '');
    final relController = TextEditingController(text: existingContact?.relationship ?? '');
    final mobileController = TextEditingController(text: existingContact?.mobileNumber ?? '');
    final formKey = GlobalKey<FormState>();

    showDialog<void>(
      context: context,
      builder: (dialogCtx) {
        return AlertDialog(
          title: Text(
            isEditing ? loc.editContactBtn : loc.addEmergencyContactBtn,
            style: AppTextStyles.heading2.copyWith(fontSize: 18.0),
          ),
          content: Form(
            key: formKey,
            child: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  TextFormField(
                    key: const Key('emergency_contact_name_field'),
                    controller: nameController,
                    decoration: InputDecoration(
                      labelText: '${loc.contactNameLabel} *',
                      border: OutlineInputBorder(
                        borderRadius: AppDimensions.roundedMedium,
                      ),
                    ),
                    validator: (val) {
                      if (val == null || val.trim().isEmpty) {
                        return loc.contactNameRequired;
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: AppDimensions.space12),
                  TextFormField(
                    key: const Key('emergency_contact_relationship_field'),
                    controller: relController,
                    decoration: InputDecoration(
                      labelText: loc.relationshipLabel,
                      hintText: 'e.g. Father, Mother, Spouse',
                      border: OutlineInputBorder(
                        borderRadius: AppDimensions.roundedMedium,
                      ),
                    ),
                  ),
                  const SizedBox(height: AppDimensions.space12),
                  TextFormField(
                    key: const Key('emergency_contact_mobile_field'),
                    controller: mobileController,
                    keyboardType: TextInputType.phone,
                    decoration: InputDecoration(
                      labelText: '${loc.mobileNumberFieldLabel} *',
                      prefixText: '+91 ',
                      border: OutlineInputBorder(
                        borderRadius: AppDimensions.roundedMedium,
                      ),
                    ),
                    validator: (val) {
                      if (val == null || val.trim().replaceAll(RegExp(r'[^0-9]'), '').length < 10) {
                        return loc.validMobileRequired;
                      }
                      return null;
                    },
                  ),
                ],
              ),
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(dialogCtx).pop(),
              child: Text(loc.cancelBtn),
            ),
            ElevatedButton(
              key: const Key('save_emergency_contact_button'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: AppColors.textOnPrimary,
              ),
              onPressed: () async {
                if (formKey.currentState?.validate() ?? false) {
                  final digits = mobileController.text.trim().replaceAll(RegExp(r'[^0-9]'), '');
                  final formattedPhone = digits.length == 10
                      ? '+91 ${digits.substring(0, 5)} ${digits.substring(5)}'
                      : '+91 $digits';

                  if (isEditing) {
                    final index = _contacts.indexWhere((c) => c.id == existingContact.id);
                    if (index != -1) {
                      _contacts[index] = existingContact.copyWith(
                        name: nameController.text.trim(),
                        relationship: relController.text.trim(),
                        mobileNumber: formattedPhone,
                      );
                    }
                  } else {
                    final newContact = EmergencyContact(
                      id: 'emg_${DateTime.now().millisecondsSinceEpoch}',
                      name: nameController.text.trim(),
                      relationship: relController.text.trim().isNotEmpty
                          ? relController.text.trim()
                          : 'Emergency Contact',
                      mobileNumber: formattedPhone,
                    );
                    _contacts.add(newContact);
                  }

                  await _saveContacts();
                  if (dialogCtx.mounted) {
                    Navigator.of(dialogCtx).pop();
                  }
                }
              },
              child: Text(loc.saveContactBtn),
            ),
          ],
        );
      },
    );
  }

  void _confirmDelete(EmergencyContact contact) {
    final loc = AppLocalizations.of(context);

    showDialog<void>(
      context: context,
      builder: (dialogCtx) {
        return AlertDialog(
          title: Text(loc.confirmDeleteTitle, style: AppTextStyles.heading2),
          content: Text(
            '${loc.confirmDeleteMsg}\n\n${contact.name} (${contact.relationship})',
            style: AppTextStyles.body,
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(dialogCtx).pop(),
              child: Text(loc.cancelBtn),
            ),
            ElevatedButton(
              key: const Key('confirm_delete_contact_button'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.emergency,
                foregroundColor: AppColors.textOnPrimary,
              ),
              onPressed: () async {
                _contacts.removeWhere((c) => c.id == contact.id);
                await _saveContacts();
                if (dialogCtx.mounted) {
                  Navigator.of(dialogCtx).pop();
                }
              },
              child: Text(loc.deleteContactBtn),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text(loc.emergencyContactsTitle),
      ),
      body: SingleChildScrollView(
        padding: AppDimensions.screenPadding,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Add Contact Top Button
            CareBridgeButton.primary(
              key: const Key('add_emergency_contact_button'),
              label: loc.addEmergencyContactBtn,
              icon: Icons.person_add_rounded,
              isFullWidth: true,
              onPressed: () => _showAddEditDialog(),
            ),
            const SizedBox(height: AppDimensions.space20),

            Text(
              loc.emergencyContactsTitle,
              style: AppTextStyles.heading2,
            ),
            const SizedBox(height: AppDimensions.space8),

            // Contacts List or Empty State
            if (_contacts.isEmpty)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(
                  horizontal: AppDimensions.space20,
                  vertical: AppDimensions.space32,
                ),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: AppDimensions.roundedMedium,
                  border: Border.all(color: AppColors.borderLight),
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(
                      Icons.contact_phone_outlined,
                      size: 48,
                      color: AppColors.textSecondary,
                    ),
                    const SizedBox(height: AppDimensions.space12),
                    Text(
                      loc.noEmergencyContacts,
                      textAlign: TextAlign.center,
                      style: AppTextStyles.body.copyWith(
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              )
            else
              ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: _contacts.length,
                separatorBuilder: (context, index) =>
                    const SizedBox(height: AppDimensions.space12),
                itemBuilder: (context, index) {
                  final contact = _contacts[index];

                  return CareBridgeCard(
                    key: Key('emergency_contact_card_${contact.id}'),
                    title: contact.name,
                    subtitle: '${contact.relationship} • ${contact.mobileNumber}',
                    leadingIcon: CircleAvatar(
                      backgroundColor: AppColors.emergencyLight,
                      child: const Icon(
                        Icons.person_rounded,
                        color: AppColors.emergency,
                        size: 24,
                      ),
                    ),
                    trailingAction: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        IconButton(
                          key: Key('edit_contact_${contact.id}'),
                          icon: const Icon(Icons.edit_outlined, size: 20),
                          color: AppColors.primary,
                          tooltip: loc.editContactBtn,
                          onPressed: () => _showAddEditDialog(contact),
                        ),
                        IconButton(
                          key: Key('delete_contact_${contact.id}'),
                          icon: const Icon(Icons.delete_outline_rounded, size: 20),
                          color: AppColors.emergency,
                          tooltip: loc.deleteContactBtn,
                          onPressed: () => _confirmDelete(contact),
                        ),
                      ],
                    ),
                  );
                },
              ),
          ],
        ),
      ),
    );
  }
}
