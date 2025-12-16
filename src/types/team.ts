// types/team.ts

export type Role = "Owner" | "Admin" | "Member";

export type TeamMember = {
  id: number;
  name: string;
  email: string;
  role: Role;
  joined: string;
  status?: "Pending";
};

export type InviteForm = {
  email: string;
  role: Role;
};
