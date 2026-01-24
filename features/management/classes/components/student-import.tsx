"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, UploadCloud, Loader2 } from "lucide-react"; // Thêm icon Loader2
import { toast } from "sonner";
import * as XLSX from "xlsx";

// 1. Import Hook và Type đã tạo
import { useImportStudents } from "@/features/management/classes/hooks/use-classes";
import { ImportStudentDto } from "@/features/management/classes/types";

interface StudentImportProps {
  classId: string; // 👇 Cần classId để gọi API
  onSuccess?: () => void; // Callback khi import thành công (để reload lại danh sách cha)
}

export function StudentImport({ classId, onSuccess }: StudentImportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 2. Sử dụng Hook Mutation
  const { mutate: importStudents, isPending: isImporting } =
    useImportStudents();

  // --- Tải File Mẫu (Giữ nguyên) ---
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

  // --- Xử lý Upload & Call API ---
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset input để cho phép chọn lại cùng 1 file nếu muốn
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

      // 3. Map dữ liệu Excel -> API Payload (ImportStudentDto)
      const formattedStudents: ImportStudentDto[] = jsonData.map((row: any) => {
        // Xử lý Group (chấp nhận cả số "1" hoặc chuỗi "Team 1")
        let groupVal = row["Group"] || row["Group "]; // Handle lỡ có khoảng trắng

        // Xử lý Leader (chấp nhận "x", "X", "yes", "true")
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

      // Validate sơ bộ (nếu cần)
      const validStudents = formattedStudents.filter(
        (s) => s.Email && s.RollNumber,
      );
      if (validStudents.length === 0) {
        toast.error(
          "Không tìm thấy dữ liệu hợp lệ (Cần có Email và RollNumber)",
        );
        return;
      }

      // 4. Gọi API Import
      importStudents(
        {
          classId: classId,
          students: validStudents,
        },
        {
          onSuccess: () => {
            if (onSuccess) onSuccess(); // Báo cho cha biết để reload list
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

      {/* Nút tải Template */}
      <Button
        variant="ghost"
        onClick={handleDownloadTemplate}
        disabled={isImporting}
        className="text-gray-600 hover:text-[#F27124] hover:bg-orange-50 border border-dashed border-gray-300"
      >
        <Download className="mr-2 h-4 w-4" /> File Mẫu
      </Button>

      {/* Nút Import */}
      <Button
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={isImporting}
        className="bg-white hover:bg-gray-50 border-gray-200 text-gray-700 shadow-sm min-w-[140px]"
      >
        {isImporting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin text-[#F27124]" />
        ) : (
          <UploadCloud className="mr-2 h-4 w-4 text-green-600" />
        )}
        {isImporting ? "Đang xử lý..." : "Import Excel"}
      </Button>
    </div>
  );
}
