"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, UploadCloud, Loader2 } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";

import { useImportStudents } from "@/features/management/classes/hooks/use-classes";
import { ImportStudentDto } from "@/features/management/classes/types/class-types";

interface StudentImportProps {
  classId: string;
  onSuccess?: () => void;
}

export function StudentImport({ classId, onSuccess }: StudentImportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: importStudents, isPending: isImporting } =
    useImportStudents();

  const handleDownloadTemplate = () => {
    // ... logic (giữ nguyên)
    const templateData = [
      {
        Class: "SE1943",
        RollNumber: "CE190585",
        Email: "minhlq.ce190585@gmail.com",
        MemberCode: "MinhLQCE190585",
        FullName: "Lâm Quốc Minh",
        Group: 1,
        Leader: "x",
      },
      {
        Class: "SE1943",
        RollNumber: "DE191059",
        Email: "trankhanhduong@gmail.com",
        MemberCode: "DuongTKDE191059",
        FullName: "Trần Khánh Dương",
        Group: 1,
        Leader: "",
      },
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    ws["!cols"] = [
      { wch: 10 },
      { wch: 15 },
      { wch: 35 },
      { wch: 20 },
      { wch: 25 },
      { wch: 8 },
      { wch: 8 },
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Danh_Sach_SV");
    XLSX.writeFile(wb, "Template_Import_SinhVien.xlsx");
    toast.success("Đã tải xuống file mẫu!");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    // ... logic (giữ nguyên)
    const file = event.target.files?.[0];
    if (!file) return;

    if (fileInputRef.current) fileInputRef.current.value = "";

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      if (jsonData.length === 0) {
        toast.error("File Excel trống!");
        return;
      }

      const formattedStudents: ImportStudentDto[] = jsonData.map((row: any) => {
        let groupVal = row["Group"] || row["Group "];
        const leaderVal = row["Leader"]
          ? row["Leader"].toString().toLowerCase()
          : "";
        const isLeader = ["x", "yes", "true", "1"].includes(leaderVal)
          ? "x"
          : "";

        return {
          Class: row["Class"] || "",
          RollNumber: row["RollNumber"] || row["MSSV"] || "",
          Email: row["Email"] || "",
          MemberCode: row["MemberCode"] || "",
          FullName: row["FullName"] || row["Họ tên"] || "",
          Group: groupVal,
          Leader: isLeader,
        };
      });

      const validStudents = formattedStudents.filter(
        (s) => s.Email && s.RollNumber,
      );
      if (validStudents.length === 0) {
        toast.error(
          "Không tìm thấy dữ liệu hợp lệ (Cần có Email và RollNumber)",
        );
        return;
      }

      importStudents(
        {
          classId: classId,
          students: validStudents,
        },
        {
          onSuccess: () => {
            if (onSuccess) onSuccess();
          },
        },
      );
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="flex gap-2">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
      />

      <Button
        variant="ghost"
        onClick={handleDownloadTemplate}
        disabled={isImporting}
        className="text-slate-600 dark:text-slate-300 hover:text-[#F27124] dark:hover:text-[#F27124] hover:bg-orange-50 dark:hover:bg-orange-900/10 border border-dashed border-slate-300 dark:border-slate-700"
      >
        <Download className="mr-2 h-4 w-4" /> File Mẫu
      </Button>

      <Button
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={isImporting}
        className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 shadow-sm min-w-[140px]"
      >
        {isImporting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin text-[#F27124]" />
        ) : (
          <UploadCloud className="mr-2 h-4 w-4 text-green-600 dark:text-green-500" />
        )}
        {isImporting ? "Đang xử lý..." : "Import Excel"}
      </Button>
    </div>
  );
}
