import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Photo } from "@/lib/media/photos";
import { PhotoCredit } from "./PhotoCredit";

export interface Crumb {
  href: string;
  label: string;
}

type Props = {
  photo: Photo | null;
  eyebrow: string;
  title: string;
  crumbs?: readonly Crumb[];
  /** Short facts under the title (rock type, counts…), white on the photo. */
  facts?: ReactNode;
};

/**
 * Full-width page header. With a photo of the place it reads like a guidebook cover; without one
 * it falls back to dark rock with contour lines instead of borrowing an unrelated picture.
 */
export function PhotoBanner({ photo, eyebrow, title, crumbs = [], facts }: Props) {
  return (
    <header className="relative isolate overflow-hidden bg-night text-white">
      {photo ? (
        <Image
          src={photo.image}
          alt=""
          fill
          priority
          placeholder="blur"
          sizes="100vw"
          className="settle -z-10 object-cover"
          style={{ objectPosition: photo.focus ?? "center" }}
        />
      ) : (
        <div className="contours absolute inset-0 -z-10 text-moss-400/30" />
      )}
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-night/90 via-night/45 to-night/10" />

      <div className="mx-auto flex min-h-[clamp(240px,36vh,400px)] w-full max-w-5xl flex-col justify-end px-6 pb-8 pt-16">
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="rise-in mb-3 font-sans text-xs text-white/75">
            <ol className="flex flex-wrap items-center gap-1.5">
              {crumbs.map((crumb) => (
                <li key={crumb.href} className="flex items-center gap-1.5">
                  <Link href={crumb.href} className="hover:text-white hover:underline">
                    {crumb.label}
                  </Link>
                  <span aria-hidden="true">/</span>
                </li>
              ))}
            </ol>
          </nav>
        )}
        <p
          className="rise-in font-sans text-xs font-semibold uppercase tracking-[0.25em] text-ochre-200"
          style={{ "--delay": "60ms" } as React.CSSProperties}
        >
          {eyebrow}
        </p>
        <h1
          className="rise-in mt-2 max-w-3xl font-display text-4xl font-medium leading-tight sm:text-5xl"
          style={{ "--delay": "120ms" } as React.CSSProperties}
        >
          {title}
        </h1>
        {facts && (
          <div
            className="rise-in mt-4 flex flex-wrap gap-x-5 gap-y-1 font-sans text-sm text-white/85"
            style={{ "--delay": "180ms" } as React.CSSProperties}
          >
            {facts}
          </div>
        )}
      </div>
      {photo && <PhotoCredit photo={photo} className="absolute bottom-2 left-3 right-3 text-right sm:left-auto sm:right-4" />}
    </header>
  );
}
