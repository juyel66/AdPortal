import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import CampaignProgressBar from "@/components/campaign/CampaignProgressBar";
import { Button } from "@/components/ui/button";
import { useCampaign } from "../../pages/create-campaign/CampaignContext";

const TOTAL_STEPS = 7;

const CreateCampaignLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getAllCampaignData, clearCampaignData, validateAllSteps, isStepValid } = useCampaign();

  const match = location.pathname.match(/step-(\d+)/);
  const currentStep = match ? Number(match[1]) : 1;

  const goPrevious = () => {
    if (currentStep > 1) {
      navigate(`/user-dashboard/campaigns-create/step-${currentStep - 1}`);
    }
  };

  const goNext = () => {
    if (currentStep < TOTAL_STEPS) {
      
      const currentStepKey = `step${currentStep}` as keyof ReturnType<typeof validateAllSteps>;
      const isValid = isStepValid(currentStepKey);
      
      if (!isValid) {
        alert(`Please complete all required fields in Step ${currentStep} before continuing.`);
        return;
      }
      
      
      const allData = getAllCampaignData();
      
   
      console.log("");
      console.log(` CONTINUE BUTTON CLICKED - STEP ${currentStep}`);
      console.log("");
      
      console.log(`📋 CURRENT STEP ${currentStep} DATA:`);
      console.log(JSON.stringify(allData[`step${currentStep}`], null, 2));
      console.log(`Step ${currentStep} Valid:`, isValid);
      
      console.log("\n📊 ACCUMULATED DATA UP TO STEP", currentStep);
      for (let i = 1; i <= currentStep; i++) {
        const stepKey = `step${i}` as keyof typeof allData;
        console.log(`Step ${i}:`, allData[stepKey]);
      }
      
      
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

    const finalData = getAllCampaignData();
    

    const allValidations = validateAllSteps();
    const allStepsValid = Object.values(allValidations).every(valid => valid);
    
    if (!allStepsValid) {
      alert('Please complete all steps before publishing!');
      return;
    }
    
    console.log("");
    console.log("PUBLISH BUTTON CLICKED - FINAL REVIEW");
    console.log("");
    
    // ✅ Transform data to your required format
    const transformedData = transformToApiFormat(finalData);
    
    console.log(" FINAL CAMPAIGN DATA FOR PUBLISHING:");
    console.log(JSON.stringify(finalData, null, 2));
    
    console.log("\n TRANSFORMED DATA FOR API:");
    console.log(JSON.stringify(transformedData, null, 2));
    
    console.log("");
    
    alert('All data collected! Ready for API call to backend.');
    

    

    alert('Campaign data ready for backend!');
    

    clearCampaignData();
    localStorage.removeItem('campaignDraftData');
    
  
    navigate('/user-dashboard/campaigns');
  };


  const transformToApiFormat = (data: any) => {
    const platformMapping: Record<string, string> = {
      "facebook": "META",
      "google": "GOOGLE",
      "tiktok": "TIKTOK",
      "instagram": "META",
      "linkedin": "LINKEDIN",
      "twitter": "TWITTER",
      "pinterest": "PINTEREST"
    };

    const objectiveMapping: Record<string, string> = {
      "conversions": "CONVERSIONS",
      "traffic": "TRAFFIC",
      "awareness": "AWARENESS",
      "engagement": "ENGAGEMENT",
      "lead_generation": "LEAD_GENERATION",
      "app_promotion": "APP_PROMOTION"
    };

    const budgetTypeMapping: Record<string, string> = {
      "daily": "DAILY",
      "lifetime": "ONETIME"
    };

    const genderMapping: Record<string, string> = {
      "all": "all",
      "male": "male",
      "female": "female"
    };

    return {
      platforms: data.step2.selectedPlatforms.map((p: string) => platformMapping[p] || p.toUpperCase()),
      campaign_name: data.step1.campaignName,
      objective: objectiveMapping[data.step3.objective] || data.step3.objective.toUpperCase(),
      budgets: data.step2.selectedPlatforms.map((platform: string) => ({
        platform: platformMapping[platform] || platform.toUpperCase(),
        budget_type: budgetTypeMapping[data.step5.budgetType] || "ONETIME",
        start_date: data.step5.schedule.startDate,
        end_date: data.step5.schedule.isScheduled ? "" : data.step5.schedule.endDate,
        budget: data.step5.budget,
        run_continuously: data.step5.schedule.isScheduled
      })),
      min_age: data.step4.audienceAge[0],
      max_age: data.step4.audienceAge[1],
      gender: genderMapping[data.step4.audienceGender[0]] || "all",
      locations: [data.step4.audienceLocation],
      keywords: data.step4.audienceInterests.join(", "),
      ad_name: data.step6.headline,
      headline: data.step6.headline,
      primary_text: data.step6.primaryText,
      description: data.step6.description,
      call_to_action: data.step6.callToAction,
      destination_url: data.step6.destinationUrl
    };
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