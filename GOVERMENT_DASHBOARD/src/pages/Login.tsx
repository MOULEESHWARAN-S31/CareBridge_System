import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHealthData } from '../context/HealthDataContext';
import logoImg from '../assets/logo.png';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const { setUserRole, setOfficerName, setUserDistrict, setDistrictName } = useHealthData();

  const [employeeId, setEmployeeId] = useState('EMP-SLM-01');
  const [selectedRole, setSelectedRole] = useState<string>('Doctor');
  const [password, setPassword] = useState('Password@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [errors, setErrors] = useState<{ employeeId?: string; password?: string }>({});
  const [alertBanner, setAlertBanner] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Modal dialog state
  const [modalContent, setModalContent] = useState<{ title: string; bodyHtml: string } | null>(null);

  const handleAutofillSalem = () => {
    setEmployeeId('EMP-SLM-01');
    setPassword('Password@123');
    setSelectedRole('Doctor');
    setErrors({});
    setAlertBanner(null);
  };

  const handleAutofillCoimbatore = () => {
    setEmployeeId('EMP-CBE-01');
    setPassword('Password@123');
    setSelectedRole('Doctor');
    setErrors({});
    setAlertBanner(null);
  };

  const handleAutofillMadurai = () => {
    setEmployeeId('EMP-MDU-01');
    setPassword('Password@123');
    setSelectedRole('Doctor');
    setErrors({});
    setAlertBanner(null);
  };

  const handleAutofillChennai = () => {
    setEmployeeId('EMP-CHN-01');
    setPassword('Password@123');
    setSelectedRole('Doctor');
    setErrors({});
    setAlertBanner(null);
  };

  const handleAutofillErode = () => {
    setEmployeeId('EMP-ERD-01');
    setPassword('Password@123');
    setSelectedRole('Doctor');
    setErrors({});
    setAlertBanner(null);
  };

  const handleAutofillTrichy = () => {
    setEmployeeId('EMP-TRC-01');
    setPassword('Password@123');
    setSelectedRole('Doctor');
    setErrors({});
    setAlertBanner(null);
  };

  const handleAutofillNamakkal = () => {
    setEmployeeId('EMP-NMK-01');
    setPassword('Password@123');
    setSelectedRole('Doctor');
    setErrors({});
    setAlertBanner(null);
  };

  const handleAutofillDharmapuri = () => {
    setEmployeeId('EMP-DHP-01');
    setPassword('Password@123');
    setSelectedRole('Doctor');
    setErrors({});
    setAlertBanner(null);
  };

  const handleOpenModal = (title: string, bodyHtml: string) => {
    setModalContent({ title, bodyHtml });
  };

  const handleCloseModal = () => {
    setModalContent(null);
  };

  const handleDirectAdmin = () => {
    setUserRole('State Administrator');
    setOfficerName('Dr. J. Radhakrishnan, IAS');
    setUserDistrict('Salem');
    setDistrictName('Salem');
    navigate('/dashboard');
  };

  const handleAutofillGovernment = () => {
    setEmployeeId('government@carebridge.local');
    setPassword('Gov@123');
    setSelectedRole('District Administrator');
    setErrors({});
    setAlertBanner(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlertBanner(null);
    const newErrors: { employeeId?: string; password?: string } = {};

    if (!employeeId.trim()) {
      newErrors.employeeId = 'Please enter your Employee ID or Email.';
    }
    if (!password.trim()) {
      newErrors.password = 'Please enter your password.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      // Connect to unified backend API
      const resp = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: employeeId.trim(), password })
      });

      if (resp.ok) {
        const data = await resp.json();
        // Strict role verification: GOVERNMENT only
        if (data.user.role !== 'GOVERNMENT') {
          setIsLoading(false);
          setAlertBanner({
            message: `Access Denied: Role "${data.user.role}" is not authorized for Government Dashboard. Administrators must use the Admin Dashboard (:5173).`,
            type: 'error'
          });
          return;
        }

        // Store tokens for unified session
        localStorage.setItem('cb_auth_token', data.token);
        localStorage.setItem('cb_auth_user', JSON.stringify(data.user));
        sessionStorage.setItem('cb_auth_token', data.token);
        sessionStorage.setItem('cb_auth_user', JSON.stringify(data.user));

        if (data.user.full_name) setOfficerName(data.user.full_name);
        if (data.user.district) {
          setUserDistrict(data.user.district);
          setDistrictName(data.user.district);
        }
        setUserRole('District Administrator');

        setIsLoading(false);
        setAlertBanner({
          message: `Authenticated as ${data.user.full_name || data.user.username} (GOVERNMENT). Entering Dashboard...`,
          type: 'success'
        });

        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
        return;
      } else {
        const errData = await resp.json().catch(() => ({}));
        setIsLoading(false);
        setAlertBanner({
          message: errData.error || 'Authentication failed. Please verify your credentials.',
          type: 'error'
        });
        return;
      }
    } catch (networkErr) {
      console.warn('Backend API offline, falling back to simulated session:', networkErr);
      // Fallback for offline demo mode
      setIsLoading(false);
      setUserRole('District Administrator');
      setOfficerName('Dr. J. Radhakrishnan, IAS');
      setUserDistrict('Salem');
      setDistrictName('Salem');

      setAlertBanner({
        message: 'Backend server offline. Starting Development / Offline Mock Data session...',
        type: 'success'
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 600);
    }
  };

  return (
    <div className="cb-login-page-wrapper">
      <div className="cb-login-main-container">
        
        {/* 1. Left Section — Branding (50% Width) */}
        <section className="cb-branding-section" aria-label="CareBridge Branding and Information">
          <div className="cb-branding-content">
            
            {/* Government Verification Pill */}
            <div className="cb-gov-badge">
              <svg className="cb-gov-badge-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
              </svg>
              <span>National Healthcare Network • Authorized Portal</span>
            </div>

            {/* Official Logo */}
            <div className="cb-branding-logo-wrapper">
              <img 
                src={logoImg} 
                alt="CareBridge Official Emblem" 
                className="cb-official-logo" 
              />
            </div>

            {/* Title & Brand Name */}
            <div className="cb-branding-title-group">
              <h1 className="cb-branding-name">CareBridge</h1>
              <p className="cb-branding-tagline">“Smarter Hospital Management, Better Patient Care”</p>
            </div>

            {/* Supporting Text */}
            <p className="cb-branding-supporting-text">
              Secure access to hospital healthcare services, district governance and clinical operations
            </p>

            {/* Trust Signals */}
            <div className="cb-branding-trust-points">
              <span className="cb-trust-chip">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                District-Secured Access
              </span>
              <span className="cb-trust-chip">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="m9 12 2 2 4-4"/>
                </svg>
                Role-Based Governance
              </span>
            </div>

          </div>
        </section>

        {/* 2. Right Section — Login Form (50% Width) */}
        <section className="cb-form-section" aria-label="Hospital Staff Sign In Form">
          
          {/* Mobile-only Brand Header */}
          <div className="cb-mobile-brand-header">
            <img src={logoImg} alt="CareBridge Logo" className="cb-mobile-brand-logo" />
            <h1 className="cb-mobile-brand-name">CareBridge</h1>
          </div>

          {/* Login Card */}
          <div className="cb-login-card">
            
            <div className="cb-login-card-header">
              <h2 className="cb-login-heading">Government Health Portal</h2>
              <p className="cb-login-subheading">Sign in with your Admin-assigned credentials</p>
            </div>

            {/* Alert Banner */}
            {alertBanner && (
              <div className={`cb-login-alert cb-login-alert-${alertBanner.type}`} role="alert">
                {alertBanner.type === 'error' ? (
                  <svg className="cb-alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                ) : (
                  <svg className="cb-alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                )}
                <span>{alertBanner.message}</span>
              </div>
            )}

            <form className="cb-login-form" onSubmit={handleSubmit} noValidate>
              
              {/* Employee ID Field */}
              <div className={`cb-form-group ${errors.employeeId ? 'is-invalid' : ''}`}>
                <label className="cb-form-label" htmlFor="employee-id-input">
                  <span>Employee / User ID <span className="cb-required-star" aria-hidden="true">*</span></span>
                </label>
                <div className="cb-input-container">
                  <span className="cb-input-leading-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </span>
                  <input
                    type="text"
                    id="employee-id-input"
                    name="employeeId"
                    className="cb-form-input"
                    placeholder="e.g. EMP-SLM-01 or EMP-CBE-01"
                    value={employeeId}
                    onChange={(e) => {
                      setEmployeeId(e.target.value);
                      if (errors.employeeId) setErrors({ ...errors, employeeId: undefined });
                    }}
                    autoComplete="username"
                  />
                </div>
                {errors.employeeId && (
                  <span className="cb-field-error-message" role="alert">{errors.employeeId}</span>
                )}
              </div>

              {/* Role Selector */}
              <div className="cb-form-group">
                <label className="cb-form-label" htmlFor="role-select">
                  <span>Login Role Tier</span>
                  <span className="cb-role-badge-tag">District Bound</span>
                </label>
                <div className="cb-select-container">
                  <span className="cb-input-leading-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <polyline points="16 11 18 13 22 9"/>
                    </svg>
                  </span>
                  <select
                    id="role-select"
                    name="role"
                    className="cb-form-select"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                  >
                    <option value="Doctor">Doctor / Clinical Officer</option>
                    <option value="District Administrator">District Health Officer (DHO)</option>
                    <option value="Hospital Administrator">Hospital Administrator</option>
                    <option value="State Administrator">State Administrator (Super Admin)</option>
                    <option value="Nurse">Nurse / Ward In-Charge</option>
                    <option value="Pharmacist">Chief Pharmacist</option>
                  </select>
                  <span className="cb-select-arrow-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m6 9 6 6 6-6"/>
                    </svg>
                  </span>
                </div>
              </div>

              {/* Password Field */}
              <div className={`cb-form-group ${errors.password ? 'is-invalid' : ''}`}>
                <label className="cb-form-label" htmlFor="password-input">
                  <span>Password <span className="cb-required-star" aria-hidden="true">*</span></span>
                </label>
                <div className="cb-input-container">
                  <span className="cb-input-leading-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password-input"
                    name="password"
                    className="cb-form-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: undefined });
                    }}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="cb-password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
                        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
                        <line x1="2" x2="22" y1="2" y2="22"/>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <span className="cb-field-error-message" role="alert">{errors.password}</span>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="cb-remember-forgot-row">
                <label className="cb-remember-me-label">
                  <input
                    type="checkbox"
                    className="cb-custom-checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  className="cb-forgot-password-link"
                  onClick={() => handleOpenModal(
                    'Account Password Recovery',
                    '<p>For security compliance across the national healthcare network, password resets must be verified through your registered identity coordinator.</p><br/><p><strong>Option 1:</strong> Contact your Internal IT Helpdesk at extension <strong>#4400</strong>.</p><p><strong>Option 2:</strong> Submit an authorization request through your departmental clinical administrator.</p><br/><p style="font-size: 0.8rem; color: #64748b;">Reference ID: AUTH-SEC-718291</p>'
                  )}
                >
                  Forgot Password?
                </button>
              </div>

              {/* Sign In Button */}
              <div className="cb-btn-submit-container">
                <button
                  type="submit"
                  className={`cb-btn-sign-in ${isLoading ? 'is-loading' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="cb-spinner-icon" aria-hidden="true"></span>
                      <span>Verifying District Authorization...</span>
                    </>
                  ) : (
                    <span>Sign In to Dashboard</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleAutofillGovernment}
                  className="w-full mt-2 py-2 px-3 text-xs font-bold rounded-lg border border-teal-600/30 text-teal-700 hover:bg-teal-50 bg-white transition cursor-pointer"
                >
                  Autofill Government Credentials (GOV-001)
                </button>

                <a
                  href="http://localhost:3000"
                  className="block text-center mt-3 py-2 px-3 text-xs font-bold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                >
                  Go to CareBridge Common Login (Port 3000)
                </a>
              </div>

            </form>

            {/* Security Notice */}
            <div className="cb-security-notice-wrapper">
              <svg className="cb-security-lock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <div className="cb-security-text-group">
                <span className="cb-security-title">District-Isolated Data Protection</span>
                <span className="cb-security-subtitle">Data access is bound strictly to your Admin-assigned district jurisdiction.</span>
              </div>
            </div>

          </div>

          {/* District Test Quick Fillers */}
          <aside className="cb-demo-helper-wrapper" aria-label="Evaluation Demo Credentials" style={{ marginTop: '0.75rem' }}>
            <div className="cb-demo-helper-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4"/>
                <path d="M12 8h.01"/>
              </svg>
              <span>Quick District Test Accounts (All 8 Districts):</span>
            </div>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                type="button"
                className="cb-demo-fill-btn"
                onClick={handleAutofillSalem}
                title="Autofill Test Salem User"
                style={{ background: '#064e3b', color: '#6ee7b7', borderColor: '#059669' }}
              >
                Salem
              </button>
              <button
                type="button"
                className="cb-demo-fill-btn"
                onClick={handleAutofillCoimbatore}
                title="Autofill Test Coimbatore User"
                style={{ background: '#1e3a8a', color: '#93c5fd', borderColor: '#3b82f6' }}
              >
                Coimbatore
              </button>
              <button
                type="button"
                className="cb-demo-fill-btn"
                onClick={handleAutofillChennai}
                title="Autofill Test Chennai User"
                style={{ background: '#0f4679', color: '#bae6fd', borderColor: '#0284c7' }}
              >
                Chennai
              </button>
              <button
                type="button"
                className="cb-demo-fill-btn"
                onClick={handleAutofillMadurai}
                title="Autofill Test Madurai User"
                style={{ background: '#78350f', color: '#fcd34d', borderColor: '#f59e0b' }}
              >
                Madurai
              </button>
              <button
                type="button"
                className="cb-demo-fill-btn"
                onClick={handleAutofillErode}
                title="Autofill Test Erode User"
                style={{ background: '#065f46', color: '#a7f3d0', borderColor: '#10b981' }}
              >
                Erode
              </button>
              <button
                type="button"
                className="cb-demo-fill-btn"
                onClick={handleAutofillTrichy}
                title="Autofill Test Trichy User"
                style={{ background: '#312e81', color: '#c7d2fe', borderColor: '#6366f1' }}
              >
                Trichy
              </button>
              <button
                type="button"
                className="cb-demo-fill-btn"
                onClick={handleAutofillNamakkal}
                title="Autofill Test Namakkal User"
                style={{ background: '#4c1d95', color: '#ddd6fe', borderColor: '#8b5cf6' }}
              >
                Namakkal
              </button>
              <button
                type="button"
                className="cb-demo-fill-btn"
                onClick={handleAutofillDharmapuri}
                title="Autofill Test Dharmapuri User"
                style={{ background: '#831843', color: '#fbcfe8', borderColor: '#ec4899' }}
              >
                Dharmapuri
              </button>
              <button
                type="button"
                className="cb-demo-fill-btn"
                style={{ background: 'var(--cb-navy-800)', color: '#ffffff', borderColor: 'var(--cb-navy-900)' }}
                onClick={handleDirectAdmin}
                title="Directly launch Master Administration Dashboard"
              >
                Master Admin →
              </button>
            </div>
          </aside>

        </section>

      </div>

      {/* 3. Footer */}
      <footer className="cb-login-footer">
        <div>
          © 2026 CareBridge Portal. Government Healthcare Administration.
        </div>
        <ul className="cb-footer-links">
          <li>
            <button
              type="button"
              className="cb-footer-link"
              onClick={() => handleOpenModal(
                'Privacy Policy — Government Healthcare Platform',
                '<p>CareBridge operates in compliance with National Health Data Security Regulations. Patient health information and clinical records accessed through this portal are protected under strict cryptographic standards.</p><br/><p>All staff login events, credential verifications, and operational sessions are logged and audited in accordance with federal healthcare cybersecurity guidelines.</p>'
              )}
            >
              Privacy Policy
            </button>
          </li>
          <li>
            <button
              type="button"
              className="cb-footer-link"
              onClick={() => handleOpenModal(
                'Terms of Authorized Use',
                '<p>Access to this portal is strictly restricted to verified personnel of authorized hospital networks. Unauthorized access attempts are monitored and subject to disciplinary action and statutory penalties.</p><br/><p>Hospital staff must safeguard session credentials and ensure logout after concluding clinical and administrative duties.</p>'
              )}
            >
              Terms of Use
            </button>
          </li>
          <li>
            <button
              type="button"
              className="cb-footer-link"
              onClick={() => handleOpenModal(
                'CareBridge Hospital Staff Help & Support',
                '<p>Need assistance accessing your hospital department portal?</p><br/><p><strong>National Healthcare Helpdesk:</strong> 1800-419-CARE (24/7)</p><p><strong>Technical Support Email:</strong> support@carebridge.gov.health</p><p><strong>System Status:</strong> All regional healthcare nodes operational (99.98% uptime)</p>'
              )}
            >
              Help & Support
            </button>
          </li>
        </ul>
      </footer>

      {/* Accessible Modal Dialog */}
      {modalContent && (
        <div className="cb-modal-overlay" onClick={handleCloseModal} role="dialog" aria-modal="true">
          <div className="cb-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="cb-modal-header">
              <h3 className="cb-modal-title">{modalContent.title}</h3>
              <button
                type="button"
                className="cb-modal-close-btn"
                onClick={handleCloseModal}
                aria-label="Close dialog"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div
              className="cb-modal-body"
              dangerouslySetInnerHTML={{ __html: modalContent.bodyHtml }}
            />
          </div>
        </div>
      )}

    </div>
  );
}
