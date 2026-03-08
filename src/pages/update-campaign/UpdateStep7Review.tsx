import React, { useState, useEffect } from "react";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { Link } from "react-router";

interface CampaignResponse {
  campaign_id: number;
  status: string;
  campaign_name: string;
  objective: string;
  keywords: string;
  ad_name: string;
  headline: string;
  primary_text: string;
  description: string;
  destination_url: string;
  ad_asset_id: number;
  platforms: string[];
  min_age: number;
  max_age: number;
  gender: string;
  locations: string[];
  budgets: {
    platform: string;
    budget_type: string;
    start_date: string;
    end_date: string;
    budget: number;
    run_continuously: boolean;
  }[];
  call_to_action: string;
}

const Step7Review: React.FC = () => {
  const loading = false;
  const [campaignData, setCampaignData] = useState<CampaignResponse | null>(null);
  const campaignId = localStorage.getItem("campaignId");
  useEffect(() => {
    const storedData = localStorage.getItem("api_response");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setCampaignData(parsedData);
      } catch (error) {
        console.error("Error parsing stored data:", error);
      }
    }
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPlatformDisplay = (platform: string) => {
    switch(platform) {
      case "GOOGLE": return "Google";
      case "META": return "Facebook";
      case "TIKTOK": return "TikTok";
      default: return platform;
    }
  };

  const getGenderDisplay = (gender: string) => {
    switch(gender) {
      case "male": return "Male";
      case "female": return "Female";
      case "all": return "All";
      default: return gender;
    }
  };

  if (!campaignData) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500">Loading campaign data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-gray-900">Review Your Campaign</h1>
        <p className="text-sm text-gray-500">
          Review all details before publishing
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-xl border p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Campaign Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <p className="text-gray-600">
              <span className="font-medium">Campaign Name:</span> {campaignData.campaign_name}
            </p>
            <p className="text-gray-600">
             
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Status:</span>{" "}
              <span className="text-yellow-600 font-medium">{campaignData.status}</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Platforms
          </h3>
          <div className="flex gap-2 flex-wrap">
            {campaignData.platforms.map((platform, index) => (
              <span key={index} className="px-3 py-1 text-xs rounded-full border border-blue-500 text-blue-600">
                {getPlatformDisplay(platform)}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            Objective
          </h3>
          <p className="text-sm text-gray-600">{campaignData.objective}</p>
        </div>

        <div className="bg-white rounded-xl border p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Target Audience
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600">
            <p>Age: {campaignData.min_age}–{campaignData.max_age}</p>
            <p>Gender: {getGenderDisplay(campaignData.gender)}</p>
            <p>Locations: {campaignData.locations.join(", ")}</p>
          </div>
          {campaignData.keywords && (
            <p className="text-sm text-gray-600 mt-2">
              <span className="font-medium">Keywords:</span> {campaignData.keywords}
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl border p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Budget & Schedule
          </h3>
          {campaignData.budgets.map((budget, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600">
              <p>
                {budget.budget_type === "DAILY" ? "Daily" : "Lifetime"} Budget:{" "}
                <span className="font-medium">{formatCurrency(budget.budget)}</span>
              </p>
              <p>Start Date: {formatDate(budget.start_date)}</p>
              {budget.run_continuously ? (
                <p className="text-green-600">✓ Running continuously</p>
              ) : (
                <p>End Date: {formatDate(budget.end_date)}</p>
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Ad Creative
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p><span className="font-medium">Ad Name:</span> {campaignData.ad_name}</p>
            <p><span className="font-medium">Headline:</span> {campaignData.headline}</p>
            <p><span className="font-medium">Primary Text:</span> {campaignData.primary_text}</p>
            {campaignData.description && (
              <p><span className="font-medium">Description:</span> {campaignData.description}</p>
            )}
            <p><span className="font-medium">CTA:</span> {campaignData.call_to_action}</p>
            <p><span className="font-medium">Destination URL:</span>{" "}
              <a href={campaignData.destination_url} target="_blank" rel="noopener noreferrer" 
                 className="text-blue-600 hover:underline">
                {campaignData.destination_url}
              </a>
            </p>
            {campaignData.ad_asset_id && (
              <p><span className="font-medium">Asset ID:</span> #{campaignData.ad_asset_id}</p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <h3 className="text-sm font-semibold text-green-800 mb-3">
            Pre-launch Checks
          </h3>
          <ul className="space-y-2 text-sm text-green-700">
            <li className="flex items-center gap-2">
              <CheckCircle size={16} /> All required fields completed
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle size={16} /> Ad accounts connected and verified
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle size={16} /> Budget allocation confirmed
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle size={16} /> Creative assets meet platform requirements
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
          <div className="flex gap-3">
            <AlertTriangle className="text-yellow-600 mt-0.5" size={18} />
            <p className="text-sm text-yellow-800">
              <span className="font-medium">Before Publishing:</span> Once
              published, your campaign will go through platform review (usually
              24 hours) before going live. You can still edit or pause your
              campaign after publishing.
            </p>
          </div>
        </div>

        <div className="flex justify-between mt-5">
          <Link
            to={`/user-dashboard/campaigns-update/${campaignId}/update-step-6`}
            className="btn md:w-40 text-gray-700 border rounded-xl border-gray-700 hover:bg-gray-400 hover:text-white py-2 text-center"
          >
            Previous
          </Link>

          <Link 
            to="/user-dashboard/campaigns"
           
           
            className="btn md:w-40 text-white bg-blue-600 hover:bg-blue-700 rounded-xl border py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Publishing..." : "Publish Campaign"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Step7Review;