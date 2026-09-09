import 'package:geolocator/geolocator.dart';
import '../../../core/services/session_service.dart';
import '../domain/healthcare_facility.dart';
import '../domain/location_service.dart';

/// Production/Mock hybrid implementation of [LocationService].
class LocationServiceImpl implements LocationService {
  /// Default demo location: Salem, Tamil Nadu
  static const double defaultLat = 11.6643;
  static const double defaultLng = 78.1460;

  /// Default list of facilities for demo/testing across multiple districts and cities.
  static final List<HealthcareFacility> sampleFacilities = [
    HealthcareFacility(
      id: 'fac_phc_salem',
      name: 'Primary Health Centre - Suramangalam',
      district: 'Salem',
      city: 'Salem City',
      address: 'Main Road, Suramangalam, Salem, Tamil Nadu 636005',
      type: FacilityType.phc,
      latitude: 11.6780,
      longitude: 78.1250,
      contactPhone: '+91 427 244 1100',
      is24x7: true,
      services: ['General OPD', 'Maternal Care', 'Immunization', 'Emergency First Aid'],
    ),
    HealthcareFacility(
      id: 'fac_gh_salem',
      name: 'Salem District Headquarters Government Hospital',
      district: 'Salem',
      city: 'Salem City',
      address: 'Collectorate Compound, Salem, Tamil Nadu 636001',
      type: FacilityType.hospital,
      latitude: 11.6580,
      longitude: 78.1580,
      contactPhone: '+91 427 245 2200',
      is24x7: true,
      services: ['Emergency 24x7', 'ICU', 'Surgery', 'Pediatrics', 'Radiology', 'Pharmacy'],
    ),
    HealthcareFacility(
      id: 'fac_chc_attur',
      name: 'Community Health Centre - Attur',
      district: 'Salem',
      city: 'Attur',
      address: 'NH 79, Attur, Salem District, Tamil Nadu 636102',
      type: FacilityType.phc,
      latitude: 11.5980,
      longitude: 78.6010,
      contactPhone: '+91 427 233 4400',
      is24x7: false,
      services: ['General OPD', 'Laboratory', 'Dental Care'],
    ),
    HealthcareFacility(
      id: 'fac_gh_omalur',
      name: 'Omalur Sub-District Government Hospital',
      district: 'Salem',
      city: 'Omalur',
      address: 'Main Road, Omalur, Salem District, Tamil Nadu 636505',
      type: FacilityType.hospital,
      latitude: 11.7420,
      longitude: 78.0410,
      contactPhone: '+91 427 266 5500',
      is24x7: true,
      services: ['General Medicine', 'Maternity Ward', 'Emergency Care'],
    ),
    HealthcareFacility(
      id: 'fac_gh_coimbatore',
      name: 'Coimbatore Medical College Hospital',
      district: 'Coimbatore',
      city: 'Coimbatore City',
      address: 'Trichy Road, Coimbatore, Tamil Nadu 641018',
      type: FacilityType.hospital,
      latitude: 11.0018,
      longitude: 76.9629,
      contactPhone: '+91 422 230 1393',
      is24x7: true,
      services: ['Emergency 24x7', 'Trauma Care', 'Cardiology', 'Oncology', 'Dialysis'],
    ),
    HealthcareFacility(
      id: 'fac_gh_pollachi',
      name: 'Pollachi Government Headquarters Hospital',
      district: 'Coimbatore',
      city: 'Pollachi',
      address: 'Palakkad Road, Pollachi, Coimbatore District, Tamil Nadu 642001',
      type: FacilityType.hospital,
      latitude: 10.6581,
      longitude: 77.0083,
      contactPhone: '+91 4259 223 344',
      is24x7: true,
      services: ['General Surgery', 'Orthopedics', 'Maternity Ward', 'Blood Bank'],
    ),
    HealthcareFacility(
      id: 'fac_phc_peelamedu',
      name: 'Primary Health Centre - Peelamedu',
      district: 'Coimbatore',
      city: 'Coimbatore City',
      address: 'Avinashi Road, Peelamedu, Coimbatore, Tamil Nadu 641004',
      type: FacilityType.phc,
      latitude: 11.0253,
      longitude: 76.9997,
      contactPhone: '+91 422 257 8899',
      is24x7: true,
      services: ['Maternal Health', 'Vaccination', 'OPD Consultations'],
    ),
    HealthcareFacility(
      id: 'fac_phc_kinathukadavu',
      name: 'Primary Health Centre - Kinathukadavu',
      district: 'Coimbatore',
      city: 'Kinathukadavu',
      address: 'Main Road, Kinathukadavu, Coimbatore District, Tamil Nadu 642109',
      type: FacilityType.phc,
      latitude: 10.8228,
      longitude: 77.0210,
      contactPhone: '+91 4259 241 122',
      is24x7: false,
      services: ['General OPD', 'Basic Diagnostics', 'Child Immunization'],
    ),
    HealthcareFacility(
      id: 'fac_gh_chennai',
      name: 'Rajiv Gandhi Government General Hospital',
      district: 'Chennai',
      city: 'Chennai Central',
      address: 'EVR Periyar Salai, Park Town, Chennai, Tamil Nadu 600003',
      type: FacilityType.hospital,
      latitude: 13.0818,
      longitude: 80.2773,
      contactPhone: '+91 44 2530 5000',
      is24x7: true,
      services: ['Multi-Specialty 24x7', 'Organ Transplant', 'Neurology', 'Burns Unit'],
    ),
    HealthcareFacility(
      id: 'fac_gh_tambaram',
      name: 'Tambaram Government Hospital',
      district: 'Chennai',
      city: 'Tambaram',
      address: 'GST Road, Tambaram Sanatorium, Chennai, Tamil Nadu 600047',
      type: FacilityType.hospital,
      latitude: 12.9249,
      longitude: 80.1000,
      contactPhone: '+91 44 2241 8800',
      is24x7: true,
      services: ['Thoracic Medicine', 'Emergency Care', 'Maternity Ward'],
    ),
    HealthcareFacility(
      id: 'fac_phc_velachery',
      name: 'Urban Primary Health Centre - Velachery',
      district: 'Chennai',
      city: 'Chennai Central',
      address: 'Main Road, Velachery, Chennai, Tamil Nadu 600042',
      type: FacilityType.phc,
      latitude: 12.9750,
      longitude: 80.2210,
      contactPhone: '+91 44 2259 3344',
      is24x7: true,
      services: ['Urban OPD', 'Immunization', 'Antenatal Checkups'],
    ),
    // Private Hospitals
    HealthcareFacility(
      id: 'fac_pvt_kauvery_salem',
      name: 'Kauvery Hospital - Salem',
      district: 'Salem',
      city: 'Salem City',
      address: 'Meyyanur Road, Salem, Tamil Nadu 636004',
      type: FacilityType.hospital,
      hospitalType: 'Private',
      latitude: 11.6620,
      longitude: 78.1420,
      contactPhone: '+91 427 277 7000',
      is24x7: true,
      services: ['Emergency 24x7', 'Cardiology', 'Neurology', 'Multi-Specialty ICU'],
    ),
    HealthcareFacility(
      id: 'fac_pvt_gokulam_salem',
      name: 'Salem Sri Gokulam Hospital',
      district: 'Salem',
      city: 'Salem City',
      address: 'Meyyanur Main Road, Salem, Tamil Nadu 636004',
      type: FacilityType.hospital,
      hospitalType: 'Private',
      latitude: 11.6690,
      longitude: 78.1380,
      contactPhone: '+91 427 244 5555',
      is24x7: true,
      services: ['General Medicine', 'Pediatrics', 'Obstetrics', 'Dialysis'],
    ),
    HealthcareFacility(
      id: 'fac_pvt_psg_cbe',
      name: 'PSG Hospitals',
      district: 'Coimbatore',
      city: 'Coimbatore City',
      address: 'Avinashi Road, Peelamedu, Coimbatore, Tamil Nadu 641004',
      type: FacilityType.hospital,
      hospitalType: 'Private',
      latitude: 11.0260,
      longitude: 77.0010,
      contactPhone: '+91 422 257 0170',
      is24x7: true,
      services: ['Emergency 24x7', 'Cardiology', 'Oncology', 'Organ Transplant'],
    ),
    HealthcareFacility(
      id: 'fac_pvt_kmch_cbe',
      name: 'KMCH - Kovai Medical Center and Hospital',
      district: 'Coimbatore',
      city: 'Coimbatore City',
      address: 'Avinashi Road, Civil Aerodrome Post, Coimbatore, Tamil Nadu 641014',
      type: FacilityType.hospital,
      hospitalType: 'Private',
      latitude: 11.0380,
      longitude: 77.0420,
      contactPhone: '+91 422 432 3800',
      is24x7: true,
      services: ['Comprehensive Trauma', 'Cardiac Care', 'Neurology', 'Pediatrics'],
    ),
    HealthcareFacility(
      id: 'fac_pvt_apollo_maa',
      name: 'Apollo Hospitals - Greams Road',
      district: 'Chennai',
      city: 'Chennai Central',
      address: '21 Greams Lane, Thousand Lights, Chennai, Tamil Nadu 600006',
      type: FacilityType.hospital,
      hospitalType: 'Private',
      latitude: 13.0600,
      longitude: 80.2520,
      contactPhone: '+91 44 2829 0200',
      is24x7: true,
      services: ['Cardiology', 'Oncology', 'Robotic Surgery', 'Emergency 24x7'],
    ),
    HealthcareFacility(
      id: 'fac_pvt_miot_maa',
      name: 'MIOT International Hospital',
      district: 'Chennai',
      city: 'Tambaram',
      address: '4/112 Mount Poonamallee Road, Manapakkam, Chennai, Tamil Nadu 600089',
      type: FacilityType.hospital,
      hospitalType: 'Private',
      latitude: 13.0180,
      longitude: 80.1780,
      contactPhone: '+91 44 4200 2288',
      is24x7: true,
      services: ['Orthopaedics', 'Trauma Care', 'Cardiology', 'Nephrology'],
    ),
    HealthcareFacility(
      id: 'fac_med_gov_salem',
      name: 'Government Medical Store - Salem',
      district: 'Salem',
      city: 'Salem City',
      address: 'Collectorate Complex, Salem, Tamil Nadu 636001',
      type: FacilityType.medical,
      latitude: 11.6620,
      longitude: 78.1490,
      contactPhone: '+91 427 245 3311',
      is24x7: true,
      services: ['Essential Medicines', 'Generic Drugs', 'Emergency Supplies'],
    ),
    HealthcareFacility(
      id: 'fac_med_apollo_salem',
      name: 'Apollo Pharmacy - Fairlands',
      district: 'Salem',
      city: 'Salem City',
      address: 'Brindavan Road, Fairlands, Salem, Tamil Nadu 636016',
      type: FacilityType.medical,
      latitude: 11.6740,
      longitude: 78.1380,
      contactPhone: '+91 427 244 8899',
      is24x7: true,
      services: ['Prescription Medicines', 'First Aid', 'Home Delivery'],
    ),
    HealthcareFacility(
      id: 'fac_med_thulasi_salem',
      name: 'Thulasi Pharmacies',
      district: 'Salem',
      city: 'Salem City',
      address: 'Cherry Road, Hasthampatti, Salem, Tamil Nadu 636007',
      type: FacilityType.medical,
      latitude: 11.6710,
      longitude: 78.1590,
      contactPhone: '+91 427 231 5566',
      is24x7: false,
      services: ['Affordable Medicines', 'Surgicals', 'Wellness'],
    ),
    HealthcareFacility(
      id: 'fac_med_medplus_cbe',
      name: 'MedPlus Pharmacy - RS Puram',
      district: 'Coimbatore',
      city: 'Coimbatore City',
      address: 'DB Road, RS Puram, Coimbatore, Tamil Nadu 641002',
      type: FacilityType.medical,
      latitude: 11.0110,
      longitude: 76.9490,
      contactPhone: '+91 422 254 7788',
      is24x7: true,
      services: ['24x7 Medicines', 'Diagnostic Kits'],
    ),
  ];

  @override
  Future<bool> isPermissionGranted() async {
    if (SessionService().isLocationSetupComplete()) {
      return true;
    }
    try {
      final permission = await Geolocator.checkPermission();
      return permission == LocationPermission.always ||
          permission == LocationPermission.whileInUse;
    } catch (_) {
      return false;
    }
  }

  @override
  Future<bool> requestPermission() async {
    try {
      var permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
      }
      return permission == LocationPermission.always ||
          permission == LocationPermission.whileInUse;
    } catch (_) {
      return false;
    }
  }

  @override
  Future<UserLocation?> getCurrentLocation() async {
    try {
      final hasPerm = await isPermissionGranted();
      if (hasPerm) {
        final pos = await Geolocator.getCurrentPosition(
          locationSettings: const LocationSettings(
            accuracy: LocationAccuracy.low,
            timeLimit: Duration(seconds: 5),
          ),
        );
        return UserLocation(
          latitude: pos.latitude,
          longitude: pos.longitude,
          addressLabel: 'Current Location',
        );
      }
    } catch (_) {
      // Fallback to default location on error or timeout
    }

    return const UserLocation(
      latitude: defaultLat,
      longitude: defaultLng,
      addressLabel: 'Salem, Tamil Nadu (Default)',
    );
  }

  @override
  Future<List<HealthcareFacility>> getFacilities() async {
    return sampleFacilities;
  }

  @override
  Future<List<HealthcareFacility>> getNearestFacilities(UserLocation userLoc) async {
    final list = sampleFacilities.map((f) {
      final dist = f.calculateDistance(userLoc.latitude, userLoc.longitude);
      return f.copyWith(distanceKm: dist);
    }).toList();

    list.sort((a, b) => (a.distanceKm ?? 0).compareTo(b.distanceKm ?? 0));
    return list;
  }
}
