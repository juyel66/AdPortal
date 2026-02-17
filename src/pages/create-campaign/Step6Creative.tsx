import React, { useState, useEffect } from "react";
import { Image as ImageIcon, Video, UploadCloud, Sparkles } from "lucide-react";
import CopyGeneratePreview from "./CopyGeneratePreview";
import { Link, useNavigate } from "react-router";
import api from "@/lib/axios";
import Swal from "sweetalert2";

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

const Step6Creative: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Get campaign_id from localStorage (same as Step5Budget)
  const campaignId = localStorage.getItem("campaignId");

  // Form states
  const [adName, setAdName] = useState("");
  const [adFormat, setAdFormat] = useState<AdFormat>("image");
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [benefits, setBenefits] = useState("");
  const [tone, setTone] = useState("Professional");
  const [headline, setHeadline] = useState("");
  const [primaryText, setPrimaryText] = useState("");
  const [description, setDescription] = useState("");
  const [cta, setCta] = useState("Learn More");
  const [destinationUrl, setDestinationUrl] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [keywords, setKeywords] = useState("");
  const [fileBase64, setFileBase64] = useState<string>("");

  // Get builder data from localStorage
  const getCampaignBuilderData = () => {
    try {
      const savedData = localStorage.getItem("campaign_builder_data");
      return savedData ? JSON.parse(savedData) : {};
    } catch (error) {
      console.error("Error parsing campaign builder data:", error);
      return {};
    }
  };

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Load saved data if exists
  useEffect(() => {
    const builderData = getCampaignBuilderData();
    if (builderData.step6) {
      const saved = builderData.step6;
      setAdName(saved.adName || "");
      setAdFormat(saved.adFormat || "image");
      setHeadline(saved.headline || "");
      setPrimaryText(saved.primaryText || "");
      setDescription(saved.description || "");
      setCta(saved.cta || "Learn More");
      setDestinationUrl(saved.destinationUrl || "");
      setKeywords(saved.keywords || "");
    }
  }, []);

  const handleFileUpload = async (file: File) => {
    // Show warning but don't block if file type doesn't match
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
    
    // Convert to base64
    try {
      const base64 = await fileToBase64(file);
      setFileBase64(base64);
    } catch (error) {
      console.error("Error converting file to base64:", error);
    }
    
    // Create preview URL
    if (previewUrl) {
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

      // Get org_id
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

      console.log("📤 Generating ad copy:", payload);

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
      console.error("❌ Error generating ad copy:", err);
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
      // Get org_id
      const selectedOrg = localStorage.getItem("selectedOrganization");
      let org_id = "";
      if (selectedOrg) {
        const orgData = JSON.parse(selectedOrg);
        org_id = orgData.id;
      }

      // Prepare request data - only include campaign_id (required)
      const requestData: any = {
        campaign_id: parseInt(campaignId),
      };

      // Add fields only if they have values (all optional)
      if (adName) requestData.ad_name = adName;
      if (headline) requestData.headline = headline;
      if (primaryText) requestData.primary_text = primaryText;
      if (description) requestData.description = description;
      if (cta && cta !== "Learn More") requestData.call_to_action = cta;
      
      // Handle URL if provided
      if (destinationUrl) {
        let url = destinationUrl.trim();
        if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
          url = 'https://' + url;
        }
        requestData.destination_url = url;
      }

      // Add keywords if provided
      if (keywords) {
        requestData.keywords = keywords;
      }

      // Add file if uploaded (as base64)
      if (fileBase64) {
        requestData.ad_file = fileBase64;
        requestData.file_name = uploadedFile?.name;
        requestData.file_type = uploadedFile?.type;
      }

      console.log("📤 Sending ad data:", requestData);

      const response = await api.post(`/main/create-ad/?org_id=${org_id}`, requestData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("✅ Ad created:", response.data);

      // Save to localStorage for next steps
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
        text: "Ad created successfully",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        navigate("/user-dashboard/campaigns-create/step-7");
      });

    } catch (err: any) {
      console.error(" Error creating ad:", err);
      
      let errorMessage = "Failed to create ad. Please try again.";
      
      if (err.response?.data) {
        console.log("API Error Response:", err.response.data);
        
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
        title: "Create Failed",
        text: errorMessage,
        width: '600px',
      
      });
      
    } finally {
      setLoading(false);
    }
  };

  // Clean up preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Create Your Ad</h2>
        <p className="text-sm text-gray-500">
          Upload creative assets and write compelling ad copy
        </p>
        
        {/* Show campaign ID like Step5Budget */}
        {campaignId && (
          <p className="text-xs text-gray-400 mt-1">Campaign ID: {campaignId}</p>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
          <p className="text-sm text-red-600 whitespace-pre-wrap">{error}</p>
        </div>
      )}

      {/* Ad Name - Optional */}
      <div className="mb-5">
        <label className="text-sm font-medium text-gray-700 block mb-1">
          Ad Name <span className="text-gray-400 text-xs">(Optional)</span>
        </label>
        <input
          value={adName}
          onChange={(e) => setAdName(e.target.value)}
          placeholder="e.g. Summer Sale - Image Ad"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Ad Format - Optional */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Ad Format <span className="text-gray-400 text-xs">(Optional)</span>
        </label>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => {
              setAdFormat("image");
              setUploadedFile(null);
              setFileBase64("");
              setPreviewUrl("");
              setShowPreview(false);
            }}
            className={`rounded-xl border p-4 flex flex-col items-center gap-2
              ${
                adFormat === "image"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              }
            `}
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
              setShowPreview(false);
            }}
            className={`rounded-xl border p-4 flex flex-col items-center gap-2
              ${
                adFormat === "video"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              }
            `}
          >
            <Video className="w-5 h-5 text-gray-700" />
            <span className="text-sm font-medium">Video Ad</span>
          </button>
        </div>
      </div>

      {/* Upload Creative - Optional */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Upload Creative <span className="text-gray-400 text-xs">(Optional)</span>
        </label>

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

      {/* Keywords - Optional */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 block mb-1">
          Keywords <span className="text-gray-400 text-xs">(Optional)</span>
        </label>
        <input
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="e.g. Happy, Sad, Crazy"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Destination URL - Optional */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 block mb-1">
          Destination URL <span className="text-gray-400 text-xs">(Optional)</span>
        </label>
        <input
          value={destinationUrl}
          onChange={(e) => setDestinationUrl(e.target.value)}
          placeholder="https://example.com"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Generate Ad Copy - All fields optional */}
      <div className="mb-6 border border-gray-200 rounded-xl p-4">
        <p className="text-sm font-semibold text-gray-900 mb-3">
          Generate Ad Copy <span className="text-gray-400 text-xs">(Optional)</span>
        </p>

        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-600 block mb-1">Product/Service</label>
            <input
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="e.g. Salon, Software, Clothing"
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">Target Audience</label>
            <input
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="e.g. Women, Professionals, Students"
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">Key Benefits</label>
            <input
              value={benefits}
              onChange={(e) => setBenefits(e.target.value)}
              placeholder="e.g. Better service, Fast delivery"
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">Tone</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
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
                Generate Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preview Section - Shows only if generated */}
      {showPreview && (
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
        </div>
      )}

      {/* Navigation Buttons - Same as Step5Budget */}
      <div className="flex justify-between mt-5">
        <Link
          to="/user-dashboard/campaigns-create/step-5"
          className="btn md:w-40 text-gray-700 border rounded-xl border-gray-700 hover:bg-gray-400 hover:text-white py-2 text-center"
        >
          Previous
        </Link>

        <button
          onClick={handleSubmit}
          disabled={loading || !campaignId}
          className="btn md:w-40 text-white bg-blue-600 hover:bg-blue-700 rounded-xl border py-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Continue"}
        </button>
      </div>
    </div>
  );
};

export default Step6Creative;