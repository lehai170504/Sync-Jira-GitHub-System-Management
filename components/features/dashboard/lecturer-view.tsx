"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import {
  Users,
  FileCheck,
  Clock,
  MoreVertical,
  ArrowRight,
  Bell,
  BookOpen,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function LecturerDashboard() {
  const router = useRouter();
  const [className, setClassName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Kiểm tra Cookie xem đã chọn lớp chưa
    const savedClass = Cookies.get("lecturer_class_name");
    const savedSubject = Cookies.get("lecturer_subject");

    if (!savedClass) {
      // Chưa chọn -> Đá về trang danh sách lớp
      router.push("/lecturer/courses");
    } else {
      setClassName(savedClass);
      setSubjectCode(savedSubject || "");
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) return null; // Hoặc loading spinner nhỏ

  return (
    <div className="space-y-6 animate-in fade-in-50">
      {/* 1. CONTEXT BANNER: Thông báo lớp đang Active */}
      {/* Vì Header chính nằm ở DashboardPage, ta cần một banner nhỏ để biết đang xem lớp nào */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-full text-blue-600">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-blue-900 font-medium">
              Lớp học đang chọn:
            </p>
            <h3 className="text-xl font-bold text-blue-700">
              {className}{" "}
              <span className="text-blue-400 font-normal">| {subjectCode}</span>
            </h3>
          </div>
        </div>
        <Button
          variant="ghost"
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
          onClick={() => router.push("/lecturer/courses")}
        >
          Đổi lớp khác <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      {/* 2. STATS CARDS (Thống kê nhanh) */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Card 1: Sĩ số */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sĩ số lớp</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">30/30</div>
            <p className="text-xs text-green-600 mt-1 font-medium flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>{" "}
              100% Active
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Deadline */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiến độ Lab 1</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18/30</div>
            <p className="text-xs text-muted-foreground mt-1">
              Deadline:{" "}
              <span className="text-red-500 font-bold">23:59 hôm nay</span>
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Cảnh báo Nhóm */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tình trạng Nhóm
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1 Nhóm</div>
            <p className="text-xs text-orange-600 mt-1 font-medium">
              Đang gặp rủi ro (Risk) tiến độ
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. MAIN CONTENT: Timeline & Reminders */}
      <div className="grid gap-6 md:grid-cols-7">
        {/* Cột Trái: Timeline Hoạt động (Chiếm 4/7) */}
        <Card className="md:col-span-4 h-fit">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle>Bảng tin hoạt động</CardTitle>
              <CardDescription>
                Cập nhật mới nhất từ sinh viên và hệ thống
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4 text-gray-500" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-8 pl-2">
              {/* Item 1 */}
              <div className="flex gap-4 relative">
                <div className="absolute left-[-9px] top-0 bottom-0 w-[2px] bg-gray-100 last:bg-transparent"></div>
                <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 border border-blue-200 z-10">
                  <span className="text-blue-600 font-bold text-[10px]">
                    SV
                  </span>
                </div>
                <div className="space-y-1 pb-1">
                  <p className="text-sm font-medium leading-none text-gray-900">
                    Phạm Văn B{" "}
                    <span className="font-normal text-muted-foreground">
                      đã đặt câu hỏi trong
                    </span>{" "}
                    Assignment 1
                  </p>
                  <p className="text-sm text-gray-600 italic bg-gray-50 p-2 rounded-md border">
                    "Thầy ơi phần backend em dùng NestJS được không ạ?"
                  </p>
                  <p className="text-[10px] text-gray-400 pt-1">
                    15 phút trước
                  </p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex gap-4 relative">
                <div className="absolute left-[-9px] top-0 bottom-0 w-[2px] bg-gray-100"></div>
                <div className="h-9 w-9 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 border border-orange-200 z-10">
                  <span className="text-orange-600 font-bold text-[10px]">
                    SYS
                  </span>
                </div>
                <div className="space-y-1 pb-1">
                  <p className="text-sm font-medium leading-none text-gray-900">
                    Hệ thống{" "}
                    <span className="font-normal text-muted-foreground">
                      đã tự động chấm điểm
                    </span>{" "}
                    Quiz 1
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="text-green-600 bg-green-50"
                    >
                      Hoàn thành 28/30
                    </Badge>
                  </div>
                  <p className="text-[10px] text-gray-400 pt-1">1 giờ trước</p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex gap-4 relative">
                <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 border border-green-200 z-10">
                  <span className="text-green-600 font-bold text-[10px]">
                    TM
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-gray-900">
                    Nhóm 1 (E-Commerce){" "}
                    <span className="font-normal text-muted-foreground">
                      vừa nộp báo cáo
                    </span>{" "}
                    Sprint 2
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs mt-1"
                    onClick={() => router.push("/lecturer/class-management")}
                  >
                    Xem báo cáo
                  </Button>
                  <p className="text-[10px] text-gray-400 pt-1">3 giờ trước</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cột Phải: Nhắc nhở & Shortcut (Chiếm 3/7) */}
        <div className="md:col-span-3 space-y-6">
          {/* Card Nhắc nhở */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Bell className="h-4 w-4 text-[#F27124]" /> Cần xử lý ngay
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-lg bg-red-50 border border-red-100 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-red-700 text-sm">
                      Chấm bài Lab 1
                    </h4>
                    <p className="text-xs text-red-600">
                      Hạn chót chấm: Ngày mai
                    </p>
                  </div>
                  <Badge variant="destructive" className="text-[10px]">
                    High
                  </Badge>
                </div>
                <Button
                  size="sm"
                  className="w-full bg-red-600 hover:bg-red-700 text-white border-0 h-8"
                  onClick={() => router.push("/lecturer/assignments")}
                >
                  Chấm ngay
                </Button>
              </div>

              <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                <h4 className="font-semibold text-blue-700 text-sm mb-1">
                  Duyệt đề tài nhóm
                </h4>
                <p className="text-xs text-blue-600 mb-3">
                  Có 2 nhóm đang chờ duyệt đề tài.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full border-blue-200 text-blue-700 hover:bg-blue-100 h-8"
                  onClick={() => router.push("/lecturer/class-management")}
                >
                  Xem danh sách
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Card Shortcut */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Truy cập nhanh</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center gap-2 hover:border-[#F27124] hover:text-[#F27124]"
                onClick={() => router.push("/lecturer/schedule")}
              >
                <Clock className="h-5 w-5" />
                <span className="text-xs">Lịch dạy</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center gap-2 hover:border-[#F27124] hover:text-[#F27124]"
                onClick={() => router.push("/lecturer/grading")}
              >
                <FileCheck className="h-5 w-5" />
                <span className="text-xs">Sổ điểm</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
