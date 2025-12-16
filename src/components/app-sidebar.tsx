"use client";

import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Megaphone,
  Wand2,
  BarChart3,
  FileText,
  CreditCard,
  Users,
  Settings,
  LogOut,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// ---- MENU ITEMS ----

const userItems = [
  {
    title: "Dashboard",
    url: "/user-dashboard/dashboard",
    icon: Home,
  },
  {
    title: "Campaigns",
    url: "/user-dashboard/campaigns",
    icon: Megaphone,
  },
  {
    title: "AI Tools",
    url: "/user-dashboard/ai-tools",
    icon: Wand2,
  },
  {
    title: "Analytics",
    url: "/user-dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Reports",
    url: "/user-dashboard/reports",
    icon: FileText,
  },
  {
    title: "Subscription",
    url: "/user-dashboard/subscriptions",
    icon: CreditCard,
  },
  {
    title: "Team",
    url: "/user-dashboard/team",
    icon: Users,
  },
  {
    title: "Settings",
    url: "/user-dashboard/settings",
    icon: Settings,
  },
];

const adminItems = [
  {
    title: "Dashboard",
    url: "/admin-dashboard/dashboard",
    icon: Home,
  },
  {
    title: "User Management",
    url: "/admin-dashboard/user-management",
    icon: Users,
  },
  {
    title: "Campaigns Monitoring",
    url: "/admin-dashboard/campaigns-monitoring",
    icon: Megaphone,
  },
  {
    title: "Content Moderation",
    url: "/admin-dashboard/content-moderation",
    icon: FileText,
  },
  {
    title: "Finance",
    url: "/admin-dashboard/finance",
    icon: CreditCard,
  },
  {
    title: "Platform Analytics",
    url: "/admin-dashboard/platform-analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    url: "/admin-dashboard/settings",
    icon: Settings,
  },
];

// colors
const ACTIVE_BG = "#2D6FF8";
const ACTIVE_TEXT = "#FFFFFF";
const INACTIVE_TEXT = "#4B5563";
const INACTIVE_ICON = "#6B7280";
// const HOVER_BG = "#EEF3FF";

interface AppSidebarProps {
  isAdmin?: boolean;
}

export function AppSidebar({ isAdmin = false }: AppSidebarProps) {
  const { pathname } = useLocation();
  const items = isAdmin ? adminItems : userItems;

  return (
    <Sidebar className="border-r bg-white pr-2">
      <SidebarContent className="flex h-full flex-col justify-between py-4">
        {/* TOP */}
        <div>
          {/* Logo */}
          <div className="flex items-center gap-2 px-4">
            <img
              src="https://res.cloudinary.com/dqkczdjjs/image/upload/v1765309106/Rectangle_ktqcsy.png"
              alt="AdPortal Logo"
              className="h-[66px] w-[200px] object-contain"
            />
          </div>

          <SidebarGroup>
            <SidebarGroupLabel className="px-4 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-400" />
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => {
                  const isActive =
                    pathname === item.url ||
                    pathname.startsWith(item.url + "/");

                  const Icon = item.icon;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`group mx-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-[#2D6FF8] text-white shadow-sm"
                            : "hover:bg-[#EEF3FF]"
                        }`}
                        style={
                          isActive
                            ? {
                                backgroundColor: ACTIVE_BG,
                                color: ACTIVE_TEXT,
                              }
                            : {
                                color: INACTIVE_TEXT,
                              }
                        }
                      >
                        <Link
                          to={item.url}
                          className="flex items-center gap-3"
                        >
                          <Icon
                            className="h-4 w-4"
                            style={{
                              color: isActive
                                ? ACTIVE_TEXT
                                : INACTIVE_ICON,
                            }}
                          />
                          <span
                            className="truncate"
                            style={{
                              color: isActive
                                ? ACTIVE_TEXT
                                : INACTIVE_TEXT,
                            }}
                          >
                            {item.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Plan Card */}
          {!isAdmin && (
            <div className="mx-4 mt-6 rounded-2xl bg-[#F6F7FB] p-4 text-xs text-gray-600 shadow-sm">
              <div className="mb-2 flex items-center justify-between text-[11px] text-gray-500">
                <span>Current Plan</span>
                <button className="text-[10px] text-gray-400">▼</button>
              </div>
              <div className="mb-2 text-sm font-semibold text-gray-800">
                Growth Plan
              </div>
              <div className="mb-2 text-[11px] text-gray-500">
                65 of 100 campaigns used
              </div>
              <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-[#E5E7EB]">
                <div
                  className="h-full rounded-full bg-[#2D6FF8]"
                  style={{ width: "65%" }}
                />
              </div>
              <button className="w-full rounded-lg bg-[#2D6FF8] py-1.5 text-xs font-medium text-white">
                Upgrade Plan
              </button>
            </div>
          )}
        </div>

        {/* LOGOUT */}
        <div className="mt-4 border-t border-gray-100 pt-4">
          <button className="mx-4 flex w-[calc(100%-2rem)] items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-[#EF4444] hover:bg-red-50">
            <LogOut className="h-4 w-4" />
            <span>Log out</span>
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
