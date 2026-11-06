"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { StatusPanel } from "@/components/ui/StatusPanel";

type Props = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

export default function ErrorPage({ error, unstable_retry }: Props) {
  const t = useTranslations("Status");

  useEffect(() => {
    // Keeps the digest visible in the browser console so it can be matched with the server logs.
    console.error(error);
  }, [error]);

  return (
    <StatusPanel
      eyebrow={t("errorEyebrow")}
      title={t("errorTitle")}
      body={t("errorBody")}
      action={<Button onClick={() => unstable_retry()}>{t("retry")}</Button>}
    />
  );
}
