"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Search,
  Users,
  MoreVertical,
  Calendar,
  Filter,
  XCircle,
  Check,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ClassDetailDrawer } from "@/components/features/classes/class-detail-drawer";

// Mock Data Classes
const classesData = [
  {
    id: "C01",
    code: "SE1740",
    subject: "SWP391",
    lecturer: "gv_hien@fpt.edu.vn",
    students: 28,
    status: "Active",
    semester: "SP24",
  },
  {
    id: "C02",
    code: "SE1741",
    subject: "SWP391",
    lecturer: "gv_binh@fpt.edu.vn",
    students: 30,
    status: "Active",
    semester: "SP24",
  },
  {
    id: "C03",
    code: "AI1801",
    subject: "PRN231",
    lecturer: "gv_tuan@fpt.edu.vn",
    students: 25,
    status: "Finished",
    semester: "FA23",
  },
  {
    id: "C04",
    code: "SE1742",
    subject: "SWR302",
    lecturer: "gv_hoa@fpt.edu.vn",
    students: 32,
    status: "Active",
    semester: "SP24",
  },
  {
    id: "C05",
    code: "GD1201",
    subject: "GRA201",
    lecturer: "gv_minh@fpt.edu.vn",
    students: 18,
    status: "Upcoming",
    semester: "SU24",
  },
];

// Mock Students
const mockStudents = [
  {
    id: 1,
    name: "Nguyễn Văn An",
    roll: "SE123456",
    email: "annv@fpt.edu.vn",
    team: "Team 1",
  },
  {
    id: 2,
    name: "Trần Thị Bình",
    roll: "SE123457",
    email: "binhtt@fpt.edu.vn",
    team: "Team 1",
  },
  {
    id: 3,
    name: "Lê Hoàng Cường",
    roll: "SE123458",
    email: "cuonglh@fpt.edu.vn",
    team: "Team 2",
  },
  {
    id: 4,
    name: "Phạm Minh Dung",
    roll: "SE123459",
    email: "dungpm@fpt.edu.vn",
    team: "Team 2",
  },
  {
    id: 5,
    name: "Vũ Đức Em",
    roll: "SE123460",
    email: "emvd@fpt.edu.vn",
    team: "Team 3",
  },
];

export default function ClassManagementPage() {
  const [selectedClass, setSelectedClass] = useState<any>(null);

  // --- FILTER STATES ---
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSemester, setFilterSemester] = useState("all");

  // Get unique values for dropdowns
  const uniqueSubjects = Array.from(new Set(classesData.map((c) => c.subject)));
  const uniqueSemesters = Array.from(
    new Set(classesData.map((c) => c.semester))
  );

  // --- FILTER LOGIC ---
  const filteredClasses = classesData.filter((cls) => {
    const matchesSearch =
      cls.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.lecturer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSubject =
      filterSubject === "all" || cls.subject === filterSubject;
    const matchesStatus = filterStatus === "all" || cls.status === filterStatus;
    const matchesSemester =
      filterSemester === "all" || cls.semester === filterSemester;

    return matchesSearch && matchesSubject && matchesStatus && matchesSemester;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setFilterSubject("all");
    setFilterStatus("all");
    setFilterSemester("all");
  };

  const activeFiltersCount = [
    filterSubject !== "all",
    filterStatus !== "all",
    filterSemester !== "all",
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Danh sách Lớp học
          </h2>
          <p className="text-muted-foreground mt-1">
            Quản lý các lớp học, theo dõi tiến độ và thành viên.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-focus-within:text-[#F27124] transition-colors" />
            <Input
              placeholder="Tìm mã lớp, giảng viên..."
              className="pl-10 bg-white border-gray-200 focus:border-[#F27124] focus:ring-[#F27124]/20 rounded-xl transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Advanced Filter Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`h-10 px-4 rounded-xl border-gray-200 hover:bg-gray-50 hover:text-gray-900 hidden sm:flex ${
                  activeFiltersCount > 0
                    ? "border-[#F27124] text-[#F27124] bg-orange-50"
                    : ""
                }`}
              >
                <Filter className="mr-2 h-4 w-4" />
                Bộ lọc
                {activeFiltersCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-2 bg-[#F27124] text-white hover:bg-[#d65d1b] h-5 px-1.5"
                  >
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-80 p-4 rounded-xl shadow-xl"
              align="end"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold leading-none">
                    Bộ lọc nâng cao
                  </h4>
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-xs text-red-500 hover:text-red-700"
                      onClick={clearFilters}
                    >
                      Xóa tất cả
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Môn học</Label>
                  <Select
                    value={filterSubject}
                    onValueChange={setFilterSubject}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn môn học" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả môn</SelectItem>
                      {uniqueSubjects.map((sub) => (
                        <SelectItem key={sub} value={sub}>
                          {sub}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Trạng thái</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="Active">Đang hoạt động</SelectItem>
                      <SelectItem value="Finished">Đã kết thúc</SelectItem>
                      <SelectItem value="Upcoming">Sắp tới</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Học kỳ</Label>
                  <Select
                    value={filterSemester}
                    onValueChange={setFilterSemester}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn học kỳ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      {uniqueSemesters.map((sem) => (
                        <SelectItem key={sem} value={sem}>
                          {sem}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* FILTER TAGS (HIỂN THỊ KHI CÓ LỌC) */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground mr-2">
            Đang lọc theo:
          </span>
          {filterSubject !== "all" && (
            <Badge
              variant="secondary"
              className="gap-1 bg-white border border-gray-200"
            >
              Môn: {filterSubject}{" "}
              <XCircle
                className="h-3 w-3 cursor-pointer hover:text-red-500"
                onClick={() => setFilterSubject("all")}
              />
            </Badge>
          )}
          {filterStatus !== "all" && (
            <Badge
              variant="secondary"
              className="gap-1 bg-white border border-gray-200"
            >
              TT: {filterStatus}{" "}
              <XCircle
                className="h-3 w-3 cursor-pointer hover:text-red-500"
                onClick={() => setFilterStatus("all")}
              />
            </Badge>
          )}
          {filterSemester !== "all" && (
            <Badge
              variant="secondary"
              className="gap-1 bg-white border border-gray-200"
            >
              Kỳ: {filterSemester}{" "}
              <XCircle
                className="h-3 w-3 cursor-pointer hover:text-red-500"
                onClick={() => setFilterSemester("all")}
              />
            </Badge>
          )}
          <Button
            variant="link"
            size="sm"
            className="text-xs text-muted-foreground"
            onClick={clearFilters}
          >
            Xóa hết
          </Button>
        </div>
      )}

      {/* CLASS GRID */}
      {filteredClasses.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredClasses.map((cls) => (
            <Card
              key={cls.id}
              className="group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-gray-200 rounded-2xl overflow-hidden cursor-pointer bg-white"
              onClick={() => setSelectedClass(cls)}
            >
              <CardHeader className="p-5 pb-2">
                <div className="flex justify-between items-start">
                  <Badge
                    variant="outline"
                    className="bg-gray-50 text-gray-600 border-gray-200 font-mono text-xs px-2 py-0.5 rounded-md"
                  >
                    {cls.subject}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 -mr-2 text-gray-400 hover:text-gray-700 rounded-full"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl">
                      <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        Xóa lớp
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="mt-2">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#F27124] transition-colors">
                    {cls.code}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{cls.semester}</span>
                    <span className="text-gray-300">•</span>
                    <Badge
                      variant="secondary"
                      className={`text-[10px] px-1.5 h-5 ${
                        cls.status === "Active"
                          ? "bg-green-50 text-green-700"
                          : cls.status === "Finished"
                          ? "bg-gray-100 text-gray-600"
                          : "bg-orange-50 text-orange-700"
                      }`}
                    >
                      {cls.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-5 pt-2">
                <div className="flex items-center gap-3 mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <Avatar className="h-9 w-9 border border-white shadow-sm">
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-xs font-bold">
                      {cls.lecturer.charAt(3).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="overflow-hidden">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Giảng viên
                    </p>
                    <p className="text-sm font-semibold text-gray-700 truncate">
                      {cls.lecturer.split("@")[0]}
                    </p>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="px-5 py-4 border-t bg-gray-50/50 flex justify-between items-center text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  <span className="font-medium">{cls.students}</span> Sinh viên
                </div>
                <div className="text-xs text-[#F27124] font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  Xem chi tiết →
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
          <div className="bg-white p-4 rounded-full shadow-sm mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Không tìm thấy lớp học
          </h3>
          <p className="text-muted-foreground text-sm mt-1 max-w-sm">
            Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn.
          </p>
          <Button
            variant="link"
            className="mt-2 text-[#F27124]"
            onClick={clearFilters}
          >
            Xóa tất cả bộ lọc
          </Button>
        </div>
      )}

      <ClassDetailDrawer
        isOpen={!!selectedClass}
        onOpenChange={(open) => !open && setSelectedClass(null)}
        selectedClass={selectedClass}
        students={mockStudents}
      />
    </div>
  );
}
