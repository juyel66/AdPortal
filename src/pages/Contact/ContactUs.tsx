import React, { useState } from "react";

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Temporary action (backend will be connected later)
    console.log("Contact form submitted:", formData);

    alert("Thank you for contacting AdPortal. We’ll get back to you shortly.");

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
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
            {/* Name */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email address"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="What is this about?"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Write your message here..."
                className="w-full px-3 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Submit */}
            <div className="text-right">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition"
              >
                Send Message
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
