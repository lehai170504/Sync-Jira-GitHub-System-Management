"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Users,
  User,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

interface AssignmentInfoProps {
  isGroup: boolean;
  dueDate: string;
  assignDate: string;
}

export function AssignmentInfo({
  isGroup,
  dueDate,
  assignDate,
}: AssignmentInfoProps) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <Card className="border border-gray-100 shadow-sm rounded-xl">
        <CardHeader className="pb-3 border-b border-gray-50">
          <CardTitle className="text-sm font-bold text-gray-800 uppercase tracking-wide">
            Thông tin bài tập
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-5">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gray-100 rounded-lg shrink-0">
              <Calendar className="h-4 w-4 text-gray-600" />
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-0.5">Ngày giao</p>
              <p className="font-semibold text-sm text-gray-900">
                {assignDate}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-orange-50 rounded-lg shrink-0">
              <Clock className="h-4 w-4 text-[#F27124]" />
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-0.5">
                Hạn chót (Deadline)
              </p>
              <p className="font-semibold text-sm text-[#F27124]">{dueDate}</p>
              <p className="text-[10px] text-orange-600/80 mt-0.5">
                Còn 3 ngày nữa
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div
              className={`p-2 rounded-lg shrink-0 ${
                isGroup ? "bg-purple-50" : "bg-blue-50"
              }`}
            >
              {isGroup ? (
                <Users className="h-4 w-4 text-purple-600" />
              ) : (
                <User className="h-4 w-4 text-blue-600" />
              )}
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-0.5">Hình thức nộp</p>
              <p className="font-semibold text-sm text-gray-900">
                {isGroup ? "Đại diện Nhóm" : "Từng cá nhân"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm ring-1 ring-gray-100 bg-[#FFF8F3]">
        <CardContent className="p-4">
          <h4 className="font-bold text-[#F27124] text-sm mb-2 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" /> Lưu ý chấm điểm
          </h4>
          <p className="text-xs text-gray-600 mb-3 leading-relaxed">
            {isGroup
              ? "Điểm nhập tại đây là điểm cơ sở (Base Score) cho cả nhóm. Bạn có thể điều chỉnh điểm thành phần (Contribution) trong trang chi tiết nhóm."
              : "Vui lòng tải file đính kèm về kiểm tra trước khi nhập điểm. Điểm số sẽ được tự động đồng bộ sang Sổ điểm."}
          </p>
          {isGroup && (
            <Button
              variant="outline"
              size="sm"
              className="w-full bg-white border-[#F27124]/30 text-[#F27124] hover:bg-[#F27124] hover:text-white text-xs h-8"
              onClick={() =>
                router.push("/lecturer/class-management?tab=team_view")
              }
            >
              <ExternalLink className="h-3 w-3 mr-2" /> Xem chi tiết Nhóm
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
