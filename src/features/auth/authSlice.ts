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
} from "../../features/auth/AuthThunks";

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
  otpVerified: boolean; // New field to track OTP verification status
  resetPasswordEmail: string | null; // New field to store email for password reset
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
};


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
      state.message = null;
    },
    clearAuthMessage(state) {
      state.message = null;
    },
    setForgotPasswordEmail(state, action: PayloadAction<string>) {
      state.forgotPasswordEmail = action.payload;
    },
    clearForgotPasswordEmail(state) {
      state.forgotPasswordEmail = null;
    },
    // New action to update user profile
    updateUserProfile(state, action: PayloadAction<Partial<UserProfile>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        saveAuthDataToLocalStorage({
          user: state.user,
          organizations: state.organizations,
          currentPlan: state.currentPlan,
          selectedOrganization: state.selectedOrganization,
        });
      }
    },
    // New action to set selected organization
    setSelectedOrganization(state, action: PayloadAction<string>) {
      state.selectedOrganization = action.payload;
      localStorage.setItem("selectedOrganization", action.payload);
    },
    // New action to clear selected organization
    clearSelectedOrganization(state) {
      state.selectedOrganization = null;
      localStorage.removeItem("selectedOrganization");
    },
    // New action to update organizations
    updateOrganizations(state, action: PayloadAction<string[]>) {
      state.organizations = action.payload;
      localStorage.setItem("organizations", JSON.stringify(action.payload));
    },
    // New action to update current plan
    updateCurrentPlan(state, action: PayloadAction<any>) {
      state.currentPlan = action.payload;
      localStorage.setItem("currentPlan", JSON.stringify(action.payload));
    },
    // New action to set OTP verification status
    setOTPVerified(state, action: PayloadAction<boolean>) {
      state.otpVerified = action.payload;
    },
    // New action to set reset password email
    setResetPasswordEmail(state, action: PayloadAction<string>) {
      state.resetPasswordEmail = action.payload;
      localStorage.setItem("resetPasswordEmail", action.payload);
    },
    // New action to clear reset password data
    clearResetPasswordData(state) {
      state.otpVerified = false;
      state.resetPasswordEmail = null;
      localStorage.removeItem("resetPasswordEmail");
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
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

        // Save tokens to localStorage
        localStorage.setItem("accessToken", action.payload.access);
        localStorage.setItem("refreshToken", action.payload.refresh);
        
        // Save all auth data to localStorage
        saveAuthDataToLocalStorage({
          user: action.payload.user,
          organizations: action.payload.organizations || [],
          currentPlan: action.payload.current_plan || null,
          selectedOrganization: state.selectedOrganization,
        });
      })
      .addCase(login.rejected, (state, action: any) => {
        state.loading = false;
        state.error =
          action.payload?.error ||
          action.payload?.detail ||
          "Login failed";
      });

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        state.message = "Registration successful! Please verify your email.";
      })
      .addCase(register.rejected, (state, action: any) => {
        state.loading = false;
        state.error =
          action.payload?.error ||
          action.payload?.detail ||
          "Registration failed";
      });

    // Logout
    builder
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = null;
        state.message = "Logged out successfully!";
        state.forgotPasswordEmail = null;
        state.organizations = [];
        state.currentPlan = null;
        state.selectedOrganization = null;
        state.otpVerified = false;
        state.resetPasswordEmail = null;
        
        // Clear all auth data from localStorage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        localStorage.removeItem("organizations");
        localStorage.removeItem("currentPlan");
        localStorage.removeItem("selectedOrganization");
        localStorage.removeItem("resetPasswordEmail");
      })
      .addCase(logout.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = null;
        state.message = "Logged out successfully!";
        state.forgotPasswordEmail = null;
        state.organizations = [];
        state.currentPlan = null;
        state.selectedOrganization = null;
        state.otpVerified = false;
        state.resetPasswordEmail = null;
        
        // Clear all auth data from localStorage even on error
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        localStorage.removeItem("organizations");
        localStorage.removeItem("currentPlan");
        localStorage.removeItem("selectedOrganization");
        localStorage.removeItem("resetPasswordEmail");
      });

    // Fetch Profile
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(
        fetchProfile.fulfilled,
        (state, action: PayloadAction<UserProfile>) => {
          state.loading = false;
          state.user = action.payload;
          // Update localStorage with fresh user data
          saveAuthDataToLocalStorage({
            user: action.payload,
            organizations: state.organizations,
            currentPlan: state.currentPlan,
            selectedOrganization: state.selectedOrganization,
          });
        }
      )
      .addCase(fetchProfile.rejected, (state, action: any) => {
        state.loading = false;
        state.error =
          action.payload?.error ||
          action.payload?.detail ||
          "Profile fetch failed";
      });

    // Change Password
    builder
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.message = "Password changed successfully!";
      })
      .addCase(changePassword.rejected, (state, action: any) => {
        state.loading = false;
        state.error =
          action.payload?.error ||
          action.payload?.detail ||
          "Password change failed";
      });

    // Reset Password Confirm - UPDATED
    builder
      .addCase(resetPasswordConfirm.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(resetPasswordConfirm.fulfilled, (state, action: any) => {
        state.loading = false;
        state.message = action.payload?.message || "Password reset successful! You can now login.";
        state.otpVerified = false;
        state.resetPasswordEmail = null;
        localStorage.removeItem("resetPasswordEmail");
      })
      .addCase(resetPasswordConfirm.rejected, (state, action: any) => {
        state.loading = false;
        state.error =
          action.payload?.error ||
          action.payload?.detail ||
          "Password reset failed";
      });

    // Forgot Password
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action: any) => {
        state.loading = false;
        state.message = 
          action.payload?.message || 
          action.payload?.detail || 
          "Password reset email sent successfully!";
      })
      .addCase(forgotPassword.rejected, (state, action: any) => {
        state.loading = false;
        state.error =
          action.payload?.error ||
          action.payload?.detail ||
          "Failed to send password reset email";
      });

    // Verify Email (for signup verification)
    builder
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.loading = false;
        state.message = "Email verified successfully!";
      })
      .addCase(verifyEmail.rejected, (state, action: any) => {
        state.loading = false;
        state.error =
          action.payload?.error ||
          action.payload?.detail ||
          "OTP verification failed";
      });

    // Check OTP (for password reset)
    builder
      .addCase(checkOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(checkOTP.fulfilled, (state, action: any) => {
        state.loading = false;
        state.otpVerified = true;
        state.message = action.payload?.message || "OTP verified successfully!";
      })
      .addCase(checkOTP.rejected, (state, action: any) => {
        state.loading = false;
        state.otpVerified = false;
        state.error =
          action.payload?.error ||
          action.payload?.detail ||
          "OTP verification failed";
      });

    // Resend OTP
    builder
      .addCase(resendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(resendOtp.fulfilled, (state, action: any) => {
        state.loading = false;
        state.message = 
          action.payload?.message || 
          action.payload?.detail || 
          "New verification code sent successfully!";
      })
      .addCase(resendOtp.rejected, (state, action: any) => {
        state.loading = false;
        state.error =
          action.payload?.error ||
          action.payload?.detail ||
          "Failed to resend verification code";
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
  clearResetPasswordData
} = authSlice.actions;
export default authSlice.reducer;