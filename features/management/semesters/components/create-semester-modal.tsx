"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, AlertCircle } from "lucide-react";

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
  createSemesterSchema,
  CreateSemesterFormValues,
} from "@/features/management/semesters/schemas/semester-schema";

interface CreateSemesterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: CreateSemesterFormValues) => void;
  isCreating: boolean;
}

export function CreateSemesterModal({
  open,
  onOpenChange,
  onCreate,
  isCreating,
}: CreateSemesterModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateSemesterFormValues>({
    resolver: zodResolver(createSemesterSchema),
    defaultValues: {
      name: "",
      code: "",
      start_date: "",
      end_date: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = (data: CreateSemesterFormValues) => {
    onCreate(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125 rounded-[32px] p-0 overflow-hidden border-slate-200 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-950 font-sans transition-colors">
        <div className="p-8">
          <DialogHeader className="mb-6">
            <div className="h-12 w-12 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
              <Plus className="h-6 w-6" />
            </div>
            <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              Tạo Học Kỳ Mới
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400 text-sm mt-2">
              Học kỳ mới sẽ tự động được đặt làm Học kỳ mặc định (OPEN).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* GRID 1: Tên & Mã */}
            <div className="grid grid-cols-2 gap-5">
              {/* Field: Tên */}
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider"
                >
                  Tên học kỳ <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="VD: Spring 2026"
                  className={`rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 h-12 dark:text-slate-100 font-medium transition-colors ${
                    errors.name
                      ? "border-red-500 focus-visible:ring-red-200"
                      : "focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                  }`}
                  {...register("name")}
                />
                {errors.name && (
                  <span className="text-[10px] text-red-500 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.name.message}
                  </span>
                )}
              </div>

              {/* Field: Mã */}
              <div className="space-y-2">
                <Label
                  htmlFor="code"
                  className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider"
                >
                  Mã học kỳ <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="code"
                  placeholder="VD: SP26"
                  className={`rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 h-12 font-mono font-bold uppercase dark:text-slate-100 transition-colors ${
                    errors.code
                      ? "border-red-500 focus-visible:ring-red-200"
                      : "focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                  }`}
                  {...register("code")}
                  onChange={(e) => {
                    register("code").onChange(e);
                    e.target.value = e.target.value.toUpperCase();
                  }}
                />
                {errors.code && (
                  <span className="text-[10px] text-red-500 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.code.message}
                  </span>
                )}
              </div>
            </div>

            {/* GRID 2: Ngày bắt đầu & kết thúc */}
            <div className="grid grid-cols-2 gap-5">
              {/* Field: Start Date */}
              <div className="space-y-2">
                <Label
                  htmlFor="start"
                  className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider"
                >
                  Bắt đầu <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="start"
                  type="date"
                  className={`rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 h-12 w-full dark:text-slate-100 dark:scheme-dark font-medium transition-colors ${
                    errors.start_date
                      ? "border-red-500 focus-visible:ring-red-200"
                      : "focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                  }`}
                  {...register("start_date")}
                />
                {errors.start_date && (
                  <span className="text-[10px] text-red-500 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />{" "}
                    {errors.start_date.message}
                  </span>
                )}
              </div>

              {/* Field: End Date */}
              <div className="space-y-2">
                <Label
                  htmlFor="end"
                  className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider"
                >
                  Kết thúc <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="end"
                  type="date"
                  className={`rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 h-12 w-full dark:text-slate-100 dark:scheme-dark font-medium transition-colors ${
                    errors.end_date
                      ? "border-red-500 focus-visible:ring-red-200"
                      : "focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                  }`}
                  {...register("end_date")}
                />
                {errors.end_date && (
                  <span className="text-[10px] text-red-500 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />{" "}
                    {errors.end_date.message}
                  </span>
                )}
              </div>
            </div>

            <DialogFooter className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-6 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-11 rounded-xl font-bold text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 w-full sm:w-auto"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isCreating}
                className="h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-sm active:scale-[0.98] transition-all w-full sm:w-auto"
              >
                {isCreating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Tạo Học kỳ"
                )}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
