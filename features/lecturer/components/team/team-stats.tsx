import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GitCommit } from "lucide-react";

// Mock Data (Có thể truyền từ props)
const MEMBER_STATS = [
  { name: "NV A", commits: 25, tasks: 12, role: "Nhóm trưởng" },
  { name: "TT B", commits: 18, tasks: 10, role: "Frontend" },
  { name: "LV C", commits: 30, tasks: 15, role: "Backend" },
  { name: "PM D", commits: 5, tasks: 4, role: "Tester" },
];

const COMMIT_HISTORY = [
  {
    hash: "a1b2c3d",
    msg: "feat: khởi tạo cấu trúc dự án",
    author: "Nguyen Van A",
    date: "10/01/2026",
  },
  {
    hash: "x9y8z7w",
    msg: "fix: logic xác thực đăng nhập",
    author: "Le Van C",
    date: "12/01/2026",
  },
  {
    hash: "m5n6o7p",
    msg: "style: cập nhật header trang chủ",
    author: "Tran Thi B",
    date: "13/01/2026",
  },
  {
    hash: "q1w2e3r",
    msg: "docs: cập nhật readme",
    author: "Pham Minh D",
    date: "14/01/2026",
  },
];

export function TeamStats() {
  return (
    <div className="space-y-6">
      {/* Member Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {MEMBER_STATS.map((mem, idx) => (
          <Card
            key={idx}
            className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <CardContent className="p-4 flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-gray-100">
                <AvatarFallback className="bg-blue-50 text-blue-600 font-bold text-xs">
                  {mem.name.split(" ")[1]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-bold text-gray-900">{mem.name}</p>
                <p className="text-xs text-gray-500">{mem.role}</p>
              </div>
              <div className="ml-auto text-right">
                <div className="text-xs font-medium text-gray-900">
                  {mem.tasks} Tasks
                </div>
                <div className="text-[10px] text-gray-400">
                  {mem.commits} Commits
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Progress */}
        <Card className="lg:col-span-2 border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Tiến độ Dự án</CardTitle>
            <CardDescription>
              Tổng tiến độ dựa trên các task Jira
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">Tiến độ</span>
                <span className="font-bold text-gray-900">65%</span>
              </div>
              <Progress
                value={65}
                className="h-2 bg-gray-100"
                indicatorColor="bg-green-500"
              />
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">Cần làm</div>
                  <div className="text-xl font-bold text-gray-700">2</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-xs text-blue-600 mb-1">Đang làm</div>
                  <div className="text-xl font-bold text-blue-700">2</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-xs text-green-600 mb-1">Hoàn thành</div>
                  <div className="text-xl font-bold text-green-700">2</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Hoạt động gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px] pr-4">
              <div className="space-y-4">
                {COMMIT_HISTORY.map((commit, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="mt-1 p-1.5 bg-gray-100 rounded-full">
                      <GitCommit className="h-3 w-3 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-900 line-clamp-1">
                        {commit.msg}
                      </p>
                      <p className="text-[10px] text-gray-500">
                        {commit.author} • {commit.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
