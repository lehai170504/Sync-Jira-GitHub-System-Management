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
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2 } from "lucide-react";
import { useCreateAssignment } from "@/features/lecturer/hooks/use-assignments";

interface CreateAssignmentDialogProps {
  classId?: string;
}

export function CreateAssignmentDialog({
  classId,
}: CreateAssignmentDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutate: createAssignment, isPending } = useCreateAssignment();

  const [formData, setFormData] = useState({
    title: "",
    type: "ASSIGNMENT", // Mặc định là Assignment
    deadline: "",
    description: "",
    resources: "",
  });

  const handleSave = () => {
    if (!classId) return;

    createAssignment(
      {
        classId,
        title: formData.title,
        type: formData.type as any,
        deadline: new Date(formData.deadline).toISOString(),
        description: formData.description,
        resources: formData.resources
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      },
      {
        onSuccess: () => {
          setOpen(false);
          setFormData({
            title: "",
            type: "ASSIGNMENT",
            deadline: "",
            description: "",
            resources: "",
          });
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#F27124] hover:bg-[#d65d1b] shadow-lg shadow-orange-500/20 rounded-full px-6 text-white">
          <Plus className="mr-2 h-4 w-4" /> Tạo bài mới
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Tạo bài tập mới</DialogTitle>
          <DialogDescription>
            Thiết lập thông tin bài tập (Assignment) hoặc bài thực hành (Lab).
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label>Tên bài tập</Label>
            <Input
              placeholder="VD: Lab 1 - Java Basics"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Loại bài tập</Label>
              {/* 👇 SELECT ĐÃ CHỈNH SỬA */}
              <Select
                value={formData.type}
                onValueChange={(v) => setFormData({ ...formData, type: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ASSIGNMENT">Assignment</SelectItem>
                  <SelectItem value="LAB">Lab</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Hạn nộp (Deadline)</Label>
              <Input
                type="datetime-local"
                value={formData.deadline}
                onChange={(e) =>
                  setFormData({ ...formData, deadline: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Mô tả / Yêu cầu</Label>
            <Textarea
              placeholder="Nhập hướng dẫn làm bài..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="grid gap-2">
            <Label>Tài liệu đính kèm (Link)</Label>
            <Input
              placeholder="Link 1, Link 2 (cách nhau bởi dấu phẩy)"
              value={formData.resources}
              onChange={(e) =>
                setFormData({ ...formData, resources: e.target.value })
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button
            className="bg-[#F27124] hover:bg-[#d65d1b] text-white"
            onClick={handleSave}
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Tạo bài tập
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
