"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
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
          <Button className="bg-[#F27124] hover:bg-[#d65d1b] shadow-lg shadow-orange-500/20 text-white font-bold">
            <Plus className="mr-2 h-4 w-4" /> Tạo Lịch Dạy
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 transition-colors">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-slate-100">
            Thêm lịch giảng dạy mới
          </DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400">
            Tạo lịch dạy (Teaching Schedule) cho lớp học hiện tại.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-2"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 dark:text-slate-300">
                      Ngày dạy <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-slate-100 dark:[color-scheme:dark] focus-visible:ring-[#F27124]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slot"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 dark:text-slate-300">
                      Ca học (Slot)
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-slate-100 focus:ring-[#F27124]">
                          <SelectValue placeholder="Chọn slot" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
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
                            className="dark:text-slate-200"
                          >
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="room"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 dark:text-slate-300">
                    Phòng học (Room) <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="VD: BE-401, Online..."
                      className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-slate-100 focus-visible:ring-[#F27124]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 dark:text-slate-300">
                    Chủ đề (Topic) <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="VD: Bài 1 - Giới thiệu React..."
                      className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-slate-100 focus-visible:ring-[#F27124]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 dark:text-slate-300">
                    Nội dung (Content)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả nội dung buổi học..."
                      className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-slate-100 focus-visible:ring-[#F27124]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 dark:text-slate-300">
                    Ghi chú (Note)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ghi chú thêm (tùy chọn)..."
                      className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-slate-100 focus-visible:ring-[#F27124]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-4 border-t border-slate-100 dark:border-slate-800 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen?.(false)}
                className="dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="bg-[#F27124] hover:bg-[#d65d1b] text-white"
                disabled={isPending}
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Lưu lịch học
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
