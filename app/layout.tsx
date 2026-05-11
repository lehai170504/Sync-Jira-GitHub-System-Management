"use client";

import { useEffect } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import Providers from "./providers";
import { AuthWatcher } from "@/features/auth/components/auth-watcher";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
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
        className={`${plusJakartaSans.variable} antialiased font-sans bg-background text-foreground`}
      >
        <Providers>
          <AuthWatcher />
          <main className="min-h-screen">{children}</main>
          <Toaster
            position="top-right"
            richColors
            closeButton
            className="font-sans"
          />
        </Providers>
      </body>
    </html>
  );
}
