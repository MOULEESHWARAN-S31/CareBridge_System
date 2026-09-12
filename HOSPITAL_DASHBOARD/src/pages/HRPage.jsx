import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Users, UserCheck, Building2, Clock, Calendar, ClipboardList, Search, Plus, Download } from 'lucide-react';
import { DOCTORS, NURSES, DEPARTMENTS } from '../data/mockData';
import { useToast } from '../components/Toast';

// ── Shift schedule data
const SHIFTS = [
  { dept: 'General Medicine', morning: 4, evening: 3, night: 2, total: 9 },
  { dept: 'Surgery',          morning: 3, evening: 2, night: 2, total: 7 },
  { dept: 'ICU',              morning: 3, evening: 3, night: 3, total: 9 },
  { dept: 'Emergency',        morning: 4, evening: 4, night: 4, total: 12 },
  { dept: 'Pediatrics',       morning: 3, evening: 2, night: 1, total: 6 },
  { dept: 'Gynecology',       morning: 3, evening: 2, night: 2, total: 7 },
  { dept: 'Cardiology',       morning: 2, evening: 2, night: 2, total: 6 },
  { dept: 'Neurology',        morning: 2, evening: 2, night: 1, total: 5 },
  { dept: 'Orthopedics',      morning: 2, evening: 1, night: 1, total: 4 },
  { dept: 'Pharmacy',         morning: 3, evening: 2, night: 1, total: 6 },
];

// ── Attendance data
const ATTENDANCE = [
  { id: 'EMP001', name: 'Dr. Priya Sharma',   role: 'Doctor',   dept: 'General Medicine', date: '2026-09-06', in: '08:52', out: '17:10', status: 'Present',  hours: '8h 18m' },
  { id: 'EMP002', name: 'Dr. Arun Raj',       role: 'Doctor',   dept: 'Surgery',          date: '2026-09-06', in: '07:48', out: '16:30', status: 'Present',  hours: '8h 42m' },
  { id: 'EMP003', name: 'Anitha Ravi',        role: 'Nurse',    dept: 'General Ward',     date: '2026-09-06', in: '08:00', out: '14:00', status: 'Present',  hours: '6h 00m' },
  { id: 'EMP004', name: 'Suma Krishnan',      role: 'Nurse',    dept: 'ICU',              date: '2026-09-06', in: '08:05', out: '14:10', status: 'Present',  hours: '6h 05m' },
  { id: 'EMP005', name: 'Rani Pillai',        role: 'Nurse',    dept: 'General Ward',     date: '2026-09-06', in: null,   out: null,    status: 'On Leave', hours: '—' },
  { id: 'EMP006', name: 'Dr. Sunita Rao',     role: 'Doctor',   dept: 'Gynecology',       date: '2026-09-06', in: '07:55', out: null,    status: 'Present',  hours: 'Ongoing' },
  { id: 'EMP007', name: 'Dr. Kavitha Menon',  role: 'Doctor',   dept: 'Pediatrics',       date: '2026-09-06', in: '09:15', out: null,    status: 'Late',     hours: 'Ongoing' },
  { id: 'EMP008', name: 'Pushpa Krishnan',    role: 'Nurse',    dept: 'Orthopedics',      date: '2026-09-06', in: null,   out: null,    status: 'Absent',   hours: '—' },
];

// ── Leave requests data
const LEAVE_REQUESTS = [
  { id: 'LV001', name: 'Rani Pillai',       role: 'Nurse',    dept: 'General Ward', type: 'Sick Leave',   from: '2026-09-06', to: '2026-09-07', days: 2, status: 'Approved',  applied: '2026-09-05' },
  { id: 'LV002', name: 'Pushpa Krishnan',   role: 'Nurse',    dept: 'Orthopedics',  type: 'Casual Leave', from: '2026-09-06', to: '2026-09-06', days: 1, status: 'Pending',   applied: '2026-09-05' },
  { id: 'LV003', name: 'Dr. Ritu Singh',    role: 'Doctor',   dept: 'Neurology',    type: 'Earned Leave', from: '2026-09-10', to: '2026-09-12', days: 3, status: 'Pending',   applied: '2026-09-04' },
  { id: 'LV004', name: 'Dr. Lakshmi Patel', role: 'Doctor',   dept: 'Gen. Med.',    type: 'Maternity',    from: '2026-09-15', to: '2026-12-15', days: 90,status: 'Approved',  applied: '2026-09-01' },
  { id: 'LV005', name: 'Sindhu Raj',        role: 'Nurse',    dept: 'ICU',          type: 'Sick Leave',   from: '2026-09-08', to: '2026-09-08', days: 1, status: 'Rejected',  applied: '2026-09-06' },
];

// ── Staff assignments data
const ASSIGNMENTS = [
  { id: 'ASN001', staff: 'Anitha Ravi',      role: 'Nurse',  from: 'General Ward', to: 'ICU',           startDate: '2026-09-07', endDate: '2026-09-14', reason: 'Staff shortage',    status: 'Active' },
  { id: 'ASN002', staff: 'Dr. Priya Sharma', role: 'Doctor', from: 'General Med.', to: 'Emergency Duty',startDate: '2026-09-06', endDate: '2026-09-06', reason: 'On-call coverage',  status: 'Active' },
  { id: 'ASN003', staff: 'Suma Krishnan',    role: 'Nurse',  from: 'ICU',          to: 'Cardiology',    startDate: '2026-09-08', endDate: '2026-09-20', reason: 'Training rotation', status: 'Pending' },
];

const statusBadge = { Present: 'badge-success', Late: 'badge-warning', Absent: 'badge-danger', 'On Leave': 'badge-info' };
const leaveBadge  = { Approved: 'badge-success', Pending: 'badge-warning', Rejected: 'badge-danger' };

export default function HRPage() {
  const toast = useToast();
  const location = useLocation();
  const [search, setSearch] = useState('');

  const path = location.pathname;
  const isDoctors     = path.endsWith('/doctors');
  const isNurses      = path.endsWith('/nurses');
  const isDepts       = path.endsWith('/departments');
  const isShifts      = path.endsWith('/shifts');
  const isAttendance  = path.endsWith('/attendance');
  const isLeave       = path.endsWith('/leave');
  const isAssignments = path.endsWith('/assignments');

  // ── DOCTORS VIEW
  if (isDoctors) {
    const filtered = DOCTORS.filter(d =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.department.toLowerCase().includes(search.toLowerCase())
    );
    return (
      <div className="page-content page-transition">
        <div className="page-header">
          <div><div className="page-title">Doctors Directory</div><div className="page-subtitle">{DOCTORS.length} doctors · {DOCTORS.filter(d=>d.available).length} available today</div></div>
          <button className="btn btn-primary" onClick={() => toast('Add doctor form opened.', 'info')}><Plus size={15}/> Add Doctor</button>
        </div>
        <div className="card" style={{ marginBottom: 16, padding: '12px 16px' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Search size={15} color="var(--text-muted)" />
            <input style={{ border:'none', outline:'none', flex:1, fontSize:13, fontFamily:'inherit', background:'transparent' }}
              placeholder="Search by name or department..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-container">
            <table className="table">
              <thead><tr><th>ID</th><th>Name</th><th>Department</th><th>Specialization</th><th>Qualification</th><th>Experience</th><th>Patients</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map(d => (
                  <tr key={d.id}>
                    <td style={{ fontFamily:'monospace', fontSize:11, color:'var(--text-muted)' }}>{d.id}</td>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ width:34, height:34, borderRadius:10, background:'var(--primary-light)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:12, color:'var(--primary-dark)', flexShrink:0 }}>
                          {d.name.replace('Dr. ','').split(' ').map(n=>n[0]).join('').slice(0,2)}
                        </div>
                        <div><div style={{ fontWeight:600, fontSize:13 }}>{d.name}</div><div style={{ fontSize:11, color:'var(--text-muted)' }}>{d.phone}</div></div>
                      </div>
                    </td>
                    <td style={{ fontSize:12 }}>{d.department}</td>
                    <td style={{ fontSize:12, color:'var(--text-muted)' }}>{d.specialization}</td>
                    <td style={{ fontSize:12 }}>{d.qualification}</td>
                    <td style={{ fontSize:12 }}>{d.experience}</td>
                    <td style={{ fontWeight:700, color:'var(--primary)' }}>{d.patients.toLocaleString()}</td>
                    <td><span className={`badge ${d.available ? 'badge-success' : 'badge-grey'}`}>{d.available ? 'Available' : 'Unavailable'}</span></td>
                    <td><div style={{ display:'flex', gap:4 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => toast(`Viewing ${d.name}'s profile...`,'info')}>View</button>
                      <button className="btn btn-secondary btn-sm" onClick={() => toast('Edit form opened.','info')}>Edit</button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ── NURSES VIEW
  if (isNurses) {
    const filtered = NURSES.filter(n =>
      n.name.toLowerCase().includes(search.toLowerCase()) ||
      n.ward.toLowerCase().includes(search.toLowerCase())
    );
    return (
      <div className="page-content page-transition">
        <div className="page-header">
          <div><div className="page-title">Nursing Staff</div><div className="page-subtitle">{NURSES.length} nurses · {NURSES.filter(n=>n.status==='On Duty').length} on duty</div></div>
          <button className="btn btn-primary" onClick={() => toast('Add nurse form opened.','info')}><Plus size={15}/> Add Nurse</button>
        </div>
        <div className="card" style={{ marginBottom:16, padding:'12px 16px' }}>
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <Search size={15} color="var(--text-muted)" />
            <input style={{ border:'none', outline:'none', flex:1, fontSize:13, fontFamily:'inherit', background:'transparent' }}
              placeholder="Search by name or ward..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="card" style={{ padding:0, overflow:'hidden' }}>
          <div className="table-container">
            <table className="table">
              <thead><tr><th>ID</th><th>Name</th><th>Ward</th><th>Shift</th><th>Assigned Patients</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map(n => (
                  <tr key={n.id}>
                    <td style={{ fontFamily:'monospace', fontSize:11, color:'var(--text-muted)' }}>{n.id}</td>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ width:34, height:34, borderRadius:10, background:'#D1FAE5', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:12, color:'#065F46', flexShrink:0 }}>
                          {n.name.split(' ').map(x=>x[0]).join('').slice(0,2)}
                        </div>
                        <div style={{ fontWeight:600, fontSize:13 }}>{n.name}</div>
                      </div>
                    </td>
                    <td style={{ fontSize:12 }}>{n.ward}</td>
                    <td>
                      <span style={{ fontSize:11, fontWeight:600, padding:'3px 8px', borderRadius:8,
                        background: n.shift==='Morning'?'#E0F2FE': n.shift==='Evening'?'#EDE9FE':'#1E293B',
                        color:      n.shift==='Morning'?'#0369A1': n.shift==='Evening'?'#4C1D95':'#F1F5F9' }}>
                        {n.shift}
                      </span>
                    </td>
                    <td style={{ fontWeight:700, color:'var(--primary)' }}>{n.patients}</td>
                    <td><span className={`badge ${n.status==='On Duty'?'badge-success':'badge-warning'}`}>{n.status}</span></td>
                    <td><div style={{ display:'flex', gap:4 }}>
                      <button className="btn btn-ghost btn-sm" onClick={()=>toast('Viewing nurse profile...','info')}>View</button>
                      <button className="btn btn-secondary btn-sm" onClick={()=>toast('Reassigning nurse...','info')}>Reassign</button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ── DEPARTMENTS VIEW
  if (isDepts) {
    return (
      <div className="page-content page-transition">
        <div className="page-header">
          <div><div className="page-title">Departments</div><div className="page-subtitle">{DEPARTMENTS.length} departments · CareConnect District Hospital</div></div>
          <button className="btn btn-primary" onClick={()=>toast('Department form opened.','info')}><Plus size={15}/> Add Department</button>
        </div>
        <div className="grid grid-2" style={{ marginBottom:24 }}>
          {DEPARTMENTS.map(dept => {
            const deptDoctors = DOCTORS.filter(d => d.department === dept.name).length;
            const deptNurses  = NURSES.filter(n => n.ward === dept.name || n.ward.includes(dept.name.split(' ')[0])).length;
            return (
              <div key={dept.id} className="card" style={{ borderLeft:`4px solid ${dept.color}`, padding:'20px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                  <div>
                    <div style={{ fontSize:15, fontWeight:800, color:'var(--text-primary)', marginBottom:2 }}>{dept.name}</div>
                    <div style={{ fontSize:12, color:'var(--text-muted)' }}>Head: {dept.head}</div>
                  </div>
                  <span style={{ background:dept.color+'20', color:dept.color, fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:20 }}>{dept.id}</span>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginTop:8 }}>
                  {[
                    { label:'Beds',    value: dept.beds || '—', icon:'🛏' },
                    { label:'Doctors', value: deptDoctors,       icon:'👨‍⚕️' },
                    { label:'Nurses',  value: deptNurses || '—', icon:'👩‍⚕️' },
                  ].map((s,i) => (
                    <div key={i} style={{ textAlign:'center', padding:'10px', background:'var(--bg)', borderRadius:8 }}>
                      <div style={{ fontSize:20, marginBottom:2 }}>{s.icon}</div>
                      <div style={{ fontWeight:800, fontSize:16, color:'var(--text-primary)' }}>{s.value}</div>
                      <div style={{ fontSize:11, color:'var(--text-muted)' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── SHIFTS VIEW
  if (isShifts) {
    return (
      <div className="page-content page-transition">
        <div className="page-header">
          <div><div className="page-title">Shift Schedule</div><div className="page-subtitle">Current shift assignments by department</div></div>
          <button className="btn btn-primary" onClick={()=>toast('Shift assignment saved.','success')}><Clock size={15}/> Edit Shifts</button>
        </div>
        <div className="grid grid-3" style={{ marginBottom:24 }}>
          {[
            { label:'Morning (8AM–2PM)',  value: NURSES.filter(n=>n.shift==='Morning').length + ' nurses', color:'#0EA5E9', bg:'#E0F2FE', icon:'🌅' },
            { label:'Evening (2PM–8PM)',  value: NURSES.filter(n=>n.shift==='Evening').length + ' nurses', color:'#F97316', bg:'#FFEDD5', icon:'🌆' },
            { label:'Night (8PM–8AM)',    value: NURSES.filter(n=>n.shift==='Night').length + ' nurses',   color:'#6366F1', bg:'#EDE9FE', icon:'🌙' },
          ].map((s,i) => (
            <div key={i} className="stat-card" style={{ borderTop:`3px solid ${s.color}` }}>
              <div style={{ fontSize:28, marginBottom:6 }}>{s.icon}</div>
              <div style={{ fontWeight:800, fontSize:18, color:s.color }}>{s.value}</div>
              <div style={{ fontSize:12, color:'var(--text-muted)', fontWeight:600 }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div className="card" style={{ padding:0, overflow:'hidden' }}>
          <div className="table-container">
            <table className="table">
              <thead><tr><th>Department</th><th>🌅 Morning</th><th>🌆 Evening</th><th>🌙 Night</th><th>Total Staff</th><th>Coverage</th></tr></thead>
              <tbody>
                {SHIFTS.map((s,i) => (
                  <tr key={i}>
                    <td style={{ fontWeight:600, fontSize:13 }}>{s.dept}</td>
                    <td><span style={{ fontWeight:700, color:'#0EA5E9' }}>{s.morning}</span><span style={{ fontSize:11, color:'var(--text-muted)' }}> staff</span></td>
                    <td><span style={{ fontWeight:700, color:'#F97316' }}>{s.evening}</span><span style={{ fontSize:11, color:'var(--text-muted)' }}> staff</span></td>
                    <td><span style={{ fontWeight:700, color:'#6366F1' }}>{s.night}</span><span style={{ fontSize:11, color:'var(--text-muted)' }}> staff</span></td>
                    <td style={{ fontWeight:800, color:'var(--text-primary)' }}>{s.total}</td>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <div style={{ flex:1, height:6, background:'var(--border-light)', borderRadius:3 }}>
                          <div style={{ width:`${Math.min(100, (s.total/15)*100)}%`, height:'100%', background:'linear-gradient(90deg,var(--primary),var(--secondary))', borderRadius:3 }} />
                        </div>
                        <span style={{ fontSize:11, color:'var(--text-muted)', minWidth:30 }}>{Math.round((s.total/15)*100)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ── ATTENDANCE VIEW
  if (isAttendance) {
    return (
      <div className="page-content page-transition">
        <div className="page-header">
          <div><div className="page-title">Attendance</div><div className="page-subtitle">Today — 6 September 2026</div></div>
          <button className="btn btn-ghost" onClick={()=>toast('Attendance report downloaded.','success')}><Download size={15}/> Export</button>
        </div>
        <div className="grid grid-4" style={{ marginBottom:24 }}>
          {[
            { label:'Present',  value: ATTENDANCE.filter(a=>a.status==='Present').length,   color:'#10B981', bg:'#D1FAE5' },
            { label:'Late',     value: ATTENDANCE.filter(a=>a.status==='Late').length,       color:'#F59E0B', bg:'#FEF3C7' },
            { label:'Absent',   value: ATTENDANCE.filter(a=>a.status==='Absent').length,     color:'#EF4444', bg:'#FEE2E2' },
            { label:'On Leave', value: ATTENDANCE.filter(a=>a.status==='On Leave').length,   color:'#6366F1', bg:'#EDE9FE' },
          ].map((s,i) => (
            <div key={i} className="stat-card">
              <div style={{ fontSize:28, fontWeight:800, color:s.color, marginBottom:4 }}>{s.value}</div>
              <div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div className="card" style={{ padding:0, overflow:'hidden' }}>
          <div className="table-container">
            <table className="table">
              <thead><tr><th>Emp ID</th><th>Name</th><th>Role</th><th>Department</th><th>Check-In</th><th>Check-Out</th><th>Hours</th><th>Status</th></tr></thead>
              <tbody>
                {ATTENDANCE.map(a => (
                  <tr key={a.id}>
                    <td style={{ fontFamily:'monospace', fontSize:11, color:'var(--text-muted)' }}>{a.id}</td>
                    <td style={{ fontWeight:600, fontSize:13 }}>{a.name}</td>
                    <td style={{ fontSize:12 }}>{a.role}</td>
                    <td style={{ fontSize:12, color:'var(--text-muted)' }}>{a.dept}</td>
                    <td style={{ fontSize:13, fontWeight:600, color:'#10B981' }}>{a.in || '—'}</td>
                    <td style={{ fontSize:13, color:'var(--text-muted)' }}>{a.out || '—'}</td>
                    <td style={{ fontSize:13, fontWeight:600 }}>{a.hours}</td>
                    <td><span className={`badge ${statusBadge[a.status]}`}>{a.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ── LEAVE VIEW
  if (isLeave) {
    return (
      <div className="page-content page-transition">
        <div className="page-header">
          <div><div className="page-title">Leave Management</div><div className="page-subtitle">{LEAVE_REQUESTS.length} requests · {LEAVE_REQUESTS.filter(l=>l.status==='Pending').length} pending approval</div></div>
          <button className="btn btn-primary" onClick={()=>toast('Leave request form opened.','info')}><Plus size={15}/> Add Request</button>
        </div>
        <div className="grid grid-3" style={{ marginBottom:24 }}>
          {[
            { label:'Approved', value: LEAVE_REQUESTS.filter(l=>l.status==='Approved').length, color:'#10B981', bg:'#D1FAE5' },
            { label:'Pending',  value: LEAVE_REQUESTS.filter(l=>l.status==='Pending').length,  color:'#F59E0B', bg:'#FEF3C7' },
            { label:'Rejected', value: LEAVE_REQUESTS.filter(l=>l.status==='Rejected').length, color:'#EF4444', bg:'#FEE2E2' },
          ].map((s,i) => (
            <div key={i} className="stat-card">
              <div style={{ fontSize:28, fontWeight:800, color:s.color, marginBottom:4 }}>{s.value}</div>
              <div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div className="card" style={{ padding:0, overflow:'hidden' }}>
          <div className="table-container">
            <table className="table">
              <thead><tr><th>ID</th><th>Staff Name</th><th>Role</th><th>Leave Type</th><th>From</th><th>To</th><th>Days</th><th>Applied</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {LEAVE_REQUESTS.map(l => (
                  <tr key={l.id}>
                    <td style={{ fontFamily:'monospace', fontSize:11, color:'var(--text-muted)' }}>{l.id}</td>
                    <td style={{ fontWeight:600, fontSize:13 }}>{l.name}</td>
                    <td style={{ fontSize:12 }}>{l.role}</td>
                    <td><span className="tag">{l.type}</span></td>
                    <td style={{ fontSize:12 }}>{l.from}</td>
                    <td style={{ fontSize:12 }}>{l.to}</td>
                    <td style={{ fontWeight:700, color:'var(--primary)' }}>{l.days}</td>
                    <td style={{ fontSize:12, color:'var(--text-muted)' }}>{l.applied}</td>
                    <td><span className={`badge ${leaveBadge[l.status]}`}>{l.status}</span></td>
                    <td><div style={{ display:'flex', gap:4 }}>
                      {l.status === 'Pending' && <>
                        <button className="btn btn-primary btn-sm" onClick={()=>toast('Leave approved!','success')}>Approve</button>
                        <button className="btn btn-ghost btn-sm" onClick={()=>toast('Leave rejected.','error')}>Reject</button>
                      </>}
                      {l.status !== 'Pending' && <button className="btn btn-ghost btn-sm" onClick={()=>toast('Viewing details...','info')}>View</button>}
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ── ASSIGNMENTS VIEW
  if (isAssignments) {
    return (
      <div className="page-content page-transition">
        <div className="page-header">
          <div><div className="page-title">Staff Assignments</div><div className="page-subtitle">{ASSIGNMENTS.length} active assignments</div></div>
          <button className="btn btn-primary" onClick={()=>toast('Assignment form opened.','info')}><Plus size={15}/> New Assignment</button>
        </div>
        <div className="card" style={{ padding:0, overflow:'hidden', marginBottom:24 }}>
          <div className="table-container">
            <table className="table">
              <thead><tr><th>ID</th><th>Staff Member</th><th>Role</th><th>From Dept</th><th>To Dept</th><th>Start Date</th><th>End Date</th><th>Reason</th><th>Status</th></tr></thead>
              <tbody>
                {ASSIGNMENTS.map(a => (
                  <tr key={a.id}>
                    <td style={{ fontFamily:'monospace', fontSize:11, color:'var(--text-muted)' }}>{a.id}</td>
                    <td style={{ fontWeight:600, fontSize:13 }}>{a.staff}</td>
                    <td style={{ fontSize:12 }}>{a.role}</td>
                    <td style={{ fontSize:12, color:'var(--text-muted)' }}>{a.from}</td>
                    <td style={{ fontWeight:600, color:'var(--primary)', fontSize:13 }}>{a.to}</td>
                    <td style={{ fontSize:12 }}>{a.startDate}</td>
                    <td style={{ fontSize:12 }}>{a.endDate}</td>
                    <td style={{ fontSize:12, color:'var(--text-muted)' }}>{a.reason}</td>
                    <td><span className={`badge ${a.status==='Active'?'badge-success':'badge-warning'}`}>{a.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ── DEFAULT: All Employees (matches /employees route)
  const allStaff = [
    ...DOCTORS.map(d => ({ id: d.id, name: d.name, role: 'Doctor', dept: d.department, status: d.available ? 'On Duty' : 'Unavailable', shift: 'Morning (8AM–2PM)', phone: d.phone, qualification: d.qualification })),
    ...NURSES.map(n  => ({ id: n.id, name: n.name, role: 'Nurse',  dept: n.ward,        status: n.status,                              shift: n.shift,             phone: '—',       qualification: 'B.Sc Nursing' })),
  ];
  const filtered = allStaff.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.dept.toLowerCase().includes(search.toLowerCase()) ||
    s.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-content page-transition">
      <div className="page-header">
        <div><div className="page-title">All Employees</div><div className="page-subtitle">{allStaff.length} staff members · {allStaff.filter(s=>s.status==='On Duty'||s.status==='Unavailable'?false:s.status==='On Duty').length} on duty</div></div>
        <div style={{ display:'flex', gap:10 }}>
          <button className="btn btn-ghost" onClick={()=>toast('Exporting staff list...','success')}><Download size={15}/> Export</button>
          <button className="btn btn-primary" onClick={()=>toast('Add staff form opened.','info')}><Plus size={15}/> Add Staff</button>
        </div>
      </div>
      <div className="card" style={{ marginBottom:16, padding:'12px 16px' }}>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          <Search size={15} color="var(--text-muted)" />
          <input style={{ border:'none', outline:'none', flex:1, fontSize:13, fontFamily:'inherit', background:'transparent' }}
            placeholder="Search by name, department or role..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="card" style={{ padding:0, overflow:'hidden' }}>
        <div className="table-container">
          <table className="table">
            <thead><tr><th>ID</th><th>Name</th><th>Role</th><th>Department</th><th>Qualification</th><th>Shift</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td style={{ fontFamily:'monospace', fontSize:11, color:'var(--text-muted)' }}>{s.id}</td>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:32, height:32, borderRadius:9, background: s.role==='Doctor'?'var(--primary-light)':'#D1FAE5', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:11, color: s.role==='Doctor'?'var(--primary-dark)':'#065F46', flexShrink:0 }}>
                        {s.name.replace('Dr. ','').split(' ').map(x=>x[0]).join('').slice(0,2)}
                      </div>
                      <span style={{ fontWeight:600, fontSize:13 }}>{s.name}</span>
                    </div>
                  </td>
                  <td><span className={`badge ${s.role==='Doctor'?'badge-primary':'badge-success'}`}>{s.role}</span></td>
                  <td style={{ fontSize:12 }}>{s.dept}</td>
                  <td style={{ fontSize:12, color:'var(--text-muted)' }}>{s.qualification}</td>
                  <td style={{ fontSize:12 }}>{s.shift}</td>
                  <td><span className={`badge ${s.status==='On Duty'||s.status==='Available'?'badge-success': s.status==='On Leave'?'badge-warning':'badge-grey'}`}>{s.status}</span></td>
                  <td><div style={{ display:'flex', gap:4 }}>
                    <button className="btn btn-ghost btn-sm" onClick={()=>toast(`Viewing ${s.name}...`,'info')}>View</button>
                    <button className="btn btn-secondary btn-sm" onClick={()=>toast('Edit form opened.','info')}>Edit</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
