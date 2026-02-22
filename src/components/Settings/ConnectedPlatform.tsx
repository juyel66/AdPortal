import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import api from "../../lib/axios";

type PlatformKey = "meta" | "google" | "tiktok";

type Platform = {
  key: PlatformKey;
  name: string;
  description: string;
  logo: string;
  endpoint: string;
};

const platforms: Platform[] = [
  {
    key: "meta",
    name: "Meta (Facebook)",
    description: "Reach billions of users across Facebook",
    logo: "https://res.cloudinary.com/dqkczdjjs/image/upload/v1765754457/Container_10_m3mnnq.png",
    endpoint: "/auth/meta/connect/",
  },
  {
    key: "google",
    name: "Google Ads",
    description: "Show ads on Google Search, YouTube, and Display Network",
    logo: "https://res.cloudinary.com/dqkczdjjs/image/upload/v1765754457/Container_11_bdja1x.png",
    endpoint: "/auth/google/connect/",
  },
  {
    key: "tiktok",
    name: "TikTok Ads",
    description: "Engage with Gen Z and millennials on TikTok",
    logo: "https://res.cloudinary.com/dqkczdjjs/image/upload/v1765754457/Container_12_siwhfp.png",
    endpoint: "/auth/tiktok/connect/",
  },
];

const ConnectedPlatforms: React.FC = () => {
  const [connected, setConnected] = useState<Record<PlatformKey, boolean>>({
    meta: false,
    google: false,
    tiktok: false,
  });

  const [loading, setLoading] = useState<PlatformKey | null>(null);
  const [organizationId, setOrganizationId] = useState<string | null>(null);

  useEffect(() => {
    const getOrgIdFromLocalStorage = () => {
      const selectedOrg = localStorage.getItem("selectedOrganization");
      if (selectedOrg) {
        try {
          const parsed = JSON.parse(selectedOrg);
          if (parsed?.id) {
            setOrganizationId(parsed.id);
            return parsed.id;
          }
        } catch (error) {
          console.error("Error parsing selected organization:", error);
        }
      }
      return null;
    };

    const orgId = getOrgIdFromLocalStorage();
    if (orgId) {
      fetchIntegrationStatus(orgId);
    }
  }, []);

  const fetchIntegrationStatus = async (orgId: string) => {
    try {
      // Use POST method as requested
      const response = await api.get(`/main/integrations-status/?org_id=${orgId}`);
      if (response.data && response.data.integrations) {
        const statusMap: Record<PlatformKey, boolean> = {
          meta: false,
          google: false,
          tiktok: false,
        };
        response.data.integrations.forEach((integration: any) => {
          if (integration.platform === "META") statusMap.meta = integration.status;
          if (integration.platform === "GOOGLE") statusMap.google = integration.status;
          if (integration.platform === "TIKTOK") statusMap.tiktok = integration.status;
        });
        setConnected(statusMap);
      }
    } catch (error) {
      console.error("Error fetching integration status:", error);
    }
  };

  const handleConnect = async (platform: Platform) => {
    if (!organizationId) {
      console.error("No organization selected");
      return;
    }

    setLoading(platform.key);

    try {
      const response = await api.get(
        `${platform.endpoint}?org_id=${organizationId}`
      );

      if (response.data.redirect_url) {
        window.open(response.data.redirect_url, "_blank");
        
        // Optionally, you can set connected to true after successful connection
        // This would require polling or webhook to check connection status
        // For now, we'll keep it optimistic or implement polling
        setTimeout(() => {
          setConnected((prev) => ({
            ...prev,
            [platform.key]: true,
          }));
          setLoading(null);
        }, 2000);
      }
    } catch (error) {
      console.error(`Error connecting to ${platform.name}:`, error);
      setLoading(null);
    }
  };

  const handleDisconnect = (key: PlatformKey) => {
    // Note: You might need to implement disconnect API endpoint
    // For now, just update the local state
    setConnected((prev) => ({
      ...prev,
      [key]: false,
    }));
  };

  const getPlatformConnectionStatus = (key: PlatformKey) => {
    // Always use the latest status from backend
    return connected[key];
  };

  return (
    <div className="rounded-xl bg-white p-6">
      <h2 className="text-base font-semibold text-slate-900 mb-6">
        Connected Platforms
      </h2>

      <div className="space-y-4">
        {platforms.map((platform) => {
          const isConnected = getPlatformConnectionStatus(platform.key);
          const isLoading = loading === platform.key;

          return (
            <div
              key={platform.key}
              className="flex items-center justify-between rounded-xl p-4 hover:bg-slate-50 transition-colors"
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
                    onClick={() => handleConnect(platform)}
                    disabled={isLoading || !organizationId}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition disabled:opacity-70"
                  >
                    {isLoading && <Loader2 size={16} className="animate-spin" />}
                    {!organizationId ? (
                      "No Org Selected"
                    ) : isLoading ? (
                      "Connecting..."
                    ) : (
                     <p>Connect</p>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!organizationId && (
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-700">
            Please select an organization first to connect platforms.
          </p>
        </div>
      )}
    </div>
  );
};

export default ConnectedPlatforms;