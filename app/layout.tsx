"use client";

import { useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import Providers from "./providers";
import { AuthWatcher } from "@/features/auth/components/auth-watcher";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Đăng ký Service Worker
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((reg) => console.log("✅ SW registered:", reg.scope))
        .catch((err) => console.error("❌ SW failed:", err));
    }
  }, []);

  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans bg-gray-50/50 text-slate-900`}
      >
        <Providers>
          <AuthWatcher />
          <main className="min-h-screen">{children}</main>
        </Providers>

        <Toaster
          position="top-right"
          richColors
          closeButton
          theme="light"
          className="font-sans"
        />
      </body>
    </html>
  );
}
