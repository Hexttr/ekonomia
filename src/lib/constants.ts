export const COLOR_PALETTE = [
  "#e53935",
  "#8e24aa",
  "#3949ab",
  "#1e88e5",
  "#00897b",
  "#43a047",
  "#fdd835",
  "#fb8c00",
  "#6d4c41",
  "#546e7a",
] as const;

export const PERIOD_OPTIONS = [
  { value: "month", label: "Текущий месяц" },
  { value: "week", label: "Неделя" },
  { value: "3m", label: "3 месяца" },
  { value: "6m", label: "6 месяцев" },
  { value: "12m", label: "12 месяцев" },
] as const;

export type PeriodPreset = (typeof PERIOD_OPTIONS)[number]["value"];
