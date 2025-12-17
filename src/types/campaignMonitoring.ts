// src/types/campaignMonitoring.ts

export type CampaignStatus = "active" | "paused" | "draft";

export type PlatformType = "meta" | "google" | "tiktok";

export interface CampaignStat {
  title: string;
  value: string | number;
  sub: string;
  variant?: "green" | "yellow" | "blue";
}

export interface CampaignItem {
  id: number;
  name: string;
  status: CampaignStatus;
  platforms: PlatformType[];
  spend: number;
  impressions: string;
  ctr: string;
}


export interface CampaignSummaryItem {
  title: string;
  value: number;
  percentage: string;
}
