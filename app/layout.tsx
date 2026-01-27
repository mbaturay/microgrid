import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/app-shell";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Earth Finance | Microgrid ROI Studio",
  description: "Vibe-code POC for Solar & Microgrid ROI modeling.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className="min-h-screen">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
