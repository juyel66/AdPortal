import React from "react";
import type {
  OptimizationItem,
  ImpactLevel,
} from "@/types/aiCampaignOptimization";

/* ===============================
   DATA
================================ */

const optimizations: OptimizationItem[] = [
  {
    id: 1,
    title: "Budget Reallocation Suggestion",
    description:
      "Google Ads is performing 23% better than Meta in terms of ROAS. Consider reallocating $15/day from Meta to Google Ads.",
    impact: "high",
  },
  {
    id: 2,
    title: "New Target Audience Proposal",
    description:
      "Targeting a younger demographic on Instagram has shown a 35% increase in engagement. Recommend allocating an additional $10/day towards this audience.",
    impact: "medium",
  },
  {
    id: 3,
    title: "Creative Content Enhancement",
    description:
      "Video content on social media results in 50% higher shares. Consider investing an extra $20/day for video production.",
    impact: "high",
  },
  {
    id: 4,
    title: "Budget Reallocation Suggestion",
    description:
      "Google Ads is performing 23% better than Meta in terms of ROAS. Consider reallocating $15/day from Meta to Google Ads.",
    impact: "high",
  },
  {
    id: 5,
    title: "Cross-Promotion Strategy",
    description:
      "Collaborating with influencers has led to a 40% boost in brand awareness. Allocate $5/day for influencer partnerships.",
    impact: "medium",
  },
];

/* ===============================
   HELPERS
================================ */

const impactStyles: Record<
  ImpactLevel,
  { badge: string; text: string }
> = {
  high: {
    badge: "bg-green-100 text-green-700 border-green-200",
    text: "High Impact",
  },
  medium: {
    badge: "bg-yellow-100 text-yellow-700 border-yellow-200",
    text: "Medium impact",
  },
};

/* ===============================
   COMPONENT
================================ */

const AICampaignOptimization: React.FC = () => {
  return (
    <div className="rounded-xl border bg-white p-6">
      <h2 className="mb-4 text-sm font-semibold text-slate-900">
        AI Campaign Optimization
      </h2>

      <div className="space-y-4">
        {optimizations.map((item) => {
          const impact = impactStyles[item.impact];

          return (
            <div
              key={item.id}
              className="flex items-start justify-between gap-4 rounded-xl border border-blue-200 bg-white p-4"
            >
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {item.description}
                </p>
              </div>

              <span
                className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${impact.badge}`}
              >
                {impact.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AICampaignOptimization;
