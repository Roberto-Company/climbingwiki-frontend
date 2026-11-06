import Image from "next/image";
import { PHOTOS } from "@/lib/media/photos";
import { PhotoCredit } from "@/components/media/PhotoCredit";

const PHOTO = PHOTOS["climber-on-granite"];

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="grid flex-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="relative isolate hidden overflow-hidden bg-night lg:block">
        <Image
          src={PHOTO.image}
          alt=""
          fill
          priority
          placeholder="blur"
          sizes="45vw"
          className="settle -z-10 object-cover"
          style={{ objectPosition: PHOTO.focus }}
        />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-linear-to-t from-night/70 to-transparent" />
        <PhotoCredit photo={PHOTO} className="absolute bottom-3 left-4" />
      </div>
      <div className="flex items-center justify-center px-6 py-16">
        <div className="rise-in w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
