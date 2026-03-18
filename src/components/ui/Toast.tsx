'use client';
// src/components/ui/Toast.tsx
import { useEffect } from 'react';
import { useToastState, registerToast, type Toast } from '@/hooks/useToast';

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const icons: Record<Toast['type'], string> = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  };

  const colors: Record<Toast['type'], string> = {
    success: 'bg-emerald-600',
    error: 'bg-red-600',
    info: 'bg-brand-600',
  };

  return (
    <div className="flex items-center gap-3 min-w-[220px] max-w-xs bg-slate-900 dark:bg-slate-700 text-white px-4 py-3 rounded-xl shadow-lg animate-slide-up">
      <span className={`${colors[toast.type]} w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0`}>
        {icons[toast.type]}
      </span>
      <span className="text-sm font-medium flex-1">{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-slate-400 hover:text-white transition-colors text-lg leading-none flex-shrink-0"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const { toasts, addToast, removeToast } = useToastState();

  useEffect(() => {
    registerToast(addToast);
  }, [addToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 items-end pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} onRemove={removeToast} />
        </div>
      ))}
    </div>
  );
}
