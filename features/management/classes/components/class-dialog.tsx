"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  AlertCircle,
  Plus,
  BookOpen,
  GraduationCap,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl transition-colors font-sans">
        {/* HEADER */}
        <DialogHeader className="px-8 pt-8 pb-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 transition-colors">
          <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
              <Plus className="h-5 w-5" />
            </div>
            Tạo Lớp học mới
          </DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
            Điền các thông tin cơ bản để khởi tạo không gian lớp học trên hệ
            thống.
          </DialogDescription>
        </DialogHeader>

        {/* BODY (FORM) */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-6 space-y-5">
          {/* 1. MÔN HỌC */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" /> Môn học{" "}
              <span className="text-red-500">*</span>
            </Label>
            <Select
              onValueChange={handleSubjectChange}
              value={watch("subject_id")}
            >
              <SelectTrigger
                className={`h-12 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-slate-100 font-medium transition-colors ${
                  errors.subject_id
                    ? "border-red-500 dark:border-red-500 ring-red-500/20 focus:ring-red-500/20"
                    : "focus:ring-blue-500/20 focus:border-blue-500"
                }`}
              >
                <SelectValue placeholder="-- Chọn môn học --" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl shadow-xl">
                {subjects.map((sub) => (
                  <SelectItem
                    key={sub._id}
                    value={sub._id}
                    className="dark:text-slate-200 font-medium py-2.5"
                  >
                    {sub.code} - {sub.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.subject_id && (
              <span className="text-[10px] text-red-500 font-semibold flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" /> {errors.subject_id.message}
              </span>
            )}
          </div>

          {/* 2. TÊN LỚP */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              Mã Lớp Học <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="VD: SE1943-A"
              className={`h-12 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-slate-100 font-bold uppercase transition-colors ${
                errors.name
                  ? "border-red-500 dark:border-red-500 ring-red-500/20 focus-visible:ring-red-500/20"
                  : "focus-visible:ring-blue-500/20 focus-visible:border-blue-500"
              }`}
              {...register("name")}
            />
            {errors.name && (
              <span className="text-[10px] text-red-500 font-semibold flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" /> {errors.name.message}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-5">
            {/* 3. HỌC KỲ */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5" /> Học kỳ{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(val) =>
                  setValue("semester_id", val, { shouldValidate: true })
                }
                value={watch("semester_id")}
              >
                <SelectTrigger
                  className={`h-12 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-slate-100 font-medium transition-colors ${
                    errors.semester_id
                      ? "border-red-500 ring-red-500/20 focus:ring-red-500/20"
                      : "focus:ring-blue-500/20 focus:border-blue-500"
                  }`}
                >
                  <SelectValue placeholder="Chọn kỳ" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl shadow-xl">
                  {semesters?.map((sem) => (
                    <SelectItem
                      key={sem._id}
                      value={sem._id}
                      className="dark:text-slate-200 font-medium py-2.5"
                    >
                      {sem.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.semester_id && (
                <span className="text-[10px] text-red-500 font-semibold flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" /> Bắt buộc
                </span>
              )}
            </div>

            {/* 4. GIẢNG VIÊN */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" /> Giảng viên{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(val) =>
                  setValue("lecturer_id", val, { shouldValidate: true })
                }
                value={watch("lecturer_id")}
              >
                <SelectTrigger
                  className={`h-12 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-slate-100 font-medium transition-colors ${
                    errors.lecturer_id
                      ? "border-red-500 ring-red-500/20 focus:ring-red-500/20"
                      : "focus:ring-blue-500/20 focus:border-blue-500"
                  }`}
                >
                  <SelectValue placeholder="Chọn GV" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl shadow-xl">
                  {lecturers.map((lec) => (
                    <SelectItem
                      key={lec._id}
                      value={lec._id}
                      className="dark:text-slate-200 font-medium py-2.5"
                    >
                      {lec.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.lecturer_id && (
                <span className="text-[10px] text-red-500 font-semibold flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" /> Bắt buộc
                </span>
              )}
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <DialogFooter className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="h-11 rounded-xl font-bold dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 w-full sm:w-auto"
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              className="h-11 rounded-xl font-bold bg-[#F27124] hover:bg-[#d65d1b] dark:bg-blue-600 dark:hover:bg-blue-700 text-white w-full sm:w-auto shadow-md dark:shadow-none"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang tạo...
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
