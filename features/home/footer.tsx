"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 py-12 relative z-10">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col gap-2 opacity-50 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-2 font-black text-sm uppercase tracking-tighter">
            <div className="h-6 w-6 bg-slate-900 rounded flex items-center justify-center text-white text-[10px]">
              S
            </div>
            SyncSystem
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Build for FPT University
          </p>
        </div>
        <div className="flex gap-10">
          <FooterLink label="Hỗ trợ" href="/support" />
          <FooterLink label="Quy định" href="/support" />
          <FooterLink label="Liên hệ" href="/support" />
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ label, href }: any) {
  return (
    <Link
      href={href}
      className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all hover:pl-2"
    >
      {label}
    </Link>
  );
}
