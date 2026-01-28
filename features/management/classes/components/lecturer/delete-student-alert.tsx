// src/features/lecturer/components/class/delete-student-alert.tsx
"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRemoveStudents } from "@/features/management/classes/hooks/use-classes";
import { ClassStudent } from "@/features/management/classes/types/class-types";
import { Loader2, UserMinus } from "lucide-react";

interface DeleteStudentAlertProps {
  classId: string;
  students: ClassStudent[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DeleteStudentAlert({
  classId,
  students,
  open,
  onOpenChange,
  onSuccess,
}: DeleteStudentAlertProps) {
  const { mutate: removeStudents, isPending } = useRemoveStudents();

  // Lấy sinh viên đang được chọn (xử lý an toàn)
  const targetStudent = students[0];

  const handleRemove = () => {
    if (!targetStudent) return;

    // Logic xác định ID:
    let studentIdVal = "";
    let pendingIdVal = "";

    if (targetStudent.status === "Enrolled") {
      studentIdVal = targetStudent._id;
    } else {
      // Pending
      pendingIdVal = targetStudent.pending_id || targetStudent._id;
    }

    console.log("Removing form class:", {
      student_id: studentIdVal,
      pending_id: pendingIdVal,
    });

    removeStudents(
      {
        classId,
        student_id: studentIdVal,
        pending_id: pendingIdVal,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          if (onSuccess) onSuccess();
        },
      },
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-orange-100 rounded-full">
              <UserMinus className="w-5 h-5 text-orange-600" />
            </div>
            <AlertDialogTitle>Mời ra khỏi lớp học</AlertDialogTitle>
          </div>

          <AlertDialogDescription className="pt-2 text-slate-600">
            Bạn có chắc chắn muốn mời sinh viên{" "}
            <b>{targetStudent?.full_name}</b> ra khỏi lớp?
            <br />
            <br />
            <span className="block p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-500">
              💡 <b>Lưu ý:</b> Hành động này chỉ gỡ sinh viên khỏi danh sách lớp
              hiện tại. Tài khoản và dữ liệu cá nhân của sinh viên trên hệ thống
              vẫn được giữ nguyên.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Đóng</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleRemove();
            }}
            disabled={isPending}
            className="bg-orange-600 hover:bg-orange-700 text-white focus:ring-orange-600"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Xác nhận mời ra
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
