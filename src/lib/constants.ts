export const COLOR_PALETTE = [
  "#e53935",
  "#d81b60",
  "#8e24aa",
  "#5e35b1",
  "#3949ab",
  "#1e88e5",
  "#039be5",
  "#00acc1",
  "#00897b",
  "#43a047",
  "#7cb342",
  "#c0ca33",
  "#fdd835",
  "#ffb300",
  "#fb8c00",
  "#6d4c41",
] as const;

export const PERIOD_OPTIONS = [
  { value: "month", label: "Текущий месяц" },
  { value: "week", label: "Неделя" },
  { value: "3m", label: "3 месяца" },
  { value: "6m", label: "6 месяцев" },
  { value: "12m", label: "12 месяцев" },
] as const;

export type PeriodPreset = (typeof PERIOD_OPTIONS)[number]["value"];
