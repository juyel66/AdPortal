import React, { useState, useEffect, useCallback } from "react";
import { ShoppingCart, Eye, MessageCircle, Users, MousePointer, CircleStar } from "lucide-react";
import { useCampaign } from "../../../src/pages/create-campaign/CampaignContext";
import type { CampaignObjective, ObjectiveKey } from "@/types/createCampaignStep2";
import { Link, useNavigate, useSearchParams } from "react-router";
import api from "@/lib/axios";

const OBJECTIVES: CampaignObjective[] = [
  {
    key: "conversions",
    title: "Conversions",
    description: "Drive sales, sign-ups, or other valuable actions",
    recommended: true,
  },
  {
    key: "traffic",
    title: "Traffic",
    description: "Send people to your website or app",
  },
  {
    key: "awareness",
    title: "Awareness",
    description: "Reach people most likely to remember your ads",
  },
  {
    key: "engagement",
    title: "Engagement",
    description: "Get more likes, comments, and shares",
  },
  {
    key: "lead_generation",
    title: "Lead Generation",
    description: "Collect leads for your business",
  },
  {
    key: "app_promotion",
    title: "App Promotion",
    description: "Get more app installs or engagement",
  },
];

// Objective to API value mapping
const objectiveToApiValue: Record<ObjectiveKey, string> = {
  conversions: "CONVERSIONS",
  traffic: "TRAFFIC",
  awareness: "AWARENESS",
  engagement: "ENGAGEMENT",
  lead_generation: "LEAD_GENERATION",
  app_promotion: "APP_PROMOTION"
};

const apiValueToObjective: Record<string, ObjectiveKey> = {
  CONVERSIONS: "conversions",
  TRAFFIC: "traffic",
  AWARENESS: "awareness",
  ENGAGEMENT: "engagement",
  LEAD_GENERATION: "lead_generation",
  APP_PROMOTION: "app_promotion",
};

const ICONS: Record<ObjectiveKey, React.ReactNode> = {
  conversions: <ShoppingCart size={18} />,
  awareness: <Eye size={18} />,
  engagement: <MessageCircle size={18} />,
  lead_generation: <Users size={18} />,
traffic: <MousePointer size={18} />,
  app_promotion: <CircleStar size={18} />
};

const Step3Objective: React.FC = () => {
  const { campaignData, updateCampaignData } = useCampaign();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");
  
  const campaignId = searchParams.get("campaignId");

  // Initialize with data from context
  const [selected, setSelected] = useState<ObjectiveKey>(() => {
    const savedObjective = campaignData.step3?.objective;
    const validObjective = OBJECTIVES.find(obj => obj.key === savedObjective);
    return validObjective ? savedObjective as ObjectiveKey : "conversions";
  });

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

  const fetchCampaignData = useCallback(async () => {
    if (!campaignId) {
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
      const response = await api.get(`/main/campaign/${campaignId}/?org_id=${org_id}`);
      const apiObjective = response.data.objective || "";
      const selectedObjective = apiObjective && apiValueToObjective[apiObjective]
        ? apiValueToObjective[apiObjective]
        : "conversions";

      setSelected(selectedObjective);
    } catch (err: unknown) {
      console.error("Error fetching campaign:", err);
      const errorResponse = err as { response?: { data?: { message?: string } } };
      setError(errorResponse.response?.data?.message || "Failed to fetch campaign data");
    } finally {
      setFetchLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    void fetchCampaignData();
  }, [fetchCampaignData]);

  // Update context when selection changes
  const handleSelectObjective = (key: ObjectiveKey) => {
    setSelected(key);
    
    // Update context immediately
    updateCampaignData('step3', {
      objective: key
    });
    
    console.log("✅ Step 3 - Objective selected:", key);
  };

  // Submit objective to API
  const handleSubmit = async () => {
    if (!campaignId) {
      setError("Campaign ID not found. Please go back to Step 1.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Convert selected objective to API format
      const apiObjective = objectiveToApiValue[selected];

      // Get org_id from localStorage
      const selectedOrg = localStorage.getItem("selectedOrganization");
      let org_id = "";
      if (selectedOrg) {
        const orgData = JSON.parse(selectedOrg);
        org_id = orgData.id;
      }

      // Prepare request data - only campaign_id and objective
      const requestData = {
        campaign_id: parseInt(campaignId),
        objective: apiObjective
      };

      console.log("📤 Sending objective data:", requestData);

      // Make API call
      const response = await api.post(`/main/create-ad/?org_id=${org_id}`, requestData);

      console.log("✅ Objective saved successfully:", response.data);

      // Update context with response if needed
      updateCampaignData('step3', {
        ...campaignData.step3,
        savedResponse: response.data,
        objective: selected
      });

      navigate(`/user-dashboard/campaigns-create/step-4?campaignId=${campaignId}`);

    } catch (err: unknown) {
      const errorResponse = err as { response?: { data?: { message?: string } } };
      const errorMessage = errorResponse.response?.data?.message || "Failed to save objective";
      setError(errorMessage);
      console.error("❌ Error saving objective:", errorResponse.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Campaign Objective
          </h2>
          <p className="text-sm text-slate-500">
            Loading your campaign objective...
          </p>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-500">Loading objective data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Campaign Objective
        </h2>
        <p className="text-sm text-slate-500">
          What's your main goal for this campaign?
        </p>
        
        {/* Show campaign ID for reference */}
        {campaignId && (
          <p className="text-xs text-gray-400 mt-1">
            Campaign ID: {campaignId}
          </p>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Objectives Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {OBJECTIVES.map((objective) => {
          const isSelected = selected === objective.key;

          return (
            <div
              key={objective.key}
              onClick={() => !loading && handleSelectObjective(objective.key)}
              className={`cursor-pointer rounded-xl border p-4 transition
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                    : "border-slate-200 hover:border-slate-300"
                }
              `}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-md
                    ${
                      isSelected
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-600"
                    }
                  `}
                >
                  {ICONS[objective.key]}
                </div>

                {/* Text */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-900">
                      {objective.title}
                    </p>
                    <span className="text-xs text-gray-400">
                      → {objectiveToApiValue[objective.key]}
                    </span>

                    {objective.recommended && (
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                        Recommended
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    {objective.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Objective Info */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <p className="mb-2 text-sm font-medium text-slate-700">
          Selected Objective:
        </p>
        
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600 text-white">
            {ICONS[selected]}
          </div>
          <span className="font-medium text-blue-800">
            {OBJECTIVES.find(obj => obj.key === selected)?.title}
          </span>
          <span className="text-xs bg-blue-200 px-2 py-0.5 rounded text-blue-800">
            API: {objectiveToApiValue[selected]}
          </span>
        </div>
        
        <p className="mt-2 text-sm text-slate-600">
          {OBJECTIVES.find(obj => obj.key === selected)?.description}
        </p>
        
        <div className="mt-3 pt-3 border-t border-blue-100">
          <p className="text-xs text-blue-600">
            Click Continue to save objective
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-5">
        <Link
          to={campaignId ? `/user-dashboard/campaigns-create/step-2?campaignId=${campaignId}` : "/user-dashboard/campaigns-create/step-2"}
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

export default Step3Objective;