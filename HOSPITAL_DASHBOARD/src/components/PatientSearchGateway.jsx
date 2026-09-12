import { useState, useEffect } from 'react';
import { Search, User, ShieldCheck, ArrowRight, AlertCircle, RefreshCw, CheckCircle2, Eye, Sparkles } from 'lucide-react';
import { PATIENTS } from '../data/mockData';

/**
 * Common Patient Identification & Search Gateway across ALL login roles.
 * Provides explicit fields for OP ID and ABHA ID.
 * When either ID is entered and searched, retrieves and displays:
 *   - Patient Name
 *   - Patient ID
 *   - OP ID
 *   - ABHA ID
 * And allows staff to continue with that patient's existing workflow.
 */
export default function PatientSearchGateway({
  onPatientSelect,
  selectedPatient: externalSelectedPatient,
  onClear,
  title = 'Patient Identification & Access',
  subtitle = 'Search and access patient records using OP ID or ABHA ID',
  actionLabel = 'Continue Patient Workflow',
  onAction,
  initialOpId = '',
  initialAbhaId = '',
  showQuickChips = true
}) {
  const [opIdInput, setOpIdInput] = useState(initialOpId);
  const [abhaIdInput, setAbhaIdInput] = useState(initialAbhaId);
  const [searchStatus, setSearchStatus] = useState(externalSelectedPatient ? 'found' : 'idle'); // 'idle' | 'searching' | 'found' | 'not_found'
  const [matchedPatient, setMatchedPatient] = useState(externalSelectedPatient || null);
  const [errorMessage, setErrorMessage] = useState('');

  // Sync if external selected patient changes
  useEffect(() => {
    if (externalSelectedPatient) {
      setMatchedPatient(externalSelectedPatient);
      setOpIdInput(externalSelectedPatient.opId || '');
      setAbhaIdInput(externalSelectedPatient.abhaId || '');
      setSearchStatus('found');
    }
  }, [externalSelectedPatient]);

  function executeSearch(opQuery, abhaQuery) {
    const op = (opQuery !== undefined ? opQuery : opIdInput).trim().toUpperCase();
    const abha = (abhaQuery !== undefined ? abhaQuery : abhaIdInput).trim().toUpperCase();

    if (!op && !abha) {
      setSearchStatus('not_found');
      setErrorMessage('Please enter either an OP ID (e.g. OP2026001) or an ABHA ID (e.g. ABHA10001).');
      return;
    }

    setSearchStatus('searching');
    setErrorMessage('');

    setTimeout(() => {
      const found = PATIENTS.find(p => {
        const matchOp = op && p.opId && p.opId.toUpperCase() === op;
        const matchAbha = abha && p.abhaId && p.abhaId.toUpperCase() === abha;
        return matchOp || matchAbha;
      });

      if (found) {
        setMatchedPatient(found);
        setOpIdInput(found.opId || '');
        setAbhaIdInput(found.abhaId || '');
        setSearchStatus('found');
        setErrorMessage('');
        if (onPatientSelect) {
          onPatientSelect(found);
        }
      } else {
        setMatchedPatient(null);
        setSearchStatus('not_found');
        setErrorMessage(
          `No patient found matching ${op ? `OP ID "${op}"` : ''}${op && abha ? ' or ' : ''}${abha ? `ABHA ID "${abha}"` : ''}. Please verify and try again.`
        );
        if (onClear) {
          onClear();
        }
      }
    }, 200);
  }

  function handleSubmit(e) {
    if (e) e.preventDefault();
    executeSearch();
  }

  function handleQuickSelect(patient) {
    setOpIdInput(patient.opId || '');
    setAbhaIdInput(patient.abhaId || '');
    executeSearch(patient.opId, patient.abhaId);
  }

  function handleReset() {
    setOpIdInput('');
    setAbhaIdInput('');
    setSearchStatus('idle');
    setMatchedPatient(null);
    setErrorMessage('');
    if (onClear) {
      onClear();
    }
  }

  function handleContinue() {
    if (onAction && matchedPatient) {
      onAction(matchedPatient);
    } else if (onPatientSelect && matchedPatient) {
      onPatientSelect(matchedPatient);
    }
  }

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #F0F9FF 0%, #FFFFFF 100%)',
        borderRadius: 14,
        padding: '18px 22px',
        border: '1.5px solid #BAE6FD',
        marginBottom: 20,
        boxShadow: '0 2px 10px rgba(14, 165, 233, 0.07)'
      }}
    >
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
            <Search size={18} />
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8 }}>
              {title}
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: 1 }}>
              {subtitle}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: '11px', background: '#E0F2FE', color: '#0369A1', padding: '3px 9px', borderRadius: 6, fontWeight: 700, border: '1px solid #BAE6FD' }}>
            OP ID / ABHA ID GATEWAY
          </span>
        </div>
      </div>

      {/* Dual Input Form: OP ID & ABHA ID */}
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr)) 140px auto', gap: 10, alignItems: 'flex-end', marginBottom: 12 }}>
        {/* Field 1: OP ID */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#334155', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            OP ID (Outpatient ID)
          </label>
          <input
            type="text"
            value={opIdInput}
            onChange={e => {
              setOpIdInput(e.target.value);
              if (searchStatus === 'not_found') setSearchStatus('idle');
            }}
            placeholder="e.g. OP2026001"
            style={{
              width: '100%',
              padding: '9px 12px',
              borderRadius: 8,
              border: '1.5px solid #CBD5E1',
              fontSize: '13px',
              fontWeight: 600,
              color: '#0F172A',
              background: '#FFFFFF',
              fontFamily: 'monospace',
              outline: 'none'
            }}
          />
        </div>

        {/* Field 2: ABHA ID */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#334155', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            ABHA ID (Ayushman Bharat)
          </label>
          <input
            type="text"
            value={abhaIdInput}
            onChange={e => {
              setAbhaIdInput(e.target.value);
              if (searchStatus === 'not_found') setSearchStatus('idle');
            }}
            placeholder="e.g. ABHA10001"
            style={{
              width: '100%',
              padding: '9px 12px',
              borderRadius: 8,
              border: '1.5px solid #CBD5E1',
              fontSize: '13px',
              fontWeight: 600,
              color: '#0F172A',
              background: '#FFFFFF',
              fontFamily: 'monospace',
              outline: 'none'
            }}
          />
        </div>

        {/* Search Action Button */}
        <div>
          <button
            type="submit"
            disabled={searchStatus === 'searching'}
            style={{
              width: '100%',
              padding: '9.5px 16px',
              borderRadius: 8,
              background: '#0284C7',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              boxShadow: '0 2px 6px rgba(2, 132, 199, 0.25)'
            }}
          >
            {searchStatus === 'searching' ? (
              <>
                <RefreshCw size={14} className="spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Search size={14} />
                <span>Find Patient</span>
              </>
            )}
          </button>
        </div>

        {/* Clear Button */}
        {(opIdInput || abhaIdInput || matchedPatient) && (
          <div>
            <button
              type="button"
              onClick={handleReset}
              style={{
                padding: '9.5px 14px',
                borderRadius: 8,
                background: '#F1F5F9',
                color: '#475569',
                border: '1px solid #CBD5E1',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              Clear
            </button>
          </div>
        )}
      </form>

      {/* Quick Select Demo Chips */}
      {showQuickChips && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
          <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
            Quick Demo Select:
          </span>
          {PATIENTS.slice(0, 3).map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleQuickSelect(p)}
              style={{
                fontSize: '11px',
                padding: '3px 8px',
                borderRadius: 6,
                background: matchedPatient?.id === p.id ? '#E0F2FE' : '#FFFFFF',
                border: matchedPatient?.id === p.id ? '1px solid #0284C7' : '1px solid #CBD5E1',
                color: matchedPatient?.id === p.id ? '#0284C7' : '#475569',
                fontWeight: matchedPatient?.id === p.id ? 700 : 500,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              <span>{p.name}</span>
              <span style={{ color: '#0EA5E9', fontWeight: 700 }}>({p.opId} · {p.abhaId})</span>
            </button>
          ))}
        </div>
      )}

      {/* Patient Not Found Message */}
      {searchStatus === 'not_found' && (
        <div
          style={{
            marginTop: 10,
            padding: '12px 16px',
            borderRadius: 8,
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}
        >
          <AlertCircle size={18} color="#DC2626" />
          <div style={{ fontSize: '12.5px', color: '#B91C1C', fontWeight: 600 }}>
            {errorMessage || 'No patient found matching the provided OP ID or ABHA ID.'}
          </div>
        </div>
      )}

      {/* Matched Patient Identification Card */}
      {matchedPatient && (
        <div
          style={{
            marginTop: 12,
            padding: '16px 20px',
            borderRadius: 10,
            background: '#FFFFFF',
            border: '1.5px solid #BAE6FD',
            boxShadow: '0 3px 8px rgba(0,0,0,0.04)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
            {/* Patient Header Identity */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '18px',
                  boxShadow: '0 3px 8px rgba(2, 132, 199, 0.3)'
                }}
              >
                {matchedPatient.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A' }}>
                    {matchedPatient.name}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 4,
                      background: matchedPatient.status === 'Critical' ? '#FEE2E2' : '#DCFCE7',
                      color: matchedPatient.status === 'Critical' ? '#991B1B' : '#15803D'
                    }}
                  >
                    {matchedPatient.status}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#64748B', marginTop: 2 }}>
                  {matchedPatient.age} yrs · {matchedPatient.gender} · Blood Group: <strong>{matchedPatient.blood}</strong> · Contact: {matchedPatient.phone}
                </div>
              </div>
            </div>

            {/* Primary Action Button to Continue Workflow */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button
                type="button"
                onClick={handleContinue}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  background: '#0284C7',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: '0 2px 6px rgba(2, 132, 199, 0.25)'
                }}
              >
                <span>{actionLabel}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* 4 MANDATORY IDENTIFICATION FIELDS (Patient Name, Patient ID, OP ID, ABHA ID) */}
          <div
            style={{
              marginTop: 14,
              paddingTop: 12,
              borderTop: '1px solid #E2E8F0',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 12
            }}
          >
            {/* 1. Patient Name */}
            <div style={{ background: '#F8FAFC', padding: '8px 12px', borderRadius: 8, border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                Patient Name
              </div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', marginTop: 2 }}>
                {matchedPatient.name}
              </div>
            </div>

            {/* 2. Patient ID */}
            <div style={{ background: '#F8FAFC', padding: '8px 12px', borderRadius: 8, border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                Patient ID
              </div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#0EA5E9', marginTop: 2, fontFamily: 'monospace' }}>
                {matchedPatient.id}
              </div>
            </div>

            {/* 3. OP ID */}
            <div style={{ background: '#E0F2FE', padding: '8px 12px', borderRadius: 8, border: '1px solid #BAE6FD' }}>
              <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#0369A1', textTransform: 'uppercase' }}>
                OP ID
              </div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#0284C7', marginTop: 2, fontFamily: 'monospace' }}>
                {matchedPatient.opId}
              </div>
            </div>

            {/* 4. ABHA ID */}
            <div style={{ background: '#EDE9FE', padding: '8px 12px', borderRadius: 8, border: '1px solid #DDD6FE' }}>
              <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#6D28D9', textTransform: 'uppercase' }}>
                ABHA ID
              </div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#5B21B6', marginTop: 2, fontFamily: 'monospace' }}>
                {matchedPatient.abhaId}
              </div>
            </div>
          </div>

          {/* Clinical summary strip */}
          <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 14, fontSize: '11.5px', color: '#475569' }}>
            <span><strong>Department:</strong> {matchedPatient.dept}</span>
            <span>·</span>
            <span><strong>Doctor:</strong> {matchedPatient.doctor || 'General Duty'}</span>
            <span>·</span>
            <span><strong>Ward / Bed:</strong> {matchedPatient.ward} / {matchedPatient.bed}</span>
            <span>·</span>
            <span><strong>Diagnosis:</strong> {matchedPatient.diagnosis || 'General Examination'}</span>
          </div>
        </div>
      )}
    </div>
  );
}
