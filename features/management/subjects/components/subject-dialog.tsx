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
import { Loader2 } from "lucide-react";
import { useSubjectMutations } from "../hooks/use-subjects";

interface SubjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubjectDialog({ open, onOpenChange }: SubjectDialogProps) {
  // Chỉ lấy createSubject từ hook
  const { createSubject, isPending } = useSubjectMutations();

  // State form khớp với API POST
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    credits: 0,
  });

  // Reset form mỗi khi mở dialog
  useEffect(() => {
    if (open) {
      setFormData({
        code: "",
        name: "",
        description: "",
        credits: 0,
      });
    }
  }, [open]);

  const handleSubmit = async () => {
    // Validate cơ bản
    if (!formData.code || !formData.name || formData.credits <= 0) {
      return; // Hook hoặc UI library sẽ handle validation UX
    }

    try {
      // Gọi API POST
      await createSubject(formData);

      // Đóng dialog khi thành công
      onOpenChange(false);
    } catch (error) {
      // Error đã được handle trong hook (toast)
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl gap-5">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Tạo Môn học mới
          </DialogTitle>
          <DialogDescription>
            Nhập thông tin môn học (Mã, Tên, Tín chỉ) để thêm vào hệ thống.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            {/* CODE */}
            <div className="space-y-2">
              <Label htmlFor="code">
                Mã môn <span className="text-red-500">*</span>
              </Label>
              <Input
                id="code"
                placeholder="VD: SWR302"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                disabled={isPending}
              />
            </div>

            {/* CREDITS */}
            <div className="space-y-2">
              <Label htmlFor="credits">
                Số tín chỉ <span className="text-red-500">*</span>
              </Label>
              <Input
                id="credits"
                type="number"
                min={0}
                placeholder="3"
                value={formData.credits}
                onChange={(e) =>
                  setFormData({ ...formData, credits: Number(e.target.value) })
                }
                disabled={isPending}
              />
            </div>
          </div>

          {/* NAME */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Tên môn học <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="VD: Software Requirement"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              disabled={isPending}
            />
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Input
              id="description"
              placeholder="Mô tả ngắn gọn về môn học..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              disabled={isPending}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Hủy bỏ
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="bg-[#F27124] hover:bg-[#d65d1b]"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang tạo...
              </>
            ) : (
              "Xác nhận tạo"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
