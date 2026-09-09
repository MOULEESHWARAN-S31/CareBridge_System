import 'package:flutter/material.dart';
import '../../app/routes/app_routes.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_dimensions.dart';
import '../../app/theme/app_text_styles.dart';
import '../../core/localization/app_localizations.dart';
import '../../features/authentication/presentation/authentication_controller.dart';
import '../../shared/models/mock_models.dart';
import '../../shared/services/mock_data_service.dart';
import '../../shared/widgets/care_bridge_button.dart';
import '../../shared/widgets/care_bridge_card.dart';
import '../../shared/widgets/care_bridge_search_bar.dart';
import '../../shared/widgets/care_bridge_state_widgets.dart';
import 'manual_lab_entry_dialog.dart';
import 'record_detail_screen.dart';

/// CareBridge Patient Health Records Module
///
/// Features Quick-Actions style box cards for record categories,
/// instant search, manual lab report entry, and detailed record viewing.
/// The "Recent Records" section has been removed as per design updates.
class RecordsScreen extends StatefulWidget {
  const RecordsScreen({super.key});

  @override
  State<RecordsScreen> createState() => _RecordsScreenState();
}

class _RecordsScreenState extends State<RecordsScreen> {
  late List<HealthRecordItem> _allRecords;
  HealthRecordCategory? _selectedCategory;
  String _searchQuery = '';
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _refreshRecords();
  }

  void _refreshRecords() {
    setState(() {
      _allRecords = MockDataService.instance.getHealthRecords();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  int _countForCategory(HealthRecordCategory category) {
    return _allRecords.where((r) => r.category == category).length;
  }

  List<HealthRecordItem> get _filteredRecords {
    return _allRecords.where((record) {
      // Category filter
      if (_selectedCategory != null && record.category != _selectedCategory) {
        return false;
      }
      // Search query filter
      if (_searchQuery.trim().isNotEmpty) {
        final query = _searchQuery.trim().toLowerCase();
        final matchTitle = record.title.toLowerCase().contains(query);
        final matchFacility = record.facility.toLowerCase().contains(query);
        final matchDoctor =
            record.doctor != null && record.doctor!.toLowerCase().contains(query);
        final matchCategory = record.category.displayName.toLowerCase().contains(query);

        return matchTitle || matchFacility || matchDoctor || matchCategory;
      }
      return true;
    }).toList();
  }

  void _onCategoryTapped(HealthRecordCategory? category) {
    setState(() {
      if (_selectedCategory == category) {
        _selectedCategory = null; // Toggle off to "All"
      } else {
        _selectedCategory = category;
      }
    });
  }

  void _navigateToDetail(HealthRecordItem record) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        settings: const RouteSettings(name: AppRoutes.recordDetail),
        builder: (_) => RecordDetailScreen(record: record),
      ),
    );
  }

  void _openManualLabEntry() {
    ManualLabEntryDialog.show(
      context,
      onSaved: _refreshRecords,
    );
  }

  IconData _categoryIcon(HealthRecordCategory category) {
    switch (category) {
      case HealthRecordCategory.medicalRecords:
        return Icons.medical_services_rounded;
      case HealthRecordCategory.labReports:
        return Icons.biotech_rounded;
      case HealthRecordCategory.prescriptions:
        return Icons.medication_rounded;
      case HealthRecordCategory.vaccinations:
        return Icons.vaccines_rounded;
      case HealthRecordCategory.otherDocuments:
        return Icons.description_rounded;
    }
  }

  String _localizedCategoryName(HealthRecordCategory category, AppLocalizations loc) {
    switch (category) {
      case HealthRecordCategory.medicalRecords:
        return loc.categoryMedicalRecords;
      case HealthRecordCategory.labReports:
        return loc.categoryLabReports;
      case HealthRecordCategory.prescriptions:
        return loc.categoryPrescriptions;
      case HealthRecordCategory.vaccinations:
        return loc.categoryVaccinations;
      case HealthRecordCategory.otherDocuments:
        return loc.categoryOtherDocuments;
    }
  }

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context);
    final fallbackUser = MockDataService.instance.getUserProfile();
    String patientName = '';
    try {
      final authUser = CareBridgeAuthScope.of(context).currentUser;
      if (authUser != null && authUser.displayName.isNotEmpty) {
        patientName = authUser.displayName;
      }
    } catch (_) {}
    if (patientName.isEmpty) {
      patientName = fallbackUser.name;
    }
    final displayedRecords = _filteredRecords;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: CustomScrollView(
          slivers: [
            // App Bar / Header
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(
                  AppDimensions.space16,
                  AppDimensions.space16,
                  AppDimensions.space16,
                  AppDimensions.space8,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                loc.recordsTitle,
                                style: AppTextStyles.heading1,
                              ),
                              const SizedBox(height: AppDimensions.space4),
                              Text(
                                loc.recordsSubtitle,
                                style: AppTextStyles.bodySmall.copyWith(
                                  color: AppColors.textSecondary,
                                ),
                              ),
                            ],
                          ),
                        ),
                        // Patient ABHA / Identity Badge
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: AppDimensions.space10,
                            vertical: AppDimensions.space6,
                          ),
                          decoration: BoxDecoration(
                            color: AppColors.primaryLight,
                            borderRadius: AppDimensions.roundedSmall,
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Icon(
                                Icons.person_rounded,
                                size: AppDimensions.iconSmall,
                                color: AppColors.primary,
                              ),
                              const SizedBox(width: AppDimensions.space4),
                              Text(
                                patientName.split(' ').first,
                                style: AppTextStyles.label.copyWith(
                                  color: AppColors.primary,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: AppDimensions.space16),

                    // Search Bar
                    CareBridgeSearchBar(
                      hintText: loc.searchRecordsHint,
                      controller: _searchController,
                      onChanged: (val) {
                        setState(() {
                          _searchQuery = val;
                        });
                      },
                      onClear: () {
                        setState(() {
                          _searchQuery = '';
                        });
                      },
                    ),

                    const SizedBox(height: AppDimensions.space16),

                    // Record Categories Grid (Quick Actions Style Cards)
                    Text(
                      loc.recordCategoriesTitle,
                      style: AppTextStyles.heading2,
                    ),
                    const SizedBox(height: AppDimensions.space12),
                    _buildCategoryCardsGrid(loc),

                    const SizedBox(height: AppDimensions.space16),

                    // Active Filter Header (if filtered or searching)
                    if (_selectedCategory != null || _searchQuery.isNotEmpty) ...[
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Text(
                              _selectedCategory != null
                                  ? _localizedCategoryName(_selectedCategory!, loc)
                                  : loc.searchResultsTitle,
                              style: AppTextStyles.heading3,
                            ),
                          ),
                          TextButton(
                            onPressed: () {
                              setState(() {
                                _selectedCategory = null;
                                _searchQuery = '';
                                _searchController.clear();
                              });
                            },
                            child: Text(loc.showAllRecords),
                          ),
                        ],
                      ),
                      const SizedBox(height: AppDimensions.space8),

                      // Manual Lab Report action under Lab Reports category
                      if (_selectedCategory == HealthRecordCategory.labReports) ...[
                        KeyedSubtree(
                          key: const Key('open_manual_entry_button'),
                          child: CareBridgeButton(
                            key: const Key('add_manual_lab_report_button'),
                            label: loc.addManualLabReportBtn,
                            icon: Icons.add_circle_outline_rounded,
                            isFullWidth: true,
                            onPressed: _openManualLabEntry,
                          ),
                        ),
                        const SizedBox(height: AppDimensions.space12),
                      ],
                    ],
                  ],
                ),
              ),
            ),

            // Records List or Empty State
            if (_allRecords.isEmpty)
              SliverFillRemaining(
                hasScrollBody: false,
                child: CareBridgeEmptyState(
                  icon: Icons.folder_open_rounded,
                  title: loc.noHealthRecordsYet,
                  description: loc.noHealthRecordsDesc,
                ),
              )
            else if (displayedRecords.isEmpty)
              SliverFillRemaining(
                hasScrollBody: false,
                child: CareBridgeEmptyState(
                  icon: _searchQuery.isNotEmpty
                      ? Icons.search_off_rounded
                      : (_selectedCategory == HealthRecordCategory.labReports
                          ? Icons.biotech_rounded
                          : Icons.filter_alt_off_rounded),
                  title: _searchQuery.isNotEmpty
                      ? loc.noRecordsFound
                      : loc.emptyCategoryRecords,
                  description: _searchQuery.isNotEmpty
                      ? loc.tryDifferentSearch
                      : loc.tryDifferentSearch,
                  actionLabel: _selectedCategory == HealthRecordCategory.labReports
                      ? loc.addManualLabReportBtn
                      : loc.allRecords,
                  onAction: _selectedCategory == HealthRecordCategory.labReports
                      ? _openManualLabEntry
                      : () {
                          setState(() {
                            _selectedCategory = null;
                            _searchQuery = '';
                            _searchController.clear();
                          });
                        },
                ),
              )
            else
              SliverPadding(
                padding: const EdgeInsets.symmetric(
                  horizontal: AppDimensions.space16,
                  vertical: AppDimensions.space8,
                ),
                sliver: SliverList(
                  delegate: SliverChildBuilderDelegate(
                    (context, index) {
                      final record = displayedRecords[index];
                      return Padding(
                        padding: const EdgeInsets.only(bottom: AppDimensions.space12),
                        child: _buildRecordCard(context, loc, record),
                      );
                    },
                    childCount: displayedRecords.length,
                  ),
                ),
              ),

            // Bottom Spacing for Tab Bar
            const SliverToBoxAdapter(
              child: SizedBox(height: AppDimensions.space32),
            ),
          ],
        ),
      ),
    );
  }

  /// Builds the 2-column Quick Actions style category cards grid
  Widget _buildCategoryCardsGrid(AppLocalizations loc) {
    final categories = HealthRecordCategory.values;

    return LayoutBuilder(
      builder: (context, constraints) {
        final crossAxisCount = constraints.maxWidth > 600 ? 3 : 2;
        final spacing = AppDimensions.space12;
        final cardWidth =
            (constraints.maxWidth - (crossAxisCount - 1) * spacing) / crossAxisCount;

        return Wrap(
          spacing: spacing,
          runSpacing: spacing,
          children: categories.map((cat) {
            final isSelected = _selectedCategory == cat;
            final count = _countForCategory(cat);
            final title = _localizedCategoryName(cat, loc);
            final icon = _categoryIcon(cat);

            return SizedBox(
              width: cardWidth,
              child: Material(
                color: Colors.transparent,
                child: InkWell(
                  key: Key('record_category_card_${cat.name}'),
                  onTap: () => _onCategoryTapped(cat),
                  borderRadius: AppDimensions.roundedMedium,
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    padding: const EdgeInsets.symmetric(
                      horizontal: AppDimensions.space16,
                      vertical: AppDimensions.space16,
                    ),
                    decoration: BoxDecoration(
                      color: isSelected
                          ? AppColors.primaryLight.withValues(alpha: 0.6)
                          : AppColors.surface,
                      borderRadius: AppDimensions.roundedMedium,
                      border: Border.all(
                        color: isSelected ? AppColors.primary : AppColors.borderLight,
                        width: isSelected ? 2.0 : 1.0,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.04),
                          blurRadius: 6,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        Container(
                          width: 48,
                          height: 48,
                          decoration: BoxDecoration(
                            color: isSelected ? AppColors.primary : AppColors.primaryLight,
                            shape: BoxShape.circle,
                          ),
                          child: Icon(
                            icon,
                            size: AppDimensions.iconMedium,
                            color: isSelected ? AppColors.textOnPrimary : AppColors.primary,
                          ),
                        ),
                        const SizedBox(height: AppDimensions.space10),
                        Text(
                          title,
                          textAlign: TextAlign.center,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: AppTextStyles.label.copyWith(
                            fontWeight: isSelected ? FontWeight.w700 : FontWeight.w600,
                            color: isSelected ? AppColors.primary : AppColors.textPrimary,
                            fontSize: 13.5,
                          ),
                        ),
                        const SizedBox(height: AppDimensions.space4),
                        Text(
                          '$count ${count == 1 ? 'record' : 'records'}',
                          style: AppTextStyles.caption.copyWith(
                            color: AppColors.textSecondary,
                            fontSize: 11.5,
                          ),
                        ),
                        if (cat == HealthRecordCategory.labReports) ...[
                          const SizedBox(height: AppDimensions.space2),
                          Text(
                            loc.manualEntryBtn,
                            style: AppTextStyles.caption.copyWith(
                              color: AppColors.primary,
                              fontSize: 10.5,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                ),
              ),
            );
          }).toList(),
        );
      },
    );
  }

  Widget _buildRecordCard(
    BuildContext context,
    AppLocalizations loc,
    HealthRecordItem record,
  ) {
    final categoryName = _localizedCategoryName(record.category, loc);
    final iconData = _categoryIcon(record.category);

    return CareBridgeCard(
      title: record.title,
      subtitle: '${record.facility} • ${record.date}',
      status: record.status,
      leadingIcon: Container(
        width: 40,
        height: 40,
        decoration: BoxDecoration(
          color: AppColors.primaryLight,
          borderRadius: AppDimensions.roundedSmall,
        ),
        child: Icon(
          iconData,
          color: AppColors.primary,
          size: AppDimensions.iconMedium,
        ),
      ),
      onTap: () => _navigateToDetail(record),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: AppDimensions.space8,
                  vertical: AppDimensions.space2,
                ),
                decoration: BoxDecoration(
                  color: AppColors.background,
                  borderRadius: AppDimensions.roundedSmall,
                  border: Border.all(color: AppColors.borderLight),
                ),
                child: Text(
                  categoryName,
                  style: AppTextStyles.caption.copyWith(
                    color: AppColors.primary,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              const SizedBox(width: AppDimensions.space6),
              if (record.isManualEntry) ...[
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppDimensions.space8,
                    vertical: AppDimensions.space2,
                  ),
                  decoration: BoxDecoration(
                    color: AppColors.secondaryLight,
                    borderRadius: AppDimensions.roundedSmall,
                    border: Border.all(color: AppColors.secondary),
                  ),
                  child: Text(
                    loc.manuallyEnteredBadge,
                    style: AppTextStyles.caption.copyWith(
                      color: AppColors.secondary,
                      fontWeight: FontWeight.w700,
                      fontSize: 10.0,
                    ),
                  ),
                ),
                const SizedBox(width: AppDimensions.space6),
              ],
              if (record.doctor != null) ...[
                Expanded(
                  child: Text(
                    record.doctor!,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: AppTextStyles.caption.copyWith(
                      color: AppColors.textSecondary,
                    ),
                  ),
                ),
              ],
            ],
          ),
          const SizedBox(height: AppDimensions.space8),
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              Text(
                loc.viewDetailsBtn,
                style: AppTextStyles.label.copyWith(
                  color: AppColors.primary,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(width: AppDimensions.space2),
              const Icon(
                Icons.arrow_forward_ios_rounded,
                size: 12,
                color: AppColors.primary,
              ),
            ],
          ),
        ],
      ),
    );
  }
}
