import React from "react";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  XCircle,

} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import type {
  FinanceStat,
  RevenueChartData,
  RevenuePlan,
} from "@/types/finance";
import Transactions from "./Transactions/Transactions";



const stats: FinanceStat[] = [
  {
    title: "Monthly Revenue",
    value: "$47,800",
    change: "+$2,000",
    positive: true,
  },
  {
    title: "MRR Growth",
    value: "+15.2%",
    change: "+2.1%",
    positive: true,
  },
  {
    title: "Total Transactions",
    value: "1,245",
    change: "+125",
    positive: true,
  },
  {
    title: "Failed Payments",
    value: "12",
    change: "-3",
    positive: false,
  },
];

const revenueData: RevenueChartData[] = [
  { month: "Jun", revenue: 32000 },
  { month: "Jul", revenue: 38000 },
  { month: "Aug", revenue: 34000 },
  { month: "Sep", revenue: 42000 },
  { month: "Oct", revenue: 46000 },
  { month: "Nov", revenue: 48000 },
];

const revenueByPlan: RevenuePlan[] = [
  { name: "Starter", subscribers: 245, revenue: 12005 },
  { name: "Growth", subscribers: 128, revenue: 19072 },
  { name: "Enterprise", subscribers: 42, revenue: 16758 },
];



const Finance: React.FC = () => {
  const maxRevenue = Math.max(...revenueByPlan.map((p) => p.revenue));

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            Finance
          </h1>
          <p className="text-sm text-slate-500">
            Finance Overview
          </p>
        </div>

      
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Monthly Revenue */}
        <StatCard
          icon={<DollarSign size={18} className="text-blue-600" />}
          title={stats[0].title}
          value={stats[0].value}
          change={stats[0].change}
          positive
        />

        {/* MRR Growth */}
        <StatCard
          icon={<TrendingUp size={18} className="text-emerald-600" />}
          title={stats[1].title}
          value={stats[1].value}
          change={stats[1].change}
          positive
        />

        {/* Total Transactions */}
        <StatCard
          icon={<CreditCard size={18} className="text-indigo-600" />}
          title={stats[2].title}
          value={stats[2].value}
          change={stats[2].change}
          positive
        />

        {/* Failed Payments */}
        <StatCard
          icon={<XCircle size={18} className="text-red-600" />}
          title={stats[3].title}
          value={stats[3].value}
          change={stats[3].change}
          positive={false}
        />
      </div>


      <div className="rounded-xl border bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Revenue Overview
            </h2>
            <p className="text-xs text-slate-500">
              Monthly revenue
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            Revenue
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#2563EB"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

  
   
      <div className="rounded-xl border bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">
          Revenue by Plan
        </h2>

        <div className="space-y-4">
          {revenueByPlan.map((plan) => {
            const width =
              (plan.revenue / maxRevenue) * 100;

            return (
              <div key={plan.name}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-slate-900">
                      {plan.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {plan.subscribers} subscribers
                    </p>
                  </div>

                  <p className="font-medium text-slate-900">
                    ${plan.revenue.toLocaleString()}
                  </p>
                </div>

                <div className="h-2 w-full rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all"
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>



      <div>
        <Transactions />
      </div>
    </div>
  );
};

export default Finance;



const StatCard = ({
  icon,
  title,
  value,
  change,
  positive,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  change?: string;
  positive?: boolean;
}) => {
  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="h-9 w-9 rounded-xl  bg-slate-100 flex items-center justify-center">
          {icon}
        </div>

        {change && (
          <span
            className={`rounded-full px-2 py-0.5 text-xs ${
              positive
                ? "bg-green-50 text-green-600"
                : "bg-red-50 text-red-600"
            }`}
          >
            {change}
          </span>
        )}
      </div>

      <p className="mt-3 text-sm text-slate-500">
        {title}
      </p>
      <p className="mt-1 text-xl font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
};
