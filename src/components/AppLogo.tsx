import { cn } from "@/lib/cn";

const sizes = {
  sm: "h-11 w-11 rounded-xl",
  lg: "h-[8.5rem] w-[8.5rem] rounded-3xl",
} as const;

const dimensions = { sm: 44, lg: 136 } as const;

type Props = {
  size?: keyof typeof sizes;
  className?: string;
};

/** Логотип «фига» — PNG из public/logo-mark.png */
export function AppLogo({ size = "sm", className }: Props) {
  const px = dimensions[size];
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden shadow-lg shadow-emerald-500/15 ring-1 ring-emerald-500/40 ring-offset-2 ring-offset-[#0f1114]",
        sizes[size],
        className
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-mark.png"
        alt=""
        width={px}
        height={px}
        className="h-full w-full object-cover"
        decoding="async"
        fetchPriority={size === "lg" ? "high" : undefined}
      />
    </div>
  );
}
