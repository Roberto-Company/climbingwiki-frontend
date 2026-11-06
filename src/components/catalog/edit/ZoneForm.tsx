"use client";

import { useTranslations } from "next-intl";
import { saveZoneAction } from "@/lib/catalog/actions";
import type { ZoneResponse } from "@/lib/types";
import { TextArea } from "@/components/ui/TextArea";
import { TextField } from "@/components/ui/TextField";
import { FormFooter } from "./FormFooter";
import { useCatalogForm } from "./useCatalogForm";

type Props = {
  zone?: ZoneResponse;
  parentZoneId: number | null;
  cancelHref: string;
  showReviewNote: boolean;
};

export function ZoneForm({ zone, parentZoneId, cancelHref, showReviewNote }: Props) {
  const t = useTranslations();
  const { state, formAction, pending, value, errorFor } = useCatalogForm(saveZoneAction, { ...zone });

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {zone && <input type="hidden" name="id" value={zone.id} />}
      {parentZoneId !== null && <input type="hidden" name="parentZoneId" value={parentZoneId} />}
      <TextField
        label={t("Catalog.edit.fields.name")}
        name="name"
        required
        maxLength={150}
        defaultValue={value("name")}
        error={errorFor("name")}
      />
      <TextArea label={t("Common.description")} name="description" defaultValue={value("description")} />
      <FormFooter pending={pending} error={state.error} cancelHref={cancelHref} showReviewNote={showReviewNote} />
    </form>
  );
}
