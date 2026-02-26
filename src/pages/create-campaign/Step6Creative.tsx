import React, { useState, useEffect } from "react";
import { Image as ImageIcon, Video, UploadCloud, Sparkles, Pencil, ChevronDown, ChevronUp } from "lucide-react";
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
  
  const campaignId = localStorage.getItem("campaignId");

  // Form states - all visible from the start
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
  const [fileBase64, setFileBase64] = useState<string>("");
  
  // State for collapsible AI generator
  const [showAIGenerator, setShowAIGenerator] = useState(false);

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

  // Clear all campaign-related data from localStorage
  const clearCampaignData = () => {
    localStorage.removeItem("campaign_builder_data");
    localStorage.removeItem("campaignId");
    localStorage.removeItem("campaignName");
    localStorage.removeItem("campaignStatus");
    console.log("🧹 Campaign data cleared from localStorage");
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
      
      // Also load the preview state if there was previously generated content
      if (saved.headline || saved.primaryText || saved.description) {
        setShowPreview(true);
      }
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
        
        // Update all the form fields with generated content
        setHeadline(adCopy.headline || "");
        setPrimaryText(adCopy.primary_text || "");
        setDescription(adCopy.description || "");
        setCta(adCopy.call_to_action || "Learn More");
        setKeywords(benefits);
        
        // Show the preview section
        setShowPreview(true);
        
        // Scroll to preview after generation
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

      let response;
      // If a file is uploaded, use FormData
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

        console.log("📤 Sending ad data (FormData):", formData);

        response = await api.post(`/main/create-ad/?org_id=${org_id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        // No file, send as JSON
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
        
        console.log("📤 Sending ad data (JSON):", requestData);
        response = await api.post(`/main/create-ad/?org_id=${org_id}`, requestData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      console.log("✅ Ad created:", response.data);

      // Store the complete API response in localStorage with key "api_response"
      localStorage.setItem("api_response", JSON.stringify(response.data));
      console.log("💾 Complete API response stored in localStorage with key: api_response");

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
        // Clear all campaign data from localStorage
        clearCampaignData();
        
        // Navigate to review page
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



          {/* AI Copy Generator - Collapsible Section */}
      <div className="mb-6 border border-gray-200 rounded-xl overflow-hidden">
        {/* Header/Button */}
        <button
          onClick={() => setShowAIGenerator(!showAIGenerator)}
          className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-gray-900">
              AI Copy Generator
            </span>
            <span className="text-xs text-gray-500">  (AI will generate and fill the fields below) Click to expand</span>
          </div>
          {showAIGenerator ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>

        {/* Collapsible Content */}
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




      

      {/* Ad Copy Fields - Always visible and editable */}
      <div className="mb-6 border border-gray-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-900">
            Ad Copy Generator <span className="text-gray-400 text-xs"></span>
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Pencil className="w-3 h-3" />
            <span>You can edit these fields anytime</span>
          </div>
        </div>

        <div className="space-y-4">
          {/* Headline */}
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

          {/* Primary Text */}
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

          {/* Description */}
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

          {/* Call to Action */}
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

  

      {/* Preview Section - Shows only if there's content */}
      {(showPreview || headline || primaryText || description) && (
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

      {/* Navigation Buttons */}
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