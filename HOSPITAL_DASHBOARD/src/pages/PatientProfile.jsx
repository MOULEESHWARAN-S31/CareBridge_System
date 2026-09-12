import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRoleNav } from '../hooks/useRoleNav';
import {
  ArrowLeft, Phone, Calendar, Video, ArrowLeftRight,
  AlertTriangle, Pill, Activity, ShieldCheck, Download,
  FileText, CheckCircle2, Clock, User, Bed, Stethoscope
} from 'lucide-react';
import { PATIENTS, DOCTORS, PRESCRIPTIONS, LAB_ORDERS, REFERRALS } from '../data/mockData';
import { useToast } from '../components/Toast';

export default function PatientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { path } = useRoleNav();
  const toast = useToast();

  const patient = PATIENTS.find(p => p.id === id) || PATIENTS[0];
  const initials = patient.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  // Section 11 Tabs
  const TABS = ['Overview', 'Visits', 'Records', 'Diagnostics', 'Medicines', 'Referrals'];
  const [activeTab, setActiveTab] = useState('Overview');

  // Related data
  const patientPrescriptions = PRESCRIPTIONS.filter(pr => pr.patientId === patient.id || pr.patient === patient.name);
  const patientLabs = LAB_ORDERS.filter(l => l.patientId === patient.id || l.patient === patient.name);
  const patientReferrals = REFERRALS.filter(r => r.patientId === patient.id || r.patient === patient.name);

  return (
    <div className="fade-in" style={{ paddingBottom: 32 }}>
      {/* Back button */}
      <button
        onClick={() => navigate(path('patients'))}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: 'none',
          border: 'none',
          color: '#0EA5E9',
          fontSize: '13px',
          fontWeight: 700,
          cursor: 'pointer',
          marginBottom: 16
        }}
      >
        <ArrowLeft size={16} />
        <span>Back to Patient Registry</span>
      </button>

      {/* Patient Header Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, #F0F9FF 0%, #FFFFFF 100%)',
          borderRadius: 14,
          padding: '20px 24px',
          border: '1.5px solid #BAE6FD',
          marginBottom: 18,
          boxShadow: '0 2px 8px rgba(14, 165, 233, 0.08)'
        }}
      >
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontSize: '24px',
              fontWeight: 800,
              boxShadow: '0 4px 14px rgba(14, 165, 233, 0.35)'
            }}
          >
            {initials}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {patient.name}
                  </h2>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 6,
                      background: patient.status === 'Critical' ? '#FEE2E2' : '#E0F2FE',
                      color: patient.status === 'Critical' ? '#991B1B' : '#0369A1'
                    }}
                  >
                    {patient.status}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: '12px', color: '#475569', marginTop: 4 }}>
                  <span>Patient ID: <strong style={{ fontFamily: 'monospace', color: '#0EA5E9' }}>{patient.id}</strong></span>
                  <span>·</span>
                  <span>OP ID: <strong style={{ fontFamily: 'monospace', color: '#0369A1' }}>{patient.opId || 'OP2026001'}</strong></span>
                  <span>·</span>
                  <span>ABHA ID: <strong style={{ fontFamily: 'monospace', color: '#6D28D9' }}>{patient.abhaId || 'ABHA10001'}</strong></span>
                  <span>·</span>
                  <span>{patient.age} yrs · {patient.gender}</span>
                  <span>·</span>
                  <span>Blood: <strong>{patient.blood}</strong></span>
                  <span>·</span>
                  <span>{patient.dept}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                {/* OP ID Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#FFFFFF', padding: '6px 14px', borderRadius: 8, border: '1.5px solid #BAE6FD' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284C7', fontWeight: 800, fontSize: '12px' }}>
                    OP
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                      OP ID
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#0369A1', fontFamily: 'monospace' }}>
                      {patient.opId || 'OP2026001'}
                    </div>
                  </div>
                </div>

                {/* ABHA ID Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#FFFFFF', padding: '6px 14px', borderRadius: 8, border: '1.5px solid #DDD6FE' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6D28D9', fontWeight: 800, fontSize: '12px' }}>
                    AB
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                      ABHA ID
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#6D28D9', fontFamily: 'monospace' }}>
                      {patient.abhaId || 'ABHA10001'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation (Section 11) */}
      <div style={{ display: 'flex', gap: 6, borderBottom: '2px solid #E2E8F0', marginBottom: 18, overflowX: 'auto' }}>
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 18px',
              border: 'none',
              background: 'transparent',
              fontSize: '13px',
              fontWeight: activeTab === tab ? 700 : 500,
              color: activeTab === tab ? '#0EA5E9' : '#64748B',
              borderBottom: activeTab === tab ? '2.5px solid #0EA5E9' : '2.5px solid transparent',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              marginBottom: -2
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ background: '#FFFFFF', borderRadius: 12, padding: '20px', border: '1px solid #E2E8F0' }}>
        {/* ── 1. Overview Tab ─────────────────────────────────────── */}
        {activeTab === 'Overview' && (
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', marginBottom: 14 }}>
              Clinical Summary & Demographics
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, marginBottom: 20 }}>
              <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>PRIMARY DIAGNOSIS</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginTop: 3 }}>{patient.diagnosis}</div>
                <div style={{ fontSize: '11px', color: '#0EA5E9', marginTop: 2 }}>Condition: {patient.condition}</div>
              </div>

              <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>WARD & BED ALLOCATION</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginTop: 3 }}>
                  {patient.ward} · Bed {patient.bed}
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: 2 }}>Assigned Nurse: {patient.nurse || 'General Duty'}</div>
              </div>

              <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>PRIMARY DOCTOR</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginTop: 3 }}>
                  {patient.doctor || 'Dr. Priya Sharma'}
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: 2 }}>{patient.dept} Specialist</div>
              </div>

              <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>CONTACT & RESIDENCE</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginTop: 3 }}>{patient.phone}</div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: 2 }}>Salem District, Tamil Nadu</div>
              </div>
            </div>

            <div style={{ background: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: 8, padding: '12px 16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#991B1B', display: 'flex', alignItems: 'center', gap: 6 }}>
                <AlertTriangle size={15} /> Documented Allergies & Alerts:
              </div>
              <div style={{ fontSize: '12px', color: '#B91C1C', marginTop: 4 }}>
                {Array.isArray(patient.allergies) ? patient.allergies.join(', ') : 'No known drug allergies (NKDA)'}
              </div>
            </div>
          </div>
        )}

        {/* ── 2. Visits Tab ───────────────────────────────────────── */}
        {activeTab === 'Visits' && (
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', marginBottom: 14 }}>
              Hospital Visit History (Outpatient & Inpatient)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { date: '2026-09-05', type: 'Emergency / Admission', dept: patient.dept, doc: patient.doctor || 'Dr. Priya Sharma', notes: patient.diagnosis, outcome: 'Admitted to ' + patient.ward },
                { date: '2026-07-14', type: 'OPD Follow-up', dept: 'General Medicine', doc: 'Dr. Priya Sharma', notes: 'Routine checkup and vitals assessment', outcome: 'Prescription renewed' },
                { date: '2026-03-22', type: 'PHC Referral Arrival', dept: 'General Medicine', doc: 'Dr. Ramesh Nair', notes: 'Referred from Attur Primary Health Centre for secondary evaluation', outcome: 'OPD prescribed' },
              ].map((v, i) => (
                <div key={i} style={{ padding: '12px 16px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#0EA5E9' }}>{v.type}</span>
                    <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>{v.date}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#334155', marginTop: 3 }}>
                    Doctor: <strong>{v.doc}</strong> · Department: {v.dept}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: 2 }}>
                    Clinical Note: {v.notes} — Outcome: <strong>{v.outcome}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 3. Records Tab ──────────────────────────────────────── */}
        {activeTab === 'Records' && (
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', marginBottom: 14 }}>
              Clinical Records, Diagnoses & Discharge Summaries
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { title: 'Inpatient Clinical Assessment Note', date: '2026-09-05', author: 'Dr. Priya Sharma', details: 'Patient presenting with elevated parameters. Vitals stabilized upon admission. Daily monitoring ordered.' },
                { title: 'Nursing Vitals & Intake Sheet', date: '2026-09-06', author: 'Staff Nurse Anitha Ravi', details: 'BP 135/85 mmHg, SpO2 97% room air, Pulse 76 bpm. IV medication administered as scheduled.' },
                { title: 'Previous Discharge Summary (District Hospital)', date: '2026-03-25', author: 'Dr. Mohan Das', details: 'Completed course of treatment with satisfactory recovery. Advised lifestyle modifications.' },
              ].map((rec, i) => (
                <div key={i} style={{ padding: '12px 16px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>{rec.title}</span>
                    <span style={{ fontSize: '11px', color: '#64748B' }}>{rec.date}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#0EA5E9', marginTop: 2, fontWeight: 600 }}>By: {rec.author}</div>
                  <div style={{ fontSize: '12px', color: '#475569', marginTop: 4, lineHeight: 1.4 }}>{rec.details}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 4. Diagnostics Tab ──────────────────────────────────── */}
        {activeTab === 'Diagnostics' && (
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', marginBottom: 14 }}>
              Laboratory & Imaging Reports (X-Ray, CT, ECG, Labs)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {patientLabs.length > 0 ? (
                patientLabs.map(lab => (
                  <div key={lab.id} style={{ padding: '12px 16px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>{lab.test}</div>
                      <div style={{ fontSize: '11px', color: '#64748B', marginTop: 2 }}>
                        Ordered: {lab.ordered} · By {lab.doctor} · Priority: <strong>{lab.priority}</strong>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className={`badge ${lab.status === 'Completed' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '10.5px' }}>
                        {lab.status}
                      </span>
                      {lab.result && (
                        <div style={{ fontSize: '11.5px', fontWeight: 700, color: lab.result === 'CRITICAL' ? '#DC2626' : '#16A34A', marginTop: 3 }}>
                          Result: {lab.result}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '24px', textAlign: 'center', color: '#64748B' }}>
                  No active diagnostic test records for this patient.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── 5. Medicines Tab ────────────────────────────────────── */}
        {activeTab === 'Medicines' && (
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', marginBottom: 14 }}>
              Active Prescriptions & Pharmacy Dispensation
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {patientPrescriptions.length > 0 ? (
                patientPrescriptions.map(rx => (
                  <div key={rx.id} style={{ padding: '12px 16px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>Prescription #{rx.id}</span>
                      <span className={`badge ${rx.status === 'Dispensed' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '10.5px' }}>
                        {rx.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: 2 }}>
                      Prescribed by {rx.doctor} · Date: {rx.date}
                    </div>
                    <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {rx.medicines.map((m, idx) => (
                        <span key={idx} style={{ background: '#E0F2FE', color: '#0369A1', padding: '3px 8px', borderRadius: 4, fontSize: '11px', fontWeight: 600 }}>
                          💊 {m}
                        </span>
                      ))}
                    </div>
                    <div style={{ fontSize: '11px', color: '#475569', marginTop: 6, fontStyle: 'italic' }}>
                      Instructions: {rx.instructions}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '24px', textAlign: 'center', color: '#64748B' }}>
                  No active prescriptions for this patient.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── 6. Referrals Tab ────────────────────────────────────── */}
        {activeTab === 'Referrals' && (
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', marginBottom: 14 }}>
              CareBridge Referral Network History
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {patientReferrals.length > 0 ? (
                patientReferrals.map(ref => (
                  <div key={ref.id} style={{ padding: '12px 16px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#0EA5E9' }}>Referral #{ref.id}</span>
                      <span className="badge badge-warning" style={{ fontSize: '10.5px' }}>{ref.status}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#1E293B', marginTop: 3 }}>
                      Destination: <strong>{ref.toFacility}</strong> ({ref.toDept})
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: 2 }}>
                      Reason: {ref.reason} · Priority: <strong>{ref.priority}</strong>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '24px', textAlign: 'center', color: '#64748B' }}>
                  No referral cases logged for this patient.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
