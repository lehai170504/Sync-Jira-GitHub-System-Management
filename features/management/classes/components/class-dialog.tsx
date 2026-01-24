"use client";

import { useState, useEffect } from "react";
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
import { useSubjects } from "@/features/management/subjects/hooks/use-subjects";

interface ClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClassDialog({ open, onOpenChange }: ClassDialogProps) {
  // 1. Lấy dữ liệu Select options
  const { data: semesters } = useSemesters();
  const { data: lecturersData } = useUsers({ role: "LECTURER", limit: 100 });
  const { data: subjectsData } = useSubjects("Active"); // Lấy môn học đang Active

  const lecturers = lecturersData?.users || [];
  const subjects = subjectsData?.subjects || [];

  // 2. Hook Create
  const { mutate: createClass, isPending } = useCreateClass();

  // 3. Form State
  const [formData, setFormData] = useState({
    name: "",
    semester_id: "",
    lecturer_id: "",
    subject_id: "",
    subjectName: "",
  });

  // Reset form khi mở dialog
  useEffect(() => {
    if (open) {
      setFormData({
        name: "",
        semester_id: "",
        lecturer_id: "",
        subject_id: "",
        subjectName: "",
      });
    }
  }, [open]);

  // Xử lý chọn môn học (Cần lấy cả ID và Name)
  const handleSubjectChange = (subjectId: string) => {
    const selectedSubject = subjects.find((s) => s._id === subjectId);
    if (selectedSubject) {
      setFormData((prev) => ({
        ...prev,
        subject_id: subjectId,
        subjectName: selectedSubject.name,
        // Có thể tự động điền tên lớp gợi ý nếu muốn: prev.name || selectedSubject.code + "_"
      }));
    }
  };

  const handleSubmit = () => {
    // Validate
    if (
      !formData.name ||
      !formData.semester_id ||
      !formData.lecturer_id ||
      !formData.subject_id
    ) {
      toast.warning("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    // Call API
    createClass(formData, {
      onSuccess: () => {
        onOpenChange(false);
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
          {/* 1. CHỌN MÔN HỌC (Quan trọng) */}
          <div className="grid gap-2">
            <Label>
              Môn học <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.subject_id}
              onValueChange={handleSubjectChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn môn học" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((sub) => (
                  <SelectItem key={sub._id} value={sub._id}>
                    {sub.code} - {sub.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 2. TÊN LỚP */}
          <div className="grid gap-2">
            <Label>
              Tên lớp học <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="VD: SE1943-A"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          {/* 3. CHỌN HỌC KỲ */}
          <div className="grid gap-2">
            <Label>
              Học kỳ <span className="text-red-500">*</span>
            </Label>
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

          {/* 4. CHỌN GIẢNG VIÊN */}
          <div className="grid gap-2">
            <Label>
              Giảng viên phụ trách <span className="text-red-500">*</span>
            </Label>
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
