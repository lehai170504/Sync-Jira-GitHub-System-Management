"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Home,
  Search,
  AlertCircle,
  Sparkles,
  Zap,
  ShieldAlert,
} from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] font-mono selection:bg-orange-100 overflow-hidden relative flex items-center justify-center px-6">
      {/* --- LỚP NỀN DECOR --- */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-orange-100/40 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-blue-50/50 blur-[120px]"></div>
      </div>

      <div className="max-w-4xl w-full grid lg:grid-cols-2 gap-12 items-center">
        {/* --- TRÁI: 3D VISUAL AREA --- */}
        <div className="relative h-[400px] flex justify-center items-center [perspective:2000px] animate-reveal">
          <div className="relative w-72 h-72 animate-tilt-3d [transform-style:preserve-3d]">
            {/* Khối Core 404 3D */}
            <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl rounded-[60px] border border-white/50 shadow-2xl flex flex-col items-center justify-center [transform:translateZ(60px)] group">
              <h1 className="text-8xl font-black tracking-tighter text-slate-900 italic group-hover:scale-110 transition-transform duration-500">
                404
              </h1>
              <div className="h-1.5 w-12 bg-[#F27124] rounded-full mt-2 animate-pulse" />

              {/* Vòng quay vệ tinh quanh số 404 */}
              <div className="absolute -inset-8 border-2 border-orange-500/10 rounded-[70px] animate-orbit-slow">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#F27124] rounded-full shadow-[0_0_20px_#F27124]"></div>
              </div>
            </div>

            {/* Các thẻ Bento bay lơ lửng xung quanh */}
            <div className="absolute -top-10 -left-10 px-4 py-2 bg-slate-900 text-white rounded-2xl shadow-xl [transform:translateZ(120px)rotateY(-10deg)] flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-orange-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-nowrap">
                Lỗi đường dẫn
              </span>
            </div>

            <div className="absolute -bottom-5 -right-12 px-4 py-2 bg-white border border-slate-100 rounded-2xl shadow-xl [transform:translateZ(150px)rotateX(15deg)] flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-900 text-nowrap">
                Mất đồng bộ
              </span>
            </div>

            <div className="absolute top-1/2 -right-16 px-3 py-1.5 bg-orange-50 border border-orange-100 rounded-xl shadow-lg [transform:translateZ(80px)] flex items-center gap-2">
              <ShieldAlert className="h-3 w-3 text-[#F27124]" />
              <span className="text-[8px] font-black uppercase text-[#F27124]">
                Security_Verified
              </span>
            </div>
          </div>
        </div>

        {/* --- PHẢI: NỘI DUNG VĂN BẢN --- */}
        <div className="space-y-8 animate-fade-up text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white shadow-xl">
            <Sparkles className="h-3 w-3 text-orange-400 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">
              Hệ thống thông báo
            </span>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-slate-900 leading-none">
              Trang này đã <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F27124] to-orange-600">
                bị thất lạc.
              </span>
            </h2>
            <p className="text-slate-500 font-bold leading-relaxed max-w-md mx-auto lg:mx-0 lowercase">
              Có vẻ như đường dẫn bạn đang truy cập không tồn tại hoặc đã được
              chuyển sang một không gian khác trong syncsystem.
            </p>
          </div>

          <div className="flex flex-wrap justify-center lg:justify-start gap-4">
            <Link href="/">
              <Button className="h-14 px-8 bg-slate-900 hover:bg-[#F27124] text-white rounded-2xl font-black text-[10px] tracking-widest transition-all shadow-2xl active:scale-95 group uppercase">
                <Home className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                Về trang chủ
              </Button>
            </Link>

            <Link href="/support">
              <Button
                variant="outline"
                className="h-14 px-8 border-slate-200 rounded-2xl font-black text-[10px] tracking-widest transition-all hover:bg-slate-50 active:scale-95 uppercase"
              >
                <Search className="mr-2 h-4 w-4" />
                Tìm hỗ trợ
              </Button>
            </Link>
          </div>

          {/* Footer nhỏ ở dưới cùng */}
          <div className="pt-8 border-t border-slate-100 flex items-center justify-center lg:justify-start gap-4 opacity-40">
            <p className="text-[9px] font-black uppercase tracking-widest">
              Error Code: 404 NOT FOUND
            </p>
            <div className="h-1 w-1 bg-slate-400 rounded-full"></div>
            <p className="text-[9px] font-black uppercase tracking-widest">
              Sync System v4.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
