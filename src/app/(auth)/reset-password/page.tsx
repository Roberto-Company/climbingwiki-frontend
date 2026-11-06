import { getTranslations } from "next-intl/server";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

type Props = {
  searchParams: Promise<{ token?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: Props) {
  const [{ token }, t] = await Promise.all([searchParams, getTranslations("Auth.reset")]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-ochre-600">
          {t("eyebrow")}
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-foreground">{t("title")}</h1>
      </div>
      <ResetPasswordForm defaultToken={token} />
    </div>
  );
}
