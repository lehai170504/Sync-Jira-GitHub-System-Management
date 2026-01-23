"use client";

import { useRouter } from "next/navigation";
import {
  Users,
  LayoutGrid,
  ArrowRight,
  MoreHorizontal,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

interface StudentListProps {
  students: any[];
  filterTerm: string;
}

export function StudentList({ students, filterTerm }: StudentListProps) {
  const router = useRouter();

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(filterTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(filterTerm.toLowerCase())
  );

  const grouped = filtered.reduce((acc, student) => {
    const key = student.group || "Chưa có nhóm";
    if (!acc[key]) acc[key] = [];
    acc[key].push(student);
    return acc;
  }, {} as Record<string, any[]>);

  const groupKeys = Object.keys(grouped).sort();

  const navigateToTeamDetail = (groupName: string) => {
    const teamId = groupName.toLowerCase().replace(/\s+/g, "-");
    router.push(`/lecturer/teams/${teamId}`);
  };

  return (
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
                    <TableHead className="text-right pr-6">Thao tác</TableHead>
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
                      <TableCell className="text-gray-500">{s.email}</TableCell>
                      <TableCell className="text-center">
                        {s.isLeader ? (
                          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200 shadow-none gap-1">
                            <Crown className="w-3 h-3 fill-yellow-500 text-yellow-600" />{" "}
                            Leader
                          </Badge>
                        ) : (
                          <span className="text-xs text-gray-400">Member</span>
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
  );
}
