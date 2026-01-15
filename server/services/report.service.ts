import ExcelJS from "exceljs";

// Mock data: Trong thực tế bạn sẽ query từ Prisma (db.student.findMany...)
const mockScores = [
  {
    id: "SV01",
    name: "Nguyễn Văn An",
    jira: 8.5,
    git: 9.0,
    review: 8.0,
    total: 8.6,
  },
  {
    id: "SV02",
    name: "Trần Thị B",
    jira: 7.0,
    git: 6.5,
    review: 7.5,
    total: 7.0,
  },
  {
    id: "SV03",
    name: "Lê Hoàng C",
    jira: 9.5,
    git: 9.5,
    review: 9.0,
    total: 9.4,
  },
];

export const ReportService = {
  async generateScoreBoard() {
    // 1. Khởi tạo Workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Bang Diem Tong Hop");

    // 2. Định nghĩa cột
    worksheet.columns = [
      { header: "STT", key: "stt", width: 10 },
      { header: "Họ và Tên", key: "name", width: 30 },
      { header: "Điểm Jira (40%)", key: "jira", width: 20 },
      { header: "Điểm GitHub (40%)", key: "git", width: 20 },
      { header: "Review (20%)", key: "review", width: 15 },
      { header: "TỔNG KẾT", key: "total", width: 15 },
    ];

    // 3. Style cho Header (In đậm, nền xám, căn giữa)
    worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF2E75B6" }, // Màu xanh dương
    };
    worksheet.getRow(1).alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    // 4. Đổ dữ liệu
    mockScores.forEach((student, index) => {
      const row = worksheet.addRow({
        stt: index + 1,
        name: student.name,
        jira: student.jira,
        git: student.git,
        review: student.review,
        total: student.total,
      });

      // Highlight sinh viên điểm cao (>9.0)
      if (student.total >= 9.0) {
        row.getCell("total").font = { bold: true, color: { argb: "FF008000" } }; // Màu xanh lá
      }
    });

    // 5. Xuất ra Buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  },
};
