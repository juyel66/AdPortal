export type ObjectiveKey =
  | "conversions"
  | "traffic"
  | "awareness"
  | "engagement"
  | "lead_generation"
  | "app_promotion";

export interface CampaignObjective {
  key: ObjectiveKey;
  title: string;
  description: string;
  recommended?: boolean;
}
