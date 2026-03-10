import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import api from "../../lib/axios";
import Swal from "sweetalert2";
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
  const [disconnecting, setDisconnecting] = useState<PlatformKey | null>(null);
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
      }
    } catch (error) {
      console.error(`Error connecting to ${platform.name}:`, error);
    } finally {
      setLoading(null);
    }
  };

  const handleDisconnect = async (key: PlatformKey) => {
    if (!organizationId) return;

    const result = await Swal.fire({
      title: "Disconnect platform?",
      text: `Are you sure you want to disconnect ${platforms.find((p) => p.key === key)?.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, disconnect",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    setDisconnecting(key);
    try {
      await api.post(
        `/main/disconnect-integration/?org_id=${organizationId}`,
        { platform: key.toUpperCase() }
      );
      setConnected((prev) => ({ ...prev, [key]: false }));
      Swal.fire({
        icon: "success",
        title: "Disconnected!",
        text: `${platforms.find((p) => p.key === key)?.name} has been disconnected.`,
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error: any) {
      console.error(`Error disconnecting ${key}:`, error);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error.response?.data?.message || "Failed to disconnect. Please try again.",
        confirmButtonColor: "#3085d6",
      });
    } finally {
      setDisconnecting(null);
    }
  };

  const getPlatformConnectionStatus = (key: PlatformKey) => {
    // Always use the latest status from backend
    return connected[key];
  };

  return (
    <div className="rounded-xl bg-white ">
      <h2 className="text-base font-semibold text-slate-900 mb-6">
        Connected Platforms
      </h2>

      <div className="space-y-4">
        {platforms.map((platform) => {
          const isConnected = getPlatformConnectionStatus(platform.key);
          const isLoading = loading === platform.key;
          const isDisconnecting = disconnecting === platform.key;

          return (
            <div
              key={platform.key}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl p-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
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

              <div className="sm:flex-shrink-0">
                {isConnected ? (
                  <button
                    onClick={() => handleDisconnect(platform.key)}
                    disabled={isDisconnecting}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg border border-red-400 px-4 py-1.5 text-sm font-medium text-red-500 hover:bg-red-50 transition disabled:opacity-70"
                  >
                    {isDisconnecting && <Loader2 size={16} className="animate-spin" />}
                    {isDisconnecting ? "Disconnecting..." : "Disconnect"}
                  </button>
                ) : (
                  <button
                    onClick={() => handleConnect(platform)}
                    disabled={isLoading || !organizationId}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition disabled:opacity-70"
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