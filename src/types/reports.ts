// types/reports.ts

export type ReportType = "Weekly" | "Monthly" | "Custom";

export type Platform = "Meta" | "Google" | "TikTok";

export type Metric =
  | "Spend"
  | "Impressions"
  | "Click"
  | "CTR"
  | "CPC"
  | "ROAS";

export type RecentReport = {
  id: number;
  title: string;
  date: string;
  frequency: ReportType | "Quarterly";
};

export type CreateReportForm = {
  reportType: ReportType;
  platforms: Platform[];
  metrics: Metric[];
};
