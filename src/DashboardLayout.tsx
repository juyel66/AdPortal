import React from "react";
import { Outlet } from "react-router-dom";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

const DashboardLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* SIDEBAR */}
        <AppSidebar />

        {/* MAIN CONTENT */}
        <main className="relative flex-1 w-full flex justify-center items-start p-6">
          
          {/* Sidebar toggle (top-left) */}
          <div className="absolute left-4 top-4 z-50">
            <SidebarTrigger />
          </div>

          {/* Page Content */}
          <div className="w-full">
            <div className="flex items-center justify-center">Navbar</div>
            <Outlet />
          </div>

        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
