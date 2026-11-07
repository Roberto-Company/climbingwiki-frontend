import type { ReactNode } from "react";

type Props = {
  variant: "error" | "success" | "info";
  children: ReactNode;
};

export function FormMessage({ variant, children }: Props) {
  const variants = {
    error: "border-red-700/30 bg-red-700/5 text-red-700",
    success: "border-moss-600/30 bg-moss-50 text-moss-800",
    info: "border-ochre-400/50 bg-ochre-200/30 text-foreground",
  };

  return (
    <div className={`rounded-md border px-3.5 py-2.5 font-sans text-sm ${variants[variant]}`} role="status">
      {children}
    </div>
  );
}
