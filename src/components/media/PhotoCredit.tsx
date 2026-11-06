import { useTranslations } from "next-intl";
import type { Photo } from "@/lib/media/photos";

type Props = {
  photo: Photo;
  /** "overlay" sits on the photo itself; "plain" goes under it on the page background. */
  variant?: "overlay" | "plain";
  className?: string;
};

/** Place, author and licence, as the CC licences require; links to the original file. */
export function PhotoCredit({ photo, variant = "overlay", className = "" }: Props) {
  const t = useTranslations("Media");
  const tone =
    variant === "overlay"
      ? "text-white/75 [text-shadow:0_1px_2px_rgb(0_0_0/0.6)] hover:text-white"
      : "text-stone hover:text-foreground";

  return (
    <p className={`font-sans text-[11px] leading-4 ${tone} ${className}`}>
      <a href={photo.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline">
        {t("credit", { place: photo.place, author: photo.author })}
      </a>
      {" · "}
      <a href={photo.licenseUrl} target="_blank" rel="noopener noreferrer license" className="underline-offset-2 hover:underline">
        {photo.license}
      </a>
    </p>
  );
}
