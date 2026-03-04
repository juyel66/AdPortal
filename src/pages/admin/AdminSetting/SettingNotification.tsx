import api from "@/lib/axios";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";


type ToggleItem = {
  id: string;
  title: string;
  description: string;
  apiKey: string; 
};

const NOTIFICATIONS: ToggleItem[] = [
  {
    id: "new_users",
    title: "New User Signups",
    description: "Get notified when new users register",
    apiKey: "new_user_signup",
  },
  {
    id: "failed_payments",
    title: "Failed Payments",
    description: "Alert when payment processing fails",
    apiKey: "failed_payment",
  },
  {
    id: "system_errors",
    title: "System Errors",
    description: "Critical system error notifications",
    apiKey: "system_errors",
  },
  {
    id: "security_alerts",
    title: "Security Alerts",
    description: "Suspicious activity warnings",
    apiKey: "security_alerts",
  },
];

const SettingNotification: React.FC = () => {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    new_users: true,
    failed_payments: true,
    system_errors: true,
    security_alerts: true,
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [initialLoad, setInitialLoad] = useState(true);

  // Fetch notification settings on component mount
  useEffect(() => {
    fetchNotificationSettings();
  }, []);

  const fetchNotificationSettings = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/notification-settings/");
      
      if (response.data) {
        // Assuming the API returns an object with notification settings
        // You might need to adjust this based on the actual API response structure
        const settings = response.data;
        
        setEnabled({
          new_users: settings.new_user_signup ?? true,
          failed_payments: settings.failed_payment ?? true,
          system_errors: settings.system_errors ?? true,
          security_alerts: settings.security_alerts ?? true,
        });
      }
    } catch (error: any) {
      console.error("Error fetching notification settings:", error);
      
      // Only show error toast if it's not the initial load with no settings
      if (!initialLoad || error.response?.status !== 404) {
        toast.error("Failed to load notification settings", {
          duration: 4000,
          position: "top-center",
        });
      }
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  const saveNotificationSetting = async (id: string, value: boolean) => {
    setSaving(prev => ({ ...prev, [id]: true }));
    
    try {
      // First, get the current settings to preserve other values
      const notification = NOTIFICATIONS.find(n => n.id === id);
      if (!notification) return;

      // Prepare the data object with all current settings
      const settingsData = {
        new_user_signup: enabled.new_users,
        failed_payment: enabled.failed_payments,
        system_errors: enabled.system_errors,
        security_alerts: enabled.security_alerts,
      };

      // Update the specific setting
      settingsData[notification.apiKey as keyof typeof settingsData] = value;

      // Send to API
      const response = await api.put("/admin/notification-settings/", settingsData);
      
      if (response.status === 200 || response.status === 201) {
        toast.success(`${notification.title} ${value ? 'enabled' : 'disabled'} successfully`, {
          duration: 3000,
          position: "top-center",
        });
      }
    } catch (error: any) {
      console.error("Error saving notification setting:", error);
      
      // Revert the toggle on error
      setEnabled(prev => ({ ...prev, [id]: !value }));
      
      // Show error message
      if (error.response?.data) {
        const errorData = error.response.data;
        const errorMessage = Object.values(errorData).flat()[0] || "Failed to save setting";
        toast.error(errorMessage, {
          duration: 4000,
          position: "top-center",
        });
      } else if (error.message === "Network Error") {
        toast.error("Network error. Please check your connection.", {
          duration: 4000,
          position: "top-center",
        });
      } else {
        toast.error("Failed to save notification setting", {
          duration: 4000,
          position: "top-center",
        });
      }
    } finally {
      setSaving(prev => ({ ...prev, [id]: false }));
    }
  };

  const toggle = async (id: string) => {
    const newValue = !enabled[id];
    
    // Optimistically update UI
    setEnabled((prev) => ({ ...prev, [id]: newValue }));
    
    // Save to API
    await saveNotificationSetting(id, newValue);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-base font-semibold text-slate-900">
          Notification Preferences
        </h2>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-xl border bg-white px-4 py-3 animate-pulse"
            >
              <div className="space-y-2">
                <div className="h-4 w-32 bg-slate-200 rounded"></div>
                <div className="h-3 w-48 bg-slate-200 rounded"></div>
              </div>
              <div className="h-5 w-9 bg-slate-200 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold text-slate-900">
        Notification Preferences
      </h2>

      <div className="space-y-3">
        {NOTIFICATIONS.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-xl border bg-white px-4 py-3"
          >
            {/* TEXT */}
            <div>
              <p className="text-sm font-medium text-slate-900">
                {item.title}
              </p>
              <p className="text-xs text-slate-500">
                {item.description}
              </p>
            </div>

            {/* TOGGLE with loading state */}
            <button
              onClick={() => toggle(item.id)}
              disabled={saving[item.id]}
              className={`relative h-5 w-9 rounded-full transition ${
                enabled[item.id] ? "bg-blue-600" : "bg-slate-300"
              } ${saving[item.id] ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <span
                className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition ${
                  enabled[item.id] ? "left-4" : "left-0.5"
                } ${saving[item.id] ? "scale-90" : ""}`}
              />
            </button>
          </div>
        ))}
      </div>

      {/* Save All Button (Alternative approach) */}
      <div className="flex justify-end pt-4 border-t border-slate-100">
        <button
          onClick={fetchNotificationSettings}
          className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
          </svg>
          Refresh
        </button>
      </div>
    </div>
  );
};

export default SettingNotification;