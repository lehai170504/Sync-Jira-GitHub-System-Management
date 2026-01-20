"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

export function OperationalSettings() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    // Giả lập call API
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    toast.success("Cấu hình vận hành đã được cập nhật!");
  };

  return (
    <Card className="md:col-span-2 border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5 text-[#F27124]" /> Tham số Vận hành
        </CardTitle>
        <CardDescription>
          Cấu hình các quy tắc nghiệp vụ cốt lõi cho đồ án tốt nghiệp.
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-6 md:grid-cols-2">
        {/* SPRINT DURATION */}
        <div className="space-y-2">
          <Label htmlFor="sprint">Thời gian Sprint (Tuần)</Label>
          <Input
            id="sprint"
            type="number"
            defaultValue={2}
            className="focus-visible:ring-[#F27124]/20 focus-visible:border-[#F27124]"
          />
          <p className="text-[11px] text-muted-foreground">
            Chu kỳ lặp lại mặc định để tính điểm progress.
          </p>
        </div>

        {/* DEADLINE TIME */}
        <div className="space-y-2">
          <Label htmlFor="deadline">Giờ nộp bài (Cut-off Time)</Label>
          <Input
            id="deadline"
            type="time"
            defaultValue="23:59"
            className="focus-visible:ring-[#F27124]/20 focus-visible:border-[#F27124]"
          />
          <p className="text-[11px] text-muted-foreground">
            Hệ thống sẽ khóa chức năng submit sau khung giờ này.
          </p>
        </div>

        {/* GITHUB WEIGHT */}
        <div className="space-y-2">
          <Label>Trọng số điểm Code (GitHub)</Label>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              defaultValue={40}
              className="focus-visible:ring-[#F27124]/20 focus-visible:border-[#F27124]"
            />
            <span className="text-sm font-medium text-muted-foreground w-8">
              %
            </span>
          </div>
        </div>

        {/* JIRA WEIGHT */}
        <div className="space-y-2">
          <Label>Trọng số điểm Task (Jira)</Label>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              defaultValue={40}
              className="focus-visible:ring-[#F27124]/20 focus-visible:border-[#F27124]"
            />
            <span className="text-sm font-medium text-muted-foreground w-8">
              %
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-slate-50/50 border-t border-slate-100 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <span className="text-xs text-muted-foreground order-2 sm:order-1">
          Lần cập nhật cuối: 15/01/2026 bởi{" "}
          <span className="font-medium text-gray-700">Admin</span>
        </span>

        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="bg-[#F27124] hover:bg-[#d65d1b] text-white shadow-md shadow-orange-500/20 rounded-xl px-6 min-w-[140px] order-1 sm:order-2 w-full sm:w-auto transition-all"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang lưu...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" /> Lưu cấu hình
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
