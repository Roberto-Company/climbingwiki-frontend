import Image from "next/image";
import { avatarColor, avatarSrc, displayName, initials, type AvatarUser } from "@/lib/users/avatar";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

const SIZES: Record<AvatarSize, { px: number; text: string }> = {
  xs: { px: 24, text: "text-[10px]" },
  sm: { px: 32, text: "text-xs" },
  md: { px: 44, text: "text-sm" },
  lg: { px: 72, text: "text-xl" },
  xl: { px: 128, text: "text-4xl" },
};

type Props = {
  user: AvatarUser;
  size?: AvatarSize;
  className?: string;
  /** Leave false when the name is printed right next to the picture, so screen readers don't read it twice. */
  labelled?: boolean;
};

/** A user's picture, or their initials on a colour derived from the username. */
export function Avatar({ user, size = "md", className = "", labelled = false }: Props) {
  const { px, text } = SIZES[size];
  const src = avatarSrc(user);
  const label = labelled ? displayName(user) : undefined;
  const base = `relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full ring-2 ring-background ${className}`;

  if (src) {
    return (
      <span className={base} style={{ width: px, height: px }}>
        <Image
          src={src}
          alt={label ?? ""}
          width={px}
          height={px}
          unoptimized
          className="h-full w-full object-cover"
        />
      </span>
    );
  }

  return (
    <span
      className={`${base} select-none font-sans font-semibold tracking-wide text-white ${text}`}
      style={{ width: px, height: px, backgroundColor: avatarColor(user.username) }}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {initials(user)}
    </span>
  );
}
