export type UserStatus = "active" | "suspended" | "inactive";

export interface UserItem {
  id: string; // Changed from number to string for better uniqueness
  name: string;
  email: string;
  initials: string;
  plan: "Starter" | "Growth" | "Scale";
  status: UserStatus;
  campaigns: number;
  totalSpend: number;
  joined: string;
  lastActive: string;
}

export interface ActionMenuPosition {
  vertical: "top" | "bottom";
  horizontal: "left" | "right";
}

// API Response Types
export interface UserStats {
  total_users: {
    value: number;
    last_week: number;
  };
  active_users: number;
  suspended_users: number;
  trial_users: number;
}

export interface ApiUser {
  full_name: string | null;
  email: string;
  status: string;
  joined_at: string;
  last_login: string | null;
}

export interface UserListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApiUser[];
}