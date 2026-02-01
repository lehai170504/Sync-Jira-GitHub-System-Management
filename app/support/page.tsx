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
  Sparkles,
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
import { Badge } from "@/components/ui/badge";

const faqData = [
  {
    id: "item-1",
    question: "Làm sao để kết nối jira vào hệ thống syncsystem?",
    answer: (
      <div className="text-slate-500 leading-relaxed text-sm font-bold">
        <p className="mb-2 tracking-tighter text-[10px]">các bước thực hiện:</p>
        <ol className="list-decimal list-inside space-y-2 ml-1">
          <li>Đăng nhập vào hệ thống quản lý.</li>
          <li>Truy cập cài đặt dự án &gt; mục kết nối.</li>
          <li>Nhập jira url và api token từ atlassian.</li>
        </ol>
      </div>
    ),
  },
  {
    id: "item-2",
    question: "Hệ thống tính điểm đóng góp như thế nào?",
    answer: (
      <div className="text-slate-500 leading-relaxed text-sm font-bold">
        Điểm số được tính toán dựa trên jira performance (50%) và github
        contribution (50%) thông qua số lượng task hoàn thành và commit hợp lệ.
      </div>
    ),
  },
];

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [ticketOpen, setTicketOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredFAQs = faqData.filter((item) =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDownload = async () => {
    setIsDownloading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsDownloading(false);
    toast.success("tải tài liệu thành công!");
  };

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setTicketOpen(false);
    toast.success("yêu cầu đã được gửi thành công");
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-mono selection:bg-orange-100 overflow-x-hidden relative">
      {/* --- background decor --- */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[600px] h-[600px] rounded-full bg-orange-100/30 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[5%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-50/40 blur-[100px]"></div>
      </div>

      {/* --- header --- */}
      <header className="bg-white/60 backdrop-blur-2xl border-b border-slate-200/40 px-8 h-20 flex items-center sticky top-0 z-50">
        <div className="container mx-auto max-w-7xl flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-[#F27124] transition-all duration-300 group active:scale-95 shadow-lg shadow-slate-900/10"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-bold tracking-widest">
              Quay lại trang chủ
            </span>
          </Link>
          <div className="flex items-center gap-2 opacity-50">
            <LifeBuoy className="h-4 w-4 text-[#F27124]" />
            <span className="text-[10px] font-bold tracking-widest">
              Trung tâm hỗ trợ
            </span>
          </div>
        </div>
      </header>

      {/* --- hero section --- */}
      <section className="py-20 px-6 border-b border-slate-100 bg-white/40">
        <div className="container mx-auto max-w-3xl text-center space-y-8 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100">
            <Sparkles className="h-3 w-3 text-[#F27124]" />
            <span className="text-[8px] font-bold tracking-widest text-[#F27124]">
              Hệ thống giải đáp tự động
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-slate-900 leading-none lowercase">
            Chúng tôi có thể giúp gì cho bạn?
          </h1>

          <div className="relative max-w-xl mx-auto animate-reveal">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#F27124]" />
            <Input
              placeholder="nhập từ khóa tìm kiếm câu hỏi..."
              className="pl-12 h-14 rounded-2xl border-slate-100 bg-white shadow-2xl shadow-slate-200/50 focus-visible:ring-[#F27124]/20 text-xs font-bold transition-all lowercase"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      <main className="container mx-auto px-6 py-16 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* --- cột trái: liên hệ --- */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-1 rounded-[32px] bg-gradient-to-br from-slate-100 to-transparent">
              <div className="bg-white p-6 rounded-[31px] space-y-4 shadow-sm border border-slate-100/50">
                <h3 className="text-[10px] font-bold tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-[#F27124]" /> Kênh liên
                  hiện
                </h3>

                <a
                  href="mailto:it.support@fpt.edu.vn"
                  className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-100"
                >
                  <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Mail className="h-5 w-5 text-[#F27124]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-tighter text-slate-400">
                      Email hỗ trợ
                    </p>
                    <p className="text-xs font-bold text-slate-800">
                      it.support@fpt.edu.vn
                    </p>
                  </div>
                </a>

                <a
                  href="tel:02873005588"
                  className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-100"
                >
                  <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Phone className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-tighter text-slate-400">
                      Tổng đài viên
                    </p>
                    <p className="text-xs font-bold text-slate-800">
                      (028) 7300 5588
                    </p>
                  </div>
                </a>
              </div>
            </div>

            <div className="bg-slate-900 p-8 rounded-[32px] text-white space-y-4 shadow-2xl shadow-slate-900/20">
              <h3 className="font-bold text-sm italic tracking-tighter">
                Tài liệu kỹ thuật
              </h3>
              <p className="text-[10px] text-slate-400 leading-relaxed font-bold">
                Tải về cẩm nang sử dụng hệ thống bản mới nhất.
              </p>
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                className="w-full bg-white/10 hover:bg-[#F27124] text-white border-0 h-12 rounded-xl transition-all font-bold text-[10px] tracking-widest"
              >
                {isDownloading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <FileText className="mr-2 h-4 w-4" />
                )}
                Tải tài liệu pdf
              </Button>
            </div>
          </div>

          {/* --- cột phải: faq --- */}
          <div className="lg:col-span-8 animate-fade-up">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-900 italic flex items-center gap-3 ">
                <HelpCircle className="h-6 w-6 text-[#F27124]" /> Câu hỏi thường
                gặp
              </h2>
              {searchQuery && (
                <Badge className="bg-orange-100 text-[#F27124] border-0 rounded-lg">
                  {filteredFAQs.length} kết quả
                </Badge>
              )}
            </div>

            <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/30 overflow-hidden p-4">
              {filteredFAQs.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFAQs.map((faq) => (
                    <AccordionItem
                      key={faq.id}
                      value={faq.id}
                      className="border-b border-slate-50 px-4"
                    >
                      <AccordionTrigger className="text-left font-bold text-slate-800 hover:text-[#F27124] text-sm py-6 hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="pb-6">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="py-20 text-center opacity-30">
                  <Search className="h-12 w-12 mx-auto mb-4" />
                  <p className="text-sm font-bold tracking-widest">
                    Không tìm thấy dữ liệu
                  </p>
                </div>
              )}
            </div>

            <div className="mt-10 p-10 rounded-[40px] bg-slate-50 border border-slate-100 text-center space-y-6">
              <h4 className="font-bold text-slate-900 italic tracking-tighter lowercase">
                Vẫn gặp khó khăn?
              </h4>
              <div className="flex flex-wrap justify-center gap-4">
                <Dialog open={ticketOpen} onOpenChange={setTicketOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-slate-900 hover:bg-[#F27124] text-white h-14 px-8 rounded-2xl font-bold text-[10px] tracking-widest shadow-xl">
                      Gửi yêu cầu hỗ trợ
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-[32px] border-0 font-mono">
                    <DialogHeader>
                      <DialogTitle className="font-bold italic tracking-tighter lowercase">
                        Tạo yêu cầu mới
                      </DialogTitle>
                      <DialogDescription className="text-[10px] font-bold tracking-widest">
                        Phản hồi trung bình trong vòng 24 giờ
                      </DialogDescription>
                    </DialogHeader>
                    <form
                      onSubmit={handleSubmitTicket}
                      className="space-y-4 mt-4"
                    >
                      <Input
                        placeholder="họ và tên"
                        className="h-12 rounded-xl bg-slate-50 lowercase"
                        required
                      />
                      <Input
                        type="email"
                        placeholder="email liên hệ"
                        className="h-12 rounded-xl bg-slate-50 lowercase"
                        required
                      />
                      <Textarea
                        placeholder="mô tả chi tiết vấn đề..."
                        className="rounded-xl bg-slate-50 min-h-[100px] lowercase"
                        required
                      />
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-12 bg-[#F27124] rounded-xl font-bold tracking-widest text-[10px]"
                      >
                        {isSubmitting ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          "xác nhận gửi"
                        )}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="outline"
                  className="h-14 px-8 rounded-2xl border-slate-200 font-bold text-[10px] tracking-widest hover:bg-white transition-all active:scale-95 shadow-sm"
                >
                  Trò chuyện trực tuyến
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
