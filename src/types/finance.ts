export interface FinanceStat {
  title: string;
  value: string | number;
  change?: string;
  positive?: boolean;
}

export interface RevenueChartData {
  month: string;
  revenue: number;
}

export interface RevenuePlan {
  name: "Starter" | "Growth" | "Enterprise";
  subscribers: number;
  revenue: number;
}
