import React from "react";
import type {
  TransactionItem,
  PlanType,
  TransactionStatus,
} from "@/types/transactions";

/* =========================
   FAKE DATA (API READY)
========================= */

const TRANSACTIONS: TransactionItem[] = [
  {
    id: 1,
    user: "john@company.com",
    plan: "Growth",
    amount: 1245,
    paymentMethod: "Visa ****4242",
    status: "completed",
    date: "2024-11-28 10:30 AM",
  },
  {
    id: 2,
    user: "john@company.com",
    plan: "Scale",
    amount: 1245,
    paymentMethod: "Visa ****4242",
    status: "completed",
    date: "2024-11-28 10:30 AM",
  },
  {
    id: 3,
    user: "john@company.com",
    plan: "Growth",
    amount: 1245,
    paymentMethod: "Visa ****4242",
    status: "refunded",
    date: "2024-11-28 10:30 AM",
  },
  {
    id: 4,
    user: "john@company.com",
    plan: "Starter",
    amount: 1245,
    paymentMethod: "Visa ****4242",
    status: "failed",
    date: "2024-11-28 10:30 AM",
  },
];

/* =========================
   HELPERS
========================= */

const planBadge = (plan: PlanType) => {
  if (plan === "Growth")
    return "border-blue-500 text-blue-600";
  if (plan === "Scale")
    return "border-purple-500 text-purple-600";
  return "border-slate-300 text-slate-600";
};

const statusBadge = (status: TransactionStatus) => {
  if (status === "completed")
    return "bg-green-50 text-green-600 border-green-200";
  if (status === "refunded")
    return "bg-yellow-50 text-yellow-600 border-yellow-200";
  return "bg-red-50 text-red-600 border-red-200";
};

/* =========================
   COMPONENT
========================= */

const Transactions: React.FC = () => {
  return (
    <div className="rounded-xl border bg-white overflow-hidden">
      {/* HEADER */}
      <div className="border-b px-6 py-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Recent Transactions
        </h2>
        <p className="text-xs text-slate-500">
          Track your active campaign performance
        </p>
      </div>

      {/* TABLE */}
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="p-4 w-[40px]">
              <input type="checkbox" />
            </th>
            <th className="p-4 text-left">User</th>
            <th className="p-4 text-center">Plan</th>
            <th className="p-4 text-center">Amount</th>
            <th className="p-4 text-center">
              Payment Method
            </th>
            <th className="p-4 text-center">Status</th>
            <th className="p-4 text-right">Date</th>
          </tr>
        </thead>

        <tbody>
          {TRANSACTIONS.map((t) => (
            <tr
              key={t.id}
              className="border-t hover:bg-slate-50"
            >
              <td className="p-4 text-center">
                <input type="checkbox" />
              </td>

              <td className="p-4 text-slate-900">
                {t.user}
              </td>

              <td className="p-4 text-center">
                <span
                  className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${planBadge(
                    t.plan
                  )}`}
                >
                  {t.plan}
                </span>
              </td>

              <td className="p-4 text-center font-medium">
                ${t.amount.toLocaleString()}
              </td>

              <td className="p-4 text-center text-slate-600">
                {t.paymentMethod}
              </td>

              <td className="p-4 text-center">
                <span
                  className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${statusBadge(
                    t.status
                  )}`}
                >
                  {t.status.charAt(0).toUpperCase() +
                    t.status.slice(1)}
                </span>
              </td>

              <td className="p-4 text-right text-slate-500">
                {t.date}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
