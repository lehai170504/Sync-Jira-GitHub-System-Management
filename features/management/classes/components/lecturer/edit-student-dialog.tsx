"use client";

import { useEffect, useState } from "react";
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

// --- FORM IMPORTS ---
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useUpdateStudents } from "@/features/management/classes/hooks/use-classes";
import {
  ClassStudent,
  UpdateStudentsPayload,
} from "@/features/management/classes/types/class-types";

// Import Schema
import {
  editStudentSchema,
  type EditStudentFormValues,
} from "@/features/management/classes/schemas/student-schema";

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

  // 1. Setup Form
  const form = useForm<EditStudentFormValues>({
    resolver: zodResolver(editStudentSchema),
    defaultValues: {
      group: "0",
      isLeader: false,
    },
  });

  // 2. Sync state khi student thay đổi
  useEffect(() => {
    if (student) {
      // Parse group từ string "Team 1" -> "1"
      const teamNumber = student.team?.match(/\d+/)?.[0] || "0";

      form.reset({
        isLeader: student.role === "Leader",
        group: teamNumber,
      });
    }
  }, [student, open, form]);

  // 3. Handle Submit
  const onSubmit = (data: EditStudentFormValues) => {
    if (!student) return;

    // Xác định ID dựa trên status (Sửa _id thành id cho khớp Type ClassStudent nếu cần)
    const isEnrolled = student.status === "Enrolled";
    const studentIdVal = isEnrolled ? student._id : undefined;
    const pendingIdVal = !isEnrolled ? student._id : undefined;

    const groupInt = parseInt(data.group);

    const payload: UpdateStudentsPayload = {
      classId,
      student_id: studentIdVal,
      pending_id: pendingIdVal,
      group: isNaN(groupInt) ? 0 : groupInt,
      is_leader: data.isLeader,
    };

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

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            {/* FIELD: GROUP */}
            <FormField
              control={form.control}
              name="group"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nhóm</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value} // Quan trọng: bind value với field.value
                    disabled={isPending}
                  >
                    <FormControl>
                      <div className="relative">
                        <Layers className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 z-10" />
                        <SelectTrigger className="pl-9">
                          <SelectValue placeholder="Chọn nhóm" />
                        </SelectTrigger>
                      </div>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">Chưa có nhóm</SelectItem>
                      {Array.from({ length: 20 }, (_, i) =>
                        (i + 1).toString(),
                      ).map((num) => (
                        <SelectItem key={num} value={num}>
                          Nhóm {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* FIELD: IS LEADER */}
            <FormField
              control={form.control}
              name="isLeader"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <div className="flex items-center justify-between space-x-2 border p-3 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          field.value ? "bg-yellow-100" : "bg-gray-200"
                        }`}
                      >
                        <Crown
                          className={`h-4 w-4 ${
                            field.value
                              ? "text-yellow-600 fill-yellow-600"
                              : "text-gray-500"
                          }`}
                        />
                      </div>
                      <div className="flex flex-col space-y-0.5">
                        <FormLabel className="font-medium cursor-pointer mb-0">
                          Nhóm Trưởng
                        </FormLabel>
                        <span className="text-xs text-muted-foreground">
                          Cấp quyền quản lý nhóm
                        </span>
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isPending}
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="bg-[#F27124] hover:bg-[#d65d1b]"
                disabled={isPending}
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Lưu thay đổi
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
