"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface SubjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: "create" | "edit";
  defaultValues?: {
    code: string;
    name: string;
    manager: string;
  };
}

export function SubjectDialog({
  open,
  onOpenChange,
  mode = "create",
  defaultValues,
}: SubjectDialogProps) {
  const handleSubmit = () => {
    // Logic gọi API sẽ ở đây
    toast.success(
      mode === "create"
        ? "Đã tạo môn học thành công!"
        : "Đã cập nhật thông tin!"
    );
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {mode === "create" ? "Tạo Môn học mới" : "Chỉnh sửa Môn học"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Nhập thông tin môn học để quản lý đồ án."
              : "Cập nhật thông tin chi tiết cho môn học này."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-4">
          <div className="grid gap-2">
            <Label className="font-medium text-gray-700">
              Mã môn (Course Code)
            </Label>
            <Input
              placeholder="Ví dụ: SWP391"
              defaultValue={defaultValues?.code}
              className="h-10 rounded-lg focus:border-[#F27124] focus:ring-[#F27124]/20"
            />
          </div>
          <div className="grid gap-2">
            <Label className="font-medium text-gray-700">Tên môn học</Label>
            <Input
              placeholder="Đồ án tốt nghiệp..."
              defaultValue={defaultValues?.name}
              className="h-10 rounded-lg focus:border-[#F27124] focus:ring-[#F27124]/20"
            />
          </div>
          <div className="grid gap-2">
            <Label className="font-medium text-gray-700">
              Trưởng bộ môn (Email)
            </Label>
            <Input
              placeholder="gv_bomon@fpt.edu.vn"
              defaultValue={defaultValues?.manager}
              className="h-10 rounded-lg focus:border-[#F27124] focus:ring-[#F27124]/20"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            className="w-full bg-[#F27124] hover:bg-[#d65d1b] rounded-xl h-11 shadow-md shadow-orange-500/20"
            onClick={handleSubmit}
          >
            {mode === "create" ? "Xác nhận tạo" : "Lưu thay đổi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
