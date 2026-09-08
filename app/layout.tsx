import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Intensivo · IA Business Lab",
  description: "Programa de 30 días de IA Business Lab",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-bg text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
