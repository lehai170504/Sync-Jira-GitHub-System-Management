"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";

interface StudentImportProps {
  onImport: (students: any[]) => void;
}

export function StudentImport({ onImport }: StudentImportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Tải File Mẫu
  const handleDownloadTemplate = () => {
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
      {
        Class: "SE1943",
        RollNumber: "SE140413",
        Email: "TruongPNSE140413@fpt.edu.vn",
        MemberCode: "truongpnse140413",
        FullName: "Phan Nhật Trường",
        Group: 2,
        Leader: "x",
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

  // 2. Xử lý Import
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

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

      const importedStudents = jsonData.map((row: any, index) => {
        let groupName = null;
        if (row["Group"] || row["Group "]) {
          const gVal = row["Group"] || row["Group "];
          groupName = typeof gVal === "number" ? `Team ${gVal}` : gVal;
        }
        const isLeader =
          row["Leader"] && row["Leader"].toString().toLowerCase() === "x";

        return {
          id: `imported-${Date.now()}-${index}`,
          name: row["FullName"] || row["Họ tên"] || "Unknown",
          code:
            row["RollNumber"] || row["MSSV"] || row["MemberCode"] || "UNKNOWN",
          email: row["Email"] || "",
          group: groupName,
          isLeader: isLeader,
        };
      });

      // Gọi callback để truyền data lên cha (sẽ thay thế data cũ)
      onImport(importedStudents);
      toast.success(
        `Đã import ${importedStudents.length} sinh viên mới (Data cũ đã xóa)!`
      );

      if (fileInputRef.current) fileInputRef.current.value = "";
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
        className="text-gray-600 hover:text-[#F27124] hover:bg-orange-50 border border-dashed border-gray-300"
      >
        <Download className="mr-2 h-4 w-4" /> File Mẫu
      </Button>
      <Button
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        className="bg-white hover:bg-gray-50 border-gray-200 text-gray-700 shadow-sm"
      >
        <UploadCloud className="mr-2 h-4 w-4 text-green-600" /> Import Excel
      </Button>
    </div>
  );
}
