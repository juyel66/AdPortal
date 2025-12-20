import React, { useState } from "react";

type ToggleItem = {
  id: string;
  title: string;
  description: string;
};

const NOTIFICATIONS: ToggleItem[] = [
  {
    id: "new_users",
    title: "New User Signups",
    description: "Get notified when new users register",
  },
  {
    id: "failed_payments",
    title: "Failed Payments",
    description: "Alert when payment processing fails",
  },
  {
    id: "system_errors",
    title: "System Errors",
    description: "Critical system error notifications",
  },
  {
    id: "security_alerts",
    title: "Security Alerts",
    description: "Suspicious activity warnings",
  },
];

const SettingNotification: React.FC = () => {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    new_users: true,
    failed_payments: true,
    system_errors: true,
    security_alerts: true,
  });

  const toggle = (id: string) => {
    setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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

            {/* TOGGLE */}
            <button
              onClick={() => toggle(item.id)}
              className={`relative h-5 w-9 rounded-full transition ${
                enabled[item.id] ? "bg-blue-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition ${
                  enabled[item.id] ? "left-4" : "left-0.5"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingNotification;
