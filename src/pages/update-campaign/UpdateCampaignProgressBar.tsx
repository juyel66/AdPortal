import React from "react";
import type {
  CampaignProgressBarProps,
  CampaignStep,
} from "@/types/createCampaignProgress";

const STEPS: CampaignStep[] = [
  { id: 1, label: "Campaign Name" },
  { id: 2, label: "Platforms" },
  { id: 3, label: "Objective" },
  { id: 4, label: "Audience" },
  { id: 5, label: "Budget" },
  { id: 6, label: "Creative" },
  { id: 7, label: "Review" },
];

const CampaignProgressBar: React.FC<CampaignProgressBarProps> = ({
  currentStep,
}) => {
  const renderStep = (step: CampaignStep) => {
    const isCompleted = step.id < currentStep;
    const isActive = step.id === currentStep;

    return (
      <div
        key={step.id}
        className="flex flex-col items-center gap-2 rounded-lg border bg-white p-3"
      >
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

        <span
          className={`text-xs text-center
            ${isActive ? "font-medium text-blue-600" : "text-slate-600"}
          `}
        >
          {step.label}
        </span>
      </div>
    );
  };

  return (
    <div className="rounded-xl border bg-white p-4 md:p-6">
      
      <div className="space-y-3 md:hidden">

        <div className="grid grid-cols-4 gap-3">
          {STEPS.slice(0, 4).map(renderStep)}
        </div>

   
        <div className="grid grid-cols-3 gap-3">
          {STEPS.slice(4).map(renderStep)}
        </div>
      </div>

      
      <div className="hidden md:flex md:items-center md:justify-between">
        {STEPS.map((step) => {
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;

          return (
            <div
              key={step.id}
              className="flex flex-col items-center gap-2"
            >
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
