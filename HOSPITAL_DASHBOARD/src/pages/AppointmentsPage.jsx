import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoleNav } from '../hooks/useRoleNav';
import { Calendar, Plus, Clock, Video, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { appointments } from '../data/mockData';
import { useToast } from '../components/Toast';

const tabs = ["Today's", 'Upcoming', 'Completed', 'Cancelled'];
const typeIcon = { 'In-Person': '🏥', 'Consultation': '🩺', 'Teleconsultation': '💻', 'Emergency': '🚨', 'Follow-up': '🔄', 'Review': '📋', 'New Patient': '👤' };
const statusColor = { 'Checked-in': 'badge-success', 'Waiting': 'badge-warning', 'Scheduled': 'badge-primary', 'In Consultation': 'badge-info', 'Cancelled': 'badge-danger', 'Completed': 'badge-success' };

export default function AppointmentsPage() {
  const navigate = useNavigate();
  const { path } = useRoleNav();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState("Today's");
  const [showModal, setShowModal] = useState(false);

  const filtered = appointments.filter(a => {
    if (activeTab === "Today's") return a.date === '2026-09-05';
    if (activeTab === 'Upcoming') return a.date > '2026-09-05';
    if (activeTab === 'Completed') return a.status === 'Completed';
    if (activeTab === 'Cancelled') return a.status === 'Cancelled';
    return true;
  });

  return (
    <div className="page-content page-transition">
      <div className="page-header">
        <div>
          <h1 className="page-title">Appointments</h1>
          <div className="page-subtitle">{appointments.length} total appointments</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Book Appointment
        </button>
      </div>

      {/* Mini Calendar */}
      <div className="card" style={{ marginBottom: 20 }}>
        <MiniCalendar />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'white', borderRadius: 'var(--radius-md)', padding: 6, boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-light)', width: 'fit-content' }}>
        {tabs.map(t => (
          <button key={t}
            onClick={() => setActiveTab(t)}
            style={{ padding: '8px 18px', border: 'none', borderRadius: 'var(--radius)', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', background: activeTab === t ? 'var(--primary)' : 'transparent', color: activeTab === t ? 'white' : 'var(--text-secondary)', transition: 'var(--transition)', whiteSpace: 'nowrap' }}
          >{t}</button>
        ))}
      </div>

      {/* Appointment Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.length === 0 ? (
          <div className="card"><div className="empty-state"><div style={{ fontSize: 48 }}>📅</div><h3>No {activeTab} Appointments</h3><p>No appointments found for this filter.</p></div></div>
        ) : filtered.map(apt => (
          <div key={apt.id} className="appointment-card card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              {/* Time */}
              <div style={{ textAlign: 'center', minWidth: 70, padding: '8px', background: 'var(--primary-light)', borderRadius: 'var(--radius)', flexShrink: 0 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>TIME</div>
                <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--primary-dark)' }}>{apt.time}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{apt.date}</div>
              </div>

              {/* Patient */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 200 }}>
                <div className="avatar avatar-md" style={{ background: 'linear-gradient(135deg, var(--primary-light), var(--secondary-light))', color: 'var(--primary-dark)', fontWeight: 700 }}>
                  {apt.patient.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{apt.patient}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>with {apt.doctor}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>{apt.notes}</div>
                </div>
              </div>

              {/* Type & Status */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                <span style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)', background: 'var(--bg)', padding: '4px 10px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-light)' }}>
                  {typeIcon[apt.type]} {apt.type}
                </span>
                <span className={`badge ${statusColor[apt.status]}`}>{apt.status}</span>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8 }}>
                {apt.status === 'Confirmed' && (
                  <>
                    {apt.type === 'Teleconsultation' && (
                      <button className="btn btn-primary btn-sm" onClick={() => navigate(path('consultations'))}>
                        <Video size={13} /> Start
                      </button>
                    )}
                    <button className="btn btn-ghost btn-sm" onClick={() => toast('Appointment rescheduled!', 'info')}>Reschedule</button>
                    <button className="btn btn-danger btn-sm" onClick={() => toast('Appointment cancelled.', 'warning')}>Cancel</button>
                  </>
                )}
                {apt.status === 'Pending' && (
                  <button className="btn btn-secondary btn-sm" onClick={() => toast('Appointment confirmed!', 'success')}>Confirm</button>
                )}
                <button className="btn btn-ghost btn-sm" onClick={() => navigate(path(`patients/${apt.patientId}`))}>
                  <User size={13} /> Patient
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && <BookModal onClose={() => setShowModal(false)} onSave={() => { setShowModal(false); toast('Appointment booked!', 'success'); }} />}

      <style>{`
        .appointment-card { transition: var(--transition); }
        .appointment-card:hover { box-shadow: var(--shadow-md); }
      `}</style>
    </div>
  );
}

function MiniCalendar() {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [selected, setSelected] = useState(today.getDate());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const apptDates = [4, 5, 6, 7]; // mock appointment days

  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <div style={{ minWidth: 280 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <button className="btn btn-ghost btn-icon" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}><ChevronLeft size={16} /></button>
          <span style={{ fontWeight: 600, fontSize: 14 }}>{monthName}</span>
          <button className="btn btn-ghost btn-icon" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}><ChevronRight size={16} /></button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, textAlign: 'center' }}>
          {['S','M','T','W','T','F','S'].map((d, i) => <div key={i} style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', padding: '4px 0' }}>{d}</div>)}
          {Array(firstDay).fill(null).map((_, i) => <div key={i} />)}
          {Array(daysInMonth).fill(null).map((_, i) => {
            const day = i + 1;
            const isToday = day === today.getDate() && currentDate.getMonth() === today.getMonth();
            const isSelected = day === selected;
            const hasAppt = apptDates.includes(day);
            return (
              <div key={i} onClick={() => setSelected(day)}
                style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, cursor: 'pointer', margin: '0 auto',
                  background: isSelected ? 'var(--primary)' : isToday ? 'var(--primary-light)' : 'transparent',
                  color: isSelected ? 'white' : isToday ? 'var(--primary)' : 'var(--text-primary)',
                  fontWeight: isToday || isSelected ? 700 : 400,
                  position: 'relative', transition: 'var(--transition)',
                }}>
                {day}
                {hasAppt && !isSelected && <span style={{ position: 'absolute', bottom: 2, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: '50%', background: 'var(--primary)' }} />}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10 }}>Appointments on Sep {selected}</div>
        {appointments.filter(a => parseInt(a.date.split('-')[2]) === selected).slice(0, 3).map((a, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border-light)', alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--primary)', minWidth: 65 }}>{a.time}</span>
            <span style={{ fontSize: 12, flex: 1 }}>{a.patient}</span>
            <span className={`badge ${statusColor[a.status]}`} style={{ fontSize: 10 }}>{a.status}</span>
          </div>
        ))}
        {appointments.filter(a => parseInt(a.date.split('-')[2]) === selected).length === 0 && (
          <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>No appointments on this day</div>
        )}
      </div>
    </div>
  );
}

function BookModal({ onClose, onSave }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header"><h3>Book New Appointment</h3><button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button></div>
        <div className="modal-body">
          <div style={{ display: 'grid', gap: 14 }}>
            <div className="form-group"><label className="form-label">Patient</label><select className="form-select"><option>Ravi Kumar – P1001</option><option>Meena Devi – P1002</option><option>Arun Prakash – P1003</option></select></div>
            <div className="form-group"><label className="form-label">Doctor</label><select className="form-select"><option>Dr. Priya Kumar – General Physician</option><option>Dr. Arun Raj – Cardiologist</option></select></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group"><label className="form-label">Date</label><input className="form-input" type="date" defaultValue="2026-09-05" /></div>
              <div className="form-group"><label className="form-label">Time</label><select className="form-select"><option>09:00 AM</option><option>11:00 AM</option><option>02:00 PM</option></select></div>
            </div>
            <div className="form-group"><label className="form-label">Type</label><select className="form-select"><option>In-Person</option><option>Teleconsultation</option><option>Emergency</option></select></div>
          </div>
        </div>
        <div className="modal-footer"><button className="btn btn-ghost" onClick={onClose}>Cancel</button><button className="btn btn-primary" onClick={onSave}>Book Appointment</button></div>
      </div>
    </div>
  );
}
