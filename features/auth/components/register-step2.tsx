import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Loader2,
  Lock,
  User,
  KeyRound,
  ArrowLeft,
  Badge,
  Link as LinkIcon,
  Image as ImageIcon,
} from "lucide-react";
import { RegisterFormData } from "../types";

interface RegisterStep2Props {
  formData: RegisterFormData;
  isLoading: boolean;
  onUpdate: (field: keyof RegisterFormData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

export function RegisterStep2({
  formData,
  isLoading,
  onUpdate,
  onSubmit,
  onBack,
}: RegisterStep2Props) {
  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300"
    >
      {/* OTP Input */}
      <div className="space-y-2">
        <Label htmlFor="otp">Mã OTP (6 số)</Label>
        <div className="relative">
          <Input
            id="otp"
            placeholder="123456"
            value={formData.otp}
            onChange={(e) => onUpdate("otp", e.target.value)}
            className="pl-10 h-11 tracking-widest font-bold"
            maxLength={6}
            required
          />
          <div className="absolute left-3 top-3 text-slate-400">
            <KeyRound className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Role Selection */}
        <div className="space-y-2">
          <Label>Vai trò</Label>
          <Select
            value={formData.role}
            onValueChange={(val) => onUpdate("role", val)}
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Chọn vai trò" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="STUDENT">Sinh viên</SelectItem>
              <SelectItem value="LECTURER">Giảng viên</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Student/Lecturer Code */}
        <div className="space-y-2">
          <Label htmlFor="code">Mã số (MSSV/CB)</Label>
          <div className="relative">
            <Input
              id="code"
              placeholder="SE123456"
              value={formData.studentCode}
              onChange={(e) => onUpdate("studentCode", e.target.value)}
              className="pl-10 h-11 uppercase"
              required
            />
            <div className="absolute left-3 top-3 text-slate-400">
              <Badge className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Full Name */}
      <div className="space-y-2">
        <Label htmlFor="fullname">Họ và tên</Label>
        <div className="relative">
          <Input
            id="fullname"
            placeholder="Nguyễn Văn A"
            value={formData.fullName}
            onChange={(e) => onUpdate("fullName", e.target.value)}
            className="pl-10 h-11"
            required
          />
          <div className="absolute left-3 top-3 text-slate-400">
            <User className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Avatar URL Input */}
      <div className="space-y-2">
        <Label htmlFor="avatar">Link ảnh đại diện (Tùy chọn)</Label>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Input
              id="avatar"
              placeholder="https://example.com/avatar.jpg"
              value={formData.avatarUrl}
              onChange={(e) => onUpdate("avatarUrl", e.target.value)}
              className="pl-10 h-11"
            />
            <div className="absolute left-3 top-3 text-slate-400">
              <LinkIcon className="h-5 w-5" />
            </div>
          </div>
          {/* Preview Avatar */}
          <Avatar className="h-11 w-11 border border-slate-200">
            <AvatarImage src={formData.avatarUrl} alt="Preview" />
            <AvatarFallback className="bg-slate-100">
              <ImageIcon className="h-5 w-5 text-slate-400" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Password Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="password">Mật khẩu</Label>
          <div className="relative">
            <Input
              id="password"
              type="password"
              placeholder="••••••"
              value={formData.password}
              onChange={(e) => onUpdate("password", e.target.value)}
              className="pl-10 h-11"
              required
            />
            <div className="absolute left-3 top-3 text-slate-400">
              <Lock className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">Nhập lại</Label>
          <Input
            id="confirm"
            type="password"
            placeholder="••••••"
            value={formData.confirmPassword}
            onChange={(e) => onUpdate("confirmPassword", e.target.value)}
            className="h-11"
            required
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-none h-12 w-12 p-0 rounded-xl"
        >
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 h-12 text-base font-bold bg-[#F27124] hover:bg-[#d65d1b]"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            "Hoàn tất đăng ký"
          )}
        </Button>
      </div>
    </form>
  );
}
