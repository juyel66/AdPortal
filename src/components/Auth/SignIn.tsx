import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";

const SignIn: React.FC = () => {
  const [role, setRole] = useState<"user" | "admin">("user");

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* ================= LEFT SIDE ================= */}
      <div className="hidden lg:flex flex-col justify-center px-20">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <img
            src="https://res.cloudinary.com/dqkczdjjs/image/upload/v1765309106/Rectangle_ktqcsy.png"
            alt="AdPortal Logo"
            className="h-10"
          />
        </div>

        {/* Headline */}
        <h1 className="text-3xl font-semibold text-slate-900 leading-snug">
          The Only Platform You Need <br />
          for Multi-Channel Ads
        </h1>

        {/* Description */}
        <p className="mt-4 max-w-md text-sm text-slate-500 leading-relaxed">
          Create once, publish everywhere. Let AI handle your ad campaigns
          across Meta, Google Ads, and TikTok from one unified dashboard.
        </p>
      </div>

      {/* ================= RIGHT SIDE ================= */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm">
          {/* Title */}
          <h2 className="text-xl font-semibold text-slate-900">
            Welcome back
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Sign in to access your dashboard
          </p>

          {/* FORM */}
          <div className="mt-6 space-y-4">
            {/* Email */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Email Address
              </label>
              <div className="mt-1 flex items-center gap-2 rounded-lg border px-3 py-2">
                <Mail size={16} className="text-slate-400" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full text-sm outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="mt-1 flex items-center gap-2 rounded-lg border px-3 py-2">
                <Lock size={16} className="text-slate-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full text-sm outline-none"
                />
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input type="checkbox" className="rounded" />
                Remember me
              </label>

              <button className="text-blue-600 hover:underline">
                Forgot password?
              </button>
            </div>

            {/* Sign In */}
            <button className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition">
              Sign In
            </button>

            {/* ROLE SWITCH */}
            <div className="flex gap-3">
              <button
                onClick={() => setRole("user")}
                className={`w-full rounded-lg border py-2 text-sm font-medium transition ${
                  role === "user"
                    ? "border-blue-600 text-blue-600"
                    : "text-slate-500"
                }`}
              >
                User
              </button>

              <button
                onClick={() => setRole("admin")}
                className={`w-full rounded-lg border py-2 text-sm font-medium transition ${
                  role === "admin"
                    ? "border-emerald-500 text-emerald-600"
                    : "text-slate-500"
                }`}
              >
                Admin
              </button>
            </div>

            {/* Footer */}
            <p className="text-center text-sm text-slate-500">
              Don’t have an account?{" "}
              <span className="text-blue-600 hover:underline cursor-pointer">
                Sign Up
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
