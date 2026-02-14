import React, { useState, useEffect } from "react";
import { Lock } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { resetPasswordConfirm } from "../../features/auth/AuthThunks";
import { toast } from "sonner";

type NewPasswordForm = {
  password: string;
  confirmPassword: string;
};

const NewPassword: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error, message } = useAppSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [apiErrorDetails, setApiErrorDetails] = useState<any>(null);

  // Get email and OTP from location state or localStorage
  const email = location.state?.email || localStorage.getItem("resetPasswordEmail") || "";
  const otp = location.state?.otp || "";

  const [form, setForm] = useState<NewPasswordForm>({
    password: "",
    confirmPassword: "",
  });

  // Validate password
  const validatePassword = (password: string) => {
    const errors = [];
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    if (!/[!@#$%^&*]/.test(password)) {
      errors.push("Password must contain at least one special character (!@#$%^&*)");
    }
    return errors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password") {
      setPasswordErrors(validatePassword(value));
    }
    setFormError(null);
    setApiErrorDetails(null);
  };

  // Check if email exists
  useEffect(() => {
    if (!email) {
      setFormError("Email not found. Please start the password reset process again.");
      setTimeout(() => {
        navigate("/auth/forgot-password");
      }, 3000);
    }
  }, [email, navigate]);

  // Handle API responses
  useEffect(() => {
    if (error) {
      setFormError(typeof error === 'string' ? error : JSON.stringify(error));
      setApiErrorDetails(error);
    }
    if (message) {
      setSuccessMessage(message);
    }
  }, [error, message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);
    setApiErrorDetails(null);

    // Validate email
    if (!email) {
      setFormError("Email not found. Please start over.");
      return;
    }

    // Validate OTP
    if (!otp) {
      setFormError("OTP not found. Please verify your email again.");
      navigate("/auth/check-email", { state: { email } });
      return;
    }

    // Validate passwords
    if (form.password !== form.confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    if (passwordErrors.length > 0) {
      setFormError("Please fix password validation errors");
      return;
    }

    try {
      // Call the reset password confirm API
      const result = await dispatch(
        resetPasswordConfirm({
          email: email,
          otp: otp,
          password: form.password,
        })
      ).unwrap();

      console.log("Password reset successful:", result);
      toast.success("Password reset successful!");
      
      // Clear stored data
      localStorage.removeItem("resetPasswordEmail");
      
      // Show success message and redirect to login
      setSuccessMessage("Password reset successful! Redirecting to login...");
      
      setTimeout(() => {
        navigate("/auth/signin", { 
          state: { 
            message: "Password reset successful! Please login with your new password." 
          } 
        });
      }, 2000);

    } catch (err: any) {
      console.error("Password reset error:", err);
      
      // Handle different error formats
      if (err && typeof err === 'object') {
        // Try to extract meaningful error message
        const errorMsg = err.detail || err.message || err.error || err.non_field_errors?.[0] || JSON.stringify(err);
        setFormError(errorMsg);
        setApiErrorDetails(err);
      } else {
        setFormError(err || "Failed to reset password. Please try again.");
      }
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6">
        <div className="w-full max-w-md text-center">
          <div className="mb-6">
            <img
              src="https://res.cloudinary.com/dqkczdjjs/image/upload/v1765309106/Rectangle_ktqcsy.png"
              alt="AdPortal Logo"
              className="h-16 mx-auto"
            />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Invalid Reset Request
          </h2>
          <p className="text-slate-600 mb-6">
            {formError || "Please start the password reset process again."}
          </p>
          <Link
            to="/auth/forgot-password"
            className="inline-flex justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Forgot Password
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left */}
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

        {/* Right */}
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

            
            <div className="mb-4 p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500">Resetting password for</p>
              <p className="text-sm font-medium text-slate-900">{email}</p>
             
            </div>

            
            {successMessage && (
              <div className="mb-4 rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                OTP Verified Successful
              </div>
            )}

            {/* ERROR MESSAGE */}
            {formError && (
              <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                {formError}
              </div>
            )}

            {/* API ERROR DETAILS (for debugging) */}
            {apiErrorDetails && process.env.NODE_ENV === 'development' && (
              <div className="mb-4 rounded-md bg-yellow-50 border border-yellow-200 px-4 py-3">
                <p className="text-xs font-medium text-yellow-800 mb-1">API Error Details:</p>
                <pre className="text-xs text-yellow-700 overflow-auto max-h-32">
                  {JSON.stringify(apiErrorDetails, null, 2)}
                </pre>
              </div>
            )}

            {/* New Password */}
            <label className="text-sm font-medium">Create New Password</label>
            <div className="mt-1 mb-2 flex items-center gap-2 rounded-lg border px-3 py-2">
              <Lock size={16} className="text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full text-sm outline-none"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <img src="https://res.cloudinary.com/dqkczdjjs/image/upload/v1768420182/Vector_7_peacpf.png" alt="" />
                ) : (
                  <img src="https://res.cloudinary.com/dqkczdjjs/image/upload/v1768420130/Icon_28_zew7xb.png" alt="" />
                )}
              </button>
            </div>

            {/* Password requirements */}
            {form.password && passwordErrors.length > 0 && (
              <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                <p className="text-xs font-medium text-slate-700 mb-1">Password requirements:</p>
                <ul className="space-y-1">
                  {passwordErrors.map((error, index) => (
                    <li key={index} className="text-xs text-red-600 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-600 rounded-full" />
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Confirm Password */}
            <label className="text-sm font-medium">Confirm Password</label>
            <div className="mt-1 mb-4 flex items-center gap-2 rounded-lg border px-3 py-2">
              <Lock size={16} className="text-slate-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full text-sm outline-none"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? (
                  <img src="https://res.cloudinary.com/dqkczdjjs/image/upload/v1768420182/Vector_7_peacpf.png" alt="" />
                ) : (
                  <img src="https://res.cloudinary.com/dqkczdjjs/image/upload/v1768420130/Icon_28_zew7xb.png" alt="" />
                )}
              </button>
            </div>

            {/* Password match indicator */}
            {form.password && form.confirmPassword && (
              <div className="mb-4">
                {form.password === form.confirmPassword ? (
                  <p className="text-xs text-green-600">✓ Passwords match</p>
                ) : (
                  <p className="text-xs text-red-600">✗ Passwords do not match</p>
                )}
              </div>
            )}

            {/* Reset */}
            <button
              type="submit"
              disabled={loading || !form.password || !form.confirmPassword || passwordErrors.length > 0 || form.password !== form.confirmPassword}
              className="mb-4 w-full flex justify-center items-center rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Resetting Password...
                </>
              ) : (
                "Reset Password"
              )}
            </button>

            {/* Sign In */}
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