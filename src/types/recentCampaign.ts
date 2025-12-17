// src/types/recentCampaign.ts

export type RecentCampaignStatus =
  | "success"
  | "warning"
  | "error"
  | "info";

export interface RecentCampaignItem {
  id: number;
  title: string;
  userEmail: string;
  timeAgo: string;
  amount?: string; // optional (e.g. $199)
  status: RecentCampaignStatus;
}

export interface SystemStatusItem {
  id: number;
  title: string;
  status: "Operational" | "Down";
  uptime: string;
}
