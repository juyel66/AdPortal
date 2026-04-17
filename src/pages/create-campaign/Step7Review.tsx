import React, { useState, useEffect } from "react";
import { CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import api from "@/lib/axios";

interface ApiResponse {
  id?: number;
  name?: string;
  ad_name?: string;
  ad_format?: string;
  headline?: string;
  primary_text?: string;
  description?: string;
  call_to_action?: string;
  destination_url?: string;
  keywords?: string;
  file_name?: string;
  file_type?: string;
  file_size?: number;
  file_url?: string;
  campaign_id?: number;
  campaign_name?: string;
  platform?: string[];
  platforms?: string[];
  objective?: string;
  age_min?: number;
  age_max?: number;
  gender?: string;
  locations?: string[];
  interests?: string[];
  audience_targeting?: {
    min_age?: number;
    max_age?: number;
    gender?: string;
    locations?: string[];
    keywords?: string;
  };
  ads?: Array<{
    ad_name?: string;
    headline?: string;
    primary_text?: string;
    description?: string;
    call_to_action?: string;
    destination_url?: string;
  }>;
  daily_budget?: number;
  start_date?: string;
  end_date?: string;
  is_unlimited?: boolean;
  budgets?: Array<{
    budget?: number;
    end_date?: string;
    platform?: string;
    start_date?: string;
    budget_type?: string;
    run_continuously?: boolean;
  }>;
  total_budget?: number;
  total_spent?: number;
  remaining_budget?: number;
  matrics?: {
    impressions?: number;
    clicks?: number;
    ctr?: number;
    conversions?: number;
  };
  status?: string;
  created_at?: string;
  updated_at?: string;
}

const Step7Review: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getOrgId = () => {
    try {
      const selectedOrg = localStorage.getItem("selectedOrganization");
      if (selectedOrg) {
        const orgData = JSON.parse(selectedOrg);
        return orgData.id;
      }
      return null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const fetchCampaign = async () => {
      const campaignId = searchParams.get("campaignId") || localStorage.getItem("campaignId");

      if (!campaignId) {
        try {
          const savedResponse = localStorage.getItem("api_response");
          if (savedResponse) {
            setApiResponse(JSON.parse(savedResponse));
          }
        } catch (error) {
          console.error("Error loading API response:", error);
        } finally {
          setLoading(false);
        }
        return;
      }

      const orgId = getOrgId();
      if (!orgId) {
        setError("No organization selected");
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/main/campaign/${campaignId}/?org_id=${orgId}`);
        setApiResponse(response.data);
        console.log("📦 Loaded campaign data:", response.data);
      } catch (error) {
        console.error("Error loading campaign data:", error);
        setError("Failed to load campaign data");
      } finally {
        setLoading(false);
      }
    };

    void fetchCampaign();
  }, [searchParams]);

  // Helper function to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helper function to format currency
  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return "Not set";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getMediaType = (fileUrl?: string, fileType?: string) => {
    const normalizedUrl = fileUrl?.toLowerCase() || "";
    const normalizedType = fileType?.toLowerCase() || "";

    const isVideo =
      normalizedType.startsWith("video/") ||
      /\.(mp4|webm|mov|m4v|avi|mkv)(\?|#|$)/.test(normalizedUrl);

    const isImage =
      normalizedType.startsWith("image/") ||
      /\.(png|jpe?g|gif|webp|bmp|svg)(\?|#|$)/.test(normalizedUrl);

    if (isVideo) return "video";
    if (isImage) return "image";
    return "unknown";
  };

  const normalizedPlatforms = apiResponse?.platforms || apiResponse?.platform || [];
  const audienceData = apiResponse?.audience_targeting;
  const ageMin = apiResponse?.age_min ?? audienceData?.min_age;
  const ageMax = apiResponse?.age_max ?? audienceData?.max_age;
  const audienceGender = apiResponse?.gender ?? audienceData?.gender;
  const audienceLocations = apiResponse?.locations || audienceData?.locations || [];
  const audienceKeywords = apiResponse?.keywords || audienceData?.keywords;
  const primaryAd = apiResponse?.ads?.[0];
  const adName = apiResponse?.ad_name || primaryAd?.ad_name;
  const adHeadline = apiResponse?.headline || primaryAd?.headline;
  const adPrimaryText = apiResponse?.primary_text || primaryAd?.primary_text;
  const adDescription = apiResponse?.description || primaryAd?.description;
  const adCta = apiResponse?.call_to_action || primaryAd?.call_to_action;
  const adDestination = apiResponse?.destination_url || primaryAd?.destination_url;

  // Handle publish button click
  const handlePublish = () => {
    const publishCampaign = async () => {
      const campaignId = apiResponse?.campaign_id || apiResponse?.id || Number(searchParams.get("campaignId") || localStorage.getItem("campaignId"));

      if (!campaignId) {
        toast.error("Campaign ID not found. Please go back and try again.");
        return;
      }

      const orgId = getOrgId();
      if (!orgId) {
        toast.error("No organization selected.");
        return;
      }

      setPublishing(true);

      try {
        await api.post(`/main/update-ad/?org_id=${orgId}`, {
          campaign_id: Number(campaignId),
          draft: false,
        });

        localStorage.removeItem("campaign_builder_data");
        localStorage.removeItem("campaignId");
        localStorage.removeItem("campaignName");
        localStorage.removeItem("campaignStatus");
        localStorage.removeItem("api_response");

        toast.success("Campaign published successfully.");
        navigate("/user-dashboard/campaigns");
      } catch (error) {
        console.error("Error publishing campaign:", error);
        toast.error("Failed to publish campaign. Please try again.");
      } finally {
        setPublishing(false);
      }
    };

    void publishCampaign();
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-base sm:text-lg font-semibold text-gray-900">Review Your Campaign</h1>
        <p className="text-sm text-gray-500">
          Review all details before publishing your campaign
        </p>
        {apiResponse?.created_at && (
          <p className="text-xs text-gray-400 mt-1">
            Created: {formatDate(apiResponse.created_at)}
          </p>
        )}
        {apiResponse?.id && (
          <p className="text-xs text-gray-400 mt-1">
            Campaign ID: {apiResponse.id}
          </p>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Card Wrapper */}
      <div className="space-y-4">
        {/* Campaign Name */}
        {(apiResponse?.campaign_name || apiResponse?.name) && (
          <div className="bg-white rounded-xl border p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Campaign Name
            </h3>
            <p className="text-sm text-gray-600">{apiResponse.campaign_name || apiResponse.name}</p>
          </div>
        )}

        {/* Platforms */}

     {normalizedPlatforms.length > 0 && (
  <div className="bg-white rounded-xl border p-4">
    <h3 className="text-sm font-semibold text-gray-900 mb-2">
      Platforms
    </h3>

    <div className="flex gap-2 flex-wrap">
      {normalizedPlatforms.map((platform: string) => (
        <span
          key={platform}
          className="px-3 py-1 text-xs rounded-full border border-blue-500 text-blue-600 bg-blue-50"
        >
          {platform}
        </span>
      ))}
    </div>
  </div>
)}

        {/* Objective */}
        {apiResponse?.objective && (
          <div className="bg-white rounded-xl border p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Objective
            </h3>
            <p className="text-sm text-gray-600">{apiResponse.objective}</p>
          </div>
        )}

        {/* Target Audience */}
        {(ageMin || audienceGender || audienceLocations.length > 0) && (
          <div className="bg-white rounded-xl border p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Target Audience
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600">
              {ageMin && ageMax && (
                <p>Age: {ageMin}–{ageMax}</p>
              )}
              {audienceGender && (
                <p>Gender: {audienceGender}</p>
              )}
              {audienceLocations.length > 0 && (
                <p>Locations: {audienceLocations.join(', ')}</p>
              )}
            </div>
            {audienceKeywords && (
              <p className="text-xs text-gray-600 mt-2">
                Interests/Keywords: {audienceKeywords}
              </p>
            )}
          </div>
        )}

        {/* Budget & Schedule */}
        {(apiResponse?.budgets && apiResponse.budgets.length > 0) || apiResponse?.daily_budget || apiResponse?.start_date ? (
          <div className="bg-white rounded-xl border p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Budget & Schedule
            </h3>
            {apiResponse?.budgets && apiResponse.budgets.length > 0 ? (
              <div className="space-y-2 text-sm text-gray-600">
                {apiResponse.budgets.map((budget, idx) => (
                  <div key={`${budget.platform}-${idx}`} className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <p>Platform: {budget.platform}</p>
                    <p>Type: {budget.budget_type}</p>
                    <p>Budget: {formatCurrency(budget.budget)}</p>
                    <p>
                      {budget.run_continuously
                        ? "Runs continuously"
                        : `${formatDate(budget.start_date)} - ${formatDate(budget.end_date)}`}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600">
                {apiResponse?.daily_budget && (
                  <p>Daily Budget: {formatCurrency(apiResponse.daily_budget)}</p>
                )}
                {apiResponse?.start_date && (
                  <p>Start Date: {formatDate(apiResponse.start_date)}</p>
                )}
                {apiResponse?.is_unlimited ? (
                  <p className="text-green-600">✓ Running continuously</p>
                ) : apiResponse?.end_date ? (
                  <p>End Date: {formatDate(apiResponse.end_date)}</p>
                ) : null}
              </div>
            )}
          </div>
        ) : null}

        {(apiResponse?.status || apiResponse?.total_budget !== undefined || apiResponse?.matrics) && (
          <div className="bg-white rounded-xl border p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Campaign Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm text-gray-600">
              {apiResponse?.status && <p>Status: {apiResponse.status}</p>}
              {apiResponse?.total_budget !== undefined && <p>Total Budget: {formatCurrency(apiResponse.total_budget)}</p>}
              {apiResponse?.total_spent !== undefined && <p>Total Spent: {formatCurrency(apiResponse.total_spent)}</p>}
              {apiResponse?.remaining_budget !== undefined && <p>Remaining: {formatCurrency(apiResponse.remaining_budget)}</p>}
            </div>
            {apiResponse?.matrics && (
              <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-500">
                <p>Impressions: {apiResponse.matrics.impressions || 0}</p>
                <p>Clicks: {apiResponse.matrics.clicks || 0}</p>
                <p>CTR: {apiResponse.matrics.ctr || 0}</p>
                <p>Conversions: {apiResponse.matrics.conversions || 0}</p>
              </div>
            )}
          </div>
        )}

        {/* Ad Creative */}
        {apiResponse && (
          <div className="bg-white rounded-xl border p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Ad Creative
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              {adName && (
                <p><span className="font-medium">Ad Name:</span> {adName}</p>
              )}
              {apiResponse.ad_format && (
                <p><span className="font-medium">Format:</span> {apiResponse.ad_format === "image" ? "Image Ad" : "Video Ad"}</p>
              )}
              {adHeadline && (
                <p><span className="font-medium">Headline:</span> {adHeadline}</p>
              )}
              {adPrimaryText && (
                <p><span className="font-medium">Primary Text:</span> {adPrimaryText}</p>
              )}
              {adDescription && (
                <p><span className="font-medium">Description:</span> {adDescription}</p>
              )}
              {adCta && (
                <p><span className="font-medium">CTA:</span> {adCta}</p>
              )}
              {adDestination && (
                <p><span className="font-medium">Destination URL:</span> {adDestination}</p>
              )}
              {apiResponse.keywords && (
                <p><span className="font-medium">Keywords:</span> {apiResponse.keywords}</p>
              )}
              {apiResponse.file_name && (
                <p><span className="font-medium">Uploaded File:</span> {apiResponse.file_name}</p>
              )}
              {/* {apiResponse.file_url && (
                <p><span className="font-medium">File URL:</span> {apiResponse.file_url}</p>
              )} */}

              {apiResponse.file_url && (
                <div className="pt-2">
                  {getMediaType(apiResponse.file_url, apiResponse.file_type) === "video" ? (
                    <video
                      src={apiResponse.file_url}
                      controls
                      className="mt-1 w-full rounded-xl border border-gray-200 bg-black"
                    />
                  ) : getMediaType(apiResponse.file_url, apiResponse.file_type) === "image" ? (
                    <img
                      src={apiResponse.file_url}
                      alt={apiResponse.file_name || "Creative preview"}
                      className="mt-1 w-full h-[300px] rounded-xl border border-gray-200 object-cover"
                    />
                  ) : (
                    <a
                      href={apiResponse.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-blue-600 underline"
                    >
                      Open media preview
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pre-launch Checks */}
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

        {/* Before Publishing */}
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

        {/* Footer Buttons */}
        <div className="mt-5 flex flex-col sm:flex-row sm:justify-between gap-3">
          <Link
              to={searchParams.get("campaignId") ? `/user-dashboard/campaigns-create/step-6?campaignId=${searchParams.get("campaignId")}` : "/user-dashboard/campaigns-create/step-6"}
            className="btn w-full sm:w-auto text-gray-700 border rounded-xl border-gray-700 hover:bg-gray-400 hover:text-white py-2 text-center"
          >
            Previous
          </Link>

          <button
            onClick={handlePublish}
            disabled={publishing}
            className="btn w-full sm:w-auto text-white bg-blue-600 hover:bg-blue-700 rounded-xl border py-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {publishing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Publishing...
              </>
            ) : (
              "Publish Campaign"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step7Review;