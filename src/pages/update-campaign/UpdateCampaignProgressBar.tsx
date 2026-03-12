import React from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const handleStepClick = (stepId: number) => {
    navigate(`/user-dashboard/campaigns-update/${id}/update-step-${stepId}`);
  };

  const renderStep = (step: CampaignStep) => {
    const isActive = step.id === currentStep;

    return (
      <div
        key={step.id}
        onClick={() => handleStepClick(step.id)}
        className="flex flex-col items-center gap-2 rounded-lg border bg-white p-3 cursor-pointer hover:bg-slate-50 transition-colors"
      >
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium
            ${
              isActive
                ? "bg-blue-600 text-white"
                : "bg-green-500 text-white"
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
          const isActive = step.id === currentStep;

          return (
            <div
              key={step.id}
              onClick={() => handleStepClick(step.id)}
              className="flex flex-col items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium
                  ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "bg-green-500 text-white"
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
