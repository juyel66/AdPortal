import React, { useEffect, useState } from "react";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { login } from "../../features/auth/AuthThunks";
import { clearAuthError } from "@/features/auth/authSlice";

const SignIn: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated, user, organizations } = useAppSelector(
    (state) => state.auth
  );

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });
  const [loginAttempted, setLoginAttempted] = useState(false);
  const [showError, setShowError] = useState(false);


  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

 
  useEffect(() => {
    if (isAuthenticated && user && loginAttempted) {
      const orgCount = organizations.length;
 
      if (orgCount === 0) {
        toast.success(" Welcome to AdPortal!", {
          duration: 3000,
          position: "top-center",
        });
      } else {
        toast.success("Login successful", {
          duration: 3000,
          position: "top-center",
        });
      }

      setForm({ email: "", password: "", remember: false });
      setLoginAttempted(false);
      setShowPassword(false);

  
      if (user.is_admin === true || user.is_admin === "true") {
        navigate("/admin-dashboard/dashboard");
      } else {
        navigate("/user-dashboard/dashboard");
      }
    }
  }, [isAuthenticated, user, navigate, organizations, loginAttempted]);

  // Handle error state
  useEffect(() => {
    if (error && loginAttempted && !loading) {
      setShowError(true);
      setLoginAttempted(false);
      
      
      const timer = setTimeout(() => {
        setShowError(false);
        dispatch(clearAuthError());
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [error, loading, loginAttempted, dispatch]);

  const validateForm = (): boolean => {
    const errors = {
      email: "",
      password: "",
    };
    let isValid = true;

   
    if (!form.email) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }


    if (!form.password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (form.password.length < 4) {
      errors.password = "Password must be at least 4 characters";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    

    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }




    





    
    
    if (showError) {
      setShowError(false);
      dispatch(clearAuthError());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    

    if (!validateForm()) {
      return;
    }
    
    setLoginAttempted(true);
    setShowError(false);
    

    dispatch(
      login({
        email: form.email,
        password: form.password,
      })
    );
  };

  const handleForgotPassword = () => {
    if (form.email) {

      navigate("/auth/forgot-password", { state: { email: form.email } });
    } else {
      navigate("/auth/forgot-password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 sm:px-6">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">

        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
            <img
              src="https://res.cloudinary.com/dqkczdjjs/image/upload/v1765309106/Rectangle_ktqcsy.png"
              alt="AdPortal Logo"
              className="h-16 md:h-20"
            />
          </div>

          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 leading-snug">
            The Only Platform You Need <br />
            for Multi-Channel Ads
          </h1>

          <p className="mt-4 max-w-md text-sm text-slate-500 leading-relaxed mx-auto md:mx-0">
            Create once, publish everywhere. Let AI handle your ad
            campaigns across Meta, Google Ads, and TikTok from one
            unified dashboard.
          </p>
        </div>

      
        <div className="flex justify-center">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-2xl border bg-white/80 backdrop-blur-sm p-6 md:p-8 shadow-xl"
          >
            <h2 className="text-xl font-semibold text-slate-900">
              Welcome back
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Sign in to access your dashboard
            </p>

        
            {showError && error && (
              <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 animate-shake">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-800">
                      Login Failed
                    </p>
                    <p className="text-xs text-red-600 mt-1">
                      {error}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setShowError(false);
                        dispatch(clearAuthError());
                      }}
                      className="text-xs text-red-600 hover:text-red-800 mt-2 underline"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            )}

         
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <div className={`relative rounded-lg border ${
                formErrors.email ? 'border-red-300 bg-red-50' : 'border-slate-200'
              } focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all`}>
                <div className="flex items-center gap-2 px-3 py-2">
                  <Mail size={16} className="text-slate-400" />
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full text-sm outline-none bg-transparent"
                    disabled={loading}
                    autoComplete="email"
                  />
                </div>
              </div>
              {formErrors.email && (
                <p className="mt-1 text-xs text-red-600">{formErrors.email}</p>
              )}
            </div>

           
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <div className={`relative rounded-lg border ${
                formErrors.password ? 'border-red-300 bg-red-50' : 'border-slate-200'
              } focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all`}>
                <div className="flex items-center gap-2 px-3 py-2">
                  <Lock size={16} className="text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full text-sm outline-none bg-transparent"
                    disabled={loading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              {formErrors.password && (
                <p className="mt-1 text-xs text-red-600">{formErrors.password}</p>
              )}
            </div>

            
            <div className="mb-6 flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  name="remember"
                  checked={form.remember}
                  onChange={handleChange}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  disabled={loading}
                />
                Remember me
              </label>

              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                disabled={loading}
              >
                Forgot password?
              </button>
            </div>

          
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg cursor-pointer bg-blue-600 py-2.5 text-sm font-medium text-white 
                       hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed 
                       transition-all duration-200 shadow-md hover:shadow-lg
                       transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : "Sign In"}
            </button>

            {/* Sign Up Link */}
            <p className="mt-4 text-center text-xs text-slate-500">
              Don't have an account?{" "}
              <Link 
                to="/auth/signup" 
                className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
              >
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