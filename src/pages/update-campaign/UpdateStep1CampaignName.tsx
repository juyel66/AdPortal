import api from "@/lib/axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";

const UpdateStep1CampaignName: React.FC = () => {
  const [campaignName, setCampaignName] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams(); 

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

  
  const fetchCampaignData = async () => {
    if (!id) {
      setError("Campaign ID not found");
      setFetchLoading(false);
      return;
    }

    const org_id = getOrgId();
    if (!org_id) {
      setError("No organization selected");
      setFetchLoading(false);
      return;
    }

    try {
      const response = await api.get(`/main/campaign/${id}/?org_id=${org_id}`);
      console.log("Campaign data:", response.data);
      
    
      setCampaignName(response.data.name || "");
      
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch campaign data");
      console.error("Error fetching campaign:", err);
    } finally {
      setFetchLoading(false);
    }
  };


  useEffect(() => {
    fetchCampaignData();
  }, [id]);

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

      const response = await api.patch(`/main/campaign/${id}/?org_id=${org_id}`, {
        name: campaignName  
      });

      console.log("Update success:", response.data);

      localStorage.setItem("campaignId", response.data.id.toString());
      localStorage.setItem("campaignStatus", response.data.status);
      localStorage.setItem("campaignName", response.data.name);

      navigate(`/user-dashboard/campaigns-update/${id}/update-step-2`);

    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="w-full flex justify-center items-center py-12">
        <div className="text-gray-500">Loading campaign data...</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Update Campaign Name
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            What's the new name of this campaign?
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
            {loading ? "Updating..." : "Update & Continue"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateStep1CampaignName;