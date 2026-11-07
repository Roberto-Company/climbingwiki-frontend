import { getFormatter, getTranslations } from "next-intl/server";
import Link from "next/link";
import type { ReactNode } from "react";
import { getUser } from "@/lib/api";
import { logoutAction } from "@/lib/auth/actions";
import { verifySession } from "@/lib/auth/dal";
import { AvatarUploader } from "@/components/users/AvatarUploader";
import { ProfileForm } from "@/components/users/ProfileForm";
import { Button } from "@/components/ui/Button";

/** Account settings: picture, public profile fields and account details. */
export default async function ProfilePage() {
  const [session, t, format] = await Promise.all([verifySession(), getTranslations(), getFormatter()]);
  const user = await getUser(session.userId, session.token);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-ochre-600">
            {t("Common.yourAccount")}
          </p>
          <h1 className="mt-2 font-display text-3xl font-medium text-foreground">{t("Account.settings.title")}</h1>
        </div>
        <Link
          href={`/users/${user.id}`}
          className="font-sans text-sm font-semibold text-moss-600 underline-offset-4 hover:text-moss-800 hover:underline"
        >
          {t("Account.settings.viewPublic")} →
        </Link>
      </div>

      <Section title={t("Account.settings.picture")} description={t("Account.settings.pictureDescription")}>
        <AvatarUploader user={user} />
      </Section>

      <Section title={t("Account.settings.publicProfile")} description={t("Account.settings.publicDescription")}>
        <ProfileForm fullName={user.fullName} bio={user.bio} />
      </Section>

      <Section title={t("Account.settings.account")}>
        <dl className="grid gap-x-8 gap-y-4 font-sans text-sm sm:grid-cols-2">
          <Detail label={t("Account.settings.username")} value={`@${user.username}`} />
          <Detail label={t("Account.settings.email")} value={user.email ?? "—"} />
          <Detail label={t("Account.settings.role")} value={t(`Roles.${user.role}`)} />
          <Detail
            label={t("Account.settings.memberSince")}
            value={format.dateTime(new Date(user.createdAt), { year: "numeric", month: "long", day: "numeric" })}
          />
        </dl>
        <p className="mt-4 font-sans text-xs text-stone">{t("Account.settings.usernameFixed")}</p>
      </Section>

      <form action={logoutAction} className="self-start">
        <Button type="submit" variant="ghost">
          {t("Account.profile.logOut")}
        </Button>
      </form>
    </div>
  );
}

function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="grid gap-5 rounded-xl border border-border bg-surface/60 p-6 md:grid-cols-[13rem_1fr] md:gap-8">
      <div>
        <h2 className="font-display text-lg font-medium text-foreground">{title}</h2>
        {description && <p className="mt-1 font-sans text-sm text-stone">{description}</p>}
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-stone">{label}</dt>
      <dd className="mt-1 break-words text-foreground">{value}</dd>
    </div>
  );
}
