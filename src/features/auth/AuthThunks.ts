import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/axios";

import type {
  LoginPayload,
  RegisterPayload,
  ChangePasswordPayload,
 
  VerifyEmailPayload,
  UserProfile,
  LoginResponse
} from "../../types/auth";

// Login
export const login = createAsyncThunk<
  LoginResponse,
  LoginPayload,
  { rejectValue: any }
>("auth/login", async (payload, { rejectWithValue }) => {
  try {
    const res = await api.post<LoginResponse>("/accounts/login/", payload);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data || { error: "Login failed" }
    );
  }
});

// Register
export const register = createAsyncThunk<
  any,
  RegisterPayload,
  { rejectValue: any }
>("auth/register", async (payload, { rejectWithValue }) => {
  try {
    const res = await api.post("/accounts/register/", payload);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data || { error: "Registration failed" }
    );
  }
});

// Logout
export const logout = createAsyncThunk<
  boolean,
  void,
  { rejectValue: any }
>("auth/logout", async (_, { rejectWithValue }) => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      return rejectWithValue({
        error: "Refresh token is required",
      });
    }

    await api.post(
      "/accounts/logout/",
      {
        refresh_token: refreshToken,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return true;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data || { error: "Logout failed" }
    );
  }
});

// Fetch Profile
export const fetchProfile = createAsyncThunk<
  UserProfile,
  void,
  { rejectValue: any }
>("auth/profile", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get<UserProfile>("/accounts/profile/");
    return res.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data || { error: "Profile fetch failed" }
    );
  }
});

// Change Password
export const changePassword = createAsyncThunk<
  void,
  ChangePasswordPayload,
  { rejectValue: any }
>("auth/change-password", async (payload, { rejectWithValue }) => {
  try {
    await api.post("/accounts/change-password/", payload);
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data || { error: "Password change failed" }
    );
  }
});

// Reset Password Confirm - TRY DIFFERENT PAYLOAD STRUCTURES
export const resetPasswordConfirm = createAsyncThunk<
  any,
  { email: string; otp: string; password: string },
  { rejectValue: any }
>("auth/reset-password-confirm", async (payload, { rejectWithValue }) => {
  try {
    // Try different payload structures that APIs commonly expect
    
    // Option 1: email, otp, new_password
    // const res = await api.post("/accounts/password-reset-confirm/", {
    //   email: payload.email,
    //   otp: payload.otp,
    //   new_password: payload.password
    // });
    
    // Option 2: email, token, password
    // const res = await api.post("/accounts/password-reset-confirm/", {
    //   email: payload.email,
    //   token: payload.otp,
    //   password: payload.password
    // });
    
    // Option 3: uid, token, new_password (common in Django)
    // const res = await api.post("/accounts/password-reset-confirm/", {
    //   uid: payload.email, // or some encoded uid
    //   token: payload.otp,
    //   new_password: payload.password
    // });
    
    // Option 4: Just password and token (email from session)
    // const res = await api.post("/accounts/password-reset-confirm/", {
    //   token: payload.otp,
    //   password: payload.password
    // });
    
    // For now, let's try the most common structure
    const res = await api.post("/accounts/password-reset-confirm/", {
      email: payload.email,
      otp: payload.otp,
      new_password: payload.password
    });
    
    return res.data;
  } catch (err: any) {
    // Log the full error response to see what the API expects
    console.log("Password reset error response:", err.response?.data);
    console.log("Status:", err.response?.status);
    console.log("Headers:", err.response?.headers);
    
    return rejectWithValue(
      err.response?.data || { error: "Password reset failed" }
    );
  }
});

// Forgot Password
export const forgotPassword = createAsyncThunk<
  any,
  { email: string },
  { rejectValue: any }
>("auth/forgot-password", async (payload, { rejectWithValue }) => {
  try {
    const res = await api.post("/accounts/password-reset/", {
      email: payload.email,
    });
    return res.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data || { 
        error: "Failed to send password reset email" 
      }
    );
  }
});

// Verify Email (for signup verification)
export const verifyEmail = createAsyncThunk<
  any,
  VerifyEmailPayload,
  { rejectValue: any }
>("auth/verify-email", async (payload, { rejectWithValue }) => {
  try {
    const res = await api.post("/accounts/verify-email/", {
      email: payload.email,
      otp: payload.otp,
    });

    return res.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data || {
        error: "Invalid or expired verification code",
      }
    );
  }
});

// Check OTP (for password reset)
export const checkOTP = createAsyncThunk<
  any,
  VerifyEmailPayload,
  { rejectValue: any }
>("auth/check-otp", async (payload, { rejectWithValue }) => {
  try {
    const res = await api.post("/accounts/check-otp/", {
      email: payload.email,
      otp: payload.otp,
    });

    return res.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data || {
        error: "Invalid or expired verification code",
      }
    );
  }
});

// Resend OTP
export const resendOtp = createAsyncThunk<
  any,
  { email: string },
  { rejectValue: any }
>("auth/resend-otp", async (payload, { rejectWithValue }) => {
  try {
    const res = await api.post("/accounts/resend-otp/", {
      email: payload.email,
    });
    return res.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data || { 
        error: "Failed to resend verification code" 
      }
    );
  }
});