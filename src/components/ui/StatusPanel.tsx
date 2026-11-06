import type { ReactNode } from "react";

type Props = {
  eyebrow: string;
  title: string;
  body: string;
  action?: ReactNode;
};

/** Full-page message for loading failures and missing pages. */
export function StatusPanel({ eyebrow, title, body, action }: Props) {
  return (
    <main className="flex flex-1 items-center px-6 py-24 sm:px-16">
      <div className="max-w-xl border-l-4 border-ochre-400 pl-6">
        <p className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-ochre-600">{eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl font-medium leading-tight text-foreground">{title}</h1>
        <p className="mt-4 font-sans text-base leading-7 text-stone">{body}</p>
        {action && <div className="mt-8">{action}</div>}
      </div>
    </main>
  );
}
