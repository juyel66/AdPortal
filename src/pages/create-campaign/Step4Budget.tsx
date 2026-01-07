import React, { useState } from "react";
import { Calendar } from "lucide-react";

type BudgetType = "daily" | "lifetime";

const Step4Budget: React.FC = () => {
  const [budgetType, setBudgetType] = useState<BudgetType>("daily");
  const [budget, setBudget] = useState<number>(100);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [runContinuously, setRunContinuously] = useState<boolean>(false);

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Budget & Schedule
        </h2>
        <p className="text-sm text-gray-500">
          Set your campaign budget and schedule
        </p>
      </div>

      {/* Budget Type */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Budget Type
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setBudgetType("daily")}
            className={`rounded-xl border p-4 text-left transition
              ${
                budgetType === "daily"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:bg-gray-50"
              }
            `}
          >
            <p className="text-sm font-bold text-gray-900">
              Daily Budget
            </p>
            <p className="text-xs text-gray-500">
              Average amount per day
            </p>
          </button>

          <button
            onClick={() => setBudgetType("lifetime")}
            className={`rounded-xl border p-4 text-left transition
              ${
                budgetType === "lifetime"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:bg-gray-50"
              }
            `}
          >
            <p className="text-sm font-bold text-gray-900">
              Lifetime Budget
            </p>
            <p className="text-xs text-gray-500">
              Total for entire campaign
            </p>
          </button>
        </div>
      </div>

      {/* Budget Input */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 block mb-1">
          {budgetType === "daily" ? "Daily Budget" : "Lifetime Budget"}
        </label>

        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="$100"
        />

        <p className="text-xs text-gray-400 mt-1">
          Recommended minimum: $20/day
        </p>
      </div>

      {/* Schedule */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 block mb-2">
          {budgetType === "daily" ? "Daily Budget" : "Campaign Schedule"}
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
          {/* Start Date */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* End Date */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={endDate}
              disabled={runContinuously}
              onChange={(e) => setEndDate(e.target.value)}
              className={`w-full rounded-lg border pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2
                ${
                  runContinuously
                    ? "bg-gray-100 border-gray-200 cursor-not-allowed"
                    : "border-gray-300 focus:ring-blue-500"
                }
              `}
            />
          </div>
        </div>

        {/* Run continuously */}
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={runContinuously}
            onChange={() => setRunContinuously(!runContinuously)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          Run continuously (no end date)
        </label>
      </div>

      {/* Budget Summary */}
      <div className="rounded-xl border border-blue-400 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900">
              $ Budget Summary
            </p>
            <p className="text-xs text-gray-500">
              {budgetType === "daily" ? "Daily Budget" : "Lifetime Budget"}
            </p>
          </div>

          <p className="text-lg font-semibold text-gray-900">
            ${budget}
          </p>
        </div>
      </div>

      {/* Footer Buttons */}
   
    </div>
  );
};

export default Step4Budget;
