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

// --- VALIDATION SCHEMA ---
const formSchema = z.object({
  code: z.string().min(3, "Mã lớp phải có ít nhất 3 ký tự (VD: SE1740)"),
  subject: z.string().min(1, "Vui lòng chọn môn học"),
  semester: z.string().min(1, "Vui lòng chọn học kỳ"),
  lecturerId: z.string().min(1, "Vui lòng phân công giảng viên"),
  limit: z.coerce
    .number()
    .min(10, "Sĩ số tối thiểu là 10")
    .max(100, "Sĩ số tối đa là 100"),
});

type FormValues = z.infer<typeof formSchema>;

// --- MOCK DATA FOR SELECT OPTIONS ---
// Trong thực tế, bạn sẽ truyền props hoặc gọi API để lấy list này
const subjects = ["SWP391", "SWR302", "PRN231", "MKT201", "GRA201"];
const semesters = ["SP24", "SU24", "FA24", "SP25"];
const lecturers = [
  { id: "gv1", name: "Trần Văn Hiến", email: "hientv@fpt.edu.vn" },
  { id: "gv2", name: "Lê Thị Lan", email: "lanlt@fpt.edu.vn" },
  { id: "gv3", name: "Nguyễn Tuấn", email: "tuann@fpt.edu.vn" },
];

interface CreateClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void; // Callback khi tạo thành công để reload list
}

export function CreateClassDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateClassDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Setup Form
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
      semester: "SP24",
      lecturerId: "",
      limit: 30,
    },
  });

  // Reset form khi đóng/mở dialog
  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);

    // Giả lập gọi API tạo lớp
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Form Data Submitted:", data);

    toast.success(`Đã tạo lớp ${data.code} thành công!`);
    setIsLoading(false);
    onOpenChange(false);
    if (onSuccess) onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl gap-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Tạo Lớp học thủ công
          </DialogTitle>
          <DialogDescription>
            Tạo một lớp mới cho trường hợp phát sinh hoặc bổ sung.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Row 1: Class Code & Limit */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code" className="text-gray-700 font-medium">
                Mã lớp <span className="text-red-500">*</span>
              </Label>
              <Input
                id="code"
                placeholder="VD: SE1805"
                className={`h-10 rounded-xl ${errors.code ? "border-red-500 focus-visible:ring-red-200" : "focus-visible:ring-[#F27124]/20 focus-visible:border-[#F27124]"}`}
                {...register("code")}
              />
              {errors.code && (
                <span className="text-xs text-red-500">
                  {errors.code.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="limit" className="text-gray-700 font-medium">
                Sĩ số tối đa
              </Label>
              <Input
                id="limit"
                type="number"
                className="h-10 rounded-xl focus-visible:ring-[#F27124]/20 focus-visible:border-[#F27124]"
                {...register("limit")}
              />
              {errors.limit && (
                <span className="text-xs text-red-500">
                  {errors.limit.message}
                </span>
              )}
            </div>
          </div>

          {/* Row 2: Subject */}
          <div className="space-y-2">
            <Label className="text-gray-700 font-medium flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-gray-400" /> Môn học{" "}
              <span className="text-red-500">*</span>
            </Label>
            <Select
              onValueChange={(val) => setValue("subject", val)}
              defaultValue={watch("subject")}
            >
              <SelectTrigger
                className={`h-11 rounded-xl ${errors.subject ? "border-red-500" : "focus:ring-[#F27124]/20 focus:border-[#F27124]"}`}
              >
                <SelectValue placeholder="Chọn môn học (VD: SWP391)" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((sub) => (
                  <SelectItem key={sub} value={sub}>
                    {sub}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.subject && (
              <span className="text-xs text-red-500">
                {errors.subject.message}
              </span>
            )}
          </div>

          {/* Row 3: Semester */}
          <div className="space-y-2">
            <Label className="text-gray-700 font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" /> Học kỳ{" "}
              <span className="text-red-500">*</span>
            </Label>
            <Select
              onValueChange={(val) => setValue("semester", val)}
              defaultValue={watch("semester")}
            >
              <SelectTrigger className="h-11 rounded-xl focus:ring-[#F27124]/20 focus:border-[#F27124]">
                <SelectValue placeholder="Chọn học kỳ" />
              </SelectTrigger>
              <SelectContent>
                {semesters.map((sem) => (
                  <SelectItem key={sem} value={sem}>
                    {sem}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.semester && (
              <span className="text-xs text-red-500">
                {errors.semester.message}
              </span>
            )}
          </div>

          {/* Row 4: Lecturer */}
          <div className="space-y-2">
            <Label className="text-gray-700 font-medium flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" /> Giảng viên{" "}
              <span className="text-red-500">*</span>
            </Label>
            <Select
              onValueChange={(val) => setValue("lecturerId", val)}
              defaultValue={watch("lecturerId")}
            >
              <SelectTrigger
                className={`h-11 rounded-xl ${errors.lecturerId ? "border-red-500" : "focus:ring-[#F27124]/20 focus:border-[#F27124]"}`}
              >
                <SelectValue placeholder="Chọn giảng viên phụ trách" />
              </SelectTrigger>
              <SelectContent>
                {lecturers.map((lec) => (
                  <SelectItem key={lec.id} value={lec.id}>
                    <span className="font-medium text-gray-900">
                      {lec.name}
                    </span>
                    <span className="text-gray-500 ml-2 text-xs">
                      ({lec.email})
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.lecturerId && (
              <span className="text-xs text-red-500">
                {errors.lecturerId.message}
              </span>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="rounded-xl h-11 text-muted-foreground hover:text-gray-900"
              disabled={isLoading}
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              className="bg-[#F27124] hover:bg-[#d65d1b] rounded-xl h-11 px-8 shadow-md shadow-orange-500/20 font-semibold min-w-[140px]"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Tạo lớp...
                </>
              ) : (
                "Xác nhận tạo"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
