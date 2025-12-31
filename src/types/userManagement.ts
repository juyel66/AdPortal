/* =========================
   USER STATUS
========================= */

export type UserStatus = "active" | "suspended" | "inactive";

/* =========================
   USER PLAN
========================= */

export type UserPlan = "Starter" | "Growth" | "Scale";

/* =========================
   USER ITEM
========================= */

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

/* =========================
   USER STATS (TOP CARDS)
========================= */

export interface UserStats {
  total: number;
  active: number;
  suspended: number;
  trial: number;
}

/* =========================
   ACTION MENU POSITION
========================= */

export interface ActionMenuPosition {
  vertical: "top" | "bottom";
  horizontal: "left" | "right";
}
