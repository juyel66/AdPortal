import React, { useMemo, useState } from "react";
import {
  MoreVertical,
  CheckCircle,
  Ban,
  XCircle,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";


import type {
  UserItem,
  UserStatus,
  ActionMenuPosition,
} from "@/types/userManagement";

/* =========================
   TOP STATS (API READY)
========================= */
const USER_STATS = {
  total: 467,
  active: 423,
  suspended: 12,
  trial: 32,
};

/* =========================
   FAKE USERS (API READY)
========================= */
const USERS: UserItem[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    initials: "JD",
    plan: "Growth",
    status: "active",
    campaigns: 12,
    totalSpend: 1245,
    joined: "2024-01-15",
    lastActive: "2 hours ago",
  },
  {
    id: 2,
    name: "John Doe",
    email: "john@example.com",
    initials: "JD",
    plan: "Scale",
    status: "active",
    campaigns: 23,
    totalSpend: 4245,
    joined: "2024-01-15",
    lastActive: "2 hours ago",
  },
  {
    id: 3,
    name: "Alice Smith",
    email: "alice@example.com",
    initials: "AS",
    plan: "Growth",
    status: "suspended",
    campaigns: 13,
    totalSpend: 2245,
    joined: "2024-01-15",
    lastActive: "2 hours ago",
  },
  {
    id: 4,
    name: "Bob Turner",
    email: "bob@example.com",
    initials: "BT",
    plan: "Starter",
    status: "active",
    campaigns: 24,
    totalSpend: 3245,
    joined: "2024-01-15",
    lastActive: "2 hours ago",
  },
];

/* =========================
   HELPERS
========================= */
const planBadge = (plan: UserItem["plan"]) => {
  if (plan === "Growth") return "bg-blue-100 border border-blue-500 text-blue-700";
  if (plan === "Scale") return "bg-purple-100 border border-purple-500 text-purple-700";
  return "bg-slate-100 border border-slate-300 text-slate-600";
};

const statusBadge = (status: UserStatus) => {
  if (status === "active") return "bg-green-100 text-green-700";
  if (status === "suspended") return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
};

/* =========================
   COMPONENT
========================= */
const ITEMS_PER_PAGE = 4;

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserItem[]>(USERS);
  const [page, setPage] = useState<number>(1);
  const [openAction, setOpenAction] = useState<number | null>(null);

  // ✅ FIX: explicit type
  const [actionPos, setActionPos] = useState<ActionMenuPosition>({
    vertical: "bottom",
    horizontal: "right",
  });

  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return users.slice(start, start + ITEMS_PER_PAGE);
  }, [page, users]);

  // ✅ FIX: explicit return type
  const calculatePosition = (
    btn: HTMLButtonElement
  ): ActionMenuPosition => {
    const rect = btn.getBoundingClientRect();

    const vertical: ActionMenuPosition["vertical"] =
      window.innerHeight - rect.bottom < 140 && rect.top > 140
        ? "top"
        : "bottom";

    const horizontal: ActionMenuPosition["horizontal"] =
      window.innerWidth - rect.right < 160 && rect.left > 160
        ? "left"
        : "right";

    return { vertical, horizontal };
  };

  const updateStatus = (id: number, status: UserStatus) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status } : u))
    );
    setOpenAction(null);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-xl font-semibold">User management</h1>
        <p className="text-sm text-slate-500">
          Manage all platform users and their subscriptions
        </p>
      </div>

      {/* TOP STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={USER_STATS.total} sub="+52 this week " />
        <StatCard title="Active Users" value={USER_STATS.active} sub="90.6% of total" variant="green" />
        <StatCard title="Suspended" value={USER_STATS.suspended} sub="Requires attention" variant="yellow" />
        <StatCard title="Trial Users" value={USER_STATS.trial} sub="Converting well" variant="blue" />
      </div>

      {/* SEARCH */}
      <div className="rounded-xl border bg-white p-4">
        <div className="flex items-center gap-2 rounded-lg border bg-slate-50 px-3 py-2">
          <Search size={16} className="text-slate-400" />
          <input
            placeholder="Search by name or email..."
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-xl border bg-white overflow-visible">
        <table className="w-full table-fixed text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="p-3 w-[260px] text-left">User</th>
              <th className="p-3 w-[100px]">Plan</th>
              <th className="p-3 w-[120px]">Status</th>
              <th className="p-3 w-[90px]">Campaigns</th>
              <th className="p-3 w-[120px]">Spend</th>
              <th className="p-3 w-[120px]">Joined</th>
              <th className="p-3 w-[120px]">Last Active</th>
              <th className="p-3 w-[80px] text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedUsers.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
                      {u.initials}
                    </div>
                    <div>
                      <p className="font-medium">{u.name}</p>
                      <p className="text-xs text-slate-500">{u.email}</p>
                    </div>
                  </div>
                </td>

                <td className="p-3 text-center">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${planBadge(u.plan)}`}>
                    {u.plan}
                  </span>
                </td>

                <td className="p-3 text-center">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusBadge(u.status)}`}>
                    {u.status}
                  </span>
                </td>

                <td className="p-3 text-center">{u.campaigns}</td>
                <td className="p-3 text-center">${u.totalSpend.toLocaleString()}</td>
                <td className="p-3 text-center">{u.joined}</td>
                <td className="p-3 text-center">{u.lastActive}</td>

                <td className="p-3 text-right relative">
                  <button
                    onClick={(e) => {
                      setActionPos(calculatePosition(e.currentTarget));
                      setOpenAction(openAction === u.id ? null : u.id);
                    }}
                  >
                    <MoreVertical size={16} />
                  </button>

                  {openAction === u.id && (
                    <div
                      className={`absolute z-50 w-36 rounded-xl border bg-white shadow-md
                        ${actionPos.vertical === "top" ? "bottom-10" : "top-10"}
                        ${actionPos.horizontal === "left" ? "right-8" : "right-8"}
                      `}
                    >
                      <Action label="Active" icon={<CheckCircle size={14} />} color="text-green-600" onClick={() => updateStatus(u.id, "active")} />
                      <Action label="Suspended" icon={<Ban size={14} />} color="text-yellow-600" onClick={() => updateStatus(u.id, "suspended")} />
                      <Action label="Inactive" icon={<XCircle size={14} />} color="text-red-600" onClick={() => updateStatus(u.id, "inactive")} />
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="flex items-center gap-1 rounded-lg border px-3 py-1 text-sm disabled:opacity-50"
        >
          <ChevronLeft size={14} /> Previous
        </button>

        <div className="flex gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`h-8 w-8 rounded-lg ${
                page === i + 1 ? "bg-blue-600 text-white" : "border"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="flex items-center gap-1 rounded-lg border px-3 py-1 text-sm disabled:opacity-50"
        >
          Next <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

/* =========================
   STAT CARD
========================= */
const StatCard = ({
  title,
  value,
  sub,
  variant,
}: {
  title: string;
  value: number;
  sub: string;
  variant?: "green" | "yellow" | "blue";
}) => {
  const styles = {
    green: "border-green-300 bg-green-50 text-green-600",
    yellow: "border-yellow-300 bg-yellow-50 text-yellow-600",
    blue: "border-blue-300 bg-blue-50 text-blue-600",
  };

  return (
    <div className={`rounded-xl border p-4 ${variant ? styles[variant] : "bg-white"}`}>
      <p className="text-sm">{title}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-xs">{sub}</p>
    </div>
  );
};

/* =========================
   ACTION
========================= */
const Action = ({
  label,
  icon,
  color,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50 ${color}`}
  >
    {icon}
    {label}
  </button>
);

export default UserManagement;
