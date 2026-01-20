"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge"; // Import Badge
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, X, Plus, Users, UserCheck } from "lucide-react"; // Import Icons
import { toast } from "sonner";
import { CouncilSession } from "./council-types";

// --- MOCK DATA ---
const mockLecturers = [
  { id: "gv1", name: "Thầy Nguyễn Văn A", email: "anv@fpt.edu.vn" },
  { id: "gv2", name: "Cô Lê Thị B", email: "blt@fpt.edu.vn" },
  { id: "gv3", name: "Thầy Trần C", email: "ct@fpt.edu.vn" },
  { id: "gv4", name: "Cô Phạm D", email: "dpt@fpt.edu.vn" },
  { id: "gv5", name: "Thầy Ngô E", email: "eng@fpt.edu.vn" },
];

const mockTeams = [
  { id: "team1", name: "Team SE1740 (SWP391)", topic: "E-commerce" },
  { id: "team2", name: "Team AI1801 (PRN231)", topic: "Face ID" },
  { id: "team3", name: "Team JS_Pro (SWR302)", topic: "LMS System" },
  { id: "team4", name: "Team Vision (IOT102)", topic: "Smart Garden" },
  { id: "team5", name: "Team Mobile (PRM392)", topic: "Food App" },
];

// --- ZOD SCHEMA ---
const formSchema = z.object({
  name: z.string().min(5, "Tên hội đồng quá ngắn"),
  room: z.string().min(1, "Vui lòng chọn phòng"),
  date: z.string().min(1, "Vui lòng chọn ngày"),
  time: z.string().min(1, "Vui lòng nhập giờ"),
  presidentId: z.string().min(1, "Cần chọn Chủ tịch"),
  secretaryId: z.string().min(1, "Cần chọn Thư ký"),
  memberId: z.string().min(1, "Cần chọn Ủy viên"),
  teamIds: z.array(z.string()).min(1, "Phải có ít nhất 1 nhóm bảo vệ"),
});

interface CouncilFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: CouncilSession | null;
}

export function CouncilFormDialog({
  open,
  onOpenChange,
  initialData,
}: CouncilFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      room: "",
      date: "",
      time: "",
      presidentId: "",
      secretaryId: "",
      memberId: "",
      teamIds: [] as string[],
    },
  });

  // Watch để hiển thị UI teams
  const selectedTeamIds = watch("teamIds");

  useEffect(() => {
    if (open) {
      if (initialData) {
        // Map dữ liệu cũ vào form (Giả sử logic map)
        reset({
          name: initialData.name,
          room: initialData.room,
          date: initialData.date,
          time: initialData.time,
          // Mock mapping members (Thực tế bạn map theo ID)
          presidentId: "gv1",
          secretaryId: "gv2",
          memberId: "gv3",
          teamIds: ["team1", "team2"],
        });
      } else {
        reset({
          name: "",
          room: "",
          date: "",
          time: "",
          presidentId: "",
          secretaryId: "",
          memberId: "",
          teamIds: [],
        });
      }
    }
  }, [open, initialData, reset]);

  // Logic thêm/xóa nhóm
  const handleAddTeam = (teamId: string) => {
    if (!selectedTeamIds.includes(teamId)) {
      setValue("teamIds", [...selectedTeamIds, teamId], {
        shouldValidate: true,
      });
    }
  };

  const handleRemoveTeam = (teamId: string) => {
    setValue(
      "teamIds",
      selectedTeamIds.filter((id) => id !== teamId),
      { shouldValidate: true },
    );
  };

  const onSubmit = async (data: any) => {
    // Validate logic nghiệp vụ: 3 người trong hội đồng không được trùng nhau
    if (
      new Set([data.presidentId, data.secretaryId, data.memberId]).size !== 3
    ) {
      toast.error("Thành viên hội đồng không được trùng nhau!");
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Submit Data:", data);
    toast.success(
      isEdit ? "Cập nhật hội đồng thành công!" : "Đã tạo hội đồng mới!",
    );
    setIsLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Chỉnh sửa Hội đồng" : "Tạo Hội đồng mới"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-2">
          {/* SECTION 1: THÔNG TIN CHUNG */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide border-b pb-1">
              Thông tin chung
            </h4>
            <div className="space-y-2">
              <Label>Tên Hội đồng</Label>
              <Input
                {...register("name")}
                placeholder="VD: Hội đồng SE - K17 (Sáng 25/04)"
                className="rounded-xl"
              />
              {errors.name && (
                <span className="text-xs text-red-500">
                  {String(errors.name.message)}
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2 col-span-1">
                <Label>Ngày bảo vệ</Label>
                <Input
                  type="date"
                  {...register("date")}
                  className="rounded-xl"
                />
                {errors.date && (
                  <span className="text-xs text-red-500">
                    {String(errors.date.message)}
                  </span>
                )}
              </div>
              <div className="space-y-2 col-span-1">
                <Label>Giờ</Label>
                <Input
                  {...register("time")}
                  placeholder="08:00 - 12:00"
                  className="rounded-xl"
                />
                {errors.time && (
                  <span className="text-xs text-red-500">
                    {String(errors.time.message)}
                  </span>
                )}
              </div>
              <div className="space-y-2 col-span-1">
                <Label>Phòng</Label>
                <Select
                  onValueChange={(val) => setValue("room", val)}
                  defaultValue={watch("room")}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Chọn phòng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AL-301">Alpha - 301</SelectItem>
                    <SelectItem value="BE-205">Beta - 205</SelectItem>
                    <SelectItem value="GA-102">Gamma - 102</SelectItem>
                  </SelectContent>
                </Select>
                {errors.room && (
                  <span className="text-xs text-red-500">
                    {String(errors.room.message)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 2: THÀNH VIÊN HỘI ĐỒNG */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide border-b pb-1 flex items-center gap-2">
              <UserCheck className="h-4 w-4" /> Thành viên Hội đồng
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Chủ tịch */}
              <div className="space-y-2">
                <Label className="text-blue-600 font-medium">Chủ tịch</Label>
                <Select
                  onValueChange={(val) => setValue("presidentId", val)}
                  defaultValue={watch("presidentId")}
                >
                  <SelectTrigger className="rounded-xl border-blue-200 focus:ring-blue-200">
                    <SelectValue placeholder="Chọn Chủ tịch" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockLecturers.map((lec) => (
                      <SelectItem key={lec.id} value={lec.id}>
                        {lec.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.presidentId && (
                  <span className="text-xs text-red-500">Bắt buộc</span>
                )}
              </div>

              {/* Thư ký */}
              <div className="space-y-2">
                <Label className="text-green-600 font-medium">Thư ký</Label>
                <Select
                  onValueChange={(val) => setValue("secretaryId", val)}
                  defaultValue={watch("secretaryId")}
                >
                  <SelectTrigger className="rounded-xl border-green-200 focus:ring-green-200">
                    <SelectValue placeholder="Chọn Thư ký" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockLecturers.map((lec) => (
                      <SelectItem key={lec.id} value={lec.id}>
                        {lec.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.secretaryId && (
                  <span className="text-xs text-red-500">Bắt buộc</span>
                )}
              </div>

              {/* Ủy viên */}
              <div className="space-y-2">
                <Label className="text-gray-600 font-medium">Ủy viên</Label>
                <Select
                  onValueChange={(val) => setValue("memberId", val)}
                  defaultValue={watch("memberId")}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Chọn Ủy viên" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockLecturers.map((lec) => (
                      <SelectItem key={lec.id} value={lec.id}>
                        {lec.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.memberId && (
                  <span className="text-xs text-red-500">Bắt buộc</span>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 3: DANH SÁCH NHÓM */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide border-b pb-1 flex items-center gap-2">
              <Users className="h-4 w-4" /> Danh sách Nhóm bảo vệ
            </h4>

            <div className="space-y-3">
              {/* Chọn nhóm */}
              <div className="flex gap-2">
                <Select onValueChange={handleAddTeam}>
                  <SelectTrigger className="rounded-xl h-10">
                    <SelectValue placeholder="Thêm nhóm vào hội đồng này..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockTeams.map((team) => (
                      <SelectItem
                        key={team.id}
                        value={team.id}
                        disabled={selectedTeamIds.includes(team.id)} // Disable nếu đã chọn
                      >
                        <span className="font-medium">{team.name}</span>
                        <span className="text-muted-foreground ml-2 text-xs">
                          - {team.topic}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Hiển thị danh sách đã chọn */}
              <div className="flex flex-wrap gap-2 min-h-[40px] p-3 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
                {selectedTeamIds.length === 0 && (
                  <p className="text-sm text-muted-foreground w-full text-center py-1">
                    Chưa có nhóm nào được chọn.
                  </p>
                )}
                {selectedTeamIds.map((id) => {
                  const team = mockTeams.find((t) => t.id === id);
                  return (
                    <Badge
                      key={id}
                      variant="secondary"
                      className="pl-2 pr-1 py-1 h-7 bg-white border shadow-sm flex items-center gap-1"
                    >
                      {team?.name}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1 rounded-full hover:bg-red-100 hover:text-red-600"
                        onClick={() => handleRemoveTeam(id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  );
                })}
              </div>
              {errors.teamIds && (
                <span className="text-xs text-red-500">
                  {String(errors.teamIds.message)}
                </span>
              )}
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="rounded-xl"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="bg-[#F27124] hover:bg-[#d65d1b] rounded-xl min-w-[120px]"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : isEdit ? (
                "Lưu thay đổi"
              ) : (
                "Tạo Hội đồng"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
