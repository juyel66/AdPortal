"use client";

import React from "react";
import {
  Eye,

  Edit2,
  Trash2,
  type LucideIcon,
  DollarSign,
} from "lucide-react";

/**
 * RecentCampaigns component
 * - Responsive table with status badges, platform icons, KPIs and actions
 * - Tailwind CSS for styling
 */

type Campaign = {
  id: string;
  title: string;
  status: "active" | "paused" | "draft";
  platforms: ("facebook" | "google" | "tiktok")[];
  spend: string;
  impressions: string;
  ctr: string;
};

const campaigns: Campaign[] = [
  {
    id: "c1",
    title: "Summer Sale 2024",
    status: "active",
    platforms: ["facebook", "google", "tiktok"],
    spend: "$1,245",
    impressions: "324K",
    ctr: "3.8%",
  },
  {
    id: "c2",
    title: "Product Launch - New Collection",
    status: "active",
    platforms: ["facebook", "google", "tiktok"],
    spend: "$1,245",
    impressions: "324K",
    ctr: "3.8%",
  },
  {
    id: "c3",
    title: "Summer Sale 2024 (Paused)",
    status: "paused",
    platforms: ["facebook", "google", "tiktok"],
    spend: "$1,245",
    impressions: "324K",
    ctr: "3.8%",
  },
  {
    id: "c4",
    title: "Summer Sale 2024 (Draft)",
    status: "draft",
    platforms: ["facebook", "google", "tiktok"],
    spend: "$1,245",
    impressions: "324K",
    ctr: "3.8%",
  },
];

/* Small presentational helpers */

function PlatformIcon({ platform }: { platform: Campaign["platforms"][number] }) {
  // Simple circle logos that visually match Facebook / Google / TikTok colors
  if (platform === "facebook") {
    return (
      <div className="h-8 w-8 flex items-center justify-center rounded-full bg-[#1877F2]/10 ring-1 ring-[#1877F2]/20">
        <span className="text-[#1877F2] font-bold text-sm">f</span>
      </div>
    );
  }
  if (platform === "google") {
    return (
      <div className="h-8 w-8 flex items-center justify-center rounded-full bg-white ring-1 ring-gray-100 shadow-inner">
        {/* multi-color G */}
        <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="">
          <path d="M44.5 20H24v8.5h11.8C34.3 33.6 30 36.5 24 36.5 15 36.5 8.5 29.2 8.5 20 8.5 10.8 15 3.5 24 3.5c6.1 0 10.9 2.5 14.2 6.1l-5.8 5.6C30.9 13.2 27.8 11.5 24 11.5c-6.1 0-11 4.9-11 8.5s4.9 8.5 11 8.5c4.6 0 7.6-2 8.3-3l-8.3-3v-6.5h20.5z" fill="#4285F4"/>
        </svg>
      </div>
    );
  }
  // tiktok
  return (
    <div className="h-8 w-8 flex items-center justify-center rounded-full bg-black text-white">
      {/* simple tiktok glyph approximation */}
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3v6.2A3.2 3.2 0 1 1 9 6.4V9.5A6 6 0 1 0 15 15V9h-3V3h0z" fill="#25F4EE"/>
      </svg>
    </div>
  );
}

function StatusBadge({ status }: { status: Campaign["status"] }) {
  const styles =
    status === "active"
      ? "bg-green-50 text-green-700 ring-1 ring-green-100"
      : status === "paused"
      ? "bg-yellow-50 text-yellow-800 ring-1 ring-yellow-100"
      : "bg-gray-50 text-gray-500 ring-1 ring-gray-100";

  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${styles}`}>{status}</span>;
}

/* KPI small display */
function PerformanceCell({ impressions, ctr }: { impressions: string; ctr: string }) {
  return (
    <div className="flex items-center gap-4 text-sm text-gray-600">
      <div className="flex items-center gap-2">
        <Eye className="h-4 w-4 text-gray-400" />
        <span>{impressions}</span>
      </div>
      <div className="flex items-center gap-2">
        <DollarSign className="h-4 w-4 text-gray-400" />
        <span>{ctr}</span>
      </div>
    </div>
  );
}

/* Table row actions */
function ActionButtons({ onEdit, onDelete }: { onEdit?: () => void; onDelete?: () => void }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onEdit}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-100 bg-white text-blue-600 shadow-sm hover:bg-blue-50"
        aria-label="Edit campaign"
        title="Edit"
      >
        <Edit2 className="h-4 w-4" />
      </button>
      <button
        onClick={onDelete}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-100 bg-white text-red-500 shadow-sm hover:bg-red-50"
        aria-label="Delete campaign"
        title="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

/* ----------------------
   Main component export
   ---------------------- */

export default function RecentCampaigns() {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Recent Campaigns</h3>
          <p className="mt-1 text-sm text-gray-500">Track your active campaign performance</p>
        </div>

        <a className="text-sm font-medium text-blue-600 hover:underline" href="#">
          View all →
        </a>
      </div>

      {/* table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] table-fixed">
          <thead>
            <tr className="text-left text-sm text-gray-500">
              <th className="w-12 pl-4 pr-2 py-3">
                <input type="checkbox" aria-label="select all" className="h-4 w-4 rounded border-gray-200" />
              </th>
              <th className="py-3">Campaign</th>
              <th className="py-3 w-28">Status</th>
              <th className="py-3 w-36">Platforms</th>
              <th className="py-3 w-28">Spend</th>
              <th className="py-3 w-40">Performance</th>
              <th className="py-3 w-36 text-right pr-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {campaigns.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="pl-4 pr-2 py-4 align-top">
                  <input type="checkbox" aria-label={`select ${c.title}`} className="h-4 w-4 rounded border-gray-200" />
                </td>

                <td className="py-4 align-top">
                  <div className="font-medium text-gray-900">{c.title}</div>
                </td>

                <td className="py-4 align-top">
                  <StatusBadge status={c.status} />
                </td>

                <td className="py-4 align-top">
                  <div className="flex items-center gap-3">
                    {c.platforms.map((p) => (
                      <PlatformIcon key={p} platform={p} />
                    ))}
                  </div>
                </td>

                <td className="py-4 align-top">
                  <div className="font-medium text-gray-900">{c.spend}</div>
                </td>

                <td className="py-4 align-top">
                  <PerformanceCell impressions={c.impressions} ctr={c.ctr} />
                </td>

                <td className="py-4 pr-4 align-top text-right">
                  <ActionButtons
                    onEdit={() => {
                      /* handle edit */
                      alert(`Edit ${c.title}`);
                    }}
                    onDelete={() => {
                      /* handle delete */
                      // eslint-disable-next-line no-restricted-globals
                      if (confirm(`Delete ${c.title}?`)) {
                        alert("Deleted (example only)");
                      }
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
