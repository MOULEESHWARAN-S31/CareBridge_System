import 'package:flutter/material.dart';
import '../../../app/routes/app_routes.dart';
import '../../../app/theme/app_colors.dart';
import '../../../app/theme/app_dimensions.dart';
import '../../../core/localization/app_localizations.dart';
import '../../../core/services/session_service.dart';
import '../data/api_abha_repository.dart';
import '../domain/abha_repository.dart';

/// Screen 1: ABHA Lookup Loading Screen.
/// Performs automatic background lookup for ABHA cards linked to the user's verified phone number.
/// Routes to Patient Profile if exactly 1 profile is found, Select Profile if multiple profiles
/// are found, or Create ABHA Card if no profiles exist.
class AbhaLookupScreen extends StatefulWidget {
  final AbhaRepository? repository;
  final SessionService? sessionService;
  final String? initialMobileNumber;

  const AbhaLookupScreen({
    super.key,
    this.repository,
    this.sessionService,
    this.initialMobileNumber,
  });

  @override
  State<AbhaLookupScreen> createState() => _AbhaLookupScreenState();
}

class _AbhaLookupScreenState extends State<AbhaLookupScreen> {
  late final AbhaRepository _abhaRepo;
  bool _isLoading = true;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _abhaRepo = widget.repository ?? ApiAbhaRepository();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) {
        _performLookup();
      }
    });
  }

  Future<void> _performLookup() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final session = widget.sessionService ?? await SessionService.init();
      final user = session.getStoredUser();
      final phone = widget.initialMobileNumber ??
          (user?.phoneNumber.isNotEmpty == true ? user!.phoneNumber : '9876543210');
      final cleanMobile = phone.replaceAll(RegExp(r'\D'), '');

      final profiles = await _abhaRepo.findProfilesByMobile(cleanMobile);

      if (!mounted) return;

      setState(() {
        _isLoading = false;
      });

      if (profiles.isEmpty) {
        // Zero profiles -> Show Create ABHA Card screen
        Navigator.of(context).pushReplacementNamed(
          AppRoutes.abhaNoProfile,
          arguments: cleanMobile,
        );
      } else if (profiles.length == 1) {
        // Exactly 1 Profile -> Directly open Patient Profile with that profile active
        final profile = profiles.first;
        await session.setActiveAbhaProfile(profile);

        if (user != null) {
          final updatedUser = user.copyWith(
            fullName: profile.fullName,
            gender: profile.gender,
            dateOfBirth: profile.dateOfBirth,
            abhaNumber: profile.abhaNumber,
            abhaAddress: profile.abhaAddress,
            profileCompleted: true,
          );
          await session.saveSession(updatedUser);
        }

        if (!mounted) return;
        Navigator.of(context).pushReplacementNamed(
          AppRoutes.profileSetup,
          arguments: profile,
        );
      } else {
        // Multiple Profiles -> Show Select Profile screen
        Navigator.of(context).pushReplacementNamed(
          AppRoutes.abhaProfileSelect,
          arguments: profiles,
        );
      }
    } catch (e) {
      if (!mounted) return;
      final localizations = AppLocalizations.of(context);
      setState(() {
        _isLoading = false;
        _errorMessage = localizations.somethingWentWrong;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final localizations = AppLocalizations.of(context);

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Padding(
          padding: AppDimensions.screenPadding,
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  padding: const EdgeInsets.all(AppDimensions.space24),
                  decoration: BoxDecoration(
                    color: AppColors.primary.withValues(alpha: 0.1),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.health_and_safety_rounded,
                    size: 64,
                    color: AppColors.primary,
                  ),
                ),
                const SizedBox(height: AppDimensions.space24),
                Text(
                  'Ayushman Bharat Digital Mission',
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.titleSmall?.copyWith(
                        color: AppColors.primary,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1.1,
                      ),
                ),
                const SizedBox(height: AppDimensions.space8),
                Text(
                  localizations.checkingAbhaRecords,
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                        fontWeight: FontWeight.bold,
                        color: AppColors.textPrimary,
                      ),
                ),
                const SizedBox(height: AppDimensions.space16),
                if (_isLoading) ...[
                  const CircularProgressIndicator(
                    valueColor: AlwaysStoppedAnimation<Color>(AppColors.primary),
                  ),
                  const SizedBox(height: AppDimensions.space24),
                  Text(
                    localizations.searchingAbhaProfiles,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      color: AppColors.textSecondary,
                      fontSize: 14,
                    ),
                  ),
                ],
                if (_errorMessage != null) ...[
                  Text(
                    _errorMessage!,
                    textAlign: TextAlign.center,
                    style: const TextStyle(color: AppColors.emergency),
                  ),
                  const SizedBox(height: AppDimensions.space24),
                  ElevatedButton(
                    onPressed: _performLookup,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 12),
                    ),
                    child: Text(
                      localizations.retryBtn,
                      style: const TextStyle(color: Colors.white),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}
