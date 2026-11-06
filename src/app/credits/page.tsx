import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { PHOTOS } from "@/lib/media/photos";
import { PhotoBanner } from "@/components/media/PhotoBanner";

export default async function CreditsPage() {
  const t = await getTranslations("Credits");

  return (
    <div className="flex flex-1 flex-col">
      <PhotoBanner photo={null} eyebrow={t("eyebrow")} title={t("title")} />
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-10">
        <p className="max-w-2xl font-sans text-base leading-7 text-stone">{t("intro")}</p>
        <ul className="flex flex-col divide-y divide-border border-y border-border">
          {Object.values(PHOTOS).map((photo) => (
            <li key={photo.key} className="flex items-center gap-5 py-4">
              <a
                href={photo.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block size-20 shrink-0 overflow-hidden rounded-md"
              >
                <Image src={photo.image} alt={photo.place} fill sizes="80px" placeholder="blur" className="object-cover" />
              </a>
              <dl className="grid flex-1 gap-x-6 gap-y-1 font-sans text-sm sm:grid-cols-3">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-stone">{t("place")}</dt>
                  <dd className="font-medium text-foreground">{photo.place}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-stone">{t("author")}</dt>
                  <dd className="text-foreground">{photo.author}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-stone">{t("license")}</dt>
                  <dd>
                    <a href={photo.licenseUrl} target="_blank" rel="noopener noreferrer license" className="text-moss-600 hover:underline">
                      {photo.license}
                    </a>
                  </dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
        <p className="font-sans text-sm text-stone">{t("maps")}</p>
      </div>
    </div>
  );
}
