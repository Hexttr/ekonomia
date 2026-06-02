import { cn } from "@/lib/cn";
import { isCategoryIconId } from "@/lib/category-icons";
import { CATEGORY_ICON_MAP } from "@/lib/category-icons";
import { categoryInitials } from "@/lib/format";

type Props = {
  name: string;
  color: string;
  icon?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClass = {
  sm: "h-9 w-9 rounded-lg [&_svg]:h-4 [&_svg]:w-4 text-[10px]",
  md: "h-11 w-11 rounded-xl [&_svg]:h-[1.35rem] [&_svg]:w-[1.35rem] text-[11px]",
  lg: "h-11 w-11 rounded-xl [&_svg]:h-[1.35rem] [&_svg]:w-[1.35rem] text-xs",
} as const;

export function CategoryIcon({ name, color, icon, size = "md", className }: Props) {
  const entry = icon && isCategoryIconId(icon) ? CATEGORY_ICON_MAP[icon] : null;

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center font-bold text-white",
        sizeClass[size],
        className
      )}
      style={{ background: color }}
    >
      {entry ? <entry.Icon className="shrink-0" aria-hidden /> : categoryInitials(name)}
    </div>
  );
}
