"use client";

import React from "react";
import {
  DollarSign,
  Eye,

  Target,
  Plus,
  Sparkles,
  BarChart2,
  FileText,
  type LucideIcon,
} from "lucide-react";

const nowRelative = "2 minutes ago";

/* -------------------------
   Small reusable components
   ------------------------- */

// StatCard: icon, label, value, delta
function StatCard({ Icon, label, value, delta, positive = true }: {
  Icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  delta?: string;
  positive?: boolean;
}) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="text-sm text-gray-500">{label}</div>
        {delta && (
          <div className={`rounded-full px-2 py-1 text-xs font-medium ${positive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
            {delta}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className="rounded-full bg-gray-100 p-2">
          <Icon className="h-5 w-5 text-gray-600" />
        </div>
        <div>
          <div className="text-xl font-semibold text-gray-900">{value}</div>
        </div>
      </div>
    </div>
  );
}

// ActionCard: large colorful CTA card used in Quick Actions
function ActionCard({ title, subtitle, bgClass, Icon }: {
  title: string;
  subtitle: string;
  bgClass: string;
  Icon: LucideIcon;
}) {
  return (
    <button className={`${bgClass} rounded-2xl p-6 text-left shadow-sm hover:shadow-md transition`}>
      <div className="flex items-start gap-4">
        <div className="rounded-md bg-white/20 p-2">
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <div className="text-lg font-semibold text-white">{title}</div>
          <div className="mt-1 text-sm text-white/90">{subtitle}</div>
        </div>
      </div>
    </button>
  );
}

/* -------------------------
   Main page
   ------------------------- */

const AdminDashboard: React.FC = () => {
  return (
    <main className=" p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="mb-1 flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
              <Sparkles className="h-4 w-4" />
              <span>AI Powered</span>
            </span>
          </div>
          <p className="text-sm text-gray-500">Welcome back! Here's your campaign overview with AI insights.</p>
        </div>

        <div className="text-right text-sm text-gray-500">
          <div className="text-xs">Last updated</div>
          <div className="mt-1 font-medium text-gray-700">{nowRelative}</div>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          Icon={DollarSign}
          label="Total Spend"
          value="$12,483"
          delta="+12.3%"
          positive
        />
        <StatCard
          Icon={Eye}
          label="Impressions"
          value="2.4M"
          delta="+8.2%"
          positive
        />
        <StatCard
            Icon={/*CursorClick*/ DollarSign} // --- IGNORE ---
          label="Click Rate"
          value="3.42%"
          delta="-0.5%"
          positive={false}
        />
        <StatCard
          Icon={Target}
          label="ROAS"
          value="4.2x"
          delta="+15.8%"
          positive
        />
      </div>

      {/* Quick Actions */}
      <section className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Quick Actions</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <ActionCard
            title="Create Campaign"
            subtitle="Start a new ad campaign"
            bgClass="bg-blue-600"
            Icon={Plus}
          />
          <ActionCard
            title="AI Copy Generator"
            subtitle="Create ad copy with AI"
            bgClass="bg-purple-700"
            Icon={Sparkles}
          />
          <ActionCard
            title="View Reports"
            subtitle="Check performance data"
            bgClass="bg-green-600"
            Icon={BarChart2}
          />
        </div>
      </section>

      {/* Optional: below quick-actions you might show recent reports / highlights */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="col-span-2 rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-gray-900">Campaigns Overview</div>
            <button className="text-sm text-blue-600">View all</button>
          </div>
          <div className="mt-4 text-sm text-gray-500">Summary charts and quick KPIs can go here. Use charts (recharts / chart.js) in production.</div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-gray-900">Reports</div>
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
          <div className="mt-4 text-sm text-gray-500">Latest report: Campaign performance (downloadable)</div>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;
