import React from "react";
import { ArrowRight } from "lucide-react";

import type {
  RecentCampaignItem,
  SystemStatusItem,
} from "@/types/recentCampaign";

/* =========================
   FAKE DATA (API READY)
========================= */

const recentCampaigns: RecentCampaignItem[] = [
  {
    id: 1,
    title: "Created new campaign",
    userEmail: "john@example.com",
    timeAgo: "2 mins ago",
    status: "success",
  },
  {
    id: 2,
    title: "Upgraded to Scale plan",
    userEmail: "sarah@example.com",
    timeAgo: "15 mins ago",
    amount: "$199",
    status: "success",
  },
  {
    id: 3,
    title: "Campaign budget exceeded",
    userEmail: "mike@example.com",
    timeAgo: "1 hour ago",
    status: "warning",
  },
  {
    id: 4,
    title: "Connected Google Ads",
    userEmail: "emily@example.com",
    timeAgo: "2 hours ago",
    status: "success",
  },
  {
    id: 5,
    title: "Subscription renewal failed",
    userEmail: "david@example.com",
    timeAgo: "3 hours ago",
    status: "error",
  },
];

const systemStatus: SystemStatusItem[] = [
  {
    id: 1,
    title: "API Status",
    status: "Operational",
    uptime: "Uptime: 99.9%",
  },
  {
    id: 2,
    title: "Database",
    status: "Operational",
    uptime: "Uptime: 100%",
  },
  {
    id: 3,
    title: "Meta API",
    status: "Operational",
    uptime: "Uptime: 99.8%",
  },
];

/* =========================
   HELPERS
========================= */

const statusDot = (status: RecentCampaignItem["status"]) => {
  switch (status) {
    case "success":
      return "bg-green-500";
    case "warning":
      return "bg-yellow-500";
    case "error":
      return "bg-red-500";
    default:
      return "bg-blue-500";
  }
};

/* =========================
   COMPONENT
========================= */

const AdminRecentCampaign: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* =========================
         RECENT CAMPAIGNS
      ========================= */}
      <div className="rounded-xl border bg-white">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-sm font-semibold text-slate-900">
            Recent Campaigns
          </h2>
          <button className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
            View all <ArrowRight size={14} />
          </button>
        </div>

        <div className="divide-y">
          {recentCampaigns.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between px-6 py-4"
            >
              <div className="flex items-start gap-3">
                <span
                  className={`mt-1 h-2 w-2 rounded-full ${statusDot(
                    item.status
                  )}`}
                />
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-500">{item.userEmail}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                {item.amount && (
                  <span className="font-medium text-green-600">
                    {item.amount}
                  </span>
                )}
                <span className="text-xs text-slate-400">{item.timeAgo}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {systemStatus.map((item) => (
          <div key={item.id} className="rounded-xl border bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">{item.title}</p>
              <span className="text-green-500 text-xs"> <img src="https://res.cloudinary.com/dqkczdjjs/image/upload/v1766006414/Icon_16_g05wvp.png" alt="" /></span>
            </div>

            <p className="mt-1 text-sm font-semibold text-slate-900">
              {item.status}
            </p>
            <p className="mt-1 text-xs text-slate-500">{item.uptime}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminRecentCampaign;
