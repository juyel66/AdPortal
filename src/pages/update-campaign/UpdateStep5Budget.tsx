import React, { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import api from "@/lib/axios";

type BudgetType = "daily" | "lifetime";
type PlatformKey = 'google' | 'facebook' | 'tiktok';

interface PlatformBudgetData {
  budget: number;
  budgetType: BudgetType;
  startDate: string;
  endDate: string;
  runContinuously: boolean;
}

interface BudgetEntry {
  platform: string;
  budget_type: string;
  budget: number;
  start_date?: string;
  end_date?: string | null;
  run_continuously?: boolean;
}

// Platform to API value mapping
const platformToApiValue: Record<string, string> = {
  google: "GOOGLE",
  facebook: "META",
  tiktok: "TIKTOK"
};

// API value to Platform mapping
const apiValueToPlatform: Record<string, PlatformKey> = {
  "GOOGLE": "google",
  "META": "facebook",
  "TIKTOK": "tiktok"
};

const PLATFORM_LABELS: Record<PlatformKey, string> = {
  google: "Google",
  facebook: "Meta",
  tiktok: "TikTok",
};

const UpdateStep5Budget: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");
  
  const campaignId = id || localStorage.getItem("campaignId");

  const [selectedPlatform, setSelectedPlatform] = useState<PlatformKey>('google');
  const [campaignData, setCampaignData] = useState<{ id: number; status: string; budgets: BudgetEntry[] } | null>(null);
  const [integrationStatus, setIntegrationStatus] = useState<Record<string, boolean>>({});
  const [integrationLoading, setIntegrationLoading] = useState(true);

  const getDefaultData = (): PlatformBudgetData => {
    const today = new Date().toISOString().split('T')[0];
    const end = new Date();
    end.setDate(end.getDate() + 30);
    return {
      budget: 100,
      budgetType: 'daily',
      startDate: today,
      endDate: end.toISOString().split('T')[0],
      runContinuously: false,
    };
  };

  const [platformBudgets, setPlatformBudgets] = useState<Record<PlatformKey, PlatformBudgetData>>({
    google: getDefaultData(),
    facebook: getDefaultData(),
    tiktok: getDefaultData(),
  });

  const current = platformBudgets[selectedPlatform];

  const updateCurrent = (patch: Partial<PlatformBudgetData>) => {
    setPlatformBudgets(prev => ({
      ...prev,
      [selectedPlatform]: { ...prev[selectedPlatform], ...patch },
    }));
  };

  const getOrgId = () => {
    try {
      const selectedOrg = localStorage.getItem("selectedOrganization");
      if (selectedOrg) {
        const orgData = JSON.parse(selectedOrg);
        return orgData.id;
      }
      return null;
    } catch (error) {
      console.error("Error parsing organization data:", error);
      return null;
    }
  };

  const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getDefaultEndDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0];
  };

  const fetchCampaignData = async () => {
    if (!campaignId) {
      setError("Campaign ID not found");
      setFetchLoading(false);
      return;
    }

    const org_id = getOrgId();
    if (!org_id) {
      setError("No organization selected");
      setFetchLoading(false);
      return;
    }

    try {
      const [campaignResponse, integrationResponse] = await Promise.all([
        api.get(`/main/campaign/${campaignId}/?org_id=${org_id}`),
        api.get(`/main/integrations-status/?org_id=${org_id}`),
      ]);

      console.log("📥 Campaign data:", campaignResponse.data);
      setCampaignData(campaignResponse.data);

      // Integration status
      const statusMap: Record<string, boolean> = {};
      (integrationResponse.data.integrations as { platform: string; status: boolean }[]).forEach((item) => {
        statusMap[item.platform] = item.status;
      });
      setIntegrationStatus(statusMap);
      setIntegrationLoading(false);

      // Budgets data - populate platformBudgets from API response
      const campaignBudgets: BudgetEntry[] = campaignResponse.data.budgets || [];
      
      if (campaignBudgets.length > 0) {
        // Create a copy of default data
        const updatedBudgets = { ...platformBudgets };
        
        campaignBudgets.forEach((budget) => {
          if (budget.platform && apiValueToPlatform[budget.platform]) {
            const platformKey = apiValueToPlatform[budget.platform];
            updatedBudgets[platformKey] = {
              budget: budget.budget || 100,
              budgetType: budget.budget_type === 'DAILY' ? 'daily' : 'lifetime',
              startDate: budget.start_date ? budget.start_date.split('T')[0] : getCurrentDate(),
              endDate: budget.end_date ? budget.end_date.split('T')[0] : (budget.run_continuously ? '' : getDefaultEndDate()),
              runContinuously: budget.run_continuously || false,
            };
          }
        });
        
        setPlatformBudgets(updatedBudgets);

        // Auto-select first platform that has budget
        const firstPlatform = campaignBudgets[0]?.platform;
        if (firstPlatform && apiValueToPlatform[firstPlatform]) {
          setSelectedPlatform(apiValueToPlatform[firstPlatform]);
        }
      } else {
        // Auto-select first connected platform
        const first = (integrationResponse.data.integrations as { platform: string; status: boolean }[]).find(i => i.status);
        if (first && apiValueToPlatform[first.platform]) {
          setSelectedPlatform(apiValueToPlatform[first.platform]);
        }
      }

    } catch (err: unknown) {
      console.error("Error fetching campaign:", err);
      const e = err as { response?: { data: { message?: string } } };
      setError(e.response?.data?.message || "Failed to fetch campaign data");
    } finally {
      setFetchLoading(false);
    }
  };

  // কম্পোনেন্ট mount হওয়ার সময় ডাটা ফেচ করা
  useEffect(() => {
    fetchCampaignData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId]);

  const handleRunContinuouslyToggle = () => {
    const newValue = !current.runContinuously;
    const today = new Date().toISOString().split('T')[0];
    const end = new Date();
    end.setDate(end.getDate() + 30);
    updateCurrent({
      runContinuously: newValue,
      endDate: newValue ? '' : (current.endDate || end.toISOString().split('T')[0]),
      startDate: current.startDate || today,
    });
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
      const org_id = getOrgId();
      if (!org_id) {
        setError("No organization selected");
        setLoading(false);
        return;
      }

      // Build budgets array for all enabled platforms
      const budgets = (Object.keys(platformBudgets) as PlatformKey[])
        .filter(key => integrationStatus[platformToApiValue[key]])
        .map(key => {
          const d = platformBudgets[key];
          return {
            platform: platformToApiValue[key],
            budget_type: d.budgetType === 'daily' ? 'DAILY' : 'ONETIME',
            start_date: d.startDate,
            end_date: d.runContinuously ? null : d.endDate,
            budget: d.budget,
            run_continuously: d.runContinuously,
          };
        });

      const requestData = {
        campaign_id: parseInt(campaignId),
        budgets,
      };

      console.log("📤 Updating budget data with POST:", {
        url: `/main/update-ad/?org_id=${org_id}`,
        data: requestData
      });

      const response = await api.post(`/main/update-ad/?org_id=${org_id}`, requestData);
      console.log("✅ Budget updated:", response.data);

      navigate(`/user-dashboard/campaigns-update/${campaignId}/update-step-6`);

    } catch (err: unknown) {
      const e = err as { response?: { data: { message?: string } } };
      setError(e.response?.data?.message || "Failed to save budget data");
      console.error("❌ Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading || integrationLoading) {
    return (
      <div className="w-full bg-white rounded-2xl border border-gray-200 p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Update Budget & Schedule</h2>
          <p className="text-sm text-gray-500">Loading your budget data...</p>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-500">Loading budget data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Update Budget & Schedule
        </h2>
        <p className="text-sm text-gray-500">
          Set your campaign budget and schedule for each platform
        </p>
        
        {/* Show campaign ID */}
        {campaignId && campaignData && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
            <p className="text-xs font-medium text-blue-800">
              Campaign ID: <span className="font-bold">{campaignData.id}</span> | 
              Status: <span className="font-bold">{campaignData.status}</span>
            </p>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Platform Tabs */}
      <div className="flex gap-6 mb-6 border-b border-gray-200">
        {(['google', 'facebook', 'tiktok'] as PlatformKey[]).map(key => {
          const apiKey = platformToApiValue[key];
          const enabled = integrationStatus[apiKey];
          const isActive = selectedPlatform === key;
          return (
            <button
              key={key}
              onClick={() => enabled && setSelectedPlatform(key)}
              disabled={!enabled}
              className={`text-sm font-medium pb-3 transition-all border-b-2 -mb-px
                ${!enabled
                  ? 'text-gray-300 cursor-not-allowed border-transparent'
                  : isActive
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700 border-transparent'
                }
              `}
            >
              {PLATFORM_LABELS[key]}
            </button>
          );
        })}
      </div>

      {/* Budget Type */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Budget Type
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => updateCurrent({ budgetType: "daily" })}
            className={`rounded-xl border p-4 text-left transition
              ${
                current.budgetType === "daily"
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
            onClick={() => updateCurrent({ budgetType: "lifetime" })}
            className={`rounded-xl border p-4 text-left transition
              ${
                current.budgetType === "lifetime"
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
          {current.budgetType === "daily" ? "Daily Budget" : "Lifetime Budget"} for {PLATFORM_LABELS[selectedPlatform]}
        </label>

        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
            $
          </span>
          <input
            type="number"
            value={current.budget}
            onChange={(e) => updateCurrent({ budget: Number(e.target.value) })}
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
              value={current.startDate}
              onChange={(e) => updateCurrent({ startDate: e.target.value })}
              className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
          </div>

          {/* End Date */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 mt-3 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <label className="text-sm text-gray-700" htmlFor="">End Date</label>
            <input
              type="date"
              value={current.endDate}
              disabled={current.runContinuously}
              onChange={(e) => updateCurrent({ endDate: e.target.value })}
              className={`w-full rounded-lg border pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 cursor-pointer
                ${
                  current.runContinuously
                    ? "bg-gray-100 border-gray-200 cursor-not-allowed"
                    : "border-gray-300 focus:ring-blue-500"
                }
              `}
              min={current.startDate || getCurrentDate()}
            />
          </div>
        </div>

        {/* Run Continuously Checkbox */}
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={current.runContinuously}
            onChange={handleRunContinuouslyToggle}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          Run continuously (no end date)
        </label>
        <p className="text-xs text-gray-400 mt-1">
          {current.runContinuously 
            ? "✓ Campaign will run continuously" 
            : "✗ Campaign will end on selected date"}
        </p>
      </div>

      {/* Budget Summary — all enabled platforms */}
      <div className="space-y-3 mb-4">
        {(Object.keys(platformBudgets) as PlatformKey[])
          .filter(key => integrationStatus[platformToApiValue[key]])
          .map(key => {
            const d = platformBudgets[key];
            return (
              <div key={key} className="rounded-xl border border-blue-400 bg-linear-to-r from-blue-50 to-indigo-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Budget Summary</p>
                    <p className="text-xs text-gray-500">
                      {d.budgetType === 'daily' ? 'Daily Budget' : 'Lifetime Budget'} • {PLATFORM_LABELS[key]}
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">${d.budget}</p>
                </div>
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <p className="text-xs text-gray-600">
                    {d.runContinuously
                      ? `Starts: ${d.startDate || 'Not set'} • Runs continuously`
                      : `Starts: ${d.startDate || 'Not set'} • Ends: ${d.endDate || 'Not set'}`
                    }
                  </p>
                </div>
              </div>
            );
          })}
      </div>

      {/* API Request Preview */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs font-medium text-gray-700 mb-2">
          Will Update Campaign #{campaignId} with (POST Request):
        </p>
        <pre className="text-xs bg-white p-2 rounded overflow-auto">
          {JSON.stringify({
            campaign_id: parseInt(campaignId || "0"),
            budgets: (Object.keys(platformBudgets) as PlatformKey[])
              .filter(key => integrationStatus[platformToApiValue[key]])
              .map(key => {
                const d = platformBudgets[key];
                return {
                  platform: platformToApiValue[key],
                  budget_type: d.budgetType === 'daily' ? 'DAILY' : 'ONETIME',
                  start_date: d.startDate,
                  end_date: d.runContinuously ? null : d.endDate,
                  budget: d.budget,
                  run_continuously: d.runContinuously,
                };
              })
          }, null, 2)}
        </pre>
        <p className="text-xs text-blue-600 mt-2">
          ✓ POST Request to: /main/update-ad/?org_id={getOrgId()}
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-5">
        <Link
          to={`/user-dashboard/campaigns-update/${campaignId}/update-step-4`}
          className="btn md:w-40 text-gray-700 border rounded-xl border-gray-700 hover:bg-gray-400 hover:text-white"
        >
          Previous
        </Link>

        <button
          onClick={handleSubmit}
          disabled={loading || !campaignId}
          className="btn md:w-40 text-white bg-blue-600 hover:bg-blue-700 rounded-xl border disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Updating..." : "Update & Continue"}
        </button>
      </div>
    </div>
  );
};

export default UpdateStep5Budget;