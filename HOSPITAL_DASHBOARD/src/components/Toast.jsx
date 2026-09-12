import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <Toast key={t.id} toast={t} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function Toast({ toast, onRemove }) {
  const icons = {
    success: <CheckCircle size={18} color="var(--success)" />,
    error:   <XCircle    size={18} color="var(--danger)" />,
    warning: <AlertTriangle size={18} color="var(--warning)" />,
    info:    <Info       size={18} color="var(--info)" />,
  };
  return (
    <div className={`toast toast-${toast.type}`}>
      {icons[toast.type]}
      <span style={{ flex: 1 }}>{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex' }}
      >
        <X size={14} color="currentColor" />
      </button>
    </div>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
