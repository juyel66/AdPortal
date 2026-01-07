import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import CampaignProgressBar from "@/components/campaign/CampaignProgressBar";
import { Button } from "@/components/ui/button";

const TOTAL_STEPS = 6;

const CreateCampaignLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();


  const match = location.pathname.match(/step-(\d+)/);
  const currentStep = match ? Number(match[1]) : 1;

  const goPrevious = () => {
    if (currentStep > 1) {
      navigate(
        `/user-dashboard/campaigns-create/step-${currentStep - 1}`
      );
    }
  };

  const goNext = () => {
    if (currentStep < TOTAL_STEPS) {
      navigate(
        `/user-dashboard/campaigns-create/step-${currentStep + 1}`
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
     
      <div className="border-b bg-white px-6 py-4">
        <Button
          variant="ghost"
          className="mb-2 px-0 text-slate-500 hover:text-slate-700"
          onClick={() => navigate(-1)}
        >
          ← Back
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">
              Create New Campaign
            </h1>
            <p className="text-sm text-slate-500">
              Step {currentStep} of {TOTAL_STEPS}
            </p>
          </div>

          <span className="text-sm font-medium text-slate-600">
            {Math.round((currentStep / TOTAL_STEPS) * 100)}% Complete
          </span>
        </div>
      </div>

     
      <div className="px-6 pt-6">
        <CampaignProgressBar currentStep={currentStep} />
      </div>

  
      <div className="flex-1 px-6 py-8">
        <Outlet />
      </div>

   
      <div className="border-t bg-white px-6 py-4 flex items-center justify-between">
        <Button
          className="text-slate-600"
          variant="outline"
          onClick={goPrevious}
          hidden={currentStep === 1}
        >
          Previous
        </Button>
        <p></p>

        <Button
          onClick={goNext}
          disabled={currentStep === TOTAL_STEPS}
          className="bg-blue-500 "
        >
          {currentStep === TOTAL_STEPS ? "Publish Campaign" : "Continue"}
        </Button>
      </div>
    </div>
  );
};

export default CreateCampaignLayout;
