// types/subscription.ts

export type PlanKey = "starter" | "growth" | "scale";

export type Plan = {
  key: PlanKey;
  title: string;
  price: number;
  popular?: boolean;
  features: string[];
  description: string;
};

export type BillingHistoryItem = {
  id: number;
  amount: number;
  date: string;
  status: "Paid";
};

export type CardForm = {
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvv: string;
};
