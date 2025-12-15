// Campaign-related type definitions

export interface CampaignCardProps {
  title: string;
  status: "active" | "paused" | "draft";
  type: string;
  platforms: string[];
  budget: string;
  spend: string;
  impressions: string;
  clicks: string;
  ctr: string;
  conversions: string;
  roas: string;
  date: string;
}

export interface BadgeProps {
  status: "active" | "paused" | "draft";
}

export interface ChipProps {
  children: React.ReactNode;
}

export interface StatProps {
  label: string;
  value: string;
}

export interface KpiProps {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface MenuItemProps {
  icon: React.ReactNode;
  text: string;
  danger?: boolean;
}

export interface CampaignData extends CampaignCardProps {
  id: number;
}

