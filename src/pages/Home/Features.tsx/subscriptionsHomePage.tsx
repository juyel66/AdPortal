// SubscriptionBilling.tsx
import React, { useState } from "react";
import { Check, X, ArrowRight } from "lucide-react";

import type { Plan, CardForm, PlanKey } from "@/types/subscription";

/* =========================
   PLAN DATA (UI MATCHED)
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
      "Automate everything. Outsmart competitors. Grow profitably with AI.",
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
    <div className="container mx-auto px-4 py-14">
      {/* HEADER */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 ">
          Simple, <span className="text-blue-600">Transparent</span> Pricing
        </h1>
        <p className="mt-3 text-lg text-slate-500">
          Start free, upgrade as you grow.
        </p>
      </div>

      {/* PLANS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6  ">
        {plans.map((plan) => {
          const isActive = plan.key === activePlan;

          return (
            <div
              key={plan.key}
              onClick={() => setActivePlan(plan.key)}
              className={`relative rounded-2xl border p-6 cursor-pointer transition-all 
                ${
                  isActive
                    ? "border-blue-600 shadow-xl scale-[1.03]"
                    : ""
                }`}
            >
              {/* MOST POPULAR */}
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-600">
                  Most Popular
                </span>
              )}

              <h3 className="text-lg font-semibold text-slate-900">
                {plan.title}
              </h3>

              <p className="mt-2 text-sm text-slate-500">{plan.description}</p>

              {/* PRICE */}
              <div className="mt-6 flex items-end gap-1">
                <span className="text-4xl font-bold text-slate-900">
                  ${plan.price}
                </span>
                <span className="text-sm text-slate-500">/ month</span>
              </div>

              {/* FEATURES */}
              <ul className="mt-6 space-y-3 text-sm text-slate-600">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <Check size={16} className="text-blue-600 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenModal(true);
                }}
                className={`mt-8 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition
                  ${
                    isActive
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                  }`}
              >
                Get Started
                <ArrowRight size={16} />
              </button>
            </div>
          );
        })}
      </div>

      {/* ADD CARD MODAL */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="relative w-full max-w-md rounded-xl bg-white p-6">
            <button
              onClick={() => setOpenModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X size={18} />
            </button>

            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Add New Card
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-600">Card Number</label>
                <input
                  value={cardForm.cardNumber}
                  onChange={(e) =>
                    setCardForm({ ...cardForm, cardNumber: e.target.value })
                  }
                  placeholder="1234 5678 9012 3456"
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="text-sm text-slate-600">
                  Card Holder Name
                </label>
                <input
                  value={cardForm.cardHolder}
                  onChange={(e) =>
                    setCardForm({ ...cardForm, cardHolder: e.target.value })
                  }
                  placeholder="John Doe"
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-slate-600">Expiry</label>
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
                  <label className="text-sm text-slate-600">CVV</label>
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
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setOpenModal(false)}
                className="rounded-lg border px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
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
