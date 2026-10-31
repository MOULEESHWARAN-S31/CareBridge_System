import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { 
  DISTRICTS_DATA,
  FACILITIES_DATA,
  DOCTORS_DATA,
  MASKED_PATIENTS_DATA,
  SURVEILLANCE_CASES_DATA,
  TELEMEDICINE_SESSIONS_DATA,
  MEDICINE_INVENTORY_DATA,
  DIAGNOSTICS_DATA,
  GOVERNMENT_SCHEMES_DATA,
  RULE_ALERTS_DATA,
  AUDIT_LOGS_DATA,
  MOCK_VILLAGES,
  MOCK_HOSPITALS,
  MOCK_ALERTS,
  MOCK_EMERGENCY_SUPPLIES,
  MOCK_MEDICINES,
  DISTRICT_SUMMARIES,
  INITIAL_REGISTERED_USERS,
  type UserRole,
  type UserAccount,
  type DistrictInfo,
  type Facility,
  type Doctor,
  type MaskedPatient,
  type SurveillanceCase,
  type TelemedicineSession,
  type MedicineInventoryItem,
  type DiagnosticItem,
  type GovernmentScheme,
  type RuleAlert,
  type AuditLogItem,
  type VillageData,
  type HospitalData,
  type DiseaseAlert,
  type EmergencySupplyItem,
  type MedicineItem,
  type FacilitySupplyBreakdown,
  type DistrictSummary,
  MOCK_DISTRICT_REQUESTS,
  MOCK_CITIZEN_CAMP_REQUESTS,
  MOCK_FOLLOW_UP_PROGRAMS,
  MOCK_PUBLIC_HEALTH_NOTICES,
  type DistrictResourceRequest,
  type CitizenCampRequest,
  type FollowUpProgramItem,
  type PublicHealthNotice
} from '../data/mockData';

interface HealthDataContextType {
  // Role & Session State
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  officerName: string;
  setOfficerName: (name: string) => void;
  officerDesignation: string;
  isOfflineMock: boolean;
  logout: () => void;
  
  // District Assignment & Scoping
  userDistrict: string;
  setUserDistrict: (district: string) => void;

  // Workspaces (State Admin vs District Admin)
  userWorkspace: 'STATE_ADMIN' | 'DISTRICT_ADMIN';
  setUserWorkspace: (ws: 'STATE_ADMIN' | 'DISTRICT_ADMIN') => void;
  canAccessStateWorkspace: boolean;
  districtRequests: DistrictResourceRequest[];
  updateDistrictRequestStatus: (id: string, status: DistrictResourceRequest['status'], reviewNotes?: string) => void;
  citizenCampRequests: CitizenCampRequest[];
  updateCitizenCampRequestStatus: (id: string, status: CitizenCampRequest['status']) => void;
  followUpPrograms: FollowUpProgramItem[];
  publicNotices: PublicHealthNotice[];

  // Location & Filters
  stateName: string;
  setStateName: (name: string) => void;
  districtName: string;
  setDistrictName: (name: string) => void;
  selectedFacilityId: string | null;
  setSelectedFacilityId: (id: string | null) => void;
  
  // Preferences & Demo
  demoMode: boolean;
  setDemoMode: (enabled: boolean) => void;

  // User Management
  registeredUsers: UserAccount[];
  createRegisteredUser: (userData: Omit<UserAccount, 'id' | 'createdDate'>) => UserAccount;

  // Active Core Datasets (Filtered by District)
  districts: DistrictInfo[];
  currentDistrict: DistrictInfo;
  facilities: Facility[];
  doctors: Doctor[];
  patients: MaskedPatient[];
  surveillanceCases: SurveillanceCase[];
  telemedicineSessions: TelemedicineSession[];
  medicines: MedicineInventoryItem[];
  diagnosticItems: DiagnosticItem[];
  schemes: GovernmentScheme[];
  ruleAlerts: RuleAlert[];
  auditLogs: AuditLogItem[];

  // Unfiltered/All Datasets
  allFacilities: Facility[];
  allDoctors: Doctor[];

  // Legacy/Compatibility state
  districtSummary: DistrictSummary;
  villages: VillageData[];
  hospitals: HospitalData[];
  alerts: DiseaseAlert[];
  emergencySupplies: EmergencySupplyItem[];
  oldMedicines: MedicineItem[];
  facilitySupplyBreakdown: FacilitySupplyBreakdown[];
  selectedVillage: VillageData | null;
  setSelectedVillage: (village: VillageData | null) => void;
  activeActionAlert: DiseaseAlert | null;
  setActiveActionAlert: (alert: DiseaseAlert | null) => void;

  // Search & Global Modals
  globalSearchOpen: boolean;
  setGlobalSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  notificationsOpen: boolean;
  setNotificationsOpen: (open: boolean) => void;
  notifications: { id: string; title: string; desc: string; type: 'critical' | 'warning' | 'info'; read: boolean; timestamp: string }[];
  markNotificationAsRead: (id: string) => void;
  
  // Interactive Action Handlers
  addSurveillanceCase: (caseData: Omit<SurveillanceCase, 'id' | 'reportedDate'>) => void;
  updateSurveillanceCaseStatus: (id: string, newStatus: SurveillanceCase['status'], actionProtocol?: string) => void;
  flagEpidemiologist: (clusterId: string) => void;
  triggerMedicineRequisition: (medicineId: string, quantity: number, sourceFacility: string) => void;
  resolveRuleAlert: (alertId: string) => void;
  addAuditLog: (action: string, module: string, details: string) => void;
  updateAlertProgressStep: (alertId: string, stepIndex: number) => void;
  createNewAlert: (villageName: string, disease: string) => void;
}

const HealthDataContext = createContext<HealthDataContextType | undefined>(undefined);

export const HealthDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication & Role Enforcement state
  const [accessDeniedMessage, setAccessDeniedMessage] = useState<string | null>(null);
  const [isAuthValid, setIsAuthValid] = useState(false);
  const [isOfflineMock, setIsOfflineMock] = useState(false);
  // Session & Role state
  const [userRole, setUserRole] = useState<UserRole>(() => {
    return (localStorage.getItem('carebridge_user_role') as UserRole) || 'District Administrator';
  });
  const [officerName, setOfficerName] = useState(() => {
    return localStorage.getItem('carebridge_officer_name') || 'Dr. S. Sundararajan';
  });
  const [userDistrict, setUserDistrict] = useState<string>(() => {
    return localStorage.getItem('carebridge_user_district') || 'Salem';
  });
  const [stateName, setStateName] = useState('Tamil Nadu');
  const [districtName, setDistrictNameState] = useState<string>(() => {
    return localStorage.getItem('carebridge_user_district') || 'Salem';
  });
  const [canAccessStateWorkspace, setCanAccessStateWorkspace] = useState(false);
  const handoffStarted = useRef(false);

  // Workspaces: State Admin vs District Admin
  const [userWorkspace, setUserWorkspaceState] = useState<'STATE_ADMIN' | 'DISTRICT_ADMIN'>(() => {
    return 'DISTRICT_ADMIN';
  });

  const setUserWorkspace = (ws: 'STATE_ADMIN' | 'DISTRICT_ADMIN') => {
    if (ws === 'STATE_ADMIN' && !canAccessStateWorkspace) return;
    setUserWorkspaceState(ws);
    localStorage.setItem('carebridge_user_workspace', ws);
    if (ws === 'STATE_ADMIN') {
      setDistrictNameState('ALL');
    } else {
      setDistrictNameState(userDistrict && userDistrict !== 'ALL' ? userDistrict : 'Salem');
    }
  };

  const setDistrictName = (name: string) => {
    if (!canAccessStateWorkspace && userDistrict && name !== userDistrict) return;
    setDistrictNameState(name);
  };

  const [districtRequests, setDistrictRequests] = useState<DistrictResourceRequest[]>(() => {
    try {
      const saved = localStorage.getItem('carebridge_district_requests');
      if (saved) return JSON.parse(saved);
    } catch {}
    return MOCK_DISTRICT_REQUESTS;
  });

  const updateDistrictRequestStatus = (id: string, status: DistrictResourceRequest['status'], reviewNotes?: string) => {
    setDistrictRequests(prev => {
      const updated = prev.map(req => req.id === id ? { ...req, status, reviewNotes: reviewNotes || req.reviewNotes } : req);
      localStorage.setItem('carebridge_district_requests', JSON.stringify(updated));
      return updated;
    });
  };

  const [citizenCampRequests, setCitizenCampRequests] = useState<CitizenCampRequest[]>(() => {
    try {
      const saved = localStorage.getItem('carebridge_citizen_camp_requests');
      if (saved) return JSON.parse(saved);
    } catch {}
    return MOCK_CITIZEN_CAMP_REQUESTS;
  });

  const updateCitizenCampRequestStatus = (id: string, status: CitizenCampRequest['status']) => {
    setCitizenCampRequests(prev => {
      const updated = prev.map(req => req.id === id ? { ...req, status } : req);
      localStorage.setItem('carebridge_citizen_camp_requests', JSON.stringify(updated));
      return updated;
    });
  };

  const [followUpPrograms] = useState<FollowUpProgramItem[]>(MOCK_FOLLOW_UP_PROGRAMS);
  const [publicNotices] = useState<PublicHealthNotice[]>(MOCK_PUBLIC_HEALTH_NOTICES);
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(null);

  // Synchronize districtName whenever userDistrict changes
  useEffect(() => {
    if (userDistrict && userDistrict !== 'ALL') {
      setDistrictNameState(userDistrict);
    }
  }, [userDistrict]);

  // Keep localStorage updated for session retention
  useEffect(() => {
    localStorage.setItem('carebridge_user_role', userRole);
    localStorage.setItem('carebridge_officer_name', officerName);
    localStorage.setItem('carebridge_user_district', userDistrict);
  }, [userRole, officerName, userDistrict]);

  // Settings
  const [demoMode, setDemoMode] = useState(true);

  // Registered Users (Persisted)
  const [registeredUsers, setRegisteredUsers] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem('carebridge_registered_users');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_REGISTERED_USERS;
  });

  const saveRegisteredUsers = (users: UserAccount[]) => {
    setRegisteredUsers(users);
    localStorage.setItem('carebridge_registered_users', JSON.stringify(users));
  };

  // Datasets State
  const [districts] = useState<DistrictInfo[]>(DISTRICTS_DATA);
  const [allFacilities, setAllFacilities] = useState<Facility[]>(FACILITIES_DATA);
  const [allDoctors, setAllDoctors] = useState<Doctor[]>(DOCTORS_DATA);
  const [allPatients] = useState<MaskedPatient[]>(MASKED_PATIENTS_DATA);
  const [allSurveillanceCases, setAllSurveillanceCases] = useState<SurveillanceCase[]>(SURVEILLANCE_CASES_DATA);
  const [telemedicineSessions] = useState<TelemedicineSession[]>(TELEMEDICINE_SESSIONS_DATA);
  const [allMedicines, setAllMedicines] = useState<MedicineInventoryItem[]>(MEDICINE_INVENTORY_DATA);
  const [allDiagnosticItems] = useState<DiagnosticItem[]>(DIAGNOSTICS_DATA);
  const [schemes] = useState<GovernmentScheme[]>(GOVERNMENT_SCHEMES_DATA);
  const [ruleAlerts, setRuleAlerts] = useState<RuleAlert[]>(RULE_ALERTS_DATA);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    try {
      const saved = localStorage.getItem('carebridge_audit_logs');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fall back to the bundled audit trail when stored data is unavailable.
    }
    return AUDIT_LOGS_DATA;
  });

  useEffect(() => {
    localStorage.setItem('carebridge_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Logout Handler
  const logout = () => {
    localStorage.removeItem('cb_auth_token');
    localStorage.removeItem('cb_auth_user');
    sessionStorage.removeItem('cb_auth_token');
    sessionStorage.removeItem('cb_auth_user');
    localStorage.removeItem('carebridge_user_role');
    localStorage.removeItem('carebridge_officer_name');
    localStorage.removeItem('carebridge_user_district');
    localStorage.removeItem('carebridge_registered_users');
    window.location.href = 'http://localhost:3000';
  };

  // Helper to decode server-signed JWT claims
  function parseJwt(tokenStr: string) {
    try {
      const base64Url = tokenStr.split('.')[1];
      if (!base64Url) return null;
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }

  // Strict Role-Based Authentication & Guard
  useEffect(() => {
    if (handoffStarted.current) return;
    handoffStarted.current = true;
    const initializeAuthentication = async () => {
      // 1. Exchange the short-lived handoff code before reading session state.
      const urlParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const handoffCode = urlParams.get('handoff') || hashParams.get('handoff');
      const paramToken = urlParams.get('token') || hashParams.get('token');
      const paramUser = urlParams.get('user') || hashParams.get('user');

      if (handoffCode) {
        try {
          const handoffResponse = await fetch('http://localhost:5000/api/auth/handoff/exchange', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: handoffCode, destination: 'government' })
          });
          const handoff = await handoffResponse.json();
          if (!handoffResponse.ok || !handoff.token) throw new Error(handoff.error || 'Secure login handoff failed.');
          localStorage.setItem('cb_auth_token', handoff.token);
          if (handoff.user) localStorage.setItem('cb_auth_user', JSON.stringify(handoff.user));
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (error) {
          setAccessDeniedMessage(error instanceof Error ? error.message : 'Secure login handoff failed.');
          return;
        }
      } else {
        if (paramToken) {
          localStorage.setItem('cb_auth_token', paramToken);
          sessionStorage.setItem('cb_auth_token', paramToken);
        }
        if (paramUser) {
          localStorage.setItem('cb_auth_user', paramUser);
          sessionStorage.setItem('cb_auth_user', paramUser);
        }
      }

      // Immediately sanitize token/user from URL (Requirement 5)
      if (paramToken || paramUser || window.location.search.includes('token=')) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    const token = localStorage.getItem('cb_auth_token') || sessionStorage.getItem('cb_auth_token');
    const userStr = localStorage.getItem('cb_auth_user') || sessionStorage.getItem('cb_auth_user');

    if (!token) {
      // Unauthenticated -> redirect to Common Login (Requirement 8)
      window.location.href = 'http://localhost:3000';
      return;
    }

    // Requirement 3: Role must be server-authoritative from JWT
    const jwtPayload = parseJwt(token);
    const serverRole = (jwtPayload?.role || '').toUpperCase();

    let user: any = null;
    try {
      user = userStr ? JSON.parse(userStr) : jwtPayload;
    } catch {
      user = jwtPayload;
    }

    // Requirement 4: Strict role check: GOVERNMENT only. Block ADMIN or unauthorized roles with Access Denied.
    if (serverRole !== 'GOVERNMENT') {
      setAccessDeniedMessage(
        `Access Denied: Government Dashboard requires the GOVERNMENT role. Your current server-authenticated role is "${serverRole || user?.role || 'UNKNOWN'}". Administrators must use the Admin Dashboard at port 5173.`
      );
      setIsAuthValid(false);
      return;
    }

    if (jwtPayload?.name || user?.full_name || user?.name) {
      setOfficerName(jwtPayload?.name || user?.full_name || user?.name);
    }
    if (jwtPayload?.district || user?.district) {
      setUserDistrict(jwtPayload?.district || user?.district);
      setDistrictNameState(jwtPayload?.district || user?.district);
    }
    const allowedWorkspaces = Array.isArray(jwtPayload?.allowedWorkspaces)
      ? jwtPayload.allowedWorkspaces
      : [jwtPayload?.workspace];
    const stateAllowed = allowedWorkspaces.includes('STATE_ADMIN');
    setCanAccessStateWorkspace(stateAllowed);
    setUserWorkspaceState(stateAllowed && jwtPayload?.workspace === 'STATE_ADMIN' ? 'STATE_ADMIN' : 'DISTRICT_ADMIN');
      setIsAuthValid(true);
    };
    initializeAuthentication();
    return undefined;
  }, []);

  // Live Data Loading with Fallback to Mock Data
  useEffect(() => {
    if (!isAuthValid) return;

    const fetchLiveData = async () => {
      try {
        // Fetch Facilities from live PostgreSQL backend
        const facRes = await api.get<any[]>('/facilities');
        if (Array.isArray(facRes) && facRes.length > 0) {
          const mappedFacilities: Facility[] = facRes.map((f: any, idx: number) => ({
            id: String(f.id || `fac-${idx}`),
            name: f.name,
            district: f.district || 'Salem',
            taluk: f.taluk || f.district || 'Salem',
            type: (f.type as any) || 'Government Hospital',
            doctorsCount: f.doctorsCount || 12,
            nursesCount: f.nursesCount || 24,
            totalBeds: Number(f.total_beds || f.totalBeds || 100),
            occupiedBeds: Math.max(0, Number(f.total_beds || f.totalBeds || 100) - Number(f.available_beds || f.availableBeds || 20)),
            availableBeds: Number(f.available_beds || f.availableBeds || 20),
            icuBeds: { total: 10, occupied: 6 },
            emergencyBeds: { total: 8, occupied: 3 },
            pediatricBeds: { total: 15, occupied: 8 },
            patientsToday: 45,
            medicineStatus: (f.status === 'Operational' ? 'Optimal' : 'Low') as any,
            diagnosticStatus: 'Full Service',
            facilityStatus: 'Operational',
            contactNumber: f.contact_number || f.contactNumber || '0427-2453000',
            officerInCharge: f.officer_in_charge || 'Medical Superintendent',
            coordinates: { lat: 11.6643, lng: 78.1460 }
          }));
          setAllFacilities(mappedFacilities);
        }

        // Fetch Doctors from live PostgreSQL backend
        const docRes = await api.get<any[]>('/doctors');
        if (Array.isArray(docRes) && docRes.length > 0) {
          const mappedDoctors: Doctor[] = docRes.map((d: any, idx: number) => ({
            id: String(d.id || `doc-${idx}`),
            name: d.name,
            specialization: (d.specialization as any) || 'General Medicine',
            facilityName: d.facility_name || d.facilityName || 'Government District Hospital',
            facilityType: d.facility_type || 'District Hospital',
            district: d.district || 'Salem',
            taluk: d.taluk || d.district || 'Salem',
            availability: 'Available',
            consultationLoadToday: 14,
            teleconsultationAvailable: true,
            contact: d.phone || d.contact || '9876543210',
            experienceYears: 8
          }));
          setAllDoctors(mappedDoctors);
        }

        setIsOfflineMock(false);
      } catch (err) {
        console.warn('Backend API offline or unreachable, using fallback mock data:', err);
        setIsOfflineMock(true);
      }
    };

    fetchLiveData();
  }, [isAuthValid]);

  // Legacy compat datasets
  const [allVillages] = useState<VillageData[]>(MOCK_VILLAGES);
  const [allHospitals] = useState<HospitalData[]>(MOCK_HOSPITALS);
  const [allAlerts, setAllAlerts] = useState<DiseaseAlert[]>(MOCK_ALERTS);
  const [allEmergencySupplies] = useState<EmergencySupplyItem[]>(MOCK_EMERGENCY_SUPPLIES);
  const [allOldMedicines] = useState<MedicineItem[]>(MOCK_MEDICINES);
  const [selectedVillage, setSelectedVillage] = useState<VillageData | null>(null);
  const [activeActionAlert, setActiveActionAlert] = useState<DiseaseAlert | null>(null);

  // Filtered Datasets based on selected districtName
  const currentDistrict = districts.find(d => d.name.toLowerCase() === districtName.toLowerCase()) || districts[0];
  const districtSummary = DISTRICT_SUMMARIES[districtName] || DISTRICT_SUMMARIES['Salem'];

  const facilities = allFacilities.filter(f => (f.district || 'Salem').toLowerCase() === districtName.toLowerCase());
  const doctors = allDoctors.filter(d => (d.district || 'Salem').toLowerCase() === districtName.toLowerCase());
  const patients = allPatients.filter(p => (p.district || 'Salem').toLowerCase() === districtName.toLowerCase());
  const surveillanceCases = allSurveillanceCases.filter(s => (s.district || 'Salem').toLowerCase() === districtName.toLowerCase());
  const medicines = allMedicines.filter(m => (m.district || 'Salem').toLowerCase() === districtName.toLowerCase());
  const diagnosticItems = allDiagnosticItems.filter(d => (d.district || 'Salem').toLowerCase() === districtName.toLowerCase());
  const villages = allVillages.filter(v => (v.district || 'Salem').toLowerCase() === districtName.toLowerCase());
  const hospitals = allHospitals.filter(h => (h.district || 'Salem').toLowerCase() === districtName.toLowerCase());
  const alerts = allAlerts.filter(a => (a.district || 'Salem').toLowerCase() === districtName.toLowerCase());
  const emergencySupplies = allEmergencySupplies.filter(s => (s.district || 'Salem').toLowerCase() === districtName.toLowerCase());
  const oldMedicines = allOldMedicines.filter(m => (m.district || 'Salem').toLowerCase() === districtName.toLowerCase());

  // Search & Navigation Modals
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 'n1', title: 'Hospital Overcrowding Alert', desc: 'Taluk Hospital is currently at high bed occupancy.', type: 'critical' as const, read: false, timestamp: '15m ago' },
    { id: 'n2', title: 'Critical Medicine Stockout', desc: 'Essential buffer stock critical at PHC.', type: 'critical' as const, read: false, timestamp: '32m ago' },
    { id: 'n3', title: 'Specialist Duty Rotation', desc: 'Clinical specialist duty shifts updated for district roster.', type: 'warning' as const, read: false, timestamp: '1h ago' }
  ]);

  const officerDesignation = userRole === 'State Administrator' 
    ? 'State Mission Director (NHM)' 
    : userRole === 'District Administrator' 
    ? `District Health Officer (${districtName})` 
    : `Medical Superintendent (${districtName})`;

  const facilitySupplyBreakdown: FacilitySupplyBreakdown[] = facilities.map(f => ({
    hospitalName: f.name,
    hospitalType: f.type,
    readinessPercentage: f.medicineStatus === 'Optimal' ? 96 : f.medicineStatus === 'Low' ? 68 : 38,
    criticalKits: f.availableBeds,
    maxKits: f.totalBeds,
    status: f.medicineStatus
  }));


  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const addAuditLog = (action: string, module: string, details: string) => {
    const newLog: AuditLogItem = {
      id: `LOG-${Date.now()}`,
      user: `${officerName} (${userRole})`,
      role: userRole,
      action,
      module,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ipAddress: '10.14.22.81 (Govt-NIC)',
      result: 'Success',
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // User Management
  const createRegisteredUser = (userData: Omit<UserAccount, 'id' | 'createdDate'>): UserAccount => {
    const newUser: UserAccount = {
      ...userData,
      id: `USR-${Date.now()}`,
      createdDate: new Date().toISOString().split('T')[0]
    };
    const updatedList = [newUser, ...registeredUsers];
    saveRegisteredUsers(updatedList);
    addAuditLog(`Created User ID: ${newUser.employeeId}`, 'User Administration', `Assigned District: ${newUser.district}, Role: ${newUser.role}`);
    return newUser;
  };

  // Disease Surveillance Actions
  const addSurveillanceCase = (caseData: Omit<SurveillanceCase, 'id' | 'reportedDate'>) => {
    const newId = `SURV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newRecord: SurveillanceCase = {
      ...caseData,
      id: newId,
      reportedDate: new Date().toISOString().split('T')[0]
    };
    setAllSurveillanceCases(prev => [newRecord, ...prev]);
    addAuditLog(`Logged Surveillance Case ${newId}`, 'Disease Surveillance', `Reported ${newRecord.disease} in ${newRecord.village}, ${newRecord.district}`);
  };

  const updateSurveillanceCaseStatus = (id: string, newStatus: SurveillanceCase['status'], actionProtocol?: string) => {
    setAllSurveillanceCases(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: newStatus,
          actionProtocol: actionProtocol || c.actionProtocol,
          severity: newStatus === 'Resolved' ? 'Controlled' : newStatus === 'Contained' ? 'Controlled' : c.severity
        };
      }
      return c;
    }));
    addAuditLog(`Updated Surveillance Cluster ${id} -> ${newStatus}`, 'Disease Surveillance', actionProtocol || `Status updated to ${newStatus}`);
  };

  const flagEpidemiologist = (clusterId: string) => {
    const targetCluster = allSurveillanceCases.find(c => c.id === clusterId);
    if (targetCluster) {
      updateSurveillanceCaseStatus(clusterId, 'Dispatched', 'Rapid Response Vector Control Team & District Epidemiologist Dispatched on-site.');
      addAuditLog(`Flagged Alert to District Epidemiologist for ${clusterId}`, 'Disease Surveillance', `High surge intervention for ${targetCluster.disease} in ${targetCluster.village}`);
    }
  };

  const triggerMedicineRequisition = (medicineId: string, quantity: number, sourceFacility: string) => {
    setAllMedicines(prev => prev.map(m => {
      if (m.id === medicineId) {
        const newQty = m.availableQuantity + quantity;
        const newStatus = newQty >= m.minimumStockThreshold ? 'Adequate' : 'Low';
        return { ...m, availableQuantity: newQty, status: newStatus };
      }
      return m;
    }));
    addAuditLog(`Emergency Requisition: +${quantity} units to ${sourceFacility}`, 'Medicine Inventory', `Medicine item ID ${medicineId}`);
  };

  const resolveRuleAlert = (alertId: string) => {
    setRuleAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'Resolved' } : a));
    addAuditLog(`Resolved Government Alert #${alertId}`, 'Alerts Module', 'Action completed by officer');
  };

  const updateAlertProgressStep = (alertId: string, stepIndex: number) => {
    setAllAlerts(prev => prev.map(alert => {
      if (alert.id === alertId) {
        const newSteps = [...alert.actionProgressSteps];
        newSteps[stepIndex] = {
          ...newSteps[stepIndex],
          completed: true,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        const allCompleted = newSteps.every(s => s.completed);
        const newStatus: DiseaseAlert['status'] = allCompleted ? 'Resolved' : 'Action Dispatched';
        return { ...alert, status: newStatus, actionProgressSteps: newSteps };
      }
      return alert;
    }));
  };

  const createNewAlert = (villageName: string, disease: string) => {
    const newAlt: DiseaseAlert = {
      id: `alt-${Date.now()}`,
      villageId: 'v1',
      villageName,
      disease,
      normalWeeklyCases: 5,
      currentCases: 22,
      increasePercentage: 340,
      riskLevel: 'HIGH',
      status: 'Action Dispatched',
      timestamp: 'Just now',
      assignedOfficer: officerName,
      district: districtName,
      actionProgressSteps: [
        { step: 'Alert Generated', completed: true, timestamp: 'Just now' },
        { step: 'Officer Assigned', completed: true, timestamp: 'Just now' },
        { step: 'Deploy Medical Team', completed: false }
      ]
    };
    setAllAlerts(prev => [newAlt, ...prev]);
  };

  if (accessDeniedMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 text-white font-sans">
        <div className="bg-slate-800 border border-red-500/40 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl space-y-4">
          <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-2xl flex items-center justify-center mx-auto text-3xl font-black">
            ✕
          </div>
          <h2 className="text-xl font-black text-red-400">Access Denied</h2>
          <p className="text-sm text-slate-300 leading-relaxed">{accessDeniedMessage}</p>
          <div className="pt-4 space-y-2">
            <a
              href="http://localhost:3000"
              className="block w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-500 font-bold rounded-xl text-white text-sm transition"
            >
              Go to CareBridge Common Login
            </a>
            <a
              href="http://localhost:5173"
              className="block w-full py-2.5 px-4 bg-slate-700 hover:bg-slate-600 font-bold rounded-xl text-slate-200 text-sm transition"
            >
              Go to Admin Dashboard (:5173)
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <HealthDataContext.Provider value={{
      userRole, setUserRole,
      userWorkspace, setUserWorkspace,
      canAccessStateWorkspace,
      districtRequests, updateDistrictRequestStatus,
      citizenCampRequests, updateCitizenCampRequestStatus,
      followUpPrograms,
      publicNotices,
      officerName, setOfficerName,
      officerDesignation,
      isOfflineMock,
      logout,
      userDistrict, setUserDistrict,
      stateName, setStateName,
      districtName, setDistrictName,
      selectedFacilityId, setSelectedFacilityId,
      demoMode, setDemoMode,
      registeredUsers,
      createRegisteredUser,
      districts,
      currentDistrict,
      facilities,
      doctors,
      patients,
      surveillanceCases,
      telemedicineSessions,
      medicines,
      diagnosticItems,
      schemes,
      ruleAlerts,
      auditLogs,
      allFacilities,
      allDoctors,
      districtSummary,
      villages,
      hospitals,
      alerts,
      emergencySupplies,
      oldMedicines,
      facilitySupplyBreakdown,
      selectedVillage, setSelectedVillage,
      activeActionAlert, setActiveActionAlert,
      globalSearchOpen, setGlobalSearchOpen,
      searchQuery, setSearchQuery,
      notificationsOpen, setNotificationsOpen,
      notifications, markNotificationAsRead,
      addSurveillanceCase,
      updateSurveillanceCaseStatus,
      flagEpidemiologist,
      triggerMedicineRequisition,
      resolveRuleAlert,
      addAuditLog,
      updateAlertProgressStep,
      createNewAlert
    }}>
      {children}
    </HealthDataContext.Provider>
  );
};

export const useHealthData = () => {
  const context = useContext(HealthDataContext);
  if (!context) {
    throw new Error('useHealthData must be used within a HealthDataProvider');
  }
  return context;
};
