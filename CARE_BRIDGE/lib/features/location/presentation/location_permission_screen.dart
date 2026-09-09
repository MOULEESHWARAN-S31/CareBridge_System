import 'package:flutter/material.dart';
import '../../../app/routes/app_routes.dart';
import '../../../app/theme/app_colors.dart';
import '../../../app/theme/app_dimensions.dart';
import '../data/location_service_impl.dart';
import '../domain/location_service.dart';

/// Screen 4: First-login Location Permission Explanation Screen.
class LocationPermissionScreen extends StatefulWidget {
  final LocationService? locationService;

  const LocationPermissionScreen({
    super.key,
    this.locationService,
  });

  @override
  State<LocationPermissionScreen> createState() => _LocationPermissionScreenState();
}

class _LocationPermissionScreenState extends State<LocationPermissionScreen> {
  late final LocationService _locationService;
  bool _isProcessing = false;

  @override
  void initState() {
    super.initState();
    _locationService = widget.locationService ?? LocationServiceImpl();
  }

  Future<void> _requestLocation() async {
    setState(() {
      _isProcessing = true;
    });

    final granted = await _locationService.requestPermission();
    final userLoc = await _locationService.getCurrentLocation();

    if (!mounted) return;

    Navigator.of(context).pushReplacementNamed(
      AppRoutes.nearestFacility,
      arguments: {
        'location': userLoc,
        'permissionGranted': granted,
      },
    );
  }

  Future<void> _useDefaultLocation() async {
    final userLoc = await _locationService.getCurrentLocation();

    if (!mounted) return;

    Navigator.of(context).pushReplacementNamed(
      AppRoutes.nearestFacility,
      arguments: {
        'location': userLoc,
        'permissionGranted': false,
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Nearby Healthcare Setup'),
        backgroundColor: AppColors.surface,
        foregroundColor: AppColors.textPrimary,
        elevation: 0,
        centerTitle: true,
      ),
      body: SafeArea(
        child: Padding(
          padding: AppDimensions.screenPadding,
          child: Column(
            children: [
              Expanded(
                child: SingleChildScrollView(
                  child: Column(
                    children: [
                      const SizedBox(height: AppDimensions.space16),
                      Container(
                        padding: const EdgeInsets.all(AppDimensions.space20),
                        decoration: BoxDecoration(
                          color: AppColors.primary.withValues(alpha: 0.1),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.location_on_rounded,
                          size: 56,
                          color: AppColors.primary,
                        ),
                      ),
                      const SizedBox(height: AppDimensions.space16),
                      Text(
                        'Find Nearby Care',
                        style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                              fontWeight: FontWeight.bold,
                              color: AppColors.textPrimary,
                            ),
                      ),
                      const SizedBox(height: AppDimensions.space8),
                      Text(
                        'CareBridge uses your location to discover nearby Primary Health Centres (PHCs), district hospitals, and emergency medical services.',
                        textAlign: TextAlign.center,
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                              color: AppColors.textSecondary,
                            ),
                      ),
                      const SizedBox(height: AppDimensions.space20),
                      Container(
                        padding: const EdgeInsets.all(AppDimensions.space16),
                        decoration: BoxDecoration(
                          color: AppColors.surface,
                          borderRadius: AppDimensions.roundedMedium,
                          border: Border.all(color: AppColors.borderLight),
                        ),
                        child: const Column(
                          children: [
                            _FeatureRow(
                              icon: Icons.local_hospital_rounded,
                              title: 'Discover Primary Health Centres',
                              subtitle: 'Locate government PHCs and CHCs near your village or town.',
                            ),
                            Divider(height: 24),
                            _FeatureRow(
                              icon: Icons.medical_services_rounded,
                              title: '24x7 Emergency Hospitals',
                              subtitle: 'Find emergency facilities and ambulance contacts instantly.',
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: AppDimensions.space12),
              Column(
                children: [
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: _isProcessing ? null : _requestLocation,
                      icon: const Icon(Icons.my_location_rounded, color: Colors.white),
                      label: _isProcessing
                          ? const SizedBox(
                              height: 20,
                              width: 20,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                              ),
                            )
                          : const Text(
                              'Enable Location Access',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: const RoundedRectangleBorder(
                          borderRadius: AppDimensions.roundedMedium,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: AppDimensions.space12),
                  SizedBox(
                    width: double.infinity,
                    child: OutlinedButton(
                      onPressed: _isProcessing ? null : _useDefaultLocation,
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        side: const BorderSide(color: AppColors.borderLight),
                        shape: const RoundedRectangleBorder(
                          borderRadius: AppDimensions.roundedMedium,
                        ),
                      ),
                      child: const Text(
                        'Skip & Use Default Region (Salem)',
                        style: TextStyle(
                          color: AppColors.textSecondary,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _FeatureRow extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;

  const _FeatureRow({
    required this.icon,
    required this.title,
    required this.subtitle,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, color: AppColors.primary, size: 24),
        const SizedBox(width: AppDimensions.space16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                subtitle,
                style: const TextStyle(
                  fontSize: 12,
                  color: AppColors.textSecondary,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
