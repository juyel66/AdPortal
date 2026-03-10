import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Sparkles, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ai from "/src/assets/ai22.svg";
import ai2 from "/src/assets/aaiiiiiiiiii.svg";

interface SpendOverviewProps {
  data?: {
    [key: string]: {
      META: number;
      GOOGLE: number;
      TIKTOK: number;
    };
  };
  aiInsights?: Array<{
    id: number;
    title: string;
    description: string;
    created_at: string;
    impect: "HIGH" | "MEDIUM" | "LOW";
  }>;
}

// Helper function to format currency
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

function KpiCard({
  title,
  value,
  delta,
}: {
  title: string;
  value: string;
  delta?: string;
}) {
  return (
    <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-2 flex items-end justify-between">
        <div className="text-lg font-semibold text-gray-900">{value}</div>
        {delta && (
          <div className="text-xs font-medium rounded-full bg-green-50 px-2 py-1 text-green-600">
            {delta}
          </div>
        )}
      </div>
    </div>
  );
}

function InsightCard({
  title,
  body,
  severity,
}: {
  title: string;
  body: string;
  severity?: "High" | "Medium" | "Low";
}) {
  const badgeColor =
    severity === "High"
      ? "bg-green-50 text-green-700"
      : severity === "Medium"
        ? "bg-yellow-50 text-yellow-700"
        : "bg-gray-50 text-gray-700";

  const iconBg =
    severity === "High"
      ? "bg-green-100"
      : severity === "Medium"
        ? "bg-orange-100"
        : "bg-gray-100";

  const IconComponent =
    severity === "High"
      ? TrendingUp
      : severity === "Medium"
        ? Sparkles
        : Target;

  const iconColor =
    severity === "High"
      ? "text-green-600"
      : severity === "Medium"
        ? "text-orange-500"
        : "text-gray-500";

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3">
          <div className={`shrink-0 rounded-full p-2 ${iconBg}`}>
            <IconComponent className={`h-4 w-4 ${iconColor}`} />
          </div>
          <div>
            <div className="mb-1 text-sm font-semibold text-gray-800">{title}</div>
            <div className="text-xs text-gray-500 leading-relaxed">{body}</div>
          </div>
        </div>
        {severity && (
          <div className={`ml-1 shrink-0 rounded-full px-2 py-1 text-xs font-semibold ${badgeColor}`}>
            {severity}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SpendOverview({
  data: spendData,
  aiInsights = [],
}: SpendOverviewProps) {
  const navigate = useNavigate();

  // Transform API data for chart
  const transformDataForChart = () => {
    if (!spendData || Object.keys(spendData).length === 0) {
      return [
        { month: "Jan", google: 0, meta: 0, tiktok: 0 },
        { month: "Feb", google: 0, meta: 0, tiktok: 0 },
        { month: "Mar", google: 0, meta: 0, tiktok: 0 },
        { month: "Apr", google: 0, meta: 0, tiktok: 0 },
        { month: "May", google: 0, meta: 0, tiktok: 0 },
        { month: "Jun", google: 0, meta: 0, tiktok: 0 },
      ];
    }

    const months = Object.keys(spendData);

    return months.map((month) => ({
      month,
      google: spendData[month]?.GOOGLE || 0,
      meta: spendData[month]?.META || 0,
      tiktok: spendData[month]?.TIKTOK || 0,
    }));
  };

  // Calculate platform totals
  const calculatePlatformTotals = () => {
    if (!spendData || Object.keys(spendData).length === 0) {
      return { meta: 0, google: 0, tiktok: 0 };
    }

    const totals = { meta: 0, google: 0, tiktok: 0 };

    Object.values(spendData).forEach((month) => {
      totals.meta += month.META || 0;
      totals.google += month.GOOGLE || 0;
      totals.tiktok += month.TIKTOK || 0;
    });

    return totals;
  };

  const handleViewAllInsights = () => {
    
    navigate("/user-dashboard/ai-tools#optimization");
  };

  const chartData = transformDataForChart();
  const platformTotals = calculatePlatformTotals();

  // Map API impact to severity
  const mapImpactToSeverity = (impact: string): "High" | "Medium" | "Low" => {
    switch (impact) {
      case "HIGH":
        return "High";
      case "MEDIUM":
        return "Medium";
      default:
        return "Low";
    }
  };

  return (
    <div className="w-full grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Left / Main: Chart + KPIs (span 2 on lg) */}
      <div className="lg:col-span-2 rounded-xl bg-white p-6 shadow-sm ">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold text-gray-900">
              Spend Overview
              <span className="ml-2 inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                AI Analyzed
              </span>
            </div>
            <div className="mt-1 text-sm text-gray-500">
              Last 6 Months performance across all platforms
            </div>
          </div>

       
        </div>

        {/* Chart area */}
        <div className="h-64 w-full rounded-lg bg-white/50 p-3">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 8, right: 24, left: 0, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={{ stroke: "#E6E9EE" }}
              />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
              <Line
                type="monotone"
                dataKey="google"
                stroke="#31D0B0"
                strokeWidth={3}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="meta"
                stroke="#2D6FF8"
                strokeWidth={3}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="tiktok"
                stroke="#9AE6B4"
                strokeWidth={3}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* KPI cards under chart */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <KpiCard
            title="Meta"
            value={formatCurrency(platformTotals.meta)}
            delta="+8.2%"
          />
          <KpiCard
            title="Google"
            value={formatCurrency(platformTotals.google)}
            delta="+12.5%"
          />
          <KpiCard
            title="TikTok"
            value={formatCurrency(platformTotals.tiktok)}
            delta="+15.3%"
          />
        </div>
      </div>

      {/* Right column: AI Insights */}
      <aside className="rounded-xl bg-white p-4 shadow-sm flex flex-col">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <img src={ai} alt="" className="h-8" />
            <span>AI Insights</span>
          </div>
          <div className="text-sm text-gray-400">
            Real-time recommendations
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-2">
          {aiInsights && aiInsights.length > 0 ? (
            aiInsights.slice(0, 3).map((insight) => (
              <div key={insight.id} className="flex-1">
                <InsightCard
                  title={insight.title.slice(0, 30) + (insight.title.length > 30 ? "..." : "")}
                  body={insight.description.slice(0, 60) + (insight.description.length > 50 ? "..." : "")}
                  severity={mapImpactToSeverity(insight.impect)}
                />
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center text-gray-400">
              <Target className="mb-3 h-8 w-8 text-gray-300" />
              <p className="text-sm font-medium text-gray-500">No AI insights available</p>
              <p className="mt-1 text-xs text-gray-400">Insights will appear once your campaigns have enough data.</p>
            </div>
          )}
        </div>

        {aiInsights && aiInsights.length > 0 && (
          <div className="mt-4">
            <button
              onClick={handleViewAllInsights}
              className="w-full cursor-pointer rounded-md px-4 py-3 text-sm font-semibold text-white shadow transition flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <img src={ai2} alt="AI icon" className="w-5 h-5" />
              View All AI Insights
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}