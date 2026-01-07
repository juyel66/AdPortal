// types/creative.ts

export type AdPlatform = "facebook" | "google" | "tiktok";

export interface AdCopyForm {
  headline: string;
  primaryText: string;
  description?: string;
  callToAction: string;
}

export interface PreviewProps extends AdCopyForm {
  imageUrl?: string;
}
