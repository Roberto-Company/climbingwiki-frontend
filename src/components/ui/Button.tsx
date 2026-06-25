import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

export function Button({ variant = "primary", className = "", ...rest }: Props) {
  const base =
    "inline-flex items-center justify-center rounded-md px-5 py-2.5 font-sans text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ochre-400 disabled:cursor-not-allowed disabled:opacity-60";

  const variants = {
    primary: "bg-moss-600 text-background hover:bg-moss-800",
    ghost: "bg-transparent text-moss-600 hover:bg-moss-50",
  };

  return <button className={`${base} ${variants[variant]} ${className}`} {...rest} />;
}
