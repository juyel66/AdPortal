import React, { useState } from "react";
import { Image as ImageIcon, Video, UploadCloud, Sparkles } from "lucide-react";
import CopyGeneratePreview from "./CopyGeneratePreview";

type AdFormat = "image" | "video";

const Step5Creative: React.FC = () => {
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
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleFileUpload = (file: File) => {
    if (adFormat === "image" && !file.type.startsWith("image/")) return;
    if (adFormat === "video" && !file.type.startsWith("video/")) return;

    setUploadedFile(file);
  };

  const handleGenerateCopy = () => {
    // Generate ad copy based on form inputs
    if (product && audience && benefits) {
      setHeadline(`Discover ${product} for ${audience}`);
      setPrimaryText(`Experience the benefits: ${benefits}`);
      setDescription(
        `Transform your workflow with our ${tone.toLowerCase()} solution.`
      );
      setCta("Shop Now");
      setShowPreview(true);
    }
  };

  console.log(setHeadline, setPrimaryText, description, setDescription, setCta);

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Create Your Ad</h2>
        <p className="text-sm text-gray-500">
          Upload creative assets and write compelling ad copy
        </p>
      </div>

      {/* Ad Name */}
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

      {/* Ad Format */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Ad Format
        </label>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => {
              setAdFormat("image");
              setUploadedFile(null);
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

      {/* Upload Creative */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Upload Creative
        </label>

        <label className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer block">
          <UploadCloud className="w-6 h-6 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">
            Click to upload or drag and drop
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
      </div>

      {/* Generate Ad Copy */}
      <div className="mb-6 border border-gray-200 rounded-xl p-4">
        <p className="text-sm font-semibold text-gray-900 mb-3">
          Generate Ad Copy
        </p>

        <div className="space-y-3">
          <label>Product/Service</label>
          <input
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />

          <label>Target Audience</label>
          <input
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />

          <label>Key Benefits</label>
          <input
            value={benefits}
            onChange={(e) => setBenefits(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />

          <label>Tone</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          >
            <option>Professional</option>
            <option>Friendly</option>
            <option>Bold</option>
            <option>Casual</option>
          </select>

          <button
            onClick={handleGenerateCopy}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg py-2 text-sm hover:bg-blue-700 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Generate Copy
          </button>
        </div>
      </div>

      {/* Show preview only after generating copy */}
      {showPreview && (
        <CopyGeneratePreview
          data={{
            headline,
            primaryText,
            description,
            cta,
            mediaUrl: uploadedFile ? URL.createObjectURL(uploadedFile) : "",
            isVideo: adFormat === "video",
          }}
        />
      )}
    </div>
  );
};

export default Step5Creative;
