import type { ReactNode } from "react";

type Props = {
  variant: "error" | "success";
  children: ReactNode;
};

export function FormMessage({ variant, children }: Props) {
  const variants = {
    error: "border-red-700/30 bg-red-700/5 text-red-700",
    success: "border-moss-600/30 bg-moss-50 text-moss-800",
  };

  return (
    <div className={`rounded-md border px-3.5 py-2.5 font-sans text-sm ${variants[variant]}`} role="status">
      {children}
    </div>
  );
}
