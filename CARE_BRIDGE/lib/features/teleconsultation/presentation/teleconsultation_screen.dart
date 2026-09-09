import 'package:flutter/material.dart';
import '../../../app/theme/app_colors.dart';
import '../../../core/localization/app_localizations.dart';
import '../../../core/services/session_service.dart';
import '../../appointments/domain/doctor.dart';
import 'teleconsultation_booking_flow_screen.dart';
import 'teleconsultation_controller.dart';
import 'teleconsultation_doctor_detail_modal.dart';

class TeleconsultationScreen extends StatefulWidget {
  final TeleconsultationController? controller;
  final SessionService? sessionServiceOverride;

  const TeleconsultationScreen({
    super.key,
    this.controller,
    this.sessionServiceOverride,
  });

  @override
  State<TeleconsultationScreen> createState() => _TeleconsultationScreenState();
}

class _TeleconsultationScreenState extends State<TeleconsultationScreen> {
  late final TeleconsultationController _controller;
  final TextEditingController _searchFieldController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _controller = widget.controller ?? TeleconsultationController();
    _controller.loadDoctors();
  }

  @override
  void dispose() {
    _searchFieldController.dispose();
    super.dispose();
  }

  void _openBookingFlow(Doctor doctor) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => TeleconsultationBookingFlowScreen(
          doctor: doctor,
          controller: _controller,
          sessionServiceOverride: widget.sessionServiceOverride,
        ),
      ),
    );
  }

  void _showDoctorModal(Doctor doctor) {
    TeleconsultationDoctorDetailModal.show(
      context,
      doctor: doctor,
      onBookPressed: () {
        Navigator.of(context).pop();
        _openBookingFlow(doctor);
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded, color: AppColors.textPrimary),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              loc.teleconsultationTitle,
              style: const TextStyle(
                color: AppColors.textPrimary,
                fontSize: 18,
                fontWeight: FontWeight.w700,
              ),
            ),
            Text(
              loc.teleconsultationSubtitle,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                color: AppColors.textMuted,
                fontSize: 11,
              ),
            ),
          ],
        ),
      ),
      body: AnimatedBuilder(
        animation: _controller,
        builder: (context, _) {
          return Column(
            children: [
              _buildSearchAndFilters(loc),
              Expanded(
                child: _buildBody(loc),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildSearchAndFilters(AppLocalizations loc) {
    return Container(
      color: AppColors.surface,
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Search Box
          TextField(
            controller: _searchFieldController,
            onChanged: _controller.setSearchQuery,
            decoration: InputDecoration(
              hintText: loc.searchDoctorHint,
              hintStyle: const TextStyle(color: AppColors.textMuted, fontSize: 13),
              prefixIcon: const Icon(Icons.search_rounded,
                  color: AppColors.textMuted, size: 20),
              suffixIcon: _searchFieldController.text.isNotEmpty
                  ? IconButton(
                      icon: const Icon(Icons.clear_rounded, size: 18),
                      onPressed: () {
                        _searchFieldController.clear();
                        _controller.setSearchQuery('');
                      },
                    )
                  : null,
              contentPadding: const EdgeInsets.symmetric(vertical: 10),
              filled: true,
              fillColor: AppColors.surfaceVariant,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide.none,
              ),
            ),
          ),
          const SizedBox(height: 10),
          // Horizontal Filter Chips (Availability & Specializations)
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                // Availability Toggle
                FilterChip(
                  label: Text(loc.availableNow),
                  selected: _controller.onlyAvailable,
                  onSelected: (selected) =>
                      _controller.setAvailabilityFilter(selected),
                  selectedColor: AppColors.successLight,
                  checkmarkColor: AppColors.success,
                  labelStyle: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: _controller.onlyAvailable
                        ? AppColors.success
                        : AppColors.textSecondary,
                  ),
                  backgroundColor: AppColors.surface,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(20),
                    side: BorderSide(
                      color: _controller.onlyAvailable
                          ? AppColors.success
                          : AppColors.borderLight,
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                // All Specializations Chip
                ChoiceChip(
                  label: Text(loc.allSpecializations),
                  selected: _controller.selectedSpecialization == null,
                  onSelected: (_) => _controller.setSpecialization(null),
                  selectedColor: AppColors.primaryLight,
                  labelStyle: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: _controller.selectedSpecialization == null
                        ? AppColors.primary
                        : AppColors.textSecondary,
                  ),
                  backgroundColor: AppColors.surface,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(20),
                    side: BorderSide(
                      color: _controller.selectedSpecialization == null
                          ? AppColors.primary
                          : AppColors.borderLight,
                    ),
                  ),
                ),
                ..._controller.specializations.map((spec) {
                  final isSelected =
                      _controller.selectedSpecialization == spec;
                  return Padding(
                    padding: const EdgeInsets.only(left: 8),
                    child: ChoiceChip(
                      label: Text(spec),
                      selected: isSelected,
                      onSelected: (_) => _controller.setSpecialization(spec),
                      selectedColor: AppColors.primaryLight,
                      labelStyle: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: isSelected
                            ? AppColors.primary
                            : AppColors.textSecondary,
                      ),
                      backgroundColor: AppColors.surface,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20),
                        side: BorderSide(
                          color: isSelected
                              ? AppColors.primary
                              : AppColors.borderLight,
                        ),
                      ),
                    ),
                  );
                }),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBody(AppLocalizations loc) {
    if (_controller.isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_controller.errorMessage != null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline_rounded,
                  size: 48, color: AppColors.error),
              const SizedBox(height: 12),
              Text(
                loc.somethingWentWrong,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: _controller.loadDoctors,
                child: Text(loc.retryBtn),
              ),
            ],
          ),
        ),
      );
    }

    if (_controller.filteredDoctors.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.person_search_rounded,
                  size: 56, color: AppColors.textMuted.withValues(alpha: 0.5)),
              const SizedBox(height: 14),
              Text(
                loc.noDoctorsFound,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                loc.tryDifferentDoctorFilter,
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 13, color: AppColors.textMuted),
              ),
              const SizedBox(height: 18),
              OutlinedButton(
                onPressed: () {
                  _searchFieldController.clear();
                  _controller.setSearchQuery('');
                  _controller.setSpecialization(null);
                  _controller.setAvailabilityFilter(false);
                },
                child: const Text('Reset Filters'),
              ),
            ],
          ),
        ),
      );
    }

    return ListView.separated(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      itemCount: _controller.filteredDoctors.length,
      separatorBuilder: (_, _) => const SizedBox(height: 12),
      itemBuilder: (context, index) {
        final doctor = _controller.filteredDoctors[index];
        return _buildDoctorCard(loc, doctor);
      },
    );
  }

  Widget _buildDoctorCard(AppLocalizations loc, Doctor doctor) {
    return InkWell(
      onTap: () => _showDoctorModal(doctor),
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.borderLight),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.02),
              blurRadius: 6,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                CircleAvatar(
                  radius: 28,
                  backgroundColor: AppColors.primaryLight,
                  child: const Icon(
                    Icons.person_rounded,
                    size: 32,
                    color: AppColors.primary,
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        doctor.name,
                        style: const TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      const SizedBox(height: 3),
                      Text(
                        doctor.specialization,
                        style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: AppColors.primary,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        doctor.qualification,
                        style: const TextStyle(
                          fontSize: 11,
                          color: AppColors.textMuted,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${doctor.experienceYears} ${loc.experienceYears}',
                        style: const TextStyle(
                          fontSize: 11,
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: doctor.isAvailable
                        ? AppColors.successLight
                        : AppColors.surfaceMuted,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(
                      color: doctor.isAvailable
                          ? AppColors.success
                          : AppColors.border,
                      width: 0.8,
                    ),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      CircleAvatar(
                        radius: 3,
                        backgroundColor: doctor.isAvailable
                            ? AppColors.success
                            : AppColors.textMuted,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        doctor.isAvailable
                            ? loc.doctorAvailable
                            : loc.doctorOnLeave,
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w700,
                          color: doctor.isAvailable
                              ? AppColors.success
                              : AppColors.textMuted,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 14),
            const Divider(color: AppColors.divider, height: 1),
            const SizedBox(height: 10),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Icon(Icons.videocam_outlined,
                        size: 16, color: AppColors.textMuted),
                    const SizedBox(width: 4),
                    Icon(Icons.phone_outlined,
                        size: 16, color: AppColors.textMuted),
                    const SizedBox(width: 4),
                    Icon(Icons.chat_bubble_outline_rounded,
                        size: 16, color: AppColors.textMuted),
                    const SizedBox(width: 6),
                    Text(
                      'Video • Audio • Chat',
                      style: const TextStyle(
                          fontSize: 11, color: AppColors.textMuted),
                    ),
                  ],
                ),
                ElevatedButton(
                  onPressed: doctor.isAvailable
                      ? () => _openBookingFlow(doctor)
                      : null,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: Colors.white,
                    padding:
                        const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                    minimumSize: const Size(0, 36),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    elevation: 0,
                  ),
                  child: Text(
                    loc.bookTeleconsultationBtn,
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
