"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Loader2, BookOpen, User, Calendar } from "lucide-react";
import { toast } from "sonner";
import { ClassItem } from "./class-types"; // Import type

// Schema giữ nguyên như lúc tạo
const formSchema = z.object({
  code: z.string().min(3, "Mã lớp phải có ít nhất 3 ký tự"),
  subject: z.string().min(1, "Vui lòng chọn môn học"),
  semester: z.string().min(1, "Vui lòng chọn học kỳ"),
  lecturer: z.string().min(1, "Vui lòng phân công giảng viên"),
  limit: z.coerce.number().min(10).max(100),
});

// Mock Data (Nên tách ra file constants dùng chung)
const subjects = ["SWP391", "SWR302", "PRN231", "MKT201", "GRA201"];
const semesters = ["SP24", "SU24", "FA24", "SP25"];
const lecturers = [
  { id: "gv_hien@fpt.edu.vn", name: "Trần Văn Hiến" },
  { id: "gv_binh@fpt.edu.vn", name: "Nguyễn Bình" },
  { id: "gv_tuan@fpt.edu.vn", name: "Lê Tuấn" },
  { id: "gv_hoa@fpt.edu.vn", name: "Phạm Hoa" },
  { id: "gv_minh@fpt.edu.vn", name: "Đỗ Minh" },
  { id: "gv_lan@fpt.edu.vn", name: "Hoàng Lan" },
];

interface EditClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classData: ClassItem | null; // Dữ liệu lớp cần sửa
  onSuccess?: () => void;
}

export function EditClassDialog({
  open,
  onOpenChange,
  classData,
  onSuccess,
}: EditClassDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      subject: "",
      semester: "",
      lecturer: "",
      limit: 30,
    },
  });

  // Khi mở dialog hoặc đổi classData, reset form về giá trị cũ
  useEffect(() => {
    if (classData && open) {
      reset({
        code: classData.code,
        subject: classData.subject,
        semester: classData.semester,
        lecturer: classData.lecturer,
        limit: 30, // Giả sử API trả về limit, ở đây mock 30
      });
    }
  }, [classData, open, reset]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    // Giả lập gọi API update
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Updated Data:", { id: classData?.id, ...data });

    toast.success(`Đã cập nhật thông tin lớp ${data.code}!`);
    setIsLoading(false);
    onOpenChange(false);
    if (onSuccess) onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl gap-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Chỉnh sửa Lớp học
          </DialogTitle>
          <DialogDescription>
            Cập nhật thông tin cho lớp{" "}
            <span className="font-semibold text-gray-900">
              {classData?.code}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Row 1: Code & Limit */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Mã lớp</Label>
              <Input
                id="code"
                {...register("code")}
                className="h-10 rounded-xl focus-visible:ring-[#F27124]/20 focus-visible:border-[#F27124]"
              />
              {errors.code && (
                <p className="text-xs text-red-500">
                  {String(errors.code.message)}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="limit">Sĩ số tối đa</Label>
              <Input
                id="limit"
                type="number"
                {...register("limit")}
                className="h-10 rounded-xl focus-visible:ring-[#F27124]/20 focus-visible:border-[#F27124]"
              />
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-gray-400" /> Môn học
            </Label>
            <Select
              onValueChange={(val) => setValue("subject", val)}
              value={watch("subject")}
            >
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue placeholder="Chọn môn" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Semester */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" /> Học kỳ
            </Label>
            <Select
              onValueChange={(val) => setValue("semester", val)}
              value={watch("semester")}
            >
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue placeholder="Chọn kỳ" />
              </SelectTrigger>
              <SelectContent>
                {semesters.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Lecturer */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" /> Giảng viên
            </Label>
            <Select
              onValueChange={(val) => setValue("lecturer", val)}
              value={watch("lecturer")}
            >
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue placeholder="Chọn GV" />
              </SelectTrigger>
              <SelectContent>
                {lecturers.map((l) => (
                  <SelectItem key={l.id} value={l.id}>
                    {l.name} ({l.id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="rounded-xl h-11"
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="bg-[#F27124] hover:bg-[#d65d1b] rounded-xl h-11 px-8 min-w-[140px]"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang lưu...
                </>
              ) : (
                "Lưu thay đổi"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
