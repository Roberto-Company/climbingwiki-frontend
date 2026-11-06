import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Photo } from "@/lib/media/photos";

type Props = {
  href: string;
  title: string;
  photo: Photo | null;
  /** Small line under the title, e.g. "4 escuelas". */
  meta?: ReactNode;
  badges?: ReactNode;
  /** Larger type and a taller image, for the first card of a grid. */
  featured?: boolean;
  sizes?: string;
};

/** A place with its photo: the image zooms a little on hover, the title stays put. */
export function PhotoCard({ href, title, photo, meta, badges, featured = false, sizes = "(min-width: 768px) 33vw, 100vw" }: Props) {
  return (
    <Link
      href={href}
      className="group relative isolate flex h-full min-h-56 flex-col justify-end overflow-hidden rounded-lg bg-night text-white outline-offset-4 focus-visible:outline-2 focus-visible:outline-ochre-400"
    >
      {photo ? (
        <Image
          src={photo.image}
          alt=""
          fill
          placeholder="blur"
          sizes={sizes}
          className="-z-10 object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          style={{ objectPosition: photo.focus ?? "center" }}
        />
      ) : (
        <div className="contours absolute inset-0 -z-10 text-moss-400/35 transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
      )}
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-night/85 via-night/30 to-transparent" />

      {badges && <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">{badges}</div>}
      <div className={featured ? "p-6" : "p-5"}>
        <h3 className={`font-display font-medium leading-tight ${featured ? "text-3xl" : "text-xl"}`}>
          {title}
          <span
            aria-hidden="true"
            className="ml-2 inline-block text-ochre-200 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
          >
            →
          </span>
        </h3>
        {meta && <p className="mt-1 font-sans text-sm text-white/80">{meta}</p>}
      </div>
    </Link>
  );
}
