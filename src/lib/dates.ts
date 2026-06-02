import type { PeriodPreset } from "./constants";

export function toIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function today(): Date {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function getFilterRange(preset: PeriodPreset): { from: Date; to: Date } {
  const to = today();
  const from = new Date(to);

  switch (preset) {
    case "week":
      from.setDate(from.getDate() - 6);
      break;
    case "3m":
      from.setMonth(from.getMonth() - 3);
      break;
    case "6m":
      from.setMonth(from.getMonth() - 6);
      break;
    case "12m":
      from.setMonth(from.getMonth() - 12);
      break;
    case "month":
    default: {
      from.setDate(1);
      const end = new Date(to.getFullYear(), to.getMonth() + 1, 0);
      return { from, to: end };
    }
  }
  return { from, to };
}

export function formatPeriodLabel(preset: PeriodPreset): {
  title: string;
  range: string;
} {
  const { from, to } = getFilterRange(preset);
  const fmt = (d: Date) =>
    d.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  if (preset === "month") {
    return {
      title: from.toLocaleDateString("ru-RU", { month: "long", year: "numeric" }),
      range: `${fmt(from)} — ${fmt(to)}`,
    };
  }
  if (preset === "week") {
    return { title: "Последние 7 дней", range: `${fmt(from)} — ${fmt(to)}` };
  }
  const labels: Record<string, string> = {
    "3m": "3 месяца",
    "6m": "6 месяцев",
    "12m": "12 месяцев",
  };
  return { title: labels[preset] ?? "", range: `${fmt(from)} — ${fmt(to)}` };
}

export function formatAmount(n: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 2,
  }).format(n);
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
