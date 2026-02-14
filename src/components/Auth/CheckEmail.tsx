import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { OTP } from "./OTP";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { checkOTP, verifyEmail, resendOtp } from "../../features/auth/AuthThunks"; 
import { Clock, RefreshCw } from "lucide-react";
import { setResetPasswordEmail } from "@/features/auth/authSlice";

const CheckEmail: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error } = useAppSelector((state) => state.auth);

  
  const locationEmail = location.state?.email || "";
  const locationOTP = location.state?.otp || "";
  const flow = location.state?.flow || "register"; // 'register' or 'forgot-password'
  
  
  const localStorageEmail = localStorage.getItem("pendingVerifyEmail") || "";
  const storedResetEmail = localStorage.getItem("resetPasswordEmail") || "";
  
  
  const email = locationEmail || localStorageEmail || storedResetEmail;

  const [otp, setOtp] = useState(locationOTP || "");
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(60); 
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Determine which OTP verification function to use
  const verifyOTP = flow === "register" ? verifyEmail : checkOTP;

  useEffect(() => {
    const savedTimer = localStorage.getItem("otpResendTimer");
    if (savedTimer) {
      const remainingTime = parseInt(savedTimer);
      if (remainingTime > 0) {
        setResendTimer(remainingTime);
        setCanResend(false);
      } else {
        setCanResend(true);
      }
    } else {
      setCanResend(true);
    }
  }, []);
  
  useEffect(() => {
    let timer: any;
    
    
    if (resendTimer > 0 && !canResend) {
      timer = setTimeout(() => {
        setResendTimer((prev) => prev - 1);
        localStorage.setItem("otpResendTimer", (resendTimer - 1).toString());
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
      localStorage.removeItem("otpResendTimer");
    }
    
    return () => clearTimeout(timer);
  }, [resendTimer, canResend]);

 
  useEffect(() => {
    if (email) {
      localStorage.setItem("pendingVerifyEmail", email);
      if (flow === "forgot-password") {
        dispatch(setResetPasswordEmail(email));
      }
    }
  }, [email, flow, dispatch]);

  
  const handleOtpChange = (value: string) => {
   
    const cleanValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    if (cleanValue.length <= 6) {
      setOtp(cleanValue);
      setFormError(null);
      
      
      if (cleanValue.length === 6) {
        setTimeout(() => {
          handleSubmit(new Event('submit') as any);
        }, 300);
      }
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    if (!otp || otp.length !== 6) {
      setFormError("");
      return;
    }

    try {
      const result = await dispatch(
        verifyOTP({
          email,
          otp,
        })
      ).unwrap();

      // Clear storage
      localStorage.removeItem("pendingVerifyEmail");
      localStorage.removeItem("otpResendTimer");
      
      // Redirect based on flow
      if (flow === "register") {
        // Registration flow - go to sign in
        navigate("/auth/signin", { 
          state: { 
            email: email,
            message: "Email verified successfully! Please login with your credentials."
          } 
        });
      } else {
        // Forgot password flow - go to new password
        localStorage.setItem("resetPasswordEmail", email);
        navigate("/auth/new-password", { 
          state: { 
            email: email,
            otp: otp,
            message: "OTP verified successfully! Please set your new password."
          } 
        });
      }
      
    } catch (err: any) {
      setFormError(
        err?.otp?.[0] ||
          err?.detail ||
          "Invalid or expired verification code"
      );
      setOtp(""); 
    }
  };

  
  const handleResendOtp = async () => {
    if (!canResend || isResending || !email) return;

    setIsResending(true);
    setFormError(null);
    setSuccessMessage(null);
    setOtp(""); 

    try {
  
      await dispatch(
        resendOtp({ email }) 
      ).unwrap();

      
      setResendTimer(60);
      setCanResend(false);
      localStorage.setItem("otpResendTimer", "60");
      
     
      setSuccessMessage("New verification code sent successfully!");
      
     
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      
    } catch (err: any) {
      setFormError(
        err?.detail ||
        err?.message ||
        "Failed to resend verification code. Please try again."
      );
    } finally {
      setIsResending(false);
    }
  };

 
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  
  useEffect(() => {
    if (error) {
      setFormError(error);
    }
  }, [error]);

  
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
            Email Not Found
          </h2>
          <p className="text-slate-600 mb-6">
            Please start the {flow === "register" ? "signup" : "password reset"} process first.
          </p>
          <Link
            to={flow === "register" ? "/auth/signup" : "/auth/forgot-password"}
            className="inline-flex justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            {flow === "register" ? "Sign Up" : "Forgot Password"}
          </Link>
        </div>
      </div>
    );
  }

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
            {flow === "register" ? "Verify Your Email" : "Reset Your Password"}
          </h1>

          <p className="mt-4 max-w-md text-sm text-slate-500 leading-relaxed">
            {flow === "register" 
              ? "Enter the 6-digit verification code sent to your email to complete your registration."
              : "Enter the 6-digit verification code sent to your email to proceed with password reset."}
          </p>
        </div>

        
        <div className="flex justify-center">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm"
          >
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">
              Check your Email
            </h2>

            <p className="text-sm text-slate-600 mb-8">
              We sent a verification code to{" "}
              <span className="font-semibold text-slate-900">{email}</span>. 
              Enter the code below.
            </p>

            {/* Flow indicator */}
            {/* <div className="mb-4 p-2 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700 text-center">
                {flow === "register" 
                  ? "Completing registration" 
                  : "Resetting password"}
              </p>
            </div> */}

            {/* SUCCESS MESSAGE */}
            {successMessage && (
              <div className="mb-6 rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                {successMessage}
              </div>
            )}

            {/* ERROR MESSAGE */}
            {formError && (
              <div className="mb-6 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                {formError}
              </div>
            )}

            {/* OTP FIELD */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-slate-900 mb-3">
                Verification Code
              </label>
              <div className="flex justify-center">
                <OTP value={otp} onChange={handleOtpChange} />
              </div>
            </div>

            {/* VERIFY OTP BUTTON */}
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="mb-6 w-full flex justify-center items-center rounded-lg bg-blue-600 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </button>

            {/* RESEND OTP SECTION */}
            <div className="mb-8 text-center">
              <p className="text-sm text-slate-600 mb-3">
                Didn't receive the code?
              </p>
              
              <div className="flex items-center justify-center gap-3">
                {!canResend ? (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Clock size={14} />
                    <span>Resend available in {formatTime(resendTimer)}</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isResending}
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isResending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <RefreshCw size={14} />
                        Resend Code
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* BACK LINK - changes based on flow */}
            <div className="text-center">
              <Link
                to={flow === "register" ? "/auth/signup" : "/auth/forgot-password"}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                ← Back to {flow === "register" ? "Sign Up" : "Forgot Password"}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckEmail;