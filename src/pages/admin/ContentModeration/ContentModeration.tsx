import React, { useMemo, useState } from "react";
import {
  Search,
  CheckCircle,
  XCircle,
  Flag,
} from "lucide-react";

import type {
  ModerationItem,
  ModerationStatus,
} from "@/types/contentModeration";

/* =========================
   FAKE DATA (API READY)
========================= */
const CONTENTS: ModerationItem[] = [
  {
    id: 1,
    title: "Summer Sale 2024",
    type: "Image",
    userEmail: "john@company.com",
    uploadedAt: "2024-11-28",
    views: 12400,
    status: "pending",
    reason: "User reported",
    thumbnail:
      "https://res.cloudinary.com/dqkczdjjs/image/upload/v1766250447/Container_13_vibkj1.png",
  },
  {
    id: 2,
    title: "Winter Offer",
    type: "Image",
    userEmail: "sarah@company.com",
    uploadedAt: "2024-11-27",
    views: 9800,
    status: "pending",
    reason: "Auto approved",
    thumbnail:
      "https://res.cloudinary.com/dqkczdjjs/image/upload/v1766250447/Container_13_vibkj1.png",
  },
  {
    id: 3,
    title: "Flash Deal",
    type: "Video",
    userEmail: "alex@company.com",
    uploadedAt: "2024-11-26",
    views: 6400,
    status: "pending",
    reason: "Policy violation",
    thumbnail:
      "https://res.cloudinary.com/dqkczdjjs/image/upload/v1766250447/Container_13_vibkj1.png",
  },
];

/* =========================
   COMPONENT
========================= */
const ContentModeration: React.FC = () => {
  const [items, setItems] = useState<ModerationItem[]>(CONTENTS);
  const [tab, setTab] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");

  /* -------- FILTER -------- */
  const filteredItems = useMemo(() => {
    if (tab === "all") return items;
    return items.filter((i) => i.status === tab);
  }, [tab, items]);

  /* -------- ACTION -------- */
  const updateStatus = (id: number, status: ModerationStatus) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, status } : i
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          Content Moderation
        </h1>
        <p className="text-sm text-slate-500">
          Review and moderate flagged content
        </p>
      </div>

      {/* =========================
         🔢 STATS (ALADA ALADA)
      ========================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending Review */}
        <div className="rounded-xl border bg-yellow-50 border-yellow-300 p-4">
          <p className="text-sm text-slate-600">Pending Review</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            13
          </p>
          <p className="mt-1 text-xs text-yellow-700">
            Need Attention
          </p>
        </div>

        {/* Approved Today */}
        <div className="rounded-xl border bg-green-50 border-green-300 p-4">
          <p className="text-sm text-slate-600">Approved Today</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            28
          </p>
          <p className="mt-1 text-xs text-green-700">
            +5 vs yesterday
          </p>
        </div>

        {/* Rejected Today */}
        <div className="rounded-xl border bg-red-50 border-red-300 p-4">
          <p className="text-sm text-slate-600">Rejected Today</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            3
          </p>
          <p className="mt-1 text-xs text-red-600">
            Policy violation
          </p>
        </div>

        {/* Total Flagged */}
        <div className="rounded-xl border bg-white p-4">
          <p className="text-sm text-slate-600">Total Flagged</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            156
          </p>
          <p className="mt-1 text-xs text-slate-500">
            This month
          </p>
        </div>
      </div>

      {/* SEARCH + TABS */}
      <div className="rounded-xl border bg-white p-4 flex items-center justify-between">
        <div className="flex flex-1 items-center gap-2 rounded-lg border bg-slate-50 px-3 py-2">
          <Search size={16} className="text-slate-400" />
          <input
            placeholder="Search campaign or users..."
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>

        <div className="flex gap-2 ml-2">
          {["all", "pending", "approved", "rejected"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t as any)}
              className={`rounded-lg px-3 py-1 text-sm capitalize ${
                tab === t
                  ? "bg-blue-600 text-white"
                  : "border bg-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT LIST */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border bg-white p-4 flex gap-4"
          >
            <img
              src={item.thumbnail}
              className="h-24 w-24 rounded-lg object-cover"
              alt="preview"
            />

            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">
                  {item.title}
                </h3>

                <span
                  className={`ml-auto rounded-full px-2 py-0.5 text-xs ${
                    item.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : item.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <p className="text-xs text-slate-500">
                Type: {item.type} • User: {item.userEmail} • Uploaded:{" "}
                {item.uploadedAt} • {item.views.toLocaleString()} views
              </p>

              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Flag size={12} className="text-red-500" />
                Flagged: {item.reason}
              </div>

              {item.status === "pending" && (
                <div className="mt-3 flex gap-3">
                  <button
                    onClick={() =>
                      updateStatus(item.id, "approved")
                    }
                    className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-1.5 text-sm text-white"
                  >
                    <CheckCircle size={16} /> Approve
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(item.id, "rejected")
                    }
                    className="flex items-center gap-2 rounded-lg border border-red-500 px-4 py-1.5 text-sm text-red-600"
                  >
                    <XCircle size={16} /> Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentModeration;
