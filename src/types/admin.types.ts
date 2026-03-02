export interface AdminStats {
  totalUsers: number;
  activeCampaigns: number;
  monthlyRevenue: number;
  newUsersThisWeek: number;
  campaignsCreatedToday: number;
  revenueGrowth: number;
  usersGrowth: number;
  campaignsGrowth: number;
}

export interface GrowthDataPoint {
  month: string;
  users: number;
  revenue: number;
}

export interface PlatformCampaignData {
  name: 'Meta' | 'Google' | 'TikTok';
  value: number;
  count: number;
  color: string;
}

export interface RecentCampaignItem {
  id: string | number;
  title: string;
  userEmail: string;
  timeAgo: string;
  status: 'success' | 'warning' | 'error';
  amount?: string;
  platform?: string;
  createdAt?: string;
}

export interface SystemStatusItem {
  id: string | number;
  title: string;
  status: string;
  uptime: string;
  icon?: string;
}

export interface AdminDashboardData {
  stats: AdminStats;
  growthData: GrowthDataPoint[];
  platformData: PlatformCampaignData[];
  recentCampaigns: RecentCampaignItem[];
  systemStatus: SystemStatusItem[];
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}