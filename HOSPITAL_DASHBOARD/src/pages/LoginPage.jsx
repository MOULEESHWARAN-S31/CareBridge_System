import { useEffect } from 'react';

/**
 * CareBridge Unified Architecture:
 * Standalone login is removed. Central Common Login is hosted exclusively on port 3000.
 * Any navigation to /login automatically redirects to http://localhost:3000.
 */
export default function LoginPage() {
  useEffect(() => {
    window.location.replace('http://localhost:3000');
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a0f1d',
      color: '#e2e8f0',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        background: '#131e3a',
        borderRadius: '1rem',
        border: '1px solid rgba(14, 165, 233, 0.3)',
        maxWidth: '420px',
        width: '90%'
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔄</div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#38bdf8', marginBottom: '0.5rem' }}>
          Redirecting to CareBridge Common Login
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '1.25rem' }}>
          Centralized authentication is hosted at <code>http://localhost:3000</code>.
        </p>
        <a
          href="http://localhost:3000"
          style={{
            display: 'inline-block',
            padding: '0.625rem 1.25rem',
            background: '#0284c7',
            color: '#ffffff',
            borderRadius: '0.5rem',
            fontWeight: 600,
            textDecoration: 'none',
            fontSize: '0.875rem'
          }}
        >
          Click if not redirected
        </a>
      </div>
    </div>
  );
}
