import React, { useState } from "react";
import {
  FileText,
  TrendingUp,
  Calendar,
  Download,
 
  X,
} from "lucide-react";
import jsPDF from "jspdf";

import type {
  ReportCard,
  CreateReportForm,
  ReportMetric,
} from "@/types/AdminReports";

const REPORTS: ReportCard[] = [
  {
    id: 1,
    title: "Weekly Performance Report",
    type: "Weekly",
    date: "2024-02-12",
  },
  {
    id: 2,
    title: "Monthly Campaign Summary",
    type: "Monthly",
    date: "2024-02-12",
  },
  {
    id: 3,
    title: "Q1 2024 Performance",
    type: "Quarterly",
    date: "2024-02-12",
  },
];

const METRICS: ReportMetric[] = [
  "Revenue Overview",
  "Revenue by Plan",
  "User Growth",
  "Feature Usage",
  "Monthly Revenue",
  "MRR Growth",
  "Total Transactions",
  "Failed Payments",
];

const AdminReports: React.FC = () => {
  const [reports, setReports] = useState<ReportCard[]>(REPORTS);
  const [openModal, setOpenModal] = useState(false);

  const [form, setForm] = useState<CreateReportForm>({
    reportType: "Weekly",
    metrics: [],
  });

  const downloadPDF = (report: ReportCard) => {
    const pdf = new jsPDF();

    pdf.setFontSize(18);
    pdf.text("AdPortal Custom Report", 20, 20);

    pdf.setFontSize(12);
    pdf.text(`Type: ${report.type}`, 20, 40);
    pdf.text(`Date: ${report.date}`, 20, 50);

    pdf.line(20, 60, 190, 60);

    pdf.text("Included Metrics:", 20, 75);

    form.metrics.forEach((metric, index) => {
      pdf.text(`${index + 1}. ${metric}`, 25, 85 + index * 8);
    });

    pdf.save(`${report.title}.pdf`);
  };

  const createReport = () => {
    const newReport: ReportCard = {
      id: Date.now(),
      title: `${form.reportType} Custom Report`,
      type: form.reportType,
      date: new Date().toISOString().split("T")[0],
    };

    setReports((prev) => [newReport, ...prev]);
    setOpenModal(false);
    setForm({ reportType: "Weekly", metrics: [] });
  };

  const toggleMetric = (metric: ReportMetric) => {
    setForm((prev) => ({
      ...prev,
      metrics: prev.metrics.includes(metric)
        ? prev.metrics.filter((m) => m !== metric)
        : [...prev.metrics, metric],
    }));
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Reports</h1>
          <p className="text-sm text-slate-500">
            Generate and download comprehensive campaign reports
          </p>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white"
        >
          <FileText size={16} />
          Create Reports
        </button>

        
      </div>

      {/* REPORT TYPES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ReportTypeCard
          icon={<Calendar size={18} className="text-blue-600" />}
          title="Weekly Report"
          bgColor="bg-blue-100"
        />
        <ReportTypeCard
          icon={<TrendingUp size={18} className="text-green-600" />}
          title="Monthly Report"
          bgColor="bg-green-100"
        />
        <ReportTypeCard
          icon={<FileText size={18} className="text-purple-600" />}
          title="Custom Report"
          bgColor="bg-purple-100"
        />
      </div>

      {/* RECENT REPORTS */}
      <div className="rounded-xl border bg-white">
        <h2 className="border-b px-6 py-4 text-sm font-semibold">
          Recent Reports
        </h2>

        {reports.map((r) => (
          <div
            key={r.id}
            className="flex items-center justify-between px-6 py-4 border-b last:border-b-0"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                <FileText size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">{r.title}</p>
                <p className="text-xs text-slate-500">
                  {r.date} • {r.type}
                </p>
              </div>
            </div>

            <button
              onClick={() => downloadPDF(r)}
              className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm"
            >
              <Download size={14} />
              Download PDF
            </button>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 relative">
            <button
              onClick={() => setOpenModal(false)}
              className="absolute right-4 top-4 text-slate-400"
            >
              <X size={16} />
            </button>

            <h2 className="mb-4 text-lg font-semibold">
              Create Custom Report
            </h2>

            <label className="text-sm font-medium">Report Type</label>
            <select
              value={form.reportType}
              onChange={(e) =>
                setForm({
                  ...form,
                  reportType: e.target.value as any,
                })
              }
              className="mt-1 w-full rounded-lg border bg-slate-50 px-3 py-2 text-sm"
            >
              <option>Weekly</option>
              <option>Monthly</option>
              <option>Quarterly</option>
              <option>Custom</option>
            </select>

            <p className="mt-4 mb-2 text-sm font-medium">Metrics</p>

            <div className="grid grid-cols-2 gap-3">
              {METRICS.map((metric) => (
                <label
                  key={metric}
                  className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={form.metrics.includes(metric)}
                    onChange={() => toggleMetric(metric)}
                  />
                  {metric}
                </label>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setOpenModal(false)}
                className="rounded-lg border px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={createReport}
                disabled={form.metrics.length === 0}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-50"
              >
                Generate Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ReportTypeCard = ({
  icon,
  title,
  bgColor,
}: {
  icon: React.ReactNode;
  title: string;
  bgColor: string;
}) => (
  <div className="rounded-xl border bg-white p-5">
    <div
      className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${bgColor}`}
    >
      {icon}
    </div>
    <p className="text-sm font-semibold text-slate-900">{title}</p>
    <p className="text-sm text-slate-500">
      Generate and download instantly
    </p>
  </div>
);

export default AdminReports;
