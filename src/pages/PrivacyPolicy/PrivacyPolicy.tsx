import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white text-center py-3 font-semibold text-sm">
          Privacy Policy
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-sm text-gray-700">
          <p className="text-gray-500">Effective Date: Jan 7, 2026</p>

          {/* 1 */}
          <div>
            <span className="inline-block bg-gray-200 text-gray-900 text-sm font-semibold px-4 py-2 rounded-md mb-2">
              Information We Collect
            </span>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>
                <strong>Personal Information:</strong> Name, email address,
                phone number, or other details you provide voluntarily.
              </li>
              <li>
                <strong>Usage Data:</strong> Pages visited, time spent, device
                type, browser type, and interaction data.
              </li>
              <li>
                <strong>Cookies & Tracking:</strong> Used to improve experience
                and analyze usage patterns.
              </li>
            </ul>
          </div>

          {/* 2 */}
          <div>
            <span className="inline-block bg-gray-200 text-gray-900 text-sm font-semibold px-4 py-2 rounded-md mb-2">
              How We Use Your Information
            </span>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Provide and maintain our services</li>
              <li>Improve user experience and performance</li>
              <li>Send updates and important notices</li>
              <li>Ensure security and prevent fraud</li>
            </ul>
          </div>

          {/* 3 */}
          <div>
            <span className="inline-block bg-gray-200 text-gray-900 text-sm font-semibold px-4 py-2 rounded-md mb-2">
              Sharing of Information
            </span>
            <p className="mt-2">
              We do not sell or rent your personal data. Information may be
              shared with trusted service providers or legal authorities when
              required.
            </p>
          </div>

          {/* 4 */}
          <div>
            <span className="inline-block bg-gray-200 text-gray-900 text-sm font-semibold px-4 py-2 rounded-md mb-2">
              Data Security
            </span>
            <p className="mt-2">
              We implement technical and organizational measures to protect your
              data. However, no method of transmission over the internet is
              completely secure.
            </p>
          </div>

          {/* 5 */}
          <div>
            <span className="inline-block bg-gray-200 text-gray-900 text-sm font-semibold px-4 py-2 rounded-md mb-2">
              Your Rights
            </span>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Access your personal data</li>
              <li>Request correction or deletion</li>
              <li>Withdraw consent where applicable</li>
            </ul>
          </div>

          {/* 6 */}
          <div>
            <span className="inline-block bg-gray-200 text-gray-900 text-sm font-semibold px-4 py-2 rounded-md mb-2">
              Cookies Policy
            </span>
            <p className="mt-2">
              Cookies help us understand how users interact with our platform.
              You can disable cookies in your browser settings.
            </p>
          </div>

          {/* 7 */}
          <div>
            <span className="inline-block bg-gray-200 text-gray-900 text-sm font-semibold px-4 py-2 rounded-md mb-2">
              Third-Party Links
            </span>
            <p className="mt-2">
              We are not responsible for the privacy practices of external
              websites linked from our platform.
            </p>
          </div>

          {/* 8 */}
          <div>
            <span className="inline-block bg-gray-200 text-gray-900 text-sm font-semibold px-4 py-2 rounded-md mb-2">
              Changes to This Policy
            </span>
            <p className="mt-2">
              We may update this Privacy Policy from time to time. Any changes
              will be posted on this page.
            </p>
          </div>

          {/* 9 */}
          <div>
            <span className="inline-block bg-gray-200 text-gray-900 text-sm font-semibold px-4 py-2 rounded-md mb-2">
              Contact Us
            </span>
            <p className="mt-2">
              Email: <span className="font-medium text-blue-600">
                support@adportal.com
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
