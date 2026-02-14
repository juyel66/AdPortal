import React, { useEffect } from "react";
import { useCampaign } from "../../../src/pages/create-campaign/CampaignContext";

const Step1CampaignName: React.FC = () => {
  const { campaignData, updateCampaignData } = useCampaign();
  const [campaign_name, setCampaignName] = React.useState(campaignData.step1.campaign_name);


  useEffect(() => {
    setCampaignName(campaignData.step1.campaign_name);
  }, [campaignData.step1.campaign_name]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setCampaignName(newValue);
    
 
    updateCampaignData('step1', { campaign_name: newValue });
    
    console.log(" Step 1 - Campaign Name updated:", newValue);
  };

  return (
    <div className="w-full">
      <div className="bg-white border border-gray-200 rounded-xl p-8">
        {/* Header */}
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          Add Campaign Name
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          What's your main name of this campaign?
        </p>

        {/* Input */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Campaign Name
          </label>
          <input
            type="text"
            placeholder="Transform Your Business Today"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={campaign_name}
            onChange={handleInputChange}
          />
        </div>

        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Note:</span> Your campaign name is automatically saved. 
            You can continue to next step when ready.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Step1CampaignName;