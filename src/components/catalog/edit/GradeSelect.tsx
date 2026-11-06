import { useTranslations } from "next-intl";
import type { GradeGroup } from "@/lib/catalog/grade-options";
import { SelectField } from "@/components/ui/SelectField";

type Props = {
  gradeGroups: GradeGroup[];
  defaultValue: string;
  error?: string;
};

export function GradeSelect({ gradeGroups, defaultValue, error }: Props) {
  const t = useTranslations("Catalog.edit.fields");

  return (
    <SelectField label={t("grade")} name="gradeId" defaultValue={defaultValue} error={error}>
      <option value="">{t("noGrade")}</option>
      {gradeGroups.map((group) => (
        <optgroup key={group.system} label={group.system}>
          {group.grades.map((grade) => (
            <option key={grade.id} value={grade.id}>
              {grade.label}
            </option>
          ))}
        </optgroup>
      ))}
    </SelectField>
  );
}
