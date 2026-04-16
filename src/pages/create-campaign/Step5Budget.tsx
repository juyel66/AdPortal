import React, { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router";
import api from "@/lib/axios";

type BudgetType = "daily" | "lifetime";
type PlatformKey = "google" | "facebook" | "tiktok";
type BudgetField = "budget" | "startDate" | "endDate";

interface PlatformBudgetData {
  budget: string;
  budgetType: BudgetType;
  startDate: string;
  endDate: string;
  runContinuously: boolean;
}

type ValidationIssue = {
  platform: PlatformKey;
  fields: BudgetField[];
};

const platformToApiValue: Record<PlatformKey, string> = {
  google: "GOOGLE",
  facebook: "META",
  tiktok: "TIKTOK",
};

const apiValueToPlatform: Record<string, PlatformKey> = {
  GOOGLE: "google",
  META: "facebook",
  TIKTOK: "tiktok",
};

const PLATFORM_LABELS: Record<PlatformKey, string> = {
  google: "Google",
  facebook: "Meta",
  tiktok: "TikTok",
};

const FIELD_LABELS: Record<BudgetField, string> = {
  budget: "Budget",
  startDate: "Start Date",
  endDate: "End Date",
};

const Step5Budget: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([]);
  const [integrationStatus, setIntegrationStatus] = useState<Record<string, boolean>>({});
  const [integrationLoading, setIntegrationLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformKey>("facebook");
  const [campaignPlatforms, setCampaignPlatforms] = useState<PlatformKey[]>([]);
  const [platformBudgets, setPlatformBudgets] = useState<Record<PlatformKey, PlatformBudgetData>>({
    google: getDefaultData(),
    facebook: getDefaultData(),
    tiktok: getDefaultData(),
  });

  const campaignId = searchParams.get("campaignId");
  const current = platformBudgets[selectedPlatform];

  function getDefaultData(): PlatformBudgetData {
    const today = new Date().toISOString().split("T")[0];
    const end = new Date();
    end.setDate(end.getDate() + 30);

    return {
      budget: "",
      budgetType: "daily",
      startDate: today,
      endDate: end.toISOString().split("T")[0],
      runContinuously: false,
    };
  }

  const getOrgId = () => {
    try {
      const selectedOrg = localStorage.getItem("selectedOrganization");
      if (!selectedOrg) return null;
      return JSON.parse(selectedOrg).id;
    } catch (error) {
      console.error("Error parsing organization data:", error);
      return null;
    }
  };

  const getCurrentDate = () => new Date().toISOString().split("T")[0];

  const getDefaultEndDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split("T")[0];
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

      const statusMap: Record<string, boolean> = {};
      (integrationResponse.data.integrations as { platform: string; status: boolean }[]).forEach((item) => {
        statusMap[item.platform] = item.status;
      });
      setIntegrationStatus(statusMap);

      const selectedPlatforms = (campaignResponse.data.platforms || [])
        .map((platform: string) => apiValueToPlatform[platform])
        .filter((platform: PlatformKey | undefined): platform is PlatformKey => Boolean(platform));
      setCampaignPlatforms(selectedPlatforms);

      const budgets = (campaignResponse.data.budgets || []) as Array<{
        platform: string;
        budget_type: string;
        budget: number;
        start_date?: string;
        end_date?: string | null;
        run_continuously?: boolean;
      }>;

      if (budgets.length > 0) {
        const nextBudgets = { ...platformBudgets };

        budgets.forEach((budget) => {
          const platformKey = apiValueToPlatform[budget.platform];
          if (!platformKey) return;

          nextBudgets[platformKey] = {
            budget: String(budget.budget ?? ""),
            budgetType: budget.budget_type === "DAILY" ? "daily" : "lifetime",
            startDate: budget.start_date ? budget.start_date.split("T")[0] : getCurrentDate(),
            endDate: budget.end_date ? budget.end_date.split("T")[0] : (budget.run_continuously ? "" : getDefaultEndDate()),
            runContinuously: Boolean(budget.run_continuously),
          };
        });

        setPlatformBudgets(nextBudgets);

        const firstBudgetPlatform = selectedPlatforms.find((platformKey: PlatformKey) =>
          budgets.some((budget) => apiValueToPlatform[budget.platform] === platformKey),
        );
        if (firstBudgetPlatform) {
          setSelectedPlatform(firstBudgetPlatform);
        } else if (selectedPlatforms.length > 0) {
          setSelectedPlatform(selectedPlatforms[0]);
        }
      } else if (selectedPlatforms.length > 0) {
        setSelectedPlatform(selectedPlatforms[0]);
      }
    } catch (err: unknown) {
      console.error("Error fetching campaign:", err);
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "Failed to fetch campaign data");
    } finally {
      setFetchLoading(false);
      setLoading(false);
    }
  };

  const updateCurrent = (patch: Partial<PlatformBudgetData>) => {
    setPlatformBudgets((prev) => ({
      ...prev,
      [selectedPlatform]: { ...prev[selectedPlatform], ...patch },
    }));
  };

  const updateCurrentField = (field: BudgetField, value: string) => {
    updateCurrent({ [field]: value } as Partial<PlatformBudgetData>);
    setValidationIssues((prev) => prev
      .map((issue) => issue.platform !== selectedPlatform
        ? issue
        : { ...issue, fields: issue.fields.filter((item) => item !== field) })
      .filter((issue) => issue.fields.length > 0));
  };

  const sanitizeBudgetInput = (value: string) => {
    const digitsOnly = value.replace(/[^\d]/g, "");
    return digitsOnly === "" ? "" : digitsOnly.replace(/^0+(?=\d)/, "");
  };

  const validateBudgets = () => {
    const issues: ValidationIssue[] = [];
    const visiblePlatforms = campaignPlatforms.length > 0 ? campaignPlatforms : (Object.keys(platformBudgets) as PlatformKey[]);

    visiblePlatforms
      .filter((key) => integrationStatus[platformToApiValue[key]])
      .forEach((key) => {
        const currentBudget = platformBudgets[key];
        const missingFields: BudgetField[] = [];

        if (!currentBudget.budget || Number(currentBudget.budget) <= 0) missingFields.push("budget");
        if (!currentBudget.startDate) missingFields.push("startDate");
        if (!currentBudget.runContinuously && !currentBudget.endDate) missingFields.push("endDate");

        if (missingFields.length > 0) issues.push({ platform: key, fields: missingFields });
      });

    setValidationIssues(issues);

    if (issues.length > 0) {
      setError("Please complete the required fields highlighted below.");
      return false;
    }

    return true;
  };

  useEffect(() => {
    const fetchIntegrationStatus = async () => {
      const org_id = getOrgId();
      if (!org_id) {
        setError("No organization selected");
        setIntegrationLoading(false);
        setFetchLoading(false);
        return;
      }

      try {
        const response = await api.get(`/main/integrations-status/?org_id=${org_id}`);
        const statusMap: Record<string, boolean> = {};
        (response.data.integrations as { platform: string; status: boolean }[]).forEach((item) => {
          statusMap[item.platform] = item.status;
        });
        setIntegrationStatus(statusMap);
      } catch (err) {
        console.error("Failed to fetch integration status:", err);
      } finally {
        setIntegrationLoading(false);
      }
    };

    void fetchIntegrationStatus();
    void fetchCampaignData();
  }, [campaignId]);

  const handleRunContinuouslyToggle = () => {
    const newValue = !current.runContinuously;
    updateCurrent({
      runContinuously: newValue,
      endDate: newValue ? "" : (current.endDate || getDefaultEndDate()),
      startDate: current.startDate || getCurrentDate(),
    });
  };

  const handleSubmit = async () => {
    if (!campaignId) {
      setError("Campaign ID not found. Please go back to Step 1.");
      return;
    }

    if (!validateBudgets()) return;

    setLoading(true);
    setError("");
    setValidationIssues([]);

    try {
      const org_id = getOrgId();
      if (!org_id) {
        setError("No organization selected");
        setLoading(false);
        return;
      }

      const visiblePlatforms = campaignPlatforms.length > 0 ? campaignPlatforms : (Object.keys(platformBudgets) as PlatformKey[]);

      const budgets = visiblePlatforms
        .filter((key) => integrationStatus[platformToApiValue[key]])
        .map((key) => {
          const d = platformBudgets[key];
          return {
            platform: platformToApiValue[key],
            budget_type: d.budgetType === "daily" ? "DAILY" : "ONETIME",
            start_date: d.startDate,
            end_date: d.runContinuously ? null : d.endDate,
            budget: Number(d.budget),
            run_continuously: d.runContinuously,
          };
        });

      await api.post(`/main/update-ad/?org_id=${org_id}`, {
        campaign_id: parseInt(campaignId),
        budgets,
      });

      navigate(`/user-dashboard/campaigns-create/step-6?campaignId=${campaignId}`);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "Failed to save budget data");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading || integrationLoading) {
    return (
      <div className="w-full bg-white rounded-2xl border border-gray-200 p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Budget & Schedule</h2>
          <p className="text-sm text-gray-500">Loading your campaign budget...</p>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-500">Loading budget data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Budget & Schedule</h2>
        <p className="text-sm text-gray-500">Set your campaign budget and schedule for each platform</p>
        {campaignId && <p className="text-xs text-gray-400 mt-1">Campaign ID: {campaignId}</p>}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
          <p className="text-sm text-red-600">{error}</p>
          {validationIssues.length > 0 && (
            <div className="mt-3 space-y-1 text-xs text-red-700">
              {validationIssues.map((issue) => (
                <p key={issue.platform}>{PLATFORM_LABELS[issue.platform]} tab: {issue.fields.map((field) => FIELD_LABELS[field]).join(", ")}</p>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex gap-6 mb-6 border-b border-gray-200">
        {(campaignPlatforms.length > 0 ? campaignPlatforms : (['google', 'facebook', 'tiktok'] as PlatformKey[])).map((key) => {
          const enabled = integrationStatus[platformToApiValue[key]];
          const isActive = selectedPlatform === key;
          return (
            <button
              key={key}
              onClick={() => enabled && setSelectedPlatform(key)}
              disabled={!enabled}
              className={`text-sm font-medium pb-3 transition-all border-b-2 -mb-px ${!enabled ? 'text-gray-300 cursor-not-allowed border-transparent' : isActive ? 'text-blue-600 border-blue-600' : 'text-gray-500 hover:text-gray-700 border-transparent'}`}
            >
              {PLATFORM_LABELS[key]}
            </button>
          );
        })}
      </div>

      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 block mb-2">Budget Type</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button type="button" onClick={() => updateCurrent({ budgetType: "daily" })} className={`rounded-xl border p-4 text-left transition ${current.budgetType === "daily" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"}`}>
            <p className="text-sm font-bold text-gray-900">Daily Budget</p>
            <p className="text-xs text-gray-500">Average amount per day</p>
          </button>
          <button type="button" onClick={() => updateCurrent({ budgetType: "lifetime" })} className={`rounded-xl border p-4 text-left transition ${current.budgetType === "lifetime" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"}`}>
            <p className="text-sm font-bold text-gray-900">Lifetime Budget</p>
            <p className="text-xs text-gray-500">Total for entire campaign</p>
          </button>
        </div>
      </div>

      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 block mb-1">{current.budgetType === "daily" ? "Daily Budget" : "Lifetime Budget"} for {PLATFORM_LABELS[selectedPlatform]}</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
          <input type="text" inputMode="numeric" value={current.budget} onChange={(e) => updateCurrentField("budget", sanitizeBudgetInput(e.target.value))} className="w-full rounded-lg border border-gray-300 pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter amount" />
        </div>
        <p className="text-xs text-gray-400 mt-1">Enter any amount you prefer</p>
        {validationIssues.find((issue) => issue.platform === selectedPlatform)?.fields.includes("budget") && <p className="mt-1 text-xs text-red-600">{FIELD_LABELS.budget} is required.</p>}
      </div>

      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 block mb-2">Campaign Schedule</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 mt-3 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <label className="text-sm text-gray-700">Start Date</label>
            <input type="date" value={current.startDate} onChange={(e) => updateCurrentField("startDate", e.target.value)} className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer" />
            {validationIssues.find((issue) => issue.platform === selectedPlatform)?.fields.includes("startDate") && <p className="mt-1 text-xs text-red-600">{FIELD_LABELS.startDate} is required.</p>}
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 mt-3 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <label className="text-sm text-gray-700">End Date</label>
            <input type="date" value={current.endDate} disabled={current.runContinuously} onChange={(e) => updateCurrentField("endDate", e.target.value)} className={`w-full rounded-lg border pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 cursor-pointer ${current.runContinuously ? "bg-gray-100 border-gray-200 cursor-not-allowed" : "border-gray-300 focus:ring-blue-500"}`} min={current.startDate || getCurrentDate()} />
            {!current.runContinuously && validationIssues.find((issue) => issue.platform === selectedPlatform)?.fields.includes("endDate") && <p className="mt-1 text-xs text-red-600">{FIELD_LABELS.endDate} is required.</p>}
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input type="checkbox" checked={current.runContinuously} onChange={handleRunContinuouslyToggle} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
          Run continuously (no end date)
        </label>
      </div>

      <div className="space-y-3 mb-4">
        {(campaignPlatforms.length > 0 ? campaignPlatforms : (Object.keys(platformBudgets) as PlatformKey[])).filter((key) => integrationStatus[platformToApiValue[key]]).map((key) => {
          const d = platformBudgets[key];
          return (
            <div key={key} className="rounded-xl border border-blue-400 bg-linear-to-r from-blue-50 to-indigo-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Budget Summary</p>
                  <p className="text-xs text-gray-500">{d.budgetType === 'daily' ? 'Daily Budget' : 'Lifetime Budget'} • {PLATFORM_LABELS[key]}</p>
                </div>
                <p className="text-lg font-semibold text-gray-900">${d.budget}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between mt-5">
        <Link to={campaignId ? `/user-dashboard/campaigns-create/step-4?campaignId=${campaignId}` : "/user-dashboard/campaigns-create/step-4"} className="btn md:w-40 text-gray-700 border rounded-xl border-gray-700 hover:bg-gray-400 hover:text-white">Previous</Link>
        <button onClick={handleSubmit} disabled={loading || !campaignId} className="btn md:w-40 text-white bg-blue-600 hover:bg-blue-700 rounded-xl border disabled:opacity-50 disabled:cursor-not-allowed">{loading ? "Saving..." : "Continue"}</button>
      </div>
    </div>
  );
};

export default Step5Budget;
