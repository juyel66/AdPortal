export interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: Role;
  joined: string;
  status?: "Active" | "Pending" | "Inactive";
}

export type Role = "Owner" | "Admin" | "Member";

export interface InviteTeamMemberPayload {
  email: string;
  role: Role;
}

export interface TeamStats {
  total_members: number;
  active_members: number;
  inactive_members: number;
  pending_invitations: number;
}

export interface TeamState {
  members: TeamMember[];
  stats: TeamStats | null;
  loading: boolean;
  error: string | null;
  message: string | null;
}