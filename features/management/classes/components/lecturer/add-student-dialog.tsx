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
import { toast } from "sonner";

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

import { useAddStudent } from "@/features/management/classes/hooks/use-classes";
import {
  addStudentSchema,
  type AddStudentFormValues,
} from "@/features/management/classes/schemas/student-schema";

interface AddStudentDialogProps {
  classId: string;
  students: Array<{ student_code: string; email: string }>;
  onSuccess?: () => void;
}

export function AddStudentDialog({
  classId,
  students,
  onSuccess,
}: AddStudentDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutate: addStudent, isPending } = useAddStudent();

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

  const onSubmit = (data: AddStudentFormValues) => {
    const normalizedCode = data.code.trim().toLowerCase();
    const normalizedEmail = data.email.trim().toLowerCase();
    const duplicated = students.find(
      (s) =>
        (s.student_code || "").trim().toLowerCase() === normalizedCode ||
        (s.email || "").trim().toLowerCase() === normalizedEmail,
    );
    if (duplicated) {
      toast.warning("Sinh viên đã tồn tại trong lớp", {
        description: "MSSV hoặc email này đã có trong danh sách lớp.",
      });
      return;
    }

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
          form.reset();
          if (onSuccess) onSuccess();
        },
      },
    );
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-[#F27124] hover:bg-[#d65d1b] shadow-lg shadow-orange-500/20 text-white font-bold">
          <UserPlus className="mr-2 h-4 w-4" /> Thêm SV
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-slate-100">
            Thêm Sinh viên mới
          </DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400">
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
                    <FormLabel className="text-slate-700 dark:text-slate-300 font-semibold">
                      MSSV <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Hash className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-slate-500" />
                        <Input
                          className="pl-9 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-slate-100 focus-visible:ring-[#F27124] dark:focus-visible:ring-[#F27124]"
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
                    <FormLabel className="text-slate-700 dark:text-slate-300 font-semibold">
                      Email <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-slate-500" />
                        <Input
                          className="pl-9 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-slate-100 focus-visible:ring-[#F27124] dark:focus-visible:ring-[#F27124]"
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
                  <FormLabel className="text-slate-700 dark:text-slate-300 font-semibold">
                    Họ tên <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-slate-500" />
                      <Input
                        className="pl-9 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-slate-100 focus-visible:ring-[#F27124] dark:focus-visible:ring-[#F27124]"
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
                    <FormLabel className="text-slate-700 dark:text-slate-300 font-semibold">
                      Nhóm
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isPending}
                    >
                      <FormControl>
                        <div className="relative">
                          <Layers className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-slate-500 z-10" />
                          <SelectTrigger className="pl-9 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:ring-[#F27124]">
                            <SelectValue placeholder="Chọn nhóm" />
                          </SelectTrigger>
                        </div>
                      </FormControl>
                      <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                        <SelectItem value="0" className="dark:text-slate-200">
                          Chưa có nhóm
                        </SelectItem>
                        {Array.from({ length: 20 }, (_, i) =>
                          (i + 1).toString(),
                        ).map((num) => (
                          <SelectItem
                            key={num}
                            value={num}
                            className="dark:text-slate-200"
                          >
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
                    <FormLabel className="block mb-2 text-slate-700 dark:text-slate-300 font-semibold">
                      Vai trò
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center justify-between space-x-2 border border-slate-200 dark:border-slate-800 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 h-[42px]">
                        <div className="flex items-center gap-2">
                          <Crown
                            className={`h-4 w-4 transition-colors ${
                              field.value
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-400 dark:text-slate-500"
                            }`}
                          />
                          <span
                            className="text-sm font-medium cursor-pointer text-slate-700 dark:text-slate-200"
                            onClick={() => field.onChange(!field.value)}
                          >
                            Nhóm trưởng?
                          </span>
                        </div>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isPending}
                          className="data-[state=checked]:bg-[#F27124] dark:data-[state=unchecked]:bg-slate-700"
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4 mt-6 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
                className="dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 font-bold"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="bg-[#F27124] hover:bg-[#d65d1b] text-white font-bold"
                disabled={isPending}
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Thêm Sinh viên
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
