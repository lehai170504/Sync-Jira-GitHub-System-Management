"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Mail,
  Phone,
  FileText,
  MessageSquare,
  Search,
  HelpCircle,
  LifeBuoy,
  Loader2,
  Send,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// --- DỮ LIỆU FAQ (Tách ra để dễ lọc) ---
const faqData = [
  {
    id: "item-1",
    question: "Làm sao để kết nối Jira vào hệ thống SyncSystem?",
    answer: (
      <div className="text-slate-600 leading-relaxed">
        <p className="mb-2">Để kết nối, bạn thực hiện theo các bước sau:</p>
        <ol className="list-decimal list-inside space-y-1 ml-2">
          <li>Đăng nhập vào hệ thống.</li>
          <li>
            Truy cập menu <strong>"Cài đặt dự án"</strong> &gt;{" "}
            <strong>"Kết nối"</strong>.
          </li>
          <li>
            Nhập <strong>Jira URL</strong> (VD:
            https://your-domain.atlassian.net).
          </li>
          <li>
            Nhập <strong>Email</strong> và <strong>API Token</strong> (Tạo tại
            id.atlassian.com).
          </li>
        </ol>
      </div>
    ),
  },
  {
    id: "item-2",
    question: "Hệ thống tính điểm cá nhân như thế nào?",
    answer: (
      <div className="text-slate-600 leading-relaxed">
        Điểm số được tính toán tự động dựa trên 2 chỉ số chính:
        <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
          <li>
            <strong>Jira Performance (50%):</strong> Số lượng task hoàn thành
            đúng hạn (Done) so với tổng số task được giao.
          </li>
          <li>
            <strong>GitHub Contribution (50%):</strong> Số lượng Commit hợp lệ
            và Pull Request được merge.
          </li>
        </ul>
        <p className="mt-2 text-sm italic text-slate-500">
          *Công thức chi tiết có thể thay đổi tùy theo Syllabus môn học.
        </p>
      </div>
    ),
  },
  {
    id: "item-3",
    question: "Tôi không đăng nhập được bằng mail FPT (@fpt.edu.vn)?",
    answer: (
      <div className="text-slate-600 leading-relaxed">
        Nếu gặp lỗi đăng nhập Google, vui lòng thử các cách sau:
        <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
          <li>Kiểm tra lại kết nối mạng.</li>
          <li>Sử dụng trình duyệt ẩn danh (Incognito Mode).</li>
          <li>Xóa Cache trình duyệt và thử lại.</li>
        </ul>
        Nếu vẫn không được, hãy liên hệ <strong>IT Support</strong> qua email để
        được reset quyền truy cập.
      </div>
    ),
  },
  {
    id: "item-4",
    question: "Giảng viên có xem được code của tôi không?",
    answer: (
      <div className="text-slate-600 leading-relaxed">
        <strong>Có.</strong> Hệ thống đồng bộ trực tiếp với GitHub Repository
        của nhóm. Giảng viên có thể xem lịch sử commit, file thay đổi (Diff) và
        review code trực tiếp trên giao diện của SyncSystem mà không cần qua
        GitHub.
      </div>
    ),
  },
];

export default function SupportPage() {
  // --- STATE MANAGEMENT ---
  const [searchQuery, setSearchQuery] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [ticketOpen, setTicketOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Logic: Lọc FAQ
  const filteredFAQs = faqData.filter((item) =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Logic: Giả lập Download
  const handleDownload = async () => {
    setIsDownloading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Giả lập delay 2s
    setIsDownloading(false);
    toast.success("Đã tải xuống tài liệu hướng dẫn thành công!");
  };

  // Logic: Gửi Ticket hỗ trợ
  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault(); // Ngăn reload trang
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Giả lập delay API

    setIsSubmitting(false);
    setTicketOpen(false); // Đóng modal
    toast.success("Yêu cầu hỗ trợ đã được gửi! Mã ticket: #TIC-8829");
  };

  // Logic: Chat
  const handleChat = () => {
    toast.info("Đang kết nối với nhân viên hỗ trợ...", {
      description: "Thời gian chờ dự kiến: 2 phút.",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-orange-100">
      {/* 1. HEADER */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 h-16 flex items-center sticky top-0 z-50">
        <div className="container mx-auto max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center text-slate-500 hover:text-[#F27124] transition-colors group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Trang chủ</span>
            </Link>
            <div className="h-4 w-px bg-slate-200"></div>
            <span className="font-bold text-slate-800 flex items-center gap-2">
              <LifeBuoy className="h-5 w-5 text-[#F27124]" />
              Trung tâm Hỗ trợ
            </span>
          </div>
          <Link href="/login">
            <Button
              size="sm"
              variant="ghost"
              className="text-[#F27124] hover:text-[#d65d1b] hover:bg-orange-50 hidden sm:flex"
            >
              Đăng nhập hệ thống
            </Button>
          </Link>
        </div>
      </header>

      {/* 2. HERO SEARCH SECTION */}
      <section className="bg-white border-b border-slate-200 py-16 px-4">
        <div className="container mx-auto max-w-3xl text-center space-y-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            Chúng tôi có thể giúp gì cho bạn?
          </h1>
          <p className="text-lg text-slate-600">
            Tìm kiếm câu trả lời nhanh chóng hoặc liên hệ trực tiếp với đội ngũ
            hỗ trợ.
          </p>

          {/* INPUT TÌM KIẾM HOẠT ĐỘNG */}
          <div className="relative max-w-xl mx-auto shadow-lg shadow-slate-200/50 rounded-full">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Nhập từ khóa (VD: quên mật khẩu, kết nối Jira...)"
              className="pl-12 h-12 rounded-full border-slate-200 focus-visible:ring-[#F27124] focus-visible:ring-offset-0 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* 3. LEFT COLUMN: CONTACT CARDS */}
          <div className="lg:col-span-4 space-y-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-[#F27124]" /> Kênh liên
                hệ
              </h3>
              <div className="grid gap-4">
                {/* Card 1: Email */}
                <a
                  href="mailto:it.support@fpt.edu.vn"
                  className="group p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-orange-200 transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0 group-hover:bg-[#F27124] transition-colors">
                      <Mail className="h-5 w-5 text-[#F27124] group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">
                        Email Hỗ trợ
                      </h4>
                      <p className="text-sm text-slate-500 mb-2">
                        Phản hồi trong vòng 24h
                      </p>
                      <span className="text-[#F27124] font-medium group-hover:underline">
                        it.support@fpt.edu.vn
                      </span>
                    </div>
                  </div>
                </a>

                {/* Card 2: Hotline */}
                <a
                  href="tel:02873005588"
                  className="group p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 transition-colors">
                      <Phone className="h-5 w-5 text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">
                        Tổng đài IT
                      </h4>
                      <p className="text-sm text-slate-500 mb-2">
                        Thứ 2 - Thứ 7 (8h - 17h)
                      </p>
                      <span className="text-blue-600 font-medium group-hover:underline">
                        (028) 7300 5588
                      </span>
                    </div>
                  </div>
                </a>
              </div>
            </div>

            {/* Documentation Section - NÚT DOWNLOAD HOẠT ĐỘNG */}
            <div className="bg-slate-100/50 p-6 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-2">
                Tài liệu hướng dẫn
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                Tải về tài liệu hướng dẫn sử dụng chi tiết dành cho Sinh viên và
                Giảng viên.
              </p>
              <Button
                className="w-full bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 hover:text-[#F27124] shadow-sm justify-start"
                onClick={handleDownload}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <FileText className="mr-2 h-4 w-4" />
                )}
                {isDownloading
                  ? "Đang tải xuống..."
                  : "Download User Guide (PDF)"}
              </Button>
            </div>
          </div>

          {/* 4. RIGHT COLUMN: FAQ ACCORDION (CÓ LỌC) */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="h-6 w-6 text-slate-400" /> Câu hỏi thường
                gặp
              </h2>
              {searchQuery && (
                <span className="text-sm text-slate-500">
                  Tìm thấy {filteredFAQs.length} kết quả
                </span>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[300px]">
              {filteredFAQs.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFAQs.map((faq, index) => (
                    <AccordionItem
                      key={faq.id}
                      value={faq.id}
                      className="px-6 py-2"
                    >
                      <AccordionTrigger className="text-left font-medium text-slate-800 hover:text-[#F27124] hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Search className="h-12 w-12 text-slate-200 mb-4" />
                  <p className="text-slate-500 font-medium">
                    Không tìm thấy kết quả nào cho "{searchQuery}"
                  </p>
                  <Button
                    variant="link"
                    className="text-[#F27124]"
                    onClick={() => setSearchQuery("")}
                  >
                    Xóa bộ lọc
                  </Button>
                </div>
              )}
            </div>

            {/* CTA SECTION - CÁC NÚT HOẠT ĐỘNG */}
            <div className="mt-8 text-center bg-blue-50/50 rounded-2xl p-8 border border-blue-100">
              <h4 className="font-bold text-slate-900 mb-2">
                Vẫn chưa tìm thấy câu trả lời?
              </h4>
              <p className="text-slate-600 mb-6">
                Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                {/* Modal Gửi Yêu Cầu */}
                <Dialog open={ticketOpen} onOpenChange={setTicketOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-[#F27124] hover:bg-[#d65d1b] shadow-lg shadow-orange-500/20">
                      Gửi yêu cầu hỗ trợ
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Gửi yêu cầu hỗ trợ (Ticket)</DialogTitle>
                      <DialogDescription>
                        Mô tả vấn đề của bạn. Chúng tôi sẽ phản hồi qua email
                        trong vòng 24h.
                      </DialogDescription>
                    </DialogHeader>
                    <form
                      onSubmit={handleSubmitTicket}
                      className="space-y-4 py-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="name">Họ tên</Label>
                        <Input id="name" placeholder="Nguyễn Văn A" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email liên hệ</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="name@fpt.edu.vn"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="issue">Vấn đề gặp phải</Label>
                        <Textarea
                          id="issue"
                          placeholder="Mô tả chi tiết lỗi..."
                          className="min-h-[100px]"
                          required
                        />
                      </div>
                      <DialogFooter>
                        <Button
                          type="submit"
                          className="w-full bg-[#F27124] hover:bg-[#d65d1b]"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                              Đang gửi...
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" /> Gửi yêu cầu
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                {/* Nút Chat */}
                <Button
                  variant="outline"
                  className="bg-white border-blue-200 text-blue-700 hover:bg-blue-50"
                  onClick={handleChat}
                >
                  Chat trực tuyến
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
