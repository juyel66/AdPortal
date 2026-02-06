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
  resendOtp,
  forgotPassword,
} from "../../features/auth/AuthThunks";

import type { UserProfile } from "../../types/auth";

export interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  message: string | null;
  forgotPasswordEmail: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  isAuthenticated: !!localStorage.getItem("accessToken"),
  loading: false,
  error: null,
  message: null,
  forgotPasswordEmail: null,
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
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.accessToken = action.payload.access;
        state.refreshToken = action.payload.refresh;
        state.isAuthenticated = true;
        state.message = "Login successful!";

        localStorage.setItem("accessToken", action.payload.access);
        localStorage.setItem("refreshToken", action.payload.refresh);
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
        localStorage.clear();
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
        localStorage.clear();
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

    // Reset Password Confirm
    builder
      .addCase(resetPasswordConfirm.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(resetPasswordConfirm.fulfilled, (state) => {
        state.loading = false;
        state.message = "Password reset successful! You can now login.";
      })
      .addCase(resetPasswordConfirm.rejected, (state, action: any) => {
        state.loading = false;
        state.error =
          action.payload?.error ||
          action.payload?.detail ||
          "Password reset failed";
      });

    // Forgot Password - NEW
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

    // Verify Email
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
  clearForgotPasswordEmail 
} = authSlice.actions;
export default authSlice.reducer;