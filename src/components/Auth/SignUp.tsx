import React, { useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import { Link } from "react-router-dom";

type SignUpForm = {
  name: string;
  email: string;
  password: string;
  remember: boolean;
};

const SignUp: React.FC = () => {
//   const [role, setRole] = useState<"user" | "admin">("user");

  const [form, setForm] = useState<SignUpForm>({
    name: "",
    email: "",
    password: "",
    remember: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 🔐 API READY PAYLOAD
    // const payload = {
    //   ...form,
    //   role,
    // };

    // console.log("SIGN UP PAYLOAD 👉", payload);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
     
        <div>
          <div className="flex items-center gap-3 mb-6">
            <img
              src="https://res.cloudinary.com/dqkczdjjs/image/upload/v1765309106/Rectangle_ktqcsy.png"
              alt="AdPortal Logo"
              className="h-14"
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
              Create your account
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Sign up to get started with AdPortal
            </p>

            {/* FULL NAME */}
            <label className="text-sm font-medium">
              Full Name
            </label>
            <div className="mt-1 mb-4 flex items-center gap-2 rounded-lg border px-3 py-2">
              <User size={16} className="text-slate-400" />
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full text-sm outline-none"
                required
              />
            </div>

            {/* EMAIL */}
            <label className="text-sm font-medium">
              Email Address
            </label>
            <div className="mt-1 mb-4 flex items-center gap-2 rounded-lg border px-3 py-2">
              <Mail size={16} className="text-slate-400" />
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full text-sm outline-none"
                required
              />
            </div>

            {/* PASSWORD */}
            <label className="text-sm font-medium">
              Password
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

            {/* REMEMBER */}
            <div className="mb-4 flex items-center gap-2 text-xs text-slate-600">
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
              />
              Remember me
            </div>

            {/* SIGN UP BUTTON */}
            <button
              type="submit"
              className="mb-4 w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Create Account
            </button>

           
            {/* <div className="mb-4 flex gap-2">
              <Link to="/user-dashboard/dashboard"
                type="button"
                onClick={() => setRole("user")}
                className={`flex-1 flex items-center justify-center rounded-lg border py-2 text-sm font-medium ${
                  role === "user"
                    ? "border-blue-600 text-blue-600"
                    : "text-slate-500"
                }`}
              >
                User
              </Link>

              <Link to="/admin-dashboard/dashboard"
                type="button"
                onClick={() => setRole("admin")}
                className={`flex-1 flex items-center justify-center rounded-lg border py-2 text-sm font-medium text-center${
                  role === "admin"
                    ? "border-emerald-500 text-emerald-600"
                    : "text-slate-500"
                }`}
              >
               Admin
              </Link>
            </div> */}

            {/* LOGIN LINK */}
            <p className="text-center text-xs text-slate-500">
              Already have an account?{" "}
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

export default SignUp;
