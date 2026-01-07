import React from "react";
import { Search } from "lucide-react";
import type { CampaignSummaryItem } from "@/types/campaignMonitoring";

import type {
  CampaignStat,
  CampaignItem,
} from "@/types/campaignMonitoring";
import RecentCampaignsTable from "./RecentCampaignsTable";

/* =========================
   STATS
========================= */

const stats: CampaignStat[] = [
  {
    title: "Total Campaigns",
    value: 670,
    sub: "+42 this week",
  },
  {
    title: "Active Now",
    value: 545,
    sub: "81.3% active",
    variant: "green",
  },
  {
    title: "Flagged",
    value: 12,
    sub: "Needs review",
    variant: "yellow",
  },
  {
    title: "Total Ad Spend",
    value: "$124K",
    sub: "+18% vs last week",
  },
  {
    title: "Avg. Performance",
    value: "3.8x",
    sub: "ROAS",
  },
];

/* =========================
   CAMPAIGNS
========================= */

const campaigns: CampaignItem[] = [
  {
    id: 1,
    name: "Summer Sale 2024",
    status: "active",
    platforms: ["meta", "google", "tiktok"],
    spend: 1245,
    impressions: "324K",
    ctr: "3.8%",
  },
  {
    id: 2,
    name: "Product Launch - New Collection",
    status: "active",
    platforms: ["meta", "google", "tiktok"],
    spend: 1245,
    impressions: "324K",
    ctr: "3.8%",
  },
  {
    id: 3,
    name: "Summer Sale 2024",
    status: "paused",
    platforms: ["meta", "google", "tiktok"],
    spend: 1245,
    impressions: "324K",
    ctr: "3.8%",
  },
  {
    id: 4,
    name: "Summer Sale 2024",
    status: "draft",
    platforms: ["meta", "google", "tiktok"],
    spend: 1245,
    impressions: "324K",
    ctr: "3.8%",
  },
];


const summaryData: CampaignSummaryItem[] = [
  {
    title: "Meta Campaigns",
    value: 345,
    percentage: "51.5% of total",
  },
  {
    title: "Google Campaigns",
    value: 245,
    percentage: "36.6% of total",
  },
  {
    title: "Total Campaigns",
    value: 80,
    percentage: "11.9% of total",
  },
];



/* =========================
   COMPONENT
========================= */

const CampaignMonitoring: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          Campaign Monitoring
        </h1>
        <p className="text-sm text-slate-500">
          Monitor and manage all campaigns across the platform
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((s) => (
          <div
            key={s.title}
            className={`rounded-xl  border bg-white p-4 ${
              s.variant === "green"
                ? "border-green-300 text-green-500 bg-green-50"
                : s.variant === "yellow"
                ? "border-yellow-300 bg-yellow-50 text-yellow-600"
                : ""
            }`}
          >
            <p className="text-sm text-slate-500  ">{s.title}</p>
            <p className="mt-1 text-2xl  font-semibold">{s.value}</p>
            <p className="mt-1 text-xs   text-green-500">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="rounded-xl border bg-white p-4">
        <div className="flex items-center gap-2 rounded-lg border bg-slate-50 px-3 py-2">
          <Search size={16} className="text-slate-400" />
          <input
            placeholder="Search campaign or users..."
            className="w-full bg-transparent text-sm outline-none"
          />
          <button className="rounded-lg bg-blue-600 px-3 py-1 text-xs text-white">
            All
          </button>
          <button className="rounded-lg border px-3 py-1 text-xs">
            Active
          </button>
        </div>
      </div>

      {/* Recent Campaigns Table */}
      <RecentCampaignsTable campaigns={campaigns} />



        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {summaryData.map((item) => (
        <div
          key={item.title}
          className="rounded-xl border  bg-white p-5"
        >
          <p className="text-sm text-slate-500">
            {item.title}
          </p>

          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {item.value}
          </p>

          <p className="mt-1 text-xs text-green-600">
            {item.percentage}
          </p>
        </div>
      ))}
    </div>


    </div>
  );
};

export default CampaignMonitoring;
