"use client";

import Image from "next/image";
import { ReactNode } from "react";
import { FileText, ShieldCheck, LifeBuoy} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const FOOTER_LINKS = [
  {
    triggerText: "Điều khoản",
    icon: <FileText className="w-4 h-4 text-blue-500" />,
    title: "Điều khoản sử dụng",
    description: "Các quy định và điều khoản khi sử dụng nền tảng SyncSystem.",
    content: (
      <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <p>
          <strong className="text-slate-900 dark:text-slate-100">1. Chấp nhận điều khoản:</strong>{" "}
          Khi truy cập và sử dụng hệ thống SyncSystem, bạn đồng ý tuân thủ các quy định của Đại học FPT về liêm chính học thuật và bảo mật thông tin.
        </p>
        <p>
          <strong className="text-slate-900 dark:text-slate-100">2. Quyền và trách nhiệm:</strong>{" "}
          Người dùng chịu trách nhiệm về mọi hoạt động trên tài khoản của mình. Sinh viên cần đảm bảo mã nguồn và task trên Jira phản ánh đúng năng lực và công sức thực tế.
        </p>
        <p>
          <strong className="text-slate-900 dark:text-slate-100">3. Giới hạn hệ thống:</strong>{" "}
          SyncSystem là công cụ hỗ trợ quản lý đồ án. Hệ thống không chịu trách nhiệm về việc mất mát dữ liệu do lỗi từ các nền tảng bên thứ 3 (GitHub, Jira).
        </p>
      </div>
    ),
  },
  {
    triggerText: "Bảo mật",
    icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />,
    title: "Chính sách bảo mật",
    description: "Cách chúng tôi thu thập và bảo vệ dữ liệu của bạn.",
    content: (
      <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <p>
          <strong className="text-slate-900 dark:text-slate-100">1. Thu thập dữ liệu:</strong>{" "}
          Chúng tôi chỉ thu thập các thông tin cần thiết từ tài khoản FPT (Email, MSSV) và các thông số từ GitHub/Jira (Commits, Tasks) để phục vụ việc đánh giá đồ án.
        </p>
        <p>
          <strong className="text-slate-900 dark:text-slate-100">2. Lưu trữ an toàn:</strong>{" "}
          Tokens (Personal Access Token, API Key) được mã hóa một chiều. Chúng tôi cam kết không chia sẻ dữ liệu này cho bất kỳ bên thứ 3 nào ngoài mục đích đồng bộ.
        </p>
        <p>
          <strong className="text-slate-900 dark:text-slate-100">3. Quyền riêng tư:</strong>{" "}
          Giảng viên chỉ có quyền xem dữ liệu của sinh viên thuộc lớp mình quản lý. Bạn có quyền yêu cầu xóa kết nối bất kỳ lúc nào thông qua cài đặt nhóm.
        </p>
      </div>
    ),
  },
  {
    triggerText: "Hỗ trợ",
    icon: <LifeBuoy className="w-4 h-4 text-orange-500" />,
    title: "Trung tâm hỗ trợ",
    description: "Liên hệ với đội ngũ phát triển và phòng đào tạo.",
    content: (
      <div className="space-y-3 text-sm">
        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
          <p className="font-bold text-slate-900 dark:text-slate-100 mb-1.5">Hỗ trợ Kỹ thuật</p>
          <p className="text-slate-600 dark:text-slate-400">
            Email:{" "}
            <a href="mailto:support.syncsystem@fpt.edu.vn" className="text-blue-500 hover:underline">
              support.syncsystem@fpt.edu.vn
            </a>
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Thứ 2 – Thứ 6 • 08:00 – 17:00</p>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
          <p className="font-bold text-slate-900 dark:text-slate-100 mb-1.5">Phòng Khảo thí & Đào tạo</p>
          <p className="text-slate-600 dark:text-slate-400">Hotline: 028 7300 5588</p>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Tòa nhà Alpha, Campus FPTU HCM</p>
        </div>
      </div>
    ),
  },
];

export function Footer() {
  return (
    <div className="flex items-center justify-between gap-6 py-3 flex-wrap">
      {/* Left: Branding */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5 group">
          <Image
            src="/images/Logo_Trường_Đại_học_FPT.svg.png"
            alt="FPT University"
            width={56}
            height={18}
            className="h-[18px] w-auto object-contain opacity-50 dark:opacity-40 dark:brightness-0 dark:invert group-hover:opacity-80 transition-opacity"
          />
          <div className="h-3.5 w-px bg-slate-300 dark:bg-slate-700" />
          <Image
            src="/images/logo-icon.png"
            alt="SyncSystem"
            width={20}
            height={20}
            className="w-5 h-5 object-contain opacity-70"
          />
        </div>

        <div className="hidden sm:flex items-center gap-1.5 ml-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
          <span className="text-[9px] font-bold text-emerald-500/70 uppercase tracking-widest">
            Online
          </span>
        </div>
      </div>

      {/* Right: Links & Copyright */}
      <div className="flex items-center gap-5">
        {/* Legal links */}
        <div className="flex items-center gap-4">
          {FOOTER_LINKS.map((link) => (
            <FooterModal
              key={link.triggerText}
              triggerText={link.triggerText}
              icon={link.icon}
              title={link.title}
              description={link.description}
            >
              {link.content}
            </FooterModal>
          ))}
        </div>

        <div className="h-3.5 w-px bg-slate-200 dark:bg-slate-800" />

        <p className="text-[10px] font-medium text-slate-400 dark:text-slate-600 tracking-wide whitespace-nowrap">
          © 2026 FPT University
        </p>
      </div>
    </div>
  );
}

interface FooterModalProps {
  triggerText: string;
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
}

function FooterModal({ triggerText, icon, title, description, children }: FooterModalProps) {
  return (
    <Dialog>
      <DialogTrigger className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors outline-none cursor-pointer">
        {triggerText}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-2xl rounded-3xl font-sans">
        <DialogHeader className="p-6 pb-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
          <DialogTitle className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <div className="p-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
              {icon}
            </div>
            {title}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
            {description}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[55vh] p-6">
          {children}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
