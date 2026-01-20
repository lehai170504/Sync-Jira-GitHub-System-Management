"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Calendar,
  FileText,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// MOCK DATA
const ASSIGNMENTS = [
  {
    id: 1,
    title: "Lab 1: Java Basics",
    type: "Lab",
    dueDate: "2026-01-20",
    submitted: 28,
    total: 30,
    status: "Closed",
  },
  {
    id: 2,
    title: "Lab 2: OOP Principles",
    type: "Lab",
    dueDate: "2026-01-27",
    submitted: 15,
    total: 30,
    status: "Open",
  },
  {
    id: 3,
    title: "Quiz 1: Scrum Process",
    type: "Quiz",
    dueDate: "2026-02-01",
    submitted: 30,
    total: 30,
    status: "Graded",
  },
  {
    id: 4,
    title: "Assignment 1: SRS Document",
    type: "Project",
    dueDate: "2026-02-10",
    submitted: 0,
    total: 6,
    status: "Upcoming",
  }, // 6 nhóm
];

export default function AssignmentsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = ASSIGNMENTS.filter((a) =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Bài tập & Đánh giá
          </h1>
          <p className="text-muted-foreground text-sm">
            Quản lý các hạng mục bài tập trong học kỳ
          </p>
        </div>
        <Button className="bg-[#F27124] hover:bg-[#d65d1b]">
          <Plus className="mr-2 h-4 w-4" /> Tạo bài mới
        </Button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Tìm bài tập..."
            className="pl-8 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filtered.map((item) => (
          <Card key={item.id} className="hover:shadow-sm transition-shadow">
            <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className={`h-12 w-12 rounded-lg flex items-center justify-center font-bold text-lg
                        ${
                          item.type === "Lab"
                            ? "bg-blue-100 text-blue-600"
                            : item.type === "Quiz"
                            ? "bg-purple-100 text-purple-600"
                            : "bg-orange-100 text-orange-600"
                        }`}
                >
                  {item.type.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> {item.dueDate}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <FileText className="h-3.5 w-3.5" /> {item.submitted}/
                      {item.total} đã nộp
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                {item.status === "Open" && (
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    Đang mở
                  </Badge>
                )}
                {item.status === "Closed" && (
                  <Badge variant="secondary">Đã đóng</Badge>
                )}
                {item.status === "Graded" && (
                  <Badge
                    variant="outline"
                    className="text-blue-600 border-blue-200"
                  >
                    <CheckCircle2 className="mr-1 h-3 w-3" /> Đã chấm
                  </Badge>
                )}
                {item.status === "Upcoming" && (
                  <Badge variant="outline" className="text-gray-500">
                    <Clock className="mr-1 h-3 w-3" /> Sắp tới
                  </Badge>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Chấm điểm</DropdownMenuItem>
                    <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      Xóa
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
