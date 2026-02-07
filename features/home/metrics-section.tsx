"use client";

import { Users, Activity, Zap, ShieldCheck } from "lucide-react";

export function MetricsSection() {
  return (
    <section className="py-24 bg-slate-50/50 border-y border-slate-100 overflow-hidden relative z-10">
      <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        <MetricBox
          icon={Users}
          label="Sinh viên"
          value="1,200+"
          delay="100ms"
        />
        <MetricBox icon={Activity} label="Lớp học" value="45" delay="200ms" />
        <MetricBox icon={Zap} label="Đồng bộ" value="250k" delay="300ms" />
        <MetricBox
          icon={ShieldCheck}
          label="Bảo vệ"
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
      className="text-center space-y-2 opacity-0 animate-fade-up [animation-fill-mode:forwards]"
      style={{ animationDelay: delay }}
    >
      <div className="flex items-center justify-center hover:scale-125 transition-transform duration-500">
        <Icon className="h-5 w-5 text-[#F27124]" />
      </div>
      <p className="text-3xl font-black text-slate-900 tracking-tighter tabular-nums">
        {value}
      </p>
      <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
        {label}
      </p>
    </div>
  );
}
