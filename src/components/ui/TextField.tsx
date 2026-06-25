import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function TextField({ label, error, id, className = "", ...rest }: Props) {
  const fieldId = id ?? rest.name;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={fieldId} className="font-sans text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={fieldId}
        className={`rounded-md border border-border bg-background px-3.5 py-2.5 font-sans text-base text-foreground outline-none transition-colors focus:border-moss-600 ${className}`}
        {...rest}
      />
      {error && <p className="font-sans text-sm text-red-700">{error}</p>}
    </div>
  );
}
