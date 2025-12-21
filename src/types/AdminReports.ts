export type ReportType = "Weekly" | "Monthly" | "Quarterly" | "Custom";

export type ReportMetric =
  | "Revenue Overview"
  | "Revenue by Plan"
  | "User Growth"
  | "Feature Usage"
  | "Monthly Revenue"
  | "MRR Growth"
  | "Total Transactions"
  | "Failed Payments";

export type ReportCard = {
  id: number;
  title: string;
  type: ReportType;
  date: string;
};

export type CreateReportForm = {
  reportType: ReportType;
  metrics: ReportMetric[];
};
