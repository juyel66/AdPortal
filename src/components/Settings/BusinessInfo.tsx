// src/components/Settings/BusinessInfo.tsx

import React, { useState } from "react";

const BusinessInfo: React.FC = () => {
  const [form, setForm] = useState({
    companyName: "",
    website: "",
    industry: "",
    companySize: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="rounded-xl  bg-white p-6">

      <h2 className="text-base font-semibold text-slate-900 mb-6">
        Business Information
      </h2>

      {/* Form */}
      <div className="space-y-5">
   
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Company Name
          </label>
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={form.companyName}
            onChange={handleChange}
            className="w-full rounded-lg bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

    
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Website
          </label>
          <input
            type="url"
            name="website"
            placeholder="https://yourcompany.com"
            value={form.website}
            onChange={handleChange}
            className="w-full rounded-lg bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

       
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Industry
          </label>
          <select
            name="industry"
            value={form.industry}
            onChange={handleChange}
            className="w-full rounded-lg bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              Select industry
            </option>
            <option value="ecommerce">E-Commerce</option>
            <option value="saas">SaaS</option>
            <option value="agency">Agency</option>
            <option value="education">Education</option>
            <option value="finance">Finance</option>
          </select>
        </div>


        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Company Size
          </label>
          <select
            name="companySize"
            value={form.companySize}
            onChange={handleChange}
            className="w-full rounded-lg bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              Select company size
            </option>
            <option value="1-10">1–10 employees</option>
            <option value="11-50">11–50 employees</option>
            <option value="51-200">51–200 employees</option>
            <option value="201-500">201–500 employees</option>
            <option value="500+">500+ employees</option>
          </select>
        </div>
      </div>

      {/* Divider */}
      <div className="my-6 border-t" />

   
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-lg border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
        >
          Cancel
        </button>

        <button
          type="button"
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default BusinessInfo;
