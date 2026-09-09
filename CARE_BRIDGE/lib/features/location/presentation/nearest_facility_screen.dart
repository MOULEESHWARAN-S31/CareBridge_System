import 'package:flutter/material.dart';
import '../../../app/routes/app_routes.dart';
import '../../../app/theme/app_colors.dart';
import '../../../app/theme/app_dimensions.dart';
import '../../../core/services/session_service.dart';
import '../data/location_service_impl.dart';
import '../domain/healthcare_facility.dart';
import '../domain/location_service.dart';

/// Screen 5: Nearest Healthcare Facility Discovery & Assignment Screen.
class NearestFacilityScreen extends StatefulWidget {
  final LocationService? locationService;
  final UserLocation? initialUserLocation;

  const NearestFacilityScreen({
    super.key,
    this.locationService,
    this.initialUserLocation,
  });

  @override
  State<NearestFacilityScreen> createState() => _NearestFacilityScreenState();
}

class _NearestFacilityScreenState extends State<NearestFacilityScreen> {
  late final LocationService _locationService;
  List<HealthcareFacility> _facilities = [];
  bool _isLoading = true;
  int _selectedFacilityIndex = 0;
  bool _isSaving = false;
  UserLocation? _userLocation;

  @override
  void initState() {
    super.initState();
    _locationService = widget.locationService ?? LocationServiceImpl();
    _userLocation = widget.initialUserLocation;
    _loadFacilities();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_userLocation == null) {
      final args = ModalRoute.of(context)?.settings.arguments;
      if (args is Map<String, dynamic> && args['location'] is UserLocation) {
        _userLocation = args['location'] as UserLocation;
      }
    }
  }

  Future<void> _loadFacilities() async {
    setState(() {
      _isLoading = true;
    });

    final loc = _userLocation ?? await _locationService.getCurrentLocation();
    final list = loc != null
        ? await _locationService.getNearestFacilities(loc)
        : await _locationService.getFacilities();

    if (!mounted) return;

    setState(() {
      _facilities = list;
      _isLoading = false;
    });
  }

  Future<void> _saveAndContinue() async {
    if (_facilities.isEmpty) return;

    setState(() {
      _isSaving = true;
    });

    final selected = _facilities[_selectedFacilityIndex];

    final session = await SessionService.init();
    await session.setAssignedFacility(selected);

    final lastVisited = _facilities.length > 1 ? _facilities[1] : selected;
    await session.setLastVisitedFacility(lastVisited);

    await session.setLocationSetupComplete(true);

    if (!mounted) return;

    Navigator.of(context).pushNamedAndRemoveUntil(
      AppRoutes.home,
      (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    final patLat = _userLocation?.latitude;
    final patLng = _userLocation?.longitude;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Primary Healthcare Facility'),
        backgroundColor: AppColors.surface,
        foregroundColor: AppColors.textPrimary,
        elevation: 0,
        centerTitle: true,
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: _isLoading
                  ? const Center(
                      child: CircularProgressIndicator(
                        valueColor: AlwaysStoppedAnimation<Color>(AppColors.primary),
                      ),
                    )
                  : SingleChildScrollView(
                      padding: AppDimensions.screenPadding,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            padding: const EdgeInsets.all(AppDimensions.space16),
                            decoration: BoxDecoration(
                              color: AppColors.primary.withValues(alpha: 0.08),
                              borderRadius: AppDimensions.roundedMedium,
                              border: Border.all(color: AppColors.primary.withValues(alpha: 0.3)),
                            ),
                            child: Row(
                              children: [
                                const Icon(
                                  Icons.near_me_rounded,
                                  color: AppColors.primary,
                                  size: 28,
                                ),
                                const SizedBox(width: AppDimensions.space16),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        'Nearby Healthcare Facilities',
                                        style: Theme.of(context).textTheme.titleSmall?.copyWith(
                                              fontWeight: FontWeight.bold,
                                              color: AppColors.primary,
                                            ),
                                      ),
                                      const SizedBox(height: 2),
                                      Text(
                                        'Select your primary facility to receive care updates, appointments, and record syncing.',
                                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                              color: AppColors.textSecondary,
                                            ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: AppDimensions.space24),
                          Text(
                            'Facilities Near You (${_facilities.length})',
                            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                  fontWeight: FontWeight.bold,
                                  color: AppColors.textPrimary,
                                ),
                          ),
                          const SizedBox(height: AppDimensions.space8),
                          ListView.separated(
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            itemCount: _facilities.length,
                            separatorBuilder: (context, index) =>
                                const SizedBox(height: AppDimensions.space16),
                            itemBuilder: (context, index) {
                              final fac = _facilities[index];
                              final isSelected = _selectedFacilityIndex == index;

                              return InkWell(
                                onTap: () {
                                  setState(() {
                                    _selectedFacilityIndex = index;
                                  });
                                },
                                borderRadius: AppDimensions.roundedMedium,
                                child: Container(
                                  padding: const EdgeInsets.all(AppDimensions.space16),
                                  decoration: BoxDecoration(
                                    color: AppColors.surface,
                                    borderRadius: AppDimensions.roundedMedium,
                                    border: Border.all(
                                      color: isSelected ? AppColors.primary : AppColors.borderLight,
                                      width: isSelected ? 2.0 : 1.0,
                                    ),
                                    boxShadow: [
                                      BoxShadow(
                                        color: Colors.black.withValues(alpha: 0.04),
                                        blurRadius: 8,
                                        offset: const Offset(0, 2),
                                      ),
                                    ],
                                  ),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        children: [
                                          // ignore: deprecated_member_use
                                          Radio<int>(
                                            value: index,
                                            // ignore: deprecated_member_use
                                            groupValue: _selectedFacilityIndex,
                                            activeColor: AppColors.primary,
                                            // ignore: deprecated_member_use
                                            onChanged: (val) {
                                              if (val != null) {
                                                setState(() {
                                                  _selectedFacilityIndex = val;
                                                });
                                              }
                                            },
                                          ),
                                          Expanded(
                                            child: Column(
                                              crossAxisAlignment: CrossAxisAlignment.start,
                                              children: [
                                                Text(
                                                  fac.name,
                                                  style: const TextStyle(
                                                    fontSize: 15,
                                                    fontWeight: FontWeight.bold,
                                                    color: AppColors.textPrimary,
                                                  ),
                                                ),
                                                const SizedBox(height: 4),
                                                Row(
                                                  children: [
                                                    Container(
                                                      padding: const EdgeInsets.symmetric(
                                                        horizontal: 6,
                                                        vertical: 2,
                                                      ),
                                                      decoration: BoxDecoration(
                                                        color: fac.type == FacilityType.phc
                                                            ? AppColors.primary.withValues(alpha: 0.12)
                                                            : AppColors.secondary.withValues(alpha: 0.12),
                                                        borderRadius: BorderRadius.circular(4),
                                                      ),
                                                      child: Text(
                                                        fac.type.displayName,
                                                        style: TextStyle(
                                                          fontSize: 11,
                                                          fontWeight: FontWeight.bold,
                                                          color: fac.type == FacilityType.phc
                                                              ? AppColors.primary
                                                              : AppColors.secondary,
                                                        ),
                                                      ),
                                                    ),
                                                    if (fac.is24x7) ...[
                                                      const SizedBox(width: 6),
                                                      Container(
                                                        padding: const EdgeInsets.symmetric(
                                                          horizontal: 6,
                                                          vertical: 2,
                                                        ),
                                                        decoration: BoxDecoration(
                                                          color: AppColors.emergency.withValues(alpha: 0.1),
                                                          borderRadius: BorderRadius.circular(4),
                                                        ),
                                                        child: const Text(
                                                          '24x7 Emergency',
                                                          style: TextStyle(
                                                            fontSize: 11,
                                                            fontWeight: FontWeight.bold,
                                                            color: AppColors.emergency,
                                                          ),
                                                        ),
                                                      ),
                                                    ],
                                                    const Spacer(),
                                                    Text(
                                                      fac.distanceLabel(patLat, patLng),
                                                      style: const TextStyle(
                                                        fontSize: 12,
                                                        fontWeight: FontWeight.bold,
                                                        color: AppColors.primary,
                                                      ),
                                                    ),
                                                  ],
                                                ),
                                              ],
                                            ),
                                          ),
                                        ],
                                      ),
                                      if (fac.address != null) ...[
                                        const Padding(
                                          padding: EdgeInsets.only(left: 48, top: 4),
                                          child: Text(
                                            'Address:',
                                            style: TextStyle(
                                              fontSize: 11,
                                              fontWeight: FontWeight.w600,
                                              color: AppColors.textSecondary,
                                            ),
                                          ),
                                        ),
                                        Padding(
                                          padding: const EdgeInsets.only(left: 48, top: 2),
                                          child: Text(
                                            fac.address!,
                                            style: const TextStyle(
                                              fontSize: 12,
                                              color: AppColors.textSecondary,
                                            ),
                                          ),
                                        ),
                                      ],
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
            Container(
              padding: AppDimensions.screenPadding,
              decoration: BoxDecoration(
                color: AppColors.surface,
                border: const Border(top: BorderSide(color: AppColors.borderLight)),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.05),
                    blurRadius: 10,
                    offset: const Offset(0, -4),
                  ),
                ],
              ),
              child: SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: (_isLoading || _isSaving || _facilities.isEmpty)
                      ? null
                      : _saveAndContinue,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: const RoundedRectangleBorder(
                      borderRadius: AppDimensions.roundedMedium,
                    ),
                  ),
                  child: _isSaving
                      ? const SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                          ),
                        )
                      : const Text(
                          'Save Facility & Continue to Dashboard',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
