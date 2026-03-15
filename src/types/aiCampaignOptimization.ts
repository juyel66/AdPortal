export type impactLevel = "high" | "medium" | "low";

export interface OptimizationItem {
  id: number;
  title: string;
  description: string;
  impact: impactLevel;
}
