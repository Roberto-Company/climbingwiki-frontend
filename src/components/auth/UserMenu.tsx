"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";
import { logoutAction } from "@/lib/auth/actions";
import { hasMinRole } from "@/lib/auth/roles";
import { displayName } from "@/lib/users/avatar";
import type { CurrentUser } from "@/lib/users/current-user";
import { Avatar } from "@/components/users/Avatar";

type Props = {
  user: CurrentUser;
};

const ITEM =
  "flex w-full items-center rounded-md px-3 py-2 text-left font-sans text-sm text-foreground transition-colors hover:bg-moss-50 hover:text-moss-800 focus-visible:bg-moss-50 focus-visible:outline-none";

/** Avatar button in the header that opens the personal pages. Closes on Escape, outside click and navigation. */
export function UserMenu({ user }: Props) {
  const t = useTranslations("Nav");
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const pathname = usePathname();
  const [openedAt, setOpenedAt] = useState(pathname);

  // Close after a link inside the menu navigates (compared during render, no effect needed).
  if (isOpen && openedAt !== pathname) {
    setIsOpen(false);
  }

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    function handlePointer(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isOpen]);

  function toggle() {
    setOpenedAt(pathname);
    setIsOpen((open) => !open);
  }

  const links = [
    { href: `/users/${user.id}`, label: t("yourProfile") },
    { href: "/logbook", label: t("logbook") },
    { href: "/favorites", label: t("favorites") },
    { href: "/lists", label: t("lists") },
    { href: "/follows", label: t("following") },
  ];

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-label={t("openMenu", { name: displayName(user) })}
        className="group flex items-center gap-2 rounded-full py-0.5 pl-0.5 pr-2.5 font-sans text-sm font-medium text-foreground transition-colors hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ochre-400"
      >
        <Avatar user={user} size="sm" />
        <span className="hidden max-w-32 truncate sm:inline">{user.username}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 12 12"
          className={`h-3 w-3 text-stone transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {isOpen && (
        <div
          id={menuId}
          className="menu-in absolute right-0 top-full z-50 mt-2 w-64 origin-top-right rounded-xl border border-border bg-background p-1.5 shadow-[0_18px_40px_-12px_rgba(31,42,29,0.35)]"
        >
          <div className="flex items-center gap-3 px-3 pb-3 pt-2">
            <Avatar user={user} size="md" />
            <div className="min-w-0">
              <p className="truncate font-display text-base font-medium text-foreground">{displayName(user)}</p>
              <p className="truncate font-sans text-xs text-stone">@{user.username}</p>
            </div>
          </div>
          <nav aria-label={t("personal")} className="border-t border-border/70 pt-1.5">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className={ITEM} aria-current={pathname === link.href ? "page" : undefined}>
                {link.label}
              </Link>
            ))}
            {hasMinRole(user.role, "MODERATOR") && (
              <Link href="/moderation" className={`${ITEM} text-ochre-600`}>
                {t("review")}
              </Link>
            )}
          </nav>
          <div className="mt-1.5 border-t border-border/70 pt-1.5">
            <Link href="/profile" className={ITEM}>
              {t("settings")}
            </Link>
            <form action={logoutAction}>
              <button type="submit" className={`${ITEM} text-stone`}>
                {t("logOut")}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
