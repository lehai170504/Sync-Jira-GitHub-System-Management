"use client";

import { useEffect, useState } from "react";
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
import { Loader2 } from "lucide-react"; // Import icon xoay

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
  const [isLoading, setIsLoading] = useState(false);

  // State để quản lý dữ liệu nhập vào
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    manager: "",
  });

  // Reset form khi mở dialog hoặc thay đổi mode/defaultValues
  useEffect(() => {
    if (open) {
      setFormData({
        code: defaultValues?.code || "",
        name: defaultValues?.name || "",
        manager: defaultValues?.manager || "",
      });
    }
  }, [open, defaultValues, mode]);

  const handleSubmit = async () => {
    // Validate cơ bản (ví dụ)
    if (!formData.code || !formData.name) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      setIsLoading(true);

      // Giả lập gọi API (delay 1.5s)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success(
        mode === "create"
          ? "Đã tạo môn học thành công!"
          : "Đã cập nhật thông tin!",
      );
      onOpenChange(false);
    } catch (error) {
      toast.error("Đã có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl gap-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            {mode === "create" ? "Tạo Môn học mới" : "Chỉnh sửa Môn học"}
          </DialogTitle>
          <DialogDescription className="text-base">
            {mode === "create"
              ? "Nhập thông tin môn học để quản lý đồ án."
              : "Cập nhật thông tin chi tiết cho môn học này."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5">
          {/* MÃ MÔN */}
          <div className="grid gap-2">
            <Label htmlFor="code" className="font-medium text-gray-700">
              Mã môn (Course Code)
            </Label>
            <Input
              id="code"
              placeholder="Ví dụ: SWP391"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
              className="h-11 rounded-xl border-gray-200 focus:border-[#F27124] focus:ring-[#F27124]/20 transition-all"
            />
          </div>

          {/* TÊN MÔN */}
          <div className="grid gap-2">
            <Label htmlFor="name" className="font-medium text-gray-700">
              Tên môn học
            </Label>
            <Input
              id="name"
              placeholder="Đồ án tốt nghiệp..."
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="h-11 rounded-xl border-gray-200 focus:border-[#F27124] focus:ring-[#F27124]/20 transition-all"
            />
          </div>

          {/* TRƯỞNG BỘ MÔN */}
          <div className="grid gap-2">
            <Label htmlFor="manager" className="font-medium text-gray-700">
              Trưởng bộ môn (Email)
            </Label>
            <Input
              id="manager"
              placeholder="gv_bomon@fpt.edu.vn"
              value={formData.manager}
              onChange={(e) =>
                setFormData({ ...formData, manager: e.target.value })
              }
              className="h-11 rounded-xl border-gray-200 focus:border-[#F27124] focus:ring-[#F27124]/20 transition-all"
            />
          </div>
        </div>

        <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
          {/* Nút Hủy - UX tốt hơn */}
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="rounded-xl h-11 text-muted-foreground hover:text-gray-900"
          >
            Hủy bỏ
          </Button>

          {/* Nút Submit */}
          <Button
            className="bg-[#F27124] hover:bg-[#d65d1b] rounded-xl h-11 px-8 shadow-lg shadow-orange-500/20 font-semibold min-w-[140px]"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xử lý...
              </>
            ) : mode === "create" ? (
              "Xác nhận tạo"
            ) : (
              "Lưu thay đổi"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
