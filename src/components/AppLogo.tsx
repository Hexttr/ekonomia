import { cn } from "@/lib/cn";

const sizes = {
  sm: "h-12 w-12 rounded-2xl",
  lg: "h-[8.5rem] w-[8.5rem] rounded-3xl",
} as const;

const dimensions = { sm: 48, lg: 136 } as const;

type Props = {
  size?: keyof typeof sizes;
  className?: string;
};

/** Белая плитка с «фигой» */
export function AppLogo({ size = "sm", className }: Props) {
  const px = dimensions[size];
  return (
    <div
      className={cn("relative shrink-0 overflow-hidden bg-white", sizes[size], className)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-mark.png"
        alt=""
        width={px}
        height={px}
        className="h-full w-full object-contain p-0.5"
        decoding="async"
        fetchPriority={size === "lg" ? "high" : undefined}
      />
    </div>
  );
}
