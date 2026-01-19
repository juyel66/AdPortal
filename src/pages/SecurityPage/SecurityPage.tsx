import React from "react";

const SecurityPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-md overflow-hidden">
        {/* Page Header */}
        <div className="bg-blue-600 text-white text-center py-3 font-semibold text-sm">
          Security
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-sm text-gray-700">
          {/* Commitment */}
          <div>
            <span className="inline-block bg-gray-200 text-gray-900 text-sm font-semibold px-4 py-2 rounded-md mb-2">
              Our Commitment to Security
            </span>
            <p className="mt-2">
              At AdPortal, security is a top priority. We are committed to
              protecting your data, campaigns, and business information through
              industry-standard security practices and continuous monitoring.
            </p>
          </div>

          {/* Data Protection */}
          <div>
            <span className="inline-block bg-gray-200 text-gray-900 text-sm font-semibold px-4 py-2 rounded-md mb-2">
              Data Protection
            </span>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>All data is encrypted in transit using secure HTTPS (TLS).</li>
              <li>
                Sensitive information such as authentication credentials is
                securely stored and protected.
              </li>
              <li>
                User data is never sold or shared with unauthorized third
                parties.
              </li>
            </ul>
          </div>

          {/* Authentication */}
          <div>
            <span className="inline-block bg-gray-200 text-gray-900 text-sm font-semibold px-4 py-2 rounded-md mb-2">
              Authentication & Access Control
            </span>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Secure login with email and password.</li>
              <li>
                Optional two-factor authentication (2FA) for enhanced account
                protection.
              </li>
              <li>Role-based access control for teams and admins.</li>
              <li>
                Automatic session expiration to prevent unauthorized access.
              </li>
            </ul>
          </div>

          {/* Payment Security */}
          <div>
            <span className="inline-block bg-gray-200 text-gray-900 text-sm font-semibold px-4 py-2 rounded-md mb-2">
              Payment Security
            </span>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>
                All payments are processed through trusted third-party providers
                (e.g., Stripe).
              </li>
              <li>
                AdPortal does not store raw credit or debit card information.
              </li>
              <li>
                Payment data is handled in compliance with industry security
                standards.
              </li>
            </ul>
          </div>

          {/* Platform Security */}
          <div>
            <span className="inline-block bg-gray-200 text-gray-900 text-sm font-semibold px-4 py-2 rounded-md mb-2">
              Platform & Infrastructure Security
            </span>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Continuous monitoring for suspicious activity.</li>
              <li>Regular security updates and vulnerability fixes.</li>
              <li>
                Protection against common threats such as unauthorized access
                and abuse.
              </li>
            </ul>
          </div>

          {/* Third Party */}
          <div>
            <span className="inline-block bg-gray-200 text-gray-900 text-sm font-semibold px-4 py-2 rounded-md mb-2">
              Third-Party Integrations
            </span>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>
                AdPortal connects to external platforms like Meta, Google, and
                TikTok using secure OAuth authentication.
              </li>
              <li>We do not store third-party account passwords.</li>
              <li>Access can be revoked by users at any time.</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <span className="inline-block bg-gray-200 text-gray-900 text-sm font-semibold px-4 py-2 rounded-md mb-2">
              Contact
            </span>
            <p className="mt-2">
              If you discover a potential security vulnerability or have
              security-related questions, please contact us at{" "}
              <span className="font-medium text-blue-600">
                security@adportal.com
              </span>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityPage;
