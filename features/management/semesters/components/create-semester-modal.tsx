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
  // 2. Setup Form với Resolver
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

  // Reset form mỗi khi mở modal
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
      <DialogContent className="sm:max-w-[500px] rounded-[32px] p-0 overflow-hidden border-none shadow-2xl">
        <div className="p-8 bg-white">
          <DialogHeader className="mb-6">
            <div className="h-12 w-12 bg-orange-50 rounded-2xl flex items-center justify-center mb-4 border border-orange-100">
              <Plus className="h-6 w-6 text-[#F27124]" />
            </div>
            <DialogTitle className="text-2xl font-black text-slate-900">
              Tạo Học Kỳ Mới
            </DialogTitle>
            <DialogDescription className="text-slate-500 font-medium">
              Thiết lập thông tin cho kỳ học mới. Các trường có dấu * là bắt
              buộc.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* GRID 1: Tên & Mã */}
            <div className="grid grid-cols-2 gap-4">
              {/* Field: Tên */}
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-xs font-bold uppercase text-slate-500 tracking-wider"
                >
                  Tên học kỳ <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="VD: Spring 2024"
                  className={`rounded-xl border-slate-200 h-11 ${errors.name ? "border-red-500 focus:ring-red-200" : "focus:border-[#F27124] focus:ring-[#F27124]/20"}`}
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
                  className="text-xs font-bold uppercase text-slate-500 tracking-wider"
                >
                  Mã học kỳ <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="code"
                  placeholder="VD: SP24"
                  className={`rounded-xl border-slate-200 h-11 font-mono uppercase ${errors.code ? "border-red-500 focus:ring-red-200" : "focus:border-[#F27124] focus:ring-[#F27124]/20"}`}
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
            <div className="grid grid-cols-2 gap-4">
              {/* Field: Start Date */}
              <div className="space-y-2">
                <Label
                  htmlFor="start"
                  className="text-xs font-bold uppercase text-slate-500 tracking-wider"
                >
                  Ngày bắt đầu <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="start"
                  type="date"
                  className={`rounded-xl border-slate-200 h-11 block w-full ${errors.start_date ? "border-red-500 focus:ring-red-200" : "focus:border-[#F27124] focus:ring-[#F27124]/20"}`}
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
                  className="text-xs font-bold uppercase text-slate-500 tracking-wider"
                >
                  Ngày kết thúc <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="end"
                  type="date"
                  className={`rounded-xl border-slate-200 h-11 block w-full ${errors.end_date ? "border-red-500 focus:ring-red-200" : "focus:border-[#F27124] focus:ring-[#F27124]/20"}`}
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

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="rounded-xl font-bold text-slate-500 hover:text-slate-900"
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                disabled={isCreating}
                className="bg-[#F27124] hover:bg-orange-600 text-white rounded-xl font-black px-6 shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
              >
                {isCreating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Xác nhận tạo"
                )}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
