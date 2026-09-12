import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, X, Users, Stethoscope, Calendar, ArrowLeftRight,
  Pill, Bed, Building2, ChevronRight, ShieldCheck
} from 'lucide-react';
import {
  PATIENTS, DOCTORS, APPOINTMENTS, REFERRALS,
  MEDICINES, WARD_BED_MAP, DEPARTMENTS
} from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { ROLE_ROUTES } from '../auth/accounts';

export default function GlobalSearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const base = ROLE_ROUTES[user?.roleId] || '/admin/dashboard';

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  // Search categories
  const matchedPatients = q
    ? PATIENTS.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        (p.abhaId && p.abhaId.toLowerCase().includes(q))
      ).slice(0, 5)
    : [];

  const matchedDoctors = q
    ? DOCTORS.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.specialization.toLowerCase().includes(q) ||
        d.department.toLowerCase().includes(q)
      ).slice(0, 5)
    : [];

  const matchedAppointments = q
    ? APPOINTMENTS.filter(a =>
        a.patient.toLowerCase().includes(q) ||
        a.doctor.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q) ||
        (a.token && a.token.toLowerCase().includes(q))
      ).slice(0, 4)
    : [];

  const matchedReferrals = q
    ? REFERRALS.filter(r =>
        r.patient.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.toFacility.toLowerCase().includes(q)
      ).slice(0, 4)
    : [];

  const matchedMedicines = q
    ? MEDICINES.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q)
      ).slice(0, 4)
    : [];

  const matchedBeds = q
    ? WARD_BED_MAP.filter(b =>
        b.bedNo.toLowerCase().includes(q) ||
        b.ward.toLowerCase().includes(q) ||
        (b.patient && b.patient.toLowerCase().includes(q))
      ).slice(0, 4)
    : [];

  const matchedDepartments = q
    ? DEPARTMENTS.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.head.toLowerCase().includes(q)
      ).slice(0, 4)
    : [];

  const totalMatches =
    matchedPatients.length +
    matchedDoctors.length +
    matchedAppointments.length +
    matchedReferrals.length +
    matchedMedicines.length +
    matchedBeds.length +
    matchedDepartments.length;

  function handleSelect(path) {
    onClose();
    navigate(path);
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '80px',
        animation: 'fadeIn 0.15s ease-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '680px',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          border: '1px solid #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '80vh'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Search size={20} color="#0EA5E9" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search patients, doctors, appointments, referrals, medicines, beds..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '15px',
              fontWeight: 500,
              color: '#0F172A',
              background: 'transparent'
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{ background: '#F1F5F9', border: 'none', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <X size={14} color="#64748B" />
            </button>
          )}
          <span style={{ fontSize: '11px', background: '#F1F5F9', color: '#64748B', padding: '3px 7px', borderRadius: 6, fontWeight: 600, border: '1px solid #E2E8F0' }}>ESC</span>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: 6, padding: '10px 20px', borderBottom: '1px solid #F1F5F9', background: '#F8FAFC', overflowX: 'auto' }}>
          {[
            { id: 'all', label: 'All Results' },
            { id: 'patients', label: 'Patients' },
            { id: 'doctors', label: 'Doctors' },
            { id: 'appointments', label: 'Appointments' },
            { id: 'referrals', label: 'Referrals' },
            { id: 'medicines', label: 'Medicines' },
            { id: 'beds', label: 'Beds' },
            { id: 'departments', label: 'Departments' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                fontSize: '12px',
                fontWeight: activeCategory === cat.id ? 700 : 500,
                color: activeCategory === cat.id ? '#0284C7' : '#64748B',
                background: activeCategory === cat.id ? '#E0F2FE' : '#FFFFFF',
                border: activeCategory === cat.id ? '1px solid #BAE6FD' : '1px solid #E2E8F0',
                padding: '4px 10px',
                borderRadius: '20px',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Results Content */}
        <div style={{ overflowY: 'auto', padding: '12px 20px', flex: 1 }}>
          {!q ? (
            <div style={{ padding: '30px 20px', textAlign: 'center', color: '#64748B' }}>
              <div style={{ display: 'inline-flex', padding: 12, borderRadius: '50%', background: '#F0F9FF', marginBottom: 12 }}>
                <Search size={28} color="#0EA5E9" />
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#1E293B', marginBottom: 4 }}>CareBridge Universal Search</div>
              <div style={{ fontSize: '12px', maxWidth: 360, margin: '0 auto', color: '#64748B' }}>
                Quickly locate patient ABHA records, doctor schedules, referrals, diagnostic requests, or ward bed allocations across the hospital.
              </div>
            </div>
          ) : totalMatches === 0 ? (
            <div style={{ padding: '36px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: 8 }}>🔍</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#1E293B' }}>No results found for "{query}"</div>
              <div style={{ fontSize: '12px', color: '#64748B', marginTop: 4 }}>Try searching by Patient Name, ABHA ID, Doctor Name, or Token ID.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Patients Group */}
              {(activeCategory === 'all' || activeCategory === 'patients') && matchedPatients.length > 0 && (
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#0EA5E9', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Users size={13} /> Patients ({matchedPatients.length})
                  </div>
                  {matchedPatients.map(p => (
                    <div
                      key={p.id}
                      onClick={() => handleSelect(`${base}/patients`)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: '0.15s',
                        background: '#FFFFFF',
                        border: '1px solid #F1F5F9',
                        marginBottom: 4
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                    >
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 6 }}>
                          {p.name}
                          <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 400 }}>({p.age}y, {p.gender})</span>
                          {p.abhaVerified && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: '10px', background: '#DCFCE7', color: '#15803D', padding: '1px 5px', borderRadius: 4, fontWeight: 600 }}>
                              <ShieldCheck size={10} /> ABHA
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>
                          ID: {p.id} · ABHA: {p.maskedAbha} · {p.dept} · {p.condition}
                        </div>
                      </div>
                      <span className={`badge ${p.status === 'Critical' ? 'badge-danger' : 'badge-info'}`} style={{ fontSize: '10px' }}>
                        {p.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Doctors Group */}
              {(activeCategory === 'all' || activeCategory === 'doctors') && matchedDoctors.length > 0 && (
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Stethoscope size={13} /> Doctors ({matchedDoctors.length})
                  </div>
                  {matchedDoctors.map(d => (
                    <div
                      key={d.id}
                      onClick={() => handleSelect(`${base}/doctors`)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: '0.15s',
                        background: '#FFFFFF',
                        border: '1px solid #F1F5F9',
                        marginBottom: 4
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                    >
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>{d.name}</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>{d.specialization} · {d.department} · {d.qualification}</div>
                      </div>
                      <span className={`badge ${d.available ? 'badge-success' : 'badge-neutral'}`} style={{ fontSize: '10px' }}>
                        {d.available ? 'Available' : 'Busy'}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Departments Group */}
              {(activeCategory === 'all' || activeCategory === 'departments') && matchedDepartments.length > 0 && (
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#8B5CF6', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Building2 size={13} /> Departments ({matchedDepartments.length})
                  </div>
                  {matchedDepartments.map(dept => (
                    <div
                      key={dept.id}
                      onClick={() => handleSelect(`${base}/departments`)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: '0.15s',
                        background: '#FFFFFF',
                        border: '1px solid #F1F5F9',
                        marginBottom: 4
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                    >
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>{dept.name}</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Head: {dept.head} · Doctors: {dept.doctors} · Active Patients: {dept.patients}</div>
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: dept.workload > 85 ? '#DC2626' : '#059669' }}>
                        {dept.workload}% Load
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Referrals Group */}
              {(activeCategory === 'all' || activeCategory === 'referrals') && matchedReferrals.length > 0 && (
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#EF4444', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ArrowLeftRight size={13} /> Referrals ({matchedReferrals.length})
                  </div>
                  {matchedReferrals.map(r => (
                    <div
                      key={r.id}
                      onClick={() => handleSelect(`${base}/referrals`)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: '0.15s',
                        background: '#FFFFFF',
                        border: '1px solid #F1F5F9',
                        marginBottom: 4
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                    >
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>{r.patient} · {r.id}</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>To: {r.toFacility} · {r.reason}</div>
                      </div>
                      <span className="badge badge-warning" style={{ fontSize: '10px' }}>{r.status}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Medicines Group */}
              {(activeCategory === 'all' || activeCategory === 'medicines') && matchedMedicines.length > 0 && (
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Pill size={13} /> Pharmacy & Medicines ({matchedMedicines.length})
                  </div>
                  {matchedMedicines.map(m => (
                    <div
                      key={m.id}
                      onClick={() => handleSelect(`${base}/pharmacy`)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: '0.15s',
                        background: '#FFFFFF',
                        border: '1px solid #F1F5F9',
                        marginBottom: 4
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                    >
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>{m.name}</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Stock: {m.available} units · Min: {m.minStock} · Exp: {m.expiry}</div>
                      </div>
                      <span className={`badge ${m.status === 'Out of Stock' ? 'badge-danger' : m.status === 'Low Stock' ? 'badge-warning' : 'badge-success'}`} style={{ fontSize: '10px' }}>
                        {m.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Beds Group */}
              {(activeCategory === 'all' || activeCategory === 'beds') && matchedBeds.length > 0 && (
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Bed size={13} /> Ward Beds ({matchedBeds.length})
                  </div>
                  {matchedBeds.map(b => (
                    <div
                      key={b.id}
                      onClick={() => handleSelect(`${base}/wards`)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: '0.15s',
                        background: '#FFFFFF',
                        border: '1px solid #F1F5F9',
                        marginBottom: 4
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                    >
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>Bed {b.bedNo} · {b.ward}</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>{b.patient ? `Occupant: ${b.patient}` : 'Ready for allocation'}</div>
                      </div>
                      <span className={`badge ${b.status === 'Occupied' ? 'badge-info' : b.status === 'Available' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '10px' }}>
                        {b.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '10px 20px', borderTop: '1px solid #E2E8F0', background: '#F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#64748B' }}>
          <span>Search CareBridge Network across all hospital nodes</span>
          <span style={{ fontWeight: 600, color: '#0EA5E9' }}>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
}
