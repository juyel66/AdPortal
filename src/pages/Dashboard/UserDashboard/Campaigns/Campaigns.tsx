"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  MoreVertical,
  Eye,
  Pencil,
  Copy,
  Trash2,
} from "lucide-react";

import type {
  CampaignCardProps,
  MenuItemProps,
  BadgeProps,
  KpiProps,
  StatProps,
  ChipProps,
} from "@/types/campaign";

const ACTION_BTN =
  "https://res.cloudinary.com/dqkczdjjs/image/upload/v1765671112/Button_2_upzjmx.png";

/* ==================================
   MAIN PAGE
================================== */
const Campaigns: React.FC = () => {
  const campaigns = [
    {
      id: 1,
      title: "Summer Sale 2024",
      status: "active",
      type: "sales",
      platforms: ["Meta", "Google"],
      budget: "$50/day",
      spend: "$1,245",
      impressions: "324K",
      clicks: "12.4K",
      ctr: "3.8%",
      conversions: "342",
      roas: "3.8x",
      date: "2024-01-15 → 2024-02-15",
    },
    {
      id: 2,
      title: "Winter Clearance 2024",
      status: "active",
      type: "leads",
      platforms: ["Tiktok", "Facebook"],
      budget: "$60/day",
      spend: "$980",
      impressions: "250K",
      clicks: "10.1K",
      ctr: "4.0%",
      conversions: "250",
      roas: "4.0x",
      date: "2024-01-01 → 2024-01-31",
    },
    {
      id: 3,
      title: "Summer Sale 2024",
      status: "paused",
      type: "conversions",
      platforms: ["Meta", "Google"],
      budget: "$50/day",
      spend: "$1,245",
      impressions: "324K",
      clicks: "12.4K",
      ctr: "3.8%",
      conversions: "342",
      roas: "3.8x",
      date: "2024-01-15 → 2024-02-15",
    },
    {
      id: 4,
      title: "Spring Launch 2024",
      status: "draft",
      type: "conversions",
      platforms: ["Meta"],
      budget: "$40/day",
      spend: "$500",
      impressions: "150K",
      clicks: "5.5K",
      ctr: "3.7%",
      conversions: "120",
      roas: "2.5x",
      date: "2024-03-01 → 2024-03-31",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Campaigns</h1>
          <p className="text-sm text-slate-500">
            Manage and monitor all your ad campaigns
          </p>
        </div>

        <div className="flex gap-3">
          <button className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
            Sync your Ad
          </button>

          <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition">
            <Plus size={16} />
            Add Campaign
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search Resources..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Campaign Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((item) => (
          <CampaignCard key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
};

/* ==================================
   CAMPAIGN CARD
================================== */
const CampaignCard: React.FC<CampaignCardProps & { id: number }> = ({
  title,
  status,
  type,
  platforms,
  budget,
  spend,
  impressions,
  clicks,
  ctr,
  conversions,
  roas,
  date,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            <Badge status={status} />
            <Chip>{type}</Chip>
            {platforms.map((p, idx) => (
              <span key={`${p}-${idx}`} className="text-slate-500">
                {p}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <img src={ACTION_BTN} alt="action" className="h-7 w-7 cursor-pointer" />
          <button onClick={() => setOpen((p) => !p)}>
            <MoreVertical className="h-5 w-5 text-slate-400" />
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <Stat label="Budget" value={budget} />
        <Stat label="Total Spend" value={spend} />
        <Stat label="Impressions" value={impressions} />
        <Stat label="Clicks" value={clicks} />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <Kpi label="CTR" value={ctr} />
        <Kpi label="Conversions" value={conversions} />
        <Kpi label="ROAS" value={roas} highlight />
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
        <span>{date}</span>
        <button className="text-blue-600 hover:underline">
          View Details →
        </button>
      </div>

      {open && (
        <div className="absolute right-4 top-12 z-50 w-52 rounded-xl border border-slate-200 bg-white shadow-lg">
          <MenuItem icon={<Eye size={16} />} text="View Details" />
          <MenuItem icon={<Pencil size={16} />} text="Edit Campaign" />
          <MenuItem icon={<Copy size={16} />} text="Duplicate Campaign" />
          <div className="border-t" />
          <MenuItem
            icon={<Trash2 size={16} />}
            text="Delete Campaign"
            danger
          />
        </div>
      )}
    </div>
  );
};

/* ==================================
   SMALL UI
================================== */
const Badge: React.FC<BadgeProps> = ({ status }) => {
  const map: Record<BadgeProps["status"], string> = {
    active: "bg-green-100 text-green-600",
    paused: "bg-yellow-100 text-yellow-600",
    draft: "bg-slate-100 text-slate-500",
  };

  return (
    <span className={`rounded-full px-2 py-0.5 ${map[status]}`}>
      {status}
    </span>
  );
};

const Chip: React.FC<ChipProps> = ({ children }) => (
  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">
    {children}
  </span>
);

const Stat: React.FC<StatProps> = ({ label, value }) => (
  <div>
    <p className="text-xs text-slate-400">{label}</p>
    <p className="font-medium text-slate-800">{value}</p>
  </div>
);

const Kpi: React.FC<KpiProps> = ({ label, value, highlight }) => (
  <div
    className={`rounded-lg p-3 text-center text-sm ${
      highlight
        ? "bg-green-50 text-green-600 border border-green-200"
        : "bg-slate-50"
    }`}
  >
    <p className="text-xs text-slate-400">{label}</p>
    <p className="font-semibold">{value}</p>
  </div>
);

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  text,
  danger = false,
}) => (
  <button
    className={`flex w-full items-center gap-3 px-4 py-3 text-sm ${
      danger ? "text-red-600 hover:bg-red-50" : "hover:bg-slate-50"
    }`}
  >
    {icon}
    {text}
  </button>
);

export default Campaigns;
