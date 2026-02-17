import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import {
  login,
  register,
  logout,
  fetchProfile,
  changePassword,
  resetPasswordConfirm,
  verifyEmail,
  checkOTP,
  resendOtp,
  forgotPassword,
  refreshToken, // Import refresh token
} from "./AuthThunks";

import type { UserProfile, LoginResponse } from "../../types/auth";

export interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  message: string | null;
  forgotPasswordEmail: string | null;
  organizations: string[];
  currentPlan: any | null;
  selectedOrganization: string | null;
  otpVerified: boolean;
  resetPasswordEmail: string | null;
  lastAction: string | null;
  tokenRefreshAttempts: number; // Track refresh attempts
}

// Function to save auth data to localStorage
const saveAuthDataToLocalStorage = (data: {
  user: UserProfile;
  organizations?: string[];
  currentPlan?: any;
  selectedOrganization?: string | null;
}) => {
  try {
    localStorage.setItem("user", JSON.stringify(data.user));
    if (data.organizations) {
      localStorage.setItem("organizations", JSON.stringify(data.organizations));
    }
    if (data.currentPlan) {
      localStorage.setItem("currentPlan", JSON.stringify(data.currentPlan));
    }
    if (data.selectedOrganization) {
      localStorage.setItem("selectedOrganization", data.selectedOrganization);
    }
  } catch (error) {
    console.error("Error saving auth data to localStorage:", error);
  }
};

// Function to get auth data from localStorage
const getAuthDataFromLocalStorage = () => {
  try {
    const userStr = localStorage.getItem("user");
    const organizationsStr = localStorage.getItem("organizations");
    const currentPlanStr = localStorage.getItem("currentPlan");
    const selectedOrganization = localStorage.getItem("selectedOrganization");
    const resetPasswordEmail = localStorage.getItem("resetPasswordEmail");

    return {
      user: userStr ? JSON.parse(userStr) : null,
      organizations: organizationsStr ? JSON.parse(organizationsStr) : [],
      currentPlan: currentPlanStr ? JSON.parse(currentPlanStr) : null,
      selectedOrganization: selectedOrganization,
      resetPasswordEmail: resetPasswordEmail,
    };
  } catch (error) {
    console.error("Error getting auth data from localStorage:", error);
    return {
      user: null,
      organizations: [],
      currentPlan: null,
      selectedOrganization: null,
      resetPasswordEmail: null,
    };
  }
};

const authData = getAuthDataFromLocalStorage();

const initialState: AuthState = {
  user: authData.user,
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  isAuthenticated: !!localStorage.getItem("accessToken"),
  loading: false,
  error: null,
  message: null,
  forgotPasswordEmail: null,
  organizations: authData.organizations,
  currentPlan: authData.currentPlan,
  selectedOrganization: authData.selectedOrganization,
  otpVerified: false,
  resetPasswordEmail: authData.resetPasswordEmail,
  lastAction: null,
  tokenRefreshAttempts: 0,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
      state.message = null;
      state.lastAction = 'clear_error';
    },
    clearAuthMessage: (state) => {
      state.message = null;
      state.lastAction = 'clear_message';
    },
    setForgotPasswordEmail: (state, action: PayloadAction<string>) => {
      state.forgotPasswordEmail = action.payload;
      state.lastAction = 'set_forgot_email';
    },
    clearForgotPasswordEmail: (state) => {
      state.forgotPasswordEmail = null;
      state.lastAction = 'clear_forgot_email';
    },
    updateUserProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        saveAuthDataToLocalStorage({
          user: state.user,
          organizations: state.organizations,
          currentPlan: state.currentPlan,
          selectedOrganization: state.selectedOrganization,
        });
        state.lastAction = 'update_profile';
      }
    },
    setSelectedOrganization: (state, action: PayloadAction<string>) => {
      state.selectedOrganization = action.payload;
      localStorage.setItem("selectedOrganization", action.payload);
      state.lastAction = 'set_org';
    },
    clearSelectedOrganization: (state) => {
      state.selectedOrganization = null;
      localStorage.removeItem("selectedOrganization");
      state.lastAction = 'clear_org';
    },
    updateOrganizations: (state, action: PayloadAction<string[]>) => {
      state.organizations = action.payload;
      localStorage.setItem("organizations", JSON.stringify(action.payload));
      state.lastAction = 'update_orgs';
    },
    updateCurrentPlan: (state, action: PayloadAction<any>) => {
      state.currentPlan = action.payload;
      localStorage.setItem("currentPlan", JSON.stringify(action.payload));
      state.lastAction = 'update_plan';
    },
    setOTPVerified: (state, action: PayloadAction<boolean>) => {
      state.otpVerified = action.payload;
      state.lastAction = 'set_otp';
    },
    setResetPasswordEmail: (state, action: PayloadAction<string>) => {
      state.resetPasswordEmail = action.payload;
      localStorage.setItem("resetPasswordEmail", action.payload);
      state.lastAction = 'set_reset_email';
    },
    clearResetPasswordData: (state) => {
      state.otpVerified = false;
      state.resetPasswordEmail = null;
      localStorage.removeItem("resetPasswordEmail");
      state.lastAction = 'clear_reset';
    },
    resetAuthState: () => initialState,
    resetTokenRefreshAttempts: (state) => {
      state.tokenRefreshAttempts = 0;
    },
  },
  extraReducers: (builder) => {
    // Login cases
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.lastAction = 'login_pending';
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.loading = false;
        state.accessToken = action.payload.access;
        state.refreshToken = action.payload.refresh;
        state.user = action.payload.user;
        state.organizations = action.payload.organizations || [];
        state.currentPlan = action.payload.current_plan || null;
        state.isAuthenticated = true;
        state.message = "Login successful!";
        state.error = null;
        state.tokenRefreshAttempts = 0;
        state.lastAction = 'login_success';

        localStorage.setItem("accessToken", action.payload.access);
        localStorage.setItem("refreshToken", action.payload.refresh);
        saveAuthDataToLocalStorage({
          user: action.payload.user,
          organizations: action.payload.organizations || [],
          currentPlan: action.payload.current_plan || null,
          selectedOrganization: state.selectedOrganization,
        });
      })
      .addCase(login.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.error || "Login failed";
        state.message = null;
        state.lastAction = 'login_error';
      })

    // Register cases
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.lastAction = 'register_pending';
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        state.message = "Registration successful! Please verify your email.";
        state.error = null;
        state.lastAction = 'register_success';
      })
      .addCase(register.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.error || "Registration failed";
        state.message = null;
        state.lastAction = 'register_error';
      })

    // Logout cases
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.lastAction = 'logout_pending';
      })
      .addCase(logout.fulfilled, (state) => {
        // Reset all state
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
        state.message = "Logged out successfully!";
        state.forgotPasswordEmail = null;
        state.organizations = [];
        state.currentPlan = null;
        state.selectedOrganization = null;
        state.otpVerified = false;
        state.resetPasswordEmail = null;
        state.tokenRefreshAttempts = 0;
        state.lastAction = 'logout_success';
        
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        localStorage.removeItem("organizations");
        localStorage.removeItem("currentPlan");
        localStorage.removeItem("selectedOrganization");
        localStorage.removeItem("resetPasswordEmail");
      })
      .addCase(logout.rejected, (state) => {
        // Still clear state even if API fails
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
        state.message = "Logged out successfully!";
        state.forgotPasswordEmail = null;
        state.organizations = [];
        state.currentPlan = null;
        state.selectedOrganization = null;
        state.otpVerified = false;
        state.resetPasswordEmail = null;
        state.tokenRefreshAttempts = 0;
        state.lastAction = 'logout_error';
        
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        localStorage.removeItem("organizations");
        localStorage.removeItem("currentPlan");
        localStorage.removeItem("selectedOrganization");
        localStorage.removeItem("resetPasswordEmail");
      })

    // Fetch Profile cases
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.lastAction = 'profile_pending';
      })
      .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
        state.lastAction = 'profile_success';
        
        saveAuthDataToLocalStorage({
          user: action.payload,
          organizations: state.organizations,
          currentPlan: state.currentPlan,
          selectedOrganization: state.selectedOrganization,
        });
      })
      .addCase(fetchProfile.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.error || "Profile fetch failed";
        state.lastAction = 'profile_error';
      })

    // Change Password cases
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.lastAction = 'change_password_pending';
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.message = "Password changed successfully!";
        state.error = null;
        state.lastAction = 'change_password_success';
      })
      .addCase(changePassword.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.error || "Password change failed";
        state.message = null;
        state.lastAction = 'change_password_error';
      })

    // Forgot Password cases
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.lastAction = 'forgot_pending';
      })
      .addCase(forgotPassword.fulfilled, (state, action: any) => {
        state.loading = false;
        state.message = action.payload?.message || "Password reset email sent!";
        state.forgotPasswordEmail = action.payload?.email || null;
        state.error = null;
        state.lastAction = 'forgot_success';
      })
      .addCase(forgotPassword.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to send reset email";
        state.message = null;
        state.lastAction = 'forgot_error';
      })

    // Reset Password Confirm cases
      .addCase(resetPasswordConfirm.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.lastAction = 'reset_confirm_pending';
      })
      .addCase(resetPasswordConfirm.fulfilled, (state, action: any) => {
        state.loading = false;
        state.message = action.payload?.message || "Password reset successful!";
        state.otpVerified = false;
        state.resetPasswordEmail = null;
        state.error = null;
        state.lastAction = 'reset_confirm_success';
        
        localStorage.removeItem("resetPasswordEmail");
      })
      .addCase(resetPasswordConfirm.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.error || "Password reset failed";
        state.message = null;
        state.lastAction = 'reset_confirm_error';
      })

    // Verify Email cases
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.lastAction = 'verify_email_pending';
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.loading = false;
        state.message = "Email verified successfully!";
        state.error = null;
        state.lastAction = 'verify_email_success';
      })
      .addCase(verifyEmail.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.error || "Email verification failed";
        state.message = null;
        state.lastAction = 'verify_email_error';
      })

    // Check OTP cases
      .addCase(checkOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.lastAction = 'check_otp_pending';
      })
      .addCase(checkOTP.fulfilled, (state, action: any) => {
        state.loading = false;
        state.otpVerified = true;
        state.message = action.payload?.message || "OTP verified!";
        state.error = null;
        state.lastAction = 'check_otp_success';
      })
      .addCase(checkOTP.rejected, (state, action: any) => {
        state.loading = false;
        state.otpVerified = false;
        state.error = action.payload?.error || "OTP verification failed";
        state.message = null;
        state.lastAction = 'check_otp_error';
      })

    // Resend OTP cases
      .addCase(resendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.lastAction = 'resend_otp_pending';
      })
      .addCase(resendOtp.fulfilled, (state, action: any) => {
        state.loading = false;
        state.message = action.payload?.message || "OTP resent successfully!";
        state.error = null;
        state.lastAction = 'resend_otp_success';
      })
      .addCase(resendOtp.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to resend OTP";
        state.message = null;
        state.lastAction = 'resend_otp_error';
      })

    // ========== REFRESH TOKEN CASES ==========
      .addCase(refreshToken.pending, (state) => {
        // Don't set loading to true to avoid UI flicker
        state.tokenRefreshAttempts += 1;
        state.lastAction = 'refresh_token_pending';
      })
      .addCase(refreshToken.fulfilled, (state, action: PayloadAction<{ access: string }>) => {
        state.accessToken = action.payload.access;
        state.isAuthenticated = true;
        state.error = null;
        state.lastAction = 'refresh_token_success';
        
        // Update localStorage
        localStorage.setItem("accessToken", action.payload.access);
        
        console.log('🔄 Token refreshed in state');
      })
      .addCase(refreshToken.rejected, (state, action: any) => {
        // Only clear if multiple failures
        if (state.tokenRefreshAttempts > 2) {
          console.log('❌ Multiple refresh failures, logging out');
          
          // Clear everything
          state.user = null;
          state.accessToken = null;
          state.refreshToken = null;
          state.isAuthenticated = false;
          state.organizations = [];
          state.currentPlan = null;
          state.selectedOrganization = null;
          state.otpVerified = false;
          state.resetPasswordEmail = null;
          
          // Clear localStorage
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          localStorage.removeItem("organizations");
          localStorage.removeItem("currentPlan");
          localStorage.removeItem("selectedOrganization");
          localStorage.removeItem("resetPasswordEmail");
        }
        
        state.error = action.payload?.error || "Token refresh failed";
        state.lastAction = 'refresh_token_error';
      });
  },
});

export const { 
  clearAuthError, 
  clearAuthMessage, 
  setForgotPasswordEmail,
  clearForgotPasswordEmail,
  updateUserProfile,
  setSelectedOrganization,
  clearSelectedOrganization,
  updateOrganizations,
  updateCurrentPlan,
  setOTPVerified,
  setResetPasswordEmail,
  clearResetPasswordData,
  resetAuthState,
  resetTokenRefreshAttempts
} = authSlice.actions;

export default authSlice.reducer;