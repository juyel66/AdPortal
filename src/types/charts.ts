/* =========================
   LINE CHART DATA
========================= */
export type GrowthRevenuePoint = {
  month: string;
  users: number;
  revenue: number;
};

/* =========================
   PIE LABEL PROPS
   (Recharts custom label)
========================= */
export type PieLabelProps = {
  cx: number;
  cy: number;
  midAngle: number;
  outerRadius: number;
  percent: number;
  name: string;
  fill: string;
};
