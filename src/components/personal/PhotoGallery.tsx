import { useTranslations } from "next-intl";
import type { PhotoResponse } from "@/lib/types";
import type { Session } from "@/lib/auth/session";
import { canModify } from "@/lib/auth/roles";
import { isSafeHttpUrl } from "@/lib/url";
import { EmptyState } from "@/components/catalog/EmptyState";
import { PhotoDeleteButton } from "./PhotoDeleteButton";

type Props = {
  photos: PhotoResponse[];
  session: Session | null;
};

export function PhotoGallery({ photos, session }: Props) {
  const t = useTranslations("Personal.photos");

  if (photos.length === 0) {
    return <EmptyState message={t("empty")} />;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {photos.map((photo) => (
        <figure key={photo.id} className="flex flex-col gap-1">
          {isSafeHttpUrl(photo.url) && (
            // eslint-disable-next-line @next/next/no-img-element -- arbitrary user-supplied URLs, no upload/optimization pipeline (D29)
            <img
              src={photo.url}
              alt={photo.caption ?? t("alt")}
              width={400}
              height={300}
              loading="lazy"
              className="aspect-[4/3] w-full rounded-lg object-cover"
            />
          )}
          {photo.isTopo && (
            <span className="self-start rounded-full bg-ochre-50 px-2 py-0.5 font-sans text-xs font-semibold uppercase tracking-wide text-ochre-600">
              {t("topo")}
            </span>
          )}
          {photo.caption && <figcaption className="font-sans text-xs text-stone">{photo.caption}</figcaption>}
          {canModify(session, photo.userId) && <PhotoDeleteButton id={photo.id} routeId={photo.routeId} />}
        </figure>
      ))}
    </div>
  );
}
