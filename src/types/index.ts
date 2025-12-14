// Global type definitions for the AdPortal application

// Sidebar types
export type SidebarContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

// App Sidebar types
export interface AppSidebarProps {
  isAdmin?: boolean;
}

// Campaign types
export interface Campaign {
  id: number;
  name: string;
  status: "active" | "paused" | "draft";
  platforms: ("facebook" | "google" | "tiktok")[];
  spend: string;
  performance: {
    impressions: string;
    ctr: string;
  };
}

// Add more types here as the application grows
