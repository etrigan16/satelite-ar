import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import StatusBanner from "@/components/system/status-banner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "satelite.ar",
  description: "Portal de curación de datos satelitales y análisis públicos",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Banner global de estado del backend. En dev, se apaga automáticamente al reconectar. */}
        <StatusBanner />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
