// Remaining Indian Languages — Odia, Assamese, Sanskrit, Konkani, Kashmiri (RTL), Nepali, Sindhi (RTL), Manipuri, Bodo, Dogri, Maithili, Santali

// Helper: build from base English with overrides
const base = (overrides) => ({
  login: 'Login', logout: 'Logout', email: 'Hospital ID / Email', password: 'Password',
  rememberMe: 'Remember me', forgotPassword: 'Forgot Password?',
  loginBtn: 'Login to Hospital Portal', loggingIn: 'Authenticating...',
  selectRole: 'Select Your Role', loginSuccess: 'Login successful!',
  demoMode: 'DEMO MODE', demoNote: 'Click Login with any credentials.',
  language: 'Language', goodMorning: 'Good Morning', goodAfternoon: 'Good Afternoon',
  goodEvening: 'Good Evening', dashboard: 'Dashboard', patients: 'Patients',
  doctors: 'Doctors & Staff', appointments: 'Appointments', opd: 'OPD Management',
  consultations: 'Teleconsultation', triage: 'Symptom Triage', referrals: 'Referrals',
  diagnostics: 'Diagnostics / Lab', pharmacy: 'Pharmacy', inventory: 'Inventory',
  medicalRecords: 'Medical Records', wards: 'Wards & Beds', emergency: 'Emergency',
  ambulance: 'Ambulance', facilities: 'Healthcare Facilities', analytics: 'Analytics',
  districtMonitor: 'District Monitor', notifications: 'Notifications',
  staff: 'Staff Management', profile: 'My Profile', settings: 'Settings',
  navClinical: 'CLINICAL', navDiagnostics: 'DIAGNOSTICS & PHARMACY',
  navHospitalOps: 'HOSPITAL OPERATIONS', navAdmin: 'ADMINISTRATION', navAccount: 'ACCOUNT',
  totalPatients: 'Total Patients', todayAppointments: "Today's Appointments",
  opdPatients: 'OPD Patients Today', pendingReferrals: 'Pending Referrals',
  teleconsultations: 'Teleconsultations', pendingLabTests: 'Pending Lab Tests',
  availableBeds: 'Available Beds', lowStockMedicines: 'Low Stock Medicines',
  emergencyCases: 'Emergency Cases', quickActions: '⚡ Quick Actions',
  registerPatient: 'Register Patient', scheduleAppointment: 'Schedule Appointment',
  createReferral: 'Create Referral', requestLabTest: 'Request Lab Test',
  dispenseMedicine: 'Dispense Medicine', startTeleconsult: 'Start Teleconsult',
  emergencyAction: 'Emergency', viewMedicalRecords: 'Medical Records',
  search: 'Search', filter: 'Filter', add: 'Add', edit: 'Edit', save: 'Save',
  cancel: 'Cancel', loading: 'Loading...', noData: 'No data available',
  notFound: 'Page Not Found', notFoundMsg: 'This page does not exist.',
  goHome: 'Go to Dashboard', connected: 'Connected', weakSignal: 'Weak Signal',
  offline: 'Offline', active: 'Active', critical: 'Critical', referred: 'Referred',
  discharged: 'Discharged', waiting: 'Waiting', inConsultation: 'In Consultation',
  completed: 'Completed', cancelled: 'Cancelled', requested: 'Requested',
  accepted: 'Accepted', inTransit: 'In Transit', lowStock: 'Low Stock',
  outOfStock: 'Out of Stock', maintenance: 'Maintenance', onCall: 'On Call',
  transporting: 'Transporting', onDuty: 'On Duty', offDuty: 'Off Duty',
  saveChanges: 'Save Changes', markRead: 'Mark as Read', clearAll: 'Clear All',
  noNotifications: 'No notifications', subcentre: 'Sub-centre', phc: 'PHC',
  ruralHospital: 'Rural Hospital', districtHospital: 'District Hospital',
  healthcareNetwork: 'Healthcare Network', editProfile: 'Edit Profile',
  changePassword: 'Change Password', dispatch: 'Dispatch', track: 'Track',
  driver: 'Driver', location: 'Location', reorder: 'Reorder', assignBed: 'Assign Bed',
  occupancy: 'Occupancy', today: 'Today', thisWeek: 'This Week',
  thisMonth: 'This Month', thisYear: 'This Year', name: 'Name', role: 'Role',
  shift: 'Shift', addStaff: 'Add Staff', tableView: '☰ Table View',
  cardView: '⊞ Card View', stockAlert: 'Stock Alert',
  roleAdmin: 'Hospital Admin', roleDoctor: 'Doctor', roleNurse: 'Nurse',
  roleReceptionist: 'Receptionist', roleLabStaff: 'Lab Staff',
  roleLabAssistant: 'Lab Assistant', rolePharmacy: 'Pharmacy Staff',
  appName: 'CareConnect Hospital', appTagline: 'Hospital Management System',
  portalTitle: 'Hospital Management Portal',
  portalSubtitle: 'Secure access for healthcare professionals',
  // Dashboard stat keys
  occupiedBeds: 'Occupied Beds', quickActions: 'Quick Actions',
  // Role-specific sidebar nav labels
  myPatients: 'My Patients', assignedPatients: 'Assigned Patients',
  patientRegistration: 'Patient Registration', opdQueue: 'OPD Queue',
  doctorAvailability: 'Doctor Availability', patientRecords: 'Patient Records',
  testRequests: 'Test Requests', samplesCollected: 'Samples Collected',
  prescriptions: 'Prescriptions',
  ...overrides,
});

// Odia
export const or = base({
  appName: 'କୟାର୍‌କନେକ୍ଟ ହସ୍ପିଟାଲ', portalTitle: 'ଡାକ୍ତରଖାନା ପରିଚାଳନା ପୋର୍ଟାଲ',
  portalSubtitle: 'ସ୍ୱାସ୍ଥ୍ୟ ବୃତ୍ତିଜୀବୀଙ୍କ ପାଇଁ ସୁରକ୍ଷିତ ପ୍ରବେଶ',
  login: 'ଲଗ ଇନ', logout: 'ଲଗ ଆଉଟ', roleAdmin: 'ହସ୍ପିଟାଲ ଆଡ୍ମିନ', roleDoctor: 'ଡାକ୍ତର',
  roleNurse: 'ନର୍ସ', goodMorning: 'ଶୁଭ ସକାଳ', goodAfternoon: 'ଶୁଭ ଅପରାହ୍ଣ', goodEvening: 'ଶୁଭ ସନ୍ଧ୍ୟା',
  welcomeTo: 'କୟାର୍‌କନେକ୍ଟ ହସ୍ପିଟାଲକୁ ସ୍ୱାଗତ',
  dashboard: 'ଡ୍ୟାଶ୍‌ବୋର୍ଡ', patients: 'ରୋଗୀ', doctors: 'ଡାକ୍ତର ଓ କର୍ମଚାରୀ',
  language: 'ଭାଷା', search: 'ଖୋଜ', noData: 'ତଥ୍ୟ ଉପଲବ୍ଧ ନାହିଁ',
  subcentre: 'ଉପ-କେନ୍ଦ୍ର', phc: 'ପ୍ରାଥମିକ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର', ruralHospital: 'ଗ୍ରାମୀଣ ହସ୍ପିଟାଲ',
  districtHospital: 'ଜିଲ୍ଲା ହସ୍ପିଟାଲ',
});

// Assamese
export const as_lang = base({
  appName: 'কেয়াৰকানেক্ট হাস্পতাল', portalTitle: 'হাস্পতাল ব্যৱস্থাপনা পৰ্টাল',
  portalSubtitle: 'স্বাস্থ্যসেৱা পেছাদাৰীসকলৰ বাবে সুৰক্ষিত প্ৰৱেশ',
  login: 'লগইন', logout: 'লগআউট', roleAdmin: 'হাস্পতাল প্ৰশাসক', roleDoctor: 'চিকিৎসক',
  roleNurse: 'নাৰ্ছ', goodMorning: 'শুভ প্ৰভাত', goodAfternoon: 'শুভ অপৰাহ্ন', goodEvening: 'শুভ সন্ধিয়া',
  welcomeTo: 'কেয়াৰকানেক্ট হাস্পতাললৈ স্বাগতম',
  dashboard: 'ডেছবৰ্ড', patients: 'ৰোগী', doctors: 'চিকিৎসক আৰু কৰ্মী',
  language: 'ভাষা', search: 'সন্ধান', noData: 'কোনো তথ্য নাই',
  subcentre: 'উপ-কেন্দ্ৰ', phc: 'প্ৰাথমিক স্বাস্থ্য কেন্দ্ৰ', ruralHospital: 'গ্ৰামীণ হাস্পতাল',
  districtHospital: 'জিলা হাস্পতাল',
});

// Sanskrit
export const sa = base({
  appName: 'केयरकनेक्ट चिकित्सालय', portalTitle: 'चिकित्सालय प्रबन्धन पोर्टल',
  portalSubtitle: 'स्वास्थ्य विशेषज्ञेभ्यः सुरक्षितः प्रवेशः',
  login: 'प्रवेशः', logout: 'प्रस्थानम्', roleAdmin: 'प्रशासकः', roleDoctor: 'वैद्यः',
  roleNurse: 'परिचारिका', goodMorning: 'शुभप्रभातम्', goodAfternoon: 'शुभमध्याह्नम्', goodEvening: 'शुभसायाह्नम्',
  welcomeTo: 'केयरकनेक्ट चिकित्सालये स्वागतम्',
  dashboard: 'मुख्यपृष्ठम्', patients: 'रोगिणः', doctors: 'वैद्याः',
  language: 'भाषा', search: 'अन्वेषणम्', noData: 'आँकडा नास्ति',
  subcentre: 'उपकेन्द्रम्', phc: 'प्राथमिक स्वास्थ्य केन्द्रम्', ruralHospital: 'ग्रामीण चिकित्सालय',
  districtHospital: 'जनपद चिकित्सालय',
});

// Konkani
export const kok = base({
  appName: 'केअरकनेक्ट हॉस्पिटल', portalTitle: 'हॉस्पिटल व्यवस्थापन पोर्टल',
  portalSubtitle: 'आरोग्य व्यावसायिकांसाठी सुरक्षित प्रवेश',
  login: 'लॉगिन', logout: 'लॉगआउट', roleAdmin: 'हॉस्पिटल एडमिन', roleDoctor: 'डॉक्टर',
  roleNurse: 'नर्स', goodMorning: 'सुप्रभात', goodAfternoon: 'सुप्रभात', goodEvening: 'शुभ संध्याकाळ',
  welcomeTo: 'केअरकनेक्ट हॉस्पिटलात येव्काऱ्याचे स्वागत',
  dashboard: 'डॅशबोर्ड', patients: 'रोगी', language: 'भाषा', search: 'शोध',
  subcentre: 'उप-केंद्र', phc: 'प्राथमिक आरोग्य केंद्र', ruralHospital: 'ग्रामीण हॉस्पिटल',
  districtHospital: 'जिल्हा हॉस्पिटल',
});

// Kashmiri (RTL)
export const ks = base({
  appName: 'کیئرکنیکٹ ہاسپیٹل', portalTitle: 'ہاسپیٹل مینجمنٹ پورٹل',
  portalSubtitle: 'صحت کارکنانہ پاراے محفوظ رسائی',
  login: 'لاگ ان', logout: 'لاگ آوٹ', roleAdmin: 'ہاسپیٹل ایڈمن', roleDoctor: 'ڈاکٹر',
  roleNurse: 'نرس', goodMorning: 'صبح بخیر', goodAfternoon: 'دوپیر بخیر', goodEvening: 'شام بخیر',
  welcomeTo: 'کیئرکنیکٹ ہاسپیٹل مس خوش آمدید',
  dashboard: 'ڈیش بورڈ', patients: 'مریض', language: 'زبن', search: 'تلاش',
  subcentre: 'ذیلی مرکز', phc: 'بنیادی صحت مرکز', ruralHospital: 'دیہی ہاسپیٹل',
  districtHospital: 'ضلعی ہاسپیٹل',
});

// Nepali
export const ne = base({
  appName: 'केयरकनेक्ट अस्पताल', portalTitle: 'अस्पताल व्यवस्थापन पोर्टल',
  portalSubtitle: 'स्वास्थ्य पेशेवरहरूको लागि सुरक्षित पहुँच',
  login: 'लगिन', logout: 'लगआउट', roleAdmin: 'अस्पताल प्रशासक', roleDoctor: 'डाक्टर',
  roleNurse: 'नर्स', goodMorning: 'शुभ प्रभात', goodAfternoon: 'शुभ दिउँसो', goodEvening: 'शुभ साँझ',
  welcomeTo: 'केयरकनेक्ट अस्पतालमा स्वागत छ',
  dashboard: 'ड्यासबोर्ड', patients: 'बिरामी', language: 'भाषा', search: 'खोज्नुहोस्',
  subcentre: 'उप-केन्द्र', phc: 'प्राथमिक स्वास्थ्य केन्द्र', ruralHospital: 'ग्रामीण अस्पताल',
  districtHospital: 'जिल्ला अस्पताल',
});

// Sindhi (RTL)
export const sd = base({
  appName: 'ڪيئرڪنيڪٽ اسپتال', portalTitle: 'اسپتال مئنيجمينٽ پورٽل',
  portalSubtitle: 'صحت پروفيشنلن لاءِ محفوظ رسائي',
  login: 'لاگ ان', logout: 'لاگ آئوٽ', roleAdmin: 'اسپتال ايڊمن', roleDoctor: 'ڊاڪٽر',
  roleNurse: 'نرس', goodMorning: 'صبح جو آداب', goodAfternoon: 'منجهند جو آداب', goodEvening: 'شام جو آداب',
  welcomeTo: 'ڪيئرڪنيڪٽ اسپتال ۾ ڀلي ڪري آيا',
  dashboard: 'ڊيش بورڊ', patients: 'مريض', language: 'ٻولي', search: 'ڳوليو',
  subcentre: 'ذيلي مرڪز', phc: 'بنيادي صحت مرڪز', ruralHospital: 'ڏيهاتي اسپتال',
  districtHospital: 'ضلعي اسپتال',
});

// Manipuri (Meitei)
export const mni = base({
  appName: 'কেয়ারকানেক্ট নংমাইথিং', portalTitle: 'নংমাইথিং মেনেজমেন্ট পোর্টাল',
  portalSubtitle: 'হেলথকেয়ার প্রফেসনলসিনা মায়োক্নবা',
  login: 'লগইন', logout: 'লগআউট', roleAdmin: 'নংমাইথিং এডমিন', roleDoctor: 'ডাক্তার',
  roleNurse: 'নার্স', goodMorning: 'নংথাং ওইবা', goodAfternoon: 'নুংসিক ওইবা', goodEvening: 'সানা ওইবা',
  welcomeTo: 'কেয়ারকানেক্টতা লুকচিংলবা',
  dashboard: 'ডেসবোর্ড', patients: 'মরোম পাওবসু', language: 'লোন', search: 'থাজিনবা',
  subcentre: 'সব-সেন্টার', phc: 'পিএইচসি', ruralHospital: 'রুরাল হসপিটাল', districtHospital: 'ডিস্ট্রিক্ট হসপিটাল',
});

// Bodo
export const brx = base({
  appName: 'केयरकनेक्ट हास्पिटल', portalTitle: 'हास्पिटल मेनेजमेन्ट पर्टेल',
  portalSubtitle: 'हेल्थकेयर प्रफेसनालनि थाखाय सिगान्ग एक्सेस',
  login: 'लगिन', logout: 'लगआउट', roleAdmin: 'हास्पिटल एडमिन', roleDoctor: 'डाखटर',
  roleNurse: 'नार्स', goodMorning: 'गुबुन बिसाव', goodAfternoon: 'गुबुन मोनसे', goodEvening: 'गुबुन नाथाय',
  welcomeTo: 'केयरकनेक्ट हास्पिटलाव फिदिनांगो',
  dashboard: 'डेसबर्ड', patients: 'बेरामसिनो', language: 'बिलाइ', search: 'गोदाङ',
  subcentre: 'Sub-centre', phc: 'PHC', ruralHospital: 'गाव हास्पिटाल', districtHospital: 'जिला हास्पिटाल',
});

// Dogri
export const doi = base({
  appName: 'केयरकनेक्ट हस्पताल', portalTitle: 'हस्पताल प्रबंधन पोर्टल',
  portalSubtitle: 'स्वास्थ्य पेशेवरें लई सुरक्षित पहुँच',
  login: 'लॉगिन', logout: 'लॉगआउट', roleAdmin: 'हस्पताल एडमिन', roleDoctor: 'डाकदार',
  roleNurse: 'नर्स', goodMorning: 'शुभ सुब्ह', goodAfternoon: 'शुभ दुपहर', goodEvening: 'शुभ शाम',
  welcomeTo: 'केयरकनेक्ट हस्पताल च स्वागत ऐ',
  dashboard: 'डैशबोर्ड', patients: 'मरीज़', language: 'बोली', search: 'लभो',
  subcentre: 'उप-केंद्र', phc: 'PHC', ruralHospital: 'ग्रामीण हस्पताल', districtHospital: 'जिला हस्पताल',
});

// Maithili
export const mai = base({
  appName: 'केयरकनेक्ट अस्पताल', portalTitle: 'अस्पताल प्रबन्धन पोर्टल',
  portalSubtitle: 'स्वास्थ्य पेशेवरक लेल सुरक्षित पहुँच',
  login: 'लॉगिन', logout: 'लॉगआउट', roleAdmin: 'अस्पताल प्रशासक', roleDoctor: 'डॉक्टर',
  roleNurse: 'नर्स', goodMorning: 'सुप्रभात', goodAfternoon: 'शुभ दुपहर', goodEvening: 'शुभ संध्या',
  welcomeTo: 'केयरकनेक्ट अस्पतालमे स्वागत अछि',
  dashboard: 'डैशबोर्ड', patients: 'रोगी', language: 'भाषा', search: 'खोजू',
  subcentre: 'उप-केन्द्र', phc: 'PHC', ruralHospital: 'ग्रामीण अस्पताल', districtHospital: 'जिला अस्पताल',
});

// Santali
export const sat = base({
  appName: 'CareConnect Hospital', portalTitle: 'Hospital Management Portal',
  portalSubtitle: 'ᱦᱮᱞᱛᱷᱠᱮᱭᱚᱨ ᱞᱟᱹᱜᱤᱫ ᱵᱮᱯᱟᱨ ᱟᱨᱢᱟᱣ', language: 'ᱫᱤᱥᱚᱢ',
  goodMorning: 'ᱡᱚᱦᱟᱨ', goodAfternoon: 'ᱡᱚᱦᱟᱨ', goodEvening: 'ᱡᱚᱦᱟᱨ',
  welcomeTo: 'CareConnect Hospital ᱟᱠᱟ ᱮᱞᱮᱢ',
  dashboard: 'Dashboard', patients: 'ᱟᱵᱟᱜ', doctors: 'ᱰᱟᱠᱴᱟᱨ', language: 'ᱫᱤᱥᱚᱢ',
  subcentre: 'Sub-centre', phc: 'PHC', ruralHospital: 'Rural Hospital', districtHospital: 'District Hospital',
});
