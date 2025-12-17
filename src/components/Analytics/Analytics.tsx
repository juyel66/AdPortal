// Analytics.tsx
// Analytics Dashboard – pixel-perfect UI with Recharts

import React from "react";
import {
  DollarSign,
  Eye,

  Target,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
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
  BarChart,
  Bar,
  Legend,
} from "recharts";

/* =========================
   Types
========================= */

type StatCard = {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ReactNode;
};

type PlatformSpend = {
  name: "Meta" | "Google" | "TikTok";
  value: number;
  color: string;
};

/* =========================
   Fake Data
========================= */

const stats: StatCard[] = [
  {
    label: "Total Spend",
    value: "$8,700",
    change: "+12.3%",
    positive: true,
    icon: <DollarSign size={16} className="text-blue-600" />,
  },
  {
    label: "Impressions",
    value: "2.4M",
    change: "+18.2%",
    positive: true,
    icon: <Eye size={16} className="text-green-600" />,
  },
  {
    label: "Click Rate",
    value: "3.42%",
    change: "-0.5%",
    positive: false,
    icon: <img src="https://res.cloudinary.com/dqkczdjjs/image/upload/v1765841382/Icon_14_snirvz.png" alt="" />
  },
  {
    label: "Conversions",
    value: "752",
    change: "+24.8%",
    positive: true,
    icon: <Target size={16} className="text-indigo-600" />,
  },
];

const lineData = [
  { date: "Jan 1", impressions: 48000, clicks: 1200, conversions: 120 },
  { date: "Jan 8", impressions: 54000, clicks: 1400, conversions: 150 },
  { date: "Jan 15", impressions: 50000, clicks: 1300, conversions: 140 },
  { date: "Jan 22", impressions: 62000, clicks: 1700, conversions: 180 },
  { date: "Jan 29", impressions: 59000, clicks: 1600, conversions: 165 },
  { date: "Feb 5", impressions: 68000, clicks: 1900, conversions: 210 },
  { date: "Feb 12", impressions: 73000, clicks: 2100, conversions: 240 },
];

const spendPlatform: PlatformSpend[] = [
  { name: "Meta", value: 4300, color: "#3B82F6" },
  { name: "Google", value: 2100, color: "#10B981" },
  { name: "TikTok", value: 2300, color: "#A855F7" },
];

const deviceData = [
  { device: "Mobile", impressions: 120000, clicks: 4200 },
  { device: "Desktop", impressions: 90000, clicks: 3100 },
  { device: "Tablet", impressions: 35000, clicks: 1400 },
];

/* =========================
   Custom Pie Label
========================= */

const renderPieLabel = (props: any) => {
  const { cx, cy, midAngle, outerRadius, percent, name, fill } = props;
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
      fontSize={14}
      fontWeight={500}
    >
      {name}: {(percent * 100).toFixed(0)}%
    </text>
  );
};

/* =========================
   Component
========================= */

const Analytics: React.FC = () => {
  return (
    <div className="space-y-6 mt-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Analytics</h1>
        <p className="text-sm text-slate-500">
          Comprehensive performance insights across all platforms
        </p>
      </div>

      {/* ✅ Stat Cards – SAME TO SAME DESIGN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border bg-white p-4"
          >
            {/* Top Row */}
            <div className="flex items-center justify-between">
              {/* Icon */}
              <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center">
                {stat.icon}
              </div>

              {/* Percentage badge */}
              <div
                className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                  stat.positive
                    ? "bg-green-50 text-green-600"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {stat.positive ? (
                  <TrendingUp size={12} />
                ) : (
                  <TrendingDown size={12} />
                )}
                {stat.change}
              </div>
            </div>

            {/* Label */}
            <p className="mt-3 text-sm text-slate-500">{stat.label}</p>

            {/* Value */}
            <p className="mt-1 text-xl font-semibold text-slate-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Line Chart */}
      <div className="rounded-xl bg-white border p-6">
        <div className="flex justify-between mb-4">
          <h2 className="font-semibold text-slate-900">
            Performance Over Time
          </h2>
          <span className="text-sm text-slate-500">Last 7 Days</span>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line dataKey="clicks" stroke="#10B981" strokeWidth={2} />
              <Line dataKey="conversions" stroke="#F59E0B" strokeWidth={2} />
              <Line dataKey="impressions" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spend by Platform */}
        <div className="rounded-xl bg-white border p-6">
          <h2 className="font-semibold text-slate-900 mb-4">
            Spend by Platform
          </h2>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={spendPlatform}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  outerRadius={90}
                  label={renderPieLabel}
                  labelLine={false}
                >
                  {spendPlatform.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 flex justify-around text-center">
            {spendPlatform.map((item) => (
              <div key={item.name}>
                <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  {item.name}
                </div>
                <p className="mt-1 text-base font-semibold text-slate-900">
                  ${item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Performance by Device */}
        <div className="rounded-xl bg-white border p-6">
          <h2 className="font-semibold text-slate-900 mb-4">
            Performance by Device
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deviceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="device" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="clicks" fill="#10B981" />
                <Bar dataKey="impressions" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
