

import React from "react";
import {

  Plus,
  Sparkles,
  BarChart2,

  type LucideIcon,
} from "lucide-react";
import SpendOverview from "./SpendOverview/SpendOverview";
import CampaignsTable from "./RecentCampaigns/RecentCampaigns";



const nowRelative = "2 minutes ago";



function StatCard({
  label,
  value,
  delta,
  positive = true,
  iconImg,
}: {
  label: string;
  value: React.ReactNode;
  delta?: string;
  positive?: boolean;
  iconImg: string;
}) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm border border-slate-100">
      {/* Top Row: Label + growth rate */}
      <div className="flex items-start justify-between">
        {/* Top-left circular icon */}
        <div className="flex items-center gap-3">
          <div className="">
            <img
              src={iconImg}
              alt="icon"
              className="w-10 h-10 object-contain"
              width={20}
              height={20}
            />
          </div>
        </div>

        {delta && (
          <div
            className={`rounded-full px-2 py-1 text-xs font-medium ${
              positive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
            }`}
          >
            {delta}
          </div>
        )}
      </div>

      {/* Label */}
      <div className="mt-3 text-sm text-gray-500">{label}</div>

      {/* Value */}
      <div className="mt-1 text-xl font-semibold text-gray-900">{value}</div>
    </div>
  );
}



function ActionCard({
  title,
  subtitle,
  bgClass,
  Icon,
}: {
  title: string;
  subtitle: string;
  bgClass: string;
  Icon: LucideIcon;
}) {
  return (
    <button
      className={`${bgClass} rounded-2xl p-6 text-left shadow-sm hover:shadow-md transition`}
    >
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


const ICONS = {
  dollar:
    "https://res.cloudinary.com/dqkczdjjs/image/upload/v1765494156/Container_6_h2gdjc.png",
  eye: "https://res.cloudinary.com/dqkczdjjs/image/upload/v1765494155/Container_7_dlwyhq.png",
  cursor:
    "https://res.cloudinary.com/dqkczdjjs/image/upload/v1765494155/Container_8_y2rgps.png",
  ROAS: "https://res.cloudinary.com/dqkczdjjs/image/upload/v1765494155/Container_9_apjmto.png",
};



const UserDashboard: React.FC = () => {
  return (
    <main className="p-8">
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
          <p className="text-sm text-gray-500">
            Welcome back! Here's your campaign overview with AI insights.
          </p>
        </div>

        <div className="text-right text-sm text-gray-500">
          <div className="text-xs">Last updated</div>
          <div className="mt-1 font-medium text-gray-700">{nowRelative}</div>
        </div>
      </div>

      {/* STAT CARDS — NOW FULLY STATIC WITH IMAGE ICONS */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          iconImg={ICONS.dollar}
          label="Total Spend"
          value="$12,483"
          delta="+12.3%"
          positive
        />

        <StatCard
          iconImg={ICONS.eye}
          label="Impressions"
          value="2.4M"
          delta="+8.2%"
          positive
        />

        <StatCard
          iconImg={ICONS.cursor}
          label="Click Rate"
          value="3.42%"
          delta="-0.5%"
          positive={false}
        />

        <StatCard
          iconImg={ICONS.ROAS}
          label="ROAS"
          value="4.2x"
          delta="+15.8%"
          positive
        />
      </div>

      {/* Quick Actions */}
      <section className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Quick Actions
        </h2>

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

      {/* Spend Overview */}
      <div className="mt-5">
        <SpendOverview />
      </div>

      {/* Recent Campaigns */}
      <div className="mt-4">
        {/* <RecentCampaigns /> */}
        <CampaignsTable />
        
      </div>
    </main>
  );
};

export default UserDashboard;
