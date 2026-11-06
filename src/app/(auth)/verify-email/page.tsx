import { useTranslations } from "next-intl";
import { VerifyEmailForm } from "@/components/auth/VerifyEmailForm";

export default function VerifyEmailPage() {
  const t = useTranslations("Auth.verify");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-ochre-600">
          {t("eyebrow")}
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-foreground">{t("title")}</h1>
      </div>
      <VerifyEmailForm />
    </div>
  );
}
