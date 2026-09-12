import { useParams, useNavigate } from 'react-router-dom';
import { useRoleNav } from '../hooks/useRoleNav';
import { ArrowLeft, Star, Clock, Phone, Video, Calendar, BookOpen, Globe, Award } from 'lucide-react';
import { doctors } from '../data/mockData';
import { useToast } from '../components/Toast';

export default function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { path } = useRoleNav();
  const toast = useToast();
  const doc = doctors.find(d => d.id === id) || doctors[0];

  const initials = doc.name.replace('Dr. ', '').split(' ').map(n => n[0]).join('').slice(0, 2);

  const slots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'];
  const bookedSlots = ['10:00 AM', '03:00 PM'];

  return (
    <div className="page-content page-transition">
      <button className="btn btn-ghost btn-sm" style={{ marginBottom: 20 }} onClick={() => navigate(path('doctors'))}>
        <ArrowLeft size={15} /> Back to Doctors
      </button>

      <div className="grid grid-2" style={{ alignItems: 'start' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Profile Card */}
          <div className="card" style={{ background: 'linear-gradient(135deg, #F0F9FF, #E0F2FE)' }}>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: 100, height: 100, borderRadius: 24, background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 800, color: 'white', boxShadow: '0 8px 24px rgba(14,165,233,0.35)' }}>
                  {initials}
                </div>
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: 20, height: 20, borderRadius: '50%', background: doc.status === 'online' ? 'var(--success)' : doc.status === 'busy' ? 'var(--warning)' : 'var(--text-muted)', border: '3px solid white' }} />
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ marginBottom: 4 }}>{doc.name}</h2>
                <div style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 15 }}>{doc.specialization}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>{doc.department} · {doc.experience}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
                  {[1,2,3,4,5].map(i => <Star key={i} size={14} fill={i <= Math.floor(doc.rating) ? '#F59E0B' : '#E2E8F0'} color={i <= Math.floor(doc.rating) ? '#F59E0B' : '#E2E8F0'} />)}
                  <span style={{ fontSize: 13, fontWeight: 700, marginLeft: 4 }}>{doc.rating}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>({doc.patients.toLocaleString()} patients)</span>
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                  <button className="btn btn-primary btn-sm" onClick={() => { toast('Booking appointment...', 'success'); navigate(path('appointments')); }}>
                    <Calendar size={14} /> Book Appointment
                  </button>
                  <button
                    className={`btn btn-sm ${doc.status !== 'offline' ? 'btn-secondary' : 'btn-ghost'}`}
                    onClick={() => doc.status !== 'offline' ? navigate(path('consultations')) : toast('Doctor is offline', 'warning')}
                  >
                    <Video size={14} /> Teleconsult
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="card">
            <div className="section-title">Professional Details</div>
            <div className="info-row"><span className="info-row-label"><Award size={13} style={{ marginRight: 4 }} />Education</span><span className="info-row-value" style={{ fontSize: 12 }}>{doc.education}</span></div>
            <div className="info-row"><span className="info-row-label"><Clock size={13} style={{ marginRight: 4 }} />Timings</span><span className="info-row-value" style={{ fontSize: 12 }}>{doc.timings}</span></div>
            <div className="info-row"><span className="info-row-label"><Phone size={13} style={{ marginRight: 4 }} />Phone</span><span className="info-row-value">{doc.phone}</span></div>
            <div className="info-row"><span className="info-row-label">Consultation Fee</span><span className="info-row-value" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: 16 }}>{doc.fee}</span></div>
            <div className="info-row" style={{ border: 'none' }}>
              <span className="info-row-label"><Globe size={13} style={{ marginRight: 4 }} />Languages</span>
              <div style={{ display: 'flex', gap: 6 }}>
                {doc.languages.map(l => <span key={l} className="tag">{l}</span>)}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Appointment Booking */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <div className="section-title">Book Appointment</div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 10 }}>Select Date</div>
              <input type="date" className="form-input" defaultValue="2026-09-05" />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 10 }}>Available Slots</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {slots.map(s => (
                  <button
                    key={s}
                    disabled={bookedSlots.includes(s)}
                    onClick={() => toast(`Slot ${s} selected. Confirm to book.`, 'success')}
                    style={{
                      padding: '9px 6px', border: '1.5px solid', borderRadius: 'var(--radius-sm)',
                      fontSize: 12, fontWeight: 500, cursor: bookedSlots.includes(s) ? 'not-allowed' : 'pointer',
                      fontFamily: 'inherit', transition: 'var(--transition)',
                      background: bookedSlots.includes(s) ? 'var(--border-light)' : 'var(--primary-light)',
                      color: bookedSlots.includes(s) ? 'var(--text-muted)' : 'var(--primary-dark)',
                      borderColor: bookedSlots.includes(s) ? 'var(--border)' : 'rgba(14,165,233,0.3)',
                      opacity: bookedSlots.includes(s) ? 0.5 : 1,
                    }}
                  >{bookedSlots.includes(s) ? '✕ ' : ''}{s}</button>
                ))}
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>Consultation Type</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {['In-Person', 'Teleconsultation'].map(t => (
                  <button key={t} className="filter-tab active" style={{ flex: 1, justifyContent: 'center' }}>{t}</button>
                ))}
              </div>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}
              onClick={() => { toast('Appointment booked successfully!', 'success'); navigate(path('appointments')); }}>
              Confirm Booking
            </button>
          </div>

          {/* Reviews */}
          <div className="card">
            <div className="section-title">Patient Reviews</div>
            {[
              { patient: 'Ravi Kumar', rating: 5, comment: 'Excellent doctor. Very thorough and caring.' },
              { patient: 'Meena Devi', rating: 4, comment: 'Very professional, explained everything clearly.' },
              { patient: 'Suresh Kumar', rating: 5, comment: 'Best doctor I have visited. Highly recommend.' },
            ].map((r, i) => (
              <div key={i} style={{ padding: '12px 0', borderBottom: i < 2 ? '1px solid var(--border-light)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{r.patient}</span>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {[1,2,3,4,5].map(i => <Star key={i} size={12} fill={i <= r.rating ? '#F59E0B' : '#E2E8F0'} color={i <= r.rating ? '#F59E0B' : '#E2E8F0'} />)}
                  </div>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
