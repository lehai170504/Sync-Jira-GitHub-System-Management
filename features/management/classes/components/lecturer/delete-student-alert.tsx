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

  const targetStudent = students[0];

  const handleRemove = () => {
    if (!targetStudent) return;

    let studentIdVal = "";
    let pendingIdVal = "";

    if (targetStudent.status === "Enrolled") {
      studentIdVal = targetStudent._id;
    } else {
      pendingIdVal = targetStudent.pending_id || targetStudent._id;
    }

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
      <AlertDialogContent className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full">
              <UserMinus className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <AlertDialogTitle className="text-slate-900 dark:text-slate-100">
              Mời ra khỏi lớp học
            </AlertDialogTitle>
          </div>

          <AlertDialogDescription className="pt-2 text-slate-600 dark:text-slate-400">
            Bạn có chắc chắn muốn mời sinh viên{" "}
            <b className="text-slate-900 dark:text-slate-100">
              {targetStudent?.full_name}
            </b>{" "}
            ra khỏi lớp?
            <br />
            <br />
            <span className="block p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg text-xs text-slate-500 dark:text-slate-400">
              💡 <b className="dark:text-slate-300">Lưu ý:</b> Hành động này chỉ
              gỡ sinh viên khỏi danh sách lớp hiện tại. Tài khoản và dữ liệu cá
              nhân của sinh viên trên hệ thống vẫn được giữ nguyên.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isPending}
            className="dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700"
          >
            Đóng
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleRemove();
            }}
            disabled={isPending}
            className="bg-orange-600 hover:bg-orange-700 text-white focus:ring-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700"
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
