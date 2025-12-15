import React, { useState } from "react";
import { Check } from "lucide-react";

import type {
  PlatformItem,
  PlatformKey,
} from "@/types/createCampaignStep1";

/* ===============================
   PLATFORM DATA
================================ */

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
    description:
      "Show ads on Google Search, YouTube, and Display Network",
    connected: true,
    logo: "https://res.cloudinary.com/dqkczdjjs/image/upload/v1765754457/Container_11_bdja1x.png",
  },
  {
    key: "tiktok",
    name: "TikTok Ads",
    description:
      "Engage with Gen Z and millennials on TikTok",
    connected: true,
    logo: "https://res.cloudinary.com/dqkczdjjs/image/upload/v1765754457/Container_12_siwhfp.png",
  },
];

/* ===============================
   COMPONENT
================================ */

const Step1Platforms: React.FC = () => {
  const [selected, setSelected] = useState<PlatformKey[]>([
    "google",
    "tiktok",
  ]);

  const togglePlatform = (key: PlatformKey) => {
    setSelected((prev) =>
      prev.includes(key)
        ? prev.filter((p) => p !== key)
        : [...prev, key]
    );
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Select Platforms
        </h2>
        <p className="text-sm text-slate-500">
          Choose where you want to run your campaign. You can select
          multiple platforms.
        </p>
      </div>

      {/* Platform Cards */}
      <div className="space-y-4">
        {PLATFORMS.map((platform) => {
          const isSelected = selected.includes(platform.key);

          return (
            <div
              key={platform.key}
              onClick={() => togglePlatform(platform.key)}
              className={`cursor-pointer rounded-xl border p-4 flex items-center justify-between transition
                ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                    : "border-slate-200 hover:border-slate-300"
                }
              `}
            >
              <div className="flex items-center gap-4">
                {/* Logo */}
                <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-white">
                  <img
                    src={platform.logo}
                    alt={platform.name}
                    className=" object-contain"
                  />
                </div>

                {/* Info */}
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-900">
                      {platform.name}
                    </p>

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

              {/* Checkbox */}
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-full border
                  ${
                    isSelected
                      ? "border-blue-600 bg-blue-600"
                      : "border-slate-300 bg-white"
                  }
                `}
              >
                {isSelected && (
                  <Check size={14} className="text-white" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Platforms */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <p className="mb-2 text-sm font-medium text-slate-700">
          Selected Platforms:
        </p>

        <div className="flex flex-wrap gap-2">
          {selected.map((key) => (
            <span
              key={key}
              className="rounded-full border border-blue-500 bg-white px-3 py-1 text-xs font-medium text-blue-600"
            >
              {PLATFORMS.find((p) => p.key === key)?.name.split(" ")[0]}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Step1Platforms;
