"use client";
// Badge estilo shadcn (simplificado)
// Útil para etiquetas de tags y estados

import { ComponentProps } from "react";

type BadgeProps = ComponentProps<"span"> & {
  variant?: "default" | "secondary";
};

export function Badge({ className = "", variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-zinc-100 border border-zinc-300 text-zinc-800",
    secondary: "bg-blue-600 text-white",
  } as const;
  return <span className={`inline-block rounded px-2 py-1 text-xs ${variants[variant]} ${className}`} {...props} />;
}