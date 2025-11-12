import type { NextConfig } from "next";

// Configuración de rewrites para desarrollo:
// - Redirige peticiones a /api/* hacia el backend Nest (API_BASE_URL o localhost:3001)
// - Útil para llamadas públicas; los endpoints protegidos usan rutas internas /admin/api/*
const nextConfig: NextConfig = {
  async rewrites() {
    const target = process.env.API_BASE_URL || "http://localhost:3001";
    return [
      {
        source: "/api/:path*",
        destination: `${target}/:path*`,
      },
    ];
  },
};

export default nextConfig;
