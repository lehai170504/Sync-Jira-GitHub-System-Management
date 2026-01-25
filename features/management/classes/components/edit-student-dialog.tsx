// src/features/lecturer/components/class/edit-student-dialog.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Layers, Crown } from "lucide-react";
import { useUpdateStudents } from "@/features/management/classes/hooks/use-classes";
import {
  ClassStudent,
  UpdateStudentsPayload,
} from "@/features/management/classes/types/class-types";

interface EditStudentDialogProps {
  classId: string;
  student: ClassStudent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditStudentDialog({
  classId,
  student,
  open,
  onOpenChange,
  onSuccess,
}: EditStudentDialogProps) {
  const { mutate: updateStudent, isPending } = useUpdateStudents();

  // State quản lý form
  const [isLeader, setIsLeader] = useState(false);
  const [group, setGroup] = useState<string>("0");

  // Sync state khi student thay đổi
  useEffect(() => {
    if (student) {
      setIsLeader(student.role === "Leader");

      // Parse group từ string "Team 1" -> "1"
      const teamNumber = student.team?.match(/\d+/)?.[0] || "0";
      setGroup(teamNumber);
    }
  }, [student, open]);

  const handleSave = () => {
    if (!student) return;

    // 1. Xác định ID dựa trên status (Sửa _id thành id cho khớp Type ClassStudent)
    const isEnrolled = student.status === "Enrolled";

    // Lưu ý: Dùng undefined thay vì "" để tránh lỗi validation backend nếu có
    const studentIdVal = isEnrolled ? student._id : undefined;
    const pendingIdVal = !isEnrolled ? student._id : undefined;

    // 2. Parse Group
    const groupInt = parseInt(group);

    // 3. Construct Payload (Đã khớp hoàn toàn với UpdateStudentsPayload mới)
    const payload: UpdateStudentsPayload = {
      classId,
      student_id: studentIdVal,
      pending_id: pendingIdVal,
      group: isNaN(groupInt) ? 0 : groupInt,
      is_leader: isLeader,
    };

    // Gọi API (Bỏ 'as any' vì type đã chuẩn)
    updateStudent(payload, {
      onSuccess: () => {
        onOpenChange(false);
        if (onSuccess) onSuccess();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa sinh viên</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin nhóm và vai trò cho sinh viên{" "}
            <b>{student?.full_name}</b>.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* GROUP SELECTION */}
          <div className="space-y-2">
            <Label>Nhóm</Label>
            <div className="relative">
              <Layers className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 z-10" />
              <Select
                value={group}
                onValueChange={setGroup}
                disabled={isPending}
              >
                <SelectTrigger className="pl-9">
                  <SelectValue placeholder="Chọn nhóm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Chưa có nhóm</SelectItem>
                  {Array.from({ length: 20 }, (_, i) => (i + 1).toString()).map(
                    (num) => (
                      <SelectItem key={num} value={num}>
                        Nhóm {num}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* LEADER SWITCH */}
          <div className="flex items-center justify-between space-x-2 border p-3 rounded-lg bg-gray-50">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-full ${isLeader ? "bg-yellow-100" : "bg-gray-200"}`}
              >
                <Crown
                  className={`h-4 w-4 ${isLeader ? "text-yellow-600 fill-yellow-600" : "text-gray-500"}`}
                />
              </div>
              <div className="flex flex-col space-y-0.5">
                <Label
                  htmlFor="leader-mode"
                  className="font-medium cursor-pointer"
                >
                  Nhóm Trưởng
                </Label>
                <span className="text-xs text-muted-foreground">
                  Cấp quyền quản lý nhóm
                </span>
              </div>
            </div>
            <Switch
              id="leader-mode"
              checked={isLeader}
              onCheckedChange={setIsLeader}
              disabled={isPending}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSave}
            disabled={isPending}
            className="bg-[#F27124] hover:bg-[#d65d1b]"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
