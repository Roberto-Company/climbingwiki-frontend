import Link from "next/link";
import { useTranslations } from "next-intl";
import type { CatalogKind } from "@/lib/api/catalog-writes";
import type { Session } from "@/lib/auth/session";
import { canEditCatalogItem, canVerifyCatalogItems } from "@/lib/auth/roles";
import { DeleteItemButton } from "./DeleteItemButton";
import { VerifyButton } from "./VerifyButton";

type Props = {
  kind: CatalogKind;
  item: { id: number; createdById: number | null; verified: boolean };
  session: Session | null;
  /** Omit when the item is edited elsewhere. */
  editHref?: string;
  /** Page shown after deleting (usually the parent). */
  afterDeletePath: string;
  /** Page to refresh after verifying. */
  pagePath: string;
};

/** Edit / delete / verify controls, shown only to people the API will allow. */
export function CatalogItemToolbar({ kind, item, session, editHref, afterDeletePath, pagePath }: Props) {
  const t = useTranslations("Common");
  const canEdit = canEditCatalogItem(session, item);
  const canVerify = canVerifyCatalogItems(session);

  if (!canEdit && !canVerify) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-start gap-2">
      {canEdit && editHref && (
        <Link
          href={editHref}
          className="rounded-md px-3 py-1.5 font-sans text-sm font-semibold text-moss-600 transition-colors hover:bg-moss-50"
        >
          {t("edit")}
        </Link>
      )}
      {canEdit && <DeleteItemButton kind={kind} id={item.id} redirectTo={afterDeletePath} />}
      {canVerify && <VerifyButton kind={kind} id={item.id} verified={item.verified} pagePath={pagePath} />}
    </div>
  );
}
