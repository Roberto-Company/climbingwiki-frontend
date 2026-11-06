import { useTranslations } from "next-intl";

type Props = {
  verified: boolean;
  /** Detail pages also show the positive "Verified" mark; lists only flag unverified items. */
  showVerified?: boolean;
};

export function VerificationBadge({ verified, showVerified = false }: Props) {
  const t = useTranslations("Catalog.edit");

  if (verified) {
    return showVerified ? (
      <span className="inline-flex items-center gap-1 rounded-full bg-moss-50 px-2.5 py-0.5 font-sans text-xs font-semibold text-moss-800">
        <span aria-hidden="true">✓</span>
        {t("verified")}
      </span>
    ) : null;
  }

  return (
    <span
      title={t("unverifiedHint")}
      className="inline-flex items-center rounded-full border border-dashed border-ochre-600 bg-ochre-200/60 px-2.5 py-0.5 font-sans text-xs font-semibold text-foreground"
    >
      {t("unverified")}
    </span>
  );
}
