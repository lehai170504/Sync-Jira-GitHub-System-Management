"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

// Import Hook
import { useAddStudent } from "@/features/management/classes/hooks/use-classes";

interface AddStudentDialogProps {
  classId: string;
  onSuccess?: () => void;
}

export function AddStudentDialog({
  classId,
  onSuccess,
}: AddStudentDialogProps) {
  const [open, setOpen] = useState(false);

  const [newStudent, setNewStudent] = useState({
    name: "",
    code: "",
    email: "",
    group: "0",
    isLeader: false,
  });

  const { mutate: addStudent, isPending } = useAddStudent();

  const handleAdd = () => {
    // Validate cơ bản
    if (!newStudent.name || !newStudent.code || !newStudent.email) {
      toast.error("Vui lòng nhập đủ thông tin (MSSV, Họ tên, Email)!");
      return;
    }

    const groupValue = parseInt(newStudent.group, 10);

    // Call API
    addStudent(
      {
        classId: classId,
        student_code: newStudent.code,
        full_name: newStudent.name,
        email: newStudent.email,
        group: isNaN(groupValue) ? 0 : groupValue, // Luôn gửi number
        is_leader: newStudent.isLeader,
      },
      {
        onSuccess: () => {
          setOpen(false);
          // Reset form
          setNewStudent({
            name: "",
            code: "",
            email: "",
            group: "0",
            isLeader: false,
          });
          if (onSuccess) onSuccess();
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            {/* MSSV */}
            <div className="space-y-2">
              <Label>MSSV *</Label>
              <div className="relative">
                <Hash className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  className="pl-9"
                  value={newStudent.code}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, code: e.target.value })
                  }
                  disabled={isPending}
                  placeholder="CE123456"
                />
              </div>
            </div>
            {/* EMAIL */}
            <div className="space-y-2">
              <Label>Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  className="pl-9"
                  value={newStudent.email}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, email: e.target.value })
                  }
                  disabled={isPending}
                  placeholder="anv@fpt.edu.vn"
                />
              </div>
            </div>
          </div>

          {/* FULL NAME */}
          <div className="space-y-2">
            <Label>Họ tên *</Label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                className="pl-9"
                value={newStudent.name}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, name: e.target.value })
                }
                disabled={isPending}
                placeholder="Nguyễn Văn A"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 items-end">
            {/* GROUP SELECTION */}
            <div className="space-y-2">
              <Label>Nhóm</Label>
              <div className="relative">
                <Layers className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 z-10" />
                <Select
                  value={newStudent.group}
                  onValueChange={(val) =>
                    setNewStudent({ ...newStudent, group: val })
                  }
                  disabled={isPending}
                >
                  <SelectTrigger className="pl-9">
                    <SelectValue placeholder="Chọn nhóm" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Value "0" đại diện cho chưa có nhóm (sẽ parse thành số 0) */}
                    <SelectItem value="0">Chưa có nhóm</SelectItem>

                    {/* Danh sách nhóm từ 1 đến 20 */}
                    {Array.from({ length: 20 }, (_, i) =>
                      (i + 1).toString(),
                    ).map((num) => (
                      <SelectItem key={num} value={num}>
                        Nhóm {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* IS LEADER SWITCH */}
            <div className="flex items-center justify-between space-x-2 border p-2.5 rounded-lg bg-gray-50 h-10">
              <div className="flex items-center gap-2">
                <Crown
                  className={`h-4 w-4 ${
                    newStudent.isLeader
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-400"
                  }`}
                />
                <Label
                  htmlFor="is-leader"
                  className="cursor-pointer text-sm font-medium"
                >
                  Nhóm trưởng?
                </Label>
              </div>
              <Switch
                id="is-leader"
                checked={newStudent.isLeader}
                onCheckedChange={(checked) =>
                  setNewStudent({ ...newStudent, isLeader: checked })
                }
                disabled={isPending}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Hủy
          </Button>
          <Button
            className="bg-[#F27124] hover:bg-[#d65d1b]"
            onClick={handleAdd}
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
