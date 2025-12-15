import React from "react";
import { Link } from "react-router";

const CampaignsOverview: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* ================= Header ================= */}
      <div>
        <Link to="/user-dashboard/campaigns" className="mb-2 text-sm text-slate-500 hover:text-slate-700">
          ← Back
        </Link>

        <h1 className="text-xl font-semibold text-slate-900">
          Product Launch Q4
        </h1>
        <p className="text-sm text-slate-500">
          Campaign Details & Performance
        </p>
      </div>

      {/* ================= Campaign Overview ================= */}
      <div className="rounded-xl border bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">
          Campaign Overview
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs text-slate-500">Status</p>
            <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              Active
            </span>
          </div>

          <div>
            <p className="text-xs text-slate-500">Objective</p>
            <p className="text-sm font-medium text-slate-900">
              Conversions
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Platforms</p>
            <div className="mt-1 flex gap-2">
              <span className="rounded-full border px-2 py-0.5 text-xs">
                Meta
              </span>
              <span className="rounded-full border px-2 py-0.5 text-xs">
                TikTok
              </span>
            </div>
          </div>

          <div>
            <p className="text-xs text-slate-500">Date Range</p>
            <p className="text-sm font-medium text-slate-900">
              Nov 15 - Dec 15, 2024
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Daily Budget</p>
            <p className="text-sm font-semibold text-slate-900">
              $350/day
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Total Budget</p>
            <p className="text-sm font-semibold text-slate-900">
              $15,000
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Total Spend</p>
            <p className="text-sm font-semibold text-slate-900">
              $2,100
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">
              Remaining Budget
            </p>
            <p className="text-sm font-semibold text-slate-900">
              $11,580
            </p>
          </div>
        </div>
      </div>

      {/* ================= Performance Metrics ================= */}
      <div className="rounded-xl border bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">
          Performance Metrics
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card */}
          {[
            {
              label: "Impressions",
              value: "189K",
              change: "+12.5%",
            },
            {
              label: "Clicks",
              value: "5,234",
              change: "+8.3%",
            },
            {
              label: "CTR",
              value: "2.77%",
              change: "+0.2%",
            },
            {
              label: "Conversions",
              value: "98",
              change: "+15.8%",
            },
            {
              label: "ROAS",
              value: "3.8x",
              change: "+18.2%",
            },
            {
              label: "CPC",
              value: "$0.41",
              change: "-5.2%",
            },
            {
              label: "CPA",
              value: "$24.08",
              change: "-8.1%",
            },
            {
              label: "CPM",
              value: "$14.20",
              change: "-2.5%",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-lg bg-slate-50 p-4"
            >
              <p className="text-xs text-slate-500">
                {item.label}
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {item.value}
              </p>
              <p
                className={`mt-1 text-xs font-medium ${
                  item.change.startsWith("+")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {item.change}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CampaignsOverview;
