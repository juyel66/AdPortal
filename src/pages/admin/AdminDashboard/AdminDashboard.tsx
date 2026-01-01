import React from "react";
import { Users, Megaphone, DollarSign, TrendingUp } from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import type { PieLabelRenderProps } from "recharts";
import AdminRecentCampaign from "./AdminManagementPages";
// import ArrowUp from "../../../assets/rightGreen.svg";

/* =========================
   TYPES
========================= */

type StatCardType = {
  title: string;
  value: string | number;
  sub: string;
  change: string;
  positive?: boolean;
  icon: React.ReactNode;
};

type PlatformData = {
  name: "Meta" | "Google" | "TikTok";
  value: number;
  count: number;
  color: string;
};

type GrowthData = {
  month: string;
  users: number;
  revenue: number;
};

/* =========================
   FAKE DATA (API READY)
========================= */

const stats: StatCardType[] = [
  {
    title: "Total Users",
    value: 474,
    sub: "53 new this week",
    change: "+22.3%",
    positive: true,
    icon: <Users size={16} className="" />,
  },
  {
    title: "Active Campaigns",
    value: 1234,
    sub: "90 created today",
    change: "+9.2%",
    positive: true,
    icon: <Megaphone size={16} className="text-[#55E8C6]" />,
  },
  {
    title: "Monthly Revenue",
    value: "$23,445",
    sub: "MRR growing",
    change: "+23.8%",
    positive: true,
    icon: <DollarSign size={16} className="text-[#7EB5FF]" />,
  },
];

const growthData: GrowthData[] = [
  { month: "Jan", users: 120, revenue: 3200 },
  { month: "Feb", users: 180, revenue: 4800 },
  { month: "Mar", users: 240, revenue: 6200 },
  { month: "Apr", users: 310, revenue: 8400 },
  { month: "May", users: 380, revenue: 10800 },
  { month: "Jun", users: 460, revenue: 13500 },
];

const spendPlatform: PlatformData[] = [
  { name: "Meta", value: 49, count: 430, color: "#3B82F6" },
  { name: "Google", value: 24, count: 234, color: "#10B981" },
  { name: "TikTok", value: 26, count: 267, color: "#A855F7" },
];

/* =========================
   PIE LABEL (TYPE SAFE)
========================= */

const renderPieLabel = (props: PieLabelRenderProps) => {
  const { cx, cy, midAngle, outerRadius, percent, name, fill } = props;

  if (
    cx === undefined ||
    cy === undefined ||
    midAngle === undefined ||
    outerRadius === undefined ||
    percent === undefined
  ) {
    return null;
  }

  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 28;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill={fill}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={13}
      fontWeight={500}
    >
      {name}: {(percent * 100).toFixed(0)}%
    </text>
  );
};



const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
      <h1 className="flex items-center text-xl font-semibold text-slate-900">
  Admin Dashboard
  <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
    <img
      src="https://res.cloudinary.com/dqkczdjjs/image/upload/v1767287296/Icon_23_u6eirf.png"
      alt=""
      className="w-3 h-3"
    />
    Real time
  </span>
</h1>

        <p className="text-sm text-slate-500">
          Monitor platform performance and user activity
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.title} className="rounded-xl border bg-white p-4">
            <div className="flex items-center justify-between">
              <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center">
                {stat.icon}
              </div>

              <div className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs text-green-600">
                <TrendingUp size={12} />
             
                {stat.change}
              </div>
            </div>

            <p className="mt-3 text-sm text-slate-500">{stat.title}</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">
              {stat.value}
            </p>
            <p className="mt-1 text-xs text-slate-500">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* USER GROWTH */}
        <div className="rounded-xl border bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold text-slate-900">
            User Growth & Revenue
          </h2>

          <div className="h-full p-5">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line dataKey="users" stroke="#3B82F6" strokeWidth={2} />
                <Line dataKey="revenue" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CAMPAIGN BY PLATFORM */}
        <div className="rounded-xl border bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold text-slate-900">
            Campaign by Platform
          </h2>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={spendPlatform}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={renderPieLabel}
                  labelLine={false}
                >
                  {spendPlatform.map((p) => (
                    <Cell key={p.name} fill={p.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {spendPlatform.map((p) => (
              <div
                key={p.name}
                className="rounded-lg border px-3 py-2 text-center"
              >
                <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: p.color }}
                  />
                  {p.name}
                </div>
                <p className="mt-1 text-sm font-semibold">{p.count}</p>
                <p className="text-[11px] text-slate-500">Campaigns</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AdminRecentCampaign />
    </div>
  );
};

export default AdminDashboard;
