import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/axios";

import type {
  LoginPayload,
  RegisterPayload,
  ChangePasswordPayload,
  ResetPasswordConfirmPayload,
  VerifyEmailPayload,
  UserProfile,
} from "../../types/auth";



export const login = createAsyncThunk<
  any,
  LoginPayload,
  { rejectValue: any }
>("auth/login", async (payload, { rejectWithValue }) => {
  try {
    const res = await api.post("/accounts/login/", payload);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data || { error: "Login failed" }
    );
  }
});



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



export const resetPasswordConfirm = createAsyncThunk<
  void,
  ResetPasswordConfirmPayload,
  { rejectValue: any }
>("auth/reset-password-confirm", async (payload, { rejectWithValue }) => {
  try {
    await api.post("/accounts/password-reset-confirm/", payload);
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data || { error: "Password reset failed" }
    );
  }
});



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