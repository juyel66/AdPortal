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
  Check,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { useAppDispatch, useAppSelector } from "../../../src/hooks/reduxHooks";
import {
  fetchTeamMembers,
  inviteTeamMember,
  fetchTeam,
  deleteTeamMember,
  updateTeamMemberRole,
} from "../../../src/features/Team/teamThunks";

import type { TeamMember, Role, InviteForm } from "@/types/team";
import { clearTeamError, clearTeamMessage } from "@/features/Team/teamSlice";

// Get current user email from localStorage
const getCurrentUserEmail = (): string | null => {
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.email || null;
    }
  } catch (error) {
    console.error("Error getting current user:", error);
  }
  return null;
};

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

const Team: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, message, error, team, members } = useAppSelector(
    (state) => state.team
  );

  const [open, setOpen] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    member: TeamMember | null;
  }>({ open: false, member: null });
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [invite, setInvite] = useState<InviteForm>({
    email: "",
    role: "ADMIN",
  });

  const currentUserEmail = getCurrentUserEmail();

  // Initial data fetch
  useEffect(() => {
    const org_id = getOrgId();
    if (org_id) {
      Promise.all([
        dispatch(fetchTeam({ org_id })),
        dispatch(fetchTeamMembers({ org_id }))
      ]).then(([teamResult]) => {
        if (fetchTeam.fulfilled.match(teamResult)) { 
          console.log(teamResult);
        }
       
      }).catch(() => {
        toast.error("Failed to load team data");
      });
    }
  }, [dispatch]);

  // Handle redux messages and errors
  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(clearTeamMessage());
    }
    if (error) {
      
      dispatch(clearTeamError());
    }
  }, [message, error, dispatch]);

  const handleInvite = async () => {
    const org_id = getOrgId();

    if (!org_id) {
      toast.error("Organization not found");
      return;
    }

    if (!invite.email) {
      toast.error("Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(invite.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setInviteLoading(true);

    try {
      const result = await dispatch(
        inviteTeamMember({
          org_id,
          payload: {
            email: invite.email,
            role: invite.role,
          },
        })
      ).unwrap();

      if (result) {
        toast.success("Invitation sent successfully Please check your Email!");
        setInvite({ email: "", role: "ADMIN" });
        setOpen(false);
        
        // Refresh data
        await Promise.all([
          dispatch(fetchTeam({ org_id })),
          dispatch(fetchTeamMembers({ org_id }))
        ]);
      }
    } catch (err: any) {
      const errorMessage = err?.message || err?.error || "Failed to send invitation";
      toast.error(errorMessage);
    } finally {
      setInviteLoading(false);
    }
  };

  const handleRoleUpdate = async (memberId: number, newRole: string) => {
    const org_id = getOrgId();
    if (!org_id) {
      toast.error("Organization not found");
      return;
    }

    setUpdatingId(memberId);

    try {
      const result = await dispatch(
        updateTeamMemberRole({
          org_id,
          member_id: memberId,
          role: newRole,
        })
      ).unwrap();

      if (result) {
        toast.success(`Updated to ${newRole} successfully!`);
        // Refresh members list to get updated data
        await dispatch(fetchTeamMembers({ org_id }));
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.error || "Failed to update role";
      toast.error(errorMessage);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.member) return;

    const org_id = getOrgId();
    if (!org_id) {
      toast.error("Organization not found");
      return;
    }

    setDeleteLoading(true);

    try {
      const result = await dispatch(
        deleteTeamMember({
          org_id,
          member_id: deleteModal.member.id,
        })
      ).unwrap();

      if (result) {
        toast.success("Team member removed successfully!");
        setDeleteModal({ open: false, member: null });
        
        // Refresh data
        await Promise.all([
          dispatch(fetchTeam({ org_id })),
          dispatch(fetchTeamMembers({ org_id }))
        ]);
      }
    } catch (err: any) {
      const errorMessage = err?.message || err?.error || "Failed to remove team member";
      toast.error(errorMessage);
    } finally {
      setDeleteLoading(false);
    }
  };

  const isCurrentUser = (member: TeamMember): boolean => {
    return member.user?.email === currentUserEmail;
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
          disabled={inviteLoading}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <UserPlus size={16} /> Invite Member
        </button>
      </div>

      {/* Stats */}
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

      {/* Team Members */}
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
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-sm text-slate-500">Loading team members...</p>
          </div>
        ) : !Array.isArray(members) || members.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <p className="text-sm text-slate-500">No team members found</p>
          </div>
        ) : (
          members.map((member: TeamMember) => {
            if (!member) return null;
            
            const memberName = member.user?.full_name || member.user?.full_name || 'Unnamed User';
            const memberEmail = member.user?.email || 'No email';
            const memberRole = member.role || 'MEMBER';
            const memberStatus = member.status || 'ACTIVE';
            const isOwner = memberRole === 'OWNER';
            const isSelf = isCurrentUser(member);

            return (
              <div
                key={member.id}
                className="flex items-center justify-between px-6 py-4 border-b last:border-b-0 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
                    {getInitials(memberName)}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {memberName}
                      {isSelf && (
                        <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                          You
                        </span>
                      )}
                      {memberStatus === "PENDING" && (
                        <span className="ml-2 rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-700">
                          Pending
                        </span>
                      )}
                      {memberStatus === "INACTIVE" && (
                        <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                          Inactive
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-slate-500">
                      {memberEmail}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={memberRole}
                    onChange={(e) => {
                      if (isOwner && !isSelf) {
                        toast.error("Cannot change owner's role");
                        return;
                      }
                      if (isSelf) {
                        toast.error("You cannot change your own role");
                        return;
                      }
                      handleRoleUpdate(member.id, e.target.value);
                    }}
                    className={`rounded-md border border-slate-300 bg-white px-2 py-1 text-xs hover:border-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed ${
                      updatingId === member.id ? 'opacity-50' : ''
                    }`}
                    disabled={isOwner || isSelf || updatingId === member.id}
                  >
                    <option value="OWNER">Owner</option>
                    <option value="ADMIN">Admin</option>
                    <option value="MEMBER">Member</option>
                  </select>

                  {updatingId === member.id && (
                    <Loader2 size={14} className="animate-spin text-blue-600" />
                  )}

                  {!isSelf && !isOwner && (
                    <button
                      onClick={() => setDeleteModal({ open: true, member })}
                      className="text-red-500 hover:text-red-700 transition-colors p-1"
                      title="Remove member"
                      disabled={deleteLoading}
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
              disabled={inviteLoading}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
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
                className="w-full rounded-lg border border-slate-300 pl-9 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:cursor-not-allowed"
                disabled={inviteLoading}
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
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:cursor-not-allowed"
              disabled={inviteLoading}
            >
              <option value="ADMIN">Admin</option>
              <option value="MEMBER">Member</option>
            </select>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                disabled={inviteLoading}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                disabled={inviteLoading || !invite.email}
                onClick={handleInvite}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 min-w-[100px] justify-center"
              >
                {inviteLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Invite"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
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
                    {deleteModal.member.user?.full_name || deleteModal.member.user?.email || 'this member'}
                  </span>{" "}
                  from the team? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setDeleteModal({ open: false, member: null })}
                disabled={deleteLoading}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {deleteLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Removing...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Remove Member
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Stat Card Component
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

// Role Row Component
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