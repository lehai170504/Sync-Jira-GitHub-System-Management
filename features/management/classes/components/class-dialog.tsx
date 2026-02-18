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

import { useCreateClass } from "../hooks/use-classes";
import { useSemesters } from "@/features/management/semesters/hooks/use-semesters";
import { useUsers } from "@/features/management/users/hooks/use-users";
import { useSubjects } from "@/features/management/subjects/hooks/use-subjects";
import {
  createClassSchema,
  CreateClassFormValues,
} from "@/features/management/classes/schemas/class-schema";

interface ClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClassDialog({ open, onOpenChange }: ClassDialogProps) {
  const { data: semesters } = useSemesters();
  const { data: lecturersData } = useUsers({ role: "LECTURER", limit: 100 });
  const { data: subjectsData } = useSubjects("Active");

  const lecturers = lecturersData?.users || [];
  const subjects = subjectsData?.subjects || [];

  const { mutate: createClass, isPending } = useCreateClass();

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

  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

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
      <DialogContent className="sm:max-w-md rounded-2xl gap-6 bg-white dark:bg-slate-950 border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-slate-100">
            Tạo Lớp học mới
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
          {/* 1. MÔN HỌC */}
          <div className="grid gap-2">
            <Label className="dark:text-slate-400">
              Môn học <span className="text-red-500">*</span>
            </Label>
            <Select
              onValueChange={handleSubjectChange}
              value={watch("subject_id")}
            >
              <SelectTrigger
                className={`bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-slate-100 ${
                  errors.subject_id
                    ? "border-red-500 dark:border-red-500"
                    : "focus:ring-orange-500/20"
                }`}
              >
                <SelectValue placeholder="Chọn môn học" />
              </SelectTrigger>
              <SelectContent className="dark:bg-slate-900 dark:border-slate-800">
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
            <Label className="dark:text-slate-400">
              Tên lớp học <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="VD: SE1943-A"
              className={`bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-slate-100 ${
                errors.name
                  ? "border-red-500 focus:ring-red-200"
                  : "focus:border-orange-500 dark:focus:border-orange-500"
              }`}
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
            <Label className="dark:text-slate-400">
              Học kỳ <span className="text-red-500">*</span>
            </Label>
            <Select
              onValueChange={(val) =>
                setValue("semester_id", val, { shouldValidate: true })
              }
              value={watch("semester_id")}
            >
              <SelectTrigger
                className={`bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-slate-100 ${
                  errors.semester_id ? "border-red-500" : ""
                }`}
              >
                <SelectValue placeholder="Chọn học kỳ" />
              </SelectTrigger>
              <SelectContent className="dark:bg-slate-900 dark:border-slate-800">
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
            <Label className="dark:text-slate-400">
              Giảng viên phụ trách <span className="text-red-500">*</span>
            </Label>
            <Select
              onValueChange={(val) =>
                setValue("lecturer_id", val, { shouldValidate: true })
              }
              value={watch("lecturer_id")}
            >
              <SelectTrigger
                className={`bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-slate-100 ${
                  errors.lecturer_id ? "border-red-500" : ""
                }`}
              >
                <SelectValue placeholder="Chọn giảng viên" />
              </SelectTrigger>
              <SelectContent className="dark:bg-slate-900 dark:border-slate-800">
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
              className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              className="bg-[#F27124] hover:bg-[#d65d1b] text-white shadow-lg shadow-orange-500/20"
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
