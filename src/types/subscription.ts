export type PlanKey = "starter" | "growth" | "scale";

export type Plan = {
  key: PlanKey;
  title: string;
  price: number;
  description: string;
  popular?: boolean;
  features: string[];
};

export type BillingHistoryItem = {
  id: number;
  amount: number;
  date: string;
  status: "Paid" | "Failed" | "Pending";
};

export type CardForm = {
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvv: string;
};
