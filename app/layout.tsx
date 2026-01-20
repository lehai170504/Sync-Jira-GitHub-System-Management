import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Đã khai báo font Mono ở đây
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | SyncSystem",
    default: "SyncSystem - Hệ thống Quản lý Đồ án",
  },
  description:
    "Nền tảng tích hợp Jira và GitHub để theo dõi tiến độ và tính điểm sinh viên tự động.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans bg-gray-50/50`}
      >
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
