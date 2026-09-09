import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_dimensions.dart';
import '../../app/theme/app_text_styles.dart';
import '../../core/localization/app_localizations.dart';
import '../../features/location/data/location_service_impl.dart';
import '../../features/location/domain/healthcare_facility.dart';
import '../../features/location/domain/location_service.dart';
import '../../shared/widgets/care_bridge_button.dart';
import '../../shared/widgets/care_bridge_card.dart';
import '../../shared/widgets/care_bridge_search_bar.dart';
import '../../shared/widgets/care_bridge_state_widgets.dart';

/// Screen for searching and discovering Hospitals and PHCs via
/// District, City, and Nearby (GPS distance) filters.
class FacilityDiscoveryScreen extends StatefulWidget {
  final FacilityType facilityType;
  final LocationService? locationServiceOverride;

  const FacilityDiscoveryScreen({
    super.key,
    required this.facilityType,
    this.locationServiceOverride,
  });

  @override
  State<FacilityDiscoveryScreen> createState() => _FacilityDiscoveryScreenState();
}

enum FacilityFilterMode { district, city, nearby }
enum HospitalTypeFilter { government, private, overall }

class _FacilityDiscoveryScreenState extends State<FacilityDiscoveryScreen> {
  late LocationService _locationService;
  FacilityFilterMode _filterMode = FacilityFilterMode.district;
  HospitalTypeFilter _hospitalTypeFilter = HospitalTypeFilter.overall;
  String _searchQuery = '';

  String? _selectedDistrict;
  String? _selectedCity;
  UserLocation? _currentLocation;

  late List<HealthcareFacility> _allFacilities;

  @override
  void initState() {
    super.initState();
    _locationService = widget.locationServiceOverride ?? LocationServiceImpl();
    if (widget.facilityType == FacilityType.medical) {
      _filterMode = FacilityFilterMode.nearby;
    }
    _allFacilities = LocationServiceImpl.sampleFacilities
        .where((f) => f.type == widget.facilityType)
        .toList();
    _initLocationIfAvailable();
  }

  @override
  void didUpdateWidget(FacilityDiscoveryScreen oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.locationServiceOverride != oldWidget.locationServiceOverride) {
      _locationService = widget.locationServiceOverride ?? LocationServiceImpl();
      _initLocationIfAvailable();
    }
  }

  Future<void> _initLocationIfAvailable() async {
    final hasPerm = await _locationService.isPermissionGranted();
    if (hasPerm) {
      final loc = await _locationService.getCurrentLocation();
      if (mounted) {
        setState(() {
          _currentLocation = loc;
        });
      }
    }
  }

  Future<void> _requestAndFetchLocation() async {
    try {
      final granted = await _locationService.requestPermission();
      if (granted) {
        final loc = await _locationService.getCurrentLocation();
        if (mounted) {
          setState(() {
            _currentLocation = loc;
          });
        }
      }
    } catch (_) {}
  }

  /// Facilities filtered by the active hospital type filter (if facilityType == hospital)
  List<HealthcareFacility> get _typeScopedFacilities {
    var list = _allFacilities;
    if (widget.facilityType == FacilityType.hospital) {
      if (_hospitalTypeFilter == HospitalTypeFilter.government) {
        list = list.where((f) => f.isGovernment).toList();
      } else if (_hospitalTypeFilter == HospitalTypeFilter.private) {
        list = list.where((f) => f.isPrivate).toList();
      }
    }
    return list;
  }

  /// All unique districts for current facility type
  List<String> get _districts {
    final set = _typeScopedFacilities.map((f) => f.district).toSet();
    final list = set.toList()..sort();
    return list;
  }

  /// Cities matching the currently selected district
  List<String> get _citiesForSelectedDistrict {
    var facilities = _typeScopedFacilities;
    if (_selectedDistrict != null) {
      facilities = facilities.where((f) => f.district == _selectedDistrict).toList();
    }
    final set = facilities.map((f) => f.city).toSet();
    final list = set.toList()..sort();
    return list;
  }

  /// Filtered facility list based on active tab and selections
  List<HealthcareFacility> get _filteredFacilities {
    var list = _typeScopedFacilities.toList();

    if (_searchQuery.trim().isNotEmpty) {
      final q = _searchQuery.trim().toLowerCase();
      list = list.where((f) =>
        f.name.toLowerCase().contains(q) ||
        f.district.toLowerCase().contains(q) ||
        f.city.toLowerCase().contains(q) ||
        (f.address?.toLowerCase().contains(q) ?? false)
      ).toList();
    }

    if (_filterMode == FacilityFilterMode.district || _filterMode == FacilityFilterMode.city) {
      if (_selectedDistrict != null) {
        list = list.where((f) => f.district == _selectedDistrict).toList();
      }
      if (_selectedCity != null) {
        list = list.where((f) => f.city == _selectedCity).toList();
      }
    } else if (_filterMode == FacilityFilterMode.nearby) {
      if (_currentLocation != null) {
        final patLat = _currentLocation!.latitude;
        final patLng = _currentLocation!.longitude;
        list = list.map((f) {
          final dist = f.calculateDistance(patLat, patLng);
          return f.copyWith(distanceKm: dist);
        }).toList();
        list.sort((a, b) => (a.distanceKm ?? 0).compareTo(b.distanceKm ?? 0));
      }
    }

    return list;
  }

  void _onHospitalTypeChanged(HospitalTypeFilter newFilter) {
    setState(() {
      _hospitalTypeFilter = newFilter;
      final availableDistricts = _typeScopedFacilities.map((f) => f.district).toSet();
      if (_selectedDistrict != null && !availableDistricts.contains(_selectedDistrict)) {
        _selectedDistrict = null;
        _selectedCity = null;
      }
    });
  }

  void _onDistrictChanged(String? newDistrict) {
    setState(() {
      _selectedDistrict = newDistrict;
      // Reset selected city when district changes
      _selectedCity = null;
    });
  }

  void _onCityChanged(String? newCity) {
    setState(() {
      _selectedCity = newCity;
    });
  }

  Future<void> _openGoogleMaps(HealthcareFacility facility, AppLocalizations loc) async {
    final destination = '${facility.latitude},${facility.longitude}';
    String url = 'https://www.google.com/maps/dir/?api=1&destination=$destination';

    if (_currentLocation != null) {
      final origin = '${_currentLocation!.latitude},${_currentLocation!.longitude}';
      url = 'https://www.google.com/maps/dir/?api=1&origin=$origin&destination=$destination';
    }

    final uri = Uri.parse(url);
    try {
      final launched = await launchUrl(
        uri,
        mode: LaunchMode.externalApplication,
      );
      if (!launched) {
        // Fallback to browser or default launch mode
        await launchUrl(uri, mode: LaunchMode.platformDefault);
      }
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(loc.mapsLaunchFailed),
            backgroundColor: AppColors.emergency,
          ),
        );
      }
    }
  }

  void _showFacilityDetails(HealthcareFacility facility, AppLocalizations loc) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(AppDimensions.radiusLarge)),
      ),
      builder: (context) {
        final distStr = facility.distanceLabel(
          _currentLocation?.latitude,
          _currentLocation?.longitude,
        );

        return Padding(
          padding: const EdgeInsets.all(AppDimensions.space20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      facility.name,
                      style: AppTextStyles.heading2,
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close_rounded),
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                ],
              ),
              const SizedBox(height: AppDimensions.space4),
              Text(
                '${facility.type.displayName} • ${facility.district}, ${facility.city}',
                style: AppTextStyles.body.copyWith(color: AppColors.primary),
              ),
              const SizedBox(height: AppDimensions.space12),

              if (facility.address != null) ...[
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(Icons.location_on_rounded, size: 18, color: AppColors.textSecondary),
                    const SizedBox(width: AppDimensions.space8),
                    Expanded(
                      child: Text(
                        facility.address!,
                        style: AppTextStyles.bodySmall,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: AppDimensions.space8),
              ],

              if (facility.contactPhone != null) ...[
                Row(
                  children: [
                    const Icon(Icons.phone_rounded, size: 18, color: AppColors.textSecondary),
                    const SizedBox(width: AppDimensions.space8),
                    Text(
                      facility.contactPhone!,
                      style: AppTextStyles.bodySmall,
                    ),
                  ],
                ),
                const SizedBox(height: AppDimensions.space8),
              ],

              if (_currentLocation != null || facility.distanceKm != null) ...[
                Row(
                  children: [
                    const Icon(Icons.navigation_rounded, size: 18, color: AppColors.secondary),
                    const SizedBox(width: AppDimensions.space8),
                    Text(
                      distStr,
                      style: AppTextStyles.label.copyWith(color: AppColors.secondary),
                    ),
                  ],
                ),
                const SizedBox(height: AppDimensions.space12),
              ],

              if (facility.services.isNotEmpty) ...[
                Text(
                  loc.servicesOfferedTitle,
                  style: AppTextStyles.heading3.copyWith(fontSize: 14.0),
                ),
                const SizedBox(height: AppDimensions.space6),
                Wrap(
                  spacing: AppDimensions.space6,
                  runSpacing: AppDimensions.space6,
                  children: facility.services.map((s) {
                    return Chip(
                      label: Text(s, style: AppTextStyles.caption),
                      backgroundColor: AppColors.background,
                      side: const BorderSide(color: AppColors.borderLight),
                    );
                  }).toList(),
                ),
                const SizedBox(height: AppDimensions.space16),
              ],

              CareBridgeButton(
                key: const Key('get_directions_button'),
                label: loc.getDirectionsBtn,
                icon: Icons.map_rounded,
                onPressed: () {
                  Navigator.of(context).pop();
                  _openGoogleMaps(facility, loc);
                },
              ),
              const SizedBox(height: AppDimensions.space12),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context);
    final isHospital = widget.facilityType == FacilityType.hospital;
    final String title;
    switch (widget.facilityType) {
      case FacilityType.hospital:
        title = loc.hospitalsTitle;
        break;
      case FacilityType.phc:
        title = loc.phcsTitle;
        break;
      case FacilityType.medical:
        title = loc.nearbyMedicalStores;
        break;
    }

    final displayedFacilities = _filteredFacilities;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text(title),
      ),
      body: Column(
        children: [
          // Hospital Type Filter: Government / Private / Overall
          if (isHospital) ...[
            Padding(
              padding: const EdgeInsets.fromLTRB(
                AppDimensions.space16,
                AppDimensions.space12,
                AppDimensions.space16,
                0,
              ),
              child: SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: [
                    ChoiceChip(
                      key: const Key('filter_hospital_government'),
                      label: Text(loc.governmentHospitals),
                      selected: _hospitalTypeFilter == HospitalTypeFilter.government,
                      selectedColor: AppColors.primaryLight,
                      onSelected: (_) => _onHospitalTypeChanged(HospitalTypeFilter.government),
                    ),
                    const SizedBox(width: AppDimensions.space8),
                    ChoiceChip(
                      key: const Key('filter_hospital_private'),
                      label: Text(loc.privateHospitals),
                      selected: _hospitalTypeFilter == HospitalTypeFilter.private,
                      selectedColor: AppColors.primaryLight,
                      onSelected: (_) => _onHospitalTypeChanged(HospitalTypeFilter.private),
                    ),
                    const SizedBox(width: AppDimensions.space8),
                    ChoiceChip(
                      key: const Key('filter_hospital_overall'),
                      label: Text(loc.overallHospitals),
                      selected: _hospitalTypeFilter == HospitalTypeFilter.overall,
                      selectedColor: AppColors.primaryLight,
                      onSelected: (_) => _onHospitalTypeChanged(HospitalTypeFilter.overall),
                    ),
                  ],
                ),
              ),
            ),
          ],

          // Search Bar
          Padding(
            padding: const EdgeInsets.fromLTRB(
              AppDimensions.space16,
              AppDimensions.space12,
              AppDimensions.space16,
              0,
            ),
            child: CareBridgeSearchBar(
              key: const Key('hospital_search_bar'),
              hintText: 'Search hospitals by name, area...',
              onChanged: (val) {
                setState(() {
                  _searchQuery = val;
                });
              },
            ),
          ),

          // Filter Mode Segmented Bar
          Padding(
            padding: const EdgeInsets.all(AppDimensions.space16),
            child: Row(
              children: [
                Expanded(
                  child: ChoiceChip(
                    key: const Key('filter_tab_district'),
                    label: Text(loc.filterDistrict),
                    selected: _filterMode == FacilityFilterMode.district,
                    onSelected: (_) {
                      setState(() {
                        _filterMode = FacilityFilterMode.district;
                      });
                    },
                  ),
                ),
                const SizedBox(width: AppDimensions.space8),
                Expanded(
                  child: ChoiceChip(
                    key: const Key('filter_tab_city'),
                    label: Text(loc.filterCity),
                    selected: _filterMode == FacilityFilterMode.city,
                    onSelected: (_) {
                      setState(() {
                        _filterMode = FacilityFilterMode.city;
                      });
                    },
                  ),
                ),
                const SizedBox(width: AppDimensions.space8),
                Expanded(
                  child: ChoiceChip(
                    key: const Key('filter_tab_nearby'),
                    label: Text(loc.filterNearby),
                    selected: _filterMode == FacilityFilterMode.nearby,
                    onSelected: (_) {
                      setState(() {
                        _filterMode = FacilityFilterMode.nearby;
                      });
                    },
                  ),
                ),
              ],
            ),
          ),

          // Controls panel based on active filter mode
          if (_filterMode == FacilityFilterMode.district || _filterMode == FacilityFilterMode.city) ...[
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppDimensions.space16),
              child: Column(
                children: [
                  // District Dropdown
                  DropdownButtonFormField<String?>(
                    key: const Key('district_dropdown'),
                    isExpanded: true,
                    initialValue: _selectedDistrict,
                    decoration: InputDecoration(
                      labelText: loc.selectDistrict,
                      border: OutlineInputBorder(
                        borderRadius: AppDimensions.roundedMedium,
                      ),
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: AppDimensions.space12,
                        vertical: AppDimensions.space8,
                      ),
                    ),
                    items: [
                      DropdownMenuItem<String?>(
                        value: null,
                        child: Text(loc.allDistricts, overflow: TextOverflow.ellipsis),
                      ),
                      ..._districts.map(
                        (d) => DropdownMenuItem<String?>(
                          value: d,
                          child: Text(d, overflow: TextOverflow.ellipsis),
                        ),
                      ),
                    ],
                    onChanged: _onDistrictChanged,
                  ),
                  const SizedBox(height: AppDimensions.space12),

                  // Cascading City Dropdown
                  DropdownButtonFormField<String?>(
                    key: const Key('city_dropdown'),
                    isExpanded: true,
                    initialValue: _selectedCity,
                    decoration: InputDecoration(
                      labelText: loc.selectCity,
                      border: OutlineInputBorder(
                        borderRadius: AppDimensions.roundedMedium,
                      ),
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: AppDimensions.space12,
                        vertical: AppDimensions.space8,
                      ),
                    ),
                    items: [
                      DropdownMenuItem<String?>(
                        value: null,
                        child: Text(loc.allCities, overflow: TextOverflow.ellipsis),
                      ),
                      ..._citiesForSelectedDistrict.map(
                        (c) => DropdownMenuItem<String?>(
                          value: c,
                          child: Text(c, overflow: TextOverflow.ellipsis),
                        ),
                      ),
                    ],
                    onChanged: _onCityChanged,
                  ),
                  const SizedBox(height: AppDimensions.space12),
                ],
              ),
            ),
          ],

          // Nearby Filter Location Warning / Button
          if (_filterMode == FacilityFilterMode.nearby && _currentLocation == null) ...[
            Padding(
              padding: const EdgeInsets.all(AppDimensions.space16),
              child: Container(
                padding: AppDimensions.cardPadding,
                decoration: BoxDecoration(
                  color: AppColors.secondaryLight,
                  borderRadius: AppDimensions.roundedMedium,
                  border: Border.all(color: AppColors.secondary),
                ),
                child: Column(
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.location_off_rounded, color: AppColors.secondary),
                        const SizedBox(width: AppDimensions.space8),
                        Expanded(
                          child: Text(
                            loc.locationRequiredMsg,
                            style: AppTextStyles.body.copyWith(fontWeight: FontWeight.w600),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: AppDimensions.space12),
                    CareBridgeButton(
                      key: const Key('enable_location_button'),
                      label: loc.enableLocationBtn,
                      onPressed: _requestAndFetchLocation,
                    ),
                  ],
                ),
              ),
            ),
          ],

          // Facility List View
          Expanded(
            child: _filterMode == FacilityFilterMode.nearby && _currentLocation == null
                ? Center(
                    child: Padding(
                      padding: const EdgeInsets.all(AppDimensions.space24),
                      child: Text(
                        loc.locationRequiredMsg,
                        textAlign: TextAlign.center,
                        style: AppTextStyles.body.copyWith(color: AppColors.textSecondary),
                      ),
                    ),
                  )
                : displayedFacilities.isEmpty
                    ? CareBridgeEmptyState(
                        icon: Icons.local_hospital_outlined,
                        title: loc.noFacilitiesFound,
                        description: loc.tryDifferentFilter,
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.symmetric(horizontal: AppDimensions.space16),
                        itemCount: displayedFacilities.length,
                        itemBuilder: (context, index) {
                          final facility = displayedFacilities[index];
                          final distLabel = facility.distanceLabel(
                            _currentLocation?.latitude,
                            _currentLocation?.longitude,
                          );

                          return Padding(
                            padding: const EdgeInsets.only(bottom: AppDimensions.space12),
                            child: CareBridgeCard(
                              key: Key('facility_card_${facility.id}'),
                              title: facility.name,
                              subtitle: '${facility.district} • ${facility.city}\n${facility.address ?? ""}',
                              leadingIcon: Container(
                                padding: const EdgeInsets.all(AppDimensions.space10),
                                decoration: BoxDecoration(
                                  color: isHospital ? AppColors.secondaryLight : AppColors.primaryLight,
                                  borderRadius: AppDimensions.roundedMedium,
                                ),
                                child: Icon(
                                  isHospital ? Icons.local_hospital_rounded : Icons.medical_services_rounded,
                                  color: isHospital ? AppColors.secondary : AppColors.primary,
                                  size: AppDimensions.iconMedium,
                                ),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  if (_filterMode == FacilityFilterMode.nearby || _currentLocation != null) ...[
                                    Row(
                                      children: [
                                        const Icon(
                                          Icons.navigation_rounded,
                                          size: 14,
                                          color: AppColors.secondary,
                                        ),
                                        const SizedBox(width: AppDimensions.space4),
                                        Text(
                                          distLabel,
                                          style: AppTextStyles.caption.copyWith(
                                            color: AppColors.secondary,
                                            fontWeight: FontWeight.w600,
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: AppDimensions.space8),
                                  ],
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      OutlinedButton.icon(
                                        key: Key('directions_btn_${facility.id}'),
                                        onPressed: () => _openGoogleMaps(facility, loc),
                                        icon: const Icon(Icons.map_rounded, size: 16),
                                        label: Text(loc.getDirectionsBtn),
                                        style: OutlinedButton.styleFrom(
                                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                          minimumSize: const Size(0, 36),
                                        ),
                                      ),
                                      TextButton(
                                        key: Key('details_btn_${facility.id}'),
                                        onPressed: () => _showFacilityDetails(facility, loc),
                                        child: Text(loc.viewDetailsBtn),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
          ),
        ],
      ),
    );
  }
}
