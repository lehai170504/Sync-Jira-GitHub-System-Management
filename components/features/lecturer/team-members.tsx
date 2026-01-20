"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

const MEMBERS = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    role: "Leader",
    tasks: 12,
    commits: 45,
    loc: "+1200/-300",
    score: 9.2,
    status: "High",
  },
  {
    id: 2,
    name: "Trần Thị B",
    role: "Frontend",
    tasks: 8,
    commits: 28,
    loc: "+800/-100",
    score: 8.0,
    status: "Medium",
  },
  {
    id: 3,
    name: "Lê Văn C",
    role: "Backend",
    tasks: 10,
    commits: 3,
    loc: "+50/-20",
    score: 4.5,
    status: "Low",
  },
  {
    id: 4,
    name: "Phạm Minh D",
    role: "Tester",
    tasks: 15,
    commits: 0,
    loc: "0/0",
    score: 7.5,
    status: "Medium",
  },
];

export function TeamMembers() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Đánh giá Đóng góp Thành viên</CardTitle>
          <CardDescription>
            Tổng hợp dữ liệu từ Jira (Tasks) và GitHub (Code)
          </CardDescription>
        </div>
        <Button variant="outline" size="sm">
          Xuất Excel
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Thành viên</TableHead>
              <TableHead className="text-center">Jira (Tasks)</TableHead>
              <TableHead className="text-center">GitHub (Commits)</TableHead>
              <TableHead className="hidden md:table-cell">
                Lines of Code
              </TableHead>
              <TableHead>Hiệu suất</TableHead>
              <TableHead className="text-right">Đánh giá AI</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MEMBERS.map((m) => (
              <TableRow key={m.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{m.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.role}</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="text-center font-bold text-blue-600">
                  {m.tasks}
                </TableCell>
                <TableCell className="text-center font-bold">
                  {m.commits}
                </TableCell>
                <TableCell className="hidden md:table-cell text-xs font-mono">
                  <span className="text-green-600">{m.loc.split("/")[0]}</span>{" "}
                  / <span className="text-red-500">{m.loc.split("/")[1]}</span>
                </TableCell>

                <TableCell className="w-[180px]">
                  <div className="flex items-center gap-2">
                    <Progress
                      value={m.score * 10}
                      className="h-2"
                      indicatorColor={
                        m.score < 5 ? "bg-red-500" : "bg-[#F27124]"
                      }
                    />
                    <span className="text-sm font-bold">{m.score}</span>
                  </div>
                </TableCell>

                <TableCell className="text-right">
                  {m.score < 5 ? (
                    <Badge variant="destructive" className="whitespace-nowrap">
                      Low Impact
                    </Badge>
                  ) : m.score > 8 ? (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 shadow-none whitespace-nowrap">
                      Excellent
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="whitespace-nowrap">
                      Good
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4 text-gray-400" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Cảnh báo thông minh */}
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md flex gap-3 text-sm text-yellow-800">
          <AlertCircle className="h-5 w-5 shrink-0 text-yellow-600" />
          <div>
            <p className="font-semibold">Phát hiện bất thường:</p>
            <p>
              Sinh viên <strong>Lê Văn C</strong> có lượng Tasks cao nhưng
              Commit rất thấp. Cần kiểm tra lại log work.
            </p>
            <p>
              Sinh viên <strong>Phạm Minh D</strong> (Tester) không có commit
              code, cần đánh giá dựa trên Test Case Jira.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
