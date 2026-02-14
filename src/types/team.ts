export interface TeamMember {
  id: number;
  user: {
    id: string;
    full_name: string;
    email: string;
    phone_number: string | null;
    is_admin: boolean;
  };
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  status: 'ACTIVE' | 'PENDING' | 'INACTIVE';
  joined?: string;
  created_at?: string;
}

export interface Team {
  total_members: number;
  active_members: number;
  pending_invitations: number;
  inactive_members: number;
  id?: string;
  name?: string;
}

export interface InviteTeamMemberPayload {
  email: string;
  role: 'ADMIN' | 'MEMBER';
}

export interface TeamState {
  members: TeamMember[];
  team: Team | null;
  loading: boolean;
  error: string | null;
  message: string | null;
  updateLoading: boolean;
  deleteLoading: boolean;
  inviteLoading: boolean;
}