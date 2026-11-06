import Link from "next/link";
import { useTranslations } from "next-intl";
import { StatusPanel } from "@/components/ui/StatusPanel";

export default function NotFound() {
  const t = useTranslations("Status");

  return (
    <StatusPanel
      eyebrow={t("notFoundEyebrow")}
      title={t("notFoundTitle")}
      body={t("notFoundBody")}
      action={
        <Link
          href="/"
          className="inline-flex rounded-md bg-moss-600 px-5 py-2.5 font-sans text-sm font-semibold text-background transition-colors hover:bg-moss-800"
        >
          {t("backHome")}
        </Link>
      }
    />
  );
}
