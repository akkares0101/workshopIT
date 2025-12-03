// src/AlertContext.jsx
import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

const AlertContext = createContext(null);

export function AlertProvider({ children }) {
  const [alerts, setAlerts] = useState([]);

  const showAlert = useCallback((message, type = "info") => {
    const id = Date.now() + Math.random();
    const alert = { id, message, type };
    setAlerts((prev) => [...prev, alert]);

    // auto ปิดเองใน 3 วิ
    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    }, 3000);
  }, []);

  const removeAlert = useCallback((id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return (
    <AlertContext.Provider value={{ alerts, showAlert, removeAlert }}>
      {children}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  return useContext(AlertContext);
}

// กล่องแสดง alert น่ารัก ๆ ด้านบน
export function AlertContainer() {
  const { alerts, removeAlert } = useAlert();
  if (!alerts || alerts.length === 0) return null;

  const getStyle = (type) => {
    switch (type) {
      case "success":
        return "bg-emerald-100/90 border-emerald-200 text-emerald-800";
      case "error":
        return "bg-rose-100/90 border-rose-200 text-rose-800";
      case "warning":
        return "bg-amber-100/90 border-amber-200 text-amber-800";
      default:
        return "bg-sky-100/90 border-sky-200 text-sky-800";
    }
  };

  const getEmoji = (type) => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "⚠️";
      case "warning":
        return "🤔";
      default:
        return "🔔";
    }
  };

  return (
    <div className="fixed inset-x-0 top-3 sm:top-4 z-50 flex justify-center sm:justify-end px-3 pointer-events-none">
      <div className="flex flex-col gap-2 w-full sm:max-w-sm pointer-events-auto">
        {alerts.map((a) => (
          <div
            key={a.id}
            className={`flex items-start gap-2 rounded-2xl border px-3 py-2 shadow-md ${getStyle(
              a.type
            )}`}
          >
            <div className="text-lg">{getEmoji(a.type)}</div>
            <div className="flex-1 text-xs sm:text-sm leading-snug">
              {a.message}
            </div>
            <button
              className="text-xs px-1 rounded-full hover:bg-white/40"
              onClick={() => removeAlert(a.id)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
