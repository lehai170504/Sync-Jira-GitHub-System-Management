"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="px-8 h-20 flex items-center justify-between fixed w-full top-0 z-50 bg-white/60 backdrop-blur-2xl border-b border-slate-200/40 animate-fade-in">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative h-10 w-auto transition-all duration-500 group-hover:scale-110 active:scale-95 group-hover:rotate-[-5deg]">
            <Image
              src="/images/logo-sync.png"
              alt="SyncSystem Logo"
              width={160}
              height={40}
              priority
              className="h-10 w-auto object-contain"
            />
          </div>
        </Link>
        <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
        <Image
          src="/images/Logo_Trường_Đại_học_FPT.svg.png"
          alt="FPT"
          width={100}
          height={30}
          className="h-7 w-auto grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100"
        />
      </div>

      <div className="flex items-center gap-6">
        <nav className="hidden lg:flex items-center gap-8">
          <Link
            href="#features"
            className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all hover:translate-y-[-2px]"
          >
            Tính năng
          </Link>
          <Link
            href="/subjects"
            className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#F27124] transition-all hover:translate-y-[-2px]"
          >
            Môn học hỗ trợ
          </Link>
        </nav>
        <Link href="/login">
          <Button className="bg-slate-900 hover:bg-[#F27124] text-white h-9 px-6 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg transition-all active:scale-95">
            Đăng nhập
          </Button>
        </Link>
      </div>
    </header>
  );
}
