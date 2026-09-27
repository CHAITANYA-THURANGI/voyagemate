import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export const toast = {
  success: (message) => {
    const event = new CustomEvent('show-toast', { detail: { type: 'success', message } });
    window.dispatchEvent(event);
  },
  error: (message) => {
    const event = new CustomEvent('show-toast', { detail: { type: 'error', message } });
    window.dispatchEvent(event);
  },
  info: (message) => {
    const event = new CustomEvent('show-toast', { detail: { type: 'info', message } });
    window.dispatchEvent(event);
  },
  warning: (message) => {
    const event = new CustomEvent('show-toast', { detail: { type: 'warning', message } });
    window.dispatchEvent(event);
  }
};

export default function Toast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (event) => {
      const { type, message } = event.detail;
      const id = Date.now();
      setToasts(prev => [...prev, { id, type, message }]);
      
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 3000);
    };

    window.addEventListener('show-toast', handleToast);
    return () => window.removeEventListener('show-toast', handleToast);
  }, []);

  if (toasts.length === 0) return null;

  return createPortal(
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-lg shadow-lg text-white transform transition-all duration-300 animate-slideIn ${
            toast.type === 'success' ? 'bg-green-500' :
            toast.type === 'error' ? 'bg-red-500' :
            toast.type === 'warning' ? 'bg-yellow-500' :
            'bg-blue-500'
          }`}
        >
          <div className="flex items-center gap-3">
            {toast.type === 'success' && (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {toast.type === 'error' && (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      ))}
    </div>,
    document.body
  );
}