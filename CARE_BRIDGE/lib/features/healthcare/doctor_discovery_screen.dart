import 'package:flutter/material.dart';
import '../../app/routes/app_routes.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_dimensions.dart';
import '../../app/theme/app_text_styles.dart';
import '../../core/localization/app_localizations.dart';
import '../../core/utils/accessibility_utils.dart';
import '../../features/appointments/data/mock_appointment_repository.dart';
import '../../features/appointments/domain/appointment_repository.dart';
import '../../features/appointments/domain/district.dart';
import '../../features/appointments/domain/doctor.dart';
import '../../features/appointments/domain/hospital.dart';
import '../../features/appointments/presentation/booking_flow_wrapper.dart';
import '../../shared/widgets/care_bridge_button.dart';
import '../../shared/widgets/care_bridge_card.dart';
import '../../shared/widgets/care_bridge_search_bar.dart';
import '../../shared/widgets/care_bridge_state_widgets.dart';
import 'facility_discovery_screen.dart';

/// Screen for searching and discovering Doctors with Hospital Type (Government/Private/Overall),
/// District, Specialization, and Search filters.
class DoctorDiscoveryScreen extends StatefulWidget {
  final AppointmentRepository? repositoryOverride;

  const DoctorDiscoveryScreen({
    super.key,
    this.repositoryOverride,
  });

  @override
  State<DoctorDiscoveryScreen> createState() => _DoctorDiscoveryScreenState();
}

class _DoctorDiscoveryScreenState extends State<DoctorDiscoveryScreen> {
  late AppointmentRepository _repository;
  HospitalTypeFilter _hospitalTypeFilter = HospitalTypeFilter.overall;

  String? _selectedDistrictId;
  String? _selectedSpecialization;
  String _searchQuery = '';

  List<Doctor> _allDoctors = [];
  List<Hospital> _allHospitals = [];
  List<District> _allDistricts = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _repository = widget.repositoryOverride ?? MockAppointmentRepository.instance;
    _loadData();
  }

  Future<void> _loadData() async {
    try {
      final districts = await _repository.fetchDistricts();
      final hospitals = await _repository.fetchAllHospitals();
      final doctors = await _repository.fetchAllDoctors();

      if (mounted) {
        setState(() {
          _allDistricts = districts;
          _allHospitals = hospitals;
          _allDoctors = doctors;
          _isLoading = false;
        });
      }
    } catch (_) {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  Hospital? _getHospitalForDoctor(Doctor doctor) {
    try {
      return _allHospitals.firstWhere((h) => h.id == doctor.hospitalId);
    } catch (_) {
      return null;
    }
  }

  List<String> get _specializations {
    final set = _allDoctors.map((d) => d.specialization).toSet();
    final list = set.toList()..sort();
    return list;
  }

  List<Doctor> get _filteredDoctors {
    var list = _allDoctors.toList();

    // 1. Hospital Type filter (derived from Doctor -> Hospital ID -> Hospital Type)
    if (_hospitalTypeFilter == HospitalTypeFilter.government) {
      list = list.where((d) {
        final hosp = _getHospitalForDoctor(d);
        return hosp != null && hosp.isGovernment;
      }).toList();
    } else if (_hospitalTypeFilter == HospitalTypeFilter.private) {
      list = list.where((d) {
        final hosp = _getHospitalForDoctor(d);
        return hosp != null && hosp.isPrivate;
      }).toList();
    }

    // 2. District filter
    if (_selectedDistrictId != null) {
      list = list.where((d) {
        final hosp = _getHospitalForDoctor(d);
        return hosp != null && hosp.districtId == _selectedDistrictId;
      }).toList();
    }

    // 3. Specialization filter
    if (_selectedSpecialization != null) {
      list = list.where((d) => d.specialization == _selectedSpecialization).toList();
    }

    // 4. Search query
    if (_searchQuery.trim().isNotEmpty) {
      final q = _searchQuery.trim().toLowerCase();
      list = list.where((d) {
        final hosp = _getHospitalForDoctor(d);
        final hospName = hosp?.name.toLowerCase() ?? '';
        return d.name.toLowerCase().contains(q) ||
            d.specialization.toLowerCase().contains(q) ||
            d.qualification.toLowerCase().contains(q) ||
            hospName.contains(q);
      }).toList();
    }

    return list;
  }

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context);
    final displayedDoctors = _filteredDoctors;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text(loc.findDoctorTitle),
      ),
      body: _isLoading
          ? const Center(child: CareBridgeLoading(message: 'Loading doctors...'))
          : Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // 1. Hospital Type Filter Heading & Chips
                Padding(
                  padding: const EdgeInsets.fromLTRB(
                    AppDimensions.space16,
                    AppDimensions.space12,
                    AppDimensions.space16,
                    0,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        loc.hospitalTypeLabel,
                        style: AppTextStyles.label.copyWith(
                          fontWeight: FontWeight.w600,
                          color: AppColors.textSecondary,
                        ),
                      ),
                      const SizedBox(height: AppDimensions.space6),
                      SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        child: Row(
                          children: [
                            AccessibilityUtils.ensureMinTouchTarget(
                              child: ChoiceChip(
                                key: const Key('filter_doctor_government'),
                                label: Text(loc.filterGovernment),
                                selected: _hospitalTypeFilter == HospitalTypeFilter.government,
                                selectedColor: AppColors.primaryLight,
                                onSelected: (_) {
                                  setState(() {
                                    _hospitalTypeFilter = HospitalTypeFilter.government;
                                  });
                                },
                              ),
                            ),
                            const SizedBox(width: AppDimensions.space8),
                            AccessibilityUtils.ensureMinTouchTarget(
                              child: ChoiceChip(
                                key: const Key('filter_doctor_private'),
                                label: Text(loc.filterPrivate),
                                selected: _hospitalTypeFilter == HospitalTypeFilter.private,
                                selectedColor: AppColors.primaryLight,
                                onSelected: (_) {
                                  setState(() {
                                    _hospitalTypeFilter = HospitalTypeFilter.private;
                                  });
                                },
                              ),
                            ),
                            const SizedBox(width: AppDimensions.space8),
                            AccessibilityUtils.ensureMinTouchTarget(
                              child: ChoiceChip(
                                key: const Key('filter_doctor_overall'),
                                label: Text(loc.filterOverall),
                                selected: _hospitalTypeFilter == HospitalTypeFilter.overall,
                                selectedColor: AppColors.primaryLight,
                                onSelected: (_) {
                                  setState(() {
                                    _hospitalTypeFilter = HospitalTypeFilter.overall;
                                  });
                                },
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),

                // 2. Search Bar
                Padding(
                  padding: const EdgeInsets.fromLTRB(
                    AppDimensions.space16,
                    AppDimensions.space12,
                    AppDimensions.space16,
                    0,
                  ),
                  child: CareBridgeSearchBar(
                    key: const Key('doctor_search_bar'),
                    hintText: 'Search by doctor name, specialty, hospital...',
                    onChanged: (val) {
                      setState(() {
                        _searchQuery = val;
                      });
                    },
                  ),
                ),

                // 3. District & Specialization Cascading Filter Controls
                Padding(
                  padding: const EdgeInsets.fromLTRB(
                    AppDimensions.space16,
                    AppDimensions.space12,
                    AppDimensions.space16,
                    AppDimensions.space8,
                  ),
                  child: Row(
                    children: [
                      // District Dropdown
                      Expanded(
                        child: DropdownButtonFormField<String?>(
                          key: const Key('doctor_district_dropdown'),
                          isExpanded: true,
                          initialValue: _selectedDistrictId,
                          decoration: InputDecoration(
                            labelText: loc.filterDistrict,
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
                            ..._allDistricts.map(
                              (d) => DropdownMenuItem<String?>(
                                value: d.id,
                                child: Text(d.name, overflow: TextOverflow.ellipsis),
                              ),
                            ),
                          ],
                          onChanged: (val) {
                            setState(() {
                              _selectedDistrictId = val;
                            });
                          },
                        ),
                      ),
                      const SizedBox(width: AppDimensions.space12),

                      // Specialization Dropdown
                      Expanded(
                        child: DropdownButtonFormField<String?>(
                          key: const Key('doctor_specialization_dropdown'),
                          isExpanded: true,
                          initialValue: _selectedSpecialization,
                          decoration: InputDecoration(
                            labelText: 'Specialization',
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
                              child: Text(loc.allSpecializations, overflow: TextOverflow.ellipsis),
                            ),
                            ..._specializations.map(
                              (s) => DropdownMenuItem<String?>(
                                value: s,
                                child: Text(s, overflow: TextOverflow.ellipsis),
                              ),
                            ),
                          ],
                          onChanged: (val) {
                            setState(() {
                              _selectedSpecialization = val;
                            });
                          },
                        ),
                      ),
                    ],
                  ),
                ),

                const Divider(),

                // 4. Doctors List View
                Expanded(
                  child: displayedDoctors.isEmpty
                      ? CareBridgeEmptyState(
                          icon: Icons.person_search_rounded,
                          title: loc.noDoctorsFound,
                          description: loc.tryDifferentDoctorFilter,
                        )
                      : ListView.separated(
                          padding: const EdgeInsets.all(AppDimensions.space16),
                          itemCount: displayedDoctors.length,
                          separatorBuilder: (context, index) =>
                              const SizedBox(height: AppDimensions.space12),
                          itemBuilder: (context, index) {
                            final doctor = displayedDoctors[index];
                            final hospital = _getHospitalForDoctor(doctor);
                            final isGov = hospital?.isGovernment ?? true;

                            return CareBridgeCard(
                              key: Key('doctor_card_${doctor.id}'),
                              title: doctor.name,
                              subtitle: '${doctor.specialization} • ${doctor.qualification}',
                              onTap: () => _showDoctorDetails(doctor, hospital),
                              leadingIcon: CircleAvatar(
                                radius: 22.0,
                                backgroundColor: isGov ? AppColors.primaryLight : AppColors.secondaryLight,
                                child: Icon(
                                  Icons.person_rounded,
                                  color: isGov ? AppColors.primary : AppColors.secondary,
                                  size: 24.0,
                                ),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const SizedBox(height: AppDimensions.space4),
                                  Row(
                                    children: [
                                      Icon(
                                        Icons.local_hospital_rounded,
                                        size: 14.0,
                                        color: isGov ? AppColors.primary : AppColors.secondary,
                                      ),
                                      const SizedBox(width: AppDimensions.space4),
                                      Expanded(
                                        child: Text(
                                          hospital?.name ?? 'Healthcare Facility',
                                          style: AppTextStyles.bodySmall.copyWith(
                                            fontWeight: FontWeight.w600,
                                            color: AppColors.textPrimary,
                                          ),
                                          maxLines: 1,
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                      ),
                                      Container(
                                        padding: const EdgeInsets.symmetric(
                                          horizontal: 6.0,
                                          vertical: 2.0,
                                        ),
                                        decoration: BoxDecoration(
                                          color: isGov ? AppColors.primaryLight : AppColors.secondaryLight,
                                          borderRadius: BorderRadius.circular(4.0),
                                        ),
                                        child: Text(
                                          isGov ? 'Government' : 'Private',
                                          style: TextStyle(
                                            fontSize: 10.0,
                                            fontWeight: FontWeight.bold,
                                            color: isGov ? AppColors.primary : AppColors.secondary,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: AppDimensions.space4),
                                  Text(
                                    '${doctor.experienceYears} years experience • ${doctor.isAvailable ? "Available" : "On Leave"}',
                                    style: AppTextStyles.caption.copyWith(
                                      color: AppColors.textSecondary,
                                    ),
                                  ),
                                ],
                              ),
                            );
                          },
                        ),
                ),
              ],
            ),
    );
  }

  void _showDoctorDetails(Doctor doctor, Hospital? hospital) {
    final loc = AppLocalizations.of(context);
    final isGov = hospital?.isGovernment ?? true;

    showModalBottomSheet<void>(
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
                    CircleAvatar(
                      radius: 30.0,
                      backgroundColor: isGov ? AppColors.primaryLight : AppColors.secondaryLight,
                      child: Icon(
                        Icons.person_rounded,
                        color: isGov ? AppColors.primary : AppColors.secondary,
                        size: 36.0,
                      ),
                    ),
                    const SizedBox(width: AppDimensions.space16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            doctor.name,
                            style: AppTextStyles.heading2.copyWith(fontSize: 18.0),
                          ),
                          const SizedBox(height: AppDimensions.space4),
                          Text(
                            doctor.specialization,
                            style: AppTextStyles.body.copyWith(
                              color: isGov ? AppColors.primary : AppColors.secondary,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: AppDimensions.space16),
                const Divider(),
                const SizedBox(height: AppDimensions.space12),

                // Doctor Details: Qualification, Experience, Hospital, Availability
                _buildDetailRow(
                  Icons.school_rounded,
                  loc.qualificationLabel,
                  doctor.qualification,
                ),
                const SizedBox(height: AppDimensions.space12),
                _buildDetailRow(
                  Icons.work_history_rounded,
                  loc.experienceLabel,
                  '${doctor.experienceYears} ${loc.experienceYears}',
                ),
                const SizedBox(height: AppDimensions.space12),
                _buildDetailRow(
                  Icons.local_hospital_rounded,
                  loc.facilityLabel,
                  '${hospital?.name ?? "Healthcare Facility"} (${isGov ? "Government" : "Private"})',
                ),
                const SizedBox(height: AppDimensions.space12),
                _buildDetailRow(
                  Icons.event_available_rounded,
                  loc.availabilityLabel,
                  doctor.isAvailable ? loc.doctorAvailable : loc.doctorOnLeave,
                  valueColor: doctor.isAvailable ? AppColors.primary : AppColors.emergency,
                ),

                const SizedBox(height: AppDimensions.space24),

                // Book Appointment Action
                CareBridgeButton.primary(
                  key: const Key('book_appointment_from_doctor_details'),
                  label: loc.bookAppointmentAction,
                  icon: Icons.calendar_month_rounded,
                  isFullWidth: true,
                  onPressed: () {
                    Navigator.of(sheetCtx).pop();
                    _navigateToBooking(doctor, hospital);
                  },
                ),
                const SizedBox(height: AppDimensions.space8),
              ],
            ),
          ),
        );
      },
    );
  }

  void _navigateToBooking(Doctor doctor, Hospital? hospital) {
    District? district;
    if (hospital != null) {
      try {
        district = _repository.findDistrictById(hospital.districtId);
      } catch (_) {}
    }

    Navigator.of(context).push(
      MaterialPageRoute<void>(
        settings: const RouteSettings(name: AppRoutes.bookAppointment),
        builder: (_) => BookingFlowWrapper(
          initialDoctor: doctor,
          initialHospital: hospital,
          initialDistrict: district,
        ),
      ),
    );
  }

  Widget _buildDetailRow(
    IconData icon,
    String label,
    String value, {
    Color? valueColor,
  }) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 18.0, color: AppColors.textSecondary),
        const SizedBox(width: AppDimensions.space12),
        SizedBox(
          width: 110,
          child: Text(
            label,
            style: AppTextStyles.caption.copyWith(color: AppColors.textSecondary),
          ),
        ),
        Expanded(
          child: Text(
            value,
            style: AppTextStyles.body.copyWith(
              fontWeight: FontWeight.w600,
              color: valueColor ?? AppColors.textPrimary,
            ),
          ),
        ),
      ],
    );
  }
}
