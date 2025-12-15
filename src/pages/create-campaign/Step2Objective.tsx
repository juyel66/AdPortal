import React, { useState } from "react";
import {
  ShoppingCart,
  Eye,
  MessageCircle,
  Users,
} from "lucide-react";

import type {
  CampaignObjective,
  ObjectiveKey,
} from "@/types/createCampaignStep2";

/* ===============================
   OBJECTIVES DATA
================================ */

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

/* ===============================
   ICONS (UPDATED)
================================ */

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
      className="h-4 w-4  object-contain"
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

/* ===============================
   COMPONENT
================================ */

const Step2Objective: React.FC = () => {
  const [selected, setSelected] =
    useState<ObjectiveKey>("conversions");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Campaign Objective
        </h2>
        <p className="text-sm text-slate-500">
          What’s your main goal for this campaign?
        </p>
      </div>

      {/* Objectives Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {OBJECTIVES.map((objective) => {
          const isSelected = selected === objective.key;

          return (
            <div
              key={objective.key}
              onClick={() => setSelected(objective.key)}
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
    </div>
  );
};

export default Step2Objective;
