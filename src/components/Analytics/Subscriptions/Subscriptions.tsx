
import React, { useState } from "react";
import { Check, X, FileText } from "lucide-react";
import jsPDF from "jspdf";

import type {
  Plan,
  BillingHistoryItem,
  CardForm,
  PlanKey,
} from "@/types/subscription";



const planOrder: PlanKey[] = ["starter", "growth", "scale"];



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

const BRAND_BLUE = "#2563EB";

const SubscriptionBilling: React.FC = () => {
  const [activePlan, setActivePlan] = useState<PlanKey>("growth");
  const [openModal, setOpenModal] = useState(false);

  const [cardForm, setCardForm] = useState<CardForm>({
    cardNumber: "",
    cardHolder: "",
    expiry: "",
    cvv: "",
  });

  console.log(setActivePlan);



  const handleCardChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCardForm({ ...cardForm, [e.target.name]: e.target.value });
  };

  const handleAddCard = () => {
    console.log("New card added:", cardForm);

    // Later: send to backend / Stripe
    setOpenModal(false);

    setCardForm({
      cardNumber: "",
      cardHolder: "",
      expiry: "",
      cvv: "",
    });
  };



  const downloadInvoice = (item: BillingHistoryItem) => {
    const doc = new jsPDF();

    doc.setTextColor(BRAND_BLUE);
    doc.setFontSize(22);
    doc.text("AdPortal Invoice", 20, 25);

    doc.setTextColor("#000");
    doc.setFontSize(12);
    doc.text(`Invoice ID: INV-${item.id}`, 20, 45);
    doc.text(`Billing Date: ${item.date}`, 20, 55);
    doc.text(`Status: ${item.status}`, 20, 65);

    doc.text("Billed To:", 20, 85);
    doc.text("AdPortal User", 20, 95);
    doc.text("support@adportal.ai", 20, 105);

    doc.text("Plan:", 20, 125);
    doc.text(activePlan.toUpperCase(), 80, 125);

    doc.text("Amount Paid:", 20, 145);
    doc.text(`$${item.amount}`, 80, 145);

    doc.setDrawColor(BRAND_BLUE);
    doc.line(20, 160, 190, 160);

    doc.setFontSize(10);
    doc.text(
      "Thank you for using AdPortal. This invoice confirms your subscription payment.",
      20,
      175
    );

    doc.save(`AdPortal_Invoice_${item.id}.pdf`);
  };

  return (
    <div className="space-y-6 mt-5">
      {/* HEADER */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          Subscription & Billing
        </h1>
        <p className="text-sm text-slate-500">
          Manage your subscription plan and billing information
        </p>
      </div>

      {/* PLANS */}
      <div>
        <h2 className="font-semibold text-slate-900 mb-4">
          Available Plans
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const activeIndex = planOrder.indexOf(activePlan);
            const planIndex = planOrder.indexOf(plan.key);

            const isCurrent = plan.key === activePlan;
            const isIncluded = planIndex < activeIndex;
            const isUpgrade = planIndex > activeIndex;

            let buttonLabel = "Upgrade";
            let buttonStyle =
              "border text-slate-600 hover:bg-slate-50";

            if (isCurrent) {
              buttonLabel = "Current Plan";
              buttonStyle =
                "bg-blue-600 text-white cursor-not-allowed";
            } else if (isIncluded) {
              buttonLabel = "Included";
              buttonStyle =
                "bg-slate-100 text-slate-500 cursor-not-allowed";
            }

            return (
              <div
                key={plan.key}
                className={`relative rounded-2xl border p-6 ${
                  isCurrent
                    ? "border-blue-600 shadow-lg scale-[1.02]"
                    : "hover:border-slate-300"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-600">
                    Most Popular
                  </span>
                )}

                <h3 className="text-lg font-semibold">
                  {plan.title}
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  {plan.description}
                </p>

                <div className="mt-5 flex items-end gap-1">
                  <span className="text-3xl font-semibold">
                    ${plan.price}
                  </span>
                  <span className="text-sm text-slate-500">
                    / month
                  </span>
                </div>

                <ul className="mt-5 space-y-2 text-sm text-slate-600">
                  {plan.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <Check
                        size={16}
                        className="text-blue-600 mt-0.5"
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  disabled={!isUpgrade}
                  onClick={() => isUpgrade && setOpenModal(true)}
                  className={`mt-6 w-full rounded-lg px-4 py-2 text-sm font-medium ${buttonStyle}`}
                >
                  {buttonLabel}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* BILLING HISTORY */}
      <div className="rounded-xl border bg-white">
        <h2 className="px-6 py-4 font-semibold border-b">
          Billing History
        </h2>

        {billingHistory.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between px-6 py-4 border-b last:border-b-0"
          >
            <div className="flex items-center gap-3">
              <FileText size={18} />
              <div>
                <p className="text-sm font-medium">
                  ${item.amount}
                </p>
                <p className="text-xs text-slate-500">
                  {item.date}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                Paid
              </span>
              <button
                onClick={() => downloadInvoice(item)}
                className="rounded-md border px-3 py-1 text-xs"
              >
                Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD CARD MODAL */}
      {openModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="w-full max-w-md rounded-xl bg-white p-6 relative">
            <button
              onClick={() => setOpenModal(false)}
              className="absolute right-4 top-4 text-slate-400"
            >
              <X size={18} />
            </button>

            <h2 className="text-2xl font-bold mb-4">
              Add New Card
            </h2>

            <div className="space-y-4">

              <label className="font-semibold" htmlFor="">Card Number</label>
              <input
                name="cardNumber"
                value={cardForm.cardNumber}
                onChange={handleCardChange}
                placeholder="1234 5678 9012 3456"
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
                 <label className="font-semibold" htmlFor="">Card Holder Name</label>
              <input
                name="cardHolder"
                value={cardForm.cardHolder}
                onChange={handleCardChange}
                placeholder="Card Holder Name"
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
                <label className="font-semibold" htmlFor="">Expiry Date</label>
              <div className="flex gap-4">
                <input
                  name="expiry"
                  value={cardForm.expiry}
                  onChange={handleCardChange}
                  placeholder="MM/YY"
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />

          
               
                <input
                  name="cvv"
                  value={cardForm.cvv}
                  onChange={handleCardChange}
                  placeholder="CVV"
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>



              <div className="flex gap-4 pt-2">
                <button
                  onClick={() => setOpenModal(false)}
                  className="w-full border rounded-lg py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCard}
                  className="w-full rounded-lg bg-blue-600 text-white py-2 text-sm"
                >
                  Add Card
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionBilling;
