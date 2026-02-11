export type PlanKey = "starter" | "growth" | "scale";

export interface Plan {
  key: PlanKey;
  title: string;
  price: number;
  description: string;
  popular?: boolean;
  features: string[];
  id: number; // Added ID field
}

export interface BillingHistoryItem {
  id: number;
  amount: number;
  date: string;
  status: string;
  invoice_file?: string;
}

export interface CardForm {
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvv: string;
}

export interface ApiFeature {
  key: string;
  value: string;
}

export interface ApiPlan {
  id: number;
  name: string;
  price: string;
  description: string;
  interval: string;
  features: ApiFeature[];
}

export interface ApiBillingHistoryItem {
  id: number;
  amount: number;
  date: string;
  status: string;
  invoice_file: string;
}

export interface CheckoutResponse {
  checkout_url: string;
}