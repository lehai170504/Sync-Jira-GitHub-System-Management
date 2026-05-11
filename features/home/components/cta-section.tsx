"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 container mx-auto px-6 relative z-10">
      <div className="relative rounded-[60px] bg-slate-950 overflow-hidden p-12 md:p-24 text-center">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(242,113,36,0.25),transparent_70%)]" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-blue-500/10 blur-[120px] rounded-full" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
          >
            <Sparkles className="h-4 w-4 text-orange-400" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/80">
              Sẵn sàng nâng tầm dự án của bạn?
            </span>
          </motion.div>

          <h2 className="text-5xl md:text-8xl font-bold tracking-tighter text-white leading-[0.85] uppercase">
            Bắt đầu <br />
            <span className="text-orange-500">ngay hôm nay.</span>
          </h2>

          <p className="text-slate-400 text-lg md:text-xl font-medium max-w-xl mx-auto">
            Hỗ trợ đầy đủ cho các đồ án tốt nghiệp, đồ án môn học và các dự án nghiên cứu tại FPT University.
          </p>

          <div className="flex flex-wrap justify-center gap-6 pt-6">
            <Link href="/login">
              <Button
                size="lg"
                className="h-20 px-12 bg-white hover:bg-orange-500 text-slate-950 hover:text-white rounded-[28px] font-bold uppercase tracking-[0.2em] text-[12px] transition-all shadow-2xl hover:shadow-orange-500/40 active:scale-95 group"
              >
                Vào Dashboard lớp học
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="pt-10 flex items-center justify-center gap-8 opacity-40 grayscale">
            <img src="/images/Logo_Trường_Đại_học_FPT.svg.png" alt="FPT" className="h-8 w-auto invert" />
            <div className="h-6 w-px bg-white/20" />
            <span className="text-white text-[10px] font-bold uppercase tracking-[0.3em]">Official Sync System</span>
          </div>
        </div>
      </div>
    </section>
  );
}
