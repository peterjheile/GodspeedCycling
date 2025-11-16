import type { Metadata } from "next";
import "./globals.css";

import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Godspeed Biking",
  description: "A clean, modern dashboard for the Godspeed biking team.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}