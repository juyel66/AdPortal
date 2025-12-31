import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Users, Activity } from "lucide-react";

import type {
  StatCardType,
  UserGrowthData,
  FeatureUsageData,
} from "@/types/PlatformAnalytics";

/* =========================
   FAKE DATA (API READY)
========================= */

const stats: StatCardType[] = [
  {
    title: "Daily Active Users",
    value: "1,245",
    change: "+8.9%",
  },
  {
    title: "API Requests",
    value: "125.4K",
    change: "+15.9%",
  },
];

const userGrowthData: UserGrowthData[] = [
  { month: "Jun", newUsers: 1200, activeUsers: 400 },
  { month: "Jul", newUsers: 1600, activeUsers: 450 },
  { month: "Aug", newUsers: 1400, activeUsers: 430 },
  { month: "Sep", newUsers: 1800, activeUsers: 500 },
  { month: "Oct", newUsers: 2100, activeUsers: 520 },
  { month: "Nov", newUsers: 2350, activeUsers: 550 },
];

const featureUsage: FeatureUsageData[] = [
  { name: "Campaign Creation", value: 85 },
  { name: "AI Tools", value: 68 },
  { name: "Analytics", value: 92 },
  { name: "Reports", value: 54 },
  { name: "Team Collaboration", value: 46 },
];



const PlatformAnalytics: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          Platform Analytics
        </h1>
        <p className="text-sm text-slate-500">
          Insights and metrics across the platform
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-xl border bg-white p-4"
          >
            <div className="flex items-center justify-between">
              <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center">
                {stat.title.includes("User") ? (
                  <Users size={16} className="text-blue-600" />
                ) : (
                  <Activity size={16} className="text-emerald-600" />
                )}
              </div>

              <span className="rounded-full bg-green-50 px-2 py-1 text-xs text-green-600">
                {stat.change}
              </span>
            </div>

            <p className="mt-3 text-sm text-slate-500">
              {stat.title} 
            </p>
            <p className="mt-1 text-xl font-semibold text-slate-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* USER GROWTH */}
      <div className="rounded-xl border bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-900">
            User Growth
          </h2>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              New Users
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Active Users
            </span>
            <span className="rounded-md border px-2 py-1">
              Monthly
            </span>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="newUsers"
                stroke="#3B82F6"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="activeUsers"
                stroke="#10B981"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* FEATURE USAGE */}
      <div className="rounded-xl border bg-white p-6 ">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">
          Feature Usage
        </h2>

        <div className="h-64 ml-26">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={featureUsage}
              layout="vertical"
              margin={{ left: 100 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Bar
                dataKey="value"
                fill="#2563EB"
                radius={[0, 6, 6, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PlatformAnalytics;
