export type ModerationStatus = "pending" | "approved" | "rejected";

export interface ModerationItem {
  id: number;
  title: string;
  type: "Image" | "Video";
  userEmail: string;
  uploadedAt: string;
  views: number;
  status: ModerationStatus;
  reason: string;
  thumbnail: string;
}
