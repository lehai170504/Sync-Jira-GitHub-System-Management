"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Users,
  UserPlus,
  FileSpreadsheet,
  MoreHorizontal,
  ArrowRight,
  LayoutGrid,
  Mail,
  User,
  Hash,
  Layers,
  UploadCloud,
  Download,
  Crown, // Thêm icon Crown cho Leader
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { Badge } from "@/components/ui/badge";

// MOCK DATA (Thêm trường isLeader)
const INITIAL_STUDENTS = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    code: "SE1701",
    email: "an@fpt.edu.vn",
    group: "Team 1",
    isLeader: true,
  },
  {
    id: "2",
    name: "Trần Thị B",
    code: "SE1702",
    email: "binh@fpt.edu.vn",
    group: "Team 1",
    isLeader: false,
  },
  {
    id: "3",
    name: "Lê Văn C",
    code: "SE1703",
    email: "cuong@fpt.edu.vn",
    group: "Team 2",
    isLeader: true,
  },
];

export default function ClassManagementPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    code: "",
    email: "",
    group: "null",
  });

  // --- 1. TẠO FILE MẪU MỚI (CÓ GROUP & LEADER) ---
  const handleDownloadTemplate = () => {
    const templateData = [
      {
        Class: "SE1943",
        RollNumber: "CE190585",
        Email: "minhlq.ce190585@gmail.com",
        MemberCode: "MinhLQCE190585",
        FullName: "Lâm Quốc Minh",
        Group: 1, // Cột Nhóm
        Leader: "x", // Cột Leader (x = là leader)
      },
      {
        Class: "SE1943",
        RollNumber: "DE191059",
        Email: "trankhanhduong@gmail.com",
        MemberCode: "DuongTKDE191059",
        FullName: "Trần Khánh Dương",
        Group: 1,
        Leader: "",
      },
      {
        Class: "SE1943",
        RollNumber: "SE140413",
        Email: "TruongPNSE140413@fpt.edu.vn",
        MemberCode: "truongpnse140413",
        FullName: "Phan Nhật Trường",
        Group: 2,
        Leader: "x",
      },
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);

    // Chỉnh độ rộng cột
    ws["!cols"] = [
      { wch: 10 }, // Class
      { wch: 15 }, // RollNumber
      { wch: 35 }, // Email
      { wch: 20 }, // MemberCode
      { wch: 25 }, // FullName
      { wch: 8 }, // Group
      { wch: 8 }, // Leader
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Danh_Sach_SV");
    XLSX.writeFile(wb, "Template_Import_SinhVien.xlsx");
    toast.success("Đã tải xuống file mẫu có cột Group & Leader!");
  };

  // --- 2. XỬ LÝ IMPORT (ĐỌC THÊM CỘT MỚI) ---
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      if (jsonData.length === 0) {
        toast.error("File Excel trống!");
        return;
      }

      const importedStudents = jsonData.map((row: any, index) => {
        // Xử lý Group: Nếu có số thì thêm chữ "Team " cho đẹp, hoặc giữ nguyên
        let groupName = null;
        if (row["Group"] || row["Group "]) {
          const gVal = row["Group"] || row["Group "];
          groupName = typeof gVal === "number" ? `Team ${gVal}` : gVal;
        }

        // Xử lý Leader: Check 'x' hoặc 'X'
        const isLeader =
          row["Leader"] && row["Leader"].toString().toLowerCase() === "x";

        return {
          id: `imported-${Date.now()}-${index}`,
          name: row["FullName"] || row["Họ tên"] || "Unknown",
          code:
            row["RollNumber"] || row["MSSV"] || row["MemberCode"] || "UNKNOWN",
          email: row["Email"] || "",
          group: groupName,
          isLeader: isLeader,
        };
      });

      setStudents((prev) => [...prev, ...importedStudents]);
      toast.success(
        `Đã import ${importedStudents.length} SV và phân nhóm tự động!`
      );

      if (fileInputRef.current) fileInputRef.current.value = "";
    };

    reader.readAsArrayBuffer(file);
  };

  // --- 3. XỬ LÝ THÊM THỦ CÔNG ---
  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.code || !newStudent.email) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }
    const studentToAdd = {
      id: Math.random().toString(36).substr(2, 9),
      ...newStudent,
      group: newStudent.group === "null" ? null : newStudent.group,
      isLeader: false, // Mặc định thủ công không set leader ngay
    };
    setStudents([...students, studentToAdd]);
    setIsAddOpen(false);
    setNewStudent({ name: "", code: "", email: "", group: "null" });
    toast.success(`Đã thêm sinh viên ${studentToAdd.name}`);
  };

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

  const navigateToTeamDetail = (groupName: string) => {
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
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
          />

          <Button
            variant="ghost"
            onClick={handleDownloadTemplate}
            className="text-gray-600 hover:text-[#F27124] hover:bg-orange-50 border border-dashed border-gray-300"
          >
            <Download className="mr-2 h-4 w-4" /> File Mẫu Mới
          </Button>

          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="bg-white hover:bg-gray-50 border-gray-200 text-gray-700 shadow-sm"
          >
            <UploadCloud className="mr-2 h-4 w-4 text-green-600" /> Import Excel
          </Button>

          {/* Dialog Thêm SV (Code cũ giữ nguyên phần này) */}
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#F27124] hover:bg-[#d65d1b] shadow-lg shadow-orange-500/20 text-white">
                <UserPlus className="mr-2 h-4 w-4" /> Thêm SV
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              {/* ... (Nội dung form thêm SV giữ nguyên) ... */}
              <DialogHeader>
                <DialogTitle>Thêm Sinh viên mới</DialogTitle>
                <DialogDescription>
                  Nhập thông tin sinh viên thủ công.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {/* Form inputs... */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="code" className="text-right">
                      MSSV *
                    </Label>
                    <Input
                      id="code"
                      value={newStudent.code}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, code: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-right">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      value={newStudent.email}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, email: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-right">
                    Họ tên *
                  </Label>
                  <Input
                    id="name"
                    value={newStudent.name}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="group" className="text-right">
                    Nhóm
                  </Label>
                  <Select
                    value={newStudent.group}
                    onValueChange={(val) =>
                      setNewStudent({ ...newStudent, group: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn nhóm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="null">Chưa có nhóm</SelectItem>
                      <SelectItem value="Team 1">Team 1</SelectItem>
                      <SelectItem value="Team 2">Team 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                  Hủy
                </Button>
                <Button
                  className="bg-[#F27124] hover:bg-[#d65d1b]"
                  onClick={handleAddStudent}
                >
                  Lưu
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* SEARCH BAR & CONTENT */}
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
                      <p className="font-bold text-gray-900 text-base flex items-center gap-2">
                        {group}
                        {/* Hiển thị số lượng leader nếu cần */}
                        {group !== "Chưa có nhóm" && (
                          <Badge
                            variant="secondary"
                            className="text-[10px] font-normal h-5 px-1.5 bg-yellow-50 text-yellow-700 border-yellow-200"
                          >
                            Leader:{" "}
                            {grouped[group].find((s) => s.isLeader)?.name ||
                              "Chưa có"}
                          </Badge>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground font-medium mt-0.5">
                        {grouped[group].length} thành viên
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
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
                      <TableHead className="text-center w-[100px]">
                        Vai trò
                      </TableHead>
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
                            <span
                              className={
                                s.isLeader ? "font-bold text-gray-900" : ""
                              }
                            >
                              {s.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-500">
                          {s.email}
                        </TableCell>

                        {/* CỘT VAI TRÒ */}
                        <TableCell className="text-center">
                          {s.isLeader ? (
                            <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200 shadow-none gap-1">
                              <Crown className="w-3 h-3 fill-yellow-500 text-yellow-600" />{" "}
                              Leader
                            </Badge>
                          ) : (
                            <span className="text-xs text-gray-400">
                              Member
                            </span>
                          )}
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
