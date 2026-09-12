// ============================================================
// CareBridge HMS — Government District Hospital Salem Mock Data
// ============================================================

export const HOSPITAL_INFO = {
  id: 'GDH-SALEM-01',
  name: 'Government District Hospital — Salem',
  tagline: 'Smarter Hospital Management, Better Patient Care',
  portalName: 'CareBridge Hospital Portal',
  platformType: 'Secure Government Healthcare Platform',
  location: 'Salem, Tamil Nadu, India',
  type: 'District Hospital',
  todayDate: 'Today, Monday, September 7, 2026',
  fullDate: 'Monday, September 7, 2026',
  syncStatus: 'Online',
  lastSync: '2 minutes ago',
  pendingSyncRecords: 18,
  performanceScore: 86,
};

export const CAREBRIDGE_ECOSYSTEM = [
  { name: 'Patient App', icon: 'Smartphone' },
  { name: 'PHC', icon: 'Home' },
  { name: 'Hospital', icon: 'Building2' },
  { name: 'Specialist', icon: 'Stethoscope' },
  { name: 'Diagnostic Centre', icon: 'FlaskConical' },
  { name: 'Pharmacy', icon: 'Pill' },
  { name: 'Referral', icon: 'ArrowLeftRight' },
  { name: 'Government Monitoring', icon: 'ShieldCheck' }
];

export const DEPARTMENTS = [
  { id: 'D01', name: 'General Medicine', head: 'Dr. Priya Sharma', doctors: 8, patients: 384, waiting: 42, beds: 60, pendingLab: 18, workload: 88, color: '#0EA5E9' },
  { id: 'D02', name: 'Pediatrics',       head: 'Dr. Kavitha Menon',doctors: 5, patients: 142, waiting: 18, beds: 35, pendingLab: 8,  workload: 72, color: '#EC4899' },
  { id: 'D03', name: 'Cardiology',       head: 'Dr. Suresh Iyer',  doctors: 4, patients: 96,  waiting: 14, beds: 24, pendingLab: 14, workload: 91, color: '#EF4444' },
  { id: 'D04', name: 'Orthopedics',      head: 'Dr. Mohan Das',    doctors: 4, patients: 88,  waiting: 12, beds: 30, pendingLab: 9,  workload: 68, color: '#F59E0B' },
  { id: 'D05', name: 'Gynecology',       head: 'Dr. Sunita Rao',   doctors: 5, patients: 110, waiting: 16, beds: 32, pendingLab: 11, workload: 76, color: '#F97316' },
  { id: 'D06', name: 'Dermatology',      head: 'Dr. Lakshmi Patel',doctors: 2, patients: 54,  waiting: 8,  beds: 10, pendingLab: 3,  workload: 55, color: '#10B981' },
  { id: 'D07', name: 'ENT',              head: 'Dr. Meenakshi Sundaram', doctors: 3, patients: 62, waiting: 9, beds: 12, pendingLab: 4, workload: 59, color: '#06B6D4' },
  { id: 'D08', name: 'Ophthalmology',    head: 'Dr. Arvind Swaminathan', doctors: 3, patients: 74, waiting: 11, beds: 15, pendingLab: 5, workload: 62, color: '#8B5CF6' },
  { id: 'D09', name: 'Emergency',        head: 'Dr. Vijay Kumar',  doctors: 6, patients: 96,  waiting: 6,  beds: 25, pendingLab: 22, workload: 95, color: '#DC2626' },
  { id: 'D10', name: 'Surgery',          head: 'Dr. Arun Raj',     doctors: 5, patients: 82,  waiting: 7,  beds: 40, pendingLab: 12, workload: 82, color: '#7C3AED' },
  { id: 'D11', name: 'Radiology',        head: 'Dr. Deepa Nair',   doctors: 3, patients: 94,  waiting: 28, beds: 0,  pendingLab: 28, workload: 94, color: '#6366F1' },
  { id: 'D12', name: 'Laboratory',       head: 'Mr. Ravi Shankar', doctors: 4, patients: 148, waiting: 24, beds: 0,  pendingLab: 42, workload: 89, color: '#14B8A6' },
  { id: 'D13', name: 'Pharmacy',         head: 'Mr. Kumar Pillai', doctors: 4, patients: 210, waiting: 19, beds: 0,  pendingLab: 0,  workload: 84, color: '#059669' },
];

export const DOCTORS = [
  { id: 'DOC001', name: 'Dr. Priya Sharma',   department: 'General Medicine', specialization: 'General Physician',      available: true,  patients: 1248, qualification: 'MBBS, MD',  phone: '+91 98765 11001', status: 'online',  rating: 4.8, experience: '12 yrs', timings: 'Mon–Sat 9AM–4PM', fee: '₹400',  languages: ['Tamil', 'English', 'Hindi'] },
  { id: 'DOC002', name: 'Dr. Arun Raj',       department: 'Surgery',          specialization: 'General Surgery',        available: true,  patients: 980,  qualification: 'MBBS, MS',  phone: '+91 98765 11002', status: 'online',  rating: 4.6, experience: '9 yrs',  timings: 'Mon–Fri 8AM–3PM', fee: '₹600',  languages: ['Tamil', 'English'] },
  { id: 'DOC003', name: 'Dr. Kavitha Menon',  department: 'Pediatrics',       specialization: 'Pediatrician',           available: true,  patients: 1520, qualification: 'MBBS, MD',  phone: '+91 98765 11003', status: 'busy',    rating: 4.9, experience: '15 yrs', timings: 'Mon–Sat 10AM–5PM',fee: '₹350',  languages: ['Tamil', 'Malayalam', 'English'] },
  { id: 'DOC004', name: 'Dr. Suresh Iyer',    department: 'Cardiology',       specialization: 'Cardiologist',           available: false, patients: 860,  qualification: 'MBBS, DM',  phone: '+91 98765 11004', status: 'offline', rating: 4.7, experience: '18 yrs', timings: 'Tue–Sat 9AM–2PM', fee: '₹800',  languages: ['Tamil', 'English'] },
  { id: 'DOC005', name: 'Dr. Mohan Das',      department: 'Orthopedics',      specialization: 'Orthopaedic Surgeon',    available: true,  patients: 720,  qualification: 'MBBS, MS',  phone: '+91 98765 11005', status: 'online',  rating: 4.5, experience: '11 yrs', timings: 'Mon–Fri 9AM–4PM', fee: '₹700',  languages: ['Tamil', 'Hindi'] },
  { id: 'DOC006', name: 'Dr. Ritu Singh',     department: 'Neurology',        specialization: 'Neurologist',            available: true,  patients: 640,  qualification: 'MBBS, DM',  phone: '+91 98765 11006', status: 'online',  rating: 4.8, experience: '14 yrs', timings: 'Mon–Thu 10AM–5PM',fee: '₹900',  languages: ['Hindi', 'English'] },
  { id: 'DOC007', name: 'Dr. Sunita Rao',     department: 'Gynecology',       specialization: 'Gynaecologist',          available: true,  patients: 1100, qualification: 'MBBS, MD',  phone: '+91 98765 11007', status: 'online',  rating: 4.9, experience: '16 yrs', timings: 'Mon–Sat 8AM–3PM', fee: '₹500',  languages: ['Tamil', 'Telugu', 'English'] },
  { id: 'DOC008', name: 'Dr. Vijay Kumar',    department: 'Emergency',        specialization: 'General Physician',      available: true,  patients: 1380, qualification: 'MBBS, DNB', phone: '+91 98765 11008', status: 'busy',    rating: 4.6, experience: '8 yrs',  timings: '24/7 Emergency',  fee: '₹300',  languages: ['Tamil', 'English'] },
  { id: 'DOC009', name: 'Dr. Lakshmi Patel',  department: 'General Medicine', specialization: 'Dermatologist',          available: false, patients: 890,  qualification: 'MBBS, MD',  phone: '+91 98765 11009', status: 'offline', rating: 4.4, experience: '10 yrs', timings: 'Wed–Sun 9AM–3PM', fee: '₹450',  languages: ['Tamil', 'English'] },
  { id: 'DOC010', name: 'Dr. Ramesh Nair',    department: 'Surgery',          specialization: 'Orthopaedic Surgeon',    available: true,  patients: 760,  qualification: 'MBBS, MS',  phone: '+91 98765 11010', status: 'online',  rating: 4.7, experience: '13 yrs', timings: 'Mon–Fri 8AM–4PM', fee: '₹650',  languages: ['Tamil', 'Malayalam'] },
];


export const NURSES = [
  { id: 'NRS001', name: 'Anitha Ravi',       ward: 'General Ward',  shift: 'Morning', patients: 6, status: 'On Duty' },
  { id: 'NRS002', name: 'Suma Krishnan',     ward: 'ICU',           shift: 'Morning', patients: 3, status: 'On Duty' },
  { id: 'NRS003', name: 'Preethi Nair',      ward: 'Pediatric',     shift: 'Morning', patients: 5, status: 'On Duty' },
  { id: 'NRS004', name: 'Deepa Thomas',      ward: 'Emergency',     shift: 'Night',   patients: 4, status: 'On Duty' },
  { id: 'NRS005', name: 'Rani Pillai',       ward: 'General Ward',  shift: 'Evening', patients: 5, status: 'On Leave' },
  { id: 'NRS006', name: 'Kavya Menon',       ward: 'Surgery',       shift: 'Morning', patients: 4, status: 'On Duty' },
  { id: 'NRS007', name: 'Sindhu Raj',        ward: 'ICU',           shift: 'Evening', patients: 3, status: 'On Duty' },
  { id: 'NRS008', name: 'Bindu Sharma',      ward: 'Cardiology',    shift: 'Morning', patients: 4, status: 'On Duty' },
  { id: 'NRS009', name: 'Meera Kumar',       ward: 'Gynecology',    shift: 'Evening', patients: 6, status: 'On Duty' },
  { id: 'NRS010', name: 'Lalitha Devi',      ward: 'General Ward',  shift: 'Night',   patients: 5, status: 'On Duty' },
  { id: 'NRS011', name: 'Saritha Nair',      ward: 'Pediatric',     shift: 'Morning', patients: 4, status: 'On Duty' },
  { id: 'NRS012', name: 'Jyothi Rao',        ward: 'Neurology',     shift: 'Evening', patients: 3, status: 'On Duty' },
  { id: 'NRS013', name: 'Pushpa Krishnan',   ward: 'Orthopedics',   shift: 'Morning', patients: 5, status: 'On Leave' },
  { id: 'NRS014', name: 'Seetha Pillai',     ward: 'General Ward',  shift: 'Night',   patients: 6, status: 'On Duty' },
  { id: 'NRS015', name: 'Vanitha Iyer',      ward: 'Surgery',       shift: 'Morning', patients: 4, status: 'On Duty' },
];

export const PATIENTS = [
  { id: 'P1001', opId: 'OP2026001', abhaId: 'ABHA10001', maskedAbha: 'ABHA****0001', name: 'Arun Kumar', age: 42, gender: 'Male', blood: 'B+', dept: 'General Medicine', doctor: 'Dr. Kumar', nurse: 'NRS001', status: 'Admitted', phone: '+91 98450 10001', condition: 'Stable', diagnosis: 'Type 2 Diabetes & Hypertension', ward: 'General Ward', bed: 'B-04', regDate: '2026-09-01', abhaVerified: true },
  { id: 'PAT001', name: 'Ravi Kumar',        age: 45, gender: 'Male',   blood: 'O+',  dept: 'General Medicine', doctor: 'DOC001', nurse: 'NRS001', status: 'Admitted',   phone: '+91 94567 10001', condition: 'Stable',   diagnosis: 'Hypertension', ward: 'General Ward', bed: 'B-12' },
  { id: 'PAT002', name: 'Meena Devi',        age: 32, gender: 'Female', blood: 'B+',  dept: 'Gynecology',       doctor: 'DOC007', nurse: 'NRS009', status: 'Admitted',   phone: '+91 94567 10002', condition: 'Stable',   diagnosis: 'Ante-natal Care', ward: 'Gynecology', bed: 'G-03' },
  { id: 'PAT003', name: 'Arun Prakash',      age: 28, gender: 'Male',   blood: 'A+',  dept: 'Surgery',          doctor: 'DOC002', nurse: 'NRS006', status: 'Admitted',   phone: '+91 94567 10003', condition: 'Post-Op',  diagnosis: 'Appendicitis', ward: 'Surgery Ward', bed: 'S-05' },
  { id: 'PAT004', name: 'Kavitha Raj',       age: 55, gender: 'Female', blood: 'AB+', dept: 'Cardiology',       doctor: 'DOC004', nurse: 'NRS008', status: 'Critical',   phone: '+91 94567 10004', condition: 'Critical', diagnosis: 'Acute MI', ward: 'ICU', bed: 'ICU-02' },
  { id: 'PAT005', name: 'Suresh Kumar',      age: 67, gender: 'Male',   blood: 'O-',  dept: 'Neurology',        doctor: 'DOC006', nurse: 'NRS012', status: 'Admitted',   phone: '+91 94567 10005', condition: 'Stable',   diagnosis: 'Stroke', ward: 'Neurology', bed: 'N-08' },
  { id: 'PAT006', name: 'Lakshmi Bai',       age: 41, gender: 'Female', blood: 'B-',  dept: 'General Medicine', doctor: 'DOC001', nurse: 'NRS001', status: 'OPD',        phone: '+91 94567 10006', condition: 'Stable',   diagnosis: 'Diabetes', ward: 'OPD', bed: '-' },
  { id: 'PAT007', name: 'Mohan Singh',       age: 38, gender: 'Male',   blood: 'A-',  dept: 'Orthopedics',      doctor: 'DOC005', nurse: 'NRS013', status: 'Admitted',   phone: '+91 94567 10007', condition: 'Stable',   diagnosis: 'Fracture Tibia', ward: 'Orthopedic', bed: 'O-11' },
  { id: 'PAT008', name: 'Priya Nair',        age: 24, gender: 'Female', blood: 'O+',  dept: 'Pediatrics',       doctor: 'DOC003', nurse: 'NRS003', status: 'Admitted',   phone: '+91 94567 10008', condition: 'Improving','diagnosis': 'Typhoid', ward: 'Pediatric', bed: 'P-06' },
  { id: 'PAT009', name: 'Ramesh Pillai',     age: 52, gender: 'Male',   blood: 'B+',  dept: 'General Medicine', doctor: 'DOC009', nurse: 'NRS014', status: 'OPD',        phone: '+91 94567 10009', condition: 'Stable',   diagnosis: 'Hypertension', ward: 'OPD', bed: '-' },
  { id: 'PAT010', name: 'Saritha Menon',     age: 35, gender: 'Female', blood: 'A+',  dept: 'Surgery',          doctor: 'DOC010', nurse: 'NRS015', status: 'Admitted',   phone: '+91 94567 10010', condition: 'Pre-Op',   diagnosis: 'Cholecystitis', ward: 'Surgery', bed: 'S-09' },
  { id: 'PAT011', name: 'Vijay Raj',         age: 48, gender: 'Male',   blood: 'AB-', dept: 'Emergency',        doctor: 'DOC008', nurse: 'NRS004', status: 'Emergency',  phone: '+91 94567 10011', condition: 'Critical', diagnosis: 'RTA Polytrauma', ward: 'Emergency', bed: 'E-01' },
  { id: 'PAT012', name: 'Anitha Krishnan',   age: 29, gender: 'Female', blood: 'O+',  dept: 'Gynecology',       doctor: 'DOC007', nurse: 'NRS009', status: 'OPD',        phone: '+91 94567 10012', condition: 'Stable',   diagnosis: 'PCOS', ward: 'OPD', bed: '-' },
  { id: 'PAT013', name: 'Deepak Sharma',     age: 61, gender: 'Male',   blood: 'B+',  dept: 'Cardiology',       doctor: 'DOC004', nurse: 'NRS008', status: 'Admitted',   phone: '+91 94567 10013', condition: 'Stable',   diagnosis: 'Angina', ward: 'Cardiology', bed: 'C-07' },
  { id: 'PAT014', name: 'Sindhu Iyer',       age: 22, gender: 'Female', blood: 'A+',  dept: 'General Medicine', doctor: 'DOC001', nurse: 'NRS001', status: 'Admitted',   phone: '+91 94567 10014', condition: 'Improving','diagnosis': 'Dengue', ward: 'General', bed: 'G-15' },
  { id: 'PAT015', name: 'Bala Subramanian',  age: 70, gender: 'Male',   blood: 'O+',  dept: 'Neurology',        doctor: 'DOC006', nurse: 'NRS012', status: 'Critical',   phone: '+91 94567 10015', condition: 'Critical', diagnosis: 'ICH', ward: 'ICU', bed: 'ICU-05' },
  { id: 'PAT016', name: 'Kamala Devi',       age: 44, gender: 'Female', blood: 'B+',  dept: 'Orthopedics',      doctor: 'DOC005', nurse: 'NRS013', status: 'Discharged', phone: '+91 94567 10016', condition: 'Recovered','diagnosis': 'Hip Fracture', ward: '-', bed: '-' },
  { id: 'PAT017', name: 'Prakash Nair',      age: 36, gender: 'Male',   blood: 'O+',  dept: 'Surgery',          doctor: 'DOC002', nurse: 'NRS006', status: 'Admitted',   phone: '+91 94567 10017', condition: 'Post-Op',  diagnosis: 'Hernia Repair', ward: 'Surgery', bed: 'S-12' },
  { id: 'PAT018', name: 'Usha Pillai',       age: 58, gender: 'Female', blood: 'A-',  dept: 'General Medicine', doctor: 'DOC009', nurse: 'NRS014', status: 'OPD',        phone: '+91 94567 10018', condition: 'Stable',   diagnosis: 'Thyroid Disorder', ward: 'OPD', bed: '-' },
  { id: 'PAT019', name: 'Arjun Menon',       age: 16, gender: 'Male',   blood: 'B+',  dept: 'Pediatrics',       doctor: 'DOC003', nurse: 'NRS003', status: 'Admitted',   phone: '+91 94567 10019', condition: 'Improving','diagnosis': 'Asthma', ward: 'Pediatric', bed: 'P-02' },
  { id: 'PAT020', name: 'Nalini Sharma',     age: 39, gender: 'Female', blood: 'AB+', dept: 'Gynecology',       doctor: 'DOC007', nurse: 'NRS009', status: 'Admitted',   phone: '+91 94567 10020', condition: 'Stable',   diagnosis: 'Fibroid', ward: 'Gynecology', bed: 'G-08' },
  { id: 'PAT021', name: 'Shankar Rajan',     age: 53, gender: 'Male',   blood: 'O+',  dept: 'Emergency',        doctor: 'DOC008', nurse: 'NRS004', status: 'Emergency',  phone: '+91 94567 10021', condition: 'High',     diagnosis: 'Chest Pain', ward: 'Emergency', bed: 'E-03' },
  { id: 'PAT022', name: 'Geeta Krishnan',    age: 26, gender: 'Female', blood: 'A+',  dept: 'General Medicine', doctor: 'DOC001', nurse: 'NRS001', status: 'OPD',        phone: '+91 94567 10022', condition: 'Stable',   diagnosis: 'Anemia', ward: 'OPD', bed: '-' },
  { id: 'PAT023', name: 'Mani Kumar',        age: 64, gender: 'Male',   blood: 'B-',  dept: 'Cardiology',       doctor: 'DOC004', nurse: 'NRS008', status: 'Admitted',   phone: '+91 94567 10023', condition: 'Improving','diagnosis': 'Heart Failure', ward: 'Cardiology', bed: 'C-10' },
  { id: 'PAT024', name: 'Radha Nair',        age: 49, gender: 'Female', blood: 'O-',  dept: 'Neurology',        doctor: 'DOC006', nurse: 'NRS012', status: 'OPD',        phone: '+91 94567 10024', condition: 'Stable',   diagnosis: 'Migraine', ward: 'OPD', bed: '-' },
  { id: 'PAT025', name: 'Karthik Raj',       age: 31, gender: 'Male',   blood: 'A+',  dept: 'Surgery',          doctor: 'DOC010', nurse: 'NRS015', status: 'Admitted',   phone: '+91 94567 10025', condition: 'Post-Op',  diagnosis: 'ACL Repair', ward: 'Orthopedic', bed: 'O-03' },
  { id: 'PAT026', name: 'Indira Gandhi',     age: 72, gender: 'Female', blood: 'O+',  dept: 'General Medicine', doctor: 'DOC009', nurse: 'NRS014', status: 'Admitted',   phone: '+91 94567 10026', condition: 'Stable',   diagnosis: 'COPD', ward: 'General', bed: 'G-22' },
  { id: 'PAT027', name: 'Sunil Mathew',      age: 42, gender: 'Male',   blood: 'AB+', dept: 'Emergency',        doctor: 'DOC008', nurse: 'NRS004', status: 'Discharged', phone: '+91 94567 10027', condition: 'Recovered','diagnosis': 'Laceration', ward: '-', bed: '-' },
  { id: 'PAT028', name: 'Vijayalakshmi',     age: 57, gender: 'Female', blood: 'B+',  dept: 'Gynecology',       doctor: 'DOC007', nurse: 'NRS009', status: 'Admitted',   phone: '+91 94567 10028', condition: 'Stable',   diagnosis: 'Menopause Management', ward: 'Gynecology', bed: 'G-11' },
  { id: 'PAT029', name: 'Ganesh Kumar',      age: 8,  gender: 'Male',   blood: 'A+',  dept: 'Pediatrics',       doctor: 'DOC003', nurse: 'NRS011', status: 'Admitted',   phone: '+91 94567 10029', condition: 'Improving','diagnosis': 'Pneumonia', ward: 'Pediatric', bed: 'P-09' },
  { id: 'PAT030', name: 'Padma Iyer',        age: 33, gender: 'Female', blood: 'O+',  dept: 'Surgery',          doctor: 'DOC002', nurse: 'NRS006', status: 'OPD',        phone: '+91 94567 10030', condition: 'Stable',   diagnosis: 'Gallstones', ward: 'OPD', bed: '-' },
].map((p, i) => {
  const isArun = p.id === 'P1001';
  const isRavi = p.name === 'Ravi Kumar';
  const opId = isArun ? 'OP2026001' : (p.opId || `OP2026${String(i + 1).padStart(3, '0')}`);
  return {
    ...p,
    opId,
    patientId: p.id,
    age: isRavi ? 46 : p.age,
    gender: isRavi ? 'Male' : p.gender,
    blood: isRavi ? 'B+' : p.blood,
    allergies: isRavi ? ['Penicillin'] : (i % 4 === 0 ? ['Penicillin', 'Sulfa drugs'] : i % 7 === 0 ? ['Aspirin'] : ['No known drug allergies (NKDA)']),
    abhaId: isArun ? 'ABHA10001' : (p.abhaId || `ABHA${10000 + i + 1}`),
    maskedAbha: isArun ? 'ABHA****0001' : `ABHA****${String(10000 + i + 1).slice(-4)}`,
    regDate: p.regDate || (isRavi ? '2024-03-12' : `2026-09-0${(i % 7) + 1}`),
    visitDate: '2026-09-07',
    dob: isRavi ? '1980-05-14' : `19${60 + (i % 35)}-0${(i % 9) + 1}-15`,
    address: isRavi ? '14/2 Anna Nagar, Salem, Tamil Nadu - 636001' : `${10 + i * 3}, Gandhi Road, Salem, Tamil Nadu`,
    maskedPhone: p.phone.replace(/(\+91\s\d{2})\d{3}(\s\d{2})\d{3}/, '$1***$2***') || '+91 94567 ****1',
    chronicConditions: isRavi ? ['Essential Hypertension', 'Type 2 Diabetes Mellitus'] : (i % 3 === 0 ? ['Hypertension'] : i % 5 === 0 ? ['Type 2 Diabetes'] : ['None documented']),
    previousAdmissions: isRavi ? ['June 2025: Unstable Angina (ICU, 3 days)'] : ['None in past 12 months'],
    previousProcedures: isRavi ? ['March 2024: Diagnostic Coronary Angiogram'] : ['None'],
    medicalNotes: isRavi ? 'Patient on regular antihypertensive therapy. Reports occasional headache after exertion. Advised salt restriction and regular BP charting.' : 'Regular health monitoring.',
    abhaVerified: true,
    visitsCount: (i % 6) + 1,
  };
});

export const APPOINTMENTS = [
  { id: 'APT001', patient: 'Ravi Kumar',      patientId: 'PAT001', doctor: 'Dr. Priya Sharma',  doctorId: 'DOC001', dept: 'General Medicine', date: '2026-09-05', time: '09:00', type: 'Follow-up',   status: 'Checked-in',     token: 'T-01' },
  { id: 'APT002', patient: 'Meena Devi',      patientId: 'PAT002', doctor: 'Dr. Sunita Rao',    doctorId: 'DOC007', dept: 'Gynecology',       date: '2026-09-05', time: '09:30', type: 'Consultation', status: 'Waiting',        token: 'T-02' },
  { id: 'APT003', patient: 'Suresh Kumar',    patientId: 'PAT005', doctor: 'Dr. Ritu Singh',     doctorId: 'DOC006', dept: 'Neurology',        date: '2026-09-05', time: '10:00', type: 'Review',       status: 'Scheduled',      token: 'T-03' },
  { id: 'APT004', patient: 'Lakshmi Bai',     patientId: 'PAT006', doctor: 'Dr. Priya Sharma',  doctorId: 'DOC001', dept: 'General Medicine', date: '2026-09-05', time: '10:30', type: 'Follow-up',   status: 'Waiting',        token: 'T-04' },
  { id: 'APT005', patient: 'Deepak Sharma',   patientId: 'PAT013', doctor: 'Dr. Suresh Iyer',   doctorId: 'DOC004', dept: 'Cardiology',       date: '2026-09-05', time: '11:00', type: 'Review',       status: 'In Consultation',token: 'T-05' },
  { id: 'APT006', patient: 'Radha Nair',      patientId: 'PAT024', doctor: 'Dr. Ritu Singh',     doctorId: 'DOC006', dept: 'Neurology',        date: '2026-09-05', time: '11:30', type: 'New Patient',  status: 'Scheduled',      token: 'T-06' },
  { id: 'APT007', patient: 'Arjun Menon',     patientId: 'PAT019', doctor: 'Dr. Kavitha Menon', doctorId: 'DOC003', dept: 'Pediatrics',       date: '2026-09-05', time: '12:00', type: 'Follow-up',   status: 'Scheduled',      token: 'T-07' },
  { id: 'APT008', patient: 'Usha Pillai',     patientId: 'PAT018', doctor: 'Dr. Lakshmi Patel', doctorId: 'DOC009', dept: 'General Medicine', date: '2026-09-05', time: '14:00', type: 'Review',       status: 'Scheduled',      token: 'T-08' },
  { id: 'APT009', patient: 'Anitha Krishnan', patientId: 'PAT012', doctor: 'Dr. Sunita Rao',    doctorId: 'DOC007', dept: 'Gynecology',       date: '2026-09-05', time: '14:30', type: 'Follow-up',   status: 'Cancelled',      token: 'T-09' },
  { id: 'APT010', patient: 'Geeta Krishnan',  patientId: 'PAT022', doctor: 'Dr. Priya Sharma',  doctorId: 'DOC001', dept: 'General Medicine', date: '2026-09-05', time: '15:00', type: 'Consultation', status: 'Scheduled',      token: 'T-10' },
];

export const LAB_ORDERS = [
  { id: 'LAB001', patient: 'Kavitha Raj',    patientId: 'PAT004', doctor: 'Dr. Suresh Iyer',   test: 'Complete Blood Count', priority: 'Urgent', status: 'In Progress', ordered: '2026-09-05 08:00', result: null },
  { id: 'LAB002', patient: 'Ravi Kumar',     patientId: 'PAT001', doctor: 'Dr. Priya Sharma',  test: 'Lipid Profile',        priority: 'Routine', status: 'Completed',  ordered: '2026-09-04 10:00', result: 'Normal' },
  { id: 'LAB003', patient: 'Suresh Kumar',   patientId: 'PAT005', doctor: 'Dr. Ritu Singh',    test: 'MRI Brain',            priority: 'Urgent',  status: 'Pending',    ordered: '2026-09-05 09:00', result: null },
  { id: 'LAB004', patient: 'Bala Subramanian', patientId: 'PAT015', doctor: 'Dr. Ritu Singh',  test: 'CT Scan Head',         priority: 'STAT',    status: 'In Progress', ordered: '2026-09-05 08:30', result: null },
  { id: 'LAB005', patient: 'Deepak Sharma',  patientId: 'PAT013', doctor: 'Dr. Suresh Iyer',   test: 'ECG + Echo',           priority: 'Urgent',  status: 'Completed',  ordered: '2026-09-04 14:00', result: 'Abnormal' },
  { id: 'LAB006', patient: 'Arjun Menon',    patientId: 'PAT019', doctor: 'Dr. Kavitha Menon', test: 'Chest X-ray',          priority: 'Routine', status: 'Pending',    ordered: '2026-09-05 10:00', result: null },
  { id: 'LAB007', patient: 'Vijay Raj',      patientId: 'PAT011', doctor: 'Dr. Vijay Kumar',   test: 'FAST Ultrasound',      priority: 'STAT',    status: 'In Progress', ordered: '2026-09-05 07:30', result: null },
  { id: 'LAB008', patient: 'Shankar Rajan',  patientId: 'PAT021', doctor: 'Dr. Vijay Kumar',   test: 'Troponin I',           priority: 'STAT',    status: 'Completed',  ordered: '2026-09-05 06:00', result: 'CRITICAL' },
  { id: 'LAB009', patient: 'Mani Kumar',     patientId: 'PAT023', doctor: 'Dr. Suresh Iyer',   test: 'BNP, ABG',             priority: 'Urgent',  status: 'Pending',    ordered: '2026-09-05 11:00', result: null },
  { id: 'LAB010', patient: 'Radha Nair',     patientId: 'PAT024', doctor: 'Dr. Ritu Singh',    test: 'EEG',                  priority: 'Routine', status: 'Completed',  ordered: '2026-09-04 15:00', result: 'Normal' },
];

export const PRESCRIPTIONS = [
  { id: 'RX001', patient: 'Ravi Kumar',    patientId: 'PAT001', doctor: 'Dr. Priya Sharma',  date: '2026-09-05', medicines: ['Amlodipine 5mg', 'Telma 40mg'], status: 'Pending',   instructions: 'Take after food' },
  { id: 'RX002', patient: 'Suresh Kumar',  patientId: 'PAT005', doctor: 'Dr. Ritu Singh',    date: '2026-09-05', medicines: ['Ecosprin 75mg', 'Atorvastatin 40mg'], status: 'Dispensed', instructions: 'Morning empty stomach' },
  { id: 'RX003', patient: 'Kavitha Raj',   patientId: 'PAT004', doctor: 'Dr. Suresh Iyer',   date: '2026-09-05', medicines: ['Metoprolol 25mg', 'Furosemide 40mg', 'Spironolactone 25mg'], status: 'Pending', instructions: 'Twice daily' },
  { id: 'RX004', patient: 'Meena Devi',    patientId: 'PAT002', doctor: 'Dr. Sunita Rao',    date: '2026-09-05', medicines: ['Folic Acid 5mg', 'Ferrous Sulfate 200mg', 'Calcium 500mg'], status: 'Dispensed', instructions: 'After meals' },
  { id: 'RX005', patient: 'Arun Prakash',  patientId: 'PAT003', doctor: 'Dr. Arun Raj',      date: '2026-09-05', medicines: ['Amoxicillin 500mg', 'Metronidazole 400mg', 'Pantoprazole 40mg'], status: 'Pending', instructions: 'With food 3x daily' },
  { id: 'RX006', patient: 'Deepak Sharma', patientId: 'PAT013', doctor: 'Dr. Suresh Iyer',   date: '2026-09-04', medicines: ['Isosorbide 20mg', 'Aspirin 75mg'], status: 'Dispensed', instructions: 'SL for chest pain' },
  { id: 'RX007', patient: 'Mohan Singh',   patientId: 'PAT007', doctor: 'Dr. Mohan Das',     date: '2026-09-05', medicines: ['Diclofenac 50mg', 'Pantoprazole 40mg', 'Calcium+D3'], status: 'Pending', instructions: 'After food' },
  { id: 'RX008', patient: 'Bala Subramanian', patientId: 'PAT015', doctor: 'Dr. Ritu Singh', date: '2026-09-05', medicines: ['Mannitol 20% IV', 'Dexamethasone 8mg IV'], status: 'Dispensed', instructions: 'IV drip' },
];

export const MEDICINES = [
  { id: 'MED001', name: 'Amlodipine 5mg', genericName: 'Amlodipine Besylate', description: 'Long-acting calcium channel blocker for hypertension and coronary artery disease', category: 'Cardiovascular', strength: '5 mg', form: 'Tablet', available: 450, stock: 450, unit: 'Tablets', batchNo: 'TN-2026-B101', expiry: '2027-06-30', stockStatus: 'In Stock', status: 'Available', dosage: '1 tablet', frequency: 'Once daily (Morning)', duration: '30 days', route: 'Oral', instructions: 'Take with or without food. Monitor blood pressure weekly.', contraindications: 'Severe hypotension, cardiogenic shock', prescriptionStatus: 'Formulary Approved' },
  { id: 'MED002', name: 'Metformin 500mg', genericName: 'Metformin Hydrochloride', description: 'Biguanide antidiabetic agent that decreases hepatic glucose production', category: 'Diabetes', strength: '500 mg', form: 'Tablet', available: 12, stock: 12, unit: 'Tablets', batchNo: 'TN-2026-B102', expiry: '2026-11-30', stockStatus: 'Low Stock', status: 'Low Stock', dosage: '1 tablet', frequency: 'Twice daily', duration: '30 days', route: 'Oral', instructions: 'Take with meals to reduce gastrointestinal irritation.', contraindications: 'Renal impairment (eGFR < 30 mL/min), metabolic acidosis', prescriptionStatus: 'Formulary Approved' },
  { id: 'MED003', name: 'Amoxicillin 500mg', genericName: 'Amoxicillin Trihydrate', description: 'Broad-spectrum penicillin antibiotic for bacterial infections', category: 'Antibiotic', strength: '500 mg', form: 'Capsule', available: 0, stock: 0, unit: 'Capsules', batchNo: 'TN-2026-B103', expiry: '2027-03-15', stockStatus: 'Out of Stock', status: 'Out of Stock', dosage: '1 capsule', frequency: 'Three times daily', duration: '5 days', route: 'Oral', instructions: 'Complete the entire course as prescribed.', contraindications: 'History of severe penicillin allergy / anaphylaxis', prescriptionStatus: 'Restricted Stock' },
  { id: 'MED004', name: 'Paracetamol 500mg', genericName: 'Acetaminophen', description: 'Analgesic / antipyretic for relief of mild to moderate pain and fever', category: 'Analgesic', strength: '500 mg', form: 'Tablet', available: 450, stock: 450, unit: 'tablets', batchNo: 'TN-2026-B104', expiry: '12/2027', stockStatus: 'In Stock', status: 'Available', dosage: '1 tablet', frequency: 'Twice daily', duration: '3 days', route: 'Oral', instructions: 'Take after food with plenty of water. Do not exceed 4g/day.', contraindications: 'Severe hepatic impairment or active liver disease', prescriptionStatus: 'Formulary Approved' },
  { id: 'MED005', name: 'Omeprazole 20mg', genericName: 'Omeprazole', description: 'Proton pump inhibitor that reduces gastric acid secretion', category: 'GI', strength: '20 mg', form: 'Capsule', available: 8, stock: 8, unit: 'Capsules', batchNo: 'TN-2026-B105', expiry: '2026-10-15', stockStatus: 'Low Stock', status: 'Low Stock', dosage: '1 capsule', frequency: 'Once daily (Empty stomach)', duration: '14 days', route: 'Oral', instructions: 'Swallow whole with water 30 minutes before breakfast.', contraindications: 'Hypersensitivity to substituted benzimidazoles', prescriptionStatus: 'Formulary Approved' },
  { id: 'MED006', name: 'Atorvastatin 40mg', genericName: 'Atorvastatin Calcium', description: 'HMG-CoA reductase inhibitor for dyslipidemia and cardiovascular risk reduction', category: 'Cardiovascular', strength: '40 mg', form: 'Tablet', available: 320, stock: 320, unit: 'Tablets', batchNo: 'TN-2026-B106', expiry: '2027-08-20', stockStatus: 'In Stock', status: 'Available', dosage: '1 tablet', frequency: 'Once daily at bedtime', duration: '30 days', route: 'Oral', instructions: 'Take at night. Periodic LFT monitoring recommended.', contraindications: 'Active liver disease, unexplained persistent elevation of serum transaminases', prescriptionStatus: 'Formulary Approved' },
  { id: 'MED007', name: 'Aspirin 75mg', genericName: 'Acetylsalicylic Acid', description: 'Antiplatelet agent for secondary prevention of thrombotic events', category: 'Antiplatelet', strength: '75 mg', form: 'Tablet (Enteric coated)', available: 500, stock: 500, unit: 'Tablets', batchNo: 'TN-2026-B107', expiry: '2026-10-30', stockStatus: 'Low Stock', status: 'Low Stock', dosage: '1 tablet', frequency: 'Once daily', duration: '30 days', route: 'Oral', instructions: 'Take with food. Do not crush enteric-coated tablets.', contraindications: 'Active peptic ulceration, bleeding diathesis, aspirin allergy', prescriptionStatus: 'Formulary Approved' },
  { id: 'MED008', name: 'Folic Acid 5mg', genericName: 'Folic Acid', description: 'Water-soluble B vitamin for treatment and prevention of folate deficiency', category: 'Vitamins', strength: '5 mg', form: 'Tablet', available: 200, stock: 200, unit: 'Tablets', batchNo: 'TN-2026-B108', expiry: '2027-04-30', stockStatus: 'In Stock', status: 'Available', dosage: '1 tablet', frequency: 'Once daily', duration: '30 days', route: 'Oral', instructions: 'Take with water after breakfast.', contraindications: 'Untreated cobalamin (B12) deficiency', prescriptionStatus: 'Formulary Approved' },
  { id: 'MED009', name: 'Furosemide 40mg', genericName: 'Furosemide', description: 'Loop diuretic for edema associated with heart failure and renal disease', category: 'Diuretics', strength: '40 mg', form: 'Tablet', available: 25, stock: 25, unit: 'Tablets', batchNo: 'TN-2026-B109', expiry: '2027-02-28', stockStatus: 'Low Stock', status: 'Low Stock', dosage: '1 tablet', frequency: 'Once daily (Morning)', duration: '15 days', route: 'Oral', instructions: 'Take in morning to prevent nocturia. Monitor potassium levels.', contraindications: 'Anuria, severe sodium and fluid depletion, hepatic coma', prescriptionStatus: 'Formulary Approved' },
  { id: 'MED010', name: 'Metoprolol 25mg', genericName: 'Metoprolol Succinate', description: 'Selective beta-1 blocker for hypertension, angina, and heart failure', category: 'Cardiovascular', strength: '25 mg', form: 'Tablet (Extended release)', available: 180, stock: 180, unit: 'Tablets', batchNo: 'TN-2026-B110', expiry: '2027-07-15', stockStatus: 'In Stock', status: 'Available', dosage: '1 tablet', frequency: 'Once daily', duration: '30 days', route: 'Oral', instructions: 'Take with or immediately following meals. Do not stop abruptly.', contraindications: 'Sinus bradycardia, heart block greater than first degree, cardiogenic shock', prescriptionStatus: 'Formulary Approved' },
];

export const PATIENT_CLINICAL_DATA = {
  'PAT001': {
    medicalHistory: [
      { id: 'MH001', date: '2026-08-12', diagnosis: 'Essential Hypertension – Stage 2', doctor: 'Dr. Priya Sharma', hospital: 'Government District Hospital — Salem', notes: 'BP recorded at 150/95 mmHg. Adjusted Telmisartan dose to 40mg OD. Patient reports good tolerance.', procedures: 'Standard ECG (Normal Sinus Rhythm)', admission: 'Outpatient consult' },
      { id: 'MH002', date: '2026-05-20', diagnosis: 'Type 2 Diabetes Mellitus – Routine Review', doctor: 'Dr. Priya Sharma', hospital: 'Government District Hospital — Salem', notes: 'HbA1c at 7.2%. Fasting blood sugar 138 mg/dL. Continued Metformin 500mg BD with dietary compliance counseling.', procedures: 'None', admission: 'Outpatient consult' },
      { id: 'MH003', date: '2025-11-14', diagnosis: 'Acute Bronchitis', doctor: 'Dr. Ramesh Nair', hospital: 'Taluk Hospital, Attur', notes: 'Productive cough x 5 days, no dyspnea. Treated with Azithromycin course and cough expectorant with full resolution.', procedures: 'Chest X-ray (Bilateral clear lung fields)', admission: 'Outpatient consult' },
      { id: 'MH004', date: '2025-06-03', diagnosis: 'Chest Pain Under Observation / Angina Evaluation', doctor: 'Dr. Suresh Iyer', hospital: 'Government District Hospital — Salem', notes: 'Admitted for 3 days in observation unit following retrosternal chest pressure. Troponin negative x 2. Coronary Angiography showed minor non-obstructive plaque.', procedures: 'Diagnostic Coronary Angiogram, 2D Echo (LVEF 60%)', admission: 'Inpatient (3 days)' },
    ],
    labReports: [
      { id: 'LR001', test: 'Complete Blood Count (CBC)', date: '2026-09-04', result: 'Hb: 11.2 g/dL', reference: '12.0 – 16.0 g/dL', status: 'Abnormal', isAbnormal: true, isCritical: false, lab: 'GDH Salem Central Hematology', reviewStatus: 'Reviewed by Dr. Priya Sharma', details: 'Hemoglobin: 11.2 g/dL (Low), RBC: 4.1 M/uL, WBC: 7,400 /uL, Platelets: 210,000 /uL' },
      { id: 'LR002', test: 'Fasting Lipid Profile', date: '2026-09-04', result: 'Chol: 214 mg/dL', reference: '< 200 mg/dL', status: 'Abnormal', isAbnormal: true, isCritical: false, lab: 'GDH Salem Biochemistry Lab', reviewStatus: 'Reviewed by Dr. Priya Sharma', details: 'Total Cholesterol: 214 mg/dL (Elevated), Triglycerides: 165 mg/dL, HDL: 42 mg/dL, LDL: 139 mg/dL' },
      { id: 'LR003', test: 'HbA1c (Glycated Hemoglobin)', date: '2026-08-10', result: '7.2 %', reference: '< 5.7 %', status: 'Abnormal', isAbnormal: true, isCritical: false, lab: 'GDH Salem Biochemistry Lab', reviewStatus: 'Reviewed', details: 'Estimated Average Glucose: 160 mg/dL. Moderate glycemic control.' },
      { id: 'LR004', test: 'Serum Creatinine & Urea', date: '2026-08-10', result: 'Creatinine: 0.9 mg/dL', reference: '0.7 – 1.3 mg/dL', status: 'Completed', isAbnormal: false, isCritical: false, lab: 'GDH Salem Biochemistry Lab', reviewStatus: 'Reviewed', details: 'Creatinine: 0.9 mg/dL, BUN: 14 mg/dL, eGFR: > 90 mL/min/1.73m2 (Normal renal function)' },
      { id: 'LR005', test: 'Serum Electrolytes (Na+, K+, Cl-)', date: '2026-08-10', result: 'Na: 139 | K: 4.2', reference: 'Na: 135-145 | K: 3.5-5.0', status: 'Completed', isAbnormal: false, isCritical: false, lab: 'GDH Salem Biochemistry Lab', reviewStatus: 'Reviewed', details: 'Sodium: 139 mEq/L, Potassium: 4.2 mEq/L, Chloride: 101 mEq/L (Normal)' },
    ],
    previousRecords: [
      { id: 'REC001', date: '2026-08-12', facility: 'Government District Hospital — Salem', doctor: 'Dr. Priya Sharma', dept: 'General Medicine', type: 'Outpatient Consultation Note', summary: 'Patient attended for scheduled hypertension followup. BP 150/95. Advised lifestyle changes and medication adherence.' },
      { id: 'REC002', date: '2026-05-20', facility: 'Government District Hospital — Salem', doctor: 'Dr. Priya Sharma', dept: 'General Medicine', type: 'Diabetes Review Assessment', summary: 'Glycemic control reviewed. Dietary counsel provided. No microvascular complications noted on fundoscopy.' },
      { id: 'REC003', date: '2025-06-06', facility: 'Government District Hospital — Salem', doctor: 'Dr. Suresh Iyer', dept: 'Cardiology', type: 'Hospital Discharge Summary', summary: 'Discharged in stable condition post-coronary evaluation. Placed on secondary prevention regimen with Aspirin and Statin.' },
      { id: 'REC004', date: '2025-06-04', facility: 'Government District Hospital — Salem', doctor: 'Dr. Deepa Nair', dept: 'Radiology', type: 'Coronary Angiography Report', summary: 'Right dominant circulation. Mild luminal irregularities in mid-LAD (< 25% stenosis). No flow-limiting obstruction.' },
      { id: 'REC005', date: '2024-03-12', facility: 'Primary Health Centre, Attur', doctor: 'Dr. K. Senthil', dept: 'Primary Care', type: 'Referral & Health Highway Record', summary: 'Referred to Salem District Hospital for cardiology consultation due to recurring exertional tightness.' },
    ],
    appointments: {
      today: [
        { id: 'APT-1001', patient: 'Ravi Kumar', opId: 'TN-OP-10245', patientId: 'PAT001', time: '09:00 AM', dept: 'General Medicine', type: 'Follow-up Consultation', status: 'Waiting' },
      ],
      completed: [
        { id: 'APT-0982', patient: 'Ravi Kumar', opId: 'TN-OP-10245', patientId: 'PAT001', date: '2026-08-12', consultDate: '2026-08-12', diagnosisSummary: 'Essential Hypertension – Adjusted Telmisartan', status: 'Completed' },
        { id: 'APT-0920', patient: 'Ravi Kumar', opId: 'TN-OP-10245', patientId: 'PAT001', date: '2026-05-20', consultDate: '2026-05-20', diagnosisSummary: 'Type 2 Diabetes Mellitus – Regular monitoring', status: 'Completed' },
      ],
      cancelled: [
        { id: 'APT-0850', patient: 'Ravi Kumar', opId: 'TN-OP-10245', patientId: 'PAT001', date: '2026-02-10', cancelDate: '2026-02-09', reason: 'Patient rescheduled due to travel', status: 'Cancelled' },
      ]
    }
  }
};

export function getPatientClinicalData(patient) {
  if (!patient) return null;
  if (PATIENT_CLINICAL_DATA[patient.id]) {
    return PATIENT_CLINICAL_DATA[patient.id];
  }
  // Generate high quality synthetic clinical history for any patient
  return {
    medicalHistory: [
      { id: `MH-${patient.id}-1`, date: '2026-07-15', diagnosis: `${patient.diagnosis || 'Clinical Follow-up'}`, doctor: 'Dr. Priya Sharma', hospital: 'Government District Hospital — Salem', notes: `Patient presented for routine check-up. Clinical state: ${patient.condition || 'Stable'}. Vital parameters recorded within acceptable limits.`, procedures: 'Vital Assessment, Physical Exam', admission: 'Outpatient consult' },
      { id: `MH-${patient.id}-2`, date: '2026-03-10', diagnosis: 'Annual Health Evaluation', doctor: 'Dr. Priya Sharma', hospital: 'Government District Hospital — Salem', notes: 'Routine baseline screening. Advised healthy balanced diet and physical activity.', procedures: 'Baseline ECG, Random Blood Sugar', admission: 'Outpatient consult' },
      { id: `MH-${patient.id}-3`, date: '2025-09-18', diagnosis: 'Mild Upper Respiratory Infection', doctor: 'Dr. Arun Raj', hospital: 'Taluk Hospital, Salem', notes: 'Short course symptomatic treatment prescribed with complete resolution.', procedures: 'Throat examination', admission: 'Outpatient consult' }
    ],
    labReports: [
      { id: `LR-${patient.id}-1`, test: 'Complete Blood Count (CBC)', date: '2026-09-02', result: 'Hb: 12.8 g/dL', reference: '12.0 – 16.0 g/dL', status: 'Completed', isAbnormal: false, isCritical: false, lab: 'GDH Salem Central Hematology', reviewStatus: 'Reviewed', details: 'Hemoglobin: 12.8 g/dL, WBC: 6,800 /uL, Platelets: 240,000 /uL' },
      { id: `LR-${patient.id}-2`, test: 'Blood Sugar (Fasting & Post-Prandial)', date: '2026-09-02', result: 'FBS: 104 mg/dL', reference: '70 – 100 mg/dL', status: 'Abnormal', isAbnormal: true, isCritical: false, lab: 'GDH Salem Biochemistry Lab', reviewStatus: 'Reviewed', details: 'FBS: 104 mg/dL (Mild elevation), PPBS: 138 mg/dL' },
      { id: `LR-${patient.id}-3`, test: 'Renal Function Test (RFT)', date: '2026-08-20', result: 'Creatinine: 0.8 mg/dL', reference: '0.6 – 1.2 mg/dL', status: 'Completed', isAbnormal: false, isCritical: false, lab: 'GDH Salem Biochemistry Lab', reviewStatus: 'Reviewed', details: 'Urea: 22 mg/dL, Creatinine: 0.8 mg/dL, Uric Acid: 4.8 mg/dL' }
    ],
    previousRecords: [
      { id: `REC-${patient.id}-1`, date: '2026-07-15', facility: 'Government District Hospital — Salem', doctor: 'Dr. Priya Sharma', dept: patient.dept || 'General Medicine', type: 'Clinical Consultation Summary', summary: `Review for ${patient.diagnosis}. Treatment ongoing with satisfactory symptom control.` },
      { id: `REC-${patient.id}-2`, date: '2026-03-10', facility: 'Government District Hospital — Salem', doctor: 'Dr. Priya Sharma', dept: patient.dept || 'General Medicine', type: 'Annual Preventive Assessment', summary: 'General health check completed. Routine lab investigations advised.' }
    ],
    appointments: {
      today: [
        { id: `APT-${patient.id}-01`, patient: patient.name, opId: patient.opId, patientId: patient.patientId || patient.id, time: '10:30 AM', dept: patient.dept || 'General Medicine', type: 'Regular Follow-up', status: 'Scheduled' }
      ],
      completed: [
        { id: `APT-${patient.id}-comp`, patient: patient.name, opId: patient.opId, patientId: patient.patientId || patient.id, date: '2026-07-15', consultDate: '2026-07-15', diagnosisSummary: `${patient.diagnosis} – Stable`, status: 'Completed' }
      ],
      cancelled: [
        { id: `APT-${patient.id}-canc`, patient: patient.name, opId: patient.opId, patientId: patient.patientId || patient.id, date: '2026-04-12', cancelDate: '2026-04-11', reason: 'Patient requested rescheduling', status: 'Cancelled' }
      ]
    }
  };
}

export const DOCTOR_APPOINTMENTS_DATA = {
  today: [
    { id: 'APT-1001', patient: 'Ravi Kumar',      opId: 'TN-OP-10245', patientId: 'CB10024', time: '09:00 AM', dept: 'General Medicine', type: 'Follow-up Consultation', status: 'Waiting' },
    { id: 'APT-1002', patient: 'Lakshmi Bai',     opId: 'TN-OP-10250', patientId: 'CB10029', time: '09:30 AM', dept: 'General Medicine', type: 'Diabetes Review',        status: 'Scheduled' },
    { id: 'APT-1003', patient: 'Sindhu Iyer',      opId: 'TN-OP-10258', patientId: 'CB10037', time: '10:00 AM', dept: 'General Medicine', type: 'Dengue Post-Fever',     status: 'Scheduled' },
    { id: 'APT-1004', patient: 'Geeta Krishnan',   opId: 'TN-OP-10266', patientId: 'CB10045', time: '10:30 AM', dept: 'General Medicine', type: 'Anemia Evaluation',     status: 'Scheduled' },
    { id: 'APT-1005', patient: 'Indira Gandhi',    opId: 'TN-OP-10270', patientId: 'CB10049', time: '11:15 AM', dept: 'General Medicine', type: 'COPD Management',       status: 'Scheduled' },
    { id: 'APT-1006', patient: 'Ramesh Pillai',    opId: 'TN-OP-10253', patientId: 'CB10032', time: '11:45 AM', dept: 'General Medicine', type: 'Hypertension Check',    status: 'Scheduled' },
  ],
  completed: [
    { id: 'APT-0982', patient: 'Ravi Kumar',      opId: 'TN-OP-10245', patientId: 'CB10024', apptDate: '2026-08-12', consultDate: '2026-08-12', diagnosisSummary: 'Essential Hypertension – Adjusted Telmisartan', status: 'Completed' },
    { id: 'APT-0975', patient: 'Lakshmi Bai',     opId: 'TN-OP-10250', patientId: 'CB10029', apptDate: '2026-08-10', consultDate: '2026-08-10', diagnosisSummary: 'Type 2 Diabetes Mellitus – Diet and Metformin compliance', status: 'Completed' },
    { id: 'APT-0968', patient: 'Usha Pillai',      opId: 'TN-OP-10262', patientId: 'CB10041', apptDate: '2026-08-05', consultDate: '2026-08-05', diagnosisSummary: 'Hypothyroidism – Continued Thyroxine 50mcg', status: 'Completed' },
    { id: 'APT-0950', patient: 'Geeta Krishnan',   opId: 'TN-OP-10266', patientId: 'CB10045', apptDate: '2026-07-28', consultDate: '2026-07-28', diagnosisSummary: 'Iron Deficiency Anemia – Oral hematinic started', status: 'Completed' },
  ],
  cancelled: [
    { id: 'APT-0910', patient: 'Ravi Kumar',      opId: 'TN-OP-10245', patientId: 'CB10024', apptDate: '2026-02-10', cancelDate: '2026-02-09', reason: 'Patient rescheduled due to travel to Chennai', status: 'Cancelled' },
    { id: 'APT-0885', patient: 'Padma Iyer',      opId: 'TN-OP-10274', patientId: 'CB10053', apptDate: '2026-01-20', cancelDate: '2026-01-19', reason: 'Referred directly to Surgical OPD', status: 'Cancelled' },
    { id: 'APT-0870', patient: 'Sindhu Iyer',      opId: 'TN-OP-10258', patientId: 'CB10037', apptDate: '2026-01-05', cancelDate: '2026-01-05', reason: 'Patient attended local PHC instead', status: 'Cancelled' },
  ]
};

export const BEDS = [
  { id: 'BED001', bedNo: 'G-01', ward: 'General Ward', type: 'General', status: 'Available',  patient: null,      patientId: null },
  { id: 'BED002', bedNo: 'G-02', ward: 'General Ward', type: 'General', status: 'Occupied',   patient: 'Indira Gandhi',  patientId: 'PAT026' },
  { id: 'BED003', bedNo: 'G-03', ward: 'General Ward', type: 'General', status: 'Cleaning',   patient: null,      patientId: null },
  { id: 'BED004', bedNo: 'ICU-01', ward: 'ICU',        type: 'ICU',     status: 'Available',  patient: null,      patientId: null },
  { id: 'BED005', bedNo: 'ICU-02', ward: 'ICU',        type: 'ICU',     status: 'Occupied',   patient: 'Kavitha Raj',    patientId: 'PAT004' },
  { id: 'BED006', bedNo: 'ICU-05', ward: 'ICU',        type: 'ICU',     status: 'Occupied',   patient: 'Bala Subramanian', patientId: 'PAT015' },
  { id: 'BED007', bedNo: 'E-01',  ward: 'Emergency',  type: 'Emergency',status: 'Occupied',   patient: 'Vijay Raj',      patientId: 'PAT011' },
  { id: 'BED008', bedNo: 'E-02',  ward: 'Emergency',  type: 'Emergency',status: 'Available',  patient: null,      patientId: null },
  { id: 'BED009', bedNo: 'E-03',  ward: 'Emergency',  type: 'Emergency',status: 'Occupied',   patient: 'Shankar Rajan',  patientId: 'PAT021' },
  { id: 'BED010', bedNo: 'P-02',  ward: 'Pediatric',  type: 'Pediatric',status: 'Occupied',   patient: 'Arjun Menon',    patientId: 'PAT019' },
];

export const REFERRALS = [
  { id: 'REF001', patient: 'Kavitha Raj',     patientId: 'PAT004', fromDoctor: 'Dr. Suresh Iyer', toDept: 'Cardiology', toFacility: 'District Hospital', reason: 'Complex MI - Cath Lab required', urgency: 'Urgent', priority: 'High', from: 'CareConnect District Hospital', to: 'District Hospital – Cardiology', doctor: 'Dr. Suresh Iyer', date: '2026-09-05', status: 'Accepted' },
  { id: 'REF002', patient: 'Bala Subramanian',patientId: 'PAT015', fromDoctor: 'Dr. Ritu Singh',  toDept: 'Neurosurgery', toFacility: 'Apex Medical Center', reason: 'ICH - Neurosurgical intervention', urgency: 'Emergency', priority: 'Critical', from: 'CareConnect District Hospital', to: 'Apex Medical Center – Neurosurgery', doctor: 'Dr. Ritu Singh', date: '2026-09-05', status: 'In Transit' },
  { id: 'REF003', patient: 'Vijay Raj',        patientId: 'PAT011', fromDoctor: 'Dr. Vijay Kumar', toDept: 'Trauma Surgery', toFacility: 'District Hospital', reason: 'Polytrauma - Surgical stabilization', urgency: 'Emergency', priority: 'Critical', from: 'CareConnect District Hospital', to: 'District Hospital – Trauma Surgery', doctor: 'Dr. Vijay Kumar', date: '2026-09-05', status: 'Requested' },
  { id: 'REF004', patient: 'Mohan Singh',      patientId: 'PAT007', fromDoctor: 'Dr. Mohan Das',   toDept: 'Physiotherapy', toFacility: 'PHC Rehabilitation', reason: 'Post-fracture rehab', urgency: 'Routine', priority: 'Low', from: 'CareConnect District Hospital', to: 'PHC Rehabilitation – Physiotherapy', doctor: 'Dr. Mohan Das', date: '2026-09-04', status: 'Accepted' },
  { id: 'REF005', patient: 'Usha Pillai',      patientId: 'PAT018', fromDoctor: 'Dr. Lakshmi Patel', toDept: 'Endocrinology', toFacility: 'Super Specialty Hospital', reason: 'Complex thyroid case', urgency: 'Routine', priority: 'Medium', from: 'CareConnect District Hospital', to: 'Super Specialty Hospital – Endocrinology', doctor: 'Dr. Lakshmi Patel', date: '2026-09-03', status: 'Completed' },
];

export const EMERGENCY_CASES = [
  { id: 'EMG001', patient: 'Vijay Raj',       patientId: 'PAT011', arrival: '2026-09-05 07:15', complaint: 'RTA - Multiple injuries', severity: 'Critical', doctor: 'Dr. Vijay Kumar', nurse: 'NRS004', bed: 'E-01', status: 'Active', bp: '90/60', spo2: '88%' },
  { id: 'EMG002', patient: 'Shankar Rajan',   patientId: 'PAT021', arrival: '2026-09-05 05:45', complaint: 'Chest pain - Possible MI', severity: 'Critical', doctor: 'Dr. Vijay Kumar', nurse: 'NRS004', bed: 'E-03', status: 'Active', bp: '150/100', spo2: '94%' },
  { id: 'EMG003', patient: 'Unknown Patient', patientId: null,     arrival: '2026-09-05 09:30', complaint: 'Unconscious - Found on road', severity: 'High',     doctor: 'Dr. Vijay Kumar', nurse: 'NRS004', bed: 'E-02', status: 'Triaged', bp: '-', spo2: '-' },
  { id: 'EMG004', patient: 'Bala Subramanian',patientId: 'PAT015', arrival: '2026-09-05 08:00', complaint: 'Sudden severe headache + confusion', severity: 'Critical', doctor: 'Dr. Ritu Singh', nurse: 'NRS007', bed: 'ICU-05', status: 'Admitted', bp: '200/120', spo2: '96%' },
];

export const NOTIFICATIONS = [
  { id: 'N001', title: 'Critical Lab Result', message: 'Troponin I CRITICAL for PAT021 - Shankar Rajan', type: 'critical', role: 'doctor',   time: '10 min ago', read: false },
  { id: 'N002', title: 'New Patient Assigned', message: 'Patient Geeta Krishnan assigned to you', type: 'info',     role: 'doctor',   time: '25 min ago', read: false },
  { id: 'N003', title: 'Low Stock Alert', message: 'Metformin 500mg — only 12 units remaining', type: 'warning',  role: 'pharmacy', time: '1 hr ago',   read: false },
  { id: 'N004', title: 'New Lab Order', message: 'CBC ordered for PAT004 - Kavitha Raj (Urgent)', type: 'info',     role: 'lab',      time: '2 hr ago',   read: true  },
  { id: 'N005', title: 'Emergency Alert', message: 'Critical patient Vijay Raj in Emergency Bed E-01', type: 'critical', role: 'admin',    time: '3 hr ago',   read: false },
  { id: 'N006', title: 'New Prescription', message: 'New prescription received for Ravi Kumar', type: 'info',     role: 'pharmacy', time: '3 hr ago',   read: true  },
  { id: 'N007', title: 'Medication Task', message: 'Amlodipine due for PAT001 at 2:00 PM', type: 'warning',  role: 'nurse',    time: '4 hr ago',   read: false },
  { id: 'N008', title: 'Bed Shortage Alert', message: 'ICU has only 1 bed available', type: 'warning',  role: 'admin',    time: '5 hr ago',   read: false },
  { id: 'N009', title: 'Expiry Alert', message: 'Dexamethasone 4mg expiring this month (Sep 30)', type: 'warning',  role: 'pharmacy', time: '1 day ago',  read: true  },
  { id: 'N010', title: 'Follow-up Reminder', message: 'Lakshmi Bai follow-up scheduled for 10:30 AM', type: 'info', role: 'doctor', time: '1 day ago',  read: true  },
];

export const BILLS = [
  { id: 'BILL001', patient: 'Ravi Kumar',    patientId: 'PAT001', date: '2026-09-05', amount: 15000, paid: 10000, balance: 5000,  status: 'Partial',   type: 'OPD',       payMode: 'Cash' },
  { id: 'BILL002', patient: 'Kavitha Raj',   patientId: 'PAT004', date: '2026-09-04', amount: 85000, paid: 0,     balance: 85000, status: 'Pending',   type: 'Admission', payMode: 'Insurance' },
  { id: 'BILL003', patient: 'Arun Prakash',  patientId: 'PAT003', date: '2026-09-03', amount: 35000, paid: 35000, balance: 0,     status: 'Paid',      type: 'Surgery',   payMode: 'Card' },
  { id: 'BILL004', patient: 'Meena Devi',    patientId: 'PAT002', date: '2026-09-05', amount: 8000,  paid: 8000,  balance: 0,     status: 'Paid',      type: 'OPD',       payMode: 'UPI' },
  { id: 'BILL005', patient: 'Suresh Kumar',  patientId: 'PAT005', date: '2026-09-02', amount: 45000, paid: 20000, balance: 25000, status: 'Partial',   type: 'Admission', payMode: 'Insurance' },
];

export const STATS = {
  admin: {
    totalPatients: 1248,
    opdPatients: 824,
    emergencyPatients: 96,
    inpatients: 328,
    availableBeds: 84,
    occupiedBeds: 244,
    doctorsAvailable: 42,
    pendingReferrals: 28,
    todayAppointments: 186,
    currentAdmissions: 328,
    emergencyCases: 96,
    pendingLab: 42,
    pendingRx: 28,
    todayRevenue: 285000,
  },
  doctor: {
    todayAppts: 12,
    assignedPatients: 8,
    waitingPatients: 5,
    criticalPatients: 1,
    pendingLabResults: 3,
    followupsToday: 2,
    pendingReferrals: 1,
  },
  nurse: {
    assignedPatients: 6,
    vitalsPending: 4,
    medicationTasks: 8,
    criticalPatients: 1,
    doctorInstructions: 3,
    proceduresToday: 5,
    dischargeTasks: 1,
  },
  reception: {
    todayAppts: 86,
    waitingPatients: 19,
    checkedIn: 42,
    availableDoctors: 7,
    emergencyArrivals: 4,
    pendingRegistrations: 6,
  },
  lab: {
    pendingOrders: 9,
    samplesPending: 5,
    testsInProgress: 4,
    completedTests: 34,
    resultsPending: 3,
    criticalResults: 2,
  },
  pharmacy: {
    pendingRx: 13,
    dispensedToday: 61,
    lowStock: 4,
    expiringMeds: 3,
    outOfStock: 2,
  },
  billing: {
    todayRevenue: 245000,
    paidBills: 28,
    pendingPayments: 14,
    outstanding: 380000,
    refundRequests: 2,
  },
  records: {
    totalRecords: 4892,
    recentlyUpdated: 47,
    pendingRequests: 8,
    documentsUploaded: 23,
    accessedToday: 62,
  },
  emergency: {
    activeCases: 4,
    criticalCases: 3,
    waitingTriage: 1,
    bedsAvailable: 2,
    doctorsOnDuty: 3,
    nursesOnDuty: 5,
  },
  hr: {
    totalStaff: 284,
    doctors: 47,
    nurses: 98,
    labStaff: 22,
    pharmacyStaff: 18,
    onDuty: 156,
    onLeave: 12,
  },
};

// Chart data
export const CHART_DATA = {
  admissionsTrend: [
    { month: 'Apr', admissions: 312, discharges: 298 },
    { month: 'May', admissions: 345, discharges: 330 },
    { month: 'Jun', admissions: 298, discharges: 285 },
    { month: 'Jul', admissions: 389, discharges: 375 },
    { month: 'Aug', admissions: 421, discharges: 398 },
    { month: 'Sep', admissions: 142, discharges: 128 },
  ],
  deptDistribution: [
    { name: 'General Medicine', value: 35 },
    { name: 'Surgery', value: 20 },
    { name: 'Pediatrics', value: 15 },
    { name: 'Cardiology', value: 12 },
    { name: 'Neurology', value: 8 },
    { name: 'Others', value: 10 },
  ],
  bedOccupancy: [
    { ward: 'General', total: 40, occupied: 28 },
    { ward: 'ICU', total: 10, occupied: 8 },
    { ward: 'Emergency', total: 8, occupied: 6 },
    { ward: 'Pediatric', total: 20, occupied: 12 },
    { ward: 'Surgery', total: 15, occupied: 9 },
  ],
  weeklyAppts: [
    { day: 'Mon', scheduled: 72, completed: 68, cancelled: 4 },
    { day: 'Tue', scheduled: 85, completed: 80, cancelled: 5 },
    { day: 'Wed', scheduled: 91, completed: 87, cancelled: 4 },
    { day: 'Thu', scheduled: 78, completed: 74, cancelled: 4 },
    { day: 'Fri', scheduled: 86, completed: 82, cancelled: 4 },
    { day: 'Sat', scheduled: 45, completed: 43, cancelled: 2 },
    { day: 'Sun', scheduled: 20, completed: 19, cancelled: 1 },
  ],
};

// ── Backward-compatible aliases (old pages use lowercase) ─────
export const doctors      = DOCTORS;
export const nurses       = NURSES;
export const patients     = PATIENTS;
export const appointments = APPOINTMENTS;
export const referrals    = REFERRALS;
export const medicines    = MEDICINES;
export const notifications= NOTIFICATIONS;
export const beds         = BEDS;

// Stubs for old pages that expect data not yet migrated
export const ambulances   = [
  { id: 'AMB001', number: 'TN-01-2345', driver: 'Ramu', status: 'Available', location: 'Hospital' },
  { id: 'AMB002', number: 'TN-01-2346', driver: 'Suresh', status: 'On Call', location: 'En Route' },
];
export const analyticsData = {
  monthly: CHART_DATA.admissionsTrend,
  deptDistribution: CHART_DATA.deptDistribution,
  bedOccupancy: CHART_DATA.bedOccupancy,
  // Patient visits trend (used by AreaChart in AnalyticsPage)
  patientVisits: [
    { month: 'Apr', visits: 820,  last: 750 },
    { month: 'May', visits: 932,  last: 860 },
    { month: 'Jun', visits: 901,  last: 880 },
    { month: 'Jul', visits: 934,  last: 920 },
    { month: 'Aug', visits: 1290, last: 1000 },
    { month: 'Sep', visits: 1330, last: 1100 },
  ],
  // Teleconsultations this week (used by BarChart in AnalyticsPage)
  teleconsultations: [
    { day: 'Mon', count: 4 }, { day: 'Tue', count: 6 }, { day: 'Wed', count: 8 },
    { day: 'Thu', count: 7 }, { day: 'Fri', count: 9 }, { day: 'Sat', count: 4 },
  ],
  // Referral status distribution (used by PieChart in AnalyticsPage)
  referralStatus: [
    { name: 'Completed', value: 14, color: '#10B981' },
    { name: 'In Transit', value: 6,  color: '#0EA5E9' },
    { name: 'Accepted',   value: 8,  color: '#6366F1' },
    { name: 'Requested',  value: 4,  color: '#F59E0B' },
  ],
  // Appointment type breakdown (used by PieChart in AnalyticsPage)
  appointmentTypes: [
    { name: 'In-Person',        value: 58, color: '#0EA5E9' },
    { name: 'Teleconsultation', value: 28, color: '#0D9488' },
    { name: 'Emergency',        value: 14, color: '#EF4444' },
  ],
  // Common diseases (used by bar progress in AnalyticsPage)
  commonDiseases: [
    { name: 'Hypertension',     cases: 148 },
    { name: 'Type 2 Diabetes',  cases: 132 },
    { name: 'Respiratory Inf.', cases: 98  },
    { name: 'Cardiac Issues',   cases: 76  },
    { name: 'Ortho / Fracture', cases: 64  },
  ],
  // Medicine consumption by category (used by BarChart in AnalyticsPage)
  medicineConsumption: [
    { name: 'Antibiotics',     units: 420 },
    { name: 'Antihypertensives', units: 380 },
    { name: 'Analgesics',      units: 310 },
    { name: 'Antidiabetics',   units: 290 },
    { name: 'Cardiac',         units: 210 },
  ],
};
export const labTests = LAB_ORDERS;
export const emergencyCases = EMERGENCY_CASES;
export const facilities = DEPARTMENTS.map(d => ({ ...d, status: 'Active' }));
export const districtData = { hospitals: 12, patients: 4820, beds: 620, occupancy: 72 };
export const inventory = MEDICINES;
export const opdQueue = APPOINTMENTS.filter(a => a.status === 'Waiting' || a.status === 'Checked-in');
export const wards = BEDS.reduce((acc, b) => {
  const w = acc.find(x => x.name === b.ward);
  if (w) { w.beds.push(b); } else { acc.push({ name: b.ward, beds: [b] }); }
  return acc;
}, []);
export const staff = [
  ...DOCTORS.map((d, i) => ({
    ...d,
    type: 'Doctor', role: 'Doctor',
    dept: d.department,                        // normalize: DOCTORS use 'department'
    status: d.available ? 'On Duty' : 'Off Duty',
    shift: 'Morning (8AM–2PM)',
    empId: d.id,
    email: d.phone?.replace('+91 ', '').replace(/\s/g, '') + '@careconnect.in',
  })),
  ...NURSES.map((n, i) => ({
    ...n,
    type: 'Nurse', role: 'Nurse',
    dept: n.ward,                              // normalize: NURSES use 'ward'
    department: n.ward,
    phone: `+91 98765 2${String(1000 + i).slice(1)}`,
    email: n.name.toLowerCase().replace(/\s/g, '.') + '@careconnect.in',
    empId: n.id,
    shift: n.shift === 'Morning' ? 'Morning (8AM–2PM)' : n.shift === 'Evening' ? 'Evening (2PM–8PM)' : 'Night (8PM–8AM)',
    available: n.status === 'On Duty',
    experience: '3 yrs',
    qualification: 'B.Sc Nursing',
  })),
];
export const currentUser = {
  id: 'USR_ADMIN', name: 'Dr. Rajesh Kumar', role: 'Hospital Administrator',
  department: 'Administration', dept: 'Administration', empId: 'EMP-001', avatar: 'RK',
  email: 'rajesh.kumar@carebridge.gov.in', phone: '+91 98765 00001',
  hospital: 'Government District Hospital — Salem',
};

// ════════════════════════════════════════════════════════════
// CAREBRIDGE SPECIFICATION DATASETS
// ════════════════════════════════════════════════════════════

export const CAREBRIDGE_KPIS = [
  { id: 'total-patients', label: 'Total Patients Today', value: '1,248', count: 1248, change: '+8.4% vs yesterday', dir: 'up', color: '#0EA5E9', bg: '#E0F2FE', route: 'patients', desc: 'OPD + IPD + Emergency' },
  { id: 'opd-patients',   label: 'OPD Patients',         value: '824',   count: 824,  change: '186 in waiting queue', dir: 'neutral', color: '#10B981', bg: '#D1FAE5', route: 'opd', desc: 'Active outpatient consultations' },
  { id: 'emergency',      label: 'Emergency Patients',   value: '96',    count: 96,   change: '3 critical resuscitation', dir: 'down', color: '#EF4444', bg: '#FEE2E2', route: 'emergency', desc: 'Trauma & STAT cases' },
  { id: 'available-beds', label: 'Available Beds',       value: '84',    count: 84,   change: '12 ICU · 8 Emergency', dir: 'up', color: '#059669', bg: '#ECFDF5', route: 'wards', desc: 'Ready for immediate admission' },
  { id: 'occupied-beds',  label: 'Occupied Beds',        value: '244',   count: 244,  change: '24 discharges pending', dir: 'neutral', color: '#D97706', bg: '#FEF3C7', route: 'wards', desc: 'Currently occupied' },
  { id: 'doctors-avail',  label: 'Doctors Available',    value: '42',    count: 42,   change: '42 of 50 on active duty', dir: 'up', color: '#2563EB', bg: '#EFF6FF', route: 'doctors', desc: 'Available for consultations' },
  { id: 'pending-referrals', label: 'Pending Referrals', value: '28',    count: 28,   change: '4 flagged > 4h delay', dir: 'down', color: '#DC2626', bg: '#FEF2F2', route: 'referrals', desc: 'Incoming & Outgoing' },
];

export const PATIENT_FLOW_PIPELINE = [
  { step: 1, name: 'Registered',          count: 1248, delay: '8 min',  status: 'normal',   icon: 'UserCheck' },
  { step: 2, name: 'Waiting',             count: 186,  delay: '32 min', status: 'warning',  icon: 'Clock' },
  { step: 3, name: 'Doctor Consultation', count: 142,  delay: '15 min', status: 'normal',   icon: 'Stethoscope' },
  { step: 4, name: 'Diagnostics',         count: 94,   delay: '45 min', status: 'bottleneck', icon: 'FlaskConical', alert: 'Highest Bottleneck' },
  { step: 5, name: 'Prescription',        count: 88,   delay: '10 min', status: 'normal',   icon: 'FileText' },
  { step: 6, name: 'Pharmacy',            count: 76,   delay: '12 min', status: 'normal',   icon: 'Pill' },
  { step: 7, name: 'Discharged',          count: 662,  delay: '-',      status: 'success',  icon: 'CheckCircle2' },
];

export const BOTTLENECK_ALERT = {
  stage: 'Diagnostics',
  avgDelay: '45 min',
  targetDelay: '20 min',
  impactText: 'Diagnostic waiting time (45 min) is currently the highest bottleneck in patient flow.',
  cause: 'High CT/MRI queue & STAT blood sample collection delays in Emergency triage',
  actionText: 'Deploy extra phlebotomist & activate Radiology Priority Lane 2'
};

export const COMMAND_CENTRE_12 = [
  { q: '1. How many patients are currently in the hospital?', a: '1,248 total patients (824 OPD, 328 Admitted, 96 Emergency)', status: 'normal', metric: '1,248' },
  { q: '2. How many patients are waiting?', a: '186 patients currently waiting in OPD queue (Average wait: 32 min)', status: 'warning', metric: '186' },
  { q: '3. Which department has the highest workload?', a: 'General Medicine (384 patients today, 88% capacity utilization)', status: 'warning', metric: 'Gen Med' },
  { q: '4. How many beds are available?', a: '84 beds available out of 328 total beds (244 occupied, 74.4% occupancy)', status: 'normal', metric: '84 / 328' },
  { q: '5. Is the ICU full?', a: 'No, 12 available beds out of 30 ICU beds (18 occupied, 60% occupancy)', status: 'normal', metric: '12 Free' },
  { q: '6. Which doctors are available?', a: '42 doctors currently on active duty out of 50 total doctors (8 on leave/rounds)', status: 'normal', metric: '42 / 50' },
  { q: '7. Which referrals are pending?', a: '28 referrals pending (19 incoming from PHCs, 9 outgoing to Super Specialty; 4 delayed >4h)', status: 'warning', metric: '28 (4 delayed)' },
  { q: '8. Which diagnostic tests are delayed?', a: '18 diagnostic requests pending beyond SLA (>60 min), primarily CT Brain & Fasting Lipid Profile', status: 'bottleneck', metric: '18 Delayed' },
  { q: '9. Which medicines are running low?', a: '12 medicines below safety buffer (Metformin, Omeprazole, Furosemide); 2 critical antibiotics out of stock', status: 'warning', metric: '12 Low' },
  { q: '10. Are there critical emergency cases?', a: '3 critical patients under active resuscitation in bays E-01 (Polytrauma), E-03 (Acute MI), and ICU-05 (ICH)', status: 'critical', metric: '3 STAT' },
  { q: '11. What operational problems require immediate attention?', a: '1) Diagnostic backlog causing 45m delay; 2) Cardiology Night Shift understaffed by 1 specialist', status: 'critical', metric: '2 Issues' },
  { q: '12. How is the hospital performing today?', a: 'Hospital Performance Score: 86 / 100 (Operational Grade A - Quality Healthcare)', status: 'success', metric: '86 / 100' },
];

export const BED_STATISTICS = {
  total: 328,
  occupied: 244,
  available: 84,
  occupancyRate: 74.4,
  wards: [
    { name: 'ICU',              total: 30,  occupied: 18, available: 12, cleaning: 0, maintenance: 0, color: '#EF4444' },
    { name: 'Emergency Ward',   total: 25,  occupied: 17, available: 8,  cleaning: 0, maintenance: 0, color: '#DC2626' },
    { name: 'General Ward',     total: 220, occupied: 172,available: 48, cleaning: 3, maintenance: 1, color: '#0EA5E9' },
    { name: 'Pediatric Ward',   total: 35,  occupied: 25, available: 10, cleaning: 1, maintenance: 0, color: '#EC4899' },
    { name: 'Surgery / Post-Op',total: 18,  occupied: 12, available: 6,  cleaning: 0, maintenance: 0, color: '#8B5CF6' },
  ]
};

// Interactive Bed Map dataset (sample ward layout with color codes)
export const WARD_BED_MAP = [
  // ICU Beds
  { id: 'ICU-01', ward: 'ICU', type: 'ICU', bedNo: 'ICU-01', status: 'Available', patient: null, vitals: null },
  { id: 'ICU-02', ward: 'ICU', type: 'ICU', bedNo: 'ICU-02', status: 'Occupied', patient: 'Kavitha Raj (55F)', diagnosis: 'Acute MI', vitals: 'BP 140/90 · SpO2 96%' },
  { id: 'ICU-03', ward: 'ICU', type: 'ICU', bedNo: 'ICU-03', status: 'Available', patient: null, vitals: null },
  { id: 'ICU-04', ward: 'ICU', type: 'ICU', bedNo: 'ICU-04', status: 'Reserved', patient: 'Post-Op Transfer (Arun P)', diagnosis: 'Appendectomy', vitals: null },
  { id: 'ICU-05', ward: 'ICU', type: 'ICU', bedNo: 'ICU-05', status: 'Occupied', patient: 'Bala Subramanian (70M)', diagnosis: 'ICH / Stroke', vitals: 'BP 190/110 · SpO2 95%' },
  { id: 'ICU-06', ward: 'ICU', type: 'ICU', bedNo: 'ICU-06', status: 'Available', patient: null, vitals: null },
  
  // Emergency Beds
  { id: 'E-01', ward: 'Emergency', type: 'Emergency', bedNo: 'E-01', status: 'Occupied', patient: 'Vijay Raj (48M)', diagnosis: 'RTA Polytrauma', vitals: 'BP 90/60 · SpO2 88%' },
  { id: 'E-02', ward: 'Emergency', type: 'Emergency', bedNo: 'E-02', status: 'Available', patient: null, vitals: null },
  { id: 'E-03', ward: 'Emergency', type: 'Emergency', bedNo: 'E-03', status: 'Occupied', patient: 'Shankar Rajan (53M)', diagnosis: 'Chest Pain / Angina', vitals: 'BP 150/100 · SpO2 94%' },
  { id: 'E-04', ward: 'Emergency', type: 'Emergency', bedNo: 'E-04', status: 'Cleaning', patient: null, vitals: null },
  { id: 'E-05', ward: 'Emergency', type: 'Emergency', bedNo: 'E-05', status: 'Available', patient: null, vitals: null },
  
  // General Ward Beds
  { id: 'GW-01', ward: 'General Ward', type: 'General', bedNo: 'G-01', status: 'Available', patient: null, vitals: null },
  { id: 'GW-02', ward: 'General Ward', type: 'General', bedNo: 'G-02', status: 'Occupied', patient: 'Indira Gandhi (72F)', diagnosis: 'COPD Exacerbation', vitals: 'BP 125/80 · SpO2 96%' },
  { id: 'GW-03', ward: 'General Ward', type: 'General', bedNo: 'G-03', status: 'Cleaning', patient: null, vitals: null },
  { id: 'GW-04', ward: 'General Ward', type: 'General', bedNo: 'G-04', status: 'Occupied', patient: 'Ravi Kumar (45M)', diagnosis: 'Hypertension', vitals: 'BP 130/85 · SpO2 98%' },
  { id: 'GW-05', ward: 'General Ward', type: 'General', bedNo: 'G-05', status: 'Available', patient: null, vitals: null },
  { id: 'GW-06', ward: 'General Ward', type: 'General', bedNo: 'G-06', status: 'Maintenance', patient: null, vitals: null },
  { id: 'GW-07', ward: 'General Ward', type: 'General', bedNo: 'G-07', status: 'Occupied', patient: 'Sindhu Iyer (22F)', diagnosis: 'Dengue Fever', vitals: 'BP 110/70 · SpO2 99%' },
  { id: 'GW-08', ward: 'General Ward', type: 'General', bedNo: 'G-08', status: 'Reserved', patient: 'Admit pending - OPD A104', diagnosis: 'Observation', vitals: null },
  
  // Pediatric Beds
  { id: 'PED-01', ward: 'Pediatric Ward', type: 'Pediatric', bedNo: 'P-01', status: 'Available', patient: null, vitals: null },
  { id: 'PED-02', ward: 'Pediatric Ward', type: 'Pediatric', bedNo: 'P-02', status: 'Occupied', patient: 'Arjun Menon (16M)', diagnosis: 'Severe Asthma', vitals: 'BP 115/75 · SpO2 97%' },
  { id: 'PED-03', ward: 'Pediatric Ward', type: 'Pediatric', bedNo: 'P-03', status: 'Available', patient: null, vitals: null },
  { id: 'PED-04', ward: 'Pediatric Ward', type: 'Pediatric', bedNo: 'P-04', status: 'Occupied', patient: 'Ganesh Kumar (8M)', diagnosis: 'Pneumonia', vitals: 'BP 100/65 · SpO2 95%' },
];

export const SHIFTS_ROSTER = [
  {
    id: 'SHIFT-MORNING',
    name: 'Morning Shift',
    time: '07:00 – 15:00',
    assignedStaff: 112,
    presentStaff: 108,
    onLeave: 4,
    shortages: [],
    status: 'Optimal'
  },
  {
    id: 'SHIFT-AFTERNOON',
    name: 'Afternoon Shift',
    time: '15:00 – 23:00',
    assignedStaff: 86,
    presentStaff: 84,
    onLeave: 2,
    shortages: [],
    status: 'Optimal'
  },
  {
    id: 'SHIFT-NIGHT',
    name: 'Night Shift',
    time: '23:00 – 07:00',
    assignedStaff: 42,
    presentStaff: 39,
    onLeave: 3,
    shortages: [
      { dept: 'Cardiology', role: 'Specialist Doctor', required: 2, assigned: 1, alert: 'Cardiology Night Shift understaffed (1 doctor on duty, minimum 2 required)' },
      { dept: 'Emergency', role: 'Triage Nurse', required: 6, assigned: 5, alert: 'Emergency requires 1 backup triage nurse for night shift' }
    ],
    status: 'Understaffed'
  }
];

export const CRITICAL_LAB_RESULTS = [
  { id: 'CRIT-01', patientId: 'PAT1024', patientName: 'Ravi Kumar', test: 'Complete Hemogram (Hb)', value: '5.2 g/dL', normal: '12.0 – 16.0 g/dL', flag: 'CRITICAL LOW', doctor: 'Dr. Priya Sharma', time: '14 min ago', acknowledged: false },
  { id: 'CRIT-02', patientId: 'PAT021',  patientName: 'Shankar Rajan', test: 'Troponin I (High Sensitivity)', value: '0.85 ng/mL', normal: '< 0.04 ng/mL', flag: 'STAT POSITIVE', doctor: 'Dr. Vijay Kumar', time: '28 min ago', acknowledged: false },
  { id: 'CRIT-03', patientId: 'PAT004',  patientName: 'Kavitha Raj', test: 'Serum Potassium (K+)', value: '6.8 mmol/L', normal: '3.5 – 5.0 mmol/L', flag: 'CRITICAL HIGH', doctor: 'Dr. Suresh Iyer', time: '55 min ago', acknowledged: true }
];

export const AMBULANCE_FLEET = [
  { id: 'AMB-01', vehicleNo: 'TN-30-G-1024', type: 'Advanced Life Support (ALS)', driver: 'K. Ramasamy', phone: '+91 94431 22001', status: 'Available', location: 'GDH Salem Base', lat: 11.6643, lng: 78.1460, speed: '0 km/h', patient: null, destination: '-' },
  { id: 'AMB-02', vehicleNo: 'TN-30-G-1025', type: 'Basic Life Support (BLS)', driver: 'M. Senthil', phone: '+91 94431 22002', status: 'En Route', location: 'Salem Bypass / Omalur Rd', lat: 11.6850, lng: 78.1320, speed: '62 km/h', patient: 'RTA Victim (Male 35)', destination: 'GDH Emergency Bay' },
  { id: 'AMB-03', vehicleNo: 'TN-30-G-1026', type: 'Advanced Life Support (ALS)', driver: 'P. Murugan', phone: '+91 94431 22003', status: 'At Hospital', location: 'Trauma Care Bay 2', lat: 11.6648, lng: 78.1465, speed: '0 km/h', patient: 'Discharged transfer', destination: 'Taluk Hospital Attur' },
  { id: 'AMB-04', vehicleNo: 'TN-30-G-1027', type: 'Neonatal Care Unit', driver: 'S. Velu', phone: '+91 94431 22004', status: 'Available', location: 'Pediatric Wing Depot', lat: 11.6639, lng: 78.1455, speed: '0 km/h', patient: null, destination: '-' },
  { id: 'AMB-05', vehicleNo: 'TN-30-G-1028', type: 'Basic Life Support (BLS)', driver: 'R. Prakash', phone: '+91 94431 22005', status: 'Maintenance', location: 'Govt Workshop Salem', lat: 11.6520, lng: 78.1580, speed: '0 km/h', patient: null, destination: 'Service Bay' },
];

export const OFFLINE_SYNC_STATE = {
  isOnline: true,
  syncStatus: 'Online',
  lastSyncTime: '2 minutes ago',
  pendingRecords: 18,
  networkQuality: 'Good (4G Govt WAN)',
  logs: [
    { id: 'SYNC-108', timestamp: 'Today 14:32:10', records: 42, module: 'OPD Queue & Registrations', status: 'Success', gateway: 'Salem District Health Cloud' },
    { id: 'SYNC-107', timestamp: 'Today 14:02:44', records: 88, module: 'Lab Results & Vitals', status: 'Success', gateway: 'Salem District Health Cloud' },
    { id: 'SYNC-106', timestamp: 'Today 13:30:12', records: 23, module: 'Prescriptions & Pharmacy', status: 'Success', gateway: 'Salem District Health Cloud' },
    { id: 'SYNC-105', timestamp: 'Today 13:00:05', records: 15, module: 'Referrals & Bed Allocations', status: 'Success', gateway: 'Salem District Health Cloud' },
  ]
};

export const REPORTS_CATALOG = [
  { id: 'REP-01', title: 'Daily Patient Summary Report', category: 'General', format: 'PDF, CSV', desc: 'Summary of all OPD, IPD, and Emergency patient registrations, admissions, and discharges.' },
  { id: 'REP-02', title: 'OPD Performance & Queue Report', category: 'Outpatient', format: 'PDF, CSV', desc: 'Doctor-wise consultation count, waiting times, token completion rates, and department loads.' },
  { id: 'REP-03', title: 'IPD Admissions & Bed Occupancy Report', category: 'Inpatient', format: 'PDF, CSV', desc: 'Ward-level bed utilization, average length of stay (ALOS), and discharge turnaround times.' },
  { id: 'REP-04', title: 'Doctor Workload & Productivity Report', category: 'Clinical', format: 'PDF, CSV', desc: 'Patient consultation volumes, teleconsultations, and duty hour adherence per doctor.' },
  { id: 'REP-05', title: 'CareBridge Referral Network Report', category: 'Referrals', format: 'PDF, CSV', desc: 'Incoming referrals from PHC/CHC vs outgoing transfers to super-specialty institutions.' },
  { id: 'REP-06', title: 'Medicine Stock & Consumption Report', category: 'Pharmacy', format: 'PDF, CSV', desc: 'Inventory depletion trends, stock-out alerts, and batch expiry surveillance.' },
  { id: 'REP-07', title: 'Diagnostic & Laboratory Turnaround Report', category: 'Diagnostics', format: 'PDF, CSV', desc: 'Sample collection times, machine processing durations, and critical value alerts.' },
  { id: 'REP-08', title: 'Emergency & Triage Operations Report', category: 'Emergency', format: 'PDF, CSV', desc: 'Severity triage breakdown, resuscitation bay turnaround, and trauma outcomes.' },
  { id: 'REP-09', title: 'Hospital Performance & Quality KPI Scorecard', category: 'Executive', format: 'PDF, CSV', desc: 'Overall hospital performance index (86/100) with 8 NABH quality indicators.' },
  { id: 'REP-10', title: 'Information Security & Audit Trail Report', category: 'System', format: 'PDF, CSV', desc: 'Access logs for ABHA records, patient record updates, and administrative overrides.' },
];

