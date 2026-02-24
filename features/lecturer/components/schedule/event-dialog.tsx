"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Loader2,
  Calendar as CalIcon,
  Clock,
  MapPin,
  AlignLeft,
  FileText,
} from "lucide-react";
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
import { useCreateSchedule } from "@/features/lecturer/hooks/use-schedules";
import { format } from "date-fns";

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

import {
  eventSchema,
  type EventFormValues,
} from "@/features/lecturer/schemas/schedule-schema";

interface EventDialogProps {
  classId?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultDate?: Date;
}

export function EventDialog({
  classId,
  open,
  onOpenChange,
  defaultDate,
}: EventDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setIsOpen = isControlled ? onOpenChange : setInternalOpen;

  const { mutate: createSchedule, isPending } = useCreateSchedule();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      date: "",
      slot: "1",
      room: "",
      topic: "",
      content: "",
      note: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (defaultDate) {
        form.reset({
          ...form.getValues(),
          date: format(defaultDate, "yyyy-MM-dd"),
        });
      } else if (!form.getValues("date")) {
        form.reset({
          ...form.getValues(),
          date: format(new Date(), "yyyy-MM-dd"),
        });
      }
    }
  }, [isOpen, defaultDate, form]);

  const onSubmit = (data: EventFormValues) => {
    if (!classId) return;

    createSchedule(
      {
        classId,
        date: data.date,
        slot: parseInt(data.slot),
        room: data.room,
        topic: data.topic,
        content: data.content || "Nội dung buổi học",
        note: data.note,
      },
      {
        onSuccess: () => {
          setIsOpen?.(false);
          form.reset({
            date: "",
            slot: "1",
            room: "",
            topic: "",
            content: "",
            note: "",
          });
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button className="bg-[#F27124] hover:bg-[#d65d1b] shadow-lg shadow-orange-500/20 text-white font-bold rounded-xl transition-all">
            <Plus className="mr-2 h-4 w-4" /> Tạo Lịch Dạy
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-137.5 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-3xl p-0 overflow-hidden font-sans transition-colors">
        <DialogHeader className="px-8 pt-8 pb-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 transition-colors">
          <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
              <CalIcon className="h-5 w-5" />
            </div>
            Thêm sự kiện mới
          </DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400 mt-2">
            Điền thông tin chi tiết để tạo lịch học hoặc sự kiện cho lớp học.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-8 space-y-5"
          >
            {/* THỜI GIAN & ĐỊA ĐIỂM */}
            <div className="grid grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                      <CalIcon className="h-3.5 w-3.5" /> Ngày dạy
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="h-11 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-slate-100 dark:scheme-dark focus-visible:ring-blue-500/20 font-medium transition-colors rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slot"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                      <Clock className="h-3.5 w-3.5" /> Ca học
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-slate-100 focus:ring-blue-500/20 font-medium transition-colors rounded-xl">
                          <SelectValue placeholder="Chọn slot" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl shadow-xl">
                        {[
                          { val: "1", label: "Slot 1 (07:30 - 09:00)" },
                          { val: "2", label: "Slot 2 (09:10 - 10:40)" },
                          { val: "3", label: "Slot 3 (10:50 - 12:20)" },
                          { val: "4", label: "Slot 4 (12:50 - 14:20)" },
                          { val: "5", label: "Slot 5 (14:30 - 16:00)" },
                          { val: "6", label: "Slot 6 (16:10 - 17:40)" },
                        ].map((s) => (
                          <SelectItem
                            key={s.val}
                            value={s.val}
                            className="dark:text-slate-200 font-medium"
                          >
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="room"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                      <MapPin className="h-3.5 w-3.5" /> Phòng học
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="VD: BE-401, Online..."
                        className="h-11 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-slate-100 focus-visible:ring-blue-500/20 font-medium transition-colors rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                      <FileText className="h-3.5 w-3.5" /> Tiêu đề
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="VD: Bài 1 - Giới thiệu..."
                        className="h-11 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-slate-100 focus-visible:ring-blue-500/20 font-medium transition-colors rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
            </div>

            {/* NỘI DUNG & GHI CHÚ */}
            <div className="space-y-5 pt-2">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                      <AlignLeft className="h-3.5 w-3.5" /> Nội dung chi tiết
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Mô tả nội dung buổi học, yêu cầu chuẩn bị..."
                        className="min-h-25 resize-none bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-slate-100 focus-visible:ring-blue-500/20 font-medium transition-colors rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Ghi chú (Tùy chọn)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Thêm thông tin ngắn gọn..."
                        className="h-11 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-slate-100 focus-visible:ring-blue-500/20 font-medium transition-colors rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="mt-8 pt-4 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen?.(false)}
                className="h-11 rounded-xl font-bold dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 w-full sm:w-auto"
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                className="h-11 rounded-xl font-bold bg-[#F27124] hover:bg-[#d65d1b] dark:bg-blue-600 dark:hover:bg-blue-700 text-white w-full sm:w-auto shadow-md"
                disabled={isPending}
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Tạo sự kiện
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
