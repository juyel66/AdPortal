import React, { useState } from "react";
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";


const ForgetPassword: React.FC = () => {
  // const [role, setRole] = useState<"user" | "admin">("user");
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
            The Only Platform You Need for Multi-Channel Ads
          </h1>

          <p className="mt-4 max-w-md text-sm text-slate-500 leading-relaxed">
            Create once, publish everywhere. Let AI handle your ad campaigns
            across Meta, Google Ads, and TikTok from one unified dashboard.
          </p>
        </div>

        <div className="flex justify-center">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-slate-900">
              Forgot Password?
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Don't worry! It happens. Please enter the email address associated
              with your account.
            </p>

            {/* EMAIL */}
            <label className="text-sm font-medium">Email Address</label>
            <div className="mt-1 mb-4 flex items-center gap-2 rounded-lg border px-3 py-2">
              <Mail size={16} className="text-slate-400" />
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full text-sm outline-none"
              />
            </div>

            {/* SIGN IN */}
            <Link
              to="/auth/check-email"
              type="submit"
              className="mb-4 w-full flex items-center justify-center rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 "
            >
              Send OTP
            </Link>

            <p className="text-center text-xs text-slate-500">
              remember your password?{" "}
              <Link to="/auth/signup" className="text-blue-600">
                SignUp
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
