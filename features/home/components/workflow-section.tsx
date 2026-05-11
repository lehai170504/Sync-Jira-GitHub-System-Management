"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  GitPullRequest,
  LayoutPanelLeft,
  LineChart,
  ShieldCheck,
  Key,
  MessageSquareQuote,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    title: "Khởi tạo & Kết nối",
    desc: "Đăng nhập và cấu hình API Token để kết nối an toàn với hệ thống Jira của doanh nghiệp hoặc trường học.",
    icon: Key,
    color: "bg-slate-900",
  },
  {
    title: "Đồng bộ Backlog",
    desc: "Lấy toàn bộ User Stories, Tasks và Sprints từ Jira về hệ thống quản lý tập trung của chúng tôi.",
    icon: LayoutPanelLeft,
    color: "bg-blue-600",
  },
  {
    title: "Thực thi Code",
    desc: "Sinh viên làm việc trên GitHub. Hệ thống tự động bắt các sự kiện Commit, PR và liên kết với Task.",
    icon: GitPullRequest,
    color: "bg-orange-500",
  },
  {
    title: "AI Analytics",
    desc: "Thuật toán thông minh phân tích chất lượng đóng góp, độ phức tạp của code và tiến độ hoàn thành.",
    icon: LineChart,
    color: "bg-purple-600",
  },
  {
    title: "Feedback & Review",
    desc: "Giảng viên đưa ra nhận xét trực tiếp trên từng đầu việc, giúp sinh viên cải thiện kỹ năng kịp thời.",
    icon: MessageSquareQuote,
    color: "bg-pink-500",
  },
  {
    title: "Chốt điểm & Báo cáo",
    desc: "Xuất báo cáo cuối kỳ và tính điểm tự động dựa trên toàn bộ quá trình làm việc thực tế.",
    icon: ShieldCheck,
    color: "bg-emerald-500",
  },
];

export function WorkflowSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextStep = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % steps.length);
  }, []);

  const prevStep = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + steps.length) % steps.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextStep, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextStep]);

  return (
    <section className="py-40 bg-white relative z-10 overflow-hidden">
      {/* Background Decorative Text */}
      <div className="absolute top-0 right-0 text-[20vw] font-bold text-slate-50 select-none pointer-events-none -z-10 leading-none translate-x-1/4 -translate-y-1/4 opacity-50">
        FLOW
      </div>

      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-24">
          <div className="max-w-2xl">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] text-orange-500 mb-6 flex items-center gap-2">
              <Sparkles className="h-3 w-3" />
              Hệ thống vận hành thông minh
            </h4>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[0.9] uppercase">
              Trải nghiệm <br />
              <span className="text-slate-400">quy trình chuẩn.</span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => { prevStep(); setIsAutoPlaying(false); }}
              className="h-14 w-14 rounded-2xl border-slate-200 hover:bg-orange-500 hover:text-white transition-all shadow-lg"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => { nextStep(); setIsAutoPlaying(false); }}
              className="h-14 w-14 rounded-2xl border-slate-200 hover:bg-orange-500 hover:text-white transition-all shadow-lg"
            >
              <ArrowRight className="h-6 w-6" />
            </Button>
          </div>
        </div>

        <div className="relative h-[450px] md:h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5, ease: "circOut" }}
              className="absolute inset-0"
            >
              <div className="grid lg:grid-cols-2 gap-12 items-center h-full">
                {/* Visual Side */}
                <div className="hidden lg:flex justify-center">
                  <div className="relative w-80 h-80">
                    <div className={`absolute inset-0 ${steps[activeIndex].color} opacity-10 blur-[80px] rounded-full animate-pulse`} />
                    <div className={`relative h-full w-full ${steps[activeIndex].color} text-white rounded-[60px] flex items-center justify-center shadow-3xl`}>
                      {React.createElement(steps[activeIndex].icon, { className: "h-32 w-32 animate-bounce-slow" })}
                      <div className="absolute top-8 right-8 text-6xl font-bold opacity-20">
                        0{activeIndex + 1}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Side */}
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-4xl md:text-5xl font-bold text-slate-900 uppercase tracking-tighter">
                      {steps[activeIndex].title}
                    </h3>
                    <p className="text-xl text-slate-500 leading-relaxed font-medium max-w-xl">
                      {steps[activeIndex].desc}
                    </p>
                  </div>

                  <div className="flex items-center gap-6 pt-6">
                    <Button
                      size="lg"
                      onClick={() => { nextStep(); setIsAutoPlaying(false); }}
                      className="h-16 px-10 bg-[#F27124] hover:bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest text-xs shadow-2xl transition-all active:scale-95 group"
                    >
                      Bước tiếp theo
                      <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-2 transition-transform" />
                    </Button>
                    <div className="flex gap-2">
                      {steps.map((_, i) => (
                        <div
                          key={i}
                          onClick={() => { setActiveIndex(i); setIsAutoPlaying(false); }}
                          className={`h-2 transition-all duration-500 rounded-full cursor-pointer ${i === activeIndex ? "w-12 bg-orange-500" : "w-2 bg-slate-200 hover:bg-slate-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
