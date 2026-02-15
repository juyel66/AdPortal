import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { useCampaign } from "../../pages/create-campaign/CampaignContext";
import { useNavigate, Link } from "react-router";
import type { PlatformItem, PlatformKey } from "@/types/createCampaignStep1";
import api from "@/lib/axios";

const PLATFORMS: PlatformItem[] = [
  {
    key: "facebook",
    name: "Meta (Facebook)",
    description: "Reach billions of users across Facebook",
    connected: true,
    logo: "https://res.cloudinary.com/dqkczdjjs/image/upload/v1765754457/Container_10_m3mnnq.png",
  },
  {
    key: "google",
    name: "Google Ads",
    description: "Show ads on Google Search, YouTube, and Display Network",
    connected: true,
    logo: "https://res.cloudinary.com/dqkczdjjs/image/upload/v1765754457/Container_11_bdja1x.png",
  },
  {
    key: "tiktok",
    name: "TikTok Ads",
    description: "Engage with Gen Z and millennials on TikTok",
    connected: true,
    logo: "https://res.cloudinary.com/dqkczdjjs/image/upload/v1765754457/Container_12_siwhfp.png",
  },
];

const platformToApiValue: Record<PlatformKey, string> = {
  facebook: "META",
  google: "GOOGLE",
  tiktok: "TIKTOK"
};

const Step2Platforms: React.FC = () => {
  const { campaignData, updateCampaignData } = useCampaign();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [debugInfo, setDebugInfo] = useState("");
  
  const campaignId = localStorage.getItem("campaignId");

  const [selected, setSelected] = useState<PlatformKey[]>(() => {
    const savedSelection = campaignData.step2?.selectedPlatforms;
    return savedSelection && savedSelection.length > 0 
      ? savedSelection 
      : ["google", "tiktok"];
  });

  const togglePlatform = (key: PlatformKey) => {
    setSelected((prev) => {
      const newSelected = prev.includes(key) 
        ? prev.filter((p) => p !== key) 
        : [...prev, key];
      
      updateCampaignData('step2', {
        platforms: PLATFORMS,
        selectedPlatforms: newSelected
      });
      
      return newSelected;
    });
  };

  const handleSubmit = async () => {
    if (!campaignId) {
      setError("Campaign ID not found. Please go back to Step 1.");
      return;
    }

    if (selected.length === 0) {
      setError("Please select at least one platform");
      return;
    }

    setLoading(true);
    setError("");
    setDebugInfo("");

    try {
      const apiPlatforms = selected.map(key => platformToApiValue[key]);

      const selectedOrg = localStorage.getItem("selectedOrganization");
      let org_id = "";
      if (selectedOrg) {
        const orgData = JSON.parse(selectedOrg);
        org_id = orgData.id;
      }

      // ★★★ Log the request data ★★★
      const requestData = {
        campaign_id: parseInt(campaignId),
        platforms: apiPlatforms
      };
      
      console.log("📤 Sending request:", {
        url: `/main/create-ad/?org_id=${org_id}`,
        data: requestData
      });

      // ★★★ Try different formats ★★★
      const response = await api.post(`/main/create-ad/?org_id=${org_id}`, requestData);

      console.log("✅ Platforms saved:", response.data);
      navigate("/user-dashboard/campaigns-create/step-3");

    } catch (err: any) {
      // ★★★ Show full error details ★★★
      console.error("❌ Full error:", err);
      
      if (err.response) {
        // The request was made and the server responded with a status code
        console.error("Error response data:", err.response.data);
        console.error("Error response status:", err.response.status);
        console.error("Error response headers:", err.response.headers);
        
        setError(err.response.data?.message || "Failed to save platforms");
        setDebugInfo(JSON.stringify(err.response.data, null, 2));
      } else if (err.request) {
        // The request was made but no response was received
        console.error("No response received:", err.request);
        setError("No response from server");
      } else {
        // Something happened in setting up the request
        console.error("Error setting up request:", err.message);
        setError("Request setup failed");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!campaignId) {
      console.warn("⚠️ No campaign ID found in localStorage");
    }
  }, [campaignId]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Select Platforms
        </h2>
        <p className="text-sm text-slate-500">
          Choose where you want to run your campaign. You can select multiple
          platforms.
        </p>
        
        {campaignId && (
          <p className="text-xs text-gray-400 mt-1">
            Campaign ID: {campaignId} (from localStorage)
          </p>
        )}
      </div>

      {/* Error message with debug info */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-600 font-medium">{error}</p>
          {debugInfo && (
            <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto">
              {debugInfo}
            </pre>
          )}
        </div>
      )}

      {/* Platform Cards */}
      <div className="space-y-4">
        {PLATFORMS.map((platform) => {
          const isSelected = selected.includes(platform.key);

          return (
            <div
              key={platform.key}
              onClick={() => !loading && togglePlatform(platform.key)}
              className={`cursor-pointer rounded-xl border p-4 flex items-center justify-between transition
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                    : "border-slate-200 hover:border-slate-300"
                }
              `}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-white">
                  <img
                    src={platform.logo}
                    alt={platform.name}
                    className="object-contain"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-900">
                      {platform.name}
                    </p>
                    <span className="text-xs text-gray-400">
                      → {platformToApiValue[platform.key]}
                    </span>

                    {platform.connected && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        Connected
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-slate-500">
                    {platform.description}
                  </p>
                </div>
              </div>

              <div
                className={`flex h-5 w-5 items-center justify-center rounded-full border
                  ${
                    isSelected
                      ? "border-blue-600 bg-blue-600"
                      : "border-slate-300 bg-white"
                  }
                `}
              >
                {isSelected && <Check size={14} className="text-white" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Platforms Preview */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <p className="mb-2 text-sm font-medium text-slate-700">
          Selected Platforms (API format):
        </p>

        <div className="flex flex-wrap gap-2">
          {selected.map((key) => (
            <span
              key={key}
              className="rounded-full border border-blue-500 bg-white px-3 py-1 text-xs font-medium text-blue-600"
            >
              {platformToApiValue[key]}
            </span>
          ))}
          
          {selected.length === 0 && (
            <p className="text-sm text-slate-500 italic">
              No platforms selected yet
            </p>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-5">
        <Link
          to="/user-dashboard/campaigns-create/step-1"
          className="btn md:w-40 text-gray-700 border rounded-xl border-gray-700 hover:bg-gray-400 hover:text-white"
        >
          Previous
        </Link>

        <button
          onClick={handleSubmit}
          disabled={loading || selected.length === 0 || !campaignId}
          className="btn md:w-40 text-white bg-blue-600 hover:bg-blue-700 rounded-xl border disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Continue"}
        </button>
      </div>
    </div>
  );
};

export default Step2Platforms;