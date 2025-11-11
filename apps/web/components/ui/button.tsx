"use client";
// Botón base estilo shadcn (simplificado)
// Sin dependencias externas; usa Tailwind CSS y soporta variantes simples.
// Soporta `asChild` para renderizar el botón como el elemento hijo (ej: Link).

import { ComponentProps, forwardRef, ReactElement, isValidElement, cloneElement } from "react";

type ButtonProps = ComponentProps<"button"> & {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  asChild?: boolean; // si está activo, aplica estilos al hijo en lugar de un <button>
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className = "", variant = "default", size = "md", asChild = false, children, ...props },
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
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  // Si asChild está activo y el hijo es un elemento válido, se clona y se aplican estilos/props
  if (asChild && isValidElement(children)) {
    // Si el hijo es válido (ej. <Link/>), clonamos el elemento y solo aplicamos className.
    // Nota: usamos type cast a any para evitar conflicto de tipos cuando P es desconocido.
    const child = children as ReactElement<any>;
    const childClass = (child.props as { className?: string }).className ?? "";
    return cloneElement(child, { className: `${childClass} ${classes}`.trim() } as any);
  }

  return (
    <button ref={ref} className={classes} {...props}>
      {children}
    </button>
  );
});