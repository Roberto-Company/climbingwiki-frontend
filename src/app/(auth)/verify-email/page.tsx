import { getTranslations } from "next-intl/server";
import { VerifyEmailForm } from "@/components/auth/VerifyEmailForm";

type Props = {
  searchParams: Promise<{ token?: string }>;
};

export default async function VerifyEmailPage({ searchParams }: Props) {
  const [{ token }, t] = await Promise.all([searchParams, getTranslations("Auth.verify")]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-ochre-600">
          {t("eyebrow")}
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-foreground">{t("title")}</h1>
      </div>
      <VerifyEmailForm defaultToken={token} />
    </div>
  );
}
