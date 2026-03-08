import React, { useState, useEffect } from "react";
import { Image as ImageIcon, Video, UploadCloud, Sparkles, Pencil, ChevronDown, ChevronUp } from "lucide-react";
import { Link, useNavigate } from "react-router";
import api from "@/lib/axios";
import Swal from "sweetalert2";
import CopyGeneratePreview from "../create-campaign/CopyGeneratePreview";

type AdFormat = "image" | "video";

interface GenerateCopyResponse {
  "Ad copy"?: {
    headline: string;
    primary_text: string;
    description: string;
    call_to_action: string;
    success: boolean;
  };
}

interface AdAsset {
  id: number;
  file_url: string;
  file_type: string;
  status: string;
}

interface AdData {
  id: number;
  name: string;
  status: string;
  headline: string;
  primary_text: string;
  description: string;
  destination_url: string;
  call_to_action: string | null;
  preview_link: string | null;
  assets: AdAsset[];
}

interface CampaignResponse {
  id: number;
  name: string;
  ads: AdData[];
  file_url: string;
  audience_targeting: {
    keywords: string;
  };
}

const UpdateStep6Creative: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");
  
  const campaignId = localStorage.getItem("campaignId") || "50";

  const [adName, setAdName] = useState("");
  const [adFormat, setAdFormat] = useState<AdFormat>("image");
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [benefits, setBenefits] = useState("");
  const [tone, setTone] = useState("Professional");
  const [headline, setHeadline] = useState("");
  const [primaryText, setPrimaryText] = useState("");
  const [description, setDescription] = useState("");
  const [cta, setCta] = useState("Shop now");
  const [destinationUrl, setDestinationUrl] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [keywords, setKeywords] = useState("");
  const [, setFileBase64] = useState<string>("");
  const [campaignData, setCampaignData] = useState<CampaignResponse | null>(null);
  
  const [showAIGenerator, setShowAIGenerator] = useState(false);

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

  const getCampaignBuilderData = () => {
    try {
      const savedData = localStorage.getItem("campaign_builder_data");
      return savedData ? JSON.parse(savedData) : {};
    } catch (error) {
      console.error("Error parsing campaign builder data:", error);
      return {};
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const fetchCampaignData = async () => {
    const org_id = getOrgId();
    if (!org_id) {
      setError("No organization selected");
      setFetchLoading(false);
      return;
    }

    try {
      const response = await api.get(`/main/campaign/${campaignId}/?org_id=${org_id}`);
      setCampaignData(response.data);
      
      const data = response.data;
      
      if (data.ads && data.ads.length > 0) {
        const firstAd = data.ads[0];
        
        setAdName(firstAd.name || "");
        setHeadline(firstAd.headline || "");
        setPrimaryText(firstAd.primary_text || "");
        setDescription(firstAd.description || "");
        
        if (firstAd.call_to_action) {
          setCta(firstAd.call_to_action);
        }
        
        if (firstAd.destination_url) {
          setDestinationUrl(firstAd.destination_url);
        }
        
        if (firstAd.assets && firstAd.assets.length > 0) {
          const imageAsset = firstAd.assets.find((asset: any) => asset.file_type === "IMAGE");
          if (imageAsset) {
            setPreviewUrl(imageAsset.file_url);
            setShowPreview(true);
          }
        }
      }
      
      if (data.audience_targeting && data.audience_targeting.keywords) {
        setKeywords(data.audience_targeting.keywords);
      }
      
      if (data.file_url && !previewUrl) {
        setPreviewUrl(data.file_url);
        setShowPreview(true);
      }
      
      if (data.ads && data.ads.length > 0 && (data.ads[0].headline || data.ads[0].primary_text || data.ads[0].description)) {
        setShowPreview(true);
      }

      localStorage.setItem("api_response", JSON.stringify(response.data));

      const builderData = getCampaignBuilderData();
      const updatedBuilderData = {
        ...builderData,
        step6: {
          adName: data.ads && data.ads.length > 0 ? data.ads[0].name || "" : "",
          adFormat: "image",
          headline: data.ads && data.ads.length > 0 ? data.ads[0].headline || "" : "",
          primaryText: data.ads && data.ads.length > 0 ? data.ads[0].primary_text || "" : "",
          description: data.ads && data.ads.length > 0 ? data.ads[0].description || "" : "",
          cta: data.ads && data.ads.length > 0 ? data.ads[0].call_to_action || "Learn More" : "Learn More",
          destinationUrl: data.ads && data.ads.length > 0 ? data.ads[0].destination_url || "" : "",
          keywords: data.audience_targeting?.keywords || "",
          creativeUrl: data.file_url || (data.ads && data.ads.length > 0 && data.ads[0].assets && data.ads[0].assets.length > 0 ? data.ads[0].assets[0].file_url : ""),
          campaignData: response.data,
        },
        metadata: {
          ...builderData.metadata,
          fetchedAt: new Date().toISOString(),
        },
      };
      localStorage.setItem("campaign_builder_data", JSON.stringify(updatedBuilderData));

    } catch (err: any) {
      console.error("Error fetching campaign:", err);
      setError(err.response?.data?.message || "Failed to fetch campaign data");
      
      const storedData = localStorage.getItem("api_response");
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          setCampaignData(parsedData);
          
          const data = parsedData;
          
          if (data.ads && data.ads.length > 0) {
            const firstAd = data.ads[0];
            if (firstAd.name) setAdName(firstAd.name);
            if (firstAd.headline) setHeadline(firstAd.headline);
            if (firstAd.primary_text) setPrimaryText(firstAd.primary_text);
            if (firstAd.description) setDescription(firstAd.description);
            if (firstAd.call_to_action) setCta(firstAd.call_to_action);
            if (firstAd.destination_url) setDestinationUrl(firstAd.destination_url);
            if (firstAd.assets && firstAd.assets.length > 0) {
              const imageAsset = firstAd.assets.find((asset: any) => asset.file_type === "IMAGE");
              if (imageAsset) {
                setPreviewUrl(imageAsset.file_url);
              }
            }
          }
          
          if (data.audience_targeting && data.audience_targeting.keywords) {
            setKeywords(data.audience_targeting.keywords);
          }
          
          if (data.file_url && !previewUrl) {
            setPreviewUrl(data.file_url);
          }
        } catch (e) {
          console.error("Error parsing stored campaign data:", e);
        }
      }
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    const loadSavedData = async () => {
      const storedApiResponse = localStorage.getItem("api_response");
      if (storedApiResponse) {
        try {
          const parsedData = JSON.parse(storedApiResponse);
          setCampaignData(parsedData);
          
          const data = parsedData;
          
          if (data.ads && data.ads.length > 0) {
            const firstAd = data.ads[0];
            if (!adName && firstAd.name) setAdName(firstAd.name);
            if (!headline && firstAd.headline) setHeadline(firstAd.headline);
            if (!primaryText && firstAd.primary_text) setPrimaryText(firstAd.primary_text);
            if (!description && firstAd.description) setDescription(firstAd.description);
            if (!cta && firstAd.call_to_action) setCta(firstAd.call_to_action);
            if (!destinationUrl && firstAd.destination_url) setDestinationUrl(firstAd.destination_url);
          }
          
          if (!keywords && data.audience_targeting && data.audience_targeting.keywords) {
            setKeywords(data.audience_targeting.keywords);
          }
        } catch (e) {
          console.error("Error parsing stored API response:", e);
        }
      }

      const builderData = getCampaignBuilderData();
      if (builderData.step6) {
        const saved = builderData.step6;
        if (!adName && saved.adName) setAdName(saved.adName);
        if (!adFormat && saved.adFormat) setAdFormat(saved.adFormat);
        if (!headline && saved.headline) setHeadline(saved.headline);
        if (!primaryText && saved.primaryText) setPrimaryText(saved.primaryText);
        if (!description && saved.description) setDescription(saved.description);
        if (!cta && saved.cta) setCta(saved.cta);
        if (!destinationUrl && saved.destinationUrl) setDestinationUrl(saved.destinationUrl);
        if (!keywords && saved.keywords) setKeywords(saved.keywords);
        
        if (saved.headline || saved.primaryText || saved.description) {
          setShowPreview(true);
        }
      }

      await fetchCampaignData();
    };

    loadSavedData();
  }, []);

  const handleFileUpload = async (file: File) => {
    if (adFormat === "image" && !file.type.startsWith("image/")) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "This doesn't look like an image file. It may not display correctly.",
      });
    }
    if (adFormat === "video" && !file.type.startsWith("video/")) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "This doesn't look like a video file. It may not display correctly.",
      });
    }

    setUploadedFile(file);
    
    try {
      const base64 = await fileToBase64(file);
      setFileBase64(base64);
    } catch (error) {
      console.error("Error converting file to base64:", error);
    }
    
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleGenerateCopy = async () => {
    if (!product.trim() || !audience.trim() || !benefits.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill in all fields to generate copy",
      });
      return;
    }

    try {
      setIsGenerating(true);

      const selectedOrg = localStorage.getItem("selectedOrganization");
      let org_id = "";
      if (selectedOrg) {
        const orgData = JSON.parse(selectedOrg);
        org_id = orgData.id;
      }

      const payload = {
        product_service: product,
        target_audience: audience,
        key_benefits: benefits,
        tone: tone.toLowerCase(),
      };

      const response = await api.post<GenerateCopyResponse>(
        `/main/generate-ad-copy/?org_id=${org_id}`,
        payload
      );

      if (response.data?.["Ad copy"]) {
        const adCopy = response.data["Ad copy"];
        
        setHeadline(adCopy.headline || "");
        setPrimaryText(adCopy.primary_text || "");
        setDescription(adCopy.description || "");
        setCta(adCopy.call_to_action || "Learn More");
        setKeywords(benefits);
        
        setShowPreview(true);
        
        setTimeout(() => {
          const previewElement = document.getElementById('ad-preview-section');
          if (previewElement) {
            previewElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);

        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Ad copy generated successfully",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (err: any) {
      console.error("Error generating ad copy:", err);
      Swal.fire({
        icon: "error",
        title: "Generation Failed",
        text: err.response?.data?.message || "Failed to generate ad copy",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async () => {
    if (!campaignId) {
      setError("Campaign ID not found. Please go back to Step 1.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const selectedOrg = localStorage.getItem("selectedOrganization");
      let org_id = "";
      if (selectedOrg) {
        const orgData = JSON.parse(selectedOrg);
        org_id = orgData.id;
      }

      let response;
      if (uploadedFile) {
        const formData = new FormData();
        formData.append("campaign_id", campaignId ? String(campaignId) : "");
        if (adName) formData.append("ad_name", adName);
        if (headline) formData.append("headline", headline);
        if (primaryText) formData.append("primary_text", primaryText);
        if (description) formData.append("description", description);
        if (cta && cta !== "Learn More") formData.append("call_to_action", cta);
        if (destinationUrl) {
          let url = destinationUrl.trim();
          if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
          }
          formData.append("destination_url", url);
        }
        if (keywords) formData.append("keywords", keywords);
        formData.append("ad_file", uploadedFile);
        formData.append("file_name", uploadedFile.name);
        formData.append("file_type", uploadedFile.type);

        response = await api.post(`/main/create-ad/?org_id=${org_id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        const requestData: any = {
          campaign_id: parseInt(campaignId),
        };
        if (adName) requestData.ad_name = adName;
        if (headline) requestData.headline = headline;
        if (primaryText) requestData.primary_text = primaryText;
        if (description) requestData.description = description;
        if (cta && cta !== "Learn More") requestData.call_to_action = cta;
        if (destinationUrl) {
          let url = destinationUrl.trim();
          if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
          }
          requestData.destination_url = url;
        }
        if (keywords) requestData.keywords = keywords;
        
        response = await api.post(`/main/create-ad/?org_id=${org_id}`, requestData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      localStorage.setItem("api_response", JSON.stringify(response.data));

      const builderData = getCampaignBuilderData();
      const updatedBuilderData = {
        ...builderData,
        step6: {
          adName,
          adFormat,
          headline,
          primaryText,
          description,
          cta,
          destinationUrl,
          keywords,
          uploadedFile: uploadedFile?.name,
          adResponse: response.data,
        },
        metadata: {
          ...builderData.metadata,
          updatedAt: new Date().toISOString(),
        },
      };
      
      localStorage.setItem("campaign_builder_data", JSON.stringify(updatedBuilderData));

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Ad updated successfully",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        navigate(`/user-dashboard/campaigns-update/${campaignId}/update-step-7`);
      });

    } catch (err: any) {
      console.error("Error updating ad:", err);
      
      let errorMessage = "Failed to update ad. Please try again.";
      
      if (err.response?.data) {
        if (typeof err.response.data === 'object') {
          const errors = [];
          for (const [key, value] of Object.entries(err.response.data)) {
            errors.push(`${key}: ${JSON.stringify(value)}`);
          }
          errorMessage = errors.join('\n');
        } else {
          errorMessage = String(err.response.data);
        }
      }
      
      setError(errorMessage);
      
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: errorMessage,
        width: '600px',
      });
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (fetchLoading) {
    return (
      <div className="w-full bg-white rounded-2xl border border-gray-200 p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Update Your Ad</h2>
          <p className="text-sm text-gray-500">Loading campaign data...</p>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500">Fetching campaign data for ID: {campaignId}...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Update Your Ad</h2>
        <p className="text-sm text-gray-500">
          Update creative assets and ad copy
        </p>
        
        {campaignId && campaignData && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
            <p className="text-xs font-medium text-blue-800">
              Campaign ID: <span className="font-bold">{campaignId}</span>
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Campaign Name: <span className="font-medium">{campaignData.name || 'N/A'}</span>
            </p>
            {campaignData.ads && campaignData.ads.length > 0 && (
              <p className="text-xs text-blue-600">
                Ad Name: <span className="font-medium">{campaignData.ads[0].name || 'N/A'}</span>
              </p>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
          <p className="text-sm text-red-600 whitespace-pre-wrap">{error}</p>
        </div>
      )}

      <div className="mb-5">
        <label className="text-sm font-medium text-gray-700 block mb-1">
          Ad Name
        </label>
        <input
          value={adName}
          onChange={(e) => setAdName(e.target.value)}
          placeholder="e.g. Summer Sale - Image Ad"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Ad Format
        </label>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => {
              setAdFormat("image");
              setUploadedFile(null);
              setFileBase64("");
              if (campaignData?.file_url) {
                setPreviewUrl(campaignData.file_url);
              } else if (campaignData?.ads && campaignData.ads.length > 0 && campaignData.ads[0].assets && campaignData.ads[0].assets.length > 0) {
                setPreviewUrl(campaignData.ads[0].assets[0].file_url);
              } else {
                setPreviewUrl("");
              }
            }}
            className={`rounded-xl border p-4 flex flex-col items-center gap-2 ${
              adFormat === "image"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200"
            }`}
          >
            <ImageIcon className="w-5 h-5 text-gray-700" />
            <span className="text-sm font-medium">Image Ad</span>
          </button>

          <button
            onClick={() => {
              setAdFormat("video");
              setUploadedFile(null);
              setFileBase64("");
              setPreviewUrl("");
            }}
            className={`rounded-xl border p-4 flex flex-col items-center gap-2 ${
              adFormat === "video"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200"
            }`}
          >
            <Video className="w-5 h-5 text-gray-700" />
            <span className="text-sm font-medium">Video Ad</span>
          </button>
        </div>
      </div>

      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Upload Creative
        </label>

        {previewUrl && !uploadedFile && (
          <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs text-green-700 mb-1">✓ Existing creative available</p>
            <p className="text-xs text-gray-500 mt-2">
              Upload a new file below to replace it
            </p>
          </div>
        )}

        <label className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer block hover:bg-gray-50 transition-colors">
          <UploadCloud className="w-6 h-6 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">
            {uploadedFile ? uploadedFile.name : "Click to upload or drag and drop"}
          </p>
          <p className="text-xs text-gray-400">
            {adFormat === "image"
              ? "PNG, JPG up to 10MB"
              : "MP4, MOV up to 50MB"}
          </p>

          <input
            type="file"
            accept={adFormat === "image" ? "image/*" : "video/*"}
            hidden
            onChange={(e) =>
              e.target.files && handleFileUpload(e.target.files[0])
            }
          />
        </label>
        
        {uploadedFile && (
          <p className="text-xs text-green-600 mt-2">
            ✓ {uploadedFile.name} uploaded successfully
          </p>
        )}
      </div>

      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 block mb-1">
          Keywords
        </label>
        <input
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="e.g. Happy, Sad, Crazy"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 block mb-1">
          Destination URL
        </label>
        <input
          value={destinationUrl}
          onChange={(e) => setDestinationUrl(e.target.value)}
          placeholder="https://example.com"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-6 border border-gray-200 rounded-xl overflow-hidden">
        <button
          onClick={() => setShowAIGenerator(!showAIGenerator)}
          className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-gray-900">
              AI Copy Generator
            </span>
            <span className="text-xs text-gray-500">(AI will generate and fill the fields below) Click to expand</span>
          </div>
          {showAIGenerator ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>

        {showAIGenerator && (
          <div className="p-4 bg-blue-50/30 border-t border-gray-200">
            <p className="text-xs text-gray-600 mb-3">
              Fill in the details below and AI will generate ad copy for you. The generated content will automatically fill the fields above.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 block mb-1">Product/Service</label>
                <input
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  placeholder="e.g. Salon, Software, Clothing"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 block mb-1">Target Audience</label>
                <input
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="e.g. Women, Professionals, Students"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 block mb-1">Key Benefits</label>
                <input
                  value={benefits}
                  onChange={(e) => setBenefits(e.target.value)}
                  placeholder="e.g. Better service, Fast delivery"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 block mb-1">Tone</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option>Professional</option>
                  <option>Friendly</option>
                  <option>Bold</option>
                  <option>Casual</option>
                  <option>Exciting</option>
                  <option>Humorous</option>
                </select>
              </div>

              <button
                onClick={handleGenerateCopy}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg py-2 text-sm hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Copy with AI
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mb-6 border border-gray-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-900">
            Ad Copy <span className="text-gray-400 text-xs">(Editable)</span>
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Pencil className="w-3 h-3" />
            <span>You can edit these fields anytime</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 block mb-1">
              Headline
            </label>
            <input
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Enter your ad headline"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">
              Primary Text
            </label>
            <textarea
              value={primaryText}
              onChange={(e) => setPrimaryText(e.target.value)}
              placeholder="Enter your primary ad text"
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">
              Description
            </label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter ad description"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">
              Call to Action
            </label>
            <select
              value={cta}
              onChange={(e) => setCta(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option>Shop now</option>
              <option>Learn More</option>
              <option>Sign Up</option>
              <option>Contact Us</option>
              <option>Book Now</option>
              <option>Download</option>
              <option>Get Quote</option>
            </select>
          </div>
        </div>
      </div>

      {(showPreview || headline || primaryText || description || previewUrl) && (
        <div id="ad-preview-section" className="mb-6 border-t pt-6">
          <h3 className="text-md font-semibold text-gray-900 mb-4">Ad Preview</h3>
          <CopyGeneratePreview
            data={{
              headline,
              primaryText,
              description,
              cta,
              mediaUrl: previewUrl,
              isVideo: adFormat === "video",
            }}
          />
          <p className="text-xs text-gray-500 mt-2 text-center">
            Preview updates automatically as you edit the fields above
          </p>
        </div>
      )}

      <div className="flex justify-between mt-5">
        <Link
          to={`/user-dashboard/campaigns-update/${campaignId}/update-step-5`}
          className="btn md:w-40 text-gray-700 border rounded-xl border-gray-700 hover:bg-gray-400 hover:text-white py-2 text-center"
        >
          Previous
        </Link>

        <button
          onClick={handleSubmit}
          disabled={loading || !campaignId}
          className="btn md:w-40 text-white bg-blue-600 hover:bg-blue-700 rounded-xl border py-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Update Ad"}
        </button>
      </div>
    </div>
  );
};

export default UpdateStep6Creative;