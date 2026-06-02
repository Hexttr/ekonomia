import type { SVGProps } from "react";

export const CATEGORY_ICON_IDS = [
  "food",
  "clothes",
  "shopping",
  "fuel",
  "it",
  "utilities",
  "transport",
  "health",
  "pharmacy",
  "entertainment",
  "home",
  "education",
  "pets",
  "travel",
  "gifts",
  "kids",
  "sports",
  "beauty",
  "coffee",
  "subscriptions",
  "repair",
  "taxes",
  "other",
] as const;

export type CategoryIconId = (typeof CATEGORY_ICON_IDS)[number];

type IconProps = SVGProps<SVGSVGElement>;

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function FoodIcon(p: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} {...p}>
      <path d="M12 3c-2 4-6 5-6 10a6 6 0 0 0 12 0c0-5-4-6-6-10z" />
      <path d="M12 14v4" />
    </svg>
  );
}

function ClothesIcon(p: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} {...p}>
      <path d="M16 4l3 3-5 4v11H10V11L5 7l3-3 4 3 4-3z" />
    </svg>
  );
}

function ShoppingIcon(p: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} {...p}>
      <circle cx="9" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
      <path d="M2 4h2l2 12h11l2-8H6" />
    </svg>
  );
}

function FuelIcon(p: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} {...p}>
      <path d="M6 20V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v14" />
      <path d="M6 10h8M14 6h2a2 2 0 0 1 2 2v6h2l2 3v3h-6" />
    </svg>
  );
}

function ItIcon(p: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} {...p}>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  );
}

function UtilitiesIcon(p: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} {...p}>
      <path d="M13 2L4 14h7l-1 8 10-14h-7l0-6z" />
    </svg>
  );
}

function TransportIcon(p: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} {...p}>
      <path d="M4 16h16l-1-5H5l-1 5zM6 11V7h12v4" />
      <circle cx="7" cy="17" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="17" cy="17" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function HealthIcon(p: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} {...p}>
      <path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.5-7 10-7 10z" />
      <path d="M12 11v4M10 13h4" />
    </svg>
  );
}

function EntertainmentIcon(p: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} {...p}>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M8 10l3 2-3 2V10zM14 14h4" />
    </svg>
  );
}

function HomeIcon(p: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} {...p}>
      <path d="M4 11l8-7 8 7v9H4v-9z" />
      <path d="M10 20v-5h4v5" />
    </svg>
  );
}

function EducationIcon(p: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} {...p}>
      <path d="M3 9l9-5 9 5-9 5-9-5z" />
      <path d="M21 10v6M6 12v5c0 2 12 2 12 0v-5" />
    </svg>
  );
}

function PetsIcon(p: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} {...p}>
      <circle cx="8" cy="9" r="2" />
      <circle cx="16" cy="9" r="2" />
      <circle cx="6" cy="14" r="2" />
      <circle cx="18" cy="14" r="2" />
      <path d="M12 17c-3 0-5 2-5 4h10c0-2-2-4-5-4z" />
    </svg>
  );
}

function TravelIcon(p: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} {...p}>
      <path d="M3 12l18-7-7 18-2-7-7-2z" />
    </svg>
  );
}

function GiftsIcon(p: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} {...p}>
      <rect x="4" y="10" width="16" height="10" rx="1" />
      <path d="M12 10V20M4 10h16M8 10c0-2 1-4 4-4s4 2 4 4" />
    </svg>
  );
}

function KidsIcon(p: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} {...p}>
      <circle cx="12" cy="8" r="3" />
      <path d="M6 20v-1a6 6 0 0 1 12 0v1" />
    </svg>
  );
}

function SportsIcon(p: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3c2 3 2 15 0 18M3 12h18M5 7h14M5 17h14" />
    </svg>
  );
}

function BeautyIcon(p: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} {...p}>
      <path d="M12 3v8M9 6l3 5 3-5" />
      <path d="M8 14h8l-1 7H9l-1-7z" />
    </svg>
  );
}

function CoffeeIcon(p: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} {...p}>
      <path d="M6 8h10v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8z" />
      <path d="M16 10h2a2 2 0 0 1 0 4h-2M6 4v2M10 4v2M14 4v2" />
    </svg>
  );
}

function SubscriptionsIcon(p: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} {...p}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 12h8M12 8v8" />
    </svg>
  );
}

function PharmacyIcon(p: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} {...p}>
      <path d="M8 4h8v16H8V4zM4 8h16v8H4V8z" />
    </svg>
  );
}

function RepairIcon(p: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} {...p}>
      <path d="M14 4l6 6-8 8-6-6 8-8zM6 14l-2 6 6-2" />
    </svg>
  );
}

function TaxesIcon(p: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} {...p}>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 9h8M8 13h5" />
    </svg>
  );
}

function OtherIcon(p: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...stroke} {...p}>
      <circle cx="6" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="18" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export const CATEGORY_ICON_MAP: Record<
  CategoryIconId,
  { label: string; Icon: (p: IconProps) => React.JSX.Element }
> = {
  food: { label: "Еда", Icon: FoodIcon },
  clothes: { label: "Одежда", Icon: ClothesIcon },
  shopping: { label: "Покупки", Icon: ShoppingIcon },
  fuel: { label: "Топливо", Icon: FuelIcon },
  it: { label: "IT", Icon: ItIcon },
  utilities: { label: "ЖКХ", Icon: UtilitiesIcon },
  transport: { label: "Транспорт", Icon: TransportIcon },
  health: { label: "Здоровье", Icon: HealthIcon },
  pharmacy: { label: "Аптека", Icon: PharmacyIcon },
  entertainment: { label: "Развлечения", Icon: EntertainmentIcon },
  home: { label: "Дом", Icon: HomeIcon },
  education: { label: "Обучение", Icon: EducationIcon },
  pets: { label: "Питомцы", Icon: PetsIcon },
  travel: { label: "Путешествия", Icon: TravelIcon },
  gifts: { label: "Подарки", Icon: GiftsIcon },
  kids: { label: "Дети", Icon: KidsIcon },
  sports: { label: "Спорт", Icon: SportsIcon },
  beauty: { label: "Красота", Icon: BeautyIcon },
  coffee: { label: "Кафе", Icon: CoffeeIcon },
  subscriptions: { label: "Подписки", Icon: SubscriptionsIcon },
  repair: { label: "Ремонт", Icon: RepairIcon },
  taxes: { label: "Налоги", Icon: TaxesIcon },
  other: { label: "Прочее", Icon: OtherIcon },
};

export const CATEGORY_ICON_OPTIONS: { id: CategoryIconId; label: string }[] = CATEGORY_ICON_IDS.map(
  (id) => ({ id, label: CATEGORY_ICON_MAP[id].label })
);

export function isCategoryIconId(id: string | null | undefined): id is CategoryIconId {
  return Boolean(id && id in CATEGORY_ICON_MAP);
}
