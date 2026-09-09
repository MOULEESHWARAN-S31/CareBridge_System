import 'package:flutter/material.dart';
import '../../../app/routes/app_routes.dart';
import '../../../app/theme/app_colors.dart';
import '../../../app/theme/app_dimensions.dart';
import '../../../app/theme/app_text_styles.dart';
import '../../../core/localization/app_localizations.dart';
import '../../../core/localization/supported_locales.dart';
import '../../../core/services/session_service.dart';
import '../../../core/utils/accessibility_utils.dart';
import '../../../shared/widgets/care_bridge_button.dart';
import 'authentication_controller.dart';

/// Basic Patient Profile Setup Screen (Step 2)
/// Collects name, language, optional DOB and optional gender, with privacy consent.
class PatientProfileSetupScreen extends StatefulWidget {
  const PatientProfileSetupScreen({super.key});

  @override
  State<PatientProfileSetupScreen> createState() => _PatientProfileSetupScreenState();
}

class _PatientProfileSetupScreenState extends State<PatientProfileSetupScreen> {
  final TextEditingController _nameController = TextEditingController();
  late String _selectedLanguageCode;
  DateTime? _selectedDob;
  String? _selectedGender;
  bool _consentAgreed = false;
  String? _nameError;
  String? _consentError;

  final List<String> _genderOptions = [
    'Male',
    'Female',
    'Other',
    'Prefer not to say',
  ];

  @override
  void initState() {
    super.initState();
    // Default language to current locale or English
    _selectedLanguageCode = SupportedLocales.english.languageCode;

    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      SessionService session;
      try {
        session = CareBridgeAuthScope.of(context).sessionService;
      } catch (_) {
        session = SessionService();
      }
      final activeProfile = session.getActiveAbhaProfile();
      if (activeProfile != null && mounted) {
        setState(() {
          if (_nameController.text.isEmpty && activeProfile.fullName.isNotEmpty) {
            _nameController.text = activeProfile.fullName;
          }
          if (_selectedDob == null && activeProfile.dateOfBirth.isNotEmpty) {
            _selectedDob = DateTime.tryParse(activeProfile.dateOfBirth);
          }
          if (_selectedGender == null && activeProfile.gender.isNotEmpty) {
            _selectedGender = activeProfile.gender;
          }
          _consentAgreed = true;
        });
      }
    });
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final currentCode = Localizations.localeOf(context).languageCode;
    if (SupportedLocales.all.any((loc) => loc.languageCode == currentCode)) {
      _selectedLanguageCode = currentCode;
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  Future<void> _pickDateOfBirth() async {
    final now = DateTime.now();
    final picked = await showDatePicker(
      context: context,
      initialDate: _selectedDob ?? DateTime(now.year - 25),
      firstDate: DateTime(1900),
      lastDate: now,
      helpText: 'Select Date of Birth',
    );

    if (picked != null) {
      setState(() {
        _selectedDob = picked;
      });
    }
  }

  void _submitProfile() async {
    final name = _nameController.text.trim();

    bool hasError = false;
    if (name.isEmpty) {
      setState(() {
        _nameError = 'Please enter your full name.';
      });
      hasError = true;
    } else {
      setState(() {
        _nameError = null;
      });
    }

    if (!_consentAgreed) {
      setState(() {
        _consentError = 'Please agree to continue.';
      });
      hasError = true;
    } else {
      setState(() {
        _consentError = null;
      });
    }

    if (hasError) return;

    final controller = CareBridgeAuthScope.of(context);
    final success = await controller.completeProfile(
      name: name,
      language: _selectedLanguageCode,
      dateOfBirth: _selectedDob,
      gender: _selectedGender,
    );

    if (success && mounted) {
      Navigator.of(context).pushNamedAndRemoveUntil(AppRoutes.main, (route) => false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final localizations = AppLocalizations.of(context);
    final controller = CareBridgeAuthScope.of(context);
    final bool isLoading = controller.status == AuthStatus.loading;

    return Scaffold(
      backgroundColor: AppColors.surface,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        elevation: 0,
        title: Text(localizations.profileSetupTitle),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: AppDimensions.screenPadding,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                localizations.profileSetupTitle,
                style: AppTextStyles.heading1,
              ),
              const SizedBox(height: AppDimensions.space4),
              Text(
                localizations.profileSetupSubtitle,
                style: AppTextStyles.body.copyWith(color: AppColors.textSecondary),
              ),

              const SizedBox(height: AppDimensions.space24),

              // 1. Full Name (Required)
              Text(
                '${localizations.fullNameLabel} *',
                style: AppTextStyles.label.copyWith(color: AppColors.textPrimary),
              ),
              const SizedBox(height: AppDimensions.space8),
              AccessibilityUtils.ensureMinTouchTarget(
                child: TextField(
                  controller: _nameController,
                  textCapitalization: TextCapitalization.words,
                  style: AppTextStyles.bodyLarge,
                  decoration: InputDecoration(
                    hintText: 'e.g. Mouleeshwaran R',
                    prefixIcon: const Icon(Icons.person_outline_rounded, color: AppColors.primary),
                    errorText: _nameError,
                  ),
                  onChanged: (_) {
                    if (_nameError != null) {
                      setState(() {
                        _nameError = null;
                      });
                    }
                  },
                ),
              ),

              const SizedBox(height: AppDimensions.space20),

              // 2. Preferred Language Dropdown (Required)
              Text(
                '${localizations.preferredLanguageLabel} *',
                style: AppTextStyles.label.copyWith(color: AppColors.textPrimary),
              ),
              const SizedBox(height: AppDimensions.space8),
              AccessibilityUtils.ensureMinTouchTarget(
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: AppDimensions.space12),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: AppDimensions.roundedMedium,
                    border: Border.all(color: AppColors.border, width: 1.2),
                  ),
                  child: DropdownButtonHideUnderline(
                    child: DropdownButton<String>(
                      value: _selectedLanguageCode,
                      isExpanded: true,
                      icon: const Icon(Icons.arrow_drop_down_rounded, color: AppColors.primary),
                      items: SupportedLocales.all.map((loc) {
                        return DropdownMenuItem<String>(
                          value: loc.languageCode,
                          child: Text(
                            SupportedLocales.getLanguageName(loc),
                            style: AppTextStyles.bodyLarge,
                          ),
                        );
                      }).toList(),
                      onChanged: (val) {
                        if (val != null) {
                          setState(() {
                            _selectedLanguageCode = val;
                          });
                          controller.setLocale(val);
                        }
                      },
                    ),
                  ),
                ),
              ),

              const SizedBox(height: AppDimensions.space20),

              // 3. Date of Birth (Optional)
              Text(
                localizations.dobLabel,
                style: AppTextStyles.label.copyWith(color: AppColors.textPrimary),
              ),
              const SizedBox(height: AppDimensions.space8),
              AccessibilityUtils.ensureMinTouchTarget(
                child: InkWell(
                  onTap: _pickDateOfBirth,
                  borderRadius: AppDimensions.roundedMedium,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: AppDimensions.space16,
                      vertical: AppDimensions.space16,
                    ),
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: AppDimensions.roundedMedium,
                      border: Border.all(color: AppColors.border, width: 1.2),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.cake_outlined, color: AppColors.primary),
                        const SizedBox(width: AppDimensions.space12),
                        Text(
                          _selectedDob != null
                              ? '${_selectedDob!.day.toString().padLeft(2, '0')} / ${_selectedDob!.month.toString().padLeft(2, '0')} / ${_selectedDob!.year}'
                              : 'DD / MM / YYYY (Tap to choose)',
                          style: _selectedDob != null
                              ? AppTextStyles.bodyLarge
                              : AppTextStyles.body.copyWith(color: AppColors.textMuted),
                        ),
                      ],
                    ),
                  ),
                ),
              ),

              const SizedBox(height: AppDimensions.space20),

              // 4. Gender (Optional)
              Text(
                localizations.genderLabel,
                style: AppTextStyles.label.copyWith(color: AppColors.textPrimary),
              ),
              const SizedBox(height: AppDimensions.space8),
              Wrap(
                spacing: AppDimensions.space8,
                runSpacing: AppDimensions.space8,
                children: _genderOptions.map((g) {
                  final isSelected = _selectedGender == g;
                  return ChoiceChip(
                    label: Text(g),
                    selected: isSelected,
                    selectedColor: AppColors.primaryLight,
                    backgroundColor: AppColors.surface,
                    labelStyle: TextStyle(
                      color: isSelected ? AppColors.primary : AppColors.textSecondary,
                      fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                    ),
                    side: BorderSide(
                      color: isSelected ? AppColors.primary : AppColors.border,
                      width: 1.2,
                    ),
                    onSelected: (selected) {
                      setState(() {
                        _selectedGender = selected ? g : null;
                      });
                    },
                  );
                }).toList(),
              ),

              const SizedBox(height: AppDimensions.space28),

              // 5. Consent & Privacy Acknowledgement
              Container(
                padding: const EdgeInsets.all(AppDimensions.space12),
                decoration: BoxDecoration(
                  color: AppColors.surfaceVariant,
                  borderRadius: AppDimensions.roundedMedium,
                  border: Border.all(
                    color: _consentError != null ? AppColors.error : AppColors.borderLight,
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Checkbox(
                          value: _consentAgreed,
                          activeColor: AppColors.primary,
                          onChanged: (val) {
                            setState(() {
                              _consentAgreed = val ?? false;
                              if (_consentAgreed) {
                                _consentError = null;
                              }
                            });
                          },
                        ),
                        Expanded(
                          child: Padding(
                            padding: const EdgeInsets.only(top: 10.0),
                            child: Text(
                              localizations.consentLabel,
                              style: AppTextStyles.caption.copyWith(
                                color: AppColors.textSecondary,
                                height: 1.4,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                    if (_consentError != null)
                      Padding(
                        padding: const EdgeInsets.only(left: 48.0, top: 4.0),
                        child: Text(
                          _consentError!,
                          style: AppTextStyles.caption.copyWith(color: AppColors.error),
                        ),
                      ),
                  ],
                ),
              ),

              const SizedBox(height: AppDimensions.space24),

              // Submit Button
              CareBridgeButton.primary(
                isFullWidth: true,
                isLoading: isLoading,
                label: localizations.continueBtn,
                icon: Icons.check_circle_outline_rounded,
                onPressed: isLoading ? null : _submitProfile,
              ),

              const SizedBox(height: AppDimensions.space16),
            ],
          ),
        ),
      ),
    );
  }
}
