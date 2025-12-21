export type StatCardType = {
  title: string;
  value: string | number;
  change: string;
};

export type UserGrowthData = {
  month: string;
  newUsers: number;
  activeUsers: number;
};

export type FeatureUsageData = {
  name: string;
  value: number;
};
