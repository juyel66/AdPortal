import React from "react";
import {
  Play,
  Pause,
 
} from "lucide-react";

import type {
  CampaignItem,
  CampaignStatus,
  PlatformType,
} from "@/types/campaignMonitoring";


const statusBadge = (status: CampaignStatus) => {
  if (status === "active") return "bg-green-100 text-green-700";
  if (status === "paused") return "bg-yellow-100 text-yellow-700";
  return "bg-slate-100 text-slate-600";
};

const platformIcon = (platform: PlatformType) => {
  if (platform === "meta")
    return (
      <img
        src="https://res.cloudinary.com/dqkczdjjs/image/upload/v1765754457/Container_10_m3mnnq.png"
        className="h-5 w-5"
        alt="Meta"
      />
    );

  if (platform === "google")
    return (
      <img
        src="https://res.cloudinary.com/dqkczdjjs/image/upload/v1765754457/Container_11_bdja1x.png"
        className="h-5 w-5"
        alt="Google"
      />
    );

  return (
    <img
      src="https://res.cloudinary.com/dqkczdjjs/image/upload/v1765754457/Container_12_siwhfp.png"
      className="h-5 w-5"
      alt="TikTok"
    />
  );
};

/* =========================
   COMPONENT
========================= */

interface Props {
  campaigns: CampaignItem[];
}

const RecentCampaignsTable: React.FC<Props> = ({ campaigns }) => {
  return (
    <div className="rounded-xl border bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Recent Campaigns
          </h2>
          <p className="text-xs text-slate-500">
            Track your active campaign performance
          </p>
        </div>

        <button className="text-sm text-blue-600 hover:underline">
          View all →
        </button>
      </div>

      {/* Table */}
      <table className="w-full table-fixed text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="p-3 w-[260px] text-left">Campaign</th>
            <th className="p-3 w-[100px]">Status</th>
            <th className="p-3 w-[120px]">Platforms</th>
            <th className="p-3 w-[120px]">Spend</th>
            <th className="p-3 w-[160px]">Performance</th>
            <th className="p-3 w-[80px] text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {campaigns.map((c) => (
            <tr key={c.id} className="border-t">
              <td className="p-3 font-medium">{c.name}</td>

              <td className="p-3 text-center">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${statusBadge(
                    c.status
                  )}`}
                >
                  {c.status}
                </span>
              </td>

              <td className="p-3">
                <div className="flex justify-center gap-2">
                  {c.platforms.map((p, i) => (
                    <span key={i}>{platformIcon(p)}</span>
                  ))}
                </div>
              </td>

              <td className="p-3 text-center">
                ${c.spend.toLocaleString()}
              </td>

            <td className="p-3 text-center text-xs text-slate-600">
  <div className="flex items-center justify-center gap-1">
    <img
      src="https://res.cloudinary.com/dqkczdjjs/image/upload/v1766008541/Icon_17_w2ns6b.png"
      alt="Impressions"
      className="h-3.5 w-3.5"
    />
    <span>{c.impressions}</span>
    <span className="text-slate-400">↗</span>
    <span>{c.ctr}</span>
  </div>
</td>


              <td className="p-3 text-right">
                <div className="flex justify-end gap-3 text-slate-500">
                  {c.status === "active" ? (
                    <Pause size={16} />
                  ) : (
                    <Play size={16} />
                  )}
                  <img src="https://res.cloudinary.com/dqkczdjjs/image/upload/v1766008542/Icon_20_s2qdwj.png" alt="" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentCampaignsTable;
