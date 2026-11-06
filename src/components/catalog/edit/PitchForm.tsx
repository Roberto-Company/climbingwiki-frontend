"use client";

import { useTranslations } from "next-intl";
import { savePitchAction } from "@/lib/catalog/actions";
import type { GradeGroup } from "@/lib/catalog/grade-options";
import type { PitchResponse } from "@/lib/types";
import { TextArea } from "@/components/ui/TextArea";
import { TextField } from "@/components/ui/TextField";
import { FormFooter } from "./FormFooter";
import { GradeSelect } from "./GradeSelect";
import { useCatalogForm } from "./useCatalogForm";

type Props = {
  pitch?: PitchResponse;
  routeId: number;
  /** Suggested number for a new pitch (one after the last). */
  nextOrderIndex: number;
  gradeGroups: GradeGroup[];
  cancelHref: string;
  showReviewNote: boolean;
};

export function PitchForm({ pitch, routeId, nextOrderIndex, gradeGroups, cancelHref, showReviewNote }: Props) {
  const t = useTranslations();
  const { state, formAction, pending, value, errorFor } = useCatalogForm(savePitchAction, {
    orderIndex: nextOrderIndex,
    ...pitch,
  });

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {pitch && <input type="hidden" name="id" value={pitch.id} />}
      <input type="hidden" name="routeId" value={routeId} />
      <div className="grid gap-4 sm:grid-cols-4">
        <TextField
          label={t("Catalog.edit.fields.orderIndex")}
          name="orderIndex"
          inputMode="numeric"
          required
          defaultValue={value("orderIndex")}
          error={errorFor("orderIndex")}
        />
        <GradeSelect gradeGroups={gradeGroups} defaultValue={value("gradeId")} error={errorFor("gradeId")} />
        <TextField
          label={t("Catalog.edit.fields.lengthM")}
          name="lengthM"
          inputMode="numeric"
          defaultValue={value("lengthM")}
          error={errorFor("lengthM")}
        />
        <TextField
          label={t("Catalog.edit.fields.boltsCount")}
          name="boltsCount"
          inputMode="numeric"
          defaultValue={value("boltsCount")}
          error={errorFor("boltsCount")}
        />
      </div>
      <TextArea label={t("Common.description")} name="description" rows={2} defaultValue={value("description")} />
      <FormFooter pending={pending} error={state.error} cancelHref={cancelHref} showReviewNote={showReviewNote} />
    </form>
  );
}
