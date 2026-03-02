import React from "react";
import { ArrowRight } from "lucide-react";
import type { RecentCampaignItem, SystemStatusItem } from "@/types/admin.types";

interface AdminRecentCampaignProps {
  recentCampaigns: RecentCampaignItem[];
  systemStatus: SystemStatusItem[];
}

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

const AdminRecentCampaign: React.FC<AdminRecentCampaignProps> = ({ 
  recentCampaigns, 
  systemStatus 
}) => {
  // If no data is provided, show empty states
  if (!recentCampaigns?.length && !systemStatus?.length) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border bg-white p-8">
          <div className="text-center">
            <p className="text-sm text-slate-500">No recent activity found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Recent Campaigns Section */}
      {recentCampaigns && recentCampaigns.length > 0 && (
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
                className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-1.5 h-2 w-2 rounded-full ${statusDot(
                      item.status
                    )}`}
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-500">{item.userEmail}</p>
                    {item.platform && (
                      <p className="text-xs text-slate-400 mt-1">
                        Platform: {item.platform}
                      </p>
                    )}
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
      )}

      {/* System Status Section */}
      {systemStatus && systemStatus.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {systemStatus.map((item) => (
            <div key={item.id} className="rounded-xl border bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{item.title}</p>
                <span className="text-green-500 text-xs">
                  <img 
                    src={item.icon || "https://res.cloudinary.com/dqkczdjjs/image/upload/v1766006414/Icon_16_g05wvp.png"} 
                    alt="status" 
                    className="w-4 h-4"
                  />
                </span>
              </div>

              <p className="mt-1 text-sm font-semibold text-slate-900">
                {item.status}
              </p>
              <p className="mt-1 text-xs text-slate-500">{item.uptime}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminRecentCampaign;