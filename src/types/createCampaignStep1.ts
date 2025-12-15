export type PlatformKey = "facebook" | "google" | "tiktok";

export interface PlatformItem {
  key: PlatformKey;
  name: string;
  description: string;
  connected: boolean;
  logo: string;
}
