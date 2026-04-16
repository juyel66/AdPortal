import api from "@/lib/axios";
import { toast } from "sonner";
import { useState } from "react";
import { useNavigate } from "react-router";

type CreateCampaignResponse = {
  campaign_id?: number;
  id?: number;
  campaign_name?: string;
  name?: string;
  status?: string;
  data?: {
    campaign_id?: number;
    id?: number;
    campaign_name?: string;
    name?: string;
    status?: string;
  };
};

const Step1CampaignName: React.FC = () => {
  const [campaignName, setCampaignName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();


  const getOrgId = () => {
    try {
      const selectedOrg = localStorage.getItem("selectedOrganization");
      if (selectedOrg) {
        const orgData = JSON.parse(selectedOrg);
        return orgData.id;
      }
      return null;
    } catch (error) {
      console.error("Error parsing organization data:", error);
      return null;
    }
  };

  const getErrorMessage = (error: unknown) => {
    const responseError = error as {
      response?: {
        data?: unknown;
      };
    };

    const responseData = responseError.response?.data;

    if (typeof responseData === "string") {
      return responseData;
    }

    if (responseData && typeof responseData === "object") {
      if ("campaign_name" in responseData) {
        const fieldMessage = (responseData as { campaign_name?: unknown }).campaign_name;
        if (typeof fieldMessage === "string") {
          return fieldMessage;
        }

        if (Array.isArray(fieldMessage) && fieldMessage.length > 0) {
          return String(fieldMessage[0]);
        }
      }

      if ("message" in responseData) {
        const message = (responseData as { message?: unknown }).message;
        if (typeof message === "string") {
          return message;
        }
      }
    }

    return "Something went wrong";
  };

  const extractCampaignId = (responseData: CreateCampaignResponse) => {
    return (
      responseData.campaign_id ||
      responseData.id ||
      responseData.data?.campaign_id ||
      responseData.data?.id ||
      null
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!campaignName.trim()) {
      setError("Campaign name is required");
      return;
    }

    const org_id = getOrgId();
    if (!org_id) {
      setError("No organization selected");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post<CreateCampaignResponse>(`/main/create-ad/?org_id=${org_id}`, {
        campaign_name: campaignName
      });

      console.log("Success:", response.data);

      const campaignId = extractCampaignId(response.data);
      const createdCampaignName = response.data.campaign_name || response.data.name || campaignName;
      const campaignStatus = response.data.status || response.data.data?.status || "draft";

      if (!campaignId) {
        const fallbackMessage = "Campaign created, but the server did not return a campaign id.";
        setError(fallbackMessage);
        toast.error(fallbackMessage);
        return;
      }

     
      localStorage.setItem("campaignId", String(campaignId));
      localStorage.setItem("campaignStatus", campaignStatus);
      localStorage.setItem("campaignName", createdCampaignName);

      // toast.success("Campaign created successfully.");


      navigate("/user-dashboard/campaigns-create/step-2");

    } catch (err: unknown) {
      const message = getErrorMessage(err);
      const normalizedMessage = message.toLowerCase();

      if (normalizedMessage.includes("already exists") && normalizedMessage.includes("campaign")) {
        toast.error("A campaign with this name already exists in your organization.");
        setError("A campaign with this name already exists in your organization.");
      } else {
        setError(message);
        toast.error(message);
      }

      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Add Campaign Name
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            What's your main name of this campaign?
          </p>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Name
            </label>
            <input
              type="text"
              placeholder="Transform Your Business Today"
              className={`w-full border ${
                error ? "border-red-500" : "border-gray-300"
              } rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              value={campaignName}
              onChange={(e) => {
                setCampaignName(e.target.value);
                setError("");
              }}
            />
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="btn md:w-40 mt-5 text-white bg-blue-600 hover:bg-blue-700 rounded-xl border disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Continue"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step1CampaignName;