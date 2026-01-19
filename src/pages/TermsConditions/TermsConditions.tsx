import React from "react";

const TermsConditions: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white text-center py-3 font-semibold text-sm">
          Terms & Conditions
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-sm text-gray-700">
          <p className="text-gray-500">Effective Date: Jan 7, 2026</p>

          {/* 1 */}
          <div>
            <span className="inline-block bg-gray-200 text-gray-900 text-sm font-semibold px-4 py-2 rounded-md mb-2">
              Acceptance of Terms
            </span>
            <p className="mt-2">
              By accessing or using AdPortal, you agree to be bound by these Terms
              & Conditions. If you do not agree, please do not use the platform.
            </p>
          </div>

          {/* 2 */}
          <div>
            <span className="inline-block bg-gray-200 text-gray-900 text-sm font-semibold px-4 py-2 rounded-md mb-2">
              Description of Service
            </span>
            <p className="mt-2">
              AdPortal is a SaaS platform that allows users to create, manage, and
              analyze advertising campaigns across multiple platforms, including
              Meta, Google Ads, and TikTok. AdPortal does not pay for ads on behalf
              of users; all ad spend is billed directly by the respective ad
              platforms.
            </p>
          </div>

          {/* 3 */}
          <div>
            <span className="inline-block bg-gray-200 text-gray-900 text-sm font-semibold px-4 py-2 rounded-md mb-2">
              User Accounts
            </span>
            <p className="mt-2">
              You are responsible for maintaining the confidentiality of your
              account credentials and for all activities that occur under your
              account. You must provide accurate and up-to-date information when
              creating an account.
            </p>
          </div>

          {/* 4 */}
          <div>
            <span className="inline-block bg-gray-200 text-gray-900 text-sm font-semibold px-4 py-2 rounded-md mb-2">
              Subscription & Payments
            </span>
            <p className="mt-2">
              Access to certain features requires a paid subscription. All
              subscription fees are billed on a recurring basis according to the
              selected plan. Payments are non-refundable unless otherwise
              stated.
            </p>
          </div>

          {/* 5 */}
          <div>
            <span className="inline-block bg-gray-200 text-gray-900 text-sm font-semibold px-4 py-2 rounded-md mb-2">
              Third-Party Integrations
            </span>
            <p className="mt-2">
              AdPortal integrates with third-party services such as Meta, Google,
              and TikTok. We are not responsible for changes, downtime, or
              limitations caused by these external platforms.
            </p>
          </div>

          {/* 6 */}
          <div>
            <span className="inline-block bg-gray-200 text-gray-900 text-sm font-semibold px-4 py-2 rounded-md mb-2">
              User Responsibilities
            </span>
            <p className="mt-2">
              You agree not to use AdPortal for any unlawful activities, policy
              violations, or abusive behavior. You are solely responsible for
              the content, ads, and data you upload or manage through the
              platform.
            </p>
          </div>

          {/* 7 */}
          <div>
            <span className="inline-block bg-gray-200 text-gray-900 text-sm font-semibold px-4 py-2 rounded-md mb-2">
              Intellectual Property
            </span>
            <p className="mt-2">
              All platform content, design, and software are the property of
              AdPortal. Users retain ownership of their own campaign data and
              creative assets.
            </p>
          </div>

          {/* 8 */}
          <div>
            <span className="inline-block bg-gray-200 text-gray-900 text-sm font-semibold px-4 py-2 rounded-md mb-2">
              Data & Privacy
            </span>
            <p className="mt-2">
              User data is handled in accordance with our Privacy Policy.
              AdPortal does not sell user data to third parties.
            </p>
          </div>

          {/* 9 */}
          <div>
            <span className="inline-block bg-gray-200 text-gray-900 text-sm font-semibold px-4 py-2 rounded-md mb-2">
              Governing Law
            </span>
            <p className="mt-2">
              These Terms & Conditions are governed by and interpreted in
              accordance with applicable laws.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
