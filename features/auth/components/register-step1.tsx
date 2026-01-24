import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight, Mail } from "lucide-react";

interface RegisterStep1Props {
  email: string;
  isLoading: boolean;
  onEmailChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function RegisterStep1({
  email,
  isLoading,
  onEmailChange,
  onSubmit,
}: RegisterStep1Props) {
  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300"
    >
      <div className="space-y-2">
        <Label htmlFor="email">Email đăng ký</Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            disabled={isLoading}
            className="pl-10 h-11"
            required
          />
          <div className="absolute left-3 top-3 text-slate-400">
            <Mail className="h-5 w-5" />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 text-base font-bold bg-[#F27124] hover:bg-[#d65d1b]"
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          "Gửi mã xác thực"
        )}
        {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
      </Button>
    </form>
  );
}
