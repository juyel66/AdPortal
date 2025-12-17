import React, { useState } from "react";
import type {
  NotificationItem,
  NotificationKey,
} from "../../types/notifications";



const notificationItems: NotificationItem[] = [
  {
    key: "campaignAlerts",
    title: "Campaign performance alerts",
    description:
      "Get notified when campaigns exceed or fall below thresholds",
  },
  {
    key: "budgetAlerts",
    title: "Budget alerts",
    description:
      "Receive alerts when campaigns reach budget limits",
  },
  {
    key: "weeklyReports",
    title: "Weekly performance reports",
    description:
      "Get weekly summaries of your campaign performance",
  },
  {
    key: "aiRecommendations",
    title: "AI recommendations",
    description:
      "Receive AI-powered optimization suggestions",
  },
  {
    key: "teamActivity",
    title: "Team activity",
    description:
      "Get notified when team members make changes",
  },
];





const Notifications: React.FC = () => {
  const [enabled, setEnabled] = useState<
    Record<NotificationKey, boolean>
  >({
    campaignAlerts: true,
    budgetAlerts: true,
    weeklyReports: true,
    aiRecommendations: true,
    teamActivity: true,
  });

  const toggle = (key: NotificationKey) => {
    setEnabled((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="rounded-xl  bg-white p-6">
      <h2 className="text-base font-semibold text-slate-900 mb-6">
        Notification Preferences
      </h2>

      <div className="space-y-4">
        {notificationItems.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between rounded-xl border p-4"
          >
     
            <div>
              <p className="text-sm font-medium text-slate-900">
                {item.title}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {item.description}
              </p>
            </div>


            <button
              onClick={() => toggle(item.key)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${
                enabled[item.key]
                  ? "bg-blue-600"
                  : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  enabled[item.key]
                    ? "translate-x-4"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
