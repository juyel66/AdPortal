import api from "@/lib/axios";
import React, { useState } from "react";

import { toast } from "sonner";

// TypeScript interface for the contact form data
interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// TypeScript interface for the API response
interface ContactResponse {
  message: string;
  status?: string;
  // Add other response fields as per your API response
}

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (submitError) setSubmitError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setSubmitError("Name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setSubmitError("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitError("Please enter a valid email address");
      return false;
    }
    if (!formData.subject.trim()) {
      setSubmitError("Subject is required");
      return false;
    }
    if (!formData.message.trim()) {
      setSubmitError("Message is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Make API call to contact-us endpoint
      const response = await api.post<ContactResponse>(
        "/accounts/contact-us/",
        formData
      );

      // Handle successful submission
      console.log("Contact form submitted successfully:", response.data);
      
      toast.success("Thank you for contacting AdPortal. We'll get back to you shortly.", {
        duration: 5000,
        position: "top-center",
      });

      // Reset form after successful submission
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

    } catch (error: any) {
      // Handle API errors
      console.error("Error submitting contact form:", error);
      
      let errorMessage = "Failed to send message. Please try again.";
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 400) {
          // Handle validation errors from backend
          const errorData = error.response.data;
          if (errorData.name) {
            errorMessage = `Name: ${errorData.name[0]}`;
          } else if (errorData.email) {
            errorMessage = `Email: ${errorData.email[0]}`;
          } else if (errorData.subject) {
            errorMessage = `Subject: ${errorData.subject[0]}`;
          } else if (errorData.message) {
            errorMessage = `Message: ${errorData.message[0]}`;
          } else {
            errorMessage = errorData.message || errorMessage;
          }
        } else if (error.response.status === 429) {
          errorMessage = "Too many requests. Please try again later.";
        } else if (error.response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = "Network error. Please check your connection.";
      }
      
      setSubmitError(errorMessage);
      
      toast.error(errorMessage, {
        duration: 5000,
        position: "top-center",
      });
      
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white text-center py-3 font-semibold text-sm">
          Contact Us
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-sm text-gray-700">
          {/* Intro */}
          <div>
            <span className="inline-block bg-gray-200 text-gray-900 text-sm font-semibold px-4 py-2 rounded-md mb-2">
              Get in Touch
            </span>
            <p className="mt-2">
              Have a question, need support, or want to learn more about
              AdPortal? Fill out the form below and our team will respond as
              soon as possible.
            </p>
          </div>

          {/* Contact Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-gray-50 p-5 rounded-lg border"
          >
            {/* Error Message */}
            {submitError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {submitError}
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                placeholder="Enter your full name"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                placeholder="Enter your email address"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                placeholder="What is this about?"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                rows={5}
                placeholder="Write your message here..."
                className="w-full px-3 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Submit */}
            <div className="text-right">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 ml-auto"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </div>
          </form>

          {/* Alternative Contact */}
          <div>
            <span className="inline-block bg-gray-200 text-gray-900 text-sm font-semibold px-4 py-2 rounded-md mb-2">
              Other Ways to Contact
            </span>
            <p className="mt-2">
              Email:{" "}
              <span className="font-medium text-blue-600">
                support@adportal.com
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;