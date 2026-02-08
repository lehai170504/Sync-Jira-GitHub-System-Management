"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UserPlus,
  Mail,
  User,
  Hash,
  Loader2,
  Layers,
  Crown,
} from "lucide-react";

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

// Import Hook & Schema
import { useAddStudent } from "@/features/management/classes/hooks/use-classes";
import {
  addStudentSchema,
  type AddStudentFormValues,
} from "@/features/management/classes/schemas/student-schema";

interface AddStudentDialogProps {
  classId: string;
  onSuccess?: () => void;
}

export function AddStudentDialog({
  classId,
  onSuccess,
}: AddStudentDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutate: addStudent, isPending } = useAddStudent();

  // 1. Setup Form
  const form = useForm<AddStudentFormValues>({
    resolver: zodResolver(addStudentSchema),

    defaultValues: {
      code: "",
      name: "",
      email: "",
      group: "0",
      isLeader: false,
    },
  });

  // 2. Handle Submit
  const onSubmit = (data: AddStudentFormValues) => {
    const groupValue = parseInt(data.group, 10);

    addStudent(
      {
        classId: classId,
        student_code: data.code,
        full_name: data.name,
        email: data.email,
        group: isNaN(groupValue) ? 0 : groupValue,
        is_leader: data.isLeader,
      },
      {
        onSuccess: () => {
          setOpen(false);
          form.reset(); // Reset form về default values
          if (onSuccess) onSuccess();
        },
      },
    );
  };

  // Reset form khi đóng dialog (Optional)
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-[#F27124] hover:bg-[#d65d1b] shadow-lg shadow-orange-500/20 text-white">
          <UserPlus className="mr-2 h-4 w-4" /> Thêm SV
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Thêm Sinh viên mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin sinh viên thủ công để thêm vào lớp.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <div className="grid grid-cols-2 gap-4">
              {/* FIELD: MSSV */}
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      MSSV <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Hash className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          className="pl-9"
                          placeholder="CE123456"
                          disabled={isPending}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* FIELD: EMAIL */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          className="pl-9"
                          placeholder="anv@fpt.edu.vn"
                          disabled={isPending}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* FIELD: FULL NAME */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Họ tên <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        className="pl-9"
                        placeholder="Nguyễn Văn A"
                        disabled={isPending}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4 items-start">
              {/* FIELD: GROUP */}
              <FormField
                control={form.control}
                name="group"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nhóm</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isPending}
                    >
                      <FormControl>
                        <div className="relative">
                          <Layers className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 z-10" />
                          <SelectTrigger className="pl-9">
                            <SelectValue placeholder="Chọn nhóm" />
                          </SelectTrigger>
                        </div>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">Chưa có nhóm</SelectItem>
                        {Array.from({ length: 20 }, (_, i) =>
                          (i + 1).toString(),
                        ).map((num) => (
                          <SelectItem key={num} value={num}>
                            Nhóm {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* FIELD: IS LEADER */}
              <FormField
                control={form.control}
                name="isLeader"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="block mb-2">Vai trò</FormLabel>
                    <FormControl>
                      <div className="flex items-center justify-between space-x-2 border p-2.5 rounded-lg bg-gray-50 h-10">
                        <div className="flex items-center gap-2">
                          <Crown
                            className={`h-4 w-4 ${
                              field.value
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-400"
                            }`}
                          />
                          <span
                            className="text-sm font-medium cursor-pointer"
                            onClick={() => field.onChange(!field.value)}
                          >
                            Nhóm trưởng?
                          </span>
                        </div>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isPending}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

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
                className="bg-[#F27124] hover:bg-[#d65d1b]"
                disabled={isPending}
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Lưu
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
