import React from "react";
import type {
  CampaignProgressBarProps,
  CampaignStep,
} from "@/types/createCampaignProgress";

const STEPS: CampaignStep[] = [
  { id: 1, label: "Platforms" },
  { id: 2, label: "Objective" },
  { id: 3, label: "Audience" },
  { id: 4, label: "Budget" },
  { id: 5, label: "Creative" },
  { id: 6, label: "Review" },
];

const CampaignProgressBar: React.FC<CampaignProgressBarProps> = ({
  currentStep,
}) => {
  return (
    <div className="rounded-xl border bg-white p-6">
      <div className="flex items-center justify-between">
        {STEPS.map((step) => {
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;

          return (
            <div key={step.id} className="flex flex-col items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium
                  ${
                    isCompleted
                      ? "bg-green-500 text-white"
                      : isActive
                      ? "bg-blue-600 text-white"
                      : "border border-slate-300 text-slate-400"
                  }
                `}
              >
                {step.id}
              </div>

              <span className="text-xs text-slate-600">
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CampaignProgressBar;
