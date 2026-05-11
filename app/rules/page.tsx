"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { BackgroundBeams } from "@/features/home/components/background-beams";

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-orange-500/10 overflow-x-hidden relative">
      <BackgroundBeams />

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-2xl border-b border-slate-200/40 px-8 h-24 flex items-center sticky top-0 z-50">
        <div className="container mx-auto max-w-7xl flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-slate-950 text-white hover:bg-orange-500 transition-all duration-300 group active:scale-95 shadow-xl shadow-slate-950/20"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[11px] font-bold uppercase tracking-widest">
              Quay lại trang chủ
            </span>
          </Link>
          <div className="flex items-center gap-3 text-orange-500">
            <BookOpen className="h-5 w-5" />
            <span className="text-[11px] font-bold uppercase tracking-widest">
              Quy định sử dụng
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-24 max-w-4xl relative z-10">
        <div className="space-y-12 animate-fade-up">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 uppercase">
              Quy định <br />
              <span className="text-slate-400">Sử dụng.</span>
            </h1>
            <p className="text-slate-500 font-medium text-lg">Áp dụng cho cộng đồng sinh viên FPT University</p>
          </div>

          <div className="prose prose-slate max-w-none space-y-10 text-slate-600 font-medium leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">1. Trung thực trong học tập</h2>
              <p>
                Sinh viên cam kết không gian lận trong việc tạo commit giả hoặc thao túng dữ liệu Jira để tăng điểm số. Mọi hành vi gian lận khi bị phát hiện sẽ bị xử lý theo quy định kỷ luật của nhà trường.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">2. Sử dụng tài nguyên hệ thống</h2>
              <p>
                Không được thực hiện các hành vi tấn công, spam hoặc cố tình làm quá tải hệ thống. Người dùng chỉ được phép truy cập và sử dụng các tính năng được cung cấp công khai.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">3. Quản lý nhóm</h2>
              <p>
                Trưởng nhóm có trách nhiệm điều phối công việc trên Jira và đảm bảo các thành viên đều được phân bổ task công bằng. Mọi tranh chấp về điểm số cần được giải quyết thông qua giảng viên hướng dẫn.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">4. Phản hồi và Đóng góp</h2>
              <p>
                Chúng tôi khuyến khích sinh viên đóng góp ý kiến để hoàn thiện hệ thống. Mọi phản hồi mang tính xây dựng sẽ được ghi nhận và xem xét cập nhật trong các phiên bản tiếp theo.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
