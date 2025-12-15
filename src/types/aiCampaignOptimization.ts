export type ImpactLevel = "high" | "medium";

export interface OptimizationItem {
  id: number;
  title: string;
  description: string;
  impact: ImpactLevel;
}
