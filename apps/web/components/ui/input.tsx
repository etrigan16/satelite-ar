// Input base estilo shadcn (simplificado)
// Incluye estilos de enfoque y estados deshabilitados

import { ComponentProps, forwardRef } from "react";

type InputProps = ComponentProps<"input">;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className = "", ...props },
  ref,
) {
  const base = "flex h-9 w-full rounded-md border border-zinc-300 bg-white px-3 py-1 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black disabled:cursor-not-allowed disabled:opacity-50";
  return <input ref={ref} className={`${base} ${className}`} {...props} />;
});