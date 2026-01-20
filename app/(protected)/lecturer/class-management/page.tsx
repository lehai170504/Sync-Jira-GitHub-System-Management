"use client";

import { useState } from "react";
import {
  Search,
  Users,
  MoreHorizontal,
  UserPlus,
  Download,
  Upload,
  LayoutGrid,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TeamDetailView } from "@/components/features/lecturer/team-detail-view";

// MOCK DATA
const STUDENTS = [
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

const TEAMS = [
  { id: "t1", name: "Team 1: E-Commerce", status: "On Track" },
  { id: "t2", name: "Team 2: LMS System", status: "Risk" },
  { id: "t3", name: "Team 3: Grab Clone", status: "Behind" },
];

export default function ClassManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState(TEAMS[0].id); // Mặc định chọn Team 1

  // Logic Grouping cho Tab Danh sách
  const filtered = STUDENTS.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const grouped = filtered.reduce((acc, student) => {
    const key = student.group || "Chưa có nhóm";
    if (!acc[key]) acc[key] = [];
    acc[key].push(student);
    return acc;
  }, {} as Record<string, typeof STUDENTS>);
  const groupKeys = Object.keys(grouped).sort();

  // Tìm tên team đang chọn
  const selectedTeamName =
    TEAMS.find((t) => t.id === selectedTeamId)?.name || "Unknown Team";

  return (
    <div className="space-y-6 animate-in fade-in-50">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Quản lý Lớp & Nhóm
          </h1>
          <p className="text-muted-foreground text-sm">SE1783 • Spring 2026</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" /> Import Excel
          </Button>
          <Button className="bg-[#F27124] hover:bg-[#d65d1b] h-9">
            <UserPlus className="mr-2 h-4 w-4" /> Thêm SV
          </Button>
        </div>
      </div>

      <Tabs defaultValue="list_view" className="space-y-6">
        <TabsList className="bg-white border">
          <TabsTrigger value="list_view" className="gap-2">
            <List className="h-4 w-4" /> Danh sách tổng quát
          </TabsTrigger>
          <TabsTrigger value="team_view" className="gap-2">
            <LayoutGrid className="h-4 w-4" /> Chi tiết từng Nhóm
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: DANH SÁCH TỔNG QUÁT (ACCORDION VIEW) */}
        <TabsContent value="list_view">
          <div className="space-y-4">
            <div className="relative max-w-md">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Tìm sinh viên..."
                className="pl-8 bg-white"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Accordion
              type="multiple"
              defaultValue={groupKeys}
              className="space-y-4"
            >
              {groupKeys.map((group) => (
                <AccordionItem
                  key={group}
                  value={group}
                  className="border rounded-lg bg-white px-4 shadow-sm"
                >
                  <AccordionTrigger className="hover:no-underline py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          group === "Chưa có nhóm"
                            ? "bg-gray-100 text-gray-500"
                            : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        <Users className="h-4 w-4" />
                      </div>
                      <span className="font-bold text-gray-900 text-sm">
                        {group}
                      </span>
                      <Badge
                        variant="secondary"
                        className="ml-2 font-normal text-xs"
                      >
                        {grouped[group].length} SV
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead>MSSV</TableHead>
                          <TableHead>Họ tên</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {grouped[group].map((s) => (
                          <TableRow key={s.id}>
                            <TableCell className="font-medium text-xs">
                              {s.code}
                            </TableCell>
                            <TableCell className="text-sm">{s.name}</TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {s.email}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
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
              ))}
            </Accordion>
          </div>
        </TabsContent>

        {/* TAB 2: CHI TIẾT NHÓM (MASTER-DETAIL VIEW) */}
        <TabsContent value="team_view">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[800px]">
            {/* SIDEBAR TRÁI: DANH SÁCH NHÓM */}
            <Card className="lg:col-span-1 h-full overflow-hidden flex flex-col">
              <CardHeader className="pb-3 border-b bg-gray-50/50">
                <CardTitle className="text-sm font-bold flex items-center justify-between">
                  Danh sách nhóm
                  <Badge variant="outline">{TEAMS.length}</Badge>
                </CardTitle>
              </CardHeader>
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {TEAMS.map((team) => (
                  <div
                    key={team.id}
                    onClick={() => setSelectedTeamId(team.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-all border ${
                      selectedTeamId === team.id
                        ? "bg-blue-50 border-blue-200 shadow-sm"
                        : "bg-white border-transparent hover:bg-gray-50 hover:border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span
                        className={`font-semibold text-sm ${
                          selectedTeamId === team.id
                            ? "text-blue-700"
                            : "text-gray-700"
                        }`}
                      >
                        {team.name}
                      </span>
                      {team.status === "Risk" && (
                        <div
                          className="w-2 h-2 rounded-full bg-red-500"
                          title="Risk"
                        />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      Hệ thống bán thiết bị IoT...
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* CONTENT PHẢI: CHI TIẾT NHÓM */}
            <Card className="lg:col-span-3 h-full overflow-hidden flex flex-col border-0 shadow-none bg-transparent">
              <div className="h-full overflow-y-auto pr-2">
                {/* Gọi Component TeamDetailView và truyền ID vào */}
                <TeamDetailView
                  teamId={selectedTeamId}
                  teamName={selectedTeamName}
                />
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
