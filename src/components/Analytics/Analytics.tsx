import React, { useState, useEffect } from "react";
import {
  DollarSign,
  Eye,
  Target,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  MousePointer,
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
import { toast } from "sonner";
import api from "../../lib/axios"; 

// Types
interface MetricValue {
  value: number;
  change_percent: number;
}

interface TopMetrics {
  total_spend: MetricValue;
  impressions: MetricValue;
  click_rate: MetricValue;
  conversions: MetricValue;
}

interface MonthlyData {
  clicks: number;
  conversions: number;
  impressions: number;
}

interface MonthlyPerformance {
  [key: string]: MonthlyData;
}

interface SpendByPlatform {
  META: number;
  GOOGLE: number;
  TIKTOK: number;
}

interface DevicePerformance {
  [key: string]: any;
}

interface AnalyticsData {
  top_metrics: TopMetrics;
  monthly_performance: MonthlyPerformance;
  spend_by_platform: SpendByPlatform;
  device_performance: DevicePerformance;
}

// Transformed types for UI
export interface StatCard {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ReactNode;
}

export interface PlatformSpend {
  name: "Meta" | "Google" | "TikTok";
  value: number;
  color: string;
}

export interface MonthlyPerformanceData {
  date: string;
  impressions: number;
  clicks: number;
  conversions: number;
}

export interface DeviceData {
  device: string;
  impressions: number;
  clicks: number;
}

// Colors for platforms
const PLATFORM_COLORS = {
  META: "#3B82F6", // Blue
  GOOGLE: "#10B981", // Green
  TIKTOK: "#A855F7", // Purple
};

// Default device data (dummy data since API doesn't provide it)
const DEFAULT_DEVICE_DATA: DeviceData[] = [
  { device: "Mobile", impressions: 125000, clicks: 4300 },
  { device: "Desktop", impressions: 92000, clicks: 3200 },
  { device: "Tablet", impressions: 38000, clicks: 1500 },
];

const Analytics: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  void analyticsData;
  
  // Transformed data for UI
  const [stats, setStats] = useState<StatCard[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyPerformanceData[]>([]);
  const [spendPlatform, setSpendPlatform] = useState<PlatformSpend[]>([]);
  const [deviceData] = useState<DeviceData[]>(DEFAULT_DEVICE_DATA);
  const [selectedOrgId, setSelectedOrgId] = useState<string>("");

  // Get org_id from localStorage selectedOrganization
  const getOrgIdFromStorage = (): string => {
    try {
      const selectedOrg = localStorage.getItem("selectedOrganization");
      if (selectedOrg) {
        const orgData = JSON.parse(selectedOrg);
        return orgData.org_id || orgData.id || "";
      }
    } catch (error) {
      console.error("Error parsing selectedOrganization:", error);
    }
    return "";
  };

  // Listen for organization changes
  useEffect(() => {
    const handleStorageChange = () => {
      const newOrgId = getOrgIdFromStorage();
      if (newOrgId !== selectedOrgId) {
        setSelectedOrgId(newOrgId);
      }
    };

    // Initial load
    const initialOrgId = getOrgIdFromStorage();
    setSelectedOrgId(initialOrgId);

    // Listen for storage events (for multi-tab support)
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for same-tab updates (if you dispatch one)
    window.addEventListener('organizationChanged', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('organizationChanged', handleStorageChange);
    };
  }, [selectedOrgId]);

  // Fetch analytics data when org_id changes
  useEffect(() => {
    if (selectedOrgId) {
      fetchAnalyticsData();
    } else {
      setLoading(false);
      setError("No organization selected");
    }
  }, [selectedOrgId]);

  // Fetch analytics data
  const fetchAnalyticsData = async () => {
    if (!selectedOrgId) {
      setError("No organization selected");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/main/analytics/?org_id=${selectedOrgId}`);
      
      if (response.data) {
        setAnalyticsData(response.data);
        transformData(response.data);
        
        // toast.success('Analytics data loaded successfully', {
        //   duration: 3000,
        //   position: 'top-center',
        // });
      }
    } catch (error: any) {
      console.error("Error fetching analytics data:", error);
      setError("Failed to load analytics data");
      
      toast.error(error.response?.data?.message || 'Failed to load analytics data', {
        duration: 4000,
        position: 'top-center',
      });
    } finally {
      setLoading(false);
    }
  };

  // Transform API data to UI format
  const transformData = (data: AnalyticsData) => {
    // Transform top metrics
    const transformedStats: StatCard[] = [
      {
        label: "Total Spend",
        value: `$${data.top_metrics.total_spend.value.toLocaleString()}`,
        change: `${data.top_metrics.total_spend.change_percent > 0 ? '+' : ''}${data.top_metrics.total_spend.change_percent}%`,
        positive: data.top_metrics.total_spend.change_percent >= 0,
        icon: <DollarSign size={16} className="text-blue-600" />,
      },
      {
        label: "Impressions",
        value: data.top_metrics.impressions.value.toLocaleString(),
        change: `${data.top_metrics.impressions.change_percent > 0 ? '+' : ''}${data.top_metrics.impressions.change_percent}%`,
        positive: data.top_metrics.impressions.change_percent >= 0,
        icon: <Eye size={16} className="text-green-600" />,
      },
      {
        label: "Click Rate",
        value: `${data.top_metrics.click_rate.value}%`,
        change: `${data.top_metrics.click_rate.change_percent > 0 ? '+' : ''}${data.top_metrics.click_rate.change_percent}%`,
        positive: data.top_metrics.click_rate.change_percent >= 0,
        icon: <MousePointer size={16} className="text-blue-500" />,
      },
      {
        label: "Conversions",
        value: data.top_metrics.conversions.value.toLocaleString(),
        change: `${data.top_metrics.conversions.change_percent > 0 ? '+' : ''}${data.top_metrics.conversions.change_percent}%`,
        positive: data.top_metrics.conversions.change_percent >= 0,
        icon: <Target size={16} className="text-purple-600" />,
      },
    ];
    setStats(transformedStats);

    // Transform monthly performance
    const months = Object.keys(data.monthly_performance);
    const transformedMonthly = months.map(month => ({
      date: month,
      impressions: data.monthly_performance[month].impressions,
      clicks: data.monthly_performance[month].clicks,
      conversions: data.monthly_performance[month].conversions,
    }));
    setMonthlyData(transformedMonthly);

    // Transform spend by platform
    const transformedSpend: PlatformSpend[] = [
      {
        name: "Meta",
        value: data.spend_by_platform.META,
        color: PLATFORM_COLORS.META,
      },
      {
        name: "Google",
        value: data.spend_by_platform.GOOGLE,
        color: PLATFORM_COLORS.GOOGLE,
      },
      {
        name: "TikTok",
        value: data.spend_by_platform.TIKTOK,
        color: PLATFORM_COLORS.TIKTOK,
      },
    ];
    setSpendPlatform(transformedSpend);
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchAnalyticsData();
  };

  // Custom label for pie chart
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

  // No organization selected
  if (!selectedOrgId && !loading) {
    return (
      <div className="space-y-6 mt-5">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Analytics</h1>
          <p className="text-sm text-slate-500">
            Comprehensive performance insights across all platforms
          </p>
        </div>

        <div className="rounded-xl border bg-white p-12 text-center">
          <div className="text-slate-400 mb-3">
            <Target size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            No Organization Selected
          </h3>
          <p className="text-sm text-slate-500">
            Please select an organization to view analytics data.
          </p>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6 mt-5">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Analytics</h1>
            <p className="text-sm text-slate-500">
              Comprehensive performance insights across all platforms
            </p>
          </div>
        </div>

        {/* Stats Loading Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl border bg-white p-4 animate-pulse">
              <div className="h-9 w-9 bg-slate-200 rounded-full mb-3"></div>
              <div className="h-4 bg-slate-200 rounded w-24 mb-2"></div>
              <div className="h-6 bg-slate-200 rounded w-16"></div>
            </div>
          ))}
        </div>

        {/* Chart Loading Skeletons */}
        <div className="rounded-xl bg-white border p-6 animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-48 mb-4"></div>
          <div className="h-72 bg-slate-100 rounded"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl bg-white border p-6 animate-pulse">
            <div className="h-6 bg-slate-200 rounded w-40 mb-4"></div>
            <div className="h-72 bg-slate-100 rounded"></div>
          </div>
          <div className="rounded-xl bg-white border p-6 animate-pulse">
            <div className="h-6 bg-slate-200 rounded w-48 mb-4"></div>
            <div className="h-64 bg-slate-100 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6 mt-5">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Analytics</h1>
            <p className="text-sm text-slate-500">
              Comprehensive performance insights across all platforms
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            <RefreshCw size={16} />
            Retry
          </button>
        </div>

        <div className="rounded-xl border bg-white p-12 text-center">
          <div className="text-slate-400 mb-3">
            <Target size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Failed to Load Analytics
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            {error}
          </p>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-5">
      {/* Header with Refresh and Organization Info */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Analytics</h1>
          <p className="text-sm text-slate-500">
            {selectedOrgId && `Organization ID: ${selectedOrgId}`}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition"
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border bg-white p-4 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              {/* Icon */}
              <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center">
                {stat.icon}
              </div>

              {/* Change Badge */}
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

      {/* Line Chart - Monthly Performance */}
      {monthlyData.length > 0 && (
        <div className="rounded-xl bg-white border p-6">
          <div className="flex justify-between mb-4">
            <h2 className="font-semibold text-slate-900">
              Performance Over Time
            </h2>
            <span className="text-sm text-slate-500">Last 6 Months</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="clicks" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Clicks"
                />
                <Line 
                  type="monotone" 
                  dataKey="conversions" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  name="Conversions"
                />
                <Line 
                  type="monotone" 
                  dataKey="impressions" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Impressions"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Bottom Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spend by Platform */}
        <div className="rounded-xl bg-white border p-6">
          <h2 className="font-semibold text-slate-900 mb-4">
            Spend by Platform
          </h2>

          {spendPlatform.some(p => p.value > 0) ? (
            <>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={spendPlatform as any[]}
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
                      ${item.value.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-72 flex items-center justify-center text-slate-400">
              No spend data available
            </div>
          )}
        </div>

        {/* Performance by Device (Dummy Data) */}
        <div className="rounded-xl bg-white border p-6">
          <h2 className="font-semibold text-slate-900 mb-4">
            Performance by Device
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deviceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="device" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="clicks" 
                  fill="#10B981" 
                  name="Clicks"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="impressions" 
                  fill="#3B82F6" 
                  name="Impressions"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-400 text-center mt-4">
            * Sample data shown. Device performance tracking coming soon.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;