import { getTranslations } from "next-intl/server";
import { LoginForm } from "@/components/auth/LoginForm";
import { FormMessage } from "@/components/ui/FormMessage";

type Props = {
  searchParams: Promise<{ registered?: string; reset?: string; expired?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const [{ registered, reset, expired }, t] = await Promise.all([searchParams, getTranslations("Auth.login")]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-ochre-600">
          {t("eyebrow")}
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-foreground">{t("title")}</h1>
      </div>
      {registered && (
        <FormMessage variant="success">{t("registered")}</FormMessage>
      )}
      {expired && <FormMessage variant="info">{t("expired")}</FormMessage>}
      {reset && (
        <FormMessage variant="success">{t("reset")}</FormMessage>
      )}
      <LoginForm />
    </div>
  );
}
