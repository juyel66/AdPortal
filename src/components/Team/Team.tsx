

import React, { useEffect, useState } from "react";
import {
  UserPlus,
  Shield,
  ShieldCheck,
  User,
  Trash2,
  X,
  Mail,
  AlertTriangle,
} from "lucide-react";
import { toast } from "react-hot-toast";

import { useAppDispatch, useAppSelector } from "../../../src/hooks/reduxHooks";
import {
  fetchTeamMembers,
  inviteTeamMember,
  fetchTeam,
  deleteTeamMember,
} from "../../../src/features/Team/teamThunks";

import type { TeamMember, Role, InviteForm } from "@/types/team";
import { clearTeamError, clearTeamMessage, updateTeamMemberRole } from "@/features/Team/teamSlice";


const getOrgId = (): string | null => {
  const selectedOrg = localStorage.getItem("selectedOrganization");
  if (selectedOrg) {
    try {
      const parsed = JSON.parse(selectedOrg);
      if (parsed?.id) return parsed.id;
    } catch {}
  }

  const orgs = localStorage.getItem("organizations");
  if (orgs) {
    try {
      const parsed = JSON.parse(orgs);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed[0][0];
      }
    } catch {}
  }

  return null;
};


const getInitials = (name: string | undefined | null): string => {
  if (!name || typeof name !== 'string') return '??';
  
  const parts = name.trim().split(' ');
  if (parts.length === 0) return '??';
  
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};


const formatDate = (dateStr: string | undefined | null): string => {
  if (!dateStr) return 'Unknown';
  
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Unknown';
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  } catch {
    return 'Unknown';
  }
};



const Team: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, message, error, team, members } = useAppSelector(
    (state) => state.team
  );

  const [open, setOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    member: TeamMember | null;
  }>({ open: false, member: null });
  const [selectedMember, setSelectedMember] = useState<{
    id: number;
    role: string;
  } | null>(null);

  const [invite, setInvite] = useState<InviteForm>({
    email: "",
    role: "ADMIN",
  });


  useEffect(() => {
    const org_id = getOrgId();
    if (org_id) {
      dispatch(fetchTeam({ org_id }));
      dispatch(fetchTeamMembers({ org_id }));
    }
  }, [dispatch]);


  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(clearTeamMessage());
    }
    if (error) {
      toast.error(error);
      dispatch(clearTeamError());
    }
  }, [message, error, dispatch]);


  const handleInvite = () => {
    const org_id = getOrgId();

    if (!org_id) {
      toast.error("Organization not found");
      return;
    }

    if (!invite.email) {
      toast.error("Email is required");
      return;
    }

    dispatch(
      inviteTeamMember({
        org_id,
        payload: {
          email: invite.email,
          role: invite.role,
        },
      })
    ).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        setInvite({ email: "", role: "ADMIN" });
        setOpen(false);
        // Refresh both team stats and members list
        dispatch(fetchTeam({ org_id }));
        dispatch(fetchTeamMembers({ org_id }));
      }
    });
  };


  const handleRoleUpdate = (memberId: number, newRole: string) => {
    const org_id = getOrgId();
    if (!org_id) {
      toast.error("Organization not found");
      return;
    }


    dispatch(updateTeamMemberRole({ id: memberId, role: newRole }));

    toast.success(`Role updated to ${newRole}`);
    setSelectedMember(null);
  };


  const handleDelete = () => {
    if (!deleteModal.member) return;

    const org_id = getOrgId();
    if (!org_id) {
      toast.error("Organization not found");
      return;
    }

    dispatch(
      deleteTeamMember({
        org_id,
        member_id: deleteModal.member.id,
      })
    ).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        setDeleteModal({ open: false, member: null });

        dispatch(fetchTeam({ org_id }));
      }
    });
  };

  return (
    <div className="space-y-6 mt-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            Team Collaboration
          </h1>
          <p className="text-sm text-slate-500">
            Invite team members and manage access
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          <UserPlus size={16} /> Invite Member
        </button>
      </div>

      {/* Stats (Redux data) */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard
          label="Total Members"
          value={team?.total_members ?? 0}
        />
        <StatCard
          label="Active Users"
          value={team?.active_members ?? 0}
        />
        <StatCard
          label="Pending Invites"
          value={team?.pending_invitations ?? 0}
        />
        <StatCard
          label="Inactive Members"
          value={team?.inactive_members ?? 0}
        />
      </div>

      {/* Roles */}
      <div className="rounded-xl border bg-white p-6">
        <h2 className="font-semibold text-slate-900 mb-4">
          Roles & Permissions
        </h2>

        <RoleRow
          icon={<ShieldCheck className="text-purple-600" />}
          title="Owner"
          desc="Full access to all features, billing, and team management"
        />
        <RoleRow
          icon={<Shield className="text-blue-600" />}
          title="Admin"
          desc="Can manage campaigns, view analytics, and invite members"
        />
        <RoleRow
          icon={<User className="text-green-600" />}
          title="Member"
          desc="Can create and edit campaigns, view analytics"
        />
      </div>

      {/* Team Members (dynamic from API) */}
      <div className="rounded-xl border bg-white">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">
            Team Members
          </h2>
          <span className="text-sm text-slate-500">
            {Array.isArray(members) ? members.length : 0} members
          </span>
        </div>

        {loading && (!Array.isArray(members) || members.length === 0) ? (
          <div className="px-6 py-8 text-center">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-2 text-sm text-slate-500">Loading team members...</p>
          </div>
        ) : !Array.isArray(members) || members.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <p className="text-sm text-slate-500">No team members found</p>
          </div>
        ) : (
          members.map((member: TeamMember) => {
            // Ensure member is not undefined
            if (!member) return null;
            
            const memberName = member.name || member.email || 'Unnamed User';
            const memberEmail = member.email || 'No email';
            const memberRole = member.role || 'Member';
            const joinedDate = member.joined || member.created_at || 'Unknown';
            const memberStatus = member.status || 'active';

            return (
              <div
                key={member.id || Math.random()}
                className="flex items-center justify-between px-6 py-4 border-b last:border-b-0 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
                    {getInitials(memberName)}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {memberName}
                      {memberStatus === "pending" && (
                        <span className="ml-2 rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-700">
                          Pending
                        </span>
                      )}
                      {memberStatus === "inactive" && (
                        <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                          Inactive
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-slate-500">
                      {memberEmail} · Joined {formatDate(joinedDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {selectedMember?.id === member.id ? (
                    <div className="flex items-center gap-2">
                      <select
                        value={selectedMember.role}
                        onChange={(e) => {
                          const newRole = e.target.value;
                          setSelectedMember({
                            ...selectedMember,
                            role: newRole,
                          });
                          handleRoleUpdate(member.id, newRole);
                        }}
                        className="rounded-md border border-blue-300 bg-white px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        autoFocus
                      >
                        <option value="Owner">Owner</option>
                        <option value="Admin">Admin</option>
                        <option value="Member">Member</option>
                      </select>
                      <button
                        onClick={() => setSelectedMember(null)}
                        className="text-xs text-slate-500 hover:text-slate-700"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <select
                      value={memberRole}
                      onChange={(e) => {
                        if (memberRole === "Owner") {
                          toast.error("Cannot change owner role");
                          return;
                        }
                        const newRole = e.target.value;
                        setSelectedMember({
                          id: member.id,
                          role: newRole,
                        });
                      }}
                      className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs hover:border-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-500"
                      disabled={memberRole === "Owner"}
                    >
                      <option value="Owner">Owner</option>
                      <option value="Admin">Admin</option>
                      <option value="Member">Member</option>
                    </select>
                  )}

                  {memberRole !== "Owner" && (
                    <button
                      onClick={() =>
                        setDeleteModal({ open: true, member })
                      }
                      className="text-red-500 hover:text-red-700 transition-colors p-1"
                      title="Remove member"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Invite Modal */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={18} />
            </button>

            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Invite Team Member
            </h2>

            <label className="text-sm text-slate-700">Email Address</label>
            <div className="relative mt-1">
              <Mail
                size={16}
                className="absolute left-3 top-2.5 text-slate-400"
              />
              <input
                value={invite.email}
                onChange={(e) =>
                  setInvite({ ...invite, email: e.target.value })
                }
                placeholder="colleague@example.com"
                className="w-full rounded-lg border border-slate-300 pl-9 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <label className="mt-4 block text-sm text-slate-700">Role</label>
            <select
              value={invite.role}
              onChange={(e) =>
                setInvite({
                  ...invite,
                  role: e.target.value as Role,
                })
              }
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ADMIN">Admin</option>
              <option value="MEMBER">Member</option>
            </select>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                onClick={handleInvite}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send Invite"}
              </button>
            </div>
          </div>
        </div>
      )}

     
      {deleteModal.open && deleteModal.member && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="text-red-600" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">
                  Remove Team Member
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Are you sure you want to remove{" "}
                  <span className="font-medium">
                    {deleteModal.member.name || deleteModal.member.email || 'this member'}
                  </span>{" "}
                  from the team? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setDeleteModal({ open: false, member: null })}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Removing..." : "Remove Member"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================
   Small Components
========================= */

const StatCard = ({
  label,
  value,
}: {
  label: string;
  value: number;
}) => (
  <div className="rounded-xl border border-slate-200 bg-white p-4 hover:border-slate-300 transition-colors">
    <p className="text-sm text-slate-500">{label}</p>
    <p className="text-xl font-semibold text-slate-900 mt-1">
      {value}
    </p>
  </div>
);

const RoleRow = ({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) => (
  <div className="flex items-start gap-3 mb-3">
    <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
      {icon}
    </div>
    <div>
      <p className="font-medium text-slate-900">{title}</p>
      <p className="text-sm text-slate-500">{desc}</p>
    </div>
  </div>
);

export default Team;