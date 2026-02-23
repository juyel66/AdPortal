// import React from "react";

// interface CreativeItem {
//   id: number;
//   type: "Image" | "Video";
//   image: string;
//   title: string;
//   subtitle: string;
//   impressions: string;
//   clicks: string;
//   ctr: string;
//   conversions: number;
// }

// const creatives: CreativeItem[] = [
//   {
//     id: 1,
//     type: "Image",
//     image:
//       "https://res.cloudinary.com/dqkczdjjs/image/upload/v1765757517/Image_Dont_Miss_Out_-_Shop_Now_voceln.png",
//     title: "Summer Sale - Up to 50% OFF",
//     subtitle: "Limited time offer on all items",
//     impressions: "89K",
//     clicks: "3.2K",
//     ctr: "3.6%",
//     conversions: 52,
//   },
//   {
//     id: 2,
//     type: "Video",
//     image:
//       "https://res.cloudinary.com/dqkczdjjs/image/upload/v1767740837/Image_Your_Perfect_Summer_Starts_Here_r3mm4f.png",
//     title: "Summer Sale - Up to 50% OFF",
//     subtitle: "Limited time offer on all items",
//     impressions: "89K",
//     clicks: "3.2K",
//     ctr: "3.6%",
//     conversions: 52,
//   },
//   {
//     id: 3,
//     type: "Image",
//     image:
//       "https://res.cloudinary.com/dqkczdjjs/image/upload/v1765757517/Image_Dont_Miss_Out_-_Shop_Now_voceln.png",
//     title: "Summer Sale - Up to 50% OFF",
//     subtitle: "Limited time offer on all items",
//     impressions: "89K",
//     clicks: "3.2K",
//     ctr: "3.6%",
//     conversions: 52,
//   },
// ];

// const CreativePerformance: React.FC = () => {
//   return (
//     <div className="rounded-xl border bg-white p-6">
//       {/* Header */}
//       <h2 className="mb-4 text-sm font-semibold text-slate-900">
//         Creative Performance
//       </h2>

//       {/* Cards */}
//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//         {creatives.map((item) => (
//           <div
//             key={item.id}
//             className="rounded-xl border bg-white p-3"
//           >
//             {/* Image */}
//             <div className="relative mb-3  w-full overflow-hidden rounded-lg">
//               <img
//                 src={item.image}
//                 alt={item.title}
//                 className="h-full w-full object-cover"
//               />

//               <span className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-0.5 text-xs text-white">
//                 {item.type}
//               </span>
//             </div>

//             {/* Content */}
//             <div className="space-y-1">
//               <h3 className="text-sm font-semibold text-slate-900">
//                 {item.title}
//               </h3>
//               <p className="text-xs text-slate-500">
//                 {item.subtitle}
//               </p>
//             </div>

//             {/* Metrics */}
//             <div className="mt-4 grid grid-cols-2 gap-y-3 text-sm">
//               <div>
//                 <p className="text-xs text-slate-500">
//                   Impressions
//                 </p>
//                 <p className="font-medium text-slate-900">
//                   {item.impressions}
//                 </p>
//               </div>

//               <div>
//                 <p className="text-xs text-slate-500">Clicks</p>
//                 <p className="font-medium text-slate-900">
//                   {item.clicks}
//                 </p>
//               </div>

//               <div>
//                 <p className="text-xs text-slate-500">CTR</p>
//                 <p className="font-medium text-green-600">
//                   {item.ctr}
//                 </p>
//               </div>

//               <div>
//                 <p className="text-xs text-slate-500">
//                   Conversions
//                 </p>
//                 <p className="font-medium text-slate-900">
//                   {item.conversions}
//                 </p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CreativePerformance;














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
  name: string;
  status: string;
  matrics: AdMatrics;
  // Optionally add image, type, title, subtitle if available in your backend
  image?: string;
  type?: "Image" | "Video";
  title?: string;
  subtitle?: string;
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
};

type CreativePerformanceProps = {
  campaign: Campaign;
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
          campaign.ads.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border bg-white p-3"
            >
              {/* Image */}
              <div className="relative mb-3  w-full overflow-hidden rounded-lg">
                <img
                  src={item.image || "https://placehold.co/400x200?text=No+Image"}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />

                <span className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-0.5 text-xs text-white">
                  {item.type || "Image"}
                </span>
              </div>

              {/* Content */}
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-slate-900">
                  {item.title || item.name}
                </h3>
                <p className="text-xs text-slate-500">
                  {item.subtitle || ""}
                </p>
              </div>

              {/* Metrics */}
              <div className="mt-4 grid grid-cols-2 gap-y-3 text-sm">
                <div>
                  <p className="text-xs text-slate-500">
                    Impressions
                  </p>
                  <p className="font-medium text-slate-900">
                    {item.matrics?.impressions ?? "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Clicks</p>
                  <p className="font-medium text-slate-900">
                    {item.matrics?.clicks ?? "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">CTR</p>
                  <p className="font-medium text-green-600">
                    {item.matrics?.ctr ?? "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Conversions
                  </p>
                  <p className="font-medium text-slate-900">
                    {item.matrics?.conversions ?? "N/A"}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-slate-500">No creatives found.</div>
        )}
      </div>
    </div>
  );
};

export default CreativePerformance;
