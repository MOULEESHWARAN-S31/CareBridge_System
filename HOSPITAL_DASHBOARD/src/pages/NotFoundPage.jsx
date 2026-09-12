import { Link } from 'react-router-dom';
import { Heart, ArrowLeft, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', padding: 40, background: 'linear-gradient(135deg, #F0F9FF, #E0F2FE)',
      fontFamily: 'Poppins, Inter, sans-serif',
    }}>
      {/* Background decoration */}
      <svg style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', opacity: 0.03, pointerEvents: 'none' }} viewBox="0 0 800 600">
        <text x="200" y="300" fontSize="200" fill="#0EA5E9">404</text>
      </svg>

      <div style={{
        background: 'white', borderRadius: 24, padding: '48px 56px', boxShadow: '0 24px 80px rgba(14,165,233,0.12)',
        maxWidth: 520, width: '100%', textAlign: 'center', position: 'relative',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 32 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #0EA5E9, #0D9488)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(14,165,233,0.35)' }}>
            <Heart size={20} fill="white" color="white" />
          </div>
          <div style={{ fontWeight: 800, fontSize: 15, color: '#1E293B' }}>CareConnect Hospital</div>
        </div>

        {/* 404 number */}
        <div style={{ fontSize: 80, fontWeight: 900, color: '#0EA5E9', lineHeight: 1, marginBottom: 8, letterSpacing: '-4px' }}>
          404
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1E293B', marginBottom: 10 }}>
          Page Not Found
        </h1>
        <p style={{ color: '#64748B', fontSize: 14, lineHeight: 1.7, marginBottom: 32 }}>
          The page you're looking for doesn't exist in the hospital portal.
          You may have followed a broken link or typed an incorrect URL.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/login"
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'linear-gradient(135deg, #0EA5E9, #0D9488)', color: 'white',
              borderRadius: 12, padding: '12px 24px', fontWeight: 700, fontSize: 14,
              textDecoration: 'none', boxShadow: '0 4px 14px rgba(14,165,233,0.3)',
              transition: 'transform 0.2s',
            }}
          >
            <Home size={16} /> Go to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'white', color: '#0EA5E9', border: '2px solid #E0F2FE',
              borderRadius: 12, padding: '12px 24px', fontWeight: 700, fontSize: 14,
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            <ArrowLeft size={16} /> Go Back
          </button>
        </div>

        <div style={{ marginTop: 32, fontSize: 11, color: '#CBD5E1' }}>
          Smart India Hackathon 2024 · CareConnect Healthcare Platform
        </div>
      </div>
    </div>
  );
}
