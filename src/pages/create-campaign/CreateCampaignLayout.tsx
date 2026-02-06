import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import CampaignProgressBar from "@/components/campaign/CampaignProgressBar";
import { Button } from "@/components/ui/button";
import { useCampaign } from "../../pages/create-campaign/CampaignContext";

const TOTAL_STEPS = 7;

const CreateCampaignLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getAllCampaignData, clearCampaignData } = useCampaign();

  const match = location.pathname.match(/step-(\d+)/);
  const currentStep = match ? Number(match[1]) : 1;

  const goPrevious = () => {
    if (currentStep > 1) {
      navigate(`/user-dashboard/campaigns-create/step-${currentStep - 1}`);
    }
  };

  const goNext = () => {
    if (currentStep < TOTAL_STEPS) {
      
      const allData = getAllCampaignData();
      console.log(" Moving to step", currentStep + 1);
      console.log(" All campaign data:", allData);
      
      
      try {
        localStorage.setItem('campaignDraftData', JSON.stringify(allData));
        console.log(" Data saved to localStorage");
      } catch (error) {
        console.error(" Error saving to localStorage:", error);
      }
      
      navigate(`/user-dashboard/campaigns-create/step-${currentStep + 1}`);
    }
  };

  const handlePublish = () => {
    // Final publish action
    const finalData = getAllCampaignData();
    console.log(" Final campaign data for publishing:", finalData);
    
 
    
 
    alert('Campaign published successfully!');
    
    
    clearCampaignData();
    localStorage.removeItem('campaignDraftData');
    
   
    navigate('/user-dashboard/campaigns');
  };

  return (
    <div className="bg-slate-50 flex flex-col min-h-screen">
      {/* Header */}
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

      {/* Progress Bar */}
      <div className="px-6 pt-6">
        <CampaignProgressBar currentStep={currentStep} />
      </div>

      {/* Step Content */}
      <div className="flex-1 px-6 py-8">
        <Outlet />
      </div>

      {/* Navigation Footer */}
      <div className="border-t bg-white px-6 py-4 flex items-center justify-between">
        <Button
          className="text-slate-600"
          variant="outline"
          onClick={goPrevious}
          hidden={currentStep === 1}
        >
          Previous
        </Button>
        
        <div className="text-sm text-slate-500">
          Step {currentStep} data is auto-saved
        </div>

        {currentStep === TOTAL_STEPS ? (
          <Button
            onClick={handlePublish}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Publish Campaign
          </Button>
        ) : (
          <Button
            onClick={goNext}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Continue
          </Button>
        )}
      </div>
    </div>
  );
};

export default CreateCampaignLayout;