"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Loader2,
  FileText,
  CalendarClock,
  Link as LinkIcon,
  AlignLeft,
} from "lucide-react";

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

import { useCreateAssignment } from "@/features/lecturer/hooks/use-assignments";
import {
  createAssignmentSchema,
  type CreateAssignmentFormValues,
} from "@/features/lecturer/schemas/assignment-schema";

interface CreateAssignmentDialogProps {
  classId?: string;
}

export function CreateAssignmentDialog({
  classId,
}: CreateAssignmentDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutate: createAssignment, isPending } = useCreateAssignment();

  const form = useForm<CreateAssignmentFormValues>({
    resolver: zodResolver(createAssignmentSchema),
    defaultValues: {
      title: "",
      type: "ASSIGNMENT",
      deadline: "",
      description: "",
      resources: "",
    },
  });

  const onSubmit = (data: CreateAssignmentFormValues) => {
    if (!classId) return;

    createAssignment(
      {
        classId,
        title: data.title,
        type: data.type,
        deadline: new Date(data.deadline).toISOString(),
        description: data.description || "",
        resources: data.resources
          ? data.resources
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
      },
      {
        onSuccess: () => {
          setOpen(false);
          form.reset();
        },
      },
    );
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 shadow-sm rounded-xl px-5 h-11 text-white font-bold transition-all active:scale-95">
          <Plus className="mr-2 h-4 w-4" /> Tạo bài mới
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-150 p-0 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-2xl rounded-3xl overflow-hidden font-sans transition-colors">
        <DialogHeader className="px-8 pt-8 pb-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 transition-colors">
          <DialogTitle className="text-slate-900 dark:text-slate-100 text-xl font-bold flex items-center gap-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
              <FileText className="h-5 w-5" />
            </div>
            Tạo bài tập mới
          </DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400 mt-2">
            Thiết lập thông tin bài tập (Assignment) hoặc bài thực hành (Lab)
            cho sinh viên.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="px-8 py-6 space-y-5"
          >
            {/* FIELD: TÊN BÀI TẬP */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    Tên bài tập <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="VD: Lab 1 - React Basics"
                      className="h-12 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-slate-100 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-colors font-medium"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* FIELD: LOẠI BÀI TẬP */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      Loại bài tập
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isPending}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-slate-100 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium">
                          <SelectValue placeholder="Chọn loại" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl shadow-xl">
                        <SelectItem
                          value="ASSIGNMENT"
                          className="dark:text-slate-200 font-medium py-2.5"
                        >
                          Assignment (Bài tập lớn)
                        </SelectItem>
                        <SelectItem
                          value="LAB"
                          className="dark:text-slate-200 font-medium py-2.5"
                        >
                          Lab (Thực hành)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

              {/* FIELD: DEADLINE */}
              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <CalendarClock className="h-3.5 w-3.5 text-slate-400" />{" "}
                      Hạn nộp <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        className="h-12 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-slate-100 dark:scheme-dark focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-colors font-medium"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
            </div>

            {/* FIELD: MÔ TẢ */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <AlignLeft className="h-3.5 w-3.5 text-slate-400" /> Mô tả /
                    Yêu cầu
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập hướng dẫn làm bài, yêu cầu đầu ra..."
                      className="resize-none min-h-25 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-slate-100 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-colors font-medium p-3"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            {/* FIELD: RESOURCES */}
            <FormField
              control={form.control}
              name="resources"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <LinkIcon className="h-3.5 w-3.5 text-slate-400" /> Link
                    đính kèm
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="VD: Google Drive link, Docs link (Ngăn cách bằng dấu phẩy)"
                      className="h-12 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-slate-100 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-colors font-medium"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-6 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
                className="h-11 rounded-xl font-bold dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 w-full sm:w-auto"
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                className="h-11 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white w-full sm:w-auto shadow-md dark:shadow-none"
                disabled={isPending}
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Tạo bài tập
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
