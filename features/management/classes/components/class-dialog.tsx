"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Hooks
import { useCreateClass } from "../hooks/use-classes";
import { useSemesters } from "@/features/management/semesters/hooks/use-semesters";
import { useUsers } from "@/features/management/users/hooks/use-users";
import { useSubjects } from "@/features/management/subjects/hooks/use-subjects";

// Import Schema
import {
  createClassSchema,
  CreateClassFormValues,
} from "@/features/management/classes/schemas/class-schema";

interface ClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClassDialog({ open, onOpenChange }: ClassDialogProps) {
  // 1. Data Fetching
  const { data: semesters } = useSemesters();
  const { data: lecturersData } = useUsers({ role: "LECTURER", limit: 100 });
  const { data: subjectsData } = useSubjects("Active");

  const lecturers = lecturersData?.users || [];
  const subjects = subjectsData?.subjects || [];

  const { mutate: createClass, isPending } = useCreateClass();

  // 2. Setup React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createClassSchema),
    defaultValues: {
      name: "",
      subject_id: "",
      semester_id: "",
      lecturer_id: "",
      subjectName: "",
    },
  });

  // Reset form khi mở dialog
  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  // Xử lý khi chọn môn học -> Tự động điền subjectName và gợi ý tên lớp
  const handleSubjectChange = (subjectId: string) => {
    const selectedSubject = subjects.find((s) => s._id === subjectId);
    if (selectedSubject) {
      setValue("subject_id", subjectId, { shouldValidate: true });
      setValue("subjectName", selectedSubject.name);

      const currentName = watch("name");
      if (!currentName) {
        setValue("name", `${selectedSubject.code}_`);
      }
    }
  };

  const onSubmit = (data: CreateClassFormValues) => {
    createClass(data, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl gap-6">
        <DialogHeader>
          <DialogTitle>Tạo Lớp học mới</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
          {/* 1. MÔN HỌC */}
          <div className="grid gap-2">
            <Label>
              Môn học <span className="text-red-500">*</span>
            </Label>
            <Select
              onValueChange={handleSubjectChange}
              // Dùng value từ watch để sync với form state
              value={watch("subject_id")}
            >
              <SelectTrigger
                className={errors.subject_id ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Chọn môn học" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((sub) => (
                  <SelectItem key={sub._id} value={sub._id}>
                    {sub.code} - {sub.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.subject_id && (
              <span className="text-[10px] text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.subject_id.message}
              </span>
            )}
          </div>

          {/* 2. TÊN LỚP */}
          <div className="grid gap-2">
            <Label>
              Tên lớp học <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="VD: SE1943-A"
              className={errors.name ? "border-red-500 focus:ring-red-200" : ""}
              {...register("name")}
            />
            {errors.name && (
              <span className="text-[10px] text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.name.message}
              </span>
            )}
          </div>

          {/* 3. HỌC KỲ */}
          <div className="grid gap-2">
            <Label>
              Học kỳ <span className="text-red-500">*</span>
            </Label>
            <Select
              onValueChange={(val) =>
                setValue("semester_id", val, { shouldValidate: true })
              }
              value={watch("semester_id")}
            >
              <SelectTrigger
                className={errors.semester_id ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Chọn học kỳ" />
              </SelectTrigger>
              <SelectContent>
                {semesters?.map((sem) => (
                  <SelectItem key={sem._id} value={sem._id}>
                    {sem.name} ({sem.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.semester_id && (
              <span className="text-[10px] text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.semester_id.message}
              </span>
            )}
          </div>

          {/* 4. GIẢNG VIÊN */}
          <div className="grid gap-2">
            <Label>
              Giảng viên phụ trách <span className="text-red-500">*</span>
            </Label>
            <Select
              onValueChange={(val) =>
                setValue("lecturer_id", val, { shouldValidate: true })
              }
              value={watch("lecturer_id")}
            >
              <SelectTrigger
                className={errors.lecturer_id ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Chọn giảng viên" />
              </SelectTrigger>
              <SelectContent>
                {lecturers.map((lec) => (
                  <SelectItem key={lec._id} value={lec._id}>
                    {lec.full_name} ({lec.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.lecturer_id && (
              <span className="text-[10px] text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.lecturer_id.message}
              </span>
            )}
          </div>

          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              className="bg-[#F27124] hover:bg-[#d65d1b] text-white"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang tạo...
                </>
              ) : (
                "Tạo lớp học"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
