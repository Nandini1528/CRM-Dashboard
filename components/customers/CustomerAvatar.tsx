import { cn } from "@/lib/utils";
import { getInitials, getAvatarColor } from "../../lib/avatar";

const SIZE_CLASSES = {
  sm: "w-8 h-8 text-xs",
  md: "w-9 h-9 text-sm",
  lg: "w-20 h-20 text-2xl",
} as const;

interface CustomerAvatarProps {
  name: string;
  size?: keyof typeof SIZE_CLASSES;
  className?: string;
}

export function CustomerAvatar({ name, size = "md", className }: CustomerAvatarProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium shrink-0",
        SIZE_CLASSES[size],
        getAvatarColor(name),
        className
      )}
      aria-hidden="true"
    >
      {getInitials(name)}
    </span>
  );
}