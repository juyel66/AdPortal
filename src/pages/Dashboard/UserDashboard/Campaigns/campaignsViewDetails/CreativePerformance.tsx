import React from "react";

type AdMatrics = {
  impressions: number;
  clicks: number;
  ctr: number;
  conversions: number;
  roas: number;
  cpc: number;
  cpm: number;
  cpa: number;
};

type Ad = {
  id: number;
  ad_name: string;
  headline: string;
  primary_text: string;
  description: string;
  call_to_action: string;
  destination_url: string;
  file_url?: string; // Add file_url field
  matrics?: AdMatrics;
  type?: "Image" | "Video"; // We'll derive this from file_url
};

type Campaign = {
  id: number;
  name: string;
  objective: string;
  platforms: string[];
  matrics: AdMatrics;
  ads: Ad[];
  audience_targeting: {
    min_age: number;
    max_age: number;
    gender: string;
    locations: string[];
    keywords: string;
  };
  status: string;
  created_at: string;
  ai_insights: unknown[];
  total_budget: number;
  total_spent: number;
  remaining_budget: number;
  budgets: Array<{
    platform: string;
    budget_type: string;
    start_date: string;
    end_date: string;
    budget: number;
    run_continuously: boolean;
  }>;
  file_url?: string; // Campaign level file_url
};

type CreativePerformanceProps = {
  campaign: Campaign;
};

// Helper function to determine media type from file_url
const getMediaType = (fileUrl?: string): "Image" | "Video" => {
  if (!fileUrl) return "Image";
  
  const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.m4v'];
  const fileExt = fileUrl.substring(fileUrl.lastIndexOf('.')).toLowerCase();
  
  return videoExtensions.includes(fileExt) ? "Video" : "Image";
};

// Helper function to get file name from URL
const getFileName = (fileUrl?: string): string => {
  if (!fileUrl) return "";
  return fileUrl.split('/').pop() || "";
};

const CreativePerformance: React.FC<CreativePerformanceProps> = ({ campaign }) => {
  return (
    <div className="rounded-xl border bg-white p-6">
      {/* Header */}
      <h2 className="mb-4 text-sm font-semibold text-slate-900">
        Creative Performance
      </h2>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {campaign.ads && campaign.ads.length > 0 ? (
          campaign.ads.map((item) => {
            // Use ad-level file_url first, fallback to campaign-level file_url
            const fileUrl = item.file_url || campaign.file_url;
            const mediaType = getMediaType(fileUrl);
            const fileName = getFileName(fileUrl);

            return (
              <div
                key={item.id}
                className="rounded-xl border bg-white p-3 hover:shadow-lg transition-shadow"
              >
                {/* Image/Video */}
                <div className="relative mb-3 w-full overflow-hidden rounded-lg bg-slate-100">
                  {mediaType === "Image" ? (
                    <img
                      src={fileUrl || "https://placehold.co/400x200?text=No+Image"}
                      alt={item.headline || item.ad_name}
                      className="h-40 w-full object-cover"
                      onError={(e) => {
                        // Fallback if image fails to load
                        (e.target as HTMLImageElement).src = "https://placehold.co/400x200?text=Image+Error";
                      }}
                    />
                  ) : (
                    <video
                      src={fileUrl}
                      className="h-40 w-full object-cover"
                      controls={false}
                      muted
                      loop
                      onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
                      onMouseLeave={(e) => {
                        (e.target as HTMLVideoElement).pause();
                        (e.target as HTMLVideoElement).currentTime = 0;
                      }}
                    >
                      <source src={fileUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}

                  {/* Media Type Badge */}
                  <span className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-0.5 text-xs text-white">
                    {mediaType}
                  </span>

                  {/* File name tooltip (optional) */}
                  {fileName && (
                    <span className="absolute right-2 top-2 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white opacity-0 hover:opacity-100 transition-opacity">
                      {fileName}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-slate-900 line-clamp-2">
                    {item.headline || item.ad_name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {item.primary_text || item.description || ""}
                  </p>
                  
                  {/* CTA and Destination URL */}
                  {item.call_to_action && (
                    <div className="mt-2">
                      <span className="inline-block rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">
                        {item.call_to_action}
                      </span>
                    </div>
                  )}
                  
                  {item.destination_url && (
                    <a 
                      href={item.destination_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline truncate block"
                    >
                      {item.destination_url.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                </div>

                {/* Metrics */}
                <div className="mt-4 grid grid-cols-2 gap-y-3 text-sm">
                  <div>
                    <p className="text-xs text-slate-500">
                      Impressions
                    </p>
                    <p className="font-medium text-slate-900">
                      {item.matrics?.impressions?.toLocaleString() ?? "0"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Clicks</p>
                    <p className="font-medium text-slate-900">
                      {item.matrics?.clicks?.toLocaleString() ?? "0"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">CTR</p>
                    <p className="font-medium text-green-600">
                      {item.matrics?.ctr ? `${item.matrics.ctr}%` : "0%"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Conversions
                    </p>
                    <p className="font-medium text-slate-900">
                      {item.matrics?.conversions?.toLocaleString() ?? "0"}
                    </p>
                  </div>
                </div>

                {/* Additional Metrics (optional) */}
                {(item.matrics?.cpc !== undefined || item.matrics?.cpm !== undefined) && (
                  <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                    {item.matrics?.cpc !== undefined && (
                      <div>
                        <p className="text-slate-500">CPC</p>
                        <p className="font-medium text-slate-900">${item.matrics.cpc}</p>
                      </div>
                    )}
                    {item.matrics?.cpm !== undefined && (
                      <div>
                        <p className="text-slate-500">CPM</p>
                        <p className="font-medium text-slate-900">${item.matrics.cpm}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="col-span-full flex justify-center">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-sm p-8 text-center">
              <div className="mb-4 text-slate-400">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="48" 
                  height="48" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="mx-auto"
                >
                  <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                  <line x1="9" y1="2" x2="9" y2="22"></line>
                  <line x1="15" y1="2" x2="15" y2="22"></line>
                  <line x1="2" y1="9" x2="22" y2="9"></line>
                  <line x1="2" y1="15" x2="22" y2="15"></line>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800">No Creatives Found</h3>
              <p className="mt-2 text-sm text-slate-500">
                You haven't uploaded any creatives for this campaign. Create one to get started.
              </p>
              
              {/* Campaign Info */}
              <div className="mt-6 text-xs text-slate-400">
                <p>Campaign: {campaign.name}</p>
                <p>Status: {campaign.status}</p>
                <p>Platforms: {campaign.platforms.join(', ')}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreativePerformance;