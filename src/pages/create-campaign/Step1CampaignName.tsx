import React from "react";

const Step1CampaignName: React.FC = () => {
  return (
    <div className="w-full  ">
      <div className="bg-white border border-gray-200 rounded-xl p-8 ">
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
          />
        </div>

        {/* Action */}
   
      </div>
    </div>
  );
};

export default Step1CampaignName;
