

import React, { useState } from "react";
import { Loader2 } from "lucide-react";


type PlatformKey = "meta" | "google" | "tiktok";

type Platform = {
  key: PlatformKey;
  name: string;
  description: string;
  logo: string;
};


const platforms: Platform[] = [
  {
    key: "meta",
    name: "Meta (Facebook)",
    description: "Reach billions of users across Facebook",
    logo: "https://res.cloudinary.com/dqkczdjjs/image/upload/v1765754457/Container_10_m3mnnq.png",
  },
  {
    key: "google",
    name: "Google Ads",
    description:
      "Show ads on Google Search, YouTube, and Display Network",
    logo: "https://res.cloudinary.com/dqkczdjjs/image/upload/v1765754457/Container_11_bdja1x.png",
  },
  {
    key: "tiktok",
    name: "TikTok Ads",
    description: "Engage with Gen Z and millennials on TikTok",
    logo: "https://res.cloudinary.com/dqkczdjjs/image/upload/v1765754457/Container_12_siwhfp.png",
  },
];



const ConnectedPlatforms: React.FC = () => {
  const [connected, setConnected] = useState<Record<PlatformKey, boolean>>({
    meta: true,
    google: true,
    tiktok: false,
  });

  const [loading, setLoading] = useState<PlatformKey | null>(null);

  const handleConnect = (key: PlatformKey) => {
    setLoading(key);


    setTimeout(() => {
      setConnected((prev) => ({
        ...prev,
        [key]: true,
      }));
      setLoading(null);
    }, 1500);
  };

  const handleDisconnect = (key: PlatformKey) => {
    setConnected((prev) => ({
      ...prev,
      [key]: false,
    }));
  };

  return (
    <div className="rounded-xl  bg-white p-6">
      {/* Title */}
      <h2 className="text-base font-semibold text-slate-900 mb-6">
        Connected Platforms
      </h2>

      <div className="space-y-4">
        {platforms.map((platform) => {
          const isConnected = connected[platform.key];
          const isLoading = loading === platform.key;

          return (
            <div
              key={platform.key}
              className="flex items-center justify-between rounded-xl  p-4"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                  <img
                    src={platform.logo}
                    alt={platform.name}
                    className="h-7 w-7 object-contain"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-900">
                      {platform.name}
                    </p>

                    {isConnected && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                        Connected
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 mt-0.5">
                    {platform.description}
                  </p>
                </div>
              </div>

              <div>
                {isConnected ? (
                  <button
                    onClick={() => handleDisconnect(platform.key)}
                    className="rounded-lg border border-red-400 px-4 py-1.5 text-sm font-medium text-red-500 hover:bg-red-50 transition"
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    onClick={() => handleConnect(platform.key)}
                    disabled={isLoading}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition disabled:opacity-70"
                  >
                    {isLoading && (
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />
                    )}
                    {isLoading ? "Connecting..." : "Connect"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConnectedPlatforms;
