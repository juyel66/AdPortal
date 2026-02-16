import React, { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { Link, useNavigate } from "react-router";
import api from "@/lib/axios";

type BudgetType = "daily" | "lifetime";

// Platform to API value mapping
const platformToApiValue: Record<string, string> = {
  google: "GOOGLE",
  facebook: "META",
  tiktok: "TIKTOK"
};

const Step5Budget: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Get campaign_id from localStorage
  const campaignId = localStorage.getItem("campaignId");

  // Local state for form inputs
  const [localBudget, setLocalBudget] = useState<number>(100);
  const [localBudgetType, setLocalBudgetType] = useState<'daily' | 'lifetime'>('daily');
  const [localStartDate, setLocalStartDate] = useState<string>('');
  const [localEndDate, setLocalEndDate] = useState<string>('');
  const [localRunContinuously, setLocalRunContinuously] = useState<boolean>(false);
  
  // Platform tab state
  const [selectedPlatform, setSelectedPlatform] = useState<'google' | 'facebook' | 'tiktok'>('google');

  const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getDefaultEndDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0];
  };

  // Initialize dates
  useEffect(() => {
    if (!localStartDate) {
      setLocalStartDate(getCurrentDate());
    }

    if (!localEndDate && !localRunContinuously) {
      setLocalEndDate(getDefaultEndDate());
    }
  }, []);

  const handleBudgetTypeChange = (type: BudgetType) => {
    setLocalBudgetType(type);
  };

  const handleBudgetChange = (amount: number) => {
    setLocalBudget(amount);
  };

  const handleStartDateChange = (date: string) => {
    setLocalStartDate(date);
  };

  const handleEndDateChange = (date: string) => {
    setLocalEndDate(date);
  };

  const handleRunContinuouslyToggle = () => {
    const newValue = !localRunContinuously;
    setLocalRunContinuously(newValue);
    
    if (newValue) {
      // ON - clear end date
      setLocalEndDate('');
    } else {
      // OFF - set default end date if none exists
      setLocalEndDate(localEndDate || getDefaultEndDate());
    }
  };

  // Submit to API
  const handleSubmit = async () => {
    if (!campaignId) {
      setError("Campaign ID not found. Please go back to Step 1.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Get org_id from localStorage
      const selectedOrg = localStorage.getItem("selectedOrganization");
      let org_id = "";
      if (selectedOrg) {
        const orgData = JSON.parse(selectedOrg);
        org_id = orgData.id;
      }

      // Prepare request data with correct mapping
      const requestData = {
        campaign_id: parseInt(campaignId),
        // include campaign name so backend receives the same campaign identifier
        campaign_name: localStorage.getItem("campaignName") || undefined,
        budgets: [
          {
            platform: platformToApiValue[selectedPlatform],
            budget_type: localBudgetType === 'daily' ? 'DAILY' : 'ONETIME',
            start_date: localStartDate,
            end_date: localRunContinuously ? null : localEndDate,
            budget: localBudget,
            run_continuously: localRunContinuously
          }
        ]
      };

      console.log(" Sending budget data:", requestData);

      const response = await api.post(`/main/create-ad/?org_id=${org_id}`, requestData);
      console.log(" Budget saved:", response.data);

      navigate("/user-dashboard/campaigns-create/step-6");

    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save budget data");
      console.error(" Error:", err);
    } finally {
      setLoading(false);
    }
  };

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
        
        {/* Show campaign ID */}
        {campaignId && (
          <p className="text-xs text-gray-400 mt-1">Campaign ID: {campaignId}</p>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Platform Tabs */}
      <div className="flex gap-6 mb-6">
        <button
          onClick={() => setSelectedPlatform('google')}
          className={`text-sm font-medium pb-2 transition-all
            ${selectedPlatform === 'google' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
            }
          `}
        >
          Google
        </button>
        <button
          onClick={() => setSelectedPlatform('facebook')}
          className={`text-sm font-medium pb-2 transition-all
            ${selectedPlatform === 'facebook' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
            }
          `}
        >
          Facebook
        </button>
        <button
          onClick={() => setSelectedPlatform('tiktok')}
          className={`text-sm font-medium pb-2 transition-all
            ${selectedPlatform === 'tiktok' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
            }
          `}
        >
          TikTok
        </button>
      </div>

      {/* Budget Type */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Budget Type
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleBudgetTypeChange("daily")}
            className={`rounded-xl border p-4 text-left transition
              ${
                localBudgetType === "daily"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:bg-gray-50"
              }
            `}
          >
            <p className="text-sm font-bold text-gray-900">Daily Budget</p>
            <p className="text-xs text-gray-500">Average amount per day</p>
            
          </button>

          <button
            type="button"
            onClick={() => handleBudgetTypeChange("lifetime")}
            className={`rounded-xl border p-4 text-left transition
              ${
                localBudgetType === "lifetime"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:bg-gray-50"
              }
            `}
          >
            <p className="text-sm font-bold text-gray-900">Lifetime Budget</p>
            <p className="text-xs text-gray-500">Total for entire campaign</p>
            
          </button>
        </div>
      </div>

      {/* Budget Input */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 block mb-1">
          {localBudgetType === "daily" ? "Daily Budget" : "Lifetime Budget"} for {selectedPlatform}
        </label>

        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
            $
          </span>
          <input
            type="number"
            value={localBudget}
            onChange={(e) => handleBudgetChange(Number(e.target.value))}
            className="w-full rounded-lg border border-gray-300 pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter amount"
            step="1"
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Enter any amount you prefer
        </p>
      </div>

      {/* Campaign Schedule */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Campaign Schedule
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
          {/* Start Date */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 mt-3 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <label htmlFor=" " className="text-sm text-gray-700">Start Date</label>
            <input
              type="date"
              value={localStartDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
              className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
          </div>

          {/* End Date */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 mt-3 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <label className="text-sm text-gray-700" htmlFor="">End Date</label>
            <input
              type="date"
              value={localEndDate}
              disabled={localRunContinuously}
              onChange={(e) => handleEndDateChange(e.target.value)}
              className={`w-full rounded-lg border pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 cursor-pointer
                ${
                  localRunContinuously
                    ? "bg-gray-100 border-gray-200 cursor-not-allowed"
                    : "border-gray-300 focus:ring-blue-500"
                }
              `}
              min={localStartDate || getCurrentDate()}
            />
          </div>
        </div>

        {/* Run Continuously Checkbox */}
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={localRunContinuously}
            onChange={handleRunContinuouslyToggle}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          Run continuously (no end date)
        </label>
        <p className="text-xs text-gray-400 mt-1">
          {localRunContinuously 
            ? "✓ Campaign will run continuously" 
            : "✗ Campaign will end on selected date"}
        </p>
      </div>

      {/* Budget Summary */}
      <div className="rounded-xl border border-blue-400 bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Budget Summary
            </p>
            <p className="text-xs text-gray-500">
              {localBudgetType === "daily" ? "Daily Budget" : "Lifetime Budget"} • {selectedPlatform}
            </p>
          </div>

          <p className="text-lg font-semibold text-gray-900">${localBudget}</p>
        </div>
        
        {/* Schedule Summary */}
        <div className="mt-3 pt-3 border-t border-blue-200">
          <p className="text-xs text-gray-600">
            {localRunContinuously 
              ? `Starts: ${localStartDate || 'Not set'} • Runs continuously`
              : `Starts: ${localStartDate || 'Not set'} • Ends: ${localEndDate || 'Not set'}`
            }
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-5">
        <Link
          to="/user-dashboard/campaigns-create/step-4"
          className="btn md:w-40 text-gray-700 border rounded-xl border-gray-700 hover:bg-gray-400 hover:text-white"
        >
          Previous
        </Link>

        <button
          onClick={handleSubmit}
          disabled={loading || !campaignId}
          className="btn md:w-40 text-white bg-blue-600 hover:bg-blue-700 rounded-xl border disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Continue"}
        </button>
      </div>
    </div>
  );
};

export default Step5Budget;