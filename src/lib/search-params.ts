import type { PeriodPreset } from "./constants";
import { PERIOD_OPTIONS } from "./constants";

export function parsePeriod(value?: string): PeriodPreset {
  const found = PERIOD_OPTIONS.find((o) => o.value === value);
  return found?.value ?? "month";
}

export function parseCategoryId(value?: string): string | null {
  return value && value.length > 0 ? value : null;
}
