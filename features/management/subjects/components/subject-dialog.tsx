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
  createSubjectSchema,
  CreateSubjectFormValues,
} from "@/features/management/subjects/schemas/subject-schema";
import { useSubjectMutations } from "../hooks/use-subjects";

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
      {/* Cập nhật Dialog Content: bg-white -> dark:bg-slate-950 */}
      <DialogContent className="sm:max-w-md rounded-2xl gap-6 bg-white dark:bg-slate-950 border-none shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 bg-orange-50 dark:bg-orange-500/10 rounded-xl flex items-center justify-center border border-orange-100 dark:border-orange-500/20">
              <Plus className="h-5 w-5 text-[#F27124]" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900 dark:text-slate-50">
                Tạo Môn học mới
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
                Nhập thông tin môn học để thêm vào hệ thống.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
          <div className="grid grid-cols-2 gap-4">
            {/* CODE */}
            <div className="space-y-2">
              <Label
                htmlFor="code"
                className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
              >
                Mã môn <span className="text-red-500">*</span>
              </Label>
              <Input
                id="code"
                placeholder="VD: SWR302"
                className={`h-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-slate-100 ${
                  errors.code
                    ? "border-red-500 focus:ring-red-200"
                    : "focus:border-[#F27124] dark:focus:border-[#F27124]"
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

            {/* CREDITS */}
            <div className="space-y-2">
              <Label
                htmlFor="credits"
                className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
              >
                Số tín chỉ <span className="text-red-500">*</span>
              </Label>
              <Input
                id="credits"
                type="number"
                min={0}
                placeholder="3"
                className={`h-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-slate-100 ${
                  errors.credits
                    ? "border-red-500 focus:ring-red-200"
                    : "focus:border-[#F27124] dark:focus:border-[#F27124]"
                }`}
                {...register("credits")}
              />
              {errors.credits && (
                <span className="text-[10px] text-red-500 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.credits.message}
                </span>
              )}
            </div>
          </div>

          {/* NAME */}
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
            >
              Tên môn học <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="VD: Software Requirement"
              className={`h-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-slate-100 ${
                errors.name
                  ? "border-red-500 focus:ring-red-200"
                  : "focus:border-[#F27124] dark:focus:border-[#F27124]"
              }`}
              {...register("name")}
            />
            {errors.name && (
              <span className="text-[10px] text-red-500 font-medium flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.name.message}
              </span>
            )}
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
            >
              Mô tả
            </Label>
            <Input
              id="description"
              placeholder="Mô tả ngắn gọn về môn học..."
              className="h-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-slate-100 focus:border-[#F27124] dark:focus:border-[#F27124]"
              {...register("description")}
            />
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-[#F27124] hover:bg-[#d65d1b] font-bold text-white shadow-lg shadow-orange-500/20"
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
