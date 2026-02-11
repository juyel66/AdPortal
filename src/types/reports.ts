export type ReportType = "Weekly" | "Monthly" | "Custom";
export type Platform = "Meta" | "TikTok" | "Google";
export type Metric = "Spend" | "Impressions" | "Click" | "CTR" | "CPC" | "ROAS";

export interface RecentReport {
  id: number;
  title: string;
  date: string;
  frequency: string;
  fileUrl: string;
}

export interface CreateReportForm {
  reportType: ReportType;
  platforms: Platform[];
  metrics: Metric[];
}

export interface ApiReport {
  id: number;
  name: string;
  created_at: string;
  report_type: string;
  file: string;
}

export interface ApiReportResponse {
  report_type: string;
  included_metrics: string[];
}

export interface PaginatedReportsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApiReport[];
}