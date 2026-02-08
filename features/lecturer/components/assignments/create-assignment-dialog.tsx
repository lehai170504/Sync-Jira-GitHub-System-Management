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
import { Plus, Loader2 } from "lucide-react";

// --- FORM IMPORTS ---
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

  // 1. Setup Form
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

  // 2. Handle Submit
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
          form.reset(); // Reset form về mặc định
        },
      },
    );
  };

  // Reset form khi đóng dialog
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-[#F27124] hover:bg-[#d65d1b] shadow-lg shadow-orange-500/20 rounded-full px-6 text-white">
          <Plus className="mr-2 h-4 w-4" /> Tạo bài mới
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Tạo bài tập mới</DialogTitle>
          <DialogDescription>
            Thiết lập thông tin bài tập (Assignment) hoặc bài thực hành (Lab).
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            {/* FIELD: TÊN BÀI TẬP */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tên bài tập <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="VD: Lab 1 - Java Basics" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* FIELD: LOẠI BÀI TẬP */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại bài tập</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isPending}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ASSIGNMENT">Assignment</SelectItem>
                        <SelectItem value="LAB">Lab</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* FIELD: DEADLINE */}
              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Hạn nộp <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
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
                  <FormLabel>Mô tả / Yêu cầu</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập hướng dẫn làm bài..."
                      className="resize-none min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* FIELD: RESOURCES */}
            <FormField
              control={form.control}
              name="resources"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tài liệu đính kèm (Link)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Link 1, Link 2 (cách nhau bởi dấu phẩy)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="bg-[#F27124] hover:bg-[#d65d1b] text-white"
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
