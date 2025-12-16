// AiTools.tsx
// Full AI Tools Page (AI Copy Generator + AI Optimization)

import React, { useState } from "react";
import { Sparkles, Wand2, RefreshCcw, Copy } from "lucide-react";

/* =========================
   Types
========================= */

type CopyType = "headlines" | "primary" | "descriptions" | "ctas";

type GeneratedItem = {
  id: number;
  text: string;
};

type OptimizationImpact = "High Impact" | "Medium Impact";

type OptimizationItem = {
  title: string;
  description: string;
  impact: OptimizationImpact;
};

/* =========================
   Fake Data
========================= */

const GENERATED_COPY: GeneratedItem[] = [
  {
    id: 1,
    text: "Transform Your Business Today – Discover innovative solutions that drive real results. Limited time offer!",
  },
  {
    id: 2,
    text: "Elevate Your Brand – Unleash the power of cutting-edge design and marketing strategies. Join us now!",
  },
  {
    id: 3,
    text: "Boost Your Sales – Explore our comprehensive training programs tailored for success. Enroll today!",
  },
  {
    id: 4,
    text: "Connect with Experts – Network with industry leaders and gain valuable insights. Reserve your spot!",
  },
];

const OPTIMIZATION_DATA: OptimizationItem[] = [
  {
    title: "Budget Reallocation Suggestion",
    description:
      "Google Ads is performing 23% better than Meta in terms of ROAS. Consider reallocating $15/day from Meta to Google Ads.",
    impact: "High Impact",
  },
  {
    title: "New Target Audience Proposal",
    description:
      "Targeting a younger demographic on Instagram has shown a 35% increase in engagement. Recommend allocating an additional $10/day.",
    impact: "Medium Impact",
  },
  {
    title: "Creative Content Enhancement",
    description:
      "Video content on social media results in 50% higher shares. Consider investing an extra $20/day for video production.",
    impact: "High Impact",
  },
  {
    title: "Cross-Promotion Strategy",
    description:
      "Collaborating with influencers has led to a 40% boost in brand awareness. Allocate $5/day for influencer partnerships.",
    impact: "Medium Impact",
  },
];

/* =========================
   Component
========================= */

const AiTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"copy" | "optimization">("copy");
  const [generated, setGenerated] = useState(false);
  const [copyType, setCopyType] = useState<CopyType>("headlines");

  // ✅ Controlled form states
  const [product, setProduct] = useState("AdPortal");
  const [audience, setAudience] = useState("Ecommerce Businessman");
  const [benefits, setBenefits] = useState(
    "Ad run with AI for Google, Meta and Tiktok"
  );
  const [tone, setTone] = useState("Professional");

  return (
    <div className="space-y-6 mt-5 ml-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">AI Tools</h1>
          <p className="text-sm text-slate-500">
            Generate compelling ad copy and optimize your campaigns with AI
          </p>
        </div>

        {/* <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          <span className="text-lg">+</span> Add Campaign
        </button> */}
      </div>

      {/* Tabs */}
      <div className="flex rounded-xl bg-white p-2 border">
        <button
          onClick={() => setActiveTab("copy")}
          className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${
            activeTab === "copy"
              ? "bg-blue-50 text-blue-600"
              : "text-slate-500"
          }`}
        >
          <Wand2 size={16} /> AI Copy Generator
        </button>
        <button
          onClick={() => setActiveTab("optimization")}
          className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${
            activeTab === "optimization"
              ? "bg-blue-50 text-blue-600"
              : "text-slate-500"
          }`}
        >
          <Sparkles size={16} /> AI Optimization
        </button>
      </div>

      {/* AI Copy Generator */}
      {activeTab === "copy" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <div className="rounded-xl border bg-white p-6 space-y-4">
            <h2 className="font-semibold text-slate-900">Generate Ad Copy</h2>

            <input
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="Product / Service"
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />

            <input
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="Target Audience"
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />

            <textarea
              value={benefits}
              onChange={(e) => setBenefits(e.target.value)}
              placeholder="Key Benefits"
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />

            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            >
              <option>Professional</option>
              <option>Casual</option>
              <option>Friendly</option>
            </select>

            {/* Copy Type (DESIGN UNCHANGED) */}
            <div className="flex gap-2 flex-wrap">
              {["headlines", "primary", "descriptions", "ctas"].map((t) => (
                <button
                  key={t}
                  onClick={() => setCopyType(t as CopyType)}
                  className={`rounded-lg px-3 py-1.5 text-xs border ${
                    copyType === t
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <button
              onClick={() => setGenerated(true)}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Sparkles size={16} /> Generate Copy
            </button>
          </div>

          {/* Generated Copy */}
          <div className="rounded-xl border bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-900">Generated Copy</h2>
              {generated && (
                <button className="flex items-center gap-1 text-sm text-blue-600">
                  <RefreshCcw size={14} /> Regenerate
                </button>
              )}
            </div>

            {!generated ? (
              <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                <img src="https://res.cloudinary.com/dqkczdjjs/image/upload/v1765832904/Icon_13_tqqkug.png" alt="" />
                <p className="text-sm mt-2 text-center">
                  Fill in the form and click "Generate Copy" to see AI-generated
                  suggestions
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {GENERATED_COPY.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border bg-blue-50 p-3"
                  >
                    <p className="text-sm text-slate-700">{item.text}</p>
                    <button className="mt-2 flex items-center gap-1 text-xs text-blue-600">
                      <Copy size={12} /> Copy to clipboard
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Optimization */}
      {activeTab === "optimization" && (
        <div className="rounded-xl border bg-white p-6 space-y-4">
          <h2 className="font-semibold text-slate-900">
            AI Campaign Optimization
          </h2>

          {OPTIMIZATION_DATA.map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl border p-4 flex items-start justify-between"
            >
              <div>
                <h3 className="font-medium text-slate-900">{item.title}</h3>
                <p className="text-sm text-slate-600 mt-1">
                  {item.description}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full h-fit ${
                  item.impact === "High Impact"
                    ? "bg-green-100 border border-green-500 text-green-700"
                    : "bg-yellow-100 border border-yellow-500 text-yellow-700"
                }`}
              >
                {item.impact}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AiTools;
