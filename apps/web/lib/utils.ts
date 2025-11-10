// Utilidad `cn` para combinar clases de Tailwind de forma segura.
// Inspirado en shadcn/ui utils.
// Docs: https://ui.shadcn.com/docs/components/accordion
import { type ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}