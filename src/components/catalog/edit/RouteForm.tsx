"use client";

import { useTranslations } from "next-intl";
import { saveRouteAction } from "@/lib/catalog/actions";
import type { GradeGroup } from "@/lib/catalog/grade-options";
import type { RouteResponse, RouteType } from "@/lib/types";
import { SelectField } from "@/components/ui/SelectField";
import { TextArea } from "@/components/ui/TextArea";
import { TextField } from "@/components/ui/TextField";
import { CoordinateFields } from "./CoordinateFields";
import { FormFooter } from "./FormFooter";
import { GradeSelect } from "./GradeSelect";
import { useCatalogForm } from "./useCatalogForm";

const ROUTE_TYPES: RouteType[] = ["SPORT", "TRAD", "BOULDER"];

type Props = {
  route?: RouteResponse;
  sectorId: number;
  /** Ids of the route's current tags, so saving doesn't drop them (the API replaces the whole route). */
  tagIds: number[];
  gradeGroups: GradeGroup[];
  cancelHref: string;
  showReviewNote: boolean;
};

export function RouteForm({ route, sectorId, tagIds, gradeGroups, cancelHref, showReviewNote }: Props) {
  const t = useTranslations();
  const { state, formAction, pending, value, errorFor } = useCatalogForm(saveRouteAction, {
    routeType: "SPORT",
    ...route,
  });
  const isNew = route === undefined;

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {route && <input type="hidden" name="id" value={route.id} />}
      <input type="hidden" name="sectorId" value={sectorId} />
      <input type="hidden" name="tagIds" value={tagIds.join(",")} />
      <div className="grid gap-4 sm:grid-cols-[1fr_12rem]">
        <TextField
          label={t("Catalog.edit.fields.name")}
          name="name"
          required
          maxLength={150}
          defaultValue={value("name")}
          error={errorFor("name")}
        />
        <SelectField
          label={t("Catalog.edit.fields.routeType")}
          name="routeType"
          defaultValue={value("routeType")}
          error={errorFor("routeType")}
        >
          {ROUTE_TYPES.map((type) => (
            <option key={type} value={type}>
              {t(`Catalog.routeTypes.${type}`)}
            </option>
          ))}
        </SelectField>
      </div>

      {isNew && (
        <fieldset className="flex flex-col gap-2 rounded-lg border border-border bg-surface px-4 py-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <GradeSelect gradeGroups={gradeGroups} defaultValue={value("gradeId")} error={errorFor("gradeId")} />
            <TextField
              label={t("Catalog.edit.fields.lengthM")}
              name="lengthM"
              inputMode="numeric"
              defaultValue={value("lengthM")}
              error={errorFor("lengthM")}
            />
          </div>
          <p className="font-sans text-xs text-stone">{t("Catalog.edit.fields.firstPitchHint")}</p>
        </fieldset>
      )}

      <TextArea label={t("Common.description")} name="description" defaultValue={value("description")} />
      <TextArea
        label={t("Catalog.edit.fields.equipmentNotes")}
        name="equipmentNotes"
        rows={2}
        defaultValue={value("equipmentNotes")}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label={t("Catalog.edit.fields.firstAscentBy")}
          name="firstAscentBy"
          maxLength={150}
          defaultValue={value("firstAscentBy")}
          error={errorFor("firstAscentBy")}
        />
        <TextField
          label={t("Catalog.edit.fields.firstAscentDate")}
          name="firstAscentDate"
          type="date"
          defaultValue={value("firstAscentDate")}
          error={errorFor("firstAscentDate")}
        />
      </div>
      <CoordinateFields value={value} errorFor={errorFor} />
      <FormFooter pending={pending} error={state.error} cancelHref={cancelHref} showReviewNote={showReviewNote} />
    </form>
  );
}
