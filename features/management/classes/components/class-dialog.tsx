"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// Hooks
import { useCreateClass } from "../hooks/use-classes";
import { useSemesters } from "@/features/management/semesters/hooks/use-semesters";
import { useUsers } from "@/features/management/users/hooks/use-users";

interface ClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClassDialog({ open, onOpenChange }: ClassDialogProps) {
  // Hooks Data (Lấy danh sách để chọn)
  const { data: semesters } = useSemesters();
  const { data: lecturersData } = useUsers({ role: "LECTURER", limit: 100 }); // Lấy list giảng viên
  const lecturers = lecturersData?.users || [];

  // Hook Create
  const { mutate: createClass, isPending } = useCreateClass();

  const [formData, setFormData] = useState({
    name: "",
    semester_id: "",
    lecturer_id: "",
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.semester_id || !formData.lecturer_id) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    createClass(formData, {
      onSuccess: () => {
        onOpenChange(false);
        setFormData({ name: "", semester_id: "", lecturer_id: "" });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl gap-6">
        <DialogHeader>
          <DialogTitle>Tạo Lớp học mới</DialogTitle>
        </DialogHeader>

        <div className="grid gap-5">
          {/* TÊN LỚP */}
          <div className="grid gap-2">
            <Label>Tên lớp học</Label>
            <Input
              placeholder="VD: Software Engineering Project"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          {/* CHỌN HỌC KỲ */}
          <div className="grid gap-2">
            <Label>Học kỳ</Label>
            <Select
              value={formData.semester_id}
              onValueChange={(val) =>
                setFormData({ ...formData, semester_id: val })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn học kỳ" />
              </SelectTrigger>
              <SelectContent>
                {semesters?.map((sem) => (
                  <SelectItem key={sem._id} value={sem._id}>
                    {sem.name} ({sem.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* CHỌN GIẢNG VIÊN */}
          <div className="grid gap-2">
            <Label>Giảng viên phụ trách</Label>
            <Select
              value={formData.lecturer_id}
              onValueChange={(val) =>
                setFormData({ ...formData, lecturer_id: val })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn giảng viên" />
              </SelectTrigger>
              <SelectContent>
                {lecturers.map((lec) => (
                  <SelectItem key={lec._id} value={lec._id}>
                    {lec.full_name} ({lec.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Hủy bỏ
          </Button>
          <Button
            className="bg-[#F27124] hover:bg-[#d65d1b] text-white"
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Tạo lớp học"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
