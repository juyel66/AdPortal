import React, { useState, useEffect } from "react";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { register } from "../../features/auth/AuthThunks";

type SignUpForm = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  remember: boolean;
  acceptTerms: boolean;
};

type FormErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  acceptTerms?: string;
  api?: string;
};

const SignUp: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading, error } = useAppSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [form, setForm] = useState<SignUpForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    remember: false,
    acceptTerms: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  /* =========================
     VALIDATION HELPERS (SQA Requirements)
  ========================= */

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password: string) => {
    // Minimum 8 characters, at least one uppercase, one lowercase, one number and one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    return passwordRegex.test(password);
  };

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Full name is required";
        if (value.trim().length < 3) return "Full name must be at least 3 characters";
        if (value.trim().length > 50) return "Full name cannot exceed 50 characters";
        if (!/^[a-zA-Z\s]+$/.test(value)) return "Full name can only contain letters and spaces";
        return "";

      case "email":
        if (!value) return "Email is required";
        if (!isValidEmail(value)) return "Please enter a valid email address";
        if (value.length > 100) return "Email cannot exceed 100 characters";
        return "";

      case "password":
        if (!value) return "Password is required";
        if (!isValidPassword(value)) {
          return "Password must have: 8+ characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character";
        }
        if (value.length > 128) return "Password cannot exceed 128 characters";
        
        // Additional SQA security validations
        if (value.toLowerCase().includes("password")) return "Password cannot contain the word 'password'";
        if (form.email && value.toLowerCase().includes(form.email.split("@")[0].toLowerCase())) {
          return "Password cannot contain your email";
        }
        if (form.name && value.toLowerCase().includes(form.name.toLowerCase().split(" ")[0])) {
          return "Password cannot contain your name";
        }
        return "";

      case "confirmPassword":
        if (!value) return "Please confirm your password";
        if (value !== form.password) return "Passwords do not match";
        return "";

      default:
        return "";
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    // Validate all fields
    newErrors.name = validateField("name", form.name);
    newErrors.email = validateField("email", form.email);
    newErrors.password = validateField("password", form.password);
    newErrors.confirmPassword = validateField("confirmPassword", form.confirmPassword);

    // Terms and conditions validation
    if (!form.acceptTerms) {
      newErrors.acceptTerms = "You must accept the Terms of Service and Privacy Policy";
    }

    // Remove empty error messages
    Object.keys(newErrors).forEach(key => {
      if (!newErrors[key as keyof FormErrors]) {
        delete newErrors[key as keyof FormErrors];
      }
    });

    return newErrors;
  };

  /* =========================
     HANDLE CHANGE WITH REAL-TIME VALIDATION
  ========================= */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    const newValue = type === "checkbox" ? checked : value;
    
    setForm((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Mark field as touched
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Real-time validation for the changed field
    if (touched[name]) {
      const error = validateField(name, newValue as string);
      setErrors((prev) => ({
        ...prev,
        [name]: error || undefined,
        api: undefined,
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error || undefined,
    }));
  };

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(form).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(allTouched);

    // Validate entire form
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      
      // Scroll to first error
      const firstError = Object.keys(newErrors)[0];
      const element = document.querySelector(`[name="${firstError}"]`);
      if (element) {
        (element as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
        (element as HTMLElement).focus();
      }
      
      return;
    }

    const [first_name, ...rest] = form.name.trim().split(" ");
    const last_name = rest.join(" ") || " ";

    try {
      await dispatch(
        register({
          first_name,
          last_name,
          email: form.email,
          password: form.password,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        })
      ).unwrap();

      // Navigate to CheckEmail with email as state
      navigate("/auth/check-email", { 
        state: { email: form.email } 
      });
    } catch (err: any) {
      setErrors({
        api:
          err?.email?.[0] ||
          err?.detail ||
          err?.message ||
          "Registration failed. Please try again.",
      });
      
      // Scroll to error message
      setTimeout(() => {
        const errorElement = document.querySelector('[class*="bg-red-50"]');
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  };

  // Calculate password strength
  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength += 25;
    
    return Math.min(strength, 100);
  };

  const passwordStrength = calculatePasswordStrength(form.password);

  // Get password strength color
  const getStrengthColor = (strength: number) => {
    if (strength <= 25) return "bg-red-500";
    if (strength <= 50) return "bg-orange-500";
    if (strength <= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  useEffect(() => {
    if (error) {
      setErrors((prev) => ({
        ...prev,
        api: error,
      }));
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6 py-8">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Section */}
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
            Create once, publish everywhere. Let AI handle your ad campaigns
            across Meta, Google Ads, and TikTok from one unified dashboard.
          </p>

          {/* Security Features */}
        
        </div>

        {/* Right Section - Sign Up Form */}
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

            {errors.api && (
              <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                {errors.api}
              </div>
            )}

            {/* Name */}
            <div className="mb-4">
              <label className="text-sm font-medium">Full Name *</label>
              <div className="mt-1 flex items-center gap-2 rounded-lg border px-3 py-2">
                <User size={16} className="text-slate-400" />
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your full name"
                  className="w-full text-sm outline-none"
                  maxLength={50}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="text-sm font-medium">Email Address *</label>
              <div className="mt-1 flex items-center gap-2 rounded-lg border px-3 py-2">
                <Mail size={16} className="text-slate-400" />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="you@example.com"
                  className="w-full text-sm outline-none"
                  maxLength={100}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="text-sm font-medium">Password *</label>
              <div className="mt-1 flex items-center gap-2 rounded-lg border px-3 py-2">
                <Lock size={16} className="text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="••••••••"
                  className="w-full text-sm outline-none"
                  maxLength={128}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {form.password && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Password Strength:</span>
                    <span className={`font-medium ${
                      passwordStrength <= 25 ? 'text-red-600' :
                      passwordStrength <= 50 ? 'text-orange-600' :
                      passwordStrength <= 75 ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {passwordStrength <= 25 ? 'Weak' :
                       passwordStrength <= 50 ? 'Fair' :
                       passwordStrength <= 75 ? 'Good' : 'Strong'}
                    </span>
                  </div>
                  <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getStrengthColor(passwordStrength)} transition-all duration-300`}
                      style={{ width: `${passwordStrength}%` }}
                    />
                  </div>
                </div>
              )}
              
              {/* Password Requirements */}
              <div className="mt-2 text-xs text-slate-500">
                <p className="font-medium mb-1">Password must contain:</p>
                <ul className="space-y-0.5">
                  <li className={form.password.length >= 8 ? 'text-green-600' : ''}>
                    {form.password.length >= 8 ? '✓' : '•'} At least 8 characters
                  </li>
                  <li className={/[A-Z]/.test(form.password) ? 'text-green-600' : ''}>
                    {/[A-Z]/.test(form.password) ? '✓' : '•'} One uppercase letter
                  </li>
                  <li className={/[a-z]/.test(form.password) ? 'text-green-600' : ''}>
                    {/[a-z]/.test(form.password) ? '✓' : '•'} One lowercase letter
                  </li>
                  <li className={/\d/.test(form.password) ? 'text-green-600' : ''}>
                    {/\d/.test(form.password) ? '✓' : '•'} One number
                  </li>
                  <li className={/[\W_]/.test(form.password) ? 'text-green-600' : ''}>
                    {/[\W_]/.test(form.password) ? '✓' : '•'} One special character
                  </li>
                </ul>
              </div>
              
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label className="text-sm font-medium">Confirm Password *</label>
              <div className="mt-1 flex items-center gap-2 rounded-lg border px-3 py-2">
                <Lock size={16} className="text-slate-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="••••••••"
                  className="w-full text-sm outline-none"
                  maxLength={128}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="mb-4">
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  name="acceptTerms"
                  checked={form.acceptTerms}
                  onChange={handleChange}
                  className="mt-1"
                />
                <label htmlFor="acceptTerms" className="text-xs text-slate-600">
                  I agree to the{" "}
                  <a href="/terms" className="text-blue-600 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>
              {errors.acceptTerms && (
                <p className="mt-1 text-xs text-red-600">{errors.acceptTerms}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="mb-6 flex items-center gap-2 text-xs text-slate-600">
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
              />
              <label>Remember me on this device</label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mb-4 w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Login Link */}
            <p className="text-center text-xs text-slate-500">
              Already have an account?{" "}
              <Link to="/auth/signin" className="text-blue-600 hover:underline font-medium">
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