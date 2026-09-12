import { useEffect } from 'react';

/**
 * CareBridge Government Dashboard — Common Login Redirector
 * Requirement 1 & 8: Single Common Login architecture enforces http://localhost:3000 as the sole authentication interface.
 * Any manual navigation to /login redirects directly to Common Login.
 */
export default function Login() {
  useEffect(() => {
    window.location.href = 'http://localhost:3000';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white font-sans p-4">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm text-slate-400">Redirecting to CareBridge Common Login...</p>
      </div>
    </div>
  );
}
