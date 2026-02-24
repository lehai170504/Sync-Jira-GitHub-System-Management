"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  Plus,
  AlertCircle,
  BookOpen,
  Hash,
  Layers,
  AlignLeft,
} from "lucide-react";

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
  createSubjectSchema,
  CreateSubjectFormValues,
} from "@/features/management/subjects/schemas/subject-schema";
import { useSubjectMutations } from "../hooks/use-subjects";
import { Textarea } from "@/components/ui/textarea";

interface SubjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubjectDialog({ open, onOpenChange }: SubjectDialogProps) {
  const { createSubject, isPending } = useSubjectMutations();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createSubjectSchema),
    defaultValues: {
      code: "",
      name: "",
      credits: 0,
      description: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = async (data: CreateSubjectFormValues) => {
    try {
      await createSubject(data);
      onOpenChange(false);
    } catch (error) {
      // Error handled by hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125 rounded-3xl p-0 overflow-hidden bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-2xl font-sans transition-colors">
        <DialogHeader className="p-8 pb-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 transition-colors">
          <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
              <Plus className="h-5 w-5" />
            </div>
            Tạo Môn học mới
          </DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400 text-sm mt-2">
            Thiết lập thông số cơ bản cho môn học để sử dụng trong hệ thống.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-6 space-y-5">
          <div className="grid grid-cols-2 gap-5">
            {/* CODE */}
            <div className="space-y-2">
              <Label
                htmlFor="code"
                className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5"
              >
                <Hash className="h-3.5 w-3.5 text-slate-400" /> Mã môn{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="code"
                placeholder="VD: SWR302"
                className={`h-11 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-slate-100 font-mono font-bold uppercase transition-colors ${
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
                <span className="text-[10px] text-red-500 font-semibold flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" /> {errors.code.message}
                </span>
              )}
            </div>

            {/* CREDITS */}
            <div className="space-y-2">
              <Label
                htmlFor="credits"
                className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5"
              >
                <Layers className="h-3.5 w-3.5 text-slate-400" /> Tín chỉ{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="credits"
                type="number"
                min={0}
                placeholder="3"
                className={`h-11 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-slate-100 font-medium transition-colors ${
                  errors.credits
                    ? "border-red-500 focus-visible:ring-red-200"
                    : "focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                }`}
                {...register("credits")}
              />
              {errors.credits && (
                <span className="text-[10px] text-red-500 font-semibold flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" /> {errors.credits.message}
                </span>
              )}
            </div>
          </div>

          {/* NAME */}
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5"
            >
              <BookOpen className="h-3.5 w-3.5 text-slate-400" /> Tên môn học{" "}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="VD: Software Requirement"
              className={`h-11 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-slate-100 font-medium transition-colors ${
                errors.name
                  ? "border-red-500 focus-visible:ring-red-200"
                  : "focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
              }`}
              {...register("name")}
            />
            {errors.name && (
              <span className="text-[10px] text-red-500 font-semibold flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" /> {errors.name.message}
              </span>
            )}
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5"
            >
              <AlignLeft className="h-3.5 w-3.5 text-slate-400" /> Mô tả (Tùy
              chọn)
            </Label>
            <Textarea
              id="description"
              placeholder="Nhập giới thiệu ngắn về môn học này..."
              className="min-h-20 resize-none rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-slate-100 focus-visible:border-blue-500 focus-visible:ring-blue-500/20 transition-colors font-medium p-3"
              {...register("description")}
            />
          </div>

          <DialogFooter className="gap-3 pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
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
              disabled={isPending}
              className="h-11 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white w-full sm:w-auto shadow-md transition-all active:scale-[0.98]"
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
