"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

// Import Hook & Types
import { useCreateUser } from "../hooks/use-users";
import { UserRole } from "../types";

export function CreateUserModal() {
  const [open, setOpen] = useState(false);
  const { mutate: createUser, isPending } = useCreateUser();

  // Form State
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    role: "" as UserRole | "", // Để trống ban đầu để bắt buộc chọn
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validation cơ bản
    if (
      !formData.full_name.trim() ||
      !formData.email.trim() ||
      !formData.role
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    // 2. Gọi API
    createUser(
      {
        full_name: formData.full_name,
        email: formData.email,
        role: formData.role as UserRole,
      },
      {
        onSuccess: () => {
          // 3. Reset form và đóng modal khi thành công
          setOpen(false);
          setFormData({ full_name: "", email: "", role: "" });
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#F27124] hover:bg-[#d65d1b] text-white">
          <Plus className="mr-2 h-4 w-4" /> Thêm người dùng
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Thêm người dùng mới</DialogTitle>
            <DialogDescription>
              Tạo tài khoản mới cho Giảng viên hoặc Sinh viên vào hệ thống.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Họ và tên */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="full_name" className="text-right">
                Họ tên <span className="text-red-500">*</span>
              </Label>
              <Input
                id="full_name"
                placeholder="Nguyễn Văn A"
                className="col-span-3"
                value={formData.full_name}
                onChange={(e) => handleInputChange("full_name", e.target.value)}
                disabled={isPending}
              />
            </div>

            {/* Email */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="example@fpt.edu.vn"
                className="col-span-3"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={isPending}
              />
            </div>

            {/* Vai trò */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Vai trò <span className="text-red-500">*</span>
              </Label>
              <div className="col-span-3">
                <Select
                  value={formData.role}
                  onValueChange={(val) => handleInputChange("role", val)}
                  disabled={isPending}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LECTURER">
                      Giảng viên (Lecturer)
                    </SelectItem>
                    <SelectItem value="ADMIN">Quản trị viên (Admin)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
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
              className="bg-[#F27124] hover:bg-[#d65d1b] text-white min-w-[100px]"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Lưu...
                </>
              ) : (
                "Tạo mới"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
