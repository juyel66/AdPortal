import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "../../lib/axios";
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

const apiKeyMap: Record<NotificationKey, string> = {
  campaignAlerts: "campaign_performance",
  budgetAlerts: "budget_alerts",
  weeklyReports: "weekly_performance_summary",
  aiRecommendations: "ai_recommendations",
  teamActivity: "team_activity",
};

const reverseApiKeyMap: Record<string, NotificationKey> = {
  campaign_performance: "campaignAlerts",
  budget_alerts: "budgetAlerts",
  weekly_performance_summary: "weeklyReports",
  ai_recommendations: "aiRecommendations",
  team_activity: "teamActivity",
};

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

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchNotificationSettings();
  }, []);

  const fetchNotificationSettings = async () => {
    try {
      setFetching(true);
      const response = await api.get("/accounts/notification-settings/");
      
      const apiSettings = response.data;
      const newEnabled: Record<NotificationKey, boolean> = {
        campaignAlerts: false,
        budgetAlerts: false,
        weeklyReports: false,
        aiRecommendations: false,
        teamActivity: false,
      };

      Object.keys(apiSettings).forEach((apiKey) => {
        const uiKey = reverseApiKeyMap[apiKey];
        if (uiKey) {
          newEnabled[uiKey] = apiSettings[apiKey];
        }
      });

      setEnabled(newEnabled);
    } catch (error) {
      console.error("Error fetching notification settings:", error);
      toast.error("Failed to load notification settings");
    } finally {
      setFetching(false);
    }
  };

  const toggle = async (key: NotificationKey) => {
    const newValue = !enabled[key];
    const apiKey = apiKeyMap[key];
    
    setLoading(true);
    
    try {
      const updateData = { [apiKey]: newValue };
      
      await api.patch("/accounts/notification-settings/", updateData);
      
      setEnabled(prev => ({
        ...prev,
        [key]: newValue
      }));
      
      toast.success("Notification setting updated");
    } catch (error) {
      console.error("Error updating notification setting:", error);
      toast.error("Failed to update notification setting");
    } finally {
      setLoading(false);
    }
  };

  const toggleAll = async () => {
    const allCurrentlyEnabled = Object.values(enabled).every(v => v);
    const newValue = !allCurrentlyEnabled;
    
    setLoading(true);
    
    try {
      const updateData: Record<string, boolean> = {};
      Object.keys(apiKeyMap).forEach(uiKey => {
        const apiKey = apiKeyMap[uiKey as NotificationKey];
        updateData[apiKey] = newValue;
      });
      
      await api.patch("/accounts/notification-settings/", updateData);
      
      const newEnabled = Object.keys(enabled).reduce((acc, key) => {
        acc[key as NotificationKey] = newValue;
        return acc;
      }, {} as Record<NotificationKey, boolean>);
      
      setEnabled(newEnabled);
      
      toast.success(newValue ? "All notifications enabled" : "All notifications disabled");
    } catch (error) {
      console.error("Error updating all notifications:", error);
      toast.error("Failed to update notifications");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="rounded-xl bg-white p-6">
        <div className="flex justify-center items-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-solid border-blue-600 border-r-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white p-6">
      <h2 className="text-base font-semibold text-slate-900 mb-6">
        Notification Preferences
      </h2>

      <div className="space-y-4">
        {notificationItems.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between rounded-xl border border-slate-200 p-4 hover:bg-slate-50 transition-colors"
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
              disabled={loading}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition disabled:opacity-50 ${
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

      <div className="mt-6 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-900">All Notifications</p>
            <p className="text-xs text-slate-500">Enable or disable all notifications at once</p>
          </div>
          
          <button
            onClick={toggleAll}
            disabled={loading}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
          >
            {Object.values(enabled).every(v => v) ? "Disable All" : "Enable All"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notifications;