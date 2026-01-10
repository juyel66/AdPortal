import React from "react";
import {
  CheckCircle,
  AlertTriangle,

} from "lucide-react";

const Step6Review: React.FC = () => {
  return (
    <div className=" p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-gray-900">Create Your Ad</h1>
        <p className="text-sm text-gray-500">
          Upload creative assets and write compelling ad copy
        </p>
      </div>

      {/* Card Wrapper */}
      <div className="space-y-4">
        {/* Platforms */}
        <div className="bg-white rounded-xl border p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Platforms
          </h3>
          <div className="flex gap-2">
            <span className="px-3 py-1 text-xs rounded-full border border-blue-500 text-blue-600">
              Google
            </span>
            <span className="px-3 py-1 text-xs rounded-full border border-blue-500 text-blue-600">
              TikTok
            </span>
          </div>
        </div>

        {/* Objective */}
        <div className="bg-white rounded-xl border p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            Objective
          </h3>
          <p className="text-sm text-gray-600">Conversions</p>
        </div>

        {/* Target Audience */}
        <div className="bg-white rounded-xl border p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Target Audience
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600">
            <p>Age: 18–65</p>
            <p>Gender: All</p>
            <p>Locations: United States</p>
          </div>
        </div>

        {/* Budget & Schedule */}
        <div className="bg-white rounded-xl border p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Budget & Schedule
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600">
            <p>Daily Budget: $100</p>
            <p>Start Date: 2025-11-29</p>
            <p className="text-green-600">✓ Running continuously</p>
          </div>
        </div>

        {/* Ad Creative */}
        <div className="bg-white rounded-xl border p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Ad Creative
          </h3>
          <div className="space-y-1 text-sm text-gray-600">
            <p>Ad Name: Continue</p>
            <p>Format: Image</p>
            <p>Headline: Transform Your Business Today</p>
            <p>
              Primary Text: Discover innovative solutions that drive real
              results. Join thousands of successful businesses already growing
              with our platform.
            </p>
            <p>CTA: Learn more</p>
          </div>
        </div>

        {/* Pre-launch Checks */}
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <h3 className="text-sm font-semibold text-green-800 mb-3">
            Pre-launch Checks
          </h3>
          <ul className="space-y-2 text-sm text-green-700">
            <li className="flex items-center gap-2">
              <CheckCircle size={16} /> All required fields completed
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle size={16} /> Ad accounts connected and verified
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle size={16} /> Budget allocation confirmed
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle size={16} /> Creative assets meet platform
              requirements
            </li>
          </ul>
        </div>

        {/* Before Publishing */}
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
          <div className="flex gap-3">
            <AlertTriangle className="text-yellow-600 mt-0.5" size={18} />
            <p className="text-sm text-yellow-800">
              <span className="font-medium">Before Publishing:</span> Once
              published, your campaign will go through platform review
              (usually 24 hours) before going live. You can still edit or
              pause your campaign after publishing.
            </p>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-between pt-4">
         

        
        </div>
      </div>
    </div>
  );
};

export default Step6Review;
