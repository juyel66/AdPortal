



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
import { Sparkles, SlidersHorizontal } from "lucide-react";

/**
 * SpendOverview component
 * - Uses recharts LineChart inside a responsive card
 * - Shows three KPIs below the chart
 * - Right column: AI Insights cards
 */

const data = [
  { month: "Jan", google: 120, meta: 100, tiktok: 90 },
  { month: "Feb", google: 180, meta: 150, tiktok: 140 },
  { month: "Mar", google: 240, meta: 200, tiktok: 190 },
  { month: "Apr", google: 320, meta: 280, tiktok: 260 },
  { month: "May", google: 420, meta: 360, tiktok: 330 },
  { month: "Jun", google: 580, meta: 480, tiktok: 450 },
];

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

export default function SpendOverview() {
  return (
    <div className="w-full grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Left / Main: Chart + KPIs (span 2 on lg) */}
      <div className="lg:col-span-2 rounded-xl bg-white p-6 shadow-sm">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold text-gray-900">Spend Overview <span className="ml-2 inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">AI Analyzed</span></div>
            <div className="mt-1 text-sm text-gray-500">Last 7 weeks performance across all platforms</div>
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
            <LineChart data={data} margin={{ top: 8, right: 24, left: 0, bottom: 8 }}>
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
          <KpiCard title="Meta" value="$4,300" delta="+8.2%" />
          <KpiCard title="Google" value="$2,100" delta="+12.5%" />
          <KpiCard title="TikTok" value="$2,300" delta="+15.3%" />
        </div>
      </div>

      {/* Right column: AI Insights */}
      <aside className="rounded-xl bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Sparkles className="h-5 w-5 text-indigo-500" />
            <span>AI Insights</span>
          </div>
          <div className="text-sm text-gray-400">Real-time recommendations</div>
        </div>

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

        <div className="mt-4">
          <button className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow hover:bg-blue-700 transition">
            View All AI Insights
          </button>
        </div>
      </aside>
    </div>
  );
}
