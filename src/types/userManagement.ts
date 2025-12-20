
export type UserStatus = "active" | "suspended" | "inactive";


export type UserPlan = "Starter" | "Growth" | "Scale";


export interface UserItem {
  id: number;
  name: string;
  email: string;
  initials: string;
  plan: UserPlan;
  status: UserStatus;
  campaigns: number;
  totalSpend: number;
  joined: string;
  lastActive: string;
}


export interface UserStats {
  total: number;
  active: number;
  suspended: number;
  trial: number;
}


export type ActionMenuPosition = {
  vertical: "top" | "bottom";
  horizontal: "left" | "right";
};
