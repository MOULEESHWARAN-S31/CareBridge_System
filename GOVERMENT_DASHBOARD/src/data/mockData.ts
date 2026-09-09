// CareBridge — Government Healthcare Administration Dashboard Mock Data & Models

export type UserRole = 'State Administrator' | 'District Administrator' | 'Hospital Administrator' | 'Doctor' | 'Nurse' | 'Pharmacist';

export interface UserAccount {
  id: string;
  userId: string;
  employeeId: string;
  fullName: string;
  role: UserRole;
  district: string;
  mobileNumber: string;
  email: string;
  orgType?: string;
  assignedOrgName?: string;
  status: 'Active' | 'Inactive';
  password?: string;
  createdDate: string;
}

export interface DistrictInfo {
  id: string;
  name: string;
  state: string;
  population: number;
  registeredPatients: number;
  activeHospitals: number;
  diagnosticCentresCount: number;
  pharmaciesCount: number;
  doctorsCount: number;
  availableBeds: number;
  totalBeds: number;
  medicineStockAlerts: number;
  teleconsultationsToday: number;
  emergencyCases: number;
  status: 'Normal' | 'Attention' | 'Critical';
  accessibilityScore: number;
  coordinates: { lat: number; lng: number; x: number; y: number };
  scoreBreakdown: {
    facility: number;
    doctor: number;
    medicine: number;
    diagnostics: number;
    beds: number;
    emergency: number;
  };
}

export interface Facility {
  id: string;
  name: string;
  district: string;
  taluk: string;
  type: 'Government Hospital' | 'Medical College Hospital' | 'Primary Health Centre (PHC)' | 'Diagnostic Centre' | 'Pharmacy';
  doctorsCount: number;
  nursesCount: number;
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;
  icuBeds: { total: number; occupied: number };
  emergencyBeds: { total: number; occupied: number };
  pediatricBeds: { total: number; occupied: number };
  patientsToday: number;
  medicineStatus: 'Optimal' | 'Low' | 'Critical';
  diagnosticStatus: 'Full Service' | 'Partial' | 'Unavailable';
  facilityStatus: 'Operational' | 'High Load' | 'Critical' | 'Temporarily Unavailable';
  contactNumber: string;
  officerInCharge: string;
  coordinates: { lat: number; lng: number };
}

export interface Doctor {
  id: string;
  name: string;
  specialization: 'General Medicine' | 'Pediatrics' | 'Cardiology' | 'Dermatology' | 'Gynecology' | 'Orthopedics' | 'ENT' | 'Ophthalmology' | 'Psychiatry' | 'Emergency Medicine';
  facilityName: string;
  facilityType: string;
  district: string;
  taluk: string;
  availability: 'Available' | 'In Consultation' | 'On Leave' | 'Emergency Duty';
  consultationLoadToday: number;
  teleconsultationAvailable: boolean;
  contact: string;
  experienceYears: number;
}

export interface MaskedPatient {
  id: string;
  patientCode: string; // Masked e.g. TN-SLM-9182-XXXX
  patientNameMasked: string; // e.g. M****h K****r
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  district: string;
  taluk: string;
  category: 'Rural' | 'Urban' | 'Tribal' | 'Other';
  facilityName: string;
  registrationDate: string;
  patientStatus: 'Active' | 'Treatment Completed' | 'Follow-up Required';
  primaryDiagnosis: string;
  contactMasked: string;
}

export interface SurveillanceCase {
  id: string;
  disease: string;
  district: string;
  taluk: string;
  village: string;
  facility: string;
  suspectedCases: number;
  confirmedCases: number;
  hospitalized: number;
  recovered: number;
  deathCount: number;
  growthRate: string;
  attackRate: number;
  severity: 'Critical Outbreak' | 'Active Cluster' | 'Watchlist' | 'Controlled';
  status: 'Active' | 'Under Investigation' | 'Dispatched' | 'Contained' | 'Resolved';
  reportedDate: string;
  actionProtocol: string;
  larvalBreteauIndex?: number;
  symptoms: string[];
}

export interface TelemedicineSession {
  id: string;
  patientRef: string;
  patientName: string;
  doctorName: string;
  specialty: string;
  district: string;
  facility: string;
  scheduledTime: string;
  durationMins: number;
  status: 'Active' | 'Waiting' | 'Completed' | 'Cancelled';
  networkQuality: 'Good' | 'Moderate' | 'Poor';
}

export interface MedicineInventoryItem {
  id: string;
  name: string;
  category: string;
  facility: string;
  facilityType: string;
  district: string;
  availableQuantity: number;
  minimumStockThreshold: number;
  unit: string;
  expiryDate: string;
  status: 'Adequate' | 'Low' | 'Critical';
  dailyConsumption: number;
  daysRemaining: number;
  batchNumber: string;
}

export interface DiagnosticItem {
  id: string;
  centreName: string;
  facility: string;
  district: string;
  testName: string;
  equipmentStatus: 'Operational' | 'Degraded' | 'Offline';
  dailyCapacity: number;
  testsPerformedToday: number;
  pendingTestsToday: number;
  turnaroundTimeHours: number;
  status: 'Available' | 'High Queue' | 'Critical Delay';
}

export interface GovernmentScheme {
  id: string;
  schemeCode: string;
  name: string;
  category: string;
  description: string;
  beneficiariesCount: number;
  completedServices: number;
  pendingServices: number;
  districtCoveragePercentage: number;
  monthlyTrendPercentage: number;
  allocatedBudgetCr: number;
  spentBudgetCr: number;
}

export interface RuleAlert {
  id: string;
  title: string;
  category: 'Critical' | 'Warning' | 'Information';
  ruleType: 'BED_OVERCROWDING' | 'MEDICINE_STOCKOUT' | 'EPIDEMIC_SPIKE' | 'DOCTOR_ABSENCE' | 'EQUIPMENT_FAILURE';
  facility: string;
  district: string;
  timestamp: string;
  severity: 'High' | 'Medium' | 'Low';
  status: 'Active' | 'Investigating' | 'Resolved';
  actionNeeded: string;
}

export interface AuditLogItem {
  id: string;
  user: string;
  role: UserRole;
  action: string;
  module: string;
  timestamp: string;
  ipAddress: string;
  result: 'Success' | 'Denied' | 'Warning';
  details: string;
}

// Legacy interfaces for backwards compatibility
export interface VillageData {
  id: string;
  name: string;
  taluk: string;
  district: string;
  population: number;
  registeredPatients: number;
  activeCases: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'NORMAL';
  healthScore: number;
  hospitalsCount: number;
  availableDoctors: number;
  bedsAvailable: number;
  totalBeds: number;
  emergencyKitsStock: number;
  medicineStockStatus: 'Adequate' | 'Low' | 'Critical' | 'Good';
  vaccinationCoverage: number;
  maternalHighRisk: number;
  maternalTotal: number;
  ancPending: number;
  coordinates: { x: number; y: number };
  diseases: {
    dengue: number;
    malaria: number;
    fever: number;
    diarrhoea: number;
    respiratory: number;
    hypertension: number;
    diabetes: number;
    others: number;
  };
}

export interface HospitalData {
  id: string;
  name: string;
  type: 'Government Hospital' | 'Primary Health Centre (PHC)' | 'Medical College Hospital' | 'Private Hospital';
  district: string;
  taluk: string;
  village: string;
  doctors: { available: number; total: number };
  nurses: { available: number; total: number };
  beds: { occupied: number; total: number };
  icuBeds: { occupied: number; total: number };
  ventilators: { inUse: number; total: number };
  ambulances: { available: number; total: number };
  occupancyRate: number;
  status: 'Normal' | 'Near Capacity' | 'Critical' | 'Optimal';
  medicineStockStatus: 'Optimal' | 'Low' | 'Critical';
  emergencySupplyStatus: 'Optimal' | 'Low' | 'Critical';
  emergencyKitsCount: number;
  contact: string;
}

export interface DiseaseAlert {
  id: string;
  villageId: string;
  villageName: string;
  district: string;
  disease: string;
  normalWeeklyCases: number;
  currentCases: number;
  increasePercentage: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'Monitoring' | 'Under Investigation' | 'Action Dispatched' | 'Resolved';
  timestamp: string;
  assignedOfficer: string;
  actionProgressSteps: {
    step: string;
    completed: boolean;
    timestamp?: string;
  }[];
}

export interface EmergencySupplyItem {
  id: string;
  name: string;
  category: string;
  district: string;
  totalStock: number;
  bufferThreshold: number;
  unit: string;
  status: 'Safe' | 'Low' | 'Critical';
  color: string;
}

export interface MedicineItem {
  id: string;
  name: string;
  category: string;
  district: string;
  totalStock: number;
  unit: string;
  dailyConsumption: number;
  status: 'Good' | 'Low' | 'Critical';
  facilities: {
    facilityName: string;
    stock: number;
    dailyUsage: number;
    predictedStockOutDays: number;
  }[];
}

export interface FacilitySupplyBreakdown {
  hospitalName: string;
  hospitalType: string;
  readinessPercentage: number;
  criticalKits: number;
  maxKits: number;
  status: 'Optimal' | 'Low' | 'Critical';
}

export interface DistrictSummary {
  state: string;
  district: string;
  totalVillages: number;
  population: number;
  registeredPatients: number;
  hospitalsCount: number;
  activeCases: number;
  criticalPatients: number;
  activeAlerts: number;
  emergencySuppliesReadiness: number;
  emergencyKitsCount: number;
}

// ==========================================
// SEED DATA: REGISTERED USERS (FOR ALL 8 DISTRICTS)
// ==========================================

export const INITIAL_REGISTERED_USERS: UserAccount[] = [
  {
    id: 'usr-slm-01',
    userId: 'USR-SLM-01',
    employeeId: 'EMP-SLM-01',
    fullName: 'Test Salem User',
    role: 'District Administrator',
    district: 'Salem',
    mobileNumber: '+91 94432 00101',
    email: 'test.salem@carebridge.tn.gov',
    assignedOrgName: 'Salem District Health Office',
    status: 'Active',
    createdDate: '2026-09-01'
  },
  {
    id: 'usr-cbe-01',
    userId: 'USR-CBE-01',
    employeeId: 'EMP-CBE-01',
    fullName: 'Test Coimbatore User',
    role: 'District Administrator',
    district: 'Coimbatore',
    mobileNumber: '+91 94432 00202',
    email: 'test.coimbatore@carebridge.tn.gov',
    assignedOrgName: 'Coimbatore District Health Office',
    status: 'Active',
    createdDate: '2026-09-01'
  },
  {
    id: 'usr-mdu-01',
    userId: 'USR-MDU-01',
    employeeId: 'EMP-MDU-01',
    fullName: 'Test Madurai User',
    role: 'District Administrator',
    district: 'Madurai',
    mobileNumber: '+91 94432 00303',
    email: 'test.madurai@carebridge.tn.gov',
    assignedOrgName: 'Madurai District Health Office',
    status: 'Active',
    createdDate: '2026-09-01'
  },
  {
    id: 'usr-chn-01',
    userId: 'USR-CHN-01',
    employeeId: 'EMP-CHN-01',
    fullName: 'Test Chennai User',
    role: 'District Administrator',
    district: 'Chennai',
    mobileNumber: '+91 94432 00404',
    email: 'test.chennai@carebridge.tn.gov',
    assignedOrgName: 'Chennai District Health Mission',
    status: 'Active',
    createdDate: '2026-09-01'
  },
  {
    id: 'usr-erd-01',
    userId: 'USR-ERD-01',
    employeeId: 'EMP-ERD-01',
    fullName: 'Test Erode User',
    role: 'District Administrator',
    district: 'Erode',
    mobileNumber: '+91 94432 00505',
    email: 'test.erode@carebridge.tn.gov',
    assignedOrgName: 'Erode District Health Office',
    status: 'Active',
    createdDate: '2026-09-01'
  },
  {
    id: 'usr-trc-01',
    userId: 'USR-TRC-01',
    employeeId: 'EMP-TRC-01',
    fullName: 'Test Tiruchirappalli User',
    role: 'District Administrator',
    district: 'Tiruchirappalli',
    mobileNumber: '+91 94432 00606',
    email: 'test.trichy@carebridge.tn.gov',
    assignedOrgName: 'Tiruchirappalli District Health Office',
    status: 'Active',
    createdDate: '2026-09-01'
  },
  {
    id: 'usr-nmk-01',
    userId: 'USR-NMK-01',
    employeeId: 'EMP-NMK-01',
    fullName: 'Test Namakkal User',
    role: 'District Administrator',
    district: 'Namakkal',
    mobileNumber: '+91 94432 00707',
    email: 'test.namakkal@carebridge.tn.gov',
    assignedOrgName: 'Namakkal District Health Office',
    status: 'Active',
    createdDate: '2026-09-01'
  },
  {
    id: 'usr-dhp-01',
    userId: 'USR-DHP-01',
    employeeId: 'EMP-DHP-01',
    fullName: 'Test Dharmapuri User',
    role: 'District Administrator',
    district: 'Dharmapuri',
    mobileNumber: '+91 94432 00808',
    email: 'test.dharmapuri@carebridge.tn.gov',
    assignedOrgName: 'Dharmapuri District Health Office',
    status: 'Active',
    createdDate: '2026-09-01'
  },
  {
    id: 'usr-demo-doc',
    userId: 'CB-DOC-000245',
    employeeId: 'EMP-8820',
    fullName: 'Dr. S. Sundararajan, MD',
    role: 'Doctor',
    district: 'Salem',
    mobileNumber: '+91 94432 10101',
    email: 'sundararajan.s@gmk_hosp.gov',
    assignedOrgName: 'Salem Mohan Kumaramangalam GMCH',
    status: 'Active',
    createdDate: '2024-01-15'
  },
  {
    id: 'usr-state-admin',
    userId: 'CB-ADM-000001',
    employeeId: 'EMP-ADM-01',
    fullName: 'Dr. J. Radhakrishnan, IAS',
    role: 'State Administrator',
    district: 'Chennai',
    mobileNumber: '+91 94431 10001',
    email: 'director.nhm@health.tn.gov.in',
    assignedOrgName: 'State Health Mission Directorate',
    status: 'Active',
    createdDate: '2024-01-01'
  }
];

// ==========================================
// SEED DATA: DISTRICTS (ALL 8 DISTRICTS)
// ==========================================

export const DISTRICTS_DATA: DistrictInfo[] = [
  {
    id: 'dist-salem',
    name: 'Salem',
    state: 'Tamil Nadu',
    population: 3488075,
    registeredPatients: 184320,
    activeHospitals: 86,
    diagnosticCentresCount: 185,
    pharmaciesCount: 420,
    doctorsCount: 1285,
    availableBeds: 4856,
    totalBeds: 6200,
    medicineStockAlerts: 72,
    teleconsultationsToday: 2845,
    emergencyCases: 48,
    status: 'Attention',
    accessibilityScore: 78,
    coordinates: { lat: 11.6643, lng: 78.1460, x: 45, y: 40 },
    scoreBreakdown: { facility: 82, doctor: 74, medicine: 70, diagnostics: 80, beds: 82, emergency: 85 }
  },
  {
    id: 'dist-coimbatore',
    name: 'Coimbatore',
    state: 'Tamil Nadu',
    population: 3458045,
    registeredPatients: 215400,
    activeHospitals: 110,
    diagnosticCentresCount: 220,
    pharmaciesCount: 510,
    doctorsCount: 1640,
    availableBeds: 5890,
    totalBeds: 7100,
    medicineStockAlerts: 34,
    teleconsultationsToday: 3410,
    emergencyCases: 32,
    status: 'Normal',
    accessibilityScore: 92,
    coordinates: { lat: 11.0168, lng: 76.9558, x: 30, y: 55 },
    scoreBreakdown: { facility: 95, doctor: 92, medicine: 90, diagnostics: 94, beds: 92, emergency: 91 }
  },
  {
    id: 'dist-chennai',
    name: 'Chennai',
    state: 'Tamil Nadu',
    population: 7088000,
    registeredPatients: 490200,
    activeHospitals: 180,
    diagnosticCentresCount: 340,
    pharmaciesCount: 890,
    doctorsCount: 3800,
    availableBeds: 9400,
    totalBeds: 11200,
    medicineStockAlerts: 41,
    teleconsultationsToday: 5120,
    emergencyCases: 64,
    status: 'Normal',
    accessibilityScore: 95,
    coordinates: { lat: 13.0827, lng: 80.2707, x: 80, y: 20 },
    scoreBreakdown: { facility: 98, doctor: 96, medicine: 94, diagnostics: 97, beds: 95, emergency: 92 }
  },
  {
    id: 'dist-madurai',
    name: 'Madurai',
    state: 'Tamil Nadu',
    population: 3038252,
    registeredPatients: 198500,
    activeHospitals: 94,
    diagnosticCentresCount: 175,
    pharmaciesCount: 380,
    doctorsCount: 1390,
    availableBeds: 4620,
    totalBeds: 5800,
    medicineStockAlerts: 56,
    teleconsultationsToday: 2450,
    emergencyCases: 41,
    status: 'Attention',
    accessibilityScore: 84,
    coordinates: { lat: 9.9252, lng: 78.1198, x: 50, y: 75 },
    scoreBreakdown: { facility: 86, doctor: 84, medicine: 80, diagnostics: 85, beds: 84, emergency: 87 }
  },
  {
    id: 'dist-erode',
    name: 'Erode',
    state: 'Tamil Nadu',
    population: 2251744,
    registeredPatients: 154200,
    activeHospitals: 68,
    diagnosticCentresCount: 130,
    pharmaciesCount: 290,
    doctorsCount: 940,
    availableBeds: 3400,
    totalBeds: 4200,
    medicineStockAlerts: 48,
    teleconsultationsToday: 1890,
    emergencyCases: 26,
    status: 'Attention',
    accessibilityScore: 81,
    coordinates: { lat: 11.3410, lng: 77.7172, x: 38, y: 48 },
    scoreBreakdown: { facility: 83, doctor: 80, medicine: 78, diagnostics: 79, beds: 80, emergency: 80 }
  },
  {
    id: 'dist-trichy',
    name: 'Tiruchirappalli',
    state: 'Tamil Nadu',
    population: 2722290,
    registeredPatients: 176400,
    activeHospitals: 78,
    diagnosticCentresCount: 160,
    pharmaciesCount: 340,
    doctorsCount: 1150,
    availableBeds: 3950,
    totalBeds: 4900,
    medicineStockAlerts: 50,
    teleconsultationsToday: 2150,
    emergencyCases: 34,
    status: 'Normal',
    accessibilityScore: 87,
    coordinates: { lat: 10.7905, lng: 78.7047, x: 60, y: 55 },
    scoreBreakdown: { facility: 89, doctor: 88, medicine: 85, diagnostics: 87, beds: 86, emergency: 89 }
  },
  {
    id: 'dist-namakkal',
    name: 'Namakkal',
    state: 'Tamil Nadu',
    population: 1726601,
    registeredPatients: 121000,
    activeHospitals: 52,
    diagnosticCentresCount: 98,
    pharmaciesCount: 210,
    doctorsCount: 680,
    availableBeds: 2450,
    totalBeds: 3100,
    medicineStockAlerts: 62,
    teleconsultationsToday: 1420,
    emergencyCases: 22,
    status: 'Attention',
    accessibilityScore: 74,
    coordinates: { lat: 11.2189, lng: 78.1674, x: 52, y: 48 },
    scoreBreakdown: { facility: 76, doctor: 72, medicine: 70, diagnostics: 74, beds: 74, emergency: 76 }
  },
  {
    id: 'dist-dharmapuri',
    name: 'Dharmapuri',
    state: 'Tamil Nadu',
    population: 1506843,
    registeredPatients: 142000,
    activeHospitals: 44,
    diagnosticCentresCount: 82,
    pharmaciesCount: 180,
    doctorsCount: 520,
    availableBeds: 1890,
    totalBeds: 2600,
    medicineStockAlerts: 88,
    teleconsultationsToday: 1120,
    emergencyCases: 38,
    status: 'Critical',
    accessibilityScore: 61,
    coordinates: { lat: 12.1211, lng: 78.1582, x: 48, y: 28 },
    scoreBreakdown: { facility: 64, doctor: 58, medicine: 54, diagnostics: 60, beds: 62, emergency: 66 }
  }
];

// ==========================================
// SEED DATA: FACILITIES (ALL 8 DISTRICTS) - CHC -> PHC
// ==========================================

export const FACILITIES_DATA: Facility[] = [
  // 1. Salem Facilities
  {
    id: 'fac-1',
    name: 'Salem Mohan Kumaramangalam Govt Medical College Hospital',
    district: 'Salem',
    taluk: 'Salem North',
    type: 'Medical College Hospital',
    doctorsCount: 185,
    nursesCount: 420,
    totalBeds: 1200,
    occupiedBeds: 1080,
    availableBeds: 120,
    icuBeds: { total: 110, occupied: 98 },
    emergencyBeds: { total: 60, occupied: 52 },
    pediatricBeds: { total: 140, occupied: 118 },
    patientsToday: 1420,
    medicineStatus: 'Optimal',
    diagnosticStatus: 'Full Service',
    facilityStatus: 'Operational',
    contactNumber: '+91 427 2211220',
    officerInCharge: 'Dr. R. Senthamilselvan, Dean',
    coordinates: { lat: 11.6643, lng: 78.1460 }
  },
  {
    id: 'fac-2',
    name: 'Omalur Government Taluk Headquarters Hospital',
    district: 'Salem',
    taluk: 'Omalur',
    type: 'Government Hospital',
    doctorsCount: 32,
    nursesCount: 68,
    totalBeds: 250,
    occupiedBeds: 236,
    availableBeds: 14,
    icuBeds: { total: 20, occupied: 19 },
    emergencyBeds: { total: 15, occupied: 14 },
    pediatricBeds: { total: 30, occupied: 26 },
    patientsToday: 480,
    medicineStatus: 'Low',
    diagnosticStatus: 'Partial',
    facilityStatus: 'High Load',
    contactNumber: '+91 4290 220110',
    officerInCharge: 'Dr. M. Vasanthi, Medical Superintendent',
    coordinates: { lat: 11.7412, lng: 78.0418 }
  },
  {
    id: 'fac-3',
    name: 'Mecheri Primary Health Centre (PHC)',
    district: 'Salem',
    taluk: 'Mettur',
    type: 'Primary Health Centre (PHC)',
    doctorsCount: 6,
    nursesCount: 14,
    totalBeds: 50,
    occupiedBeds: 42,
    availableBeds: 8,
    icuBeds: { total: 4, occupied: 4 },
    emergencyBeds: { total: 6, occupied: 5 },
    pediatricBeds: { total: 10, occupied: 8 },
    patientsToday: 195,
    medicineStatus: 'Critical',
    diagnosticStatus: 'Partial',
    facilityStatus: 'Operational',
    contactNumber: '+91 4298 278100',
    officerInCharge: 'Dr. K. Anand, Medical Officer',
    coordinates: { lat: 11.8310, lng: 77.9250 }
  },
  {
    id: 'fac-4',
    name: 'Yercaud Primary Health Centre (PHC)',
    district: 'Salem',
    taluk: 'Yercaud',
    type: 'Primary Health Centre (PHC)',
    doctorsCount: 5,
    nursesCount: 12,
    totalBeds: 40,
    occupiedBeds: 28,
    availableBeds: 12,
    icuBeds: { total: 2, occupied: 1 },
    emergencyBeds: { total: 4, occupied: 2 },
    pediatricBeds: { total: 8, occupied: 5 },
    patientsToday: 140,
    medicineStatus: 'Low',
    diagnosticStatus: 'Partial',
    facilityStatus: 'Operational',
    contactNumber: '+91 4281 222300',
    officerInCharge: 'Dr. S. Priya, Medical Officer',
    coordinates: { lat: 11.7753, lng: 78.2093 }
  },
  {
    id: 'fac-5',
    name: 'Mettur Government District Sub-Hospital',
    district: 'Salem',
    taluk: 'Mettur',
    type: 'Government Hospital',
    doctorsCount: 24,
    nursesCount: 52,
    totalBeds: 180,
    occupiedBeds: 142,
    availableBeds: 38,
    icuBeds: { total: 14, occupied: 10 },
    emergencyBeds: { total: 12, occupied: 8 },
    pediatricBeds: { total: 24, occupied: 18 },
    patientsToday: 390,
    medicineStatus: 'Optimal',
    diagnosticStatus: 'Full Service',
    facilityStatus: 'Operational',
    contactNumber: '+91 4298 244220',
    officerInCharge: 'Dr. P. Ravichandran',
    coordinates: { lat: 11.7960, lng: 77.8010 }
  },
  {
    id: 'fac-6',
    name: 'Edappadi Primary Health Centre (PHC)',
    district: 'Salem',
    taluk: 'Edappadi',
    type: 'Primary Health Centre (PHC)',
    doctorsCount: 8,
    nursesCount: 18,
    totalBeds: 60,
    occupiedBeds: 46,
    availableBeds: 14,
    icuBeds: { total: 4, occupied: 3 },
    emergencyBeds: { total: 6, occupied: 4 },
    pediatricBeds: { total: 12, occupied: 9 },
    patientsToday: 210,
    medicineStatus: 'Optimal',
    diagnosticStatus: 'Full Service',
    facilityStatus: 'Operational',
    contactNumber: '+91 4283 221400',
    officerInCharge: 'Dr. G. Manivannan',
    coordinates: { lat: 11.5830, lng: 77.8500 }
  },
  {
    id: 'fac-7',
    name: 'Salem District Central Diagnostic & Imaging Hub',
    district: 'Salem',
    taluk: 'Salem South',
    type: 'Diagnostic Centre',
    doctorsCount: 12,
    nursesCount: 24,
    totalBeds: 0,
    occupiedBeds: 0,
    availableBeds: 0,
    icuBeds: { total: 0, occupied: 0 },
    emergencyBeds: { total: 0, occupied: 0 },
    pediatricBeds: { total: 0, occupied: 0 },
    patientsToday: 540,
    medicineStatus: 'Optimal',
    diagnosticStatus: 'Full Service',
    facilityStatus: 'Operational',
    contactNumber: '+91 427 2419080',
    officerInCharge: 'Dr. T. Vijayaraghavan',
    coordinates: { lat: 11.6500, lng: 78.1600 }
  },

  // 2. Coimbatore Facilities
  {
    id: 'fac-cbe-1',
    name: 'Coimbatore Medical College Hospital (CMCH)',
    district: 'Coimbatore',
    taluk: 'Coimbatore South',
    type: 'Medical College Hospital',
    doctorsCount: 220,
    nursesCount: 510,
    totalBeds: 1500,
    occupiedBeds: 1320,
    availableBeds: 180,
    icuBeds: { total: 140, occupied: 124 },
    emergencyBeds: { total: 80, occupied: 68 },
    pediatricBeds: { total: 180, occupied: 152 },
    patientsToday: 1890,
    medicineStatus: 'Optimal',
    diagnosticStatus: 'Full Service',
    facilityStatus: 'Operational',
    contactNumber: '+91 422 2301393',
    officerInCharge: 'Dr. A. Nirmala, Dean',
    coordinates: { lat: 11.0020, lng: 76.9650 }
  },
  {
    id: 'fac-cbe-2',
    name: 'Pollachi Government Taluk Hospital',
    district: 'Coimbatore',
    taluk: 'Pollachi',
    type: 'Government Hospital',
    doctorsCount: 45,
    nursesCount: 95,
    totalBeds: 320,
    occupiedBeds: 280,
    availableBeds: 40,
    icuBeds: { total: 24, occupied: 20 },
    emergencyBeds: { total: 18, occupied: 14 },
    pediatricBeds: { total: 35, occupied: 28 },
    patientsToday: 620,
    medicineStatus: 'Optimal',
    diagnosticStatus: 'Full Service',
    facilityStatus: 'Operational',
    contactNumber: '+91 4259 223344',
    officerInCharge: 'Dr. K. Rangarajan',
    coordinates: { lat: 10.6580, lng: 77.0080 }
  },
  {
    id: 'fac-cbe-3',
    name: 'Mettupalayam Government General Hospital',
    district: 'Coimbatore',
    taluk: 'Mettupalayam',
    type: 'Government Hospital',
    doctorsCount: 28,
    nursesCount: 60,
    totalBeds: 180,
    occupiedBeds: 145,
    availableBeds: 35,
    icuBeds: { total: 12, occupied: 9 },
    emergencyBeds: { total: 10, occupied: 7 },
    pediatricBeds: { total: 20, occupied: 15 },
    patientsToday: 380,
    medicineStatus: 'Optimal',
    diagnosticStatus: 'Full Service',
    facilityStatus: 'Operational',
    contactNumber: '+91 4254 222100',
    officerInCharge: 'Dr. S. Gayathri',
    coordinates: { lat: 11.2980, lng: 76.9420 }
  },
  {
    id: 'fac-cbe-4',
    name: 'Sulur Primary Health Centre (PHC)',
    district: 'Coimbatore',
    taluk: 'Sulur',
    type: 'Primary Health Centre (PHC)',
    doctorsCount: 7,
    nursesCount: 16,
    totalBeds: 45,
    occupiedBeds: 34,
    availableBeds: 11,
    icuBeds: { total: 3, occupied: 2 },
    emergencyBeds: { total: 5, occupied: 3 },
    pediatricBeds: { total: 8, occupied: 6 },
    patientsToday: 175,
    medicineStatus: 'Optimal',
    diagnosticStatus: 'Full Service',
    facilityStatus: 'Operational',
    contactNumber: '+91 422 2687100',
    officerInCharge: 'Dr. R. Kavitha, Medical Officer',
    coordinates: { lat: 11.0250, lng: 77.1260 }
  },

  // 3. Chennai Facilities
  {
    id: 'fac-chn-1',
    name: 'Rajiv Gandhi Government General Hospital (RGGGH)',
    district: 'Chennai',
    taluk: 'Egmore',
    type: 'Medical College Hospital',
    doctorsCount: 340,
    nursesCount: 780,
    totalBeds: 2500,
    occupiedBeds: 2280,
    availableBeds: 220,
    icuBeds: { total: 220, occupied: 195 },
    emergencyBeds: { total: 120, occupied: 108 },
    pediatricBeds: { total: 280, occupied: 245 },
    patientsToday: 3200,
    medicineStatus: 'Optimal',
    diagnosticStatus: 'Full Service',
    facilityStatus: 'Operational',
    contactNumber: '+91 44 25305000',
    officerInCharge: 'Dr. E. Theranirajan, Dean',
    coordinates: { lat: 13.0800, lng: 80.2780 }
  },
  {
    id: 'fac-chn-2',
    name: 'Stanley Medical College Hospital',
    district: 'Chennai',
    taluk: 'Tondiarpet',
    type: 'Medical College Hospital',
    doctorsCount: 260,
    nursesCount: 620,
    totalBeds: 1800,
    occupiedBeds: 1650,
    availableBeds: 150,
    icuBeds: { total: 160, occupied: 142 },
    emergencyBeds: { total: 90, occupied: 82 },
    pediatricBeds: { total: 220, occupied: 190 },
    patientsToday: 2400,
    medicineStatus: 'Optimal',
    diagnosticStatus: 'Full Service',
    facilityStatus: 'Operational',
    contactNumber: '+91 44 25281351',
    officerInCharge: 'Dr. P. Balaji, Dean',
    coordinates: { lat: 13.1070, lng: 80.2870 }
  },
  {
    id: 'fac-chn-3',
    name: 'Saidapet Government Peripheral Hospital',
    district: 'Chennai',
    taluk: 'Guindy',
    type: 'Government Hospital',
    doctorsCount: 42,
    nursesCount: 88,
    totalBeds: 280,
    occupiedBeds: 245,
    availableBeds: 35,
    icuBeds: { total: 20, occupied: 17 },
    emergencyBeds: { total: 16, occupied: 13 },
    pediatricBeds: { total: 32, occupied: 26 },
    patientsToday: 580,
    medicineStatus: 'Optimal',
    diagnosticStatus: 'Full Service',
    facilityStatus: 'Operational',
    contactNumber: '+91 44 23812000',
    officerInCharge: 'Dr. S. Meenakshi',
    coordinates: { lat: 13.0210, lng: 80.2230 }
  },
  {
    id: 'fac-chn-4',
    name: 'Tondiarpet Primary Health Centre (PHC)',
    district: 'Chennai',
    taluk: 'Tondiarpet',
    type: 'Primary Health Centre (PHC)',
    doctorsCount: 8,
    nursesCount: 20,
    totalBeds: 60,
    occupiedBeds: 48,
    availableBeds: 12,
    icuBeds: { total: 4, occupied: 3 },
    emergencyBeds: { total: 6, occupied: 5 },
    pediatricBeds: { total: 12, occupied: 9 },
    patientsToday: 260,
    medicineStatus: 'Low',
    diagnosticStatus: 'Full Service',
    facilityStatus: 'Operational',
    contactNumber: '+91 44 25951234',
    officerInCharge: 'Dr. M. Shanmugam, Medical Officer',
    coordinates: { lat: 13.1250, lng: 80.2900 }
  },

  // 4. Madurai Facilities
  {
    id: 'fac-mdu-1',
    name: 'Madurai Government Rajaji Hospital (GRH)',
    district: 'Madurai',
    taluk: 'Madurai North',
    type: 'Medical College Hospital',
    doctorsCount: 210,
    nursesCount: 480,
    totalBeds: 1400,
    occupiedBeds: 1250,
    availableBeds: 150,
    icuBeds: { total: 130, occupied: 115 },
    emergencyBeds: { total: 70, occupied: 60 },
    pediatricBeds: { total: 160, occupied: 138 },
    patientsToday: 1750,
    medicineStatus: 'Optimal',
    diagnosticStatus: 'Full Service',
    facilityStatus: 'Operational',
    contactNumber: '+91 452 2532535',
    officerInCharge: 'Dr. A. Rathinavel, Dean',
    coordinates: { lat: 9.9280, lng: 78.1210 }
  },
  {
    id: 'fac-mdu-2',
    name: 'Melur Government Taluk Hospital',
    district: 'Madurai',
    taluk: 'Melur',
    type: 'Government Hospital',
    doctorsCount: 30,
    nursesCount: 65,
    totalBeds: 200,
    occupiedBeds: 168,
    availableBeds: 32,
    icuBeds: { total: 15, occupied: 12 },
    emergencyBeds: { total: 12, occupied: 9 },
    pediatricBeds: { total: 25, occupied: 19 },
    patientsToday: 420,
    medicineStatus: 'Low',
    diagnosticStatus: 'Partial',
    facilityStatus: 'Operational',
    contactNumber: '+91 4544 220200',
    officerInCharge: 'Dr. M. Soundararajan',
    coordinates: { lat: 10.0280, lng: 78.3340 }
  },
  {
    id: 'fac-mdu-3',
    name: 'Usilampatti Primary Health Centre (PHC)',
    district: 'Madurai',
    taluk: 'Usilampatti',
    type: 'Primary Health Centre (PHC)',
    doctorsCount: 6,
    nursesCount: 14,
    totalBeds: 50,
    occupiedBeds: 38,
    availableBeds: 12,
    icuBeds: { total: 3, occupied: 2 },
    emergencyBeds: { total: 4, occupied: 3 },
    pediatricBeds: { total: 8, occupied: 6 },
    patientsToday: 180,
    medicineStatus: 'Optimal',
    diagnosticStatus: 'Full Service',
    facilityStatus: 'Operational',
    contactNumber: '+91 4552 252100',
    officerInCharge: 'Dr. T. Sivakumar, Medical Officer',
    coordinates: { lat: 9.9670, lng: 77.7940 }
  },

  // 5. Erode Facilities
  {
    id: 'fac-erd-1',
    name: 'Government Erode Medical College Hospital (Perundurai)',
    district: 'Erode',
    taluk: 'Perundurai',
    type: 'Medical College Hospital',
    doctorsCount: 160,
    nursesCount: 380,
    totalBeds: 950,
    occupiedBeds: 820,
    availableBeds: 130,
    icuBeds: { total: 85, occupied: 72 },
    emergencyBeds: { total: 45, occupied: 38 },
    pediatricBeds: { total: 110, occupied: 94 },
    patientsToday: 1280,
    medicineStatus: 'Optimal',
    diagnosticStatus: 'Full Service',
    facilityStatus: 'Operational',
    contactNumber: '+91 4294 220910',
    officerInCharge: 'Dr. C. Murugesan, Dean',
    coordinates: { lat: 11.2750, lng: 77.5850 }
  },
  {
    id: 'fac-erd-2',
    name: 'Gobichettipalayam Government Taluk Hospital',
    district: 'Erode',
    taluk: 'Gobichettipalayam',
    type: 'Government Hospital',
    doctorsCount: 34,
    nursesCount: 72,
    totalBeds: 240,
    occupiedBeds: 205,
    availableBeds: 35,
    icuBeds: { total: 18, occupied: 15 },
    emergencyBeds: { total: 14, occupied: 11 },
    pediatricBeds: { total: 28, occupied: 22 },
    patientsToday: 460,
    medicineStatus: 'Optimal',
    diagnosticStatus: 'Full Service',
    facilityStatus: 'Operational',
    contactNumber: '+91 4285 222120',
    officerInCharge: 'Dr. V. Gomathi, Medical Superintendent',
    coordinates: { lat: 11.4550, lng: 77.4420 }
  },
  {
    id: 'fac-erd-3',
    name: 'Bhavani Primary Health Centre (PHC)',
    district: 'Erode',
    taluk: 'Bhavani',
    type: 'Primary Health Centre (PHC)',
    doctorsCount: 6,
    nursesCount: 15,
    totalBeds: 45,
    occupiedBeds: 36,
    availableBeds: 9,
    icuBeds: { total: 3, occupied: 2 },
    emergencyBeds: { total: 5, occupied: 4 },
    pediatricBeds: { total: 8, occupied: 6 },
    patientsToday: 190,
    medicineStatus: 'Low',
    diagnosticStatus: 'Partial',
    facilityStatus: 'Operational',
    contactNumber: '+91 4256 230100',
    officerInCharge: 'Dr. K. Senthil, Medical Officer',
    coordinates: { lat: 11.4500, lng: 77.6800 }
  },

  // 6. Tiruchirappalli Facilities
  {
    id: 'fac-trc-1',
    name: 'Mahatma Gandhi Memorial Govt Hospital (Trichy MGMGH)',
    district: 'Tiruchirappalli',
    taluk: 'Trichy West',
    type: 'Medical College Hospital',
    doctorsCount: 195,
    nursesCount: 440,
    totalBeds: 1350,
    occupiedBeds: 1190,
    availableBeds: 160,
    icuBeds: { total: 120, occupied: 104 },
    emergencyBeds: { total: 65, occupied: 56 },
    pediatricBeds: { total: 150, occupied: 128 },
    patientsToday: 1620,
    medicineStatus: 'Optimal',
    diagnosticStatus: 'Full Service',
    facilityStatus: 'Operational',
    contactNumber: '+91 431 2412521',
    officerInCharge: 'Dr. K. Vanitha, Dean',
    coordinates: { lat: 10.8150, lng: 78.6920 }
  },
  {
    id: 'fac-trc-2',
    name: 'Manapparai Government District Headquarters Hospital',
    district: 'Tiruchirappalli',
    taluk: 'Manapparai',
    type: 'Government Hospital',
    doctorsCount: 36,
    nursesCount: 78,
    totalBeds: 260,
    occupiedBeds: 228,
    availableBeds: 32,
    icuBeds: { total: 18, occupied: 15 },
    emergencyBeds: { total: 15, occupied: 12 },
    pediatricBeds: { total: 30, occupied: 24 },
    patientsToday: 510,
    medicineStatus: 'Optimal',
    diagnosticStatus: 'Full Service',
    facilityStatus: 'Operational',
    contactNumber: '+91 4332 260110',
    officerInCharge: 'Dr. N. Rajesh',
    coordinates: { lat: 10.6080, lng: 78.4150 }
  },
  {
    id: 'fac-trc-3',
    name: 'Thottiyam Primary Health Centre (PHC)',
    district: 'Tiruchirappalli',
    taluk: 'Thottiyam',
    type: 'Primary Health Centre (PHC)',
    doctorsCount: 7,
    nursesCount: 16,
    totalBeds: 50,
    occupiedBeds: 41,
    availableBeds: 9,
    icuBeds: { total: 3, occupied: 3 },
    emergencyBeds: { total: 5, occupied: 4 },
    pediatricBeds: { total: 10, occupied: 7 },
    patientsToday: 215,
    medicineStatus: 'Optimal',
    diagnosticStatus: 'Full Service',
    facilityStatus: 'Operational',
    contactNumber: '+91 4326 254200',
    officerInCharge: 'Dr. P. Manickam, Medical Officer',
    coordinates: { lat: 11.0020, lng: 78.3300 }
  },

  // 7. Namakkal Facilities
  {
    id: 'fac-nmk-1',
    name: 'Namakkal Government Medical College Hospital',
    district: 'Namakkal',
    taluk: 'Namakkal',
    type: 'Medical College Hospital',
    doctorsCount: 140,
    nursesCount: 320,
    totalBeds: 750,
    occupiedBeds: 640,
    availableBeds: 110,
    icuBeds: { total: 65, occupied: 54 },
    emergencyBeds: { total: 35, occupied: 28 },
    pediatricBeds: { total: 80, occupied: 68 },
    patientsToday: 980,
    medicineStatus: 'Optimal',
    diagnosticStatus: 'Full Service',
    facilityStatus: 'Operational',
    contactNumber: '+91 4286 220300',
    officerInCharge: 'Dr. K. Shanthi, Dean',
    coordinates: { lat: 11.2210, lng: 78.1690 }
  },
  {
    id: 'fac-nmk-2',
    name: 'Tiruchengode Government Taluk Hospital',
    district: 'Namakkal',
    taluk: 'Tiruchengode',
    type: 'Government Hospital',
    doctorsCount: 28,
    nursesCount: 62,
    totalBeds: 190,
    occupiedBeds: 164,
    availableBeds: 26,
    icuBeds: { total: 14, occupied: 11 },
    emergencyBeds: { total: 12, occupied: 9 },
    pediatricBeds: { total: 22, occupied: 17 },
    patientsToday: 390,
    medicineStatus: 'Low',
    diagnosticStatus: 'Partial',
    facilityStatus: 'Operational',
    contactNumber: '+91 4288 252110',
    officerInCharge: 'Dr. S. Thangaraj',
    coordinates: { lat: 11.3800, lng: 77.8960 }
  },
  {
    id: 'fac-nmk-3',
    name: 'Kolli Hills Tribal Primary Health Centre (PHC)',
    district: 'Namakkal',
    taluk: 'Kolli Hills',
    type: 'Primary Health Centre (PHC)',
    doctorsCount: 5,
    nursesCount: 12,
    totalBeds: 35,
    occupiedBeds: 24,
    availableBeds: 11,
    icuBeds: { total: 2, occupied: 1 },
    emergencyBeds: { total: 4, occupied: 2 },
    pediatricBeds: { total: 6, occupied: 4 },
    patientsToday: 130,
    medicineStatus: 'Low',
    diagnosticStatus: 'Partial',
    facilityStatus: 'Operational',
    contactNumber: '+91 4286 247200',
    officerInCharge: 'Dr. A. Saradha, Medical Officer',
    coordinates: { lat: 11.2480, lng: 78.3390 }
  },

  // 8. Dharmapuri Facilities
  {
    id: 'fac-dhp-1',
    name: 'Dharmapuri Government Medical College Hospital',
    district: 'Dharmapuri',
    taluk: 'Dharmapuri',
    type: 'Medical College Hospital',
    doctorsCount: 150,
    nursesCount: 340,
    totalBeds: 850,
    occupiedBeds: 760,
    availableBeds: 90,
    icuBeds: { total: 75, occupied: 68 },
    emergencyBeds: { total: 40, occupied: 36 },
    pediatricBeds: { total: 95, occupied: 86 },
    patientsToday: 1140,
    medicineStatus: 'Low',
    diagnosticStatus: 'Full Service',
    facilityStatus: 'High Load',
    contactNumber: '+91 4342 233000',
    officerInCharge: 'Dr. K. Amirthaganesan, Dean',
    coordinates: { lat: 12.1280, lng: 78.1620 }
  },
  {
    id: 'fac-dhp-2',
    name: 'Harur Government Taluk Hospital',
    district: 'Dharmapuri',
    taluk: 'Harur',
    type: 'Government Hospital',
    doctorsCount: 26,
    nursesCount: 58,
    totalBeds: 160,
    occupiedBeds: 142,
    availableBeds: 18,
    icuBeds: { total: 10, occupied: 9 },
    emergencyBeds: { total: 10, occupied: 8 },
    pediatricBeds: { total: 18, occupied: 15 },
    patientsToday: 360,
    medicineStatus: 'Critical',
    diagnosticStatus: 'Partial',
    facilityStatus: 'High Load',
    contactNumber: '+91 4346 222010',
    officerInCharge: 'Dr. R. Loganathan',
    coordinates: { lat: 12.0600, lng: 78.4900 }
  },
  {
    id: 'fac-dhp-3',
    name: 'Pennagaram Primary Health Centre (PHC)',
    district: 'Dharmapuri',
    taluk: 'Pennagaram',
    type: 'Primary Health Centre (PHC)',
    doctorsCount: 5,
    nursesCount: 14,
    totalBeds: 40,
    occupiedBeds: 35,
    availableBeds: 5,
    icuBeds: { total: 2, occupied: 2 },
    emergencyBeds: { total: 4, occupied: 3 },
    pediatricBeds: { total: 8, occupied: 7 },
    patientsToday: 185,
    medicineStatus: 'Critical',
    diagnosticStatus: 'Partial',
    facilityStatus: 'Critical',
    contactNumber: '+91 4342 255100',
    officerInCharge: 'Dr. M. Elango, Medical Officer',
    coordinates: { lat: 12.1300, lng: 77.9000 }
  }
];

// ==========================================
// SEED DATA: DOCTORS (ALL 8 DISTRICTS) - CHC -> PHC
// ==========================================

export const DOCTORS_DATA: Doctor[] = [
  // Salem Doctors
  {
    id: 'doc-1',
    name: 'Dr. A. Sundararajan, MD',
    specialization: 'General Medicine',
    facilityName: 'Salem Mohan Kumaramangalam Govt Medical College Hospital',
    facilityType: 'Medical College Hospital',
    district: 'Salem',
    taluk: 'Salem North',
    availability: 'In Consultation',
    consultationLoadToday: 38,
    teleconsultationAvailable: true,
    contact: '+91 94432 10101',
    experienceYears: 18
  },
  {
    id: 'doc-2',
    name: 'Dr. V. Deepa, MS, DGO',
    specialization: 'Gynecology',
    facilityName: 'Salem Mohan Kumaramangalam Govt Medical College Hospital',
    facilityType: 'Medical College Hospital',
    district: 'Salem',
    taluk: 'Salem North',
    availability: 'Emergency Duty',
    consultationLoadToday: 29,
    teleconsultationAvailable: false,
    contact: '+91 94432 10102',
    experienceYears: 14
  },
  {
    id: 'doc-3',
    name: 'Dr. M. Senthil Kumar, DM',
    specialization: 'Cardiology',
    facilityName: 'Salem Mohan Kumaramangalam Govt Medical College Hospital',
    facilityType: 'Medical College Hospital',
    district: 'Salem',
    taluk: 'Salem North',
    availability: 'Available',
    consultationLoadToday: 24,
    teleconsultationAvailable: true,
    contact: '+91 94432 10103',
    experienceYears: 16
  },
  {
    id: 'doc-4',
    name: 'Dr. K. Anand, MBBS',
    specialization: 'General Medicine',
    facilityName: 'Mecheri Primary Health Centre (PHC)',
    facilityType: 'Primary Health Centre (PHC)',
    district: 'Salem',
    taluk: 'Mettur',
    availability: 'In Consultation',
    consultationLoadToday: 42,
    teleconsultationAvailable: true,
    contact: '+91 94432 10104',
    experienceYears: 6
  },
  {
    id: 'doc-5',
    name: 'Dr. S. Priya, MBBS, DCH',
    specialization: 'Pediatrics',
    facilityName: 'Yercaud Primary Health Centre (PHC)',
    facilityType: 'Primary Health Centre (PHC)',
    district: 'Salem',
    taluk: 'Yercaud',
    availability: 'In Consultation',
    consultationLoadToday: 31,
    teleconsultationAvailable: true,
    contact: '+91 94432 10105',
    experienceYears: 9
  },

  // Coimbatore Doctors
  {
    id: 'doc-cbe-1',
    name: 'Dr. K. Rangarajan, MS',
    specialization: 'General Medicine',
    facilityName: 'Coimbatore Medical College Hospital (CMCH)',
    facilityType: 'Medical College Hospital',
    district: 'Coimbatore',
    taluk: 'Coimbatore South',
    availability: 'Available',
    consultationLoadToday: 34,
    teleconsultationAvailable: true,
    contact: '+91 94422 11001',
    experienceYears: 19
  },
  {
    id: 'doc-cbe-2',
    name: 'Dr. S. Gayathri, MD (Pediatrics)',
    specialization: 'Pediatrics',
    facilityName: 'Coimbatore Medical College Hospital (CMCH)',
    facilityType: 'Medical College Hospital',
    district: 'Coimbatore',
    taluk: 'Coimbatore South',
    availability: 'In Consultation',
    consultationLoadToday: 28,
    teleconsultationAvailable: true,
    contact: '+91 94422 11002',
    experienceYears: 12
  },
  {
    id: 'doc-cbe-3',
    name: 'Dr. M. Balamurugan, DM (Cardiology)',
    specialization: 'Cardiology',
    facilityName: 'Pollachi Government Taluk Hospital',
    facilityType: 'Government Hospital',
    district: 'Coimbatore',
    taluk: 'Pollachi',
    availability: 'Available',
    consultationLoadToday: 22,
    teleconsultationAvailable: true,
    contact: '+91 94422 11003',
    experienceYears: 15
  },

  // Chennai Doctors
  {
    id: 'doc-chn-1',
    name: 'Dr. E. Theranirajan, MD',
    specialization: 'General Medicine',
    facilityName: 'Rajiv Gandhi Government General Hospital (RGGGH)',
    facilityType: 'Medical College Hospital',
    district: 'Chennai',
    taluk: 'Egmore',
    availability: 'Available',
    consultationLoadToday: 45,
    teleconsultationAvailable: true,
    contact: '+91 94440 33001',
    experienceYears: 22
  },
  {
    id: 'doc-chn-2',
    name: 'Dr. R. Shanthi, MS (Orthopedics)',
    specialization: 'Orthopedics',
    facilityName: 'Stanley Medical College Hospital',
    facilityType: 'Medical College Hospital',
    district: 'Chennai',
    taluk: 'Tondiarpet',
    availability: 'Emergency Duty',
    consultationLoadToday: 32,
    teleconsultationAvailable: false,
    contact: '+91 94440 33002',
    experienceYears: 16
  },
  {
    id: 'doc-chn-3',
    name: 'Dr. M. Shanmugam, MBBS',
    specialization: 'General Medicine',
    facilityName: 'Tondiarpet Primary Health Centre (PHC)',
    facilityType: 'Primary Health Centre (PHC)',
    district: 'Chennai',
    taluk: 'Tondiarpet',
    availability: 'In Consultation',
    consultationLoadToday: 36,
    teleconsultationAvailable: true,
    contact: '+91 94440 33003',
    experienceYears: 8
  },

  // Madurai Doctors
  {
    id: 'doc-mdu-1',
    name: 'Dr. T. Murugesan, MD',
    specialization: 'General Medicine',
    facilityName: 'Madurai Government Rajaji Hospital (GRH)',
    facilityType: 'Medical College Hospital',
    district: 'Madurai',
    taluk: 'Madurai North',
    availability: 'In Consultation',
    consultationLoadToday: 36,
    teleconsultationAvailable: true,
    contact: '+91 94433 22001',
    experienceYears: 17
  },
  {
    id: 'doc-mdu-2',
    name: 'Dr. P. Vasanthi, MS (OBG)',
    specialization: 'Gynecology',
    facilityName: 'Madurai Government Rajaji Hospital (GRH)',
    facilityType: 'Medical College Hospital',
    district: 'Madurai',
    taluk: 'Madurai North',
    availability: 'Emergency Duty',
    consultationLoadToday: 30,
    teleconsultationAvailable: false,
    contact: '+91 94433 22002',
    experienceYears: 13
  },
  {
    id: 'doc-mdu-3',
    name: 'Dr. T. Sivakumar, MBBS',
    specialization: 'General Medicine',
    facilityName: 'Usilampatti Primary Health Centre (PHC)',
    facilityType: 'Primary Health Centre (PHC)',
    district: 'Madurai',
    taluk: 'Usilampatti',
    availability: 'Available',
    consultationLoadToday: 26,
    teleconsultationAvailable: true,
    contact: '+91 94433 22003',
    experienceYears: 10
  },

  // Erode Doctors
  {
    id: 'doc-erd-1',
    name: 'Dr. C. Murugesan, MD',
    specialization: 'General Medicine',
    facilityName: 'Government Erode Medical College Hospital (Perundurai)',
    facilityType: 'Medical College Hospital',
    district: 'Erode',
    taluk: 'Perundurai',
    availability: 'Available',
    consultationLoadToday: 33,
    teleconsultationAvailable: true,
    contact: '+91 94425 44001',
    experienceYears: 18
  },
  {
    id: 'doc-erd-2',
    name: 'Dr. V. Gomathi, MD (Pediatrics)',
    specialization: 'Pediatrics',
    facilityName: 'Gobichettipalayam Government Taluk Hospital',
    facilityType: 'Government Hospital',
    district: 'Erode',
    taluk: 'Gobichettipalayam',
    availability: 'In Consultation',
    consultationLoadToday: 27,
    teleconsultationAvailable: true,
    contact: '+91 94425 44002',
    experienceYears: 14
  },
  {
    id: 'doc-erd-3',
    name: 'Dr. K. Senthil, MBBS',
    specialization: 'General Medicine',
    facilityName: 'Bhavani Primary Health Centre (PHC)',
    facilityType: 'Primary Health Centre (PHC)',
    district: 'Erode',
    taluk: 'Bhavani',
    availability: 'In Consultation',
    consultationLoadToday: 39,
    teleconsultationAvailable: true,
    contact: '+91 94425 44003',
    experienceYears: 7
  },

  // Tiruchirappalli Doctors
  {
    id: 'doc-trc-1',
    name: 'Dr. K. Vanitha, MD',
    specialization: 'General Medicine',
    facilityName: 'Mahatma Gandhi Memorial Govt Hospital (Trichy MGMGH)',
    facilityType: 'Medical College Hospital',
    district: 'Tiruchirappalli',
    taluk: 'Trichy West',
    availability: 'Available',
    consultationLoadToday: 41,
    teleconsultationAvailable: true,
    contact: '+91 94438 55001',
    experienceYears: 20
  },
  {
    id: 'doc-trc-2',
    name: 'Dr. N. Rajesh, MS (Emergency)',
    specialization: 'Emergency Medicine',
    facilityName: 'Manapparai Government District Headquarters Hospital',
    facilityType: 'Government Hospital',
    district: 'Tiruchirappalli',
    taluk: 'Manapparai',
    availability: 'Emergency Duty',
    consultationLoadToday: 35,
    teleconsultationAvailable: false,
    contact: '+91 94438 55002',
    experienceYears: 11
  },
  {
    id: 'doc-trc-3',
    name: 'Dr. P. Manickam, MBBS',
    specialization: 'General Medicine',
    facilityName: 'Thottiyam Primary Health Centre (PHC)',
    facilityType: 'Primary Health Centre (PHC)',
    district: 'Tiruchirappalli',
    taluk: 'Thottiyam',
    availability: 'In Consultation',
    consultationLoadToday: 29,
    teleconsultationAvailable: true,
    contact: '+91 94438 55003',
    experienceYears: 9
  },

  // Namakkal Doctors
  {
    id: 'doc-nmk-1',
    name: 'Dr. K. Shanthi, MD (Cardiology)',
    specialization: 'Cardiology',
    facilityName: 'Namakkal Government Medical College Hospital',
    facilityType: 'Medical College Hospital',
    district: 'Namakkal',
    taluk: 'Namakkal',
    availability: 'Available',
    consultationLoadToday: 28,
    teleconsultationAvailable: true,
    contact: '+91 94436 66001',
    experienceYears: 16
  },
  {
    id: 'doc-nmk-2',
    name: 'Dr. S. Thangaraj, MS',
    specialization: 'General Medicine',
    facilityName: 'Tiruchengode Government Taluk Hospital',
    facilityType: 'Government Hospital',
    district: 'Namakkal',
    taluk: 'Tiruchengode',
    availability: 'In Consultation',
    consultationLoadToday: 31,
    teleconsultationAvailable: true,
    contact: '+91 94436 66002',
    experienceYears: 13
  },
  {
    id: 'doc-nmk-3',
    name: 'Dr. A. Saradha, MBBS',
    specialization: 'General Medicine',
    facilityName: 'Kolli Hills Tribal Primary Health Centre (PHC)',
    facilityType: 'Primary Health Centre (PHC)',
    district: 'Namakkal',
    taluk: 'Kolli Hills',
    availability: 'Available',
    consultationLoadToday: 24,
    teleconsultationAvailable: true,
    contact: '+91 94436 66003',
    experienceYears: 8
  },

  // Dharmapuri Doctors
  {
    id: 'doc-dhp-1',
    name: 'Dr. K. Amirthaganesan, MD',
    specialization: 'General Medicine',
    facilityName: 'Dharmapuri Government Medical College Hospital',
    facilityType: 'Medical College Hospital',
    district: 'Dharmapuri',
    taluk: 'Dharmapuri',
    availability: 'In Consultation',
    consultationLoadToday: 48,
    teleconsultationAvailable: true,
    contact: '+91 94437 77001',
    experienceYears: 21
  },
  {
    id: 'doc-dhp-2',
    name: 'Dr. R. Loganathan, MD (Pediatrics)',
    specialization: 'Pediatrics',
    facilityName: 'Harur Government Taluk Hospital',
    facilityType: 'Government Hospital',
    district: 'Dharmapuri',
    taluk: 'Harur',
    availability: 'Emergency Duty',
    consultationLoadToday: 37,
    teleconsultationAvailable: false,
    contact: '+91 94437 77002',
    experienceYears: 12
  },
  {
    id: 'doc-dhp-3',
    name: 'Dr. M. Elango, MBBS',
    specialization: 'General Medicine',
    facilityName: 'Pennagaram Primary Health Centre (PHC)',
    facilityType: 'Primary Health Centre (PHC)',
    district: 'Dharmapuri',
    taluk: 'Pennagaram',
    availability: 'In Consultation',
    consultationLoadToday: 44,
    teleconsultationAvailable: true,
    contact: '+91 94437 77003',
    experienceYears: 6
  }
];

// ==========================================
// SEED DATA: MASKED PATIENTS (ALL 8 DISTRICTS) - CHC -> PHC
// ==========================================

export const MASKED_PATIENTS_DATA: MaskedPatient[] = [
  // Salem Patients
  {
    id: 'PAT-90812',
    patientCode: 'TN-SLM-9182-XXXX',
    patientNameMasked: 'M****h K****r',
    age: 44,
    gender: 'Male',
    district: 'Salem',
    taluk: 'Mettur',
    category: 'Rural',
    facilityName: 'Mecheri Primary Health Centre (PHC)',
    registrationDate: '2026-09-02',
    patientStatus: 'Follow-up Required',
    primaryDiagnosis: 'Suspected Dengue Hemorrhagic Fever with Thrombocytopenia',
    contactMasked: '+91 98421 XXXXX'
  },
  {
    id: 'PAT-90813',
    patientCode: 'TN-SLM-3341-XXXX',
    patientNameMasked: 'S****a R***i',
    age: 27,
    gender: 'Female',
    district: 'Salem',
    taluk: 'Yercaud',
    category: 'Tribal',
    facilityName: 'Yercaud Primary Health Centre (PHC)',
    registrationDate: '2026-09-05',
    patientStatus: 'Active',
    primaryDiagnosis: 'High-Risk Pregnancy (Gestational Diabetes + Severe Anemia)',
    contactMasked: '+91 94432 XXXXX'
  },
  {
    id: 'PAT-90814',
    patientCode: 'TN-SLM-7762-XXXX',
    patientNameMasked: 'R****u P****i',
    age: 62,
    gender: 'Male',
    district: 'Salem',
    taluk: 'Omalur',
    category: 'Rural',
    facilityName: 'Omalur GH',
    registrationDate: '2026-09-06',
    patientStatus: 'Active',
    primaryDiagnosis: 'Type 2 Diabetes Mellitus with Peripheral Neuropathy',
    contactMasked: '+91 97890 XXXXX'
  },

  // Coimbatore Patients
  {
    id: 'PAT-CBE-101',
    patientCode: 'TN-CBE-1021-XXXX',
    patientNameMasked: 'K****n S****i',
    age: 52,
    gender: 'Male',
    district: 'Coimbatore',
    taluk: 'Pollachi',
    category: 'Rural',
    facilityName: 'Pollachi Government Taluk Hospital',
    registrationDate: '2026-09-06',
    patientStatus: 'Active',
    primaryDiagnosis: 'Hypertensive Urgency with Angina',
    contactMasked: '+91 98422 XXXXX'
  },
  {
    id: 'PAT-CBE-102',
    patientCode: 'TN-CBE-3042-XXXX',
    patientNameMasked: 'V****a M****n',
    age: 31,
    gender: 'Female',
    district: 'Coimbatore',
    taluk: 'Coimbatore South',
    category: 'Urban',
    facilityName: 'Coimbatore Medical College Hospital (CMCH)',
    registrationDate: '2026-09-07',
    patientStatus: 'Treatment Completed',
    primaryDiagnosis: 'Acute Gastroenteritis with Mild Dehydration',
    contactMasked: '+91 97891 XXXXX'
  },

  // Chennai Patients
  {
    id: 'PAT-CHN-101',
    patientCode: 'TN-CHN-8812-XXXX',
    patientNameMasked: 'G****h B****u',
    age: 49,
    gender: 'Male',
    district: 'Chennai',
    taluk: 'Egmore',
    category: 'Urban',
    facilityName: 'Rajiv Gandhi Government General Hospital (RGGGH)',
    registrationDate: '2026-09-07',
    patientStatus: 'Active',
    primaryDiagnosis: 'Coronary Artery Disease - Post PCI Evaluation',
    contactMasked: '+91 94440 XXXXX'
  },
  {
    id: 'PAT-CHN-102',
    patientCode: 'TN-CHN-9034-XXXX',
    patientNameMasked: 'L****a K****n',
    age: 24,
    gender: 'Female',
    district: 'Chennai',
    taluk: 'Tondiarpet',
    category: 'Urban',
    facilityName: 'Tondiarpet Primary Health Centre (PHC)',
    registrationDate: '2026-09-06',
    patientStatus: 'Active',
    primaryDiagnosis: 'Acute Viral Fever with Upper Respiratory Tract Infection',
    contactMasked: '+91 94441 XXXXX'
  },

  // Madurai Patients
  {
    id: 'PAT-MDU-201',
    patientCode: 'TN-MDU-8812-XXXX',
    patientNameMasked: 'P****i T****r',
    age: 67,
    gender: 'Male',
    district: 'Madurai',
    taluk: 'Melur',
    category: 'Rural',
    facilityName: 'Melur Government Taluk Hospital',
    registrationDate: '2026-09-05',
    patientStatus: 'Active',
    primaryDiagnosis: 'Chronic Obstructive Pulmonary Disease (COPD)',
    contactMasked: '+91 94433 XXXXX'
  },

  // Erode Patients
  {
    id: 'PAT-ERD-101',
    patientCode: 'TN-ERD-4412-XXXX',
    patientNameMasked: 'C****n P****i',
    age: 58,
    gender: 'Male',
    district: 'Erode',
    taluk: 'Bhavani',
    category: 'Rural',
    facilityName: 'Bhavani Primary Health Centre (PHC)',
    registrationDate: '2026-09-06',
    patientStatus: 'Active',
    primaryDiagnosis: 'Occupational Allergic Dermatitis and Bronchial Asthma',
    contactMasked: '+91 94425 XXXXX'
  },

  // Tiruchirappalli Patients
  {
    id: 'PAT-TRC-101',
    patientCode: 'TN-TRC-6721-XXXX',
    patientNameMasked: 'B****u S****m',
    age: 38,
    gender: 'Male',
    district: 'Tiruchirappalli',
    taluk: 'Thottiyam',
    category: 'Rural',
    facilityName: 'Thottiyam Primary Health Centre (PHC)',
    registrationDate: '2026-09-05',
    patientStatus: 'Active',
    primaryDiagnosis: 'Acute Pyrexia of Unknown Origin (PUO)',
    contactMasked: '+91 94438 XXXXX'
  },

  // Namakkal Patients
  {
    id: 'PAT-NMK-101',
    patientCode: 'TN-NMK-2291-XXXX',
    patientNameMasked: 'M****n R***i',
    age: 29,
    gender: 'Female',
    district: 'Namakkal',
    taluk: 'Kolli Hills',
    category: 'Tribal',
    facilityName: 'Kolli Hills Tribal Primary Health Centre (PHC)',
    registrationDate: '2026-09-04',
    patientStatus: 'Follow-up Required',
    primaryDiagnosis: 'Severe Nutritional Anemia (Hb 6.8 g/dL) in 2nd Trimester',
    contactMasked: '+91 94436 XXXXX'
  },

  // Dharmapuri Patients
  {
    id: 'PAT-DHP-101',
    patientCode: 'TN-DHP-8120-XXXX',
    patientNameMasked: 'K****r V****u',
    age: 41,
    gender: 'Male',
    district: 'Dharmapuri',
    taluk: 'Pennagaram',
    category: 'Rural',
    facilityName: 'Pennagaram Primary Health Centre (PHC)',
    registrationDate: '2026-09-07',
    patientStatus: 'Active',
    primaryDiagnosis: 'Suspected Plasmodium Vivax Malaria with Rigors',
    contactMasked: '+91 94437 XXXXX'
  }
];

// ==========================================
// SEED DATA: TELEMEDICINE (ALL 8 DISTRICTS)
// ==========================================

export const TELEMEDICINE_SESSIONS_DATA: TelemedicineSession[] = [
  {
    id: 'TELE-901',
    patientRef: 'TN-SLM-8812-XXXX',
    patientName: 'Devaki S (39F)',
    doctorName: 'Dr. M. Senthil Kumar',
    specialty: 'Cardiology',
    district: 'Salem',
    facility: 'Yercaud Tele-booth',
    scheduledTime: '11:30 AM Today',
    durationMins: 18,
    status: 'Active',
    networkQuality: 'Good'
  },
  {
    id: 'TELE-902',
    patientRef: 'TN-CBE-1021-XXXX',
    patientName: 'Thangaraj M (52M)',
    doctorName: 'Dr. K. Rangarajan',
    specialty: 'General Medicine',
    district: 'Coimbatore',
    facility: 'Pollachi Tele-clinic',
    scheduledTime: '12:00 PM Today',
    durationMins: 0,
    status: 'Waiting',
    networkQuality: 'Good'
  },
  {
    id: 'TELE-903',
    patientRef: 'TN-MDU-8812-XXXX',
    patientName: 'Anitha B (23F)',
    doctorName: 'Dr. P. Vasanthi',
    specialty: 'Gynecology',
    district: 'Madurai',
    facility: 'Melur Tele-unit',
    scheduledTime: '10:15 AM Today',
    durationMins: 22,
    status: 'Completed',
    networkQuality: 'Good'
  },
  {
    id: 'TELE-904',
    patientRef: 'TN-CHN-8812-XXXX',
    patientName: 'Gopinath B (49M)',
    doctorName: 'Dr. E. Theranirajan',
    specialty: 'General Medicine',
    district: 'Chennai',
    facility: 'Tondiarpet Tele-suite',
    scheduledTime: '01:00 PM Today',
    durationMins: 15,
    status: 'Active',
    networkQuality: 'Good'
  },
  {
    id: 'TELE-905',
    patientRef: 'TN-ERD-4412-XXXX',
    patientName: 'Chinnasamy P (58M)',
    doctorName: 'Dr. C. Murugesan',
    specialty: 'General Medicine',
    district: 'Erode',
    facility: 'Bhavani e-Sanjeevani Point',
    scheduledTime: '02:15 PM Today',
    durationMins: 0,
    status: 'Waiting',
    networkQuality: 'Moderate'
  },
  {
    id: 'TELE-906',
    patientRef: 'TN-TRC-6721-XXXX',
    patientName: 'Balu S (38M)',
    doctorName: 'Dr. K. Vanitha',
    specialty: 'General Medicine',
    district: 'Tiruchirappalli',
    facility: 'Thottiyam Tele-pod',
    scheduledTime: '02:45 PM Today',
    durationMins: 0,
    status: 'Waiting',
    networkQuality: 'Good'
  },
  {
    id: 'TELE-907',
    patientRef: 'TN-NMK-2291-XXXX',
    patientName: 'Manimegalai R (29F)',
    doctorName: 'Dr. K. Shanthi',
    specialty: 'Cardiology',
    district: 'Namakkal',
    facility: 'Kolli Hills Satellite Hub',
    scheduledTime: '03:00 PM Today',
    durationMins: 0,
    status: 'Waiting',
    networkQuality: 'Moderate'
  },
  {
    id: 'TELE-908',
    patientRef: 'TN-DHP-8120-XXXX',
    patientName: 'Kumar V (41M)',
    doctorName: 'Dr. K. Amirthaganesan',
    specialty: 'General Medicine',
    district: 'Dharmapuri',
    facility: 'Pennagaram Tele-link',
    scheduledTime: '03:30 PM Today',
    durationMins: 0,
    status: 'Waiting',
    networkQuality: 'Good'
  }
];

// ==========================================
// SEED DATA: MEDICINE INVENTORY (ALL 8 DISTRICTS) - CHC -> PHC
// ==========================================

export const MEDICINE_INVENTORY_DATA: MedicineInventoryItem[] = [
  // Salem Medicines
  {
    id: 'MED-101',
    name: 'Paracetamol 500mg Tablets',
    category: 'Analgesics',
    facility: 'Mecheri Primary Health Centre (PHC)',
    facilityType: 'Primary Health Centre (PHC)',
    district: 'Salem',
    availableQuantity: 420,
    minimumStockThreshold: 1500,
    unit: 'Tablets',
    expiryDate: '2027-08-30',
    status: 'Critical',
    dailyConsumption: 180,
    daysRemaining: 2.3,
    batchNumber: 'PCM-2025-091'
  },
  {
    id: 'MED-102',
    name: 'Polyvalent Snake Anti-Venom (Lyophilized 10ml)',
    category: 'Emergency Fluids & Vaccines',
    facility: 'Mecheri Primary Health Centre (PHC)',
    facilityType: 'Primary Health Centre (PHC)',
    district: 'Salem',
    availableQuantity: 2,
    minimumStockThreshold: 10,
    unit: 'Vials',
    expiryDate: '2026-12-15',
    status: 'Critical',
    dailyConsumption: 1,
    daysRemaining: 2.0,
    batchNumber: 'SAV-2024-881'
  },
  {
    id: 'MED-103',
    name: 'Human Regular Insulin 40IU/ml',
    category: 'Anti-Diabetic',
    facility: 'Omalur Taluk Hospital',
    facilityType: 'Government Hospital',
    district: 'Salem',
    availableQuantity: 38,
    minimumStockThreshold: 100,
    unit: 'Vials',
    expiryDate: '2027-04-10',
    status: 'Low',
    dailyConsumption: 6,
    daysRemaining: 6.3,
    batchNumber: 'INS-2025-112'
  },

  // Coimbatore Medicines
  {
    id: 'MED-CBE-101',
    name: 'Amoxicillin + Clavulanic Acid 625mg',
    category: 'Essential Antibiotics',
    facility: 'Coimbatore Medical College Hospital (CMCH)',
    facilityType: 'Medical College Hospital',
    district: 'Coimbatore',
    availableQuantity: 18400,
    minimumStockThreshold: 6000,
    unit: 'Tablets',
    expiryDate: '2027-11-20',
    status: 'Adequate',
    dailyConsumption: 420,
    daysRemaining: 43.8,
    batchNumber: 'AMX-CBE-2025'
  },
  {
    id: 'MED-CBE-102',
    name: 'Inj. Oxytocin 10 IU/ml',
    category: 'Maternal & Child',
    facility: 'Pollachi Government Taluk Hospital',
    facilityType: 'Government Hospital',
    district: 'Coimbatore',
    availableQuantity: 120,
    minimumStockThreshold: 50,
    unit: 'Ampoules',
    expiryDate: '2027-05-15',
    status: 'Adequate',
    dailyConsumption: 4,
    daysRemaining: 30.0,
    batchNumber: 'OXY-CBE-102'
  },

  // Chennai Medicines
  {
    id: 'MED-CHN-101',
    name: 'Inj. Ceftriaxone 1g IV',
    category: 'Critical Antibiotics',
    facility: 'Rajiv Gandhi Government General Hospital (RGGGH)',
    facilityType: 'Medical College Hospital',
    district: 'Chennai',
    availableQuantity: 12500,
    minimumStockThreshold: 4000,
    unit: 'Vials',
    expiryDate: '2027-12-01',
    status: 'Adequate',
    dailyConsumption: 320,
    daysRemaining: 39.0,
    batchNumber: 'CEF-CHN-901'
  },
  {
    id: 'MED-CHN-102',
    name: 'Paracetamol 500mg Tablets',
    category: 'Analgesics',
    facility: 'Tondiarpet Primary Health Centre (PHC)',
    facilityType: 'Primary Health Centre (PHC)',
    district: 'Chennai',
    availableQuantity: 850,
    minimumStockThreshold: 2000,
    unit: 'Tablets',
    expiryDate: '2027-09-15',
    status: 'Low',
    dailyConsumption: 160,
    daysRemaining: 5.3,
    batchNumber: 'PCM-CHN-441'
  },

  // Madurai Medicines
  {
    id: 'MED-MDU-101',
    name: 'Polyvalent Snake Anti-Venom (Lyophilized 10ml)',
    category: 'Emergency Fluids & Vaccines',
    facility: 'Madurai Government Rajaji Hospital (GRH)',
    facilityType: 'Medical College Hospital',
    district: 'Madurai',
    availableQuantity: 45,
    minimumStockThreshold: 20,
    unit: 'Vials',
    expiryDate: '2027-03-30',
    status: 'Adequate',
    dailyConsumption: 2,
    daysRemaining: 22.5,
    batchNumber: 'SAV-MDU-301'
  },

  // Erode Medicines
  {
    id: 'MED-ERD-101',
    name: 'ORS (Oral Rehydration Salts IP 21.8g)',
    category: 'Gastroenterology',
    facility: 'Bhavani Primary Health Centre (PHC)',
    facilityType: 'Primary Health Centre (PHC)',
    district: 'Erode',
    availableQuantity: 320,
    minimumStockThreshold: 800,
    unit: 'Packets',
    expiryDate: '2027-07-20',
    status: 'Low',
    dailyConsumption: 65,
    daysRemaining: 4.9,
    batchNumber: 'ORS-ERD-201'
  },

  // Tiruchirappalli Medicines
  {
    id: 'MED-TRC-101',
    name: 'Artesunate 60mg Injection',
    category: 'Anti-Malarial',
    facility: 'Thottiyam Primary Health Centre (PHC)',
    facilityType: 'Primary Health Centre (PHC)',
    district: 'Tiruchirappalli',
    availableQuantity: 42,
    minimumStockThreshold: 80,
    unit: 'Ampoules',
    expiryDate: '2027-06-10',
    status: 'Low',
    dailyConsumption: 5,
    daysRemaining: 8.4,
    batchNumber: 'ART-TRC-110'
  },

  // Namakkal Medicines
  {
    id: 'MED-NMK-101',
    name: 'Ferrous Sulfate + Folic Acid Tablets',
    category: 'Maternal Healthcare',
    facility: 'Kolli Hills Tribal Primary Health Centre (PHC)',
    facilityType: 'Primary Health Centre (PHC)',
    district: 'Namakkal',
    availableQuantity: 620,
    minimumStockThreshold: 1500,
    unit: 'Tablets',
    expiryDate: '2027-05-18',
    status: 'Low',
    dailyConsumption: 85,
    daysRemaining: 7.2,
    batchNumber: 'IFA-NMK-512'
  },

  // Dharmapuri Medicines
  {
    id: 'MED-DHP-101',
    name: 'Polyvalent Snake Anti-Venom (Lyophilized 10ml)',
    category: 'Emergency Fluids & Vaccines',
    facility: 'Pennagaram Primary Health Centre (PHC)',
    facilityType: 'Primary Health Centre (PHC)',
    district: 'Dharmapuri',
    availableQuantity: 3,
    minimumStockThreshold: 15,
    unit: 'Vials',
    expiryDate: '2026-11-30',
    status: 'Critical',
    dailyConsumption: 1,
    daysRemaining: 3.0,
    batchNumber: 'SAV-DHP-088'
  }
];

// ==========================================
// SEED DATA: DIAGNOSTICS (ALL 8 DISTRICTS)
// ==========================================

export const DIAGNOSTICS_DATA: DiagnosticItem[] = [
  // Salem Diagnostics
  {
    id: 'DIAG-1',
    centreName: 'Central Pathology Laboratory',
    facility: 'Salem Mohan Kumaramangalam GMCH',
    district: 'Salem',
    testName: 'CBC (Complete Blood Count)',
    equipmentStatus: 'Operational',
    dailyCapacity: 600,
    testsPerformedToday: 480,
    pendingTestsToday: 45,
    turnaroundTimeHours: 1.5,
    status: 'Available'
  },
  {
    id: 'DIAG-2',
    centreName: 'Automated Biochemistry Wing',
    facility: 'Salem Mohan Kumaramangalam GMCH',
    district: 'Salem',
    testName: 'Blood Sugar / HbA1c',
    equipmentStatus: 'Operational',
    dailyCapacity: 500,
    testsPerformedToday: 410,
    pendingTestsToday: 30,
    turnaroundTimeHours: 2.0,
    status: 'Available'
  },
  {
    id: 'DIAG-3',
    centreName: 'Radiology & X-Ray Unit',
    facility: 'Omalur Taluk Hospital',
    district: 'Salem',
    testName: 'X-Ray Digital',
    equipmentStatus: 'Operational',
    dailyCapacity: 120,
    testsPerformedToday: 95,
    pendingTestsToday: 18,
    turnaroundTimeHours: 1.0,
    status: 'Available'
  },

  // Coimbatore Diagnostics
  {
    id: 'DIAG-CBE-1',
    centreName: 'Advanced Diagnostic Complex',
    facility: 'Coimbatore Medical College Hospital (CMCH)',
    district: 'Coimbatore',
    testName: 'CT Scan',
    equipmentStatus: 'Operational',
    dailyCapacity: 120,
    testsPerformedToday: 98,
    pendingTestsToday: 12,
    turnaroundTimeHours: 2.0,
    status: 'Available'
  },
  {
    id: 'DIAG-CBE-2',
    centreName: 'Pollachi Clinical Pathology Lab',
    facility: 'Pollachi Government Taluk Hospital',
    district: 'Coimbatore',
    testName: 'CBC (Complete Blood Count)',
    equipmentStatus: 'Operational',
    dailyCapacity: 250,
    testsPerformedToday: 190,
    pendingTestsToday: 15,
    turnaroundTimeHours: 1.2,
    status: 'Available'
  },

  // Chennai Diagnostics
  {
    id: 'DIAG-CHN-1',
    centreName: 'Tertiary Imaging & MRI Center',
    facility: 'Rajiv Gandhi Government General Hospital (RGGGH)',
    district: 'Chennai',
    testName: 'MRI 3.0 Tesla & CT Imaging',
    equipmentStatus: 'Operational',
    dailyCapacity: 160,
    testsPerformedToday: 142,
    pendingTestsToday: 18,
    turnaroundTimeHours: 2.5,
    status: 'Available'
  },

  // Madurai Diagnostics
  {
    id: 'DIAG-MDU-1',
    centreName: 'Regional Diagnostic Center',
    facility: 'Madurai Government Rajaji Hospital (GRH)',
    district: 'Madurai',
    testName: 'Digital X-Ray & Ultrasound Doppler',
    equipmentStatus: 'Operational',
    dailyCapacity: 220,
    testsPerformedToday: 185,
    pendingTestsToday: 20,
    turnaroundTimeHours: 1.5,
    status: 'Available'
  },

  // Erode Diagnostics
  {
    id: 'DIAG-ERD-1',
    centreName: 'Perundurai Clinical Pathology Center',
    facility: 'Government Erode Medical College Hospital',
    district: 'Erode',
    testName: 'Complete Metabolic Panel & Dengue Serology',
    equipmentStatus: 'Operational',
    dailyCapacity: 180,
    testsPerformedToday: 145,
    pendingTestsToday: 15,
    turnaroundTimeHours: 1.8,
    status: 'Available'
  },

  // Tiruchirappalli Diagnostics
  {
    id: 'DIAG-TRC-1',
    centreName: 'MGMGH Central Diagnostic Wing',
    facility: 'Mahatma Gandhi Memorial Govt Hospital',
    district: 'Tiruchirappalli',
    testName: 'Automated Hematology & Electrolyte Panel',
    equipmentStatus: 'Operational',
    dailyCapacity: 240,
    testsPerformedToday: 210,
    pendingTestsToday: 16,
    turnaroundTimeHours: 1.2,
    status: 'Available'
  },

  // Namakkal Diagnostics
  {
    id: 'DIAG-NMK-1',
    centreName: 'Namakkal District Diagnostic Lab',
    facility: 'Namakkal Government Medical College Hospital',
    district: 'Namakkal',
    testName: 'CBC & Lipid Profile',
    equipmentStatus: 'Operational',
    dailyCapacity: 150,
    testsPerformedToday: 120,
    pendingTestsToday: 14,
    turnaroundTimeHours: 1.5,
    status: 'Available'
  },

  // Dharmapuri Diagnostics
  {
    id: 'DIAG-DHP-1',
    centreName: 'Dharmapuri Emergency Lab Unit',
    facility: 'Dharmapuri Government Medical College Hospital',
    district: 'Dharmapuri',
    testName: 'NS1 Rapid Dengue & Peripheral Blood Smear',
    equipmentStatus: 'Operational',
    dailyCapacity: 140,
    testsPerformedToday: 125,
    pendingTestsToday: 22,
    turnaroundTimeHours: 1.0,
    status: 'Available'
  }
];

// ==========================================
// SEED DATA: GOVERNMENT SCHEMES
// ==========================================

export const GOVERNMENT_SCHEMES_DATA: GovernmentScheme[] = [
  {
    id: 'SCH-1',
    schemeCode: 'PM-JAY / CMCHIS',
    name: 'Chief Minister Comprehensive Health Insurance & PM-JAY',
    category: 'Rural Healthcare',
    description: 'Universal cashless inpatient and tertiary coverage up to ₹5 Lakh per family per year.',
    beneficiariesCount: 1420500,
    completedServices: 68420,
    pendingServices: 1840,
    districtCoveragePercentage: 88.4,
    monthlyTrendPercentage: 6.2,
    allocatedBudgetCr: 120.5,
    spentBudgetCr: 94.2
  },
  {
    id: 'SCH-2',
    schemeCode: 'JSSK & MCH',
    name: 'Janani Shishu Suraksha Karyakram (Maternal Healthcare)',
    category: 'Maternal Healthcare',
    description: 'Zero expense delivery, free diagnostic, nutrition and transport for pregnant mothers and neonates.',
    beneficiariesCount: 184200,
    completedServices: 17290,
    pendingServices: 430,
    districtCoveragePercentage: 94.1,
    monthlyTrendPercentage: 4.8,
    allocatedBudgetCr: 45.0,
    spentBudgetCr: 38.6
  }
];

// ==========================================
// SEED DATA: RULE ALERTS (ALL 8 DISTRICTS) - CHC -> PHC
// ==========================================

export const RULE_ALERTS_DATA: RuleAlert[] = [
  {
    id: 'ALT-1',
    title: 'Hospital Bed Overcrowding Alert: Omalur GH at 94% Capacity',
    category: 'Critical',
    ruleType: 'BED_OVERCROWDING',
    facility: 'Omalur Taluk Hospital',
    district: 'Salem',
    timestamp: '15 mins ago',
    severity: 'High',
    status: 'Active',
    actionNeeded: 'Divert non-emergency admissions to Mettur GH and dispatch 15 reserve beds.'
  },
  {
    id: 'ALT-2',
    title: 'Emergency Stockout Alert: Anti-Venom & Paracetamol Below Threshold',
    category: 'Critical',
    ruleType: 'MEDICINE_STOCKOUT',
    facility: 'Mecheri Primary Health Centre (PHC)',
    district: 'Salem',
    timestamp: '32 mins ago',
    severity: 'High',
    status: 'Active',
    actionNeeded: 'Trigger emergency inter-facility transfer of 10 vials anti-venom from Salem GMCH.'
  },
  {
    id: 'ALT-CBE-1',
    title: 'Emergency Trauma Load Surge in Pollachi Sub-Division',
    category: 'Warning',
    ruleType: 'BED_OVERCROWDING',
    facility: 'Pollachi Government Taluk Hospital',
    district: 'Coimbatore',
    timestamp: '40 mins ago',
    severity: 'Medium',
    status: 'Active',
    actionNeeded: 'Deploy reserve triage team from Coimbatore Medical College Hospital.'
  },
  {
    id: 'ALT-CHN-1',
    title: 'Seasonal Fever Surge Alert: Tondiarpet Health Block',
    category: 'Warning',
    ruleType: 'EPIDEMIC_SPIKE',
    facility: 'Tondiarpet Primary Health Centre (PHC)',
    district: 'Chennai',
    timestamp: '55 mins ago',
    severity: 'Medium',
    status: 'Active',
    actionNeeded: 'Dispatch 500 Paracetamol strips and deploy mobile fever screening unit.'
  },
  {
    id: 'ALT-MDU-1',
    title: 'Respiratory Case Cluster Alert: Melur Taluk',
    category: 'Warning',
    ruleType: 'EPIDEMIC_SPIKE',
    facility: 'Melur Government Taluk Hospital',
    district: 'Madurai',
    timestamp: '1 hour ago',
    severity: 'Medium',
    status: 'Active',
    actionNeeded: 'Heighten nebulization readiness and pediatric ward surveillance.'
  },
  {
    id: 'ALT-ERD-1',
    title: 'ORS Low Stock Threshold Alert',
    category: 'Warning',
    ruleType: 'MEDICINE_STOCKOUT',
    facility: 'Bhavani Primary Health Centre (PHC)',
    district: 'Erode',
    timestamp: '2 hours ago',
    severity: 'Medium',
    status: 'Active',
    actionNeeded: 'Dispatch 400 packets ORS from Erode Central Medical Store.'
  },
  {
    id: 'ALT-TRC-1',
    title: 'Anti-Malarial Buffer Replenishment Alert',
    category: 'Information',
    ruleType: 'MEDICINE_STOCKOUT',
    facility: 'Thottiyam Primary Health Centre (PHC)',
    district: 'Tiruchirappalli',
    timestamp: '3 hours ago',
    severity: 'Low',
    status: 'Active',
    actionNeeded: 'Replenish 50 ampoules Artesunate buffer from Trichy MGMGH.'
  },
  {
    id: 'ALT-NMK-1',
    title: 'Maternal Iron-Folic Stock Alert in Kolli Hills Block',
    category: 'Warning',
    ruleType: 'MEDICINE_STOCKOUT',
    facility: 'Kolli Hills Tribal Primary Health Centre (PHC)',
    district: 'Namakkal',
    timestamp: '3 hours ago',
    severity: 'Medium',
    status: 'Active',
    actionNeeded: 'Schedule mobile van delivery of IFA syrup & tablets.'
  },
  {
    id: 'ALT-DHP-1',
    title: 'Critical Anti-Venom Depletion Alert: Pennagaram PHC',
    category: 'Critical',
    ruleType: 'MEDICINE_STOCKOUT',
    facility: 'Pennagaram Primary Health Centre (PHC)',
    district: 'Dharmapuri',
    timestamp: '25 mins ago',
    severity: 'High',
    status: 'Active',
    actionNeeded: 'Urgent cold-chain dispatch of 10 vials anti-venom from Dharmapuri GMCH.'
  }
];

// ==========================================
// SEED DATA: AUDIT LOGS
// ==========================================

export const AUDIT_LOGS_DATA: AuditLogItem[] = [
  {
    id: 'LOG-901',
    user: 'Dr. S. Kumar (DHO)',
    role: 'District Administrator',
    action: 'Dispatched Emergency Medicine Requisition #REQ-4412',
    module: 'Medicine Inventory',
    timestamp: '2026-09-07 13:45:10',
    ipAddress: '10.14.22.81 (NIC-Govt-VLAN)',
    result: 'Success',
    details: 'Approved transfer of 15 vials Anti-Venom to Mecheri PHC from GMCH Salem.'
  },
  {
    id: 'LOG-902',
    user: 'Dr. R. Senthamilselvan (Dean)',
    role: 'Hospital Administrator',
    action: 'Updated Bed Availability & ICU Threshold Alert',
    module: 'Bed Management',
    timestamp: '2026-09-07 13:12:04',
    ipAddress: '10.14.30.12 (Hospital-LAN)',
    result: 'Success',
    details: 'Converted 20 Step-Down beds to High Dependency Unit (HDU) capacity.'
  }
];

// ==========================================
// SEED DATA: VILLAGES (ALL 8 DISTRICTS)
// ==========================================

export const MOCK_VILLAGES: VillageData[] = [
  // Salem Villages
  {
    id: 'v1',
    name: 'Mecheri',
    taluk: 'Mettur',
    district: 'Salem',
    population: 32400,
    registeredPatients: 14200,
    activeCases: 142,
    riskLevel: 'CRITICAL',
    healthScore: 54,
    hospitalsCount: 3,
    availableDoctors: 4,
    bedsAvailable: 6,
    totalBeds: 40,
    emergencyKitsStock: 4,
    medicineStockStatus: 'Critical',
    vaccinationCoverage: 76,
    maternalHighRisk: 14,
    maternalTotal: 84,
    ancPending: 18,
    coordinates: { x: 35, y: 30 },
    diseases: { dengue: 48, fever: 38, diabetes: 18, respiratory: 16, hypertension: 12, diarrhoea: 6, malaria: 4, others: 0 }
  },
  {
    id: 'v2',
    name: 'Yercaud',
    taluk: 'Yercaud',
    district: 'Salem',
    population: 41200,
    registeredPatients: 18600,
    activeCases: 95,
    riskLevel: 'HIGH',
    healthScore: 68,
    hospitalsCount: 4,
    availableDoctors: 5,
    bedsAvailable: 12,
    totalBeds: 50,
    emergencyKitsStock: 8,
    medicineStockStatus: 'Low',
    vaccinationCoverage: 82,
    maternalHighRisk: 8,
    maternalTotal: 96,
    ancPending: 12,
    coordinates: { x: 65, y: 25 },
    diseases: { dengue: 12, fever: 28, diabetes: 22, respiratory: 19, hypertension: 9, diarrhoea: 3, malaria: 2, others: 0 }
  },
  {
    id: 'v3',
    name: 'Omalur',
    taluk: 'Omalur',
    district: 'Salem',
    population: 58900,
    registeredPatients: 24800,
    activeCases: 180,
    riskLevel: 'HIGH',
    healthScore: 71,
    hospitalsCount: 6,
    availableDoctors: 14,
    bedsAvailable: 18,
    totalBeds: 120,
    emergencyKitsStock: 25,
    medicineStockStatus: 'Adequate',
    vaccinationCoverage: 91,
    maternalHighRisk: 6,
    maternalTotal: 140,
    ancPending: 9,
    coordinates: { x: 45, y: 48 },
    diseases: { dengue: 22, fever: 45, diabetes: 48, respiratory: 32, hypertension: 24, diarrhoea: 5, malaria: 4, others: 0 }
  },

  // Coimbatore Villages
  {
    id: 'v-cbe-1',
    name: 'Pollachi Rural',
    taluk: 'Pollachi',
    district: 'Coimbatore',
    population: 52000,
    registeredPatients: 26000,
    activeCases: 78,
    riskLevel: 'NORMAL',
    healthScore: 88,
    hospitalsCount: 4,
    availableDoctors: 12,
    bedsAvailable: 35,
    totalBeds: 100,
    emergencyKitsStock: 30,
    medicineStockStatus: 'Good',
    vaccinationCoverage: 94,
    maternalHighRisk: 3,
    maternalTotal: 120,
    ancPending: 5,
    coordinates: { x: 30, y: 60 },
    diseases: { dengue: 6, fever: 20, diabetes: 30, respiratory: 15, hypertension: 18, diarrhoea: 2, malaria: 1, others: 0 }
  },

  // Chennai Health Zones
  {
    id: 'v-chn-1',
    name: 'Tondiarpet Zone',
    taluk: 'Tondiarpet',
    district: 'Chennai',
    population: 142000,
    registeredPatients: 68000,
    activeCases: 210,
    riskLevel: 'MEDIUM',
    healthScore: 82,
    hospitalsCount: 8,
    availableDoctors: 32,
    bedsAvailable: 75,
    totalBeds: 300,
    emergencyKitsStock: 45,
    medicineStockStatus: 'Adequate',
    vaccinationCoverage: 96,
    maternalHighRisk: 8,
    maternalTotal: 280,
    ancPending: 14,
    coordinates: { x: 80, y: 22 },
    diseases: { dengue: 18, fever: 75, diabetes: 62, respiratory: 45, hypertension: 38, diarrhoea: 8, malaria: 2, others: 0 }
  },

  // Madurai Villages
  {
    id: 'v-mdu-1',
    name: 'Melur Rural',
    taluk: 'Melur',
    district: 'Madurai',
    population: 48000,
    registeredPatients: 22000,
    activeCases: 110,
    riskLevel: 'MEDIUM',
    healthScore: 79,
    hospitalsCount: 4,
    availableDoctors: 10,
    bedsAvailable: 24,
    totalBeds: 80,
    emergencyKitsStock: 18,
    medicineStockStatus: 'Adequate',
    vaccinationCoverage: 89,
    maternalHighRisk: 5,
    maternalTotal: 110,
    ancPending: 8,
    coordinates: { x: 55, y: 72 },
    diseases: { dengue: 14, fever: 35, diabetes: 28, respiratory: 22, hypertension: 16, diarrhoea: 4, malaria: 1, others: 0 }
  },

  // Erode Villages
  {
    id: 'v-erd-1',
    name: 'Bhavani Rural',
    taluk: 'Bhavani',
    district: 'Erode',
    population: 44000,
    registeredPatients: 19500,
    activeCases: 88,
    riskLevel: 'MEDIUM',
    healthScore: 80,
    hospitalsCount: 3,
    availableDoctors: 8,
    bedsAvailable: 20,
    totalBeds: 70,
    emergencyKitsStock: 16,
    medicineStockStatus: 'Adequate',
    vaccinationCoverage: 92,
    maternalHighRisk: 4,
    maternalTotal: 95,
    ancPending: 6,
    coordinates: { x: 40, y: 50 },
    diseases: { dengue: 8, fever: 28, diabetes: 26, respiratory: 18, hypertension: 14, diarrhoea: 3, malaria: 1, others: 0 }
  },

  // Tiruchirappalli Villages
  {
    id: 'v-trc-1',
    name: 'Thottiyam Rural',
    taluk: 'Thottiyam',
    district: 'Tiruchirappalli',
    population: 46000,
    registeredPatients: 21000,
    activeCases: 92,
    riskLevel: 'NORMAL',
    healthScore: 84,
    hospitalsCount: 4,
    availableDoctors: 9,
    bedsAvailable: 22,
    totalBeds: 75,
    emergencyKitsStock: 20,
    medicineStockStatus: 'Adequate',
    vaccinationCoverage: 93,
    maternalHighRisk: 4,
    maternalTotal: 105,
    ancPending: 7,
    coordinates: { x: 62, y: 58 },
    diseases: { dengue: 9, fever: 30, diabetes: 27, respiratory: 19, hypertension: 15, diarrhoea: 3, malaria: 2, others: 0 }
  },

  // Namakkal Villages
  {
    id: 'v-nmk-1',
    name: 'Kolli Hills Tribal Settlement',
    taluk: 'Kolli Hills',
    district: 'Namakkal',
    population: 36000,
    registeredPatients: 16200,
    activeCases: 84,
    riskLevel: 'HIGH',
    healthScore: 72,
    hospitalsCount: 3,
    availableDoctors: 6,
    bedsAvailable: 14,
    totalBeds: 45,
    emergencyKitsStock: 12,
    medicineStockStatus: 'Low',
    vaccinationCoverage: 84,
    maternalHighRisk: 7,
    maternalTotal: 88,
    ancPending: 11,
    coordinates: { x: 54, y: 52 },
    diseases: { dengue: 6, fever: 24, diabetes: 18, respiratory: 16, hypertension: 10, diarrhoea: 4, malaria: 3, others: 0 }
  },

  // Dharmapuri Villages
  {
    id: 'v-dhp-1',
    name: 'Pennagaram Rural',
    taluk: 'Pennagaram',
    district: 'Dharmapuri',
    population: 42000,
    registeredPatients: 19000,
    activeCases: 132,
    riskLevel: 'CRITICAL',
    healthScore: 60,
    hospitalsCount: 3,
    availableDoctors: 5,
    bedsAvailable: 8,
    totalBeds: 45,
    emergencyKitsStock: 6,
    medicineStockStatus: 'Critical',
    vaccinationCoverage: 79,
    maternalHighRisk: 11,
    maternalTotal: 92,
    ancPending: 16,
    coordinates: { x: 50, y: 30 },
    diseases: { dengue: 38, fever: 42, diabetes: 16, respiratory: 20, hypertension: 11, diarrhoea: 8, malaria: 6, others: 0 }
  }
];

// ==========================================
// SEED DATA: HOSPITALS COMPAT (ALL 8 DISTRICTS) - CHC -> PHC
// ==========================================

export const MOCK_HOSPITALS: HospitalData[] = [
  {
    id: 'h1',
    name: 'Salem Govt Mohan Kumaramangalam Medical College Hospital',
    type: 'Government Hospital',
    district: 'Salem',
    taluk: 'Salem North',
    village: 'Salem City',
    doctors: { available: 85, total: 110 },
    nurses: { available: 210, total: 240 },
    beds: { occupied: 540, total: 600 },
    icuBeds: { occupied: 46, total: 50 },
    ventilators: { inUse: 18, total: 20 },
    ambulances: { available: 8, total: 10 },
    occupancyRate: 90,
    status: 'Near Capacity',
    medicineStockStatus: 'Optimal',
    emergencySupplyStatus: 'Optimal',
    emergencyKitsCount: 120,
    contact: '+91 427 2211220'
  },
  {
    id: 'h-cbe-1',
    name: 'Coimbatore Medical College Hospital (CMCH)',
    type: 'Government Hospital',
    district: 'Coimbatore',
    taluk: 'Coimbatore South',
    village: 'Coimbatore City',
    doctors: { available: 110, total: 140 },
    nurses: { available: 280, total: 320 },
    beds: { occupied: 650, total: 750 },
    icuBeds: { occupied: 55, total: 65 },
    ventilators: { inUse: 22, total: 28 },
    ambulances: { available: 12, total: 15 },
    occupancyRate: 86.6,
    status: 'Normal',
    medicineStockStatus: 'Optimal',
    emergencySupplyStatus: 'Optimal',
    emergencyKitsCount: 150,
    contact: '+91 422 2301393'
  },
  {
    id: 'h-chn-1',
    name: 'Rajiv Gandhi Government General Hospital (RGGGH)',
    type: 'Government Hospital',
    district: 'Chennai',
    taluk: 'Egmore',
    village: 'Chennai Central',
    doctors: { available: 180, total: 220 },
    nurses: { available: 420, total: 480 },
    beds: { occupied: 1100, total: 1250 },
    icuBeds: { occupied: 98, total: 110 },
    ventilators: { inUse: 38, total: 45 },
    ambulances: { available: 18, total: 22 },
    occupancyRate: 88,
    status: 'Normal',
    medicineStockStatus: 'Optimal',
    emergencySupplyStatus: 'Optimal',
    emergencyKitsCount: 220,
    contact: '+91 44 25305000'
  },
  {
    id: 'h-mdu-1',
    name: 'Madurai Government Rajaji Hospital (GRH)',
    type: 'Government Hospital',
    district: 'Madurai',
    taluk: 'Madurai North',
    village: 'Madurai City',
    doctors: { available: 95, total: 120 },
    nurses: { available: 230, total: 270 },
    beds: { occupied: 580, total: 680 },
    icuBeds: { occupied: 48, total: 58 },
    ventilators: { inUse: 19, total: 24 },
    ambulances: { available: 10, total: 12 },
    occupancyRate: 85.3,
    status: 'Normal',
    medicineStockStatus: 'Optimal',
    emergencySupplyStatus: 'Optimal',
    emergencyKitsCount: 130,
    contact: '+91 452 2532535'
  },
  {
    id: 'h-erd-1',
    name: 'Government Erode Medical College Hospital',
    type: 'Government Hospital',
    district: 'Erode',
    taluk: 'Perundurai',
    village: 'Perundurai',
    doctors: { available: 75, total: 95 },
    nurses: { available: 180, total: 210 },
    beds: { occupied: 410, total: 480 },
    icuBeds: { occupied: 36, total: 44 },
    ventilators: { inUse: 14, total: 18 },
    ambulances: { available: 7, total: 9 },
    occupancyRate: 85.4,
    status: 'Normal',
    medicineStockStatus: 'Optimal',
    emergencySupplyStatus: 'Optimal',
    emergencyKitsCount: 95,
    contact: '+91 4294 220910'
  },
  {
    id: 'h-trc-1',
    name: 'Mahatma Gandhi Memorial Govt Hospital (Trichy)',
    type: 'Government Hospital',
    district: 'Tiruchirappalli',
    taluk: 'Trichy West',
    village: 'Trichy City',
    doctors: { available: 88, total: 110 },
    nurses: { available: 215, total: 250 },
    beds: { occupied: 520, total: 620 },
    icuBeds: { occupied: 44, total: 54 },
    ventilators: { inUse: 17, total: 22 },
    ambulances: { available: 9, total: 11 },
    occupancyRate: 83.8,
    status: 'Normal',
    medicineStockStatus: 'Optimal',
    emergencySupplyStatus: 'Optimal',
    emergencyKitsCount: 115,
    contact: '+91 431 2412521'
  },
  {
    id: 'h-nmk-1',
    name: 'Namakkal Government Medical College Hospital',
    type: 'Government Hospital',
    district: 'Namakkal',
    taluk: 'Namakkal',
    village: 'Namakkal Town',
    doctors: { available: 65, total: 80 },
    nurses: { available: 155, total: 180 },
    beds: { occupied: 320, total: 380 },
    icuBeds: { occupied: 28, total: 35 },
    ventilators: { inUse: 11, total: 15 },
    ambulances: { available: 6, total: 8 },
    occupancyRate: 84.2,
    status: 'Normal',
    medicineStockStatus: 'Optimal',
    emergencySupplyStatus: 'Optimal',
    emergencyKitsCount: 80,
    contact: '+91 4286 220300'
  },
  {
    id: 'h-dhp-1',
    name: 'Dharmapuri Government Medical College Hospital',
    type: 'Government Hospital',
    district: 'Dharmapuri',
    taluk: 'Dharmapuri',
    village: 'Dharmapuri Town',
    doctors: { available: 70, total: 90 },
    nurses: { available: 165, total: 195 },
    beds: { occupied: 390, total: 430 },
    icuBeds: { occupied: 34, total: 38 },
    ventilators: { inUse: 15, total: 16 },
    ambulances: { available: 6, total: 8 },
    occupancyRate: 90.7,
    status: 'Near Capacity',
    medicineStockStatus: 'Low',
    emergencySupplyStatus: 'Low',
    emergencyKitsCount: 75,
    contact: '+91 4342 233000'
  }
];

// ==========================================
// SEED DATA: ALERTS (ALL 8 DISTRICTS)
// ==========================================

export const MOCK_ALERTS: DiseaseAlert[] = [
  {
    id: 'alt-1',
    villageId: 'v1',
    villageName: 'Mecheri',
    district: 'Salem',
    disease: 'Dengue Outbreak Risk',
    normalWeeklyCases: 4,
    currentCases: 48,
    increasePercentage: 1100,
    riskLevel: 'CRITICAL',
    status: 'Under Investigation',
    timestamp: '15 mins ago',
    assignedOfficer: 'Dr. S. Kumar (DHO)',
    actionProgressSteps: [
      { step: 'Alert Triggered by Surveillance AI', completed: true, timestamp: '09:00 AM' },
      { step: 'DHO & Health Inspector Assigned', completed: true, timestamp: '09:15 AM' },
      { step: 'Deploy Fogging & Larvicide Teams', completed: true, timestamp: '10:00 AM' },
      { step: 'Dispatch Anti-Venom & IV Fluid Kits', completed: false },
      { step: 'Setup Fever Camp in Ward 4 & 7', completed: false }
    ]
  },
  {
    id: 'alt-cbe-1',
    villageId: 'v-cbe-1',
    villageName: 'Pollachi Rural',
    district: 'Coimbatore',
    disease: 'Acute Diarrhoeal Cluster',
    normalWeeklyCases: 6,
    currentCases: 32,
    increasePercentage: 433,
    riskLevel: 'MEDIUM',
    status: 'Monitoring',
    timestamp: '40 mins ago',
    assignedOfficer: 'Dr. K. Rangarajan',
    actionProgressSteps: [
      { step: 'Surveillance Signal Detected', completed: true, timestamp: '10:00 AM' },
      { step: 'Water Pipeline Chlorination Ordered', completed: true, timestamp: '10:30 AM' },
      { step: 'ORS Distribution Active', completed: true, timestamp: '11:00 AM' }
    ]
  },
  {
    id: 'alt-chn-1',
    villageId: 'v-chn-1',
    villageName: 'Tondiarpet Zone',
    district: 'Chennai',
    disease: 'Monsoon Viral Fever Surge',
    normalWeeklyCases: 15,
    currentCases: 75,
    increasePercentage: 400,
    riskLevel: 'HIGH',
    status: 'Under Investigation',
    timestamp: '50 mins ago',
    assignedOfficer: 'Dr. M. Shanmugam',
    actionProgressSteps: [
      { step: 'Surveillance AI Alert Logged', completed: true, timestamp: '08:30 AM' },
      { step: 'Mobile Screening Van Deployed', completed: true, timestamp: '09:15 AM' },
      { step: 'Paracetamol Buffer Restocked', completed: true, timestamp: '10:00 AM' }
    ]
  },
  {
    id: 'alt-dhp-1',
    villageId: 'v-dhp-1',
    villageName: 'Pennagaram Rural',
    district: 'Dharmapuri',
    disease: 'Vector-Borne Dengue & Malaria Cluster',
    normalWeeklyCases: 3,
    currentCases: 44,
    increasePercentage: 1366,
    riskLevel: 'CRITICAL',
    status: 'Under Investigation',
    timestamp: '20 mins ago',
    assignedOfficer: 'Dr. M. Elango',
    actionProgressSteps: [
      { step: 'High Breteau Index Flagged (>35%)', completed: true, timestamp: '09:30 AM' },
      { step: 'Vector Control Teams Mobilized', completed: true, timestamp: '10:15 AM' },
      { step: 'Emergency RDT Strips Dispatched', completed: false }
    ]
  }
];

// ==========================================
// SEED DATA: EMERGENCY SUPPLIES (ALL 8 DISTRICTS)
// ==========================================

export const MOCK_EMERGENCY_SUPPLIES: EmergencySupplyItem[] = [
  // Salem
  { id: 'es1', name: 'Polyvalent Snake Anti-Venom', category: 'Antidotes & Toxins', district: 'Salem', totalStock: 48, bufferThreshold: 100, unit: 'Vials', status: 'Critical', color: 'rose' },
  { id: 'es2', name: 'Medical Oxygen Cylinders (D-Type)', category: 'Respiratory Life Support', district: 'Salem', totalStock: 142, bufferThreshold: 180, unit: 'Cylinders', status: 'Low', color: 'amber' },
  { id: 'es3', name: 'Dengue NS1 Antigen Rapid Kits', category: 'Diagnostic & Serology', district: 'Salem', totalStock: 220, bufferThreshold: 300, unit: 'Kits', status: 'Low', color: 'amber' },

  // Coimbatore
  { id: 'es-cbe-1', name: 'Polyvalent Snake Anti-Venom', category: 'Antidotes & Toxins', district: 'Coimbatore', totalStock: 120, bufferThreshold: 100, unit: 'Vials', status: 'Safe', color: 'emerald' },
  { id: 'es-cbe-2', name: 'Medical Oxygen Cylinders (D-Type)', category: 'Respiratory Life Support', district: 'Coimbatore', totalStock: 210, bufferThreshold: 180, unit: 'Cylinders', status: 'Safe', color: 'emerald' },

  // Chennai
  { id: 'es-chn-1', name: 'Polyvalent Snake Anti-Venom', category: 'Antidotes & Toxins', district: 'Chennai', totalStock: 180, bufferThreshold: 120, unit: 'Vials', status: 'Safe', color: 'emerald' },
  { id: 'es-chn-2', name: 'Medical Oxygen Cylinders (D-Type)', category: 'Respiratory Life Support', district: 'Chennai', totalStock: 350, bufferThreshold: 250, unit: 'Cylinders', status: 'Safe', color: 'emerald' },

  // Madurai
  { id: 'es-mdu-1', name: 'Polyvalent Snake Anti-Venom', category: 'Antidotes & Toxins', district: 'Madurai', totalStock: 85, bufferThreshold: 90, unit: 'Vials', status: 'Low', color: 'amber' },
  { id: 'es-mdu-2', name: 'Medical Oxygen Cylinders (D-Type)', category: 'Respiratory Life Support', district: 'Madurai', totalStock: 160, bufferThreshold: 150, unit: 'Cylinders', status: 'Safe', color: 'emerald' },

  // Erode
  { id: 'es-erd-1', name: 'Polyvalent Snake Anti-Venom', category: 'Antidotes & Toxins', district: 'Erode', totalStock: 74, bufferThreshold: 80, unit: 'Vials', status: 'Low', color: 'amber' },
  { id: 'es-erd-2', name: 'Medical Oxygen Cylinders (D-Type)', category: 'Respiratory Life Support', district: 'Erode', totalStock: 130, bufferThreshold: 120, unit: 'Cylinders', status: 'Safe', color: 'emerald' },

  // Tiruchirappalli
  { id: 'es-trc-1', name: 'Polyvalent Snake Anti-Venom', category: 'Antidotes & Toxins', district: 'Tiruchirappalli', totalStock: 95, bufferThreshold: 90, unit: 'Vials', status: 'Safe', color: 'emerald' },
  { id: 'es-trc-2', name: 'Medical Oxygen Cylinders (D-Type)', category: 'Respiratory Life Support', district: 'Tiruchirappalli', totalStock: 145, bufferThreshold: 130, unit: 'Cylinders', status: 'Safe', color: 'emerald' },

  // Namakkal
  { id: 'es-nmk-1', name: 'Polyvalent Snake Anti-Venom', category: 'Antidotes & Toxins', district: 'Namakkal', totalStock: 52, bufferThreshold: 70, unit: 'Vials', status: 'Low', color: 'amber' },
  { id: 'es-nmk-2', name: 'Medical Oxygen Cylinders (D-Type)', category: 'Respiratory Life Support', district: 'Namakkal', totalStock: 110, bufferThreshold: 100, unit: 'Cylinders', status: 'Safe', color: 'emerald' },

  // Dharmapuri
  { id: 'es-dhp-1', name: 'Polyvalent Snake Anti-Venom', category: 'Antidotes & Toxins', district: 'Dharmapuri', totalStock: 32, bufferThreshold: 80, unit: 'Vials', status: 'Critical', color: 'rose' },
  { id: 'es-dhp-2', name: 'Medical Oxygen Cylinders (D-Type)', category: 'Respiratory Life Support', district: 'Dharmapuri', totalStock: 95, bufferThreshold: 120, unit: 'Cylinders', status: 'Low', color: 'amber' }
];

// ==========================================
// SEED DATA: MEDICINES COMPAT (ALL 8 DISTRICTS) - CHC -> PHC
// ==========================================

export const MOCK_MEDICINES: MedicineItem[] = [
  {
    id: 'm1',
    name: 'Paracetamol 500mg',
    category: 'Analgesic',
    district: 'Salem',
    totalStock: 8400,
    unit: 'Tablets',
    dailyConsumption: 420,
    status: 'Low',
    facilities: [
      { facilityName: 'Mecheri PHC', stock: 420, dailyUsage: 180, predictedStockOutDays: 2.3 },
      { facilityName: 'Omalur GH', stock: 3200, dailyUsage: 120, predictedStockOutDays: 26.6 },
      { facilityName: 'Salem GMCH', stock: 4780, dailyUsage: 120, predictedStockOutDays: 39.8 }
    ]
  },
  {
    id: 'm-cbe-1',
    name: 'Amoxicillin 500mg',
    category: 'Antibiotic',
    district: 'Coimbatore',
    totalStock: 14200,
    unit: 'Tablets',
    dailyConsumption: 380,
    status: 'Good',
    facilities: [
      { facilityName: 'Pollachi GH', stock: 4200, dailyUsage: 110, predictedStockOutDays: 38.1 },
      { facilityName: 'CMCH Coimbatore', stock: 10000, dailyUsage: 270, predictedStockOutDays: 37.0 }
    ]
  },
  {
    id: 'm-chn-1',
    name: 'Ceftriaxone 1g',
    category: 'Antibiotic',
    district: 'Chennai',
    totalStock: 18500,
    unit: 'Vials',
    dailyConsumption: 450,
    status: 'Good',
    facilities: [
      { facilityName: 'RGGGH Chennai', stock: 12500, dailyUsage: 320, predictedStockOutDays: 39.0 },
      { facilityName: 'Stanley Hospital', stock: 6000, dailyUsage: 130, predictedStockOutDays: 46.1 }
    ]
  }
];

// ==========================================
// SEED DATA: DISTRICT SUMMARIES (ALL 8 DISTRICTS)
// ==========================================

export const DISTRICT_SUMMARIES: Record<string, DistrictSummary> = {
  Salem: {
    state: 'Tamil Nadu',
    district: 'Salem',
    totalVillages: 245,
    population: 3488075,
    registeredPatients: 184320,
    hospitalsCount: 86,
    activeCases: 1284,
    criticalPatients: 48,
    activeAlerts: 6,
    emergencySuppliesReadiness: 94.2,
    emergencyKitsCount: 185,
  },
  Coimbatore: {
    state: 'Tamil Nadu',
    district: 'Coimbatore',
    totalVillages: 260,
    population: 3458045,
    registeredPatients: 215400,
    hospitalsCount: 110,
    activeCases: 890,
    criticalPatients: 32,
    activeAlerts: 2,
    emergencySuppliesReadiness: 97.4,
    emergencyKitsCount: 240,
  },
  Madurai: {
    state: 'Tamil Nadu',
    district: 'Madurai',
    totalVillages: 220,
    population: 3038252,
    registeredPatients: 198500,
    hospitalsCount: 94,
    activeCases: 1040,
    criticalPatients: 41,
    activeAlerts: 4,
    emergencySuppliesReadiness: 92.8,
    emergencyKitsCount: 190,
  },
  Chennai: {
    state: 'Tamil Nadu',
    district: 'Chennai',
    totalVillages: 180,
    population: 7088000,
    registeredPatients: 490200,
    hospitalsCount: 180,
    activeCases: 1620,
    criticalPatients: 64,
    activeAlerts: 3,
    emergencySuppliesReadiness: 98.6,
    emergencyKitsCount: 350,
  },
  Dharmapuri: {
    state: 'Tamil Nadu',
    district: 'Dharmapuri',
    totalVillages: 198,
    population: 1506843,
    registeredPatients: 142000,
    hospitalsCount: 44,
    activeCases: 890,
    criticalPatients: 38,
    activeAlerts: 3,
    emergencySuppliesReadiness: 88.5,
    emergencyKitsCount: 140,
  },
  Erode: {
    state: 'Tamil Nadu',
    district: 'Erode',
    totalVillages: 210,
    population: 2251744,
    registeredPatients: 154200,
    hospitalsCount: 68,
    activeCases: 940,
    criticalPatients: 26,
    activeAlerts: 4,
    emergencySuppliesReadiness: 96.0,
    emergencyKitsCount: 172,
  },
  Tiruchirappalli: {
    state: 'Tamil Nadu',
    district: 'Tiruchirappalli',
    totalVillages: 230,
    population: 2722290,
    registeredPatients: 176400,
    hospitalsCount: 78,
    activeCases: 980,
    criticalPatients: 34,
    activeAlerts: 3,
    emergencySuppliesReadiness: 95.1,
    emergencyKitsCount: 180,
  },
  Namakkal: {
    state: 'Tamil Nadu',
    district: 'Namakkal',
    totalVillages: 175,
    population: 1726601,
    registeredPatients: 121000,
    hospitalsCount: 52,
    activeCases: 720,
    criticalPatients: 22,
    activeAlerts: 2,
    emergencySuppliesReadiness: 93.0,
    emergencyKitsCount: 130,
  }
};

// Multilingual Translations Dictionary
export const TRANSLATIONS = {
  en: {
    appTitle: 'CareBridge Government Healthcare Dashboard',
    tagline: 'Bridging Government Healthcare Data, Services & People',
    overview: 'Overview',
    liveMonitoring: 'Live Monitoring',
    hospitals: 'Government Hospitals',
    doctors: 'Doctors & Specialists',
    patients: 'Patients',
    telemedicine: 'Telemedicine',
    medicines: 'Medicine Inventory',
    diagnostics: 'Diagnostics',
    beds: 'Bed Availability',
    analytics: 'Analytics & Ranking',
    surveillance: 'Disease Surveillance',
    reports: 'Reports',
    alerts: 'Alerts & Actions',
    auditLogs: 'Audit Logs',
    logout: 'Logout Officer',
    demoMode: 'Demo Data: ON',
    searchPlaceholder: 'Search hospital, disease, doctor, medicine, alert...'
  },
  ta: {
    appTitle: 'கேர்பிரிட்ஜ் அரசு பொது சுகாதார நிர்வாக தளம்',
    tagline: 'அரசு சுகாதார தரவு, சேவைகள் மற்றும் மக்களை இணைக்கிறது',
    overview: 'மேலோட்டம்',
    liveMonitoring: 'நேரலை கண்காணிப்பு',
    hospitals: 'அரசு மருத்துவமனைகள்',
    doctors: 'மருத்துவர்கள் & நிபுணர்கள்',
    patients: 'நோயாளிகள்',
    telemedicine: 'தொலை மருத்துவ ஆலோசனை',
    medicines: 'மருந்து கையிருப்பு',
    diagnostics: 'பரிசோதனை மையங்கள்',
    beds: 'படுக்கை வசதி',
    analytics: 'மாவட்ட மதிப்பீடு & புள்ளிவிவரம்',
    surveillance: 'நோய் கண்காணிப்பு',
    reports: 'அறிக்கைகள் பதிவிறக்கம்',
    alerts: 'அவசர எச்சரிக்கைகள்',
    auditLogs: 'தணிக்கை பதிவுகள்',
    logout: 'வெளியேறு',
    demoMode: 'மாதிரி தரவு: இயங்குகிறது',
    searchPlaceholder: 'மருத்துவமனை, நோய், மருத்துவர், மருந்து தேடுக...'
  },
  hi: {
    appTitle: 'केयरब्रिज सरकारी स्वास्थ्य प्रशासन डैशबोर्ड',
    tagline: 'सरकारी स्वास्थ्य डेटा, सेवाओं और जनता को जोड़ना',
    overview: 'अवलोकन',
    liveMonitoring: 'लाइव निगरानी',
    hospitals: 'सरकारी अस्पताल',
    doctors: 'डॉक्टर एवं विशेषज्ञ',
    patients: 'मरीज़ रिकॉर्ड',
    telemedicine: 'टेलीमेडिसिन',
    medicines: 'दवा इन्वेंटरी',
    diagnostics: 'जांच केंद्र',
    beds: 'उपलब्ध बिस्तर',
    analytics: 'जिला रैंकिंग एवं विश्लेषण',
    surveillance: 'रोग निगरानी',
    reports: 'रिपोर्ट डाउनलोड',
    alerts: 'आपातकालीन अलर्ट',
    auditLogs: 'ऑडिट लॉग',
    logout: 'लॉगआउट',
    demoMode: 'डेमो डेटा: चालू',
    searchPlaceholder: 'अस्पताल, बीमारी, डॉक्टर, दवा खोजें...'
  }
};

export const MOCK_AUDIT_LOGS = [
  { id: 'log-1', timestamp: '2026-09-07 13:45', officer: 'Dr. S. Kumar', role: 'DHO', action: 'Approved Emergency Logistics Transfer #REQ-4412', module: 'Medicine Logistics', status: 'Success', location: 'Salem District HQ' },
  { id: 'log-2', timestamp: '2026-09-07 13:12', officer: 'Dr. R. Senthamilselvan', role: 'Dean', action: 'Updated Bed Availability & ICU Threshold', module: 'Beds & ICU', status: 'Success', location: 'Salem Medical College' },
  { id: 'log-3', timestamp: '2026-09-07 09:15', officer: 'Dr. K. Anand', role: 'DHO', action: 'Dispatched Vector Control Response Team to Mecheri Cluster #SURV-001', module: 'Disease Surveillance', status: 'Success', location: 'Salem Rural Division' }
];

export const MOCK_AI_PREDICTION = {
  villageName: 'Mecheri',
  disease: 'Dengue Outbreak Surge',
  riskScore: 88,
  riskLevel: 'CRITICAL SURGE',
  confidence: 94,
  forecastMessage: 'High probability of 230+ weekly dengue cases without immediate larval source reduction within 48h.',
  indicators: [
    { label: 'Larval Density Breteau Index', value: '38% (High Risk Threshold >20%)', status: 'critical' },
    { label: 'Rainfall & Stagnation Index', value: '42mm precipitation in 72h', status: 'warning' },
    { label: 'Early Fever Cluster Reports', value: '48 acute febrile cases reported in Mecheri', status: 'critical' }
  ],
  trendChart: [
    { period: 'Day -6', historical: 12, predicted: 12 },
    { period: 'Day -5', historical: 18, predicted: 18 },
    { period: 'Day -4', historical: 24, predicted: 25 },
    { period: 'Day -3', historical: 32, predicted: 30 },
    { period: 'Day -2', historical: 40, predicted: 38 },
    { period: 'Day -1', historical: 48, predicted: 46 },
    { period: 'Today', historical: 54, predicted: 54 },
    { period: 'Day +1', historical: 0, predicted: 72 },
    { period: 'Day +2', historical: 0, predicted: 95 },
    { period: 'Day +3', historical: 0, predicted: 124 },
    { period: 'Day +4', historical: 0, predicted: 160 },
    { period: 'Day +5', historical: 0, predicted: 205 }
  ]
};

export const MOCK_SURVEILLANCE_TRENDS = [
  { day: 'Day 1', dengue: 3, fever: 12, respiratory: 18 },
  { day: 'Day 2', dengue: 4, fever: 15, respiratory: 20 },
  { day: 'Day 3', dengue: 5, fever: 18, respiratory: 22 },
  { day: 'Day 4', dengue: 8, fever: 24, respiratory: 25 },
  { day: 'Day 5', dengue: 14, fever: 32, respiratory: 28 },
  { day: 'Day 6', dengue: 20, fever: 38, respiratory: 30 },
  { day: 'Day 7', dengue: 27, fever: 48, respiratory: 34 }
];

// ==========================================
// SEED DATA: SURVEILLANCE CASES (ALL 8 DISTRICTS) - CHC -> PHC
// ==========================================

export const SURVEILLANCE_CASES_DATA: SurveillanceCase[] = [
  // Salem Surveillance
  {
    id: 'SURV-2026-001',
    disease: 'Dengue Fever',
    district: 'Salem',
    taluk: 'Mettur',
    village: 'Mecheri',
    facility: 'Mecheri Primary Health Centre (PHC)',
    suspectedCases: 48,
    confirmedCases: 27,
    hospitalized: 14,
    recovered: 18,
    deathCount: 0,
    growthRate: '+238%',
    attackRate: 6.2,
    severity: 'Critical Outbreak',
    status: 'Active',
    reportedDate: '2026-09-07',
    actionProtocol: 'Vector control team & NS1 rapid testing kits dispatched. Larval source reduction in progress.',
    larvalBreteauIndex: 38,
    symptoms: ['High Fever', 'Severe Joint Pain', 'Retro-orbital Pain', 'Thrombocytopenia']
  },
  {
    id: 'SURV-2026-002',
    disease: 'Acute Respiratory Infection',
    district: 'Salem',
    taluk: 'Omalur',
    village: 'Omalur',
    facility: 'Omalur Taluk Hospital',
    suspectedCases: 145,
    confirmedCases: 86,
    hospitalized: 22,
    recovered: 74,
    deathCount: 0,
    growthRate: '+14%',
    attackRate: 3.1,
    severity: 'Active Cluster',
    status: 'Active',
    reportedDate: '2026-09-06',
    actionProtocol: 'Nebulization stations set up. Pediatric surveillance heightened.',
    larvalBreteauIndex: 0,
    symptoms: ['Cough', 'Wheezing', 'Fever', 'Sore Throat']
  },

  // Coimbatore Surveillance
  {
    id: 'SURV-CBE-001',
    disease: 'Acute Diarrhoeal Disease',
    district: 'Coimbatore',
    taluk: 'Pollachi',
    village: 'Pollachi Rural',
    facility: 'Pollachi Government Taluk Hospital',
    suspectedCases: 32,
    confirmedCases: 14,
    hospitalized: 6,
    recovered: 20,
    deathCount: 0,
    growthRate: '+8%',
    attackRate: 1.9,
    severity: 'Active Cluster',
    status: 'Active',
    reportedDate: '2026-09-06',
    actionProtocol: 'Water quality sampling and ORS distribution active.',
    larvalBreteauIndex: 0,
    symptoms: ['Watery Diarrhoea', 'Nausea', 'Abdominal Cramps']
  },

  // Chennai Surveillance
  {
    id: 'SURV-CHN-001',
    disease: 'Viral Upper Respiratory Infection',
    district: 'Chennai',
    taluk: 'Tondiarpet',
    village: 'Tondiarpet Zone',
    facility: 'Tondiarpet Primary Health Centre (PHC)',
    suspectedCases: 64,
    confirmedCases: 38,
    hospitalized: 8,
    recovered: 32,
    deathCount: 0,
    growthRate: '+18%',
    attackRate: 2.8,
    severity: 'Active Cluster',
    status: 'Active',
    reportedDate: '2026-09-07',
    actionProtocol: 'Mobile fever clinic and symptom screening active.',
    larvalBreteauIndex: 0,
    symptoms: ['High Fever', 'Dry Cough', 'Body Ache']
  },

  // Madurai Surveillance
  {
    id: 'SURV-MDU-001',
    disease: 'Chikungunya',
    district: 'Madurai',
    taluk: 'Melur',
    village: 'Melur Rural',
    facility: 'Melur Government Taluk Hospital',
    suspectedCases: 26,
    confirmedCases: 12,
    hospitalized: 4,
    recovered: 14,
    deathCount: 0,
    growthRate: '+12%',
    attackRate: 2.1,
    severity: 'Watchlist',
    status: 'Active',
    reportedDate: '2026-09-05',
    actionProtocol: 'Mosquito larvicide treatment and analgesics distributed.',
    larvalBreteauIndex: 18,
    symptoms: ['Joint Pain', 'Fever', 'Skin Rash']
  },

  // Erode Surveillance
  {
    id: 'SURV-ERD-001',
    disease: 'Acute Gastroenteritis',
    district: 'Erode',
    taluk: 'Bhavani',
    village: 'Bhavani Rural',
    facility: 'Bhavani Primary Health Centre (PHC)',
    suspectedCases: 28,
    confirmedCases: 11,
    hospitalized: 5,
    recovered: 18,
    deathCount: 0,
    growthRate: '+5%',
    attackRate: 1.6,
    severity: 'Controlled',
    status: 'Active',
    reportedDate: '2026-09-06',
    actionProtocol: 'Chlorination of rural overhead tanks completed.',
    larvalBreteauIndex: 0,
    symptoms: ['Diarrhoea', 'Vomiting', 'Dehydration']
  },

  // Tiruchirappalli Surveillance
  {
    id: 'SURV-TRC-001',
    disease: 'Typhoid Fever',
    district: 'Tiruchirappalli',
    taluk: 'Thottiyam',
    village: 'Thottiyam Rural',
    facility: 'Thottiyam Primary Health Centre (PHC)',
    suspectedCases: 19,
    confirmedCases: 8,
    hospitalized: 4,
    recovered: 12,
    deathCount: 0,
    growthRate: '+3%',
    attackRate: 1.2,
    severity: 'Watchlist',
    status: 'Active',
    reportedDate: '2026-09-05',
    actionProtocol: 'Food and water safety inspections conducted.',
    larvalBreteauIndex: 0,
    symptoms: ['Prolonged Fever', 'Headache', 'Loss of Appetite']
  },

  // Namakkal Surveillance
  {
    id: 'SURV-NMK-001',
    disease: 'Scrub Typhus',
    district: 'Namakkal',
    taluk: 'Kolli Hills',
    village: 'Kolli Hills Tribal Settlement',
    facility: 'Kolli Hills Tribal Primary Health Centre (PHC)',
    suspectedCases: 16,
    confirmedCases: 7,
    hospitalized: 3,
    recovered: 9,
    deathCount: 0,
    growthRate: '+10%',
    attackRate: 1.8,
    severity: 'Watchlist',
    status: 'Active',
    reportedDate: '2026-09-04',
    actionProtocol: 'Doxycycline treatment initiated. Mite repellent awareness in hills.',
    larvalBreteauIndex: 0,
    symptoms: ['Eschar Lesion', 'High Fever', 'Swollen Lymph Nodes']
  },

  // Dharmapuri Surveillance
  {
    id: 'SURV-DHP-001',
    disease: 'Dengue Fever Outbreak',
    district: 'Dharmapuri',
    taluk: 'Pennagaram',
    village: 'Pennagaram Rural',
    facility: 'Pennagaram Primary Health Centre (PHC)',
    suspectedCases: 38,
    confirmedCases: 21,
    hospitalized: 11,
    recovered: 15,
    deathCount: 0,
    growthRate: '+190%',
    attackRate: 5.4,
    severity: 'Critical Outbreak',
    status: 'Active',
    reportedDate: '2026-09-07',
    actionProtocol: 'Vector source reduction in full effect. Rapid NS1 testing camps setup.',
    larvalBreteauIndex: 36,
    symptoms: ['High Fever', 'Joint Pain', 'Retro-orbital Headache', 'Petechiae']
  }
];
