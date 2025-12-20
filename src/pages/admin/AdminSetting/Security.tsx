import React, { useState } from "react";

const Security: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className="space-y-6">
      {/* ================= TITLE ================= */}
      <div>
        <h2 className="text-base font-semibold text-slate-900">
          Change Password
        </h2>
      </div>

      {/* ================= FORM ================= */}
      <div className="space-y-4">
        {/* Current Password */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Current Password
          </label>
          <input
            type="password"
            placeholder="Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full rounded-lg bg-slate-50 px-4 py-2 text-sm outline-none"
          />
        </div>

        {/* New Password */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            New Password
          </label>
          <input
            type="password"
            placeholder="Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-lg bg-slate-50 px-4 py-2 text-sm outline-none"
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Confirm New Password
          </label>
          <input
            type="password"
            placeholder="Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-lg bg-slate-50 px-4 py-2 text-sm outline-none"
          />
        </div>
      </div>

      {/* ================= ACTIONS ================= */}
      <div className="flex items-center gap-3">
        <button className="rounded-lg border px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
          Cancel
        </button>

        <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
          Update Password
        </button>
      </div>
    </div>
  );
};

export default Security;
