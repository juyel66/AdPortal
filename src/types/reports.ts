export type ReportType = "Weekly" | "Monthly" | "Custom";
export type Platform = "Meta" | "TikTok" | "Google";
export type Metric = "Spend" | "Impressions" | "Click" | "CTR" | "CPC" | "ROAS";

export interface CreateReportForm {
  reportType: ReportType;
  platforms: Platform[];
  metrics: Metric[];
  startDate?: string;  // Added for custom reports
  endDate?: string;    // Added for custom reports
}

export interface RecentReport {
  id: string;
  title: string;
  date: string;
  frequency: string;
  fileUrl: string;
}

export interface ApiReport {
  id: string;
  name: string;
  created_at: string;
  report_type: string;
  file: string;
}

export interface ApiReportResponse {
  report_type: string;
  included_metrics: string[];
  start_date?: string;  
  end_date?: string;    
}

export interface PaginatedReportsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApiReport[];
}