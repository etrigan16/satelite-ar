// Botón base estilo shadcn (simplificado)
// Sin dependencias externas; usa Tailwind CSS y soporta variantes simples

import { ComponentProps, forwardRef } from "react";

type ButtonProps = ComponentProps<"button"> & {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className = "", variant = "default", size = "md", ...props },
  ref,
) {
  const base = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    default: "bg-black text-white hover:bg-zinc-800",
    outline: "border border-zinc-300 bg-white hover:bg-zinc-50",
    ghost: "hover:bg-zinc-100",
  } as const;
  const sizes = {
    sm: "h-8 px-3",
    md: "h-9 px-4",
    lg: "h-10 px-6 text-base",
  } as const;
  return (
    <button ref={ref} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />
  );
});