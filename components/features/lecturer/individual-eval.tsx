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
import { AlertCircle, ArrowUpRight } from "lucide-react";

const MEMBERS = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    role: "Leader",
    jiraTasks: 12,
    jiraPoints: 34,
    commits: 45,
    loc: "+1200/-300",
    score: 9.2,
    status: "High",
  },
  {
    id: 2,
    name: "Trần Thị B",
    role: "Frontend",
    jiraTasks: 8,
    jiraPoints: 20,
    commits: 28,
    loc: "+800/-100",
    score: 8.0,
    status: "Medium",
  },
  {
    id: 3,
    name: "Lê Văn C",
    role: "Backend",
    jiraTasks: 10,
    jiraPoints: 28,
    commits: 5,
    loc: "+50/-20",
    score: 4.5,
    status: "Low",
  }, // Trường hợp nghi vấn
];

export function IndividualEval() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bảng Đánh giá Đóng góp Thành viên</CardTitle>
        <CardDescription>
          Dữ liệu tổng hợp từ Jira (Task) và GitHub (Code)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Thành viên</TableHead>
              <TableHead className="text-center">Jira (Tasks/Points)</TableHead>
              <TableHead className="text-center">GitHub (Commits)</TableHead>
              <TableHead>Code Impact (LOC)</TableHead>
              <TableHead>Chỉ số Nỗ lực</TableHead>
              <TableHead className="text-right">Đánh giá AI</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MEMBERS.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{m.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p>{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.role}</p>
                    </div>
                  </div>
                </TableCell>

                {/* Jira Stats */}
                <TableCell className="text-center">
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-blue-600">
                      {m.jiraTasks} tasks
                    </span>
                    <span className="text-xs text-gray-500">
                      {m.jiraPoints} pts
                    </span>
                  </div>
                </TableCell>

                {/* GitHub Stats */}
                <TableCell className="text-center">
                  <div className="font-bold">{m.commits}</div>
                </TableCell>

                {/* LOC Stats */}
                <TableCell>
                  <span className="text-green-600 text-xs">
                    {m.loc.split("/")[0]}
                  </span>
                  <span className="text-gray-400 mx-1">/</span>
                  <span className="text-red-500 text-xs">
                    {m.loc.split("/")[1]}
                  </span>
                </TableCell>

                {/* Effort Score Progress */}
                <TableCell className="w-[200px]">
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

                {/* AI Insight / Status */}
                <TableCell className="text-right">
                  {m.score < 5 ? (
                    <Badge variant="destructive" className="gap-1">
                      <AlertCircle className="h-3 w-3" /> Low Impact
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      Good Job
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Footnote */}
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md flex gap-2 text-sm text-yellow-800">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <p>
            <strong>Cảnh báo:</strong> Sinh viên <strong>Lê Văn C</strong> có
            lượng Tasks trên Jira cao nhưng Commit trên GitHub rất thấp. Cần
            kiểm tra lại log work.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
