import { useNavigate } from 'react-router-dom';
import { 
  Heart, Activity, Shield, Phone, Mail, MapPin, Clock,
  Star, Users, Video, FileText, Pill, FlaskConical,
  ArrowRight, CheckCircle, Zap, Globe, ChevronRight, 
  Building2, Stethoscope, AlertTriangle
} from 'lucide-react';

const services = [
  { icon: Video, title: 'Teleconsultation', desc: 'Connect with specialist doctors remotely from anywhere.', color: '#0EA5E9' },
  { icon: FileText, title: 'Digital Health Records', desc: 'Unified patient records accessible across all facilities.', color: '#0D9488' },
  { icon: FlaskConical, title: 'Diagnostics', desc: 'Advanced lab testing and imaging at your fingertips.', color: '#6366F1' },
  { icon: Pill, title: 'Pharmacy', desc: 'Track medicine inventory and prescription management.', color: '#F59E0B' },
  { icon: Activity, title: 'Symptom Triage', desc: 'AI-powered symptom assessment for faster care decisions.', color: '#EF4444' },
  { icon: ArrowRight, title: 'Referral System', desc: 'Seamless patient referrals across the healthcare chain.', color: '#10B981' },
];

const whyUs = [
  { icon: Shield, title: 'Secure & Private', desc: 'End-to-end encrypted patient data with full HIPAA compliance.' },
  { icon: Zap, title: 'Real-Time Updates', desc: 'Instant notifications and live health status across facilities.' },
  { icon: Globe, title: 'Connected Network', desc: 'Sub-centre to District Hospital – all connected seamlessly.' },
  { icon: CheckCircle, title: 'Proven Results', desc: 'Trusted by 48+ healthcare facilities across Punjab, India.' },
];

const stats = [
  { value: '48+', label: 'Healthcare Facilities' },
  { value: '12,480', label: 'Patients Served' },
  { value: '98%', label: 'Patient Satisfaction' },
  { value: '24/7', label: 'Emergency Support' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing" style={{ background: '#F0F9FF', minHeight: '100vh' }}>
      {/* Header */}
      <header className="landing-nav">
        <div className="landing-nav-inner">
          <div className="landing-logo">
            <div className="landing-logo-icon"><Heart size={22} fill="white" color="white" /></div>
            <div>
              <div className="landing-brand">CareConnect</div>
              <div className="landing-brand-sub">Hospital</div>
            </div>
          </div>
          <nav className="landing-menu">
            <a href="#services">Services</a>
            <a href="#why">Why Us</a>
            <a href="#contact">Contact</a>
            <a href="#emergency">Emergency</a>
          </nav>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/login')}>Login</button>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/dashboard')}>Dashboard →</button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero-section medical-bg">
        {/* Medical BG decorations */}
        <MedicalDecorations />
        <div className="hero-content animate-fade-in-up">
          <div className="hero-badge">
            <span className="status-dot online" />
            <span>Smart India Hackathon 2026 Project</span>
          </div>
          <h1 className="hero-title">
            Your Health,<br />
            <span className="gradient-text">Connected.</span>
          </h1>
          <p className="hero-subtitle">
            Smart, accessible and connected healthcare for everyone.<br />
            Bridging the gap from Sub-centre to District Hospital.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/dashboard/appointments')}>
              <Clock size={18} /> Book Appointment
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => navigate('/dashboard/doctors')}>
              <Stethoscope size={18} /> Find a Doctor
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => navigate('/login')}>
              Patient Login
            </button>
            <button className="btn btn-ghost btn-lg" onClick={() => navigate('/login')}>
              Hospital Login
            </button>
          </div>
          {/* Stats */}
          <div className="hero-stats">
            {stats.map((s, i) => (
              <div key={i} className="hero-stat">
                <div className="hero-stat-value">{s.value}</div>
                <div className="hero-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Hero Illustration */}
        <div className="hero-illustration">
          <HeroIllustration />
        </div>
      </section>

      {/* Healthcare Chain */}
      <section style={{ padding: '60px 40px', background: 'white' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ marginBottom: 12 }}>Connected Healthcare Chain</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 40 }}>
            CareConnect links every level of the healthcare system into one unified platform.
          </p>
          <div className="chain-flow">
            {['Sub-centre', 'PHC', 'Rural Hospital', 'District Hospital'].map((name, i, arr) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="chain-node">
                  <Building2 size={24} color="var(--primary)" />
                  <span>{name}</span>
                </div>
                {i < arr.length - 1 && (
                  <ChevronRight size={24} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" style={{ padding: '80px 40px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2>Our Services</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>Comprehensive healthcare management at every level</p>
          </div>
          <div className="grid grid-3">
            {services.map((s, i) => (
              <div key={i} className="service-card card" onClick={() => navigate('/dashboard')}>
                <div className="service-icon" style={{ background: s.color + '18', color: s.color }}>
                  <s.icon size={28} />
                </div>
                <h4 style={{ marginTop: 16, marginBottom: 8 }}>{s.title}</h4>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{s.desc}</p>
                <div style={{ marginTop: 14, color: s.color, fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                  Learn more <ChevronRight size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section id="why" style={{ padding: '80px 40px', background: 'white' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2>Why Choose CareConnect?</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>Built for India's connected healthcare future</p>
          </div>
          <div className="grid grid-4">
            {whyUs.map((w, i) => (
              <div key={i} className="why-card card" style={{ textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, background: 'var(--primary-light)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <w.icon size={26} color="var(--primary)" />
                </div>
                <h4 style={{ marginBottom: 8 }}>{w.title}</h4>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Banner */}
      <section id="emergency" style={{ padding: '48px 40px', background: 'linear-gradient(135deg, #EF4444, #DC2626)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <AlertTriangle size={28} color="white" />
              <h3 style={{ color: 'white', fontSize: '1.4rem' }}>24/7 Emergency Support</h3>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>
              Immediate emergency care, ambulance dispatch, and specialist consultation available round-the-clock.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-lg" style={{ background: 'white', color: '#EF4444', fontWeight: 700 }}
              onClick={() => navigate('/dashboard/emergency')}>
              <Phone size={18} /> Call Emergency
            </button>
            <button className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '2px solid rgba(255,255,255,0.4)' }}
              onClick={() => navigate('/dashboard/emergency')}>
              Request Ambulance
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" style={{ background: '#0F172A', color: 'rgba(255,255,255,0.7)', padding: '60px 40px 30px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="grid grid-4" style={{ marginBottom: 48 }}>
            <div>
              <div className="landing-logo" style={{ marginBottom: 16 }}>
                <div className="landing-logo-icon"><Heart size={20} fill="white" color="white" /></div>
                <div><div style={{ color: 'white', fontWeight: 700 }}>CareConnect</div><div style={{ fontSize: 10, opacity: 0.5 }}>Hospital</div></div>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.7 }}>Connected Healthcare. Better Care. Empowering communities through accessible digital health solutions.</p>
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 600, marginBottom: 16 }}>Quick Links</div>
              {['Dashboard', 'Patients', 'Doctors', 'Appointments', 'Pharmacy'].map(l => (
                <div key={l} style={{ marginBottom: 8, fontSize: 13, cursor: 'pointer' }}
                  onClick={() => navigate('/dashboard')}>
                  <ChevronRight size={12} style={{ marginRight: 4, opacity: 0.5 }} />{l}
                </div>
              ))}
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 600, marginBottom: 16 }}>Services</div>
              {['Teleconsultation', 'Digital Records', 'Lab Services', 'Pharmacy', 'Referrals'].map(l => (
                <div key={l} style={{ marginBottom: 8, fontSize: 13 }}><ChevronRight size={12} style={{ marginRight: 4, opacity: 0.5 }} />{l}</div>
              ))}
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 600, marginBottom: 16 }}>Contact</div>
              <div style={{ fontSize: 13, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Phone size={14} /> +91 1800-CARE-CONNECT
              </div>
              <div style={{ fontSize: 13, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Mail size={14} /> care@careconnect.in
              </div>
              <div style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                <MapPin size={14} /> District Hospital, Punjab, India
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', fontSize: 12, flexWrap: 'wrap', gap: 8 }}>
            <span>© 2026 CareConnect Hospital. Smart India Hackathon 2026.</span>
            <span>Built with ❤️ for better healthcare in India</span>
          </div>
        </div>
      </footer>

      <style>{`
        .landing-nav {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-light);
          box-shadow: var(--shadow-sm);
        }
        .landing-nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 32px;
          height: 68px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }
        .landing-logo { display: flex; align-items: center; gap: 12px; text-decoration: none; }
        .landing-logo-icon {
          width: 40px; height: 40px;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 14px rgba(14,165,233,0.4);
        }
        .landing-brand { font-size: 16px; font-weight: 700; color: var(--text-primary); line-height: 1.2; }
        .landing-brand-sub { font-size: 9px; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); }
        .landing-menu { display: flex; gap: 28px; }
        .landing-menu a { font-size: 14px; font-weight: 500; color: var(--text-secondary); text-decoration: none; transition: var(--transition); }
        .landing-menu a:hover { color: var(--primary); }
        
        .hero-section {
          min-height: calc(100vh - 68px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 60px 80px;
          gap: 60px;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 50%, #CCFBF1 100%);
        }
        .hero-content { flex: 1; max-width: 600px; }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--primary-light);
          color: var(--primary-dark);
          padding: 6px 16px;
          border-radius: var(--radius-full);
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 24px;
          border: 1px solid rgba(14,165,233,0.2);
        }
        .hero-title {
          font-size: clamp(2.8rem, 5vw, 4.5rem);
          font-weight: 800;
          line-height: 1.1;
          color: var(--text-primary);
          margin-bottom: 20px;
        }
        .gradient-text {
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-subtitle {
          font-size: 17px;
          color: var(--text-secondary);
          line-height: 1.7;
          margin-bottom: 36px;
        }
        .hero-buttons { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 48px; }
        .hero-stats {
          display: flex;
          gap: 36px;
          flex-wrap: wrap;
        }
        .hero-stat-value { font-size: 1.8rem; font-weight: 800; color: var(--primary); }
        .hero-stat-label { font-size: 12px; color: var(--text-muted); font-weight: 500; }
        
        .hero-illustration {
          flex-shrink: 0;
          width: 440px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .chain-flow {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .chain-node {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 20px 24px;
          background: var(--primary-light);
          border-radius: var(--radius-md);
          font-size: 13px;
          font-weight: 600;
          color: var(--primary-dark);
          min-width: 130px;
          border: 1px solid rgba(14,165,233,0.2);
        }
        .service-card { cursor: pointer; transition: var(--transition); }
        .service-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); }
        .service-icon {
          width: 60px;
          height: 60px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .why-card { transition: var(--transition); }
        .why-card:hover { transform: translateY(-3px); }
        @media (max-width: 1024px) {
          .hero-section { padding: 50px 40px; }
          .hero-illustration { width: 320px; }
        }
        @media (max-width: 768px) {
          .hero-section { flex-direction: column; padding: 40px 20px; text-align: center; }
          .hero-illustration { width: 100%; max-width: 300px; }
          .hero-buttons { justify-content: center; }
          .hero-stats { justify-content: center; }
          .landing-menu { display: none; }
          .landing-nav-inner { padding: 0 16px; }
          .chain-flow { gap: 6px; }
        }
      `}</style>
    </div>
  );
}

function HeroIllustration() {
  return (
    <svg viewBox="0 0 440 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: 440 }}>
      {/* Hospital building */}
      <rect x="60" y="120" width="320" height="240" rx="16" fill="#E0F2FE" stroke="#BAE6FD" strokeWidth="2"/>
      <rect x="90" y="140" width="260" height="200" rx="12" fill="white" opacity="0.8"/>
      {/* Cross on roof */}
      <rect x="200" y="80" width="40" height="60" rx="6" fill="white" stroke="#BAE6FD" strokeWidth="2"/>
      <rect x="185" y="95" width="70" height="30" rx="6" fill="white" stroke="#BAE6FD" strokeWidth="2"/>
      <rect x="210" y="90" width="20" height="50" rx="4" fill="#0EA5E9"/>
      <rect x="196" y="104" width="48" height="20" rx="4" fill="#0EA5E9"/>
      {/* Windows */}
      <rect x="110" y="170" width="50" height="40" rx="6" fill="#BAE6FD"/>
      <rect x="195" y="170" width="50" height="40" rx="6" fill="#BAE6FD"/>
      <rect x="280" y="170" width="50" height="40" rx="6" fill="#BAE6FD"/>
      <rect x="110" y="230" width="50" height="40" rx="6" fill="#BAE6FD"/>
      <rect x="280" y="230" width="50" height="40" rx="6" fill="#BAE6FD"/>
      {/* Door */}
      <rect x="185" y="290" width="70" height="70" rx="6" fill="#0EA5E9" opacity="0.4"/>
      <rect x="190" y="295" width="60" height="65" rx="5" fill="#0D9488" opacity="0.5"/>
      {/* Doctor figure */}
      <circle cx="370" cy="200" r="28" fill="#E0F2FE"/>
      <circle cx="370" cy="188" r="14" fill="#BAE6FD"/>
      <path d="M345 235 Q370 220 395 235 L395 265 Q370 255 345 265Z" fill="#0EA5E9" opacity="0.6"/>
      <rect x="362" y="210" width="16" height="6" rx="3" fill="white"/>
      <rect x="365" y="204" width="10" height="18" rx="3" fill="white"/>
      {/* Stethoscope */}
      <path d="M380 220 Q395 230 395 250 Q395 268 375 268" stroke="#0D9488" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <circle cx="372" cy="270" r="6" fill="#0D9488"/>
      {/* Heartbeat line */}
      <path d="M100 340 L130 340 L145 310 L160 370 L175 330 L185 340 L340 340" 
        stroke="#0EA5E9" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Floating pills */}
      <rect x="30" y="200" width="30" height="14" rx="7" fill="#6366F1" opacity="0.4" transform="rotate(-20 45 207)"/>
      <rect x="40" y="240" width="24" height="12" rx="6" fill="#0D9488" opacity="0.4" transform="rotate(10 52 246)"/>
      {/* Syringe */}
      <rect x="25" y="290" width="50" height="8" rx="4" fill="#0EA5E9" opacity="0.3" transform="rotate(-30 50 294)"/>
      <rect x="65" y="280" width="6" height="20" rx="3" fill="#0EA5E9" opacity="0.4" transform="rotate(-30 68 290)"/>
    </svg>
  );
}

function MedicalDecorations() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
      {/* ECG line */}
      <svg style={{ position: 'absolute', bottom: 80, left: 0, right: 0, width: '100%', opacity: 0.06 }} viewBox="0 0 1200 100" preserveAspectRatio="none">
        <path d="M0 50 L200 50 L220 20 L240 80 L260 20 L280 50 L400 50 L420 30 L440 70 L460 30 L480 50 L700 50 L720 15 L740 85 L760 15 L780 50 L1000 50 L1020 25 L1040 75 L1060 25 L1080 50 L1200 50"
          stroke="#0EA5E9" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {/* Large faint cross */}
      <div style={{ position: 'absolute', top: 60, right: 80, opacity: 0.04, fontSize: 180, color: '#0EA5E9', fontWeight: 900, lineHeight: 1 }}>+</div>
      {/* Circles */}
      <div style={{ position: 'absolute', bottom: -60, left: -60, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.08), transparent)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: -80, right: -80, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(13,148,136,0.06), transparent)', pointerEvents: 'none' }} />
    </div>
  );
}
