import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { FormMessage } from "@/components/ui/FormMessage";

type Props = {
  pending: boolean;
  error?: string;
  cancelHref: string;
  /** Regular users see that their additions wait for review. */
  showReviewNote: boolean;
};

export function FormFooter({ pending, error, cancelHref, showReviewNote }: Props) {
  const t = useTranslations();

  return (
    <div className="flex flex-col gap-4 border-t border-border pt-5">
      {showReviewNote && <p className="font-sans text-sm text-stone">{t("Catalog.edit.reviewNote")}</p>}
      {error && <FormMessage variant="error">{error}</FormMessage>}
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? t("Common.saving") : t("Common.save")}
        </Button>
        <Link
          href={cancelHref}
          className="rounded-md px-4 py-2.5 font-sans text-sm font-semibold text-moss-600 transition-colors hover:bg-moss-50"
        >
          {t("Common.cancel")}
        </Link>
      </div>
    </div>
  );
}
