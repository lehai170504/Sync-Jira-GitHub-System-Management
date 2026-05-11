"use client";

import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import { BackgroundBeams } from "@/features/home/components/background-beams";

export default function PrivacyPage() {
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
            <Lock className="h-5 w-5" />
            <span className="text-[11px] font-bold uppercase tracking-widest">
              Chính sách bảo mật
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-24 max-w-4xl relative z-10">
        <div className="space-y-12 animate-fade-up">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 uppercase">
              Chính sách <br />
              <span className="text-slate-400">Bảo mật.</span>
            </h1>
            <p className="text-slate-500 font-medium text-lg">Cập nhật lần cuối: Tháng 5, 2026</p>
          </div>

          <div className="prose prose-slate max-w-none space-y-10 text-slate-600 font-medium leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">1. Thu thập thông tin</h2>
              <p>
                Chúng tôi thu thập thông tin cá nhân cơ bản như tên, email sinh viên và mã số sinh viên để xác thực người dùng. Ngoài ra, chúng tôi thu thập dữ liệu về hoạt động của bạn trên Jira và GitHub thông qua các API công khai để phục vụ mục đích đồng bộ hóa.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">2. Sử dụng thông tin</h2>
              <p>
                Thông tin thu thập được sử dụng để:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Cung cấp và duy trì dịch vụ đồng bộ hóa dữ liệu.</li>
                <li>Tính toán điểm đóng góp và hiệu suất làm việc của sinh viên.</li>
                <li>Cải thiện trải nghiệm người dùng trên hệ thống.</li>
                <li>Gửi thông báo quan trọng liên quan đến tài khoản và dự án.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">3. Bảo mật dữ liệu</h2>
              <p>
                Chúng tôi áp dụng các biện pháp bảo mật nghiêm ngặt để bảo vệ dữ liệu của bạn khỏi việc truy cập, thay đổi hoặc phá hủy trái phép. API Token của Jira và GitHub được mã hóa và lưu trữ an toàn trong cơ sở dữ liệu.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">4. Chia sẻ thông tin</h2>
              <p>
                Chúng tôi không bán, trao đổi hoặc chuyển giao thông tin cá nhân của bạn cho bên thứ ba. Dữ liệu học tập có thể được chia sẻ với giảng viên và nhà trường để phục vụ mục đích đánh giá đồ án.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
