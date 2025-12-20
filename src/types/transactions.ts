export type PlanType = "Growth" | "Scale" | "Starter";

export type TransactionStatus =
  | "completed"
  | "refunded"
  | "failed";

export interface TransactionItem {
  id: number;
  user: string;
  plan: PlanType;
  amount: number;
  paymentMethod: string;
  status: TransactionStatus;
  date: string;
}
