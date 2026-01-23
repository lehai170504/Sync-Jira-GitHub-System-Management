"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  GitCommit,
  GitPullRequest,
  CheckCircle2,
  AlertCircle,
  Search,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const MEMBER_STATS = [
  { name: "NV A", commits: 25 },
  { name: "TT B", commits: 18 },
  { name: "LV C", commits: 30 },
  { name: "PM D", commits: 5 },
];

const COMMIT_HISTORY = [
  {
    hash: "a1b2c3d",
    msg: "feat: khởi tạo cấu trúc dự án",
    author: "Nguyen Van A",
    date: "10/01/2026",
    additions: 150,
    deletions: 0,
  },
  {
    hash: "x9y8z7w",
    msg: "fix: logic xác thực đăng nhập",
    author: "Le Van C",
    date: "12/01/2026",
    additions: 45,
    deletions: 12,
  },
  {
    hash: "m5n6o7p",
    msg: "style: cập nhật header trang chủ",
    author: "Tran Thi B",
    date: "13/01/2026",
    additions: 80,
    deletions: 20,
  },
];

export function GithubStats() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contributions Chart */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <GitCommit className="h-4 w-4 text-[#F27124]" /> Đóng góp
              (Commits)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={MEMBER_STATS}
                layout="vertical"
                margin={{ left: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={true}
                  vertical={false}
                  stroke="#e5e7eb"
                />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={40}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "#f9fafb" }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar
                  dataKey="commits"
                  fill="#1f2937"
                  radius={[0, 4, 4, 0]}
                  barSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* PR Stats */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <GitPullRequest className="h-4 w-4 text-purple-600" /> Pull
              Requests
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-100 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-full text-green-600 shadow-sm">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    PR Đã Gộp (Merged)
                  </p>
                  <p className="text-xs text-gray-500">30 ngày qua</p>
                </div>
              </div>
              <span className="text-3xl font-bold text-green-700">12</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-100 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-full text-orange-600 shadow-sm">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">PR Đang Mở</p>
                  <p className="text-xs text-gray-500">Cần review</p>
                </div>
              </div>
              <span className="text-3xl font-bold text-orange-700">3</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Commit Table */}
      <Card className="border-gray-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Lịch sử Commit</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
              <Input
                placeholder="Tìm kiếm commit..."
                className="pl-8 h-9 bg-white border-gray-200"
              />
            </div>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 font-medium">Nội dung</th>
                <th className="px-6 py-3 font-medium">Tác giả</th>
                <th className="px-6 py-3 font-medium">Thay đổi</th>
                <th className="px-6 py-3 font-medium text-right">Ngày</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {COMMIT_HISTORY.map((commit, i) => (
                <tr
                  key={i}
                  className="bg-white hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <GitCommit className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {commit.msg}
                        </p>
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                          {commit.hash}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6 border border-gray-100">
                        <AvatarFallback className="bg-gray-100 text-gray-600 text-[10px]">
                          {commit.author.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-gray-700">{commit.author}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-green-600 font-medium">
                      +{commit.additions}
                    </span>
                    <span className="text-gray-300 mx-2">/</span>
                    <span className="text-red-500 font-medium">
                      -{commit.deletions}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-gray-500">
                    {commit.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
