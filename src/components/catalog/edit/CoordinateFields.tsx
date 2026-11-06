import { useTranslations } from "next-intl";
import { TextField } from "@/components/ui/TextField";

type Props = {
  value: (name: string) => string;
  errorFor: (name: string) => string | undefined;
};

export function CoordinateFields({ value, errorFor }: Props) {
  const t = useTranslations("Catalog.edit.fields");

  return (
    <fieldset className="flex flex-col gap-2">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label={t("latitude")}
          name="latitude"
          inputMode="decimal"
          defaultValue={value("latitude")}
          error={errorFor("latitude")}
        />
        <TextField
          label={t("longitude")}
          name="longitude"
          inputMode="decimal"
          defaultValue={value("longitude")}
          error={errorFor("longitude")}
        />
      </div>
      <p className="font-sans text-xs text-stone">{t("coordinatesHint")}</p>
    </fieldset>
  );
}
