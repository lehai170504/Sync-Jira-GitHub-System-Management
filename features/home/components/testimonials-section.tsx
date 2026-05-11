"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Lê Văn An",
    role: "Sinh viên K16 - FPT University",
    content: "Nhờ hệ thống này mà nhóm mình quản lý task chuyên nghiệp hơn hẳn. Việc điểm số được tính tự động dựa trên đóng góp thực tế giúp mọi người đều nỗ lực hết mình.",
    avatar: "/avatars/avatar-1.png",
    initials: "AN",
  },
  {
    name: "TS. Nguyễn Trần Bình",
    role: "Giảng viên bộ môn Kỹ thuật phần mềm",
    content: "Công cụ tuyệt vời giúp tôi theo dõi sát sao tiến độ của hàng chục nhóm cùng lúc mà không cần phải kiểm tra thủ công từng commit hay card Jira. Rất khách quan!",
    avatar: "/avatars/avatar-2.png",
    initials: "TB",
  },
  {
    name: "Trần Thị Chi",
    role: "Team Leader - Dự án tốt nghiệp",
    content: "Giao diện Dashboard cực kỳ trực quan. Biểu đồ Burndown giúp nhóm mình biết chính xác khi nào cần tăng tốc để kịp deadline. Điểm 10 cho trải nghiệm người dùng!",
    avatar: "/avatars/avatar-3.png",
    initials: "TC",
  },
  {
    name: "Nguyễn Minh Đức",
    role: "Software Engineering Student",
    content: "Khả năng đồng bộ hóa giữa Jira và GitHub thực sự ấn tượng. Nó giúp mình tiết kiệm rất nhiều thời gian báo cáo và tập trung hoàn toàn vào việc phát triển sản phẩm.",
    avatar: "/avatars/avatar-4.png",
    initials: "MD",
  },
  {
    name: "Lê Thị Hồng",
    role: "Project Manager Mentor",
    content: "Một giải pháp đột phá cho việc quản lý đào tạo theo hướng dự án. Hệ thống giúp thu hẹp khoảng cách giữa lý thuyết và thực tiễn doanh nghiệp.",
    avatar: "/avatars/avatar-5.png",
    initials: "LH",
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-40 bg-slate-50/50 dark:bg-zinc-900/30 relative z-10 overflow-hidden transition-colors duration-500">
      <div className="container mx-auto px-6 mb-24">
        <div className="flex flex-col md:flex-row items-end justify-between gap-10">
          <div className="max-w-2xl">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.4em] text-orange-500 mb-6">
              Hệ sinh thái tin cậy
            </h4>
            <h2 className="text-4xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[0.9] uppercase">
              Cộng đồng <br />
              <span className="text-slate-400 dark:text-slate-500 font-medium">đánh giá thực tế.</span>
            </h2>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="h-5 w-5 fill-orange-400 text-orange-400" />
              ))}
            </div>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
              4.9/5 Rating based on 500+ users
            </p>
          </div>
        </div>
      </div>

      {/* Masking Gradients for seamless effect */}
      <div className="relative">
        <div className="absolute left-0 top-0 w-40 h-full bg-gradient-to-r from-slate-50 dark:from-[#09090b] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 w-40 h-full bg-gradient-to-l from-slate-50 dark:from-[#09090b] to-transparent z-20 pointer-events-none" />

        {/* First Row: Forward */}
        <div className="flex overflow-hidden mb-10">
          <motion.div
            className="flex gap-10 whitespace-nowrap py-4"
            animate={{ x: [0, -2500] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 50,
                ease: "linear",
              },
            }}
            whileHover={{ transition: { duration: 100 } }} // Slow down on hover
          >
            {[...testimonials, ...testimonials, ...testimonials].map((item, index) => (
              <TestimonialCard key={index} item={item} />
            ))}
          </motion.div>
        </div>

        {/* Second Row: Backward */}
        <div className="flex overflow-hidden">
          <motion.div
            className="flex gap-10 whitespace-nowrap py-4"
            animate={{ x: [-2500, 0] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 60,
                ease: "linear",
              },
            }}
            whileHover={{ transition: { duration: 120 } }} // Slow down on hover
          >
            {[...testimonials, ...testimonials, ...testimonials].reverse().map((item, index) => (
              <TestimonialCard key={index} item={item} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ item }: { item: any }) {
  return (
    <div className="w-[480px] p-12 rounded-[48px] bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-white/5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.03)] hover:shadow-orange-500/10 hover:border-orange-500/20 hover:scale-[1.02] transition-all duration-500 relative flex flex-col shrink-0 group">
      <div className="absolute top-10 right-12 opacity-[0.03] group-hover:opacity-10 transition-opacity duration-500">
        <Quote className="h-20 w-20" />
      </div>

      <div className="flex gap-1 mb-8 opacity-40 group-hover:opacity-100 transition-opacity">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star key={s} className="h-3 w-3 fill-orange-400 text-orange-400" />
        ))}
      </div>

      <p className="text-slate-600 dark:text-slate-400 text-xl font-medium leading-relaxed mb-12 whitespace-normal line-clamp-3">
        "{item.content}"
      </p>

      <div className="flex items-center gap-5 mt-auto border-t border-slate-50 dark:border-white/5 pt-8">
        <div className="relative">
          <Avatar className="h-14 w-14 border-2 border-white dark:border-slate-800 shadow-xl ring-2 ring-orange-500/10">
            <AvatarImage src={item.avatar} className="object-cover" />
            <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
              {item.initials}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
        </div>
        <div className="text-left">
          <h4 className="font-bold text-slate-900 dark:text-white text-lg leading-none mb-1.5">
            {item.name}
          </h4>
          <p className="text-[11px] text-orange-500/70 font-bold uppercase tracking-[0.1em]">
            {item.role}
          </p>
        </div>
      </div>
    </div>
  );
}
