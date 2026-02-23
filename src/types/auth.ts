/* =========================
   USER & AUTH
========================= */

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  avatar?: string;
  gender?: "male" | "female" | "other";
  age?: number;
  date_of_birth?: string;
  timezone?: string;
  is_staff?: boolean;
  is_superuser?: boolean;
  is_active?: boolean;
  is_admin?: boolean;
}

/* =========================
   AUTH STATE
========================= */

export interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

/* =========================
   PAYLOADS
========================= */

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  timezone: string;
}

export interface ChangePasswordPayload {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

export interface ResetPasswordConfirmPayload {
  email: string;
  otp: string;
  new_password: string;
}

export interface VerifyEmailPayload {
  email: string;
  otp: string;
}
