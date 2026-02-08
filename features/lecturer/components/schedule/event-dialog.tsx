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

// 👇 IMPORT SCHEMA TỪ FILE RIÊNG (Nhớ chỉnh đường dẫn đúng với project của bạn)
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

  // --- INIT FORM ---
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

  // --- SYNC DATA ---
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

  // --- SUBMIT HANDLER ---
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
          <Button className="bg-[#F27124] hover:bg-[#d65d1b] shadow-lg shadow-orange-500/20 text-white">
            <Plus className="mr-2 h-4 w-4" /> Tạo Lịch Dạy
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Thêm lịch giảng dạy mới</DialogTitle>
          <DialogDescription>
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
                    <FormLabel>
                      Ngày dạy <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
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
                    <FormLabel>Ca học (Slot)</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn slot" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">
                          Slot 1 (07:30 - 09:00)
                        </SelectItem>
                        <SelectItem value="2">
                          Slot 2 (09:10 - 10:40)
                        </SelectItem>
                        <SelectItem value="3">
                          Slot 3 (10:50 - 12:20)
                        </SelectItem>
                        <SelectItem value="4">
                          Slot 4 (12:50 - 14:20)
                        </SelectItem>
                        <SelectItem value="5">
                          Slot 5 (14:30 - 16:00)
                        </SelectItem>
                        <SelectItem value="6">
                          Slot 6 (16:10 - 17:40)
                        </SelectItem>
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
                  <FormLabel>
                    Phòng học (Room) <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="VD: BE-401, Online..." {...field} />
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
                  <FormLabel>
                    Chủ đề (Topic) <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="VD: Bài 1 - Giới thiệu React..."
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
                  <FormLabel>Nội dung (Content)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả nội dung buổi học..."
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
                  <FormLabel>Ghi chú (Note)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ghi chú thêm (tùy chọn)..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen?.(false)}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="bg-[#F27124] hover:bg-[#d65d1b]"
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
