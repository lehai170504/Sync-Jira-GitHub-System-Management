import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  LucideIcon,
} from "lucide-react";

interface ServiceStatusCardProps {
  title: string;
  icon: LucideIcon;
  status: "idle" | "loading" | "success" | "error";
  lastSync?: string;
  stats?: { label: string; value: string | number }[];
}

export function ServiceStatusCard({
  title,
  icon: Icon,
  status,
  lastSync,
  stats,
}: ServiceStatusCardProps) {
  return (
    <Card
      className={cn(
        "transition-all duration-300",
        status === "loading" && "border-blue-400 shadow-md"
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          {title}
        </CardTitle>
        {status === "loading" && (
          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
        )}
        {status === "success" && (
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        )}
        {status === "error" && <XCircle className="h-4 w-4 text-red-500" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {status === "loading"
            ? "Đang xử lý..."
            : status === "success"
            ? "Hoạt động"
            : "Sẵn sàng"}
        </div>

        {/* Stats Grid */}
        {stats && status !== "loading" && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-slate-50 p-2 rounded border text-xs">
                <div className="text-muted-foreground">{stat.label}</div>
                <div className="font-semibold">{stat.value}</div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center mt-4 text-xs text-muted-foreground">
          <Clock className="mr-1 h-3 w-3" />
          {lastSync
            ? `Cập nhật: ${new Date(lastSync).toLocaleTimeString()}`
            : "Chưa đồng bộ"}
        </div>
      </CardContent>
    </Card>
  );
}
