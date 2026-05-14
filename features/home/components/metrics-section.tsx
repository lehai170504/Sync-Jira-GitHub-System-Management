"use client";

import { Users, Activity, GitGraph, GraduationCap, BookOpenCheck } from "lucide-react";

export function MetricsSection() {
  return (
    <section className="py-32 bg-slate-50/50 dark:bg-zinc-900/30 border-y border-slate-200/40 dark:border-white/5 relative overflow-hidden z-10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent" />
      <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 relative z-10">
        <MetricBox
          icon={Users}
          label="Sinh viên được theo dõi"
          value="1,200+"
          delay="100ms"
        />
        <MetricBox
          icon={GitGraph}
          label="Đồ thị hoạt động"
          value="45K+"
          delay="200ms"
        />
        <MetricBox
          icon={Activity}
          label="Hoạt động ghi nhận"
          value="250k+"
          delay="300ms"
        />
        <MetricBox
          icon={GraduationCap}
          label="Đánh giá liên tục"
          value="180+"
          delay="400ms"
        />
      </div>
    </section>
  );
}

function MetricBox({ icon: Icon, label, value, delay }: any) {
  return (
    <div
      className="text-center space-y-4 opacity-0 animate-fade-up [animation-fill-mode:forwards] group"
      style={{ animationDelay: delay }}
    >
      <div className="flex items-center justify-center">
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 shadow-xl group-hover:scale-110 group-hover:rotate-[10deg] transition-all duration-500 border border-slate-100 dark:border-white/5">
          <Icon className="h-6 w-6 text-[#F27124]" />
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tighter tabular-nums group-hover:text-orange-500 transition-colors">
          {value}
        </p>
        <p className="text-[11px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em]">
          {label}
        </p>
      </div>
    </div>
  );
}
