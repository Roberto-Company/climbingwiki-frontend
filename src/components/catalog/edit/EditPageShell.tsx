import type { ReactNode } from "react";

type Props = {
  title: string;
  /** e.g. "in El Cejo" */
  context?: string;
  children: ReactNode;
};

export function EditPageShell({ title, context, children }: Props) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-16">
      <header>
        <h1 className="font-display text-3xl font-medium text-foreground">{title}</h1>
        {context && <p className="mt-2 font-sans text-base text-stone">{context}</p>}
      </header>
      {children}
    </div>
  );
}
