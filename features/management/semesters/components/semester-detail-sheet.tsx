"use client";

import { useSemesterDetails } from "@/features/management/semesters/hooks/use-semester-details";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  Calendar,
  BookOpen,
  GraduationCap,
  User,
  LayoutGrid,
  Info,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface SemesterDetailSheetProps {
  semesterId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SemesterDetailSheet({
  semesterId,
  open,
  onOpenChange,
}: SemesterDetailSheetProps) {
  const { data: detailData, isLoading } = useSemesterDetails(
    open && semesterId ? semesterId : undefined,
  );

  const semester = detailData?.semester;
  const classes = detailData?.classes || [];
  const stats = detailData?.stats;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl p-0 bg-white flex flex-col h-[100dvh] font-mono overflow-hidden border-l border-slate-200 shadow-2xl">
        {/* --- STICKY HEADER --- */}
        <SheetHeader className="px-6 py-6 border-b border-slate-100 bg-white z-20 shrink-0 shadow-sm">
          <div className="space-y-3 text-left">
            {" "}
            {/* Thêm text-left vì Header mặc định hay bị center */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#F27124]/10 rounded-lg">
                  <Calendar className="w-5 h-5 text-[#F27124]" />
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] font-black uppercase tracking-widest px-2 py-0.5",
                    semester?.status === "Open"
                      ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                      : "bg-slate-50 text-slate-500 border-slate-200",
                  )}
                >
                  {semester?.status === "Open" ? "Đang diễn ra" : "Đã kết thúc"}
                </Badge>
              </div>
              {semester && (
                <span className="text-[10px] font-bold text-slate-400 font-mono bg-slate-50 px-2 py-1 rounded">
                  ID: {semester.code}
                </span>
              )}
            </div>
            <div className="space-y-1">
              <SheetTitle className="text-3xl font-black text-slate-900 tracking-tighter leading-none">
                {isLoading ? (
                  <div className="h-8 w-48 bg-slate-100 animate-pulse rounded" />
                ) : (
                  semester?.name
                )}
              </SheetTitle>
              {semester && (
                <SheetDescription className="text-sm text-slate-500 font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  Thời gian:{" "}
                  {format(new Date(semester.start_date), "dd/MM/yyyy")} —{" "}
                  {format(new Date(semester.end_date), "dd/MM/yyyy")}
                </SheetDescription>
              )}
            </div>
          </div>
        </SheetHeader>

        {/* VÙNG CUỘN:
           - flex-1: Nó sẽ chiếm hết phần diện tích còn lại của Sheet sau khi trừ đi Header.
           - viewport của ScrollArea cần chiều cao 100% để tính toán thanh cuộn.
        */}
        <ScrollArea className="flex-1 w-full bg-slate-50/10">
          <div className="p-6 space-y-10 pb-24">
            {" "}
            {/* Thêm padding bottom lớn để không bị che bởi nút bấm dưới cùng nếu có */}
            {isLoading ? (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-[#F27124] opacity-20" />
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">
                  Đang nạp dữ liệu...
                </p>
              </div>
            ) : !semester ? (
              <div className="p-12 text-center flex flex-col items-center gap-4">
                <Info className="w-12 h-12 text-slate-200" />
                <p className="text-slate-500 font-bold tracking-tight text-lg">
                  Không tìm thấy thông tin học kỳ.
                </p>
              </div>
            ) : (
              <>
                {/* 1. THỐNG KÊ */}
                <section className="grid grid-cols-2 gap-4">
                  <StatCard
                    icon={BookOpen}
                    label="Tổng lớp học"
                    value={stats?.total_classes}
                    subText={`${stats?.active_classes} lớp hoạt động`}
                    color="blue"
                  />
                  <StatCard
                    icon={GraduationCap}
                    label="Giảng viên"
                    value={stats?.total_lecturers}
                    subText="Tham gia giảng dạy"
                    color="orange"
                  />
                </section>

                {/* 2. NGƯỜI TẠO */}
                {semester.created_by_admin && (
                  <section className="space-y-3 text-left">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 text-left">
                      Người phụ trách tạo
                    </h3>
                    <div className="flex items-center gap-4 p-4 bg-white rounded-3xl border border-slate-100 shadow-sm">
                      <Avatar className="h-12 w-12 rounded-2xl border-2 border-white shadow-sm ring-1 ring-slate-100">
                        <AvatarFallback className="bg-slate-50 text-slate-400 font-black uppercase">
                          {semester.created_by_admin.full_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-black text-slate-900 leading-none">
                          {semester.created_by_admin.full_name}
                        </p>
                        <p className="text-xs text-slate-400 font-medium mt-1.5">
                          {semester.created_by_admin.email}
                        </p>
                      </div>
                    </div>
                  </section>
                )}

                <Separator className="bg-slate-100" />

                {/* 3. DANH SÁCH LỚP */}
                <section className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <LayoutGrid className="w-4 h-4 text-slate-400" />
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                        Danh mục lớp học
                      </h3>
                    </div>
                    <Badge className="rounded-full bg-slate-900 text-white font-bold px-3">
                      {classes.length}
                    </Badge>
                  </div>

                  <div className="grid gap-3">
                    {classes.map((cls) => (
                      <ClassItem key={cls._id} cls={cls} />
                    ))}
                  </div>
                </section>
              </>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

// Sub-components giữ nguyên logic nhưng ép kiểu căn lề trái
function StatCard({ icon: Icon, label, value, subText, color }: any) {
  const colors = {
    blue: "bg-blue-50 text-blue-600 ring-blue-100",
    orange: "bg-orange-50 text-[#F27124] ring-orange-100",
  };
  return (
    <div className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm text-left">
      <div
        className={cn(
          "inline-flex p-2.5 rounded-xl mb-3 ring-4",
          colors[color as keyof typeof colors],
        )}
      >
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className="text-3xl font-black text-slate-900 tracking-tighter leading-none">
        {value || 0}
      </p>
      <p className="text-[10px] text-slate-400 font-bold mt-2">{subText}</p>
    </div>
  );
}

function ClassItem({ cls }: { cls: any }) {
  return (
    <div className="group flex items-center justify-between p-4 bg-white rounded-3xl border border-slate-100 transition-all hover:border-[#F27124]/30">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 font-black text-sm group-hover:bg-[#F27124] group-hover:text-white transition-all">
          {cls.name.substring(0, 2).toUpperCase()}
        </div>
        <div className="text-left">
          <p className="text-sm font-black text-slate-900 leading-tight">
            {cls.name}
          </p>
          <p className="text-[11px] text-slate-400 font-bold truncate max-w-[200px]">
            {cls.subjectName}
          </p>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-[#F27124]" />
    </div>
  );
}
