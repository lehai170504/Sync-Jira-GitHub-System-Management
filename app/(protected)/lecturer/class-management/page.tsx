"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation"; // Dùng router để chuyển trang
import {
  Search,
  Users,
  UserPlus,
  FileSpreadsheet,
  MoreHorizontal,
  ArrowRight,
  LayoutGrid,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

// MOCK DATA
const INITIAL_STUDENTS = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    code: "SE1701",
    email: "an@fpt.edu.vn",
    group: "Team 1",
  },
  {
    id: "2",
    name: "Trần Thị B",
    code: "SE1702",
    email: "binh@fpt.edu.vn",
    group: "Team 1",
  },
  {
    id: "3",
    name: "Lê Văn C",
    code: "SE1703",
    email: "cuong@fpt.edu.vn",
    group: "Team 2",
  },
  {
    id: "4",
    name: "Phạm Minh D",
    code: "SE1704",
    email: "duy@fpt.edu.vn",
    group: null,
  },
];

export default function ClassManagementPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- EXCEL IMPORT HANDLER ---
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
        loading: "Đang xử lý file...",
        success: "Import danh sách thành công!",
        error: "Lỗi đọc file",
      });
    }
  };

  // Logic Grouping
  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const grouped = filtered.reduce((acc, student) => {
    const key = student.group || "Chưa có nhóm";
    if (!acc[key]) acc[key] = [];
    acc[key].push(student);
    return acc;
  }, {} as Record<string, typeof INITIAL_STUDENTS>);

  const groupKeys = Object.keys(grouped).sort();

  // --- HÀM CHUYỂN TRANG ---
  const navigateToTeamDetail = (groupName: string) => {
    // Giả lập map tên nhóm sang ID (Thực tế data sẽ có ID sẵn)
    // Ví dụ: "Team 1" -> "t1"
    const teamId = groupName.toLowerCase().replace(/\s+/g, "-");
    router.push(`/lecturer/teams/${teamId}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 pb-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Quản lý Lớp & Nhóm
          </h1>
          <p className="text-gray-500 mt-2 flex items-center gap-2">
            <span className="font-semibold text-[#F27124]">SE1783</span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span>Danh sách sinh viên & Cấu trúc nhóm</span>
          </p>
        </div>
        <div className="flex gap-3">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileUpload}
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="bg-white hover:bg-gray-50"
          >
            <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" /> Import
            Excel
          </Button>
          <Button className="bg-[#F27124] hover:bg-[#d65d1b] shadow-lg shadow-orange-500/20 text-white">
            <UserPlus className="mr-2 h-4 w-4" /> Thêm SV
          </Button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm theo tên hoặc MSSV..."
            className="pl-10 bg-gray-50 border-transparent focus:bg-white focus:border-[#F27124] focus:ring-2 focus:ring-orange-100 rounded-xl transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* ACCORDION LIST */}
      <div className="space-y-4">
        {groupKeys.map((group) => (
          <Accordion
            type="single"
            collapsible
            key={group}
            className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
          >
            <AccordionItem value={group} className="border-0">
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50/30 hover:bg-gray-50 transition-colors">
                <AccordionTrigger className="hover:no-underline py-0 flex-1">
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2.5 rounded-full ${
                        group === "Chưa có nhóm"
                          ? "bg-gray-200 text-gray-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      <Users className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-900 text-base">
                        {group}
                      </p>
                      <p className="text-xs text-muted-foreground font-medium mt-0.5">
                        {grouped[group].length} thành viên
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>

                {/* NÚT CHUYỂN TRANG */}
                {group !== "Chưa có nhóm" && (
                  <Button
                    size="sm"
                    className="ml-4 bg-white border border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700 shadow-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateToTeamDetail(group);
                    }}
                  >
                    <LayoutGrid className="mr-2 h-3.5 w-3.5" /> Chi tiết{" "}
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                )}
              </div>

              <AccordionContent className="px-0 pb-0">
                <Table>
                  <TableHeader className="bg-gray-50 border-y border-gray-100">
                    <TableRow>
                      <TableHead className="pl-6 w-[150px]">MSSV</TableHead>
                      <TableHead>Họ và tên</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="text-right pr-6">
                        Thao tác
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {grouped[group].map((s) => (
                      <TableRow
                        key={s.id}
                        className="hover:bg-orange-50/10 transition-colors"
                      >
                        <TableCell className="font-medium pl-6">
                          {s.code}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-orange-400 to-pink-500 text-white flex items-center justify-center text-xs font-bold">
                              {s.name.charAt(0)}
                            </div>
                            {s.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-500">
                          {s.email}
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-gray-600"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </div>
  );
}
