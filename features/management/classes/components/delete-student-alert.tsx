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
import { ClassStudent } from "@/features/management/classes/types";
import { Loader2 } from "lucide-react";

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

  const handleDelete = () => {
    // Vì API chỉ xóa lẻ, ta lấy sinh viên đầu tiên được chọn
    const targetStudent = students[0];
    if (!targetStudent) return;

    // Logic xác định ID:
    // 1. Nếu là Enrolled: Lấy _id gán vào student_id
    // 2. Nếu là Pending: Lấy pending_id (hoặc _id) gán vào pending_id

    let studentIdVal = "";
    let pendingIdVal = "";

    if (targetStudent.status === "Enrolled") {
      studentIdVal = targetStudent._id;
    } else {
      // Pending
      pendingIdVal = targetStudent.pending_id || targetStudent._id;
    }

    console.log("Deleting Single:", {
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
          <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn đang xóa sinh viên <b>{students[0]?.full_name}</b> khỏi lớp.{" "}
            <br />
            Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700 text-white focus:ring-red-600"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Xóa sinh viên
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
