import Link from "next/link";

type Props = {
  href: string;
  label: string;
};

/** "+ Add …" link shown to signed-in climbers under a list. */
export function AddLink({ href, label }: Props) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 self-start rounded-md border border-dashed border-moss-400 px-3.5 py-2 font-sans text-sm font-semibold text-moss-600 transition-colors hover:border-moss-600 hover:bg-moss-50"
    >
      <span aria-hidden="true">+</span>
      {label}
    </Link>
  );
}
