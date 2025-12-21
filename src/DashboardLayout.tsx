import React from "react";
import { Outlet } from "react-router-dom";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import AdminNavbar from "./pages/admin/AdminNavbar/AdminNavbar";

const DashboardLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* SIDEBAR */}
        <AppSidebar />

        {/* MAIN CONTENT */}
        <main className="relative flex-1 w-full flex justify-center items-start pl-4 pr-4 pb-4">
          
          {/* Sidebar toggle (top-left) */}
          <div className="absolute left-4 top-5 z-50">
            <SidebarTrigger />
          </div>

          {/* Page Content */}
          <div className="w-full">
              <AdminNavbar />
           <div className="mt-4">
             <Outlet />
           </div>
          </div>

        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
