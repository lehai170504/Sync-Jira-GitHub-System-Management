import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface TeamHeaderProps {
  teamName: string;
}

export function TeamHeader({ teamName }: TeamHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-gray-100 pb-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          {teamName}
        </h2>
        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 px-2 py-0.5 rounded-md"
          >
            Sprint 3
          </Badge>
          <span>•</span>
          <span className="font-medium text-gray-700">
            Đề tài: Hệ thống Thương mại điện tử tích hợp AI
          </span>
        </div>
        <div className="flex items-center gap-4 mt-4">
          <div className="flex -space-x-2">
            {["A", "B", "C", "D"].map((avt, i) => (
              <Avatar
                key={i}
                className="border-2 border-white w-8 h-8 ring-1 ring-gray-100"
              >
                <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-500 text-white text-xs font-bold">
                  {avt}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          <span className="text-xs text-gray-500 font-medium">
            4 thành viên hoạt động
          </span>
        </div>
      </div>

      <div className="flex gap-4">
        <Card className="shadow-sm border border-gray-100 bg-white w-36">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">
              Velocity (Điểm)
            </p>
            <div className="flex items-end justify-center gap-1">
              <span className="text-2xl font-bold text-gray-900">24</span>
              <span className="text-xs text-green-600 font-medium mb-1">
                pts
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border border-gray-100 bg-white w-36">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">
              Tổng Commits
            </p>
            <div className="flex items-end justify-center gap-1">
              <span className="text-2xl font-bold text-[#F27124]">78</span>
              <span className="text-xs text-gray-400 font-medium mb-1">
                lượt
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
