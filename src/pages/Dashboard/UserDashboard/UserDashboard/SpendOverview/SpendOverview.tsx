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
import {  SlidersHorizontal } from "lucide-react";
import ai from "/src/assets/ai22.svg"
import ai2 from "/src/assets/aaiiiiiiiiii.svg"

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
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

function KpiCard({ title, value, delta }: { title: string; value: string; delta?: string }) {
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

function InsightCard({ title, body, severity }: { title: string; body: string; severity?: "High" | "Medium" | "Low" }) {
  const color =
    severity === "High" ? "bg-green-50 text-green-700" : severity === "Medium" ? "bg-yellow-50 text-yellow-700" : "bg-gray-50 text-gray-700";

  return (
    <div className="mb-3 rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-800">
            <SlidersHorizontal className="h-4 w-4 text-gray-400" />
            <span>{title}</span>
          </div>
          <div className="text-sm text-gray-500">{body}</div>
        </div>
        {severity && <div className={`ml-3 rounded-full px-2 py-1 text-xs font-semibold ${color}`}>{severity}</div>}
      </div>
    </div>
  );
}

export default function SpendOverview({ data: spendData, aiInsights = [] }: SpendOverviewProps) {
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

    const months = Object.keys(spendData).sort((a, b) => {
      const monthsOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return monthsOrder.indexOf(a) - monthsOrder.indexOf(b);
    });

    return months.map(month => ({
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
    
    Object.values(spendData).forEach(month => {
      totals.meta += month.META || 0;
      totals.google += month.GOOGLE || 0;
      totals.tiktok += month.TIKTOK || 0;
    });

    return totals;
  };

  const chartData = transformDataForChart();
  const platformTotals = calculatePlatformTotals();

  // Map API impact to severity
  const mapImpactToSeverity = (impact: string): "High" | "Medium" | "Low" => {
    switch (impact) {
      case "HIGH": return "High";
      case "MEDIUM": return "Medium";
      default: return "Low";
    }
  };

  return (
    <div className="w-full grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Left / Main: Chart + KPIs (span 2 on lg) */}
      <div className="lg:col-span-2 rounded-xl bg-white p-6 shadow-sm">
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
              Last 7 weeks performance across all platforms
            </div>
          </div>

          <div>
            <select className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
            </select>
          </div>
        </div>

        {/* Chart area */}
        <div className="h-64 w-full rounded-lg bg-white/50 p-3">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 8, right: 24, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: "#E6E9EE" }} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
              <Line type="monotone" dataKey="google" stroke="#31D0B0" strokeWidth={3} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="meta" stroke="#2D6FF8" strokeWidth={3} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="tiktok" stroke="#9AE6B4" strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* KPI cards under chart */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <KpiCard title="Meta" value={formatCurrency(platformTotals.meta)} delta="+8.2%" />
          <KpiCard title="Google" value={formatCurrency(platformTotals.google)} delta="+12.5%" />
          <KpiCard title="TikTok" value={formatCurrency(platformTotals.tiktok)} delta="+15.3%" />
        </div>
      </div>

      {/* Right column: AI Insights */}
      <aside className="rounded-xl bg-white p-4 shadow-sm">
<div>
          <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <img src={ai} alt="" className="h-8" />
            <span>AI Insights</span>
          </div>
          <div className="text-sm text-gray-400">Real-time recommendations</div>
        </div>

        {aiInsights && aiInsights.length > 0 ? (
          aiInsights.map((insight) => (
            <InsightCard
              key={insight.id}
              title={insight.title}
              body={insight.description}
              severity={mapImpactToSeverity(insight.impect)}
            />
          ))
        ) : (
          <>
            <InsightCard
              title="Budget Optimization"
              body="Google Ads performing 20% better than Meta. AI suggests shifting $10/day for +$340 monthly revenue."
              severity="High"
            />
            <InsightCard
              title="Creative Fatigue Detected"
              body="Summer Sale campaign creative is 14 days old. AI predicts 18% CTR drop in next 3 days. Refresh now."
              severity="Medium"
            />
            <InsightCard
              title="Audience Expansion"
              body="Your audience in 'Product Launch' has 85% overlap with high performers. AI recommends expansion."
              severity="High"
            />
          </>
        )}
</div>

        <div className="mt-4">
          <button className="w-full  rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow hover:bg-blue-700 transition flex items-center justify-center gap-2">
  <img src={ai2} alt="AI icon" className="w-5 h-5" />
  View All AI Insights
</button>

        </div>
      </aside>
    </div>
  );
}