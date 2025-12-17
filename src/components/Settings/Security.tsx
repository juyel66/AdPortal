import React, { useState } from "react";
import { Trash2 } from "lucide-react";

import type { PasswordForm } from "../../types/security";
import Swal from "sweetalert2";



const Security: React.FC = () => {
  const [form, setForm] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdatePassword = () => {
  
    console.log("Update password", form);
  };

  const handleDeleteAccount = () => {

    Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed) {
    Swal.fire({
      title: "Deleted!",
      text: "Your file has been deleted.",
      icon: "success"
    });
  }
});


  };

  return (
    <div className="rounded-xl  bg-white p-6 space-y-6">
   
      <div>
        <h2 className="text-base font-semibold text-slate-900 mb-4">
          Change Password
        </h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-600">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              placeholder="Password"
              value={form.currentPassword}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm text-slate-600">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              placeholder="Password"
              value={form.newPassword}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm text-slate-600">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button className="rounded-lg border px-4 py-2 text-sm">
            Cancel
          </button>
          <button
            onClick={handleUpdatePassword}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Update Password
          </button>
        </div>
      </div>

      <div className="border-t pt-6" />

      <div>
        <p className="text-sm font-medium text-red-600 mb-3">
          Danger Zone
        </p>

        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <h3 className="text-sm font-semibold text-slate-900">
            Delete Account
          </h3>
          <p className="mt-1 text-xs text-slate-600">
            Once you delete your account, there is no going back.
            Please be certain.
          </p>

          <button
            onClick={handleDeleteAccount}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            <Trash2 size={14} />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Security;
