"use client";

import { useTranslations } from "next-intl";
import { saveSectorAction } from "@/lib/catalog/actions";
import type { SectorResponse } from "@/lib/types";
import { TextArea } from "@/components/ui/TextArea";
import { TextField } from "@/components/ui/TextField";
import { CoordinateFields } from "./CoordinateFields";
import { FormFooter } from "./FormFooter";
import { useCatalogForm } from "./useCatalogForm";

type Props = {
  sector?: SectorResponse;
  cragId: number;
  cancelHref: string;
  showReviewNote: boolean;
};

export function SectorForm({ sector, cragId, cancelHref, showReviewNote }: Props) {
  const t = useTranslations();
  const { state, formAction, pending, value, errorFor } = useCatalogForm(saveSectorAction, { ...sector });

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {sector && <input type="hidden" name="id" value={sector.id} />}
      <input type="hidden" name="cragId" value={cragId} />
      <TextField
        label={t("Catalog.edit.fields.name")}
        name="name"
        required
        maxLength={150}
        defaultValue={value("name")}
        error={errorFor("name")}
      />
      <TextArea label={t("Common.description")} name="description" defaultValue={value("description")} />
      <CoordinateFields value={value} errorFor={errorFor} />
      <FormFooter pending={pending} error={state.error} cancelHref={cancelHref} showReviewNote={showReviewNote} />
    </form>
  );
}
