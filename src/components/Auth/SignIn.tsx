import React, { useEffect, useState } from "react";
import { Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { login } from "../../features/auth/AuthThunks";

const SignIn: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  const [showPassword, setShowPassword] = useState(false);

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

    dispatch(
      login({
        email: form.email,
        password: form.password,
      })
    );
  };

  
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
      alert("Login successful!");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Side */}
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

        {/* Right Side */}
        <div className="flex justify-center">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-slate-900">
              Welcome back
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Sign in to access your dashboard
            </p>

            {/* ERROR MESSAGE */}
            {error && (
              <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </div>
            )}

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
                required
              />
            </div>

            {/* PASSWORD */}
            <label className="text-sm font-medium">Password</label>
            <div className="mt-1 mb-4 flex items-center gap-2 rounded-lg border px-3 py-2">
              <Lock size={16} className="text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full text-sm outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <img
                    src="https://res.cloudinary.com/dqkczdjjs/image/upload/v1768420182/Vector_7_peacpf.png"
                    alt="Hide"
                  />
                ) : (
                  <img
                    src="https://res.cloudinary.com/dqkczdjjs/image/upload/v1768420130/Icon_28_zew7xb.png"
                    alt="Show"
                  />
                )}
              </button>
            </div>

            <div className="mb-4 flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-600">
                <input
                  type="checkbox"
                  name="remember"
                  checked={form.remember}
                  onChange={handleChange}
                />
                Remember me
              </label>

              <Link to="/auth/forgot-password" className="text-blue-600">
                Forgot password?
              </Link>
            </div>

            {/* SIGN IN */}
            <button
              type="submit"
              disabled={loading}
              className="mb-4 w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            {/* SIGN UP */}
            <p className="text-center text-xs text-slate-500">
              Don’t have an account?{" "}
              <Link to="/auth/signup" className="text-blue-600">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
