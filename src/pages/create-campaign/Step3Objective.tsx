import React, { useState, useEffect } from "react";
import { ShoppingCart, Eye, MessageCircle, Users } from "lucide-react";
import { useCampaign } from "../../../src/pages/create-campaign/CampaignContext";
import type { CampaignObjective, ObjectiveKey } from "@/types/createCampaignStep2";
import { Link, useNavigate } from "react-router";
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

const ICONS: Record<ObjectiveKey, React.ReactNode> = {
  conversions: <ShoppingCart size={18} />,
  awareness: <Eye size={18} />,
  engagement: <MessageCircle size={18} />,
  lead_generation: <Users size={18} />,
  traffic: (
    <img
      src="https://res.cloudinary.com/dqkczdjjs/image/upload/v1765755317/Icon_12_qrf7xm.png"
      alt="Traffic"
      className="h-4 w-4 object-contain"
    />
  ),
  app_promotion: (
    <img
      src="https://res.cloudinary.com/dqkczdjjs/image/upload/v1765755317/Icon_11_qjtbfj.png"
      alt="App Promotion"
      className="h-4 w-4 object-contain"
    />
  ),
};

const Step3Objective: React.FC = () => {
  const { campaignData, updateCampaignData } = useCampaign();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Get campaign_id from localStorage
  const campaignId = localStorage.getItem("campaignId");

  // Initialize with data from context
  const [selected, setSelected] = useState<ObjectiveKey>(() => {
    const savedObjective = campaignData.step3?.objective;
    const validObjective = OBJECTIVES.find(obj => obj.key === savedObjective);
    return validObjective ? savedObjective as ObjectiveKey : "conversions";
  });

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

      // Navigate to next step
      navigate(`/user-dashboard/campaigns-create/${campaignId}/update-step-4`);

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to save objective";
      setError(errorMessage);
      console.error("❌ Error saving objective:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  // Check if campaignId exists
  useEffect(() => {
    if (!campaignId) {
      console.warn("⚠️ No campaign ID found in localStorage");
    }
  }, [campaignId]);

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
          to={`/user-dashboard/campaigns-create/${campaignId}/update-step-2`}
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