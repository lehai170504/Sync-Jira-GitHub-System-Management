"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Download,
  UploadCloud,
  Save,
  Trash2,
  FileSpreadsheet,
  Loader2,
} from "lucide-react";
import { importClassData } from "@/server/actions/class-actions";

// Định nghĩa kiểu dữ liệu theo yêu cầu
type StudentRow = {
  Class: string;
  RollNumber: string;
  Email: string;
  MemberCode: string;
  FullName: string;
};

export function ClassImportForm() {
  const [data, setData] = useState<StudentRow[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");

  // 1. HÀM TẠO FILE TEMPLATE EXCEL
  const handleDownloadTemplate = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("DanhSachLop");

    // Định nghĩa Header
    worksheet.columns = [
      { header: "Class", key: "Class", width: 15 },
      { header: "RollNumber", key: "RollNumber", width: 15 },
      { header: "Email", key: "Email", width: 30 },
      { header: "MemberCode", key: "MemberCode", width: 20 },
      { header: "FullName", key: "FullName", width: 25 },
    ];

    // Style Header (Màu cam FPT)
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFF27124" }, // Màu cam
    };

    // Thêm dữ liệu mẫu (Sample Data như yêu cầu)
    const sampleData = [
      {
        Class: "SE1943",
        RollNumber: "CE190585",
        Email: "minhlq.ce190585@gmail.com",
        MemberCode: "MinhLQCE190585",
        FullName: "Lâm Quốc Minh",
      },
      {
        Class: "SE1943",
        RollNumber: "DE191059",
        Email: "duongtk@gmail.com",
        MemberCode: "DuongTKDE191059",
        FullName: "Trần Khánh Dương",
      },
      {
        Class: "SE1943",
        RollNumber: "SE140413",
        Email: "truongpnse140413@fpt.edu.vn",
        MemberCode: "truongpnse140413",
        FullName: "Phan Nhật Trường",
      },
    ];
    worksheet.addRows(sampleData);

    // Xuất file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "Template_Import_SinhVien.xlsx");
    toast.success("Đã tải xuống file mẫu!");
  };

  // 2. HÀM XỬ LÝ ĐỌC FILE UPLOAD
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();

    reader.onload = async (e) => {
      const buffer = e.target?.result;
      if (!buffer) return;

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer as ArrayBuffer);

      const worksheet = workbook.getWorksheet(1); // Lấy sheet đầu tiên
      const parsedData: StudentRow[] = [];

      if (!worksheet) {
        toast.error("File Excel không hợp lệ");
        setIsUploading(false);
        return;
      }

      // Duyệt qua từng dòng (bỏ qua header dòng 1)
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          // ExcelJS dùng index 1-based. Cột 1=Class, 2=RollNum...
          parsedData.push({
            Class: row.getCell(1).text,
            RollNumber: row.getCell(2).text,
            Email: row.getCell(3).text, // Cột Email có thể là hyperlink object, lấy .text cho an toàn
            MemberCode: row.getCell(4).text,
            FullName: row.getCell(5).text,
          });
        }
      });

      setData(parsedData);
      setIsUploading(false);
      toast.success(`Đã đọc ${parsedData.length} dòng dữ liệu.`);
    };

    reader.readAsArrayBuffer(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    multiple: false,
  });

  // 3. HÀM LƯU DỮ LIỆU
  const handleSave = async () => {
    if (!selectedSubject) {
      toast.error("Vui lòng chọn Môn học trước khi lưu.");
      return;
    }

    setIsSaving(true);
    const res = await importClassData(data);
    setIsSaving(false);

    if (res.success) {
      toast.success(res.message);
      setData([]); // Reset table
    } else {
      toast.error(res.error);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. KHU VỰC CẤU HÌNH & DOWNLOAD */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Bước 1: Tải file mẫu</CardTitle>
            <CardDescription>
              Sử dụng template chuẩn để tránh lỗi định dạng.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full border-dashed border-2 hover:border-[#F27124] hover:text-[#F27124]"
              onClick={handleDownloadTemplate}
            >
              <Download className="mr-2 h-4 w-4" /> Tải Template .xlsx
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bước 2: Cấu hình chung</CardTitle>
            <CardDescription>
              Chọn môn học để gán cho danh sách lớp này.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Môn học (Subject)</Label>
              <Select onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn mã môn..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SWP391">
                    SWP391 - Đồ án tốt nghiệp
                  </SelectItem>
                  <SelectItem value="PRN231">PRN231 - Lập trình API</SelectItem>
                  <SelectItem value="SWR302">
                    SWR302 - Kiểm thử phần mềm
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. KHU VỰC UPLOAD (DRAG & DROP) */}
      <Card
        className={`border-2 border-dashed transition-colors ${
          isDragActive ? "border-[#F27124] bg-orange-50" : "border-gray-200"
        }`}
      >
        <div
          {...getRootProps()}
          className="p-10 flex flex-col items-center justify-center cursor-pointer text-center"
        >
          <input {...getInputProps()} />
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <UploadCloud className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">
            {isDragActive
              ? "Thả file vào đây..."
              : "Kéo thả file Excel vào đây"}
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            Hoặc bấm vào để chọn file từ máy tính. (Chỉ hỗ trợ .xlsx)
          </p>
        </div>
      </Card>

      {/* 3. BẢNG PREVIEW DỮ LIỆU */}
      {data.length > 0 && (
        <Card className="animate-in fade-in-50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Dữ liệu xem trước</CardTitle>
              <CardDescription>
                Vui lòng kiểm tra kỹ trước khi bấm Lưu.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => setData([])}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Hủy bỏ
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Lưu vào hệ thống
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border max-h-[400px] overflow-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-secondary">
                  <TableRow>
                    <TableHead>STT</TableHead>
                    <TableHead>Lớp (Class)</TableHead>
                    <TableHead>MSSV</TableHead>
                    <TableHead>Họ và Tên</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Member Code</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{row.Class}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {row.RollNumber}
                      </TableCell>
                      <TableCell>{row.FullName}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {row.Email}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {row.MemberCode}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 text-sm text-muted-foreground text-right">
              Tổng số: <b>{data.length}</b> sinh viên
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
