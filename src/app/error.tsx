"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { StatusPanel } from "@/components/ui/StatusPanel";
import { useBackendWake } from "@/lib/api/use-backend-wake";

type Props = {
  error: Error & { digest?: string };
  retry: () => void;
};

/**
 * A failed page is often just the API waking up on free hosting. Check that first: if it's asleep,
 * wait for it and reload by itself; otherwise show the error.
 */
export default function ErrorPage({ error, retry }: Props) {
  const t = useTranslations("Status");
  const phase = useBackendWake(retry, error);

  useEffect(() => {
    // Keeps the digest visible in the browser console so it can be matched with the server logs.
    console.error(error);
  }, [error]);

  if (phase === "checking") {
    return <StatusPanel eyebrow={t("checkingEyebrow")} title={t("checkingTitle")} body={t("checkingBody")} />;
  }

  if (phase === "waking") {
    return <StatusPanel eyebrow={t("wakingEyebrow")} title={t("wakingTitle")} body={t("wakingBody")} />;
  }

  const retryButton = <Button onClick={() => retry()}>{t("retry")}</Button>;

  if (phase === "gaveUp") {
    return (
      <StatusPanel eyebrow={t("errorEyebrow")} title={t("gaveUpTitle")} body={t("gaveUpBody")} action={retryButton} />
    );
  }

  return <StatusPanel eyebrow={t("errorEyebrow")} title={t("errorTitle")} body={t("errorBody")} action={retryButton} />;
}
