import React from "react";

const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white text-center py-3 font-semibold text-sm">
          About Us
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-sm text-gray-700">
          {/* Who We Are */}
          <div>
            <span className="inline-block bg-gray-200 text-gray-900 text-sm font-semibold px-4 py-2 rounded-md mb-2">
              Who We Are
            </span>
            <p className="mt-2">
              AdPortal is a modern SaaS platform designed to simplify
              multi-platform digital advertising. We enable businesses and
              agencies to create, manage, and optimize ad campaigns across Meta,
              Google, and TikTok from one unified dashboard.
            </p>
          </div>

          {/* Our Mission */}
          <div>
            <span className="inline-block bg-gray-200 text-gray-900 text-sm font-semibold px-4 py-2 rounded-md mb-2">
              Our Mission
            </span>
            <p className="mt-2">
              Our mission is to remove complexity from digital advertising by
              centralizing campaign creation, performance tracking, and
              optimization into a single, easy-to-use platform.
            </p>
          </div>

          {/* What We Do */}
          <div>
            <span className="inline-block bg-gray-200 text-gray-900 text-sm font-semibold px-4 py-2 rounded-md mb-2">
              What We Do
            </span>
            <p className="mt-2">
              AdPortal allows users to build campaigns once, publish them across
              multiple ad platforms, and analyze results through unified
              analytics and AI-powered insights—saving time and improving
              performance.
            </p>
          </div>

          {/* Why AdPortal */}
          <div>
            <span className="inline-block bg-gray-200 text-gray-900 text-sm font-semibold px-4 py-2 rounded-md mb-2">
              Why AdPortal
            </span>
            <p className="mt-2">
              We focus on simplicity, scalability, and real business impact,
              making advanced advertising tools accessible for growing
              businesses, agencies, and marketers.
            </p>
          </div>

          {/* Contact */}
          <div>
            <span className="inline-block bg-gray-200 text-gray-900 text-sm font-semibold px-4 py-2 rounded-md mb-2">
              Contact Us
            </span>
            <p className="mt-2">
              If you have any questions, please contact us at:
              <br />
              <span className="font-medium text-blue-600">
                support@example.com
              </span>
              <br />
              Address: [Company Address]
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
