"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";


export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`px-8 h-24 flex items-center justify-between fixed w-full top-0 z-50 transition-all duration-500 ${scrolled
        ? "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl border-b border-slate-200/40 dark:border-white/10 h-20 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)]"
        : "bg-transparent h-24"
        }`}
    >
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-11 w-auto transition-all duration-500 group-hover:scale-105 active:scale-95">
            <Image
              src="/images/logo-main.png"
              alt="SAG-CA Logo"
              width={180}
              height={44}
              priority
              className="h-11 w-auto object-contain dark:brightness-0 dark:invert"
            />
          </div>
        </Link>
        <div className="h-8 w-px bg-slate-200 dark:bg-white/10 hidden md:block opacity-50"></div>
        <div className="hidden sm:block">
          <Image
            src="/images/Logo_Trường_Đại_học_FPT.svg.png"
            alt="FPT"
            width={120}
            height={36}
            className="h-8 w-auto grayscale opacity-50 hover:grayscale-0 dark:invert dark:opacity-30 dark:hover:opacity-100 hover:opacity-100 transition-all duration-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-8">
        <nav className="hidden lg:flex items-center gap-10">
          <Link
            href="#features"
            className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-all relative group"
          >
            Tính năng
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#F27124] transition-all group-hover:w-full" />
          </Link>
          <Link
            href="/workflow"
            className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 hover:text-[#F27124] transition-all relative group"
          >
            Quy trình
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#F27124] transition-all group-hover:w-full" />
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="hidden sm:flex text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white font-bold uppercase text-[11px] tracking-widest transition-all">
              Đăng nhập
            </Button>
          </Link>
          <Link href="/login">
            <Button className="bg-orange-500 dark:bg-orange-500 text-white h-11 px-8 rounded-2xl font-bold uppercase text-[11px] tracking-[0.15em] shadow-xl shadow-orange-500/30 hover:bg-slate-950 dark:hover:bg-slate-950 transition-all active:scale-95 border-0">
              Bắt đầu ngay
            </Button>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
