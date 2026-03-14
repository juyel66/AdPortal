import type { ReactNode } from "react";


export type AdminStatCard = {
  title: string;
  value: string;
  sub: string;
  change: string;
  icon: ReactNode;
  positive: boolean;
};


export type PlatformCampaign = {
  name: "Meta" | "Google" | "TikTok";
  value: number; 
  color: string;
  count: number; 
};
