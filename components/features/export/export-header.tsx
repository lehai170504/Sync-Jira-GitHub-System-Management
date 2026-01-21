import { Download } from "lucide-react";

export function ExportHeader() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gradient-to-br from-[#F27124] to-orange-600 rounded-xl shadow-lg">
          <Download className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-[#F27124] to-orange-600 bg-clip-text text-transparent">
            Xuất báo cáo
          </h2>
          <p className="text-muted-foreground mt-1">
            Tạo và tải xuống các báo cáo Excel và Word cho nhóm của bạn
          </p>
        </div>
      </div>
    </div>
  );
}

