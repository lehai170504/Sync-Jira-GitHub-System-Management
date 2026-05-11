"use client";

import Link from "next/link";
import Image from "next/image";
import { Github, Globe, Mail, MessageCircle, Twitter } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-100 pt-24 pb-12 relative z-10 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand Column */}
          <div className="col-span-1 lg:col-span-1 space-y-8">
            <Link href="/" className="inline-block group">
              <Image
                src="/images/logo-sync.png"
                alt="SyncSystem Logo"
                width={140}
                height={35}
                className="h-9 w-auto grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
              />
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs font-medium">
              Hệ thống đồng bộ hóa dữ liệu thông minh giữa Jira và GitHub,
              tối ưu hóa quy trình quản lý dự án cho sinh viên FPT.
            </p>
            <div className="flex items-center gap-4">
              <SocialIcon icon={Github} href="#" />
              <SocialIcon icon={Globe} href="#" />
              <SocialIcon icon={Mail} href="#" />
            </div>
          </div>

          {/* Links Columns */}
          <div className="space-y-8">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-900">
              Sản phẩm
            </h4>
            <ul className="space-y-4">
              <FooterItem label="Tính năng chính" href="/#features" />
              <FooterItem label="Bảng điều khiển" href="/dashboard" />
              <FooterItem label="Quy trình vận hành" href="/workflow" />
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-900">
              Hỗ trợ
            </h4>
            <ul className="space-y-4">
              <FooterItem label="Trung tâm hỗ trợ" href="/support" />
              <FooterItem label="Tài liệu hướng dẫn" href="/support" />
              <FooterItem label="Câu hỏi thường gặp" href="/support" />
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-900">
              Pháp lý
            </h4>
            <ul className="space-y-4">
              <FooterItem label="Quy định sử dụng" href="/rules" />
              <FooterItem label="Chính sách bảo mật" href="/privacy" />
              <FooterItem label="Điều khoản dịch vụ" href="/terms" />
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-400">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[10px] font-bold uppercase tracking-widest">
              System Status: Operational
            </p>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest">
            © {currentYear} SYNC SYSTEM. Build for FPT UNIVERSITY with ❤️.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterItem({ label, href }: { label: string; href: string }) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm font-medium text-slate-500 hover:text-orange-500 transition-colors"
      >
        {label}
      </Link>
    </li>
  );
}

function SocialIcon({ icon: Icon, href }: { icon: any; href: string }) {
  return (
    <Link
      href={href}
      className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-orange-500 hover:text-white transition-all duration-300 border border-slate-100"
    >
      <Icon className="h-5 w-5" />
    </Link>
  )
}
