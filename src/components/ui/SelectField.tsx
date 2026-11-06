import type { ReactNode, SelectHTMLAttributes } from "react";

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
  children: ReactNode;
};

export function SelectField({ label, error, id, className = "", children, ...rest }: Props) {
  const fieldId = id ?? rest.name;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={fieldId} className="font-sans text-sm font-medium text-foreground">
        {label}
      </label>
      <select
        id={fieldId}
        aria-invalid={error ? true : undefined}
        className={`rounded-md border border-border bg-background px-3.5 py-2.5 font-sans text-base text-foreground outline-none transition-colors focus:border-moss-600 ${className}`}
        {...rest}
      >
        {children}
      </select>
      {error && <p className="font-sans text-sm text-red-700">{error}</p>}
    </div>
  );
}
