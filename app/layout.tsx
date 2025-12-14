import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AlbumGrid - Createur de mosaiques d'albums",
  description: "Creez des mosaiques d'albums musicaux pour impression. Recherchez, arrangez et exportez en haute resolution.",
};

import { Toaster } from "@/components/ui/sonner";
import { AppHeader } from "@/components/AppHeader";
import { AppFooter } from "@/components/AppFooter";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex flex-col min-h-screen">
          <AppHeader />
          <main className="flex-1 flex flex-col overflow-hidden relative">
            {children}
          </main>
          <AppFooter />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
