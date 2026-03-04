import api from "@/lib/axios";
import React, { useState } from "react";
import { toast } from "sonner";


const Security: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!currentPassword) {
      toast.error("Current password is required", {
        duration: 3000,
        position: "top-center",
      });
      return false;
    }

    if (!newPassword) {
      toast.error("New password is required", {
        duration: 3000,
        position: "top-center",
      });
      return false;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long", {
        duration: 3000,
        position: "top-center",
      });
      return false;
    }

    if (!confirmPassword) {
      toast.error("Please confirm your new password", {
        duration: 3000,
        position: "top-center",
      });
      return false;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match", {
        duration: 3000,
        position: "top-center",
      });
      return false;
    }

    if (currentPassword === newPassword) {
      toast.error("New password must be different from current password", {
        duration: 3000,
        position: "top-center",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/accounts/change-password/", {
        old_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      if (response.status === 200) {
        toast.success("Password changed successfully!", {
          duration: 4000,
          position: "top-center",
        });

        // Reset form
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error: any) {
      console.error("Password change error:", error);

      // Handle different error responses
      if (error.response?.data) {
        const errorData = error.response.data;

        // Handle field-specific errors
        if (errorData.old_password) {
          toast.error(errorData.old_password[0] || "Current password is incorrect", {
            duration: 4000,
            position: "top-center",
          });
        } else if (errorData.new_password) {
          toast.error(errorData.new_password[0] || "Invalid new password", {
            duration: 4000,
            position: "top-center",
          });
        } else if (errorData.confirm_password) {
          toast.error(errorData.confirm_password[0] || "Password confirmation failed", {
            duration: 4000,
            position: "top-center",
          });
        } else if (errorData.non_field_errors) {
          toast.error(errorData.non_field_errors[0] || "Failed to change password", {
            duration: 4000,
            position: "top-center",
          });
        } else if (errorData.detail) {
          toast.error(errorData.detail, {
            duration: 4000,
            position: "top-center",
          });
        } else {
          toast.error("Failed to change password. Please try again.", {
            duration: 4000,
            position: "top-center",
          });
        }
      } else if (error.message === "Network Error") {
        toast.error("Network error. Please check your connection.", {
          duration: 4000,
          position: "top-center",
        });
      } else {
        toast.error("An unexpected error occurred. Please try again.", {
          duration: 4000,
          position: "top-center",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      <div>
        <h2 className="text-base font-semibold text-slate-900">
          Change Password
        </h2>
      </div>

      <div className="space-y-4">
        {/* Current Password */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Current Password
          </label>
          <input
            type="password"
            placeholder="Enter current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            disabled={loading}
            className="w-full rounded-lg bg-slate-50 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
        </div>

        {/* New Password */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            New Password
          </label>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={loading}
            className="w-full rounded-lg bg-slate-50 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <p className="mt-1 text-xs text-slate-500">Must be at least 6 characters long</p>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Confirm New Password
          </label>
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            className="w-full rounded-lg bg-slate-50 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleCancel}
          disabled={loading}
          className="rounded-lg border px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>

      {/* Password Requirements Info */}
      <div className="border-t border-slate-200 pt-4">
        <h3 className="text-sm font-medium text-slate-900 mb-2">Password Requirements</h3>
        <ul className="text-sm text-slate-500 space-y-1 list-disc list-inside">
          <li>At least 6 characters long</li>
          <li>Should be different from your current password</li>
          <li>Use a mix of letters, numbers, and symbols for better security</li>
        </ul>
      </div>
    </form>
  );
};

export default Security;