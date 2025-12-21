import React, { useState } from "react";
import { Lock } from "lucide-react";
import { Link } from "react-router-dom";

type NewPasswordForm = {
  password: string;
  confirmPassword: string;
};

const NewPassword: React.FC = () => {
  const [form, setForm] = useState<NewPasswordForm>({
    password: "",
    confirmPassword: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // 🔐 API READY PAYLOAD
    const payload = {
      newPassword: form.password,
    };

    console.log("RESET PASSWORD PAYLOAD 👉", payload);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        <div>
          <div className="flex items-center gap-3 mb-6">
            <img
              src="https://res.cloudinary.com/dqkczdjjs/image/upload/v1765309106/Rectangle_ktqcsy.png"
              alt="AdPortal Logo"
              className="h-20"
            />
          </div>

          <h1 className="text-3xl font-semibold text-slate-900 leading-snug">
            The Only Platform You Need <br />
            for Multi-Channel Ads
          </h1>

          <p className="mt-4 max-w-md text-sm text-slate-500 leading-relaxed">
            Create once, publish everywhere. Let AI handle your ad
            campaigns across Meta, Google Ads, and TikTok from one
            unified dashboard.
          </p>
        </div>

     
        <div className="flex justify-center">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-slate-900">
              Set new password
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Your new password must be different from previously used passwords.
            </p>

            {/* NEW PASSWORD */}
            <label className="text-sm font-medium">
              Create New Password
            </label>
            <div className="mt-1 mb-4 flex items-center gap-2 rounded-lg border px-3 py-2">
              <Lock size={16} className="text-slate-400" />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full text-sm outline-none"
                required
              />
            </div>

            {/* CONFIRM PASSWORD */}
            <label className="text-sm font-medium">
              Confirm Password
            </label>
            <div className="mt-1 mb-6 flex items-center gap-2 rounded-lg border px-3 py-2">
              <Lock size={16} className="text-slate-400" />
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full text-sm outline-none"
                required
              />
            </div>

            {/* RESET BUTTON */}
            <button
              type="submit"
              className="mb-4 w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Reset Password
            </button>

            {/* SIGN IN LINK */}
            <p className="text-center text-xs text-slate-500">
              Remember your password?{" "}
              <Link to="/auth/signin" className="text-blue-600">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewPassword;
