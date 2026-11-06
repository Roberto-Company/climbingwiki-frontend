"use client";

import { useTranslations } from "next-intl";
import { saveCragAction } from "@/lib/catalog/actions";
import type { CragResponse } from "@/lib/types";
import { TextArea } from "@/components/ui/TextArea";
import { TextField } from "@/components/ui/TextField";
import { CoordinateFields } from "./CoordinateFields";
import { FormFooter } from "./FormFooter";
import { useCatalogForm } from "./useCatalogForm";

type Props = {
  crag?: CragResponse;
  zoneId: number | null;
  cancelHref: string;
  showReviewNote: boolean;
};

export function CragForm({ crag, zoneId, cancelHref, showReviewNote }: Props) {
  const t = useTranslations();
  const { state, formAction, pending, value, errorFor } = useCatalogForm(saveCragAction, { ...crag });

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {crag && <input type="hidden" name="id" value={crag.id} />}
      {zoneId !== null && <input type="hidden" name="zoneId" value={zoneId} />}
      <TextField
        label={t("Catalog.edit.fields.name")}
        name="name"
        required
        maxLength={150}
        defaultValue={value("name")}
        error={errorFor("name")}
      />
      <TextArea label={t("Common.description")} name="description" defaultValue={value("description")} />
      <div className="grid gap-4 sm:grid-cols-3">
        <TextField
          label={t("Catalog.edit.fields.rockType")}
          name="rockType"
          maxLength={100}
          defaultValue={value("rockType")}
          error={errorFor("rockType")}
        />
        <TextField
          label={t("Catalog.edit.fields.orientation")}
          name="orientation"
          maxLength={20}
          placeholder={t("Catalog.edit.fields.orientationHint")}
          defaultValue={value("orientation")}
          error={errorFor("orientation")}
        />
        <TextField
          label={t("Catalog.edit.fields.altitudeM")}
          name="altitudeM"
          inputMode="numeric"
          defaultValue={value("altitudeM")}
          error={errorFor("altitudeM")}
        />
      </div>
      <TextArea
        label={t("Catalog.edit.fields.approachDescription")}
        name="approachDescription"
        rows={3}
        defaultValue={value("approachDescription")}
      />
      <CoordinateFields value={value} errorFor={errorFor} />
      <FormFooter pending={pending} error={state.error} cancelHref={cancelHref} showReviewNote={showReviewNote} />
    </form>
  );
}
