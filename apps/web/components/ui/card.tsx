"use client";
// Card estilo shadcn (simplificado)
// Contenedor con borde y padding para agrupar contenido

import { ComponentProps } from "react";

export function Card({ className = "", ...props }: ComponentProps<"div">) {
  return <div className={`rounded border bg-white p-4 ${className}`} {...props} />;
}

export function CardHeader({ className = "", ...props }: ComponentProps<"div">) {
  return <div className={`mb-2 ${className}`} {...props} />;
}

export function CardTitle({ className = "", ...props }: ComponentProps<"h2">) {
  return <h2 className={`text-lg font-semibold ${className}`} {...props} />;
}

export function CardContent({ className = "", ...props }: ComponentProps<"div">) {
  return <div className={`${className}`} {...props} />;
}