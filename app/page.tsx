import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FA] font-mono">
      {/* 1. Navbar đơn giản */}
      <header className="px-6 h-16 flex items-center justify-between border-b bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2">
          {/* Logo nhỏ */}
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0F172A]">
            <span className="text-[#F27124] font-bold text-lg">S</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-[#0F172A]">
            Sync<span className="text-[#F27124]">System</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Hỗ trợ
          </Link>
          <Link href="/login">
            <Button
              variant="outline"
              className="border-orange-200 text-[#F27124] hover:bg-orange-50 hover:text-[#F27124]"
            >
              Đăng nhập
            </Button>
          </Link>
        </div>
      </header>

      {/* 2. Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-white">
        <div className="space-y-6 max-w-3xl">
          <div className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-sm font-medium text-[#F27124]">
            <span className="flex h-2 w-2 rounded-full bg-[#F27124] mr-2"></span>
            Phiên bản v1.0 đã sẵn sàng
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900">
            Quản lý Đồ án Tốt nghiệp <br className="hidden md:block" />
            <span className="text-[#F27124]">Hiệu quả & Đồng bộ</span>
          </h1>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Hệ thống tự động tích hợp Jira và GitHub để theo dõi tiến độ, tính
            điểm sinh viên và cảnh báo rủi ro cho giảng viên hướng dẫn tại FPT
            University.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {/* 🔥 NÚT CHUYỂN ĐẾN LOGIN */}
            <Link href="/login">
              <Button
                size="lg"
                className="h-12 px-8 text-base bg-[#F27124] hover:bg-[#d65d1b] shadow-lg shadow-orange-500/20"
              >
                Bắt đầu ngay <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            <Link href="#">
              <Button
                size="lg"
                variant="ghost"
                className="h-12 px-8 text-base text-slate-600"
              >
                Tìm hiểu quy trình
              </Button>
            </Link>
          </div>
        </div>

        {/* 3. Feature List (Minh họa) */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
          {[
            { title: "Tự động hóa", desc: "Đồng bộ commit và task real-time." },
            {
              title: "Minh bạch điểm số",
              desc: "Công thức tính điểm rõ ràng, chi tiết.",
            },
            {
              title: "Báo cáo nhanh",
              desc: "Xuất file Excel chuẩn format nhà trường.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100"
            >
              <div className="mt-1">
                <CheckCircle2 className="h-5 w-5 text-[#F27124]" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 4. Footer */}
      <footer className="border-t py-8 text-center text-sm text-slate-500 bg-white">
        <p>&copy; 2026 SyncSystem. FPT University Project.</p>
      </footer>
    </div>
  );
}
