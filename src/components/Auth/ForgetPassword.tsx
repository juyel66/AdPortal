import React, { useState, useEffect } from "react";
import { Mail, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

// Import types
import type { 
  ForgotPasswordFormData, 
  ForgotPasswordValidationErrors,
} from "@/types/forgotPassword";

// Import Redux types and actions
import type { AppDispatch, RootState } from "@/store";
import { 
  setForgotPasswordEmail, 
  clearAuthError, 
  clearAuthMessage 
} from "@/features/auth/authSlice";
import { forgotPassword } from "@/features/auth/AuthThunks";

// Component Props Type
interface ForgetPasswordProps {
  onSuccessRedirect?: string;
  showBranding?: boolean;
  showSecurityTips?: boolean;
}

// Component State Type
interface ComponentState {
  formData: ForgotPasswordFormData;
  validationErrors: ForgotPasswordValidationErrors;
  isLoading: boolean;
  isSubmitted: boolean;
}

const ForgetPassword: React.FC<ForgetPasswordProps> = ({ 
  onSuccessRedirect = "/auth/check-email",
  showBranding = true,
  showSecurityTips = true 
}) => {
  // Initialize component state
  const [state, setState] = useState<ComponentState>({
    formData: {
      email: "",
      termsAccepted: false
    },
    validationErrors: {},
    isLoading: false,
    isSubmitted: false
  });

  // Destructure state
  const { formData, validationErrors, isLoading } = state;

  // Initialize hooks
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  // Select state from Redux store
  const { 
    loading: reduxLoading, 
    error: reduxError, 
    message: reduxMessage 
  } = useSelector((state: RootState) => state.auth);

  // Combined loading state
  const isSubmitting = isLoading || reduxLoading;

  // Email validation function
  const validateEmail = (email: string): string | null => {
    if (!email.trim()) {
      return "Email address is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }

    if (email.length > 254) {
      return "Email address is too long";
    }

    return null;
  };

  // Form validation function
  const validateForm = (): boolean => {
    const errors: ForgotPasswordValidationErrors = {};

    // Validate email
    const emailError = validateEmail(formData.email);
    if (emailError) {
      errors.email = emailError;
    }

    // Update validation errors
    setState(prev => ({ ...prev, validationErrors: errors }));

    // Return validation result
    return Object.keys(errors).length === 0;
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        [name]: type === "checkbox" ? checked : value.trim()
      }
    }));

    // Clear validation error for this field
    if (validationErrors[name as keyof ForgotPasswordValidationErrors]) {
      setState(prev => ({
        ...prev,
        validationErrors: {
          ...prev.validationErrors,
          [name]: undefined
        }
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    // Set loading state
    setState(prev => ({ ...prev, isLoading: true, isSubmitted: true }));

    // Clear previous errors/messages
    dispatch(clearAuthError());
    dispatch(clearAuthMessage());

    try {
      // Dispatch forgot password action
      const result = await dispatch(forgotPassword({ email: formData.email }));
      
      if (forgotPassword.fulfilled.match(result)) {
        // Save email to redux for use in check-email page
        dispatch(setForgotPasswordEmail(formData.email));
        
        // Extract success message
        const successMessage = 
          result.payload?.message || 
          result.payload?.detail || 
          "Password reset email sent successfully!";
        
        // Show success toast
        toast.success(successMessage);
        
        // Navigate to check-email page with email and flow='forgot-password'
        navigate(onSuccessRedirect, { 
          state: { 
            email: formData.email,
            flow: "forgot-password",
            timestamp: new Date().toISOString(),
            success: true,
            message: successMessage
          } 
        });
      }
    } catch (error: unknown) {
      // Handle unexpected errors
      console.error("Forgot password error:", error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : "An unexpected error occurred";
      
      toast.error(errorMessage);
    } finally {
      // Reset loading state
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && !isSubmitting) {
      handleSubmit(e as any);
    }
  };

  // Extract error message from Redux error
  const getErrorMessage = (error: any): string => {
    if (typeof error === 'string') {
      return error;
    }
    
    if (typeof error === 'object') {
      if (Array.isArray(error.email)) {
        return error.email[0];
      } else if (error.email) {
        return error.email;
      } else if (error.detail) {
        return error.detail;
      } else if (error.message) {
        return error.message;
      } else if (error.error) {
        return error.error;
      }
    }
    
    return "An error occurred. Please try again.";
  };

  // Show toast for Redux errors
  useEffect(() => {
    if (reduxError) {
      const errorMessage = getErrorMessage(reduxError);
      toast.error(errorMessage);
      dispatch(clearAuthError());
    }
  }, [reduxError, dispatch]);

  // Show toast for Redux success messages
  useEffect(() => {
    if (reduxMessage && !reduxLoading) {
      toast.success(reduxMessage);
      dispatch(clearAuthMessage());
    }
  }, [reduxMessage, reduxLoading, dispatch]);

  // Reset form on component unmount
  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
      dispatch(clearAuthMessage());
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-8">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left Side - Branding */}
        {showBranding && (
          <div className="text-center lg:text-left">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 mb-8">
              <img
                src="https://res.cloudinary.com/dqkczdjjs/image/upload/v1765309106/Rectangle_ktqcsy.png"
                alt="AdPortal Logo"
                className="h-16 lg:h-20"
              />
            </div>

            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight mb-4">
              The Only Platform You Need for Multi-Channel Ads
            </h2>

            <p className="text-gray-600 mb-6 leading-relaxed">
              Create once, publish everywhere. Let AI handle your ad campaigns
              across Meta, Google Ads, and TikTok from one unified dashboard.
            </p>
          </div>
        )}

        {/* Right Side - Form */}
        <div className={`flex justify-center ${!showBranding ? 'lg:col-span-2' : ''}`}>
          <div className="w-full max-w-md">
            <form
              onSubmit={handleSubmit}
              onKeyDown={handleKeyPress}
              className="w-full bg-white rounded-2xl border border-gray-200 p-6 lg:p-8 shadow-lg shadow-gray-100/50"
              noValidate
              aria-label="Forgot password form"
            >
              <div className="mb-2">
                <h1 className="text-2xl font-bold text-gray-900" id="forgot-password-title">
                  Forgot Password?
                </h1>
                <p className="text-gray-600 mt-2" id="forgot-password-description">
                  No worries! Enter your email and we'll send you a verification code to reset your password.
                </p>
              </div>

              {/* Email Input */}
              <div className="mt-6">
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Mail 
                      size={18} 
                      className="text-gray-400" 
                      aria-hidden="true"
                    />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                    className={`w-full pl-10 pr-4 py-3 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      validationErrors.email 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300'
                    }`}
                    required
                    disabled={isSubmitting}
                    autoComplete="email"
                    autoFocus
                    aria-required="true"
                    aria-invalid={!!validationErrors.email}
                    aria-describedby={validationErrors.email ? "email-error" : "email-help"}
                  />
                </div>
                
                {/* Validation Error Message */}
                {validationErrors.email && (
                  <p 
                    id="email-error" 
                    className="mt-2 text-sm text-red-600"
                    role="alert"
                  >
                    {validationErrors.email}
                  </p>
                )}
                
                {/* Help Text */}
                <p 
                  id="email-help" 
                  className="text-xs text-gray-500 mt-2"
                >
                  We'll send a 6-digit verification code to this email
                </p>
              </div>

              {/* Terms Checkbox */}
              <div className="mt-4 flex items-center">
                <input
                  id="termsAccepted"
                  name="termsAccepted"
                  type="checkbox"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label 
                  htmlFor="termsAccepted" 
                  className="ml-2 text-sm text-gray-700"
                >
                  I agree to receive password reset instructions via email
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !formData.termsAccepted}
                className="mt-8 w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 py-3 text-sm font-semibold text-white hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                aria-label={isSubmitting ? "Sending OTP..." : "Send OTP"}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 
                      className="h-4 w-4 animate-spin" 
                      aria-hidden="true"
                    />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    <Mail 
                      size={16} 
                      aria-hidden="true"
                    />
                    Send OTP
                  </>
                )}
              </button>

              {/* Back to Login */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Remember your password?{" "}
                    <Link 
                      to="/auth/signIn" 
                      className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                      aria-label="Back to login page"
                    >
                      Back to Login
                    </Link>
                  </p>
                </div>
              </div>

              {/* Security Note */}
              {/* {showSecurityTips && (
                <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-xs text-blue-800 text-center">
                    <span className="font-medium">Security Tip:</span> We'll never ask for your password via email.
                  </p>
                </div>
              )} */}

              {/* Error Display from Redux */}
              {reduxError && (
                <div 
                  className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg"
                  role="alert"
                >
                  <p className="text-sm text-red-800">
                    {getErrorMessage(reduxError)}
                  </p>
                </div>
              )}
            </form>

            {/* Mobile - Additional Info */}
            {showSecurityTips && (
              <div className="lg:hidden mt-6 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Mail className="h-5 w-5 text-blue-600" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Secure & Fast</h3>
                    <p className="text-xs text-gray-600 mt-1">
                      Reset code expires in 15 minutes for your security.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;