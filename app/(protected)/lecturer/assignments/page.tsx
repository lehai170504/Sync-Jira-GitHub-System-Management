"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Calendar,
  MoreVertical,
  CheckCircle2,
  Clock,
  Filter,
  ArrowRight,
  User,
  Users,
  Laptop,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

// MOCK DATA (Thêm trường 'mode')
const ASSIGNMENTS = [
  {
    id: 1,
    title: "Lab 1: Java Basics",
    type: "Lab",
    mode: "Individual", // Cá nhân
    dueDate: "2026-01-20",
    submitted: 28,
    total: 30,
    status: "Closed",
    description: "Cài đặt môi trường và viết app Hello World.",
  },
  {
    id: 2,
    title: "Assignment 1: SRS Document",
    type: "Project",
    mode: "Group", // Nhóm
    dueDate: "2026-02-10",
    submitted: 2,
    total: 6, // 6 Nhóm
    status: "Open",
    description: "Nộp tài liệu đặc tả yêu cầu (SRS) v1.0.",
  },
  {
    id: 3,
    title: "Quiz 1: Scrum Process",
    type: "Quiz",
    mode: "Individual",
    dueDate: "2026-02-01",
    submitted: 30,
    total: 30,
    status: "Graded",
    description: "Trắc nghiệm kiến thức về Agile/Scrum.",
  },
];

export default function AssignmentsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // State cho Form tạo mới
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newAssignMode, setNewAssignMode] = useState("Individual");

  const filtered = ASSIGNMENTS.filter((a) => {
    const matchSearch = a.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchType =
      filterType === "all" || a.type.toLowerCase() === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-8 animate-in fade-in-50 pb-10">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Bài tập & Đánh giá
          </h1>
          <p className="text-gray-500 mt-2">
            Quản lý các bài Lab, Quiz và Đồ án môn học
          </p>
        </div>

        {/* DIALOG TẠO BÀI TẬP MỚI */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#F27124] hover:bg-[#d65d1b] shadow-lg shadow-orange-500/20 rounded-full px-6">
              <Plus className="mr-2 h-4 w-4" /> Tạo bài mới
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Tạo bài tập mới</DialogTitle>
              <DialogDescription>
                Thiết lập thông tin và hình thức nộp bài cho sinh viên.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Tên bài tập</Label>
                <Input id="title" placeholder="VD: Lab 3 - React Hooks" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Loại bài tập</Label>
                  <Select defaultValue="lab">
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lab">Lab (Thực hành)</SelectItem>
                      <SelectItem value="quiz">Quiz (Trắc nghiệm)</SelectItem>
                      <SelectItem value="project">Project (Đồ án)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Hạn nộp (Deadline)</Label>
                  <Input type="datetime-local" />
                </div>
              </div>

              {/* OPTION QUAN TRỌNG: CÁ NHÂN HAY NHÓM */}
              <div className="space-y-3">
                <Label>Hình thức làm bài</Label>
                <RadioGroup
                  defaultValue="Individual"
                  className="grid grid-cols-2 gap-4"
                  onValueChange={setNewAssignMode}
                >
                  <div>
                    <RadioGroupItem
                      value="Individual"
                      id="mode-individual"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="mode-individual"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#F27124] peer-data-[state=checked]:text-[#F27124] cursor-pointer transition-all"
                    >
                      <User className="mb-2 h-6 w-6" />
                      <span className="font-semibold">Cá nhân</span>
                      <span className="text-xs text-muted-foreground font-normal text-center mt-1">
                        Mỗi sinh viên nộp 1 bài riêng biệt.
                      </span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="Group"
                      id="mode-group"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="mode-group"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#F27124] peer-data-[state=checked]:text-[#F27124] cursor-pointer transition-all"
                    >
                      <Users className="mb-2 h-6 w-6" />
                      <span className="font-semibold">Theo Nhóm</span>
                      <span className="text-xs text-muted-foreground font-normal text-center mt-1">
                        Đại diện nhóm nộp bài. Điểm chung cho cả nhóm.
                      </span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="desc">Mô tả / Yêu cầu</Label>
                <Textarea id="desc" placeholder="Nhập hướng dẫn làm bài..." />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Hủy
              </Button>
              <Button
                className="bg-[#F27124] hover:bg-[#d65d1b]"
                onClick={() => setIsCreateOpen(false)}
              >
                Tạo bài tập
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm bài tập..."
            className="pl-10 bg-gray-50 border-transparent focus:bg-white focus:border-[#F27124] focus:ring-2 focus:ring-orange-100 rounded-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select onValueChange={setFilterType} defaultValue="all">
          <SelectTrigger className="w-[180px] rounded-xl border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2 text-gray-600">
              <Filter className="h-4 w-4" />{" "}
              <SelectValue placeholder="Loại bài tập" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="lab">Lab</SelectItem>
            <SelectItem value="quiz">Quiz</SelectItem>
            <SelectItem value="project">Project</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* LIST VIEW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => {
          const progress = (item.submitted / item.total) * 100;
          const isGroup = item.mode === "Group";

          return (
            <Card
              key={item.id}
              onClick={() => router.push(`/lecturer/assignments/${item.id}`)}
              className="group relative border border-gray-100 hover:border-orange-200 shadow-sm hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 rounded-2xl cursor-pointer bg-white overflow-hidden"
            >
              {/* Status Strip */}
              <div
                className={`absolute top-0 left-0 w-1.5 h-full transition-colors duration-300
                  ${
                    item.status === "Open"
                      ? "bg-green-500"
                      : item.status === "Closed"
                      ? "bg-gray-300"
                      : "bg-blue-500"
                  }`}
              />

              <CardContent className="p-6 pl-8">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-2">
                    {/* BADGE LOẠI BÀI */}
                    <Badge
                      variant="secondary"
                      className="font-semibold px-2.5 py-0.5 rounded-md border-0 bg-gray-100 text-gray-700"
                    >
                      {item.type}
                    </Badge>
                    {/* BADGE HÌNH THỨC (QUAN TRỌNG) */}
                    <Badge
                      variant="outline"
                      className={`gap-1 px-2 ${
                        isGroup
                          ? "text-purple-600 border-purple-200 bg-purple-50"
                          : "text-blue-600 border-blue-200 bg-blue-50"
                      }`}
                    >
                      {isGroup ? (
                        <Users className="h-3 w-3" />
                      ) : (
                        <User className="h-3 w-3" />
                      )}
                      {isGroup ? "Group" : "Individual"}
                    </Badge>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 -mr-2"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>

                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1 group-hover:text-[#F27124] transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-6 h-10">
                  {item.description}
                </p>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-gray-500 font-medium bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {new Date(item.dueDate).toLocaleDateString("vi-VN")}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {item.status === "Open" && (
                        <span className="text-green-600 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> Đang mở
                        </span>
                      )}
                      {item.status === "Closed" && (
                        <span className="text-gray-500">Đã đóng</span>
                      )}
                      {item.status === "Graded" && (
                        <span className="text-blue-600 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Đã chấm
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-gray-600">Tiến độ nộp</span>
                      <span
                        className={
                          progress === 100 ? "text-green-600" : "text-[#F27124]"
                        }
                      >
                        {item.submitted}/{item.total} {isGroup ? "nhóm" : "SV"}
                      </span>
                    </div>
                    <Progress
                      value={progress}
                      className="h-2 bg-gray-100"
                      indicatorColor={
                        progress === 100 ? "bg-green-500" : "bg-[#F27124]"
                      }
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="px-6 py-3 bg-gray-50/50 border-t border-gray-100 flex justify-end group-hover:bg-orange-50/30 transition-colors">
                <div className="flex items-center gap-1 text-xs font-semibold text-gray-400 group-hover:text-[#F27124] transition-colors">
                  Xem chi tiết <ArrowRight className="h-3 w-3" />
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
