import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import "./ToastProvider.css";

type ToastType = "success";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const hideToastTimerRef = useRef<number | null>(null);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    if (hideToastTimerRef.current !== null) {
      return;
    }

    const id = Date.now();

    setToasts([
      {
        id,
        message,
        type,
      },
    ]);

    hideToastTimerRef.current = window.setTimeout(() => {
      setToasts([]);
      hideToastTimerRef.current = null;
    }, 1000);
  }, []);

  useEffect(() => {
    return () => {
      if (hideToastTimerRef.current !== null) {
        window.clearTimeout(hideToastTimerRef.current);
      }
    };
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-container" aria-live="polite" aria-atomic="true">
        {toasts.map((toast) => (
          <div
            className={`toast-message toast-message--${toast.type}`}
            key={toast.id}
            role="status"
          >
            <span className="toast-icon" aria-hidden="true">
              <span className="toast-checkmark" />
            </span>
            <span className="toast-content">
              <span className="toast-title">Thông báo</span>
              <span className="toast-text">{toast.message}</span>
            </span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return context;
};
