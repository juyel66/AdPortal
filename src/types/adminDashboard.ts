import type { ReactNode } from "react";

/* =========================
   STAT CARD TYPE
========================= */
export type AdminStatCard = {
  title: string;
  value: string;
  sub: string;
  change: string;
  icon: ReactNode;
  positive: boolean;
};

/* =========================
   PLATFORM PIE DATA
========================= */
export type PlatformCampaign = {
  name: "Meta" | "Google" | "TikTok";
  value: number; // percentage
  color: string;
  count: number; // campaign count
};
