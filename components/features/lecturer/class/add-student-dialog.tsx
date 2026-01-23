"use client";

import { useState } from "react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, Mail, User, Hash, Layers } from "lucide-react";
import { toast } from "sonner";

interface AddStudentDialogProps {
  onAdd: (student: any) => void;
}

export function AddStudentDialog({ onAdd }: AddStudentDialogProps) {
  const [open, setOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    code: "",
    email: "",
    group: "null",
  });

  const handleAdd = () => {
    if (!newStudent.name || !newStudent.code || !newStudent.email) {
      toast.error("Vui lòng nhập đủ thông tin!");
      return;
    }
    const studentToAdd = {
      id: Math.random().toString(36).substr(2, 9),
      ...newStudent,
      group: newStudent.group === "null" ? null : newStudent.group,
      isLeader: false,
    };
    onAdd(studentToAdd);
    setOpen(false);
    setNewStudent({ name: "", code: "", email: "", group: "null" });
    toast.success("Đã thêm sinh viên thành công");
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
            Nhập thông tin sinh viên thủ công.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Form Inputs (Giữ nguyên logic cũ nhưng gọn hơn) */}
          <div className="grid grid-cols-2 gap-4">
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
                />
              </div>
            </div>
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
                />
              </div>
            </div>
          </div>
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
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Nhóm</Label>
            <div className="relative">
              <Layers className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 z-10" />
              <Select
                value={newStudent.group}
                onValueChange={(val) =>
                  setNewStudent({ ...newStudent, group: val })
                }
              >
                <SelectTrigger className="pl-9">
                  <SelectValue placeholder="Chọn nhóm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="null">Chưa có nhóm</SelectItem>
                  <SelectItem value="Team 1">Team 1</SelectItem>
                  <SelectItem value="Team 2">Team 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button
            className="bg-[#F27124] hover:bg-[#d65d1b]"
            onClick={handleAdd}
          >
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
