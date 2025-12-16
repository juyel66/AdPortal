// TeamCollaboration.tsx
import React, { useState } from "react";
import {
  UserPlus,
  Shield,
  ShieldCheck,
  User,
  Trash2,
  X,
  Mail,
} from "lucide-react";

import type { TeamMember, Role, InviteForm } from "@/types/team";

/* =========================
   Fake Data
========================= */

const members: TeamMember[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Owner",
    joined: "Jan 2024",
  },
  {
    id: 2,
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    joined: "Jan 2024",
  },
  {
    id: 3,
    name: "Alice Smith",
    email: "alice@example.com",
    role: "Member",
    joined: "Feb 2024",
  },
  {
    id: 4,
    name: "Bob Turner",
    email: "bob@example.com",
    role: "Member",
    joined: "Invited",
    status: "Pending",
  },
];

/* =========================
   Component
========================= */

const Team: React.FC = () => {
  const [open, setOpen] = useState(false);

  const [invite, setInvite] = useState<InviteForm>({
    email: "",
    role: "Admin",
  });

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
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
        >
          <UserPlus size={16} /> Invite Member
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Members" value="4" />
        <StatCard label="Active Users" value="3" />
        <StatCard label="Pending Invites" value="1" />
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
        <h2 className="px-6 py-4 font-semibold border-b">
          Team Members
        </h2>

        {members.map((m) => (
          <div
            key={m.id}
            className="flex items-center justify-between px-6 py-4 border-b last:border-b-0"
          >
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
                {m.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>

              <div>
                <p className="text-sm font-medium text-slate-900">
                  {m.name}
                  {m.status && (
                    <span className="ml-2 rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-700">
                      Pending
                    </span>
                  )}
                </p>
                <p className="text-xs text-slate-500">
                  {m.email} · {m.joined}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <select
                className="rounded-md border px-2 py-1 text-xs"
                defaultValue={m.role}
                disabled={m.role === "Owner"}
              >
                <option>Owner</option>
                <option>Admin</option>
                <option>Member</option>
              </select>

              {m.role !== "Owner" && (
                <button className="text-red-500">
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* =========================
         Invite Modal
      ========================= */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="w-full max-w-md rounded-xl bg-white p-6 relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 text-slate-400"
            >
              <X size={18} />
            </button>

            <h2 className="text-lg font-semibold mb-4">
              Invite Team Member
            </h2>

            <label className="text-sm">Email Address</label>
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
                className="w-full rounded-lg border pl-9 px-3 py-2 text-sm"
              />
            </div>

            <label className="mt-4 block text-sm">Role</label>
            <select
              value={invite.role}
              onChange={(e) =>
                setInvite({ ...invite, role: e.target.value as Role })
              }
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            >
              <option>Admin</option>
              <option>Member</option>
            </select>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg border px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white">
                Send Invite
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

const StatCard = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-xl border bg-white p-4">
    <p className="text-sm text-slate-500">{label}</p>
    <p className="text-xl font-semibold text-slate-900 mt-1">{value}</p>
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
    <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center">
      {icon}
    </div>
    <div>
      <p className="font-medium text-slate-900">{title}</p>
      <p className="text-sm text-slate-500">{desc}</p>
    </div>
  </div>
);

export default Team;
