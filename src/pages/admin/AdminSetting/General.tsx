import React, { useState } from "react";
import { Upload } from "lucide-react";

const General: React.FC = () => {
  const [platformName, setPlatformName] = useState("AdPortal");
  const [supportEmail, setSupportEmail] =
    useState("support@adportal.com");

  return (
    <div className="space-y-6">

      <div>
        <h2 className="text-base font-semibold text-slate-900">
          General Settings
        </h2>
      </div>

      <div className="space-y-4">
       
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Platform Name
          </label>
          <input
            type="text"
            value={platformName}
            onChange={(e) => setPlatformName(e.target.value)}
            className="w-full rounded-lg bg-slate-50 px-4 py-2 text-sm text-slate-700 outline-none"
          />
        </div>

       
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Support Email
          </label>
          <input
            type="email"
            value={supportEmail}
            onChange={(e) => setSupportEmail(e.target.value)}
            className="w-full rounded-lg bg-slate-50 px-4 py-2 text-sm text-slate-700 outline-none"
          />
        </div>

      
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Upload Logo
          </label>

          <label className="flex h-28 cursor-pointer flex-col items-center justify-center rounded-lg bg-slate-50 text-sm text-slate-500 hover:bg-slate-100 transition">
            <Upload size={18} className="mb-1" />
            <span>Upload File</span>
            <input type="file" className="hidden" />
          </label>
        </div>
      </div>

      {/* ================= ACTIONS ================= */}
      <div className="flex items-center gap-3 border-t pt-4">
        <button className="rounded-lg border px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
          Cancel
        </button>

        <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default General;
