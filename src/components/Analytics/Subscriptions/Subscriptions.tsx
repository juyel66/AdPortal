// SubscriptionBilling.tsx
import React, { useState } from "react";
import { Check, X, FileText } from "lucide-react";

import type {
  Plan,
  BillingHistoryItem,
  CardForm,
  PlanKey,
} from "@/types/subscription";

/* =========================
   FULL PLAN DATA (SAME AS UI)
========================= */

const plans: Plan[] = [
  {
    key: "starter",
    title: "Starter",
    price: 79,
    description:
      "Launch quickly. Spend smarter. AI-powered ads without the complexity.",
    features: [
      "25 Campaigns per month",
      "Connect Meta, Google, and TikTok",
      "Manage campaigns on all platforms",
      "Standard analytics dashboard",
      "Performance-over-time charts",
      "AI Copy Generator",
      "Standard AI Smart Insights",
      "Standard budget optimization suggestions",
      "Upload creatives",
      "Email support",
    ],
  },
  {
    key: "growth",
    title: "Growth",
    price: 199,
    popular: true,
    description:
      "Scale campaigns with data-driven insights and collaboration tools.",
    features: [
      "Everything in Starter",
      "100 campaigns per month",
      "Full AI Smart Insights",
      "AI budget optimization (daily recommendations)",
      "AI creative fatigue detection",
      "Audience expansion suggestions",
      "Multi-platform spend & device performance analysis",
      "Detailed platform-level reports",
      "Team collaboration (up to 5 users)",
      "Priority support",
    ],
  },
  {
    key: "scale",
    title: "Scale",
    price: 499,
    description:
      "Automate everything. Outsmart competitors. Grow profitably with AI",
    features: [
      "Everything in Growth",
      "Unlimited campaigns per month",
      "Full AI optimization engine (budget shifts + alerts)",
      "Advanced audience & trend analysis",
      "Custom analytics dashboards",
      "Full reporting suite",
      "Unlimited team collaboration",
      "Agency workspace navigation",
      "Premium onboarding",
    ],
  },
];

const billingHistory: BillingHistoryItem[] = [
  { id: 1, amount: 199, date: "2025-08-12", status: "Paid" },
  { id: 2, amount: 199, date: "2025-09-12", status: "Paid" },
  { id: 3, amount: 199, date: "2025-10-12", status: "Paid" },
];

/* =========================
   Component
========================= */

const SubscriptionBilling: React.FC = () => {
  const [activePlan, setActivePlan] = useState<PlanKey>("growth");
  const [openModal, setOpenModal] = useState(false);

  const [cardForm, setCardForm] = useState<CardForm>({
    cardNumber: "",
    cardHolder: "",
    expiry: "",
    cvv: "",
  });

  return (
    <div className="space-y-6 mt-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          Subscription & Billing
        </h1>
        <p className="text-sm text-slate-500">
          Manage your subscription plan and billing information
        </p>
      </div>

      {/* =========================
         AVAILABLE PLANS
      ========================= */}
      <div>
        <h2 className="font-semibold text-slate-900 mb-4">
          Available Plans
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6  ">
          {plans.map((plan) => {
            const isActive = plan.key === activePlan;

            return (
              <div
                key={plan.key}
                onClick={() => setActivePlan(plan.key)}
                className={`relative cursor-pointer rounded-2xl border p-6 transition-all
                  ${
                    isActive
                      ? "border-blue-600 shadow-lg scale-[1.02]"
                      : "hover:border-slate-300"
                  }`}
              >
                {/* Most Popular */}
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-600">
                    Most Popular
                  </span>
                )}

                <h3 className="text-lg font-semibold text-slate-900">
                  {plan.title}
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mt-5 flex items-end gap-1">
                  <span className="text-3xl font-semibold text-slate-900">
                    ${plan.price}
                  </span>
                  <span className="text-sm text-slate-500">/ month</span>
                </div>

                {/* Features */}
                <ul className="mt-5 space-y-2 text-sm text-slate-600">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <Check size={16} className="text-blue-600 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* BUTTON (ONLY THIS OPENS MODAL) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // 🔴 IMPORTANT FIX
                    setOpenModal(true);
                  }}
                  className={`mt-6 w-full rounded-lg px-4 py-2 text-sm font-medium transition
                    ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "border text-slate-600 hover:bg-slate-50"
                    }`}
                >
                  {isActive ? "Current Plan" : "Upgrade"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================
         BILLING HISTORY
      ========================= */}
      <div className="rounded-xl border bg-white">
        <h2 className="px-6 py-4 font-semibold border-b">
          Billing History
        </h2>

        {billingHistory.map((item) => (
          <div
            key={item.id}
            className="flex  items-center justify-between px-6 py-4 border-b last:border-b-0"
          >
            <div className="flex items-center gap-3">
              <FileText size={18} />
              <div>
                <p className="text-sm font-medium">${item.amount}</p>
                <p className="text-xs text-slate-500">{item.date}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                Paid
              </span>
              <button className="rounded-md border px-3 py-1 text-xs">
                Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* =========================
         ADD CARD MODAL
      ========================= */}
      {openModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="w-full max-w-md rounded-xl bg-white p-6 relative">
            <button
              onClick={() => setOpenModal(false)}
              className="absolute right-4 top-4 text-slate-400"
            >
              <X size={18} />
            </button>

            <h2 className="text-lg font-semibold mb-4">Add New Card</h2>

            <label className="text-sm">Card Number</label>
            <input
              value={cardForm.cardNumber}
              onChange={(e) =>
                setCardForm({ ...cardForm, cardNumber: e.target.value })
              }
              placeholder="1234 5678 9012 3456"
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            />

            <label className="mt-3 block text-sm">Card Holder Name</label>
            <input
              value={cardForm.cardHolder}
              onChange={(e) =>
                setCardForm({ ...cardForm, cardHolder: e.target.value })
              }
              placeholder="Jhon Doe"
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            />

            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm">Expiry Date</label>
                <input
                  value={cardForm.expiry}
                  onChange={(e) =>
                    setCardForm({ ...cardForm, expiry: e.target.value })
                  }
                  placeholder="MM/YY"
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm">CVV</label>
                <input
                  value={cardForm.cvv}
                  onChange={(e) =>
                    setCardForm({ ...cardForm, cvv: e.target.value })
                  }
                  placeholder="123"
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setOpenModal(false)}
                className="rounded-lg border px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white">
                Add Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionBilling;
