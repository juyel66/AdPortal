import React, { useState, useEffect } from "react";
import { ShoppingCart, Eye, MessageCircle, Users } from "lucide-react";
import { useCampaign } from "../../../src/pages/create-campaign/CampaignContext";
import type {
  CampaignObjective,
  ObjectiveKey,
} from "@/types/createCampaignStep2";

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

const ICONS: Record<ObjectiveKey, React.ReactNode> = {
  conversions: <ShoppingCart size={18} />,
  awareness: <Eye size={18} />,
  engagement: <MessageCircle size={18} />,
  lead_generation: <Users size={18} />,

  // 🔹 Image-based icons
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
  
  // Initialize with data from context
  const [selected, setSelected] = useState<ObjectiveKey>(() => {
    const savedObjective = campaignData.step3.objective;
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
      </div>

      {/* Objectives Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {OBJECTIVES.map((objective) => {
          const isSelected = selected === objective.key;

          return (
            <div
              key={objective.key}
              onClick={() => handleSelectObjective(objective.key)}
              className={`cursor-pointer rounded-xl border p-4 transition
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
        </div>
        
        <p className="mt-2 text-sm text-slate-600">
          {OBJECTIVES.find(obj => obj.key === selected)?.description}
        </p>
        
        {/* Auto-save notification */}
        <div className="mt-3 pt-3 border-t border-blue-100">
          <p className="text-xs text-blue-600">
            Your objective is automatically saved
          </p>
        </div>
      </div>
    </div>
  );
};

export default Step3Objective;