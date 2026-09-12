import { useState } from 'react';
import { Camera, Edit, Lock, Bell, Shield, User, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

// Role-specific professional details
const ROLE_DETAILS = {
  admin: {
    qualification: 'MBA (Healthcare Management), MHA',
    regNo: 'HOSP-ADM-2024-001',
    joining: '01 January 2022',
    stats: [
      { label: 'Departments Managed', value: '10' },
      { label: 'Staff Supervised', value: '284' },
      { label: 'Reports Generated', value: '142' },
      { label: 'Audits Completed', value: '38' },
      { label: 'Policy Updates', value: '24' },
      { label: 'Last Login', value: 'Today, 9:00 AM' },
    ],
    notifPrefs: [
      { label: 'Department Alerts', desc: 'Critical department notifications', default: true },
      { label: 'Staff Reports', desc: 'Weekly staff activity summaries', default: true },
      { label: 'Audit Notifications', desc: 'Compliance and audit reminders', default: true },
      { label: 'Emergency Broadcasts', desc: 'Hospital-wide emergency alerts', default: true },
      { label: 'Finance Reports', desc: 'Revenue and billing summaries', default: false },
    ],
  },
  doctor: {
    qualification: 'MBBS, MD (General Medicine)',
    regNo: 'MCI-2024-PB-18542',
    joining: '15 March 2020',
    stats: [
      { label: 'Patients Managed', value: '1,248' },
      { label: 'Appointments Today', value: '12' },
      { label: 'Prescriptions Written', value: '386' },
      { label: 'Referrals Created', value: '28' },
      { label: 'Teleconsultations', value: '42' },
      { label: 'Last Login', value: 'Today, 8:45 AM' },
    ],
    notifPrefs: [
      { label: 'New Patient Assignments', desc: 'When a patient is assigned to you', default: true },
      { label: 'Critical Lab Results', desc: 'Urgent/STAT lab result alerts', default: true },
      { label: 'Appointment Reminders', desc: '15-minute appointment alerts', default: true },
      { label: 'Referral Updates', desc: 'Status changes on your referrals', default: true },
      { label: 'Teleconsultation Requests', desc: 'Incoming video consultation requests', default: false },
    ],
  },
  nurse: {
    qualification: 'B.Sc Nursing, General Nursing & Midwifery (GNM)',
    regNo: 'NMC-2024-TN-08431',
    joining: '01 June 2021',
    stats: [
      { label: 'Patients Assigned', value: '6' },
      { label: 'Vitals Recorded Today', value: '18' },
      { label: 'Medications Administered', value: '42' },
      { label: 'Procedures Completed', value: '8' },
      { label: 'Doctor Notes Recorded', value: '14' },
      { label: 'Last Login', value: 'Today, 7:30 AM' },
    ],
    notifPrefs: [
      { label: 'Medication Task Alerts', desc: 'Reminders for medication schedules', default: true },
      { label: 'Critical Patient Alerts', desc: 'Deteriorating patient notifications', default: true },
      { label: 'Doctor Order Updates', desc: 'New orders from attending physicians', default: true },
      { label: 'Shift Change Reminders', desc: 'Upcoming shift handover alerts', default: true },
      { label: 'Emergency Code Alerts', desc: 'Code Blue / Code Red broadcasts', default: true },
    ],
  },
  reception: {
    qualification: 'BBA (Hospital Administration)',
    regNo: 'HOSP-REC-2024-004',
    joining: '10 August 2022',
    stats: [
      { label: 'Patients Registered Today', value: '24' },
      { label: 'Appointments Booked', value: '38' },
      { label: 'Check-ins Processed', value: '42' },
      { label: 'Referrals Coordinated', value: '6' },
      { label: 'Queries Resolved', value: '18' },
      { label: 'Last Login', value: 'Today, 8:00 AM' },
    ],
    notifPrefs: [
      { label: 'New Appointment Alerts', desc: 'When patients book online', default: true },
      { label: 'Emergency Walk-ins', desc: 'Emergency patient arrivals', default: true },
      { label: 'Doctor Availability Updates', desc: 'Doctor schedule changes', default: true },
      { label: 'Cancellation Alerts', desc: 'Appointment cancellations', default: false },
    ],
  },
  lab: {
    qualification: 'B.Sc (Medical Laboratory Technology), DMLT',
    regNo: 'LAB-TN-2024-00512',
    joining: '05 September 2019',
    stats: [
      { label: 'Tests Processed Today', value: '34' },
      { label: 'Pending Orders', value: '9' },
      { label: 'Critical Results Reported', value: '2' },
      { label: 'Samples Collected', value: '28' },
      { label: 'Reports Uploaded', value: '31' },
      { label: 'Last Login', value: 'Today, 7:00 AM' },
    ],
    notifPrefs: [
      { label: 'New Test Orders', desc: 'Incoming lab orders from doctors', default: true },
      { label: 'STAT / Urgent Orders', desc: 'High-priority test alerts', default: true },
      { label: 'Critical Value Alerts', desc: 'Results requiring immediate attention', default: true },
      { label: 'Low Reagent Alerts', desc: 'Lab supply inventory warnings', default: true },
      { label: 'Equipment Maintenance', desc: 'Scheduled calibration reminders', default: false },
    ],
  },
  pharmacy: {
    qualification: 'B.Pharm, D.Pharm',
    regNo: 'PCI-KL-2024-11234',
    joining: '20 April 2021',
    stats: [
      { label: 'Prescriptions Dispensed Today', value: '61' },
      { label: 'Pending Prescriptions', value: '13' },
      { label: 'Low Stock Items', value: '4' },
      { label: 'Out of Stock Items', value: '2' },
      { label: 'Reorders Placed', value: '3' },
      { label: 'Last Login', value: 'Today, 8:15 AM' },
    ],
    notifPrefs: [
      { label: 'New Prescription Alerts', desc: 'Incoming prescriptions to dispense', default: true },
      { label: 'Low Stock Warnings', desc: 'Medicines below minimum level', default: true },
      { label: 'Expiry Date Alerts', desc: 'Medicines expiring within 90 days', default: true },
      { label: 'Reorder Confirmations', desc: 'Purchase order status updates', default: false },
    ],
  },
  billing: {
    qualification: 'B.Com, Diploma in Medical Billing & Coding',
    regNo: 'HOSP-BIL-2024-007',
    joining: '01 March 2023',
    stats: [
      { label: "Today's Revenue", value: '₹2.45L' },
      { label: 'Bills Raised Today', value: '28' },
      { label: 'Pending Payments', value: '14' },
      { label: 'Insurance Claims', value: '6' },
      { label: 'Refund Requests', value: '2' },
      { label: 'Last Login', value: 'Today, 9:20 AM' },
    ],
    notifPrefs: [
      { label: 'New Bill Alerts', desc: 'Bills generated by admission/discharge', default: true },
      { label: 'Payment Received', desc: 'When payments are processed', default: true },
      { label: 'Insurance Updates', desc: 'Claim approval/rejection notifications', default: true },
      { label: 'Overdue Payment Alerts', desc: 'Pending payments beyond due date', default: true },
      { label: 'Refund Approvals', desc: 'Refund request status updates', default: false },
    ],
  },
  records: {
    qualification: 'B.Sc (Health Information Management), RHIA',
    regNo: 'HOSP-REC-2024-008',
    joining: '12 July 2020',
    stats: [
      { label: 'Records Updated Today', value: '47' },
      { label: 'Documents Uploaded', value: '23' },
      { label: 'Access Requests', value: '8' },
      { label: 'Records Retrieved', value: '62' },
      { label: 'Errors Corrected', value: '4' },
      { label: 'Last Login', value: 'Today, 8:30 AM' },
    ],
    notifPrefs: [
      { label: 'New Record Requests', desc: 'Requests for patient records', default: true },
      { label: 'Document Upload Alerts', desc: 'New document scan notifications', default: true },
      { label: 'Access Log Updates', desc: 'Unauthorized access attempt alerts', default: true },
      { label: 'Archival Reminders', desc: 'Records due for archival', default: false },
    ],
  },
  emergency: {
    qualification: 'MBBS, DNB (Emergency Medicine), ATLS',
    regNo: 'MCI-2024-EM-09876',
    joining: '01 November 2018',
    stats: [
      { label: 'Cases Handled Today', value: '4' },
      { label: 'Critical Cases Active', value: '3' },
      { label: 'Triage Completed', value: '12' },
      { label: 'Transfers Coordinated', value: '2' },
      { label: 'Ambulance Responses', value: '5' },
      { label: 'Last Login', value: 'Today, 6:00 AM' },
    ],
    notifPrefs: [
      { label: 'New Emergency Arrivals', desc: 'Patient arriving via ambulance', default: true },
      { label: 'Critical Case Alerts', desc: 'Severity escalation notifications', default: true },
      { label: 'Bed Availability Updates', desc: 'ICU/Emergency bed status changes', default: true },
      { label: 'Specialist Alerts', desc: 'On-call specialist availability', default: true },
      { label: 'Transfer Status Updates', desc: 'Patient transfer confirmations', default: false },
    ],
  },
  hr: {
    qualification: 'MBA (Human Resources), PGDM-HR',
    regNo: 'HOSP-HR-2024-010',
    joining: '15 February 2021',
    stats: [
      { label: 'Total Staff Managed', value: '284' },
      { label: 'Leave Requests Pending', value: '7' },
      { label: 'Shift Assignments Today', value: '156' },
      { label: 'New Joiners This Month', value: '3' },
      { label: 'Attendance Rate', value: '94.2%' },
      { label: 'Last Login', value: 'Today, 9:05 AM' },
    ],
    notifPrefs: [
      { label: 'Leave Request Alerts', desc: 'Staff leave applications to review', default: true },
      { label: 'Attendance Anomalies', desc: 'Unexplained absences or late arrivals', default: true },
      { label: 'Shift Coverage Gaps', desc: 'Under-staffed shift alerts', default: true },
      { label: 'New Joining Reminders', desc: 'Onboarding tasks for new staff', default: false },
      { label: 'Performance Review Alerts', desc: 'Scheduled appraisal reminders', default: false },
    ],
  },
};

export default function ProfilePage() {
  const { user } = useAuth();
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  // Build user info from AuthContext (accounts.js data)
  const roleId = user?.roleId || 'admin';
  const details = ROLE_DETAILS[roleId] || ROLE_DETAILS.admin;
  const displayName = user?.name || 'User';
  const displayRole = user?.roleName || 'Staff';
  const displayDept = user?.dept || 'Hospital';
  const displayEmpId = user?.empId || 'EMP-000';
  const displayEmail = user?.email || 'user@careconnect.in';
  const displayPhone = user?.phone || '+91 98765 00000';
  const displayAvatar = user?.avatar || displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const [form, setForm] = useState({
    name: displayName,
    email: displayEmail,
    phone: displayPhone,
    department: displayDept,
  });

  const tabs = [
    { id: 'personal',      label: 'Personal Info',  icon: User },
    { id: 'professional',  label: 'Professional',   icon: Briefcase },
    { id: 'security',      label: 'Security',       icon: Shield },
    { id: 'notifications', label: 'Notifications',  icon: Bell },
  ];

  const roleColor = {
    admin: '#6366F1', doctor: '#0EA5E9', nurse: '#10B981',
    reception: '#F59E0B', lab: '#8B5CF6', pharmacy: '#EC4899',
    billing: '#14B8A6', records: '#64748B', emergency: '#EF4444', hr: '#F97316',
  }[roleId] || '#0EA5E9';

  return (
    <div className="page-content page-transition">
      <div className="page-header">
        <div>
          <h1 className="page-title">Profile</h1>
          <div className="page-subtitle">Manage your account and preferences</div>
        </div>
      </div>

      {/* Profile Hero Card */}
      <div className="card" style={{ marginBottom: 24, background: `linear-gradient(135deg, ${roleColor}12, ${roleColor}06)`, borderColor: `${roleColor}30` }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap', padding: '20px 24px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: 88, height: 88, borderRadius: '50%',
              background: `linear-gradient(135deg, ${roleColor}, ${roleColor}99)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, fontWeight: 800, color: 'white',
              boxShadow: `0 8px 24px ${roleColor}40`,
            }}>
              {displayAvatar}
            </div>
            <button
              style={{ position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: '50%', background: roleColor, border: '3px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              onClick={() => toast('Photo upload feature opens here.', 'info')}>
              <Camera size={13} color="white" />
            </button>
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ marginBottom: 6, fontSize: 20, fontWeight: 800 }}>{form.name}</h2>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
              <span style={{ background: roleColor, color: 'white', padding: '3px 12px', borderRadius: 20, fontWeight: 700, fontSize: 12 }}>{displayRole}</span>
              <span style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>🏥 CareConnect District Hospital</span>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>🏢 {displayDept}</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              📧 {form.email} · 📞 {form.phone} · 🪪 {displayEmpId}
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => setEditing(!editing)}>
            <Edit size={14} /> {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'white', borderRadius: 'var(--radius-md)', padding: 6, boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-light)', width: 'fit-content' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', border: 'none', borderRadius: 'var(--radius)', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', background: activeTab === t.id ? roleColor : 'transparent', color: activeTab === t.id ? 'white' : 'var(--text-secondary)', transition: 'var(--transition)' }}>
            <t.icon size={14} />{t.label}
          </button>
        ))}
      </div>

      {/* Personal Info */}
      {activeTab === 'personal' && (
        <div className="grid grid-2">
          <div className="card">
            <div className="section-title">Personal Information</div>
            <div style={{ display: 'grid', gap: 14, marginTop: 16 }}>
              {editing ? (
                <>
                  <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                  <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
                  <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                  <div className="form-group"><label className="form-label">Department</label><input className="form-input" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} /></div>
                  <button className="btn btn-primary" onClick={() => { setEditing(false); toast('Profile updated!', 'success'); }}>Save Changes</button>
                </>
              ) : (
                <>
                  <div className="info-row"><span className="info-row-label">Full Name</span><span className="info-row-value">{form.name}</span></div>
                  <div className="info-row"><span className="info-row-label">Email</span><span className="info-row-value">{form.email}</span></div>
                  <div className="info-row"><span className="info-row-label">Phone</span><span className="info-row-value">{form.phone}</span></div>
                  <div className="info-row"><span className="info-row-label">Department</span><span className="info-row-value">{form.department}</span></div>
                  <div className="info-row"><span className="info-row-label">Role</span><span className="info-row-value"><span className="badge" style={{ background: roleColor + '20', color: roleColor }}>{displayRole}</span></span></div>
                  <div className="info-row"><span className="info-row-label">Hospital</span><span className="info-row-value">CareConnect District Hospital</span></div>
                </>
              )}
            </div>
          </div>
          <div className="card">
            <div className="section-title">Activity Summary</div>
            <div style={{ marginTop: 16 }}>
              {details.stats.map((s, i) => (
                <div key={i} className="info-row">
                  <span className="info-row-label">{s.label}</span>
                  <span className="info-row-value" style={{ fontWeight: 700, color: roleColor }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Professional Info */}
      {activeTab === 'professional' && (
        <div className="card" style={{ maxWidth: 600 }}>
          <div className="section-title">Professional Information</div>
          <div style={{ marginTop: 16 }}>
            {[
              { label: 'Employee ID',       value: displayEmpId },
              { label: 'Designation',       value: displayRole },
              { label: 'Department',        value: displayDept },
              { label: 'Hospital',          value: 'CareConnect District Hospital' },
              { label: 'Date of Joining',   value: details.joining },
              { label: 'Qualification',     value: details.qualification },
              { label: 'Registration No.',  value: details.regNo },
            ].map((item, i) => (
              <div key={i} className="info-row">
                <span className="info-row-label">{item.label}</span>
                <span className="info-row-value">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security */}
      {activeTab === 'security' && (
        <div className="card" style={{ maxWidth: 500 }}>
          <div className="section-title">Account Security</div>
          <div style={{ display: 'grid', gap: 14, marginTop: 16 }}>
            <div className="form-group"><label className="form-label">Current Password</label><input className="form-input" type="password" placeholder="••••••••" /></div>
            <div className="form-group"><label className="form-label">New Password</label><input className="form-input" type="password" placeholder="Enter new password" /></div>
            <div className="form-group"><label className="form-label">Confirm New Password</label><input className="form-input" type="password" placeholder="Confirm new password" /></div>
            <button className="btn btn-primary" onClick={() => toast('Password changed successfully!', 'success')}><Lock size={14} /> Change Password</button>
          </div>
          <div className="divider" />
          <div>
            <div className="section-title" style={{ marginBottom: 14 }}>Two-Factor Authentication</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div><div style={{ fontSize: 13, fontWeight: 500 }}>Enable 2FA via OTP</div><div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Add extra security to your account</div></div>
              <button className="btn btn-secondary btn-sm" onClick={() => toast('2FA setup initiated!', 'info')}>Enable</button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications */}
      {activeTab === 'notifications' && (
        <div className="card" style={{ maxWidth: 540 }}>
          <div className="section-title">Notification Preferences</div>
          <div style={{ marginTop: 16 }}>
            {details.notifPrefs.map((pref, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-light)' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{pref.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{pref.desc}</div>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24, cursor: 'pointer', flexShrink: 0 }}>
                  <input type="checkbox" defaultChecked={pref.default} style={{ opacity: 0, width: 0, height: 0 }} onChange={() => toast('Preference saved', 'success')} />
                  <span style={{ position: 'absolute', cursor: 'pointer', inset: 0, background: pref.default ? roleColor : 'var(--border)', borderRadius: 12, transition: 'var(--transition)' }}>
                    <span style={{ position: 'absolute', height: 18, width: 18, left: pref.default ? 22 : 3, bottom: 3, background: 'white', borderRadius: '50%', transition: 'var(--transition)', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }} />
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
