import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  PlayCircle,
  LucideIcon
} from "lucide-react";

export type StatusType = 
  | "ACTIVE" | "INACTIVE" | "PENDING" | "COMPLETED" | "FAILED" | "IN_PROGRESS"
  | "TODO" | "IN PROGRESS" | "DONE" | "SUCCESS" | "WARNING" | "DRAFT";

interface StatusConfig {
  label: string;
  className: string;
  icon: LucideIcon;
}

const statusMap: Record<string, StatusConfig> = {
  ACTIVE: { label: "Hoạt động", className: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50", icon: CheckCircle2 },
  SUCCESS: { label: "Thành công", className: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50", icon: CheckCircle2 },
  DONE: { label: "Hoàn thành", className: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50", icon: CheckCircle2 },
  COMPLETED: { label: "Đã hoàn thành", className: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50", icon: CheckCircle2 },
  
  INACTIVE: { label: "Ngừng hoạt động", className: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700", icon: XCircle },
  DRAFT: { label: "Bản nháp", className: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700", icon: Clock },
  TODO: { label: "Cần làm", className: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700", icon: Clock },
  
  PENDING: { label: "Đang chờ", className: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50", icon: Clock },
  WARNING: { label: "Cảnh báo", className: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50", icon: AlertCircle },
  
  IN_PROGRESS: { label: "Đang xử lý", className: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50", icon: PlayCircle },
  "IN PROGRESS": { label: "Đang tiến hành", className: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50", icon: PlayCircle },
  
  FAILED: { label: "Thất bại", className: "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/50", icon: AlertCircle },
};

export function getStatusConfig(status: string | StatusType): StatusConfig {
  const normalizedStatus = status?.toUpperCase().trim() || "";
  return statusMap[normalizedStatus] || {
    label: status || "Không rõ",
    className: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
    icon: Clock
  };
}

interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: string | StatusType;
  showIcon?: boolean;
}

export function StatusBadge({ status, showIcon = true, className, ...props }: StatusBadgeProps) {
  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge 
      variant="outline" 
      className={cn("font-medium transition-colors border", config.className, className)}
      {...props}
    >
      {showIcon && <Icon className="w-3 h-3 mr-1.5" />}
      {config.label}
    </Badge>
  );
}
