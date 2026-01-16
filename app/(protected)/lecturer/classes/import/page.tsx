import { ClassImportForm } from "@/components/features/classes/class-import-form";
import { Separator } from "@/components/ui/separator";
import { FileSpreadsheet } from "lucide-react";

export default function ImportClassPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto py-8 px-4 md:px-0">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <FileSpreadsheet className="h-8 w-8 text-[#F27124]" />
          Import Lớp Học
        </h2>
        <p className="text-muted-foreground">
          Tạo hàng loạt lớp học và thêm sinh viên bằng cách upload file Excel.
        </p>
      </div>
      <Separator />

      <ClassImportForm />
    </div>
  );
}
