// Reports.tsx
import React, { useState } from "react";
import { FileText, Calendar, TrendingUp, X } from "lucide-react";
import { Link } from "react-router-dom";

import type {
  ReportType,
  Platform,
  Metric,
  RecentReport,
  CreateReportForm,
} from "@/types/reports";



const recentReports: RecentReport[] = [
  {
    id: 1,
    title: "Weekly Performance Report",
    date: "2024-02-12",
    frequency: "Weekly",
  },
  {
    id: 2,
    title: "Monthly Campaign Summary",
    date: "2024-02-12",
    frequency: "Monthly",
  },
  {
    id: 3,
    title: "Q1 2024 Performance",
    date: "2024-02-12",
    frequency: "Quarterly",
  },
  {
    id: 4,
    title: "Custom Report - Meta Campaigns",
    date: "2024-02-10",
    frequency: "Custom",
  },
];



const Reports: React.FC = () => {


  const [open, setOpen] = useState(false);

  const [form, setForm] = useState<CreateReportForm>({
    reportType: "Weekly",
    platforms: [],
    metrics: [],
  });

  /* -------------------------
     Handlers
  ------------------------- */

  const togglePlatform = (p: Platform) => {
    setForm((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(p)
        ? prev.platforms.filter((x) => x !== p)
        : [...prev.platforms, p],
    }));
  };

  const toggleMetric = (m: Metric) => {
    setForm((prev) => ({
      ...prev,
      metrics: prev.metrics.includes(m)
        ? prev.metrics.filter((x) => x !== m)
        : [...prev.metrics, m],
    }));
  };


  return (
    <div className="space-y-6 mt-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Reports</h1>
          <p className="text-sm text-slate-500">
            Generate and download comprehensive campaign reports
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
           <FileText size={16} />
          Create Reports
        </button>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ReportCard
          icon={<Calendar className="text-blue-600  " />}
          title="Weekly Report"
        />
        <ReportCard
          icon={<TrendingUp className="text-green-600" />}
          title="Monthly Report"
        />
        <ReportCard
          icon={<FileText className="text-purple-600" />}
          title="Custom Report"
        />
      </div>

      {/* Recent Reports */}
      <div className="rounded-xl border bg-white">
        <h2 className="px-6 py-4 font-semibold text-slate-900 border-b">
          Recent Reports
        </h2>

        {recentReports.map((r) => (
          <div
            key={r.id}
            className="flex items-center justify-between px-6 py-4 border-b last:border-b-0"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center">
                <FileText className="text-blue-600" size={18} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {r.title}
                </p>
                <p className="text-xs text-slate-500">
                  {r.date} · {r.frequency}
                </p>
              </div>
            </div>

            <button className="rounded-md border px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50">
              Download PDF
            </button>
          </div>
        ))}
      </div>

      {/* =========================
         Modal
      ========================= */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="w-full max-w-md rounded-xl bg-white p-6 relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X size={18} />
            </button>

            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Create Custom Report
            </h2>

            {/* Report Type */}
            <label className="text-sm font-medium text-slate-700">
              Report Type
            </label>
            <select
              value={form.reportType}
              onChange={(e) =>
                setForm({ ...form, reportType: e.target.value as ReportType })
              }
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            >
              <option>Weekly</option>
              <option>Monthly</option>
              <option>Custom</option>
            </select>

            {/* Platforms */}
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-700 mb-2">
                Included Platforms
              </p>
              <div className="flex gap-4 text-sm">
                {(["Meta", "TikTok", "Google"] as Platform[]).map((p) => (
                  <label key={p} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.platforms.includes(p)}
                      onChange={() => togglePlatform(p)}
                    />
                    {p}
                  </label>
                ))}
              </div>
            </div>

            {/* Metrics */}
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-700 mb-2">
                Metrics
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {(
                  ["Spend", "Impressions", "Click", "CTR", "CPC", "ROAS"] as Metric[]
                ).map((m) => (
                  <label
                    key={m}
                    className="flex items-center gap-2 rounded-lg border px-3 py-2"
                  >
                    <input
                      type="checkbox"
                      checked={form.metrics.includes(m)}
                      onChange={() => toggleMetric(m)}
                    />
                    {m}
                  </label>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg border px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <Link to="/user-dashboard/campaigns-view-details"
            
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
              >
                Generate Report
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================
   Small Card Component
========================= */

const ReportCard = ({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) => {
  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center mb-3">
        {icon}
      </div>
      <p className="font-medium text-slate-900">{title}</p>
      <p className="text-sm text-slate-500">
        Generate and download instantly
      </p>
    </div>
  );
};

export default Reports;
