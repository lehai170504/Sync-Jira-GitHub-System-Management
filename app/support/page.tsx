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
    Sparkles,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { BackgroundBeams } from "@/features/home/components/background-beams";

const faqData = [
    {
        id: "item-1",
        question: "Làm sao để kết nối Jira vào hệ thống SyncSystem?",
        answer: (
            <div className="text-slate-500 leading-relaxed text-base font-medium">
                <p className="mb-4 text-sm font-bold uppercase tracking-widest text-orange-500">Các bước thực hiện:</p>
                <ol className="list-decimal list-inside space-y-3">
                    <li>Đăng nhập vào Dashboard của bạn.</li>
                    <li>Truy cập mục <span className="font-bold text-slate-900">Quản lý dự án</span> &gt; <span className="font-bold text-slate-900">Kết nối Jira</span>.</li>
                    <li>Nhập Jira URL và API Token từ Atlassian.</li>
                    <li>Nhấn đồng bộ để bắt đầu lấy dữ liệu.</li>
                </ol>
            </div>
        ),
    },
    {
        id: "item-2",
        question: "Hệ thống tính điểm đóng góp như thế nào?",
        answer: (
            <p className="text-slate-500 leading-relaxed text-base font-medium">
                Điểm số được tính toán dựa trên hiệu suất Jira (Story Points, trạng thái Task) và đóng góp GitHub (Commit, PR) thông qua các thuật toán phân tích chuyên sâu.
            </p>
        ),
    },
    {
        id: "item-3",
        question: "Làm cách nào để lấy GitHub Personal Access Token?",
        answer: (
            <p className="text-slate-500 leading-relaxed text-base font-medium">
                Bạn vào Settings &gt; Developer Settings &gt; Personal Access Tokens trên GitHub và tạo token với quyền 'repo' để hệ thống có thể đọc lịch sử commit.
            </p>
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
        toast.success("Tải tài liệu thành công!");
    };

    const handleSubmitTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setTicketOpen(false);
        toast.success("Yêu cầu của bạn đã được gửi thành công");
    };

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
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                            <LifeBuoy className="h-5 w-5 text-orange-500" />
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 hidden sm:block">
                            Trung tâm hỗ trợ SyncSystem
                        </span>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-32 px-6 relative z-10">
                <div className="container mx-auto max-w-4xl text-center space-y-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20">
                        <Sparkles className="h-3.5 w-3.5 text-orange-500" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-500">
                            Hỗ trợ 24/7 cho sinh viên FPT
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[0.9] uppercase">
                        Chúng tôi có thể <br />
                        <span className="text-slate-400">giúp gì cho bạn?</span>
                    </h1>

                    <div className="relative max-w-2xl mx-auto">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <Input
                            placeholder="Tìm kiếm câu hỏi hoặc vấn đề của bạn..."
                            className="pl-14 h-20 rounded-[32px] border-slate-200 bg-white shadow-2xl shadow-slate-200/50 focus-visible:ring-orange-500/20 text-lg font-medium transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </section>

            <main className="container mx-auto px-6 py-20 max-w-7xl relative z-10">
                <div className="grid lg:grid-cols-12 gap-16 items-start">
                    {/* Cột trái: Liên hệ */}
                    <div className="lg:col-span-4 space-y-10">
                        <div className="p-10 rounded-[48px] bg-white border border-slate-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] space-y-8">
                            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3">
                                <MessageSquare className="h-5 w-5 text-orange-500" /> Kênh liên hệ
                            </h3>

                            <div className="space-y-4">
                                <ContactItem
                                    icon={Mail}
                                    label="Email hỗ trợ"
                                    value="it.support@fpt.edu.vn"
                                    href="mailto:it.support@fpt.edu.vn"
                                    color="bg-orange-500/10 text-orange-600"
                                />
                                <ContactItem
                                    icon={Phone}
                                    label="Tổng đài viên"
                                    value="(028) 7300 5588"
                                    href="tel:02873005588"
                                    color="bg-blue-500/10 text-blue-600"
                                />
                            </div>
                        </div>

                        <div className="bg-slate-950 p-12 rounded-[48px] text-white space-y-8 shadow-2xl shadow-slate-950/20 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2" />
                            <div className="relative z-10 space-y-6">
                                <h3 className="font-bold text-2xl uppercase tracking-tighter">
                                    Tài liệu kỹ thuật
                                </h3>
                                <p className="text-sm text-slate-400 leading-relaxed font-medium">
                                    Tải về cẩm nang sử dụng hệ thống bản mới nhất để làm chủ quy trình đồng bộ.
                                </p>
                                <Button
                                    onClick={handleDownload}
                                    disabled={isDownloading}
                                    className="w-full bg-white hover:bg-orange-500 text-slate-950 hover:text-white h-16 rounded-2xl transition-all font-bold text-xs uppercase tracking-widest shadow-xl group"
                                >
                                    {isDownloading ? (
                                        <Loader2 className="animate-spin" />
                                    ) : (
                                        <>
                                            <FileText className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                                            Tải tài liệu (PDF)
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Cột phải: FAQ */}
                    <div className="lg:col-span-8 space-y-12">
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-4 uppercase tracking-tighter">
                                <HelpCircle className="h-8 w-8 text-orange-500" /> Câu hỏi thường gặp
                            </h2>
                            {searchQuery && (
                                <Badge variant="outline" className="px-4 py-1.5 rounded-full border-orange-500/30 text-orange-500 font-bold">
                                    {filteredFAQs.length} kết quả
                                </Badge>
                            )}
                        </div>

                        <div className="bg-white rounded-[48px] border border-slate-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] overflow-hidden p-6 md:p-10">
                            {filteredFAQs.length > 0 ? (
                                <Accordion type="single" collapsible className="w-full space-y-4">
                                    {filteredFAQs.map((faq) => (
                                        <AccordionItem
                                            key={faq.id}
                                            value={faq.id}
                                            className="border-b border-slate-50 last:border-0"
                                        >
                                            <AccordionTrigger className="text-left font-bold text-slate-800 hover:text-orange-500 text-xl py-8 hover:no-underline transition-colors tracking-tight">
                                                {faq.question}
                                            </AccordionTrigger>
                                            <AccordionContent className="pb-8">
                                                {faq.answer}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            ) : (
                                <div className="py-32 text-center">
                                    <Search className="h-16 w-16 mx-auto mb-6 text-slate-200" />
                                    <p className="text-lg font-bold text-slate-400 uppercase tracking-widest">
                                        Không tìm thấy câu hỏi phù hợp
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="p-12 md:p-20 rounded-[60px] bg-slate-50 border border-slate-100 text-center space-y-10">
                            <div className="space-y-4">
                                <h4 className="text-4xl font-bold text-slate-900 uppercase tracking-tighter">
                                    Vẫn gặp khó khăn?
                                </h4>
                                <p className="text-slate-500 font-medium text-lg">
                                    Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giải đáp mọi thắc mắc của bạn.
                                </p>
                            </div>

                            <div className="flex flex-wrap justify-center gap-6">
                                <Dialog open={ticketOpen} onOpenChange={setTicketOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="bg-slate-950 hover:bg-orange-500 text-white h-20 px-12 rounded-[28px] font-bold text-xs uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95">
                                            Gửi yêu cầu hỗ trợ
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="rounded-[40px] border-0 bg-white p-10 max-w-xl">
                                        <DialogHeader className="space-y-4 mb-8">
                                            <DialogTitle className="text-3xl font-bold uppercase tracking-tighter">
                                                Tạo yêu cầu mới
                                            </DialogTitle>
                                            <DialogDescription className="text-sm font-medium text-slate-500">
                                                Chúng tôi sẽ phản hồi yêu cầu của bạn qua email trong vòng 24 giờ làm việc.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={handleSubmitTicket} className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 pl-4">Họ và tên</label>
                                                <Input placeholder="Nguyễn Văn A" className="h-14 rounded-2xl bg-slate-50 border-0" required />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 pl-4">Email liên hệ</label>
                                                <Input type="email" placeholder="a.nguyen@fpt.edu.vn" className="h-14 rounded-2xl bg-slate-50 border-0" required />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 pl-4">Vấn đề cần hỗ trợ</label>
                                                <Textarea placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải..." className="rounded-2xl bg-slate-50 border-0 min-h-[120px] p-6" required />
                                            </div>
                                            <Button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full h-16 bg-orange-500 hover:bg-slate-950 text-white rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl transition-all"
                                            >
                                                {isSubmitting ? <Loader2 className="animate-spin" /> : "Gửi yêu cầu ngay"}
                                            </Button>
                                        </form>
                                    </DialogContent>
                                </Dialog>

                                <Button
                                    variant="ghost"
                                    className="h-20 px-12 rounded-[28px] border-2 border-slate-200 text-slate-600 hover:text-slate-900 font-bold text-xs uppercase tracking-[0.2em] hover:bg-white transition-all active:scale-95 shadow-sm"
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

function ContactItem({ icon: Icon, label, value, href, color }: any) {
    return (
        <a
            href={href}
            className="flex items-center gap-5 p-5 rounded-[28px] hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-100"
        >
            <div className={`h-14 w-14 rounded-2xl ${color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                <Icon className="h-6 w-6" />
            </div>
            <div>
                <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1">
                    {label}
                </p>
                <p className="text-base font-bold text-slate-800">
                    {value}
                </p>
            </div>
        </a>
    )
}
