export type NotificationKey =
  | "campaignAlerts"
  | "budgetAlerts"
  | "weeklyReports"
  | "aiRecommendations"
  | "teamActivity";

export type NotificationItem = {
  key: NotificationKey;
  title: string;
  description: string;
};
