import ExcelJS from "exceljs";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";

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

  async generateWorklog() {
    // Tạo file Word ngắn để test
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: "WORKLOG REPORT - SPRINT 4",
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              text: "",
            }),
            new Paragraph({
              text: `Ngày xuất: ${new Date().toLocaleDateString("vi-VN")}`,
              children: [
                new TextRun({
                  text: `Ngày xuất: ${new Date().toLocaleDateString("vi-VN")}`,
                  bold: true,
                }),
              ],
            }),
            new Paragraph({
              text: "",
            }),
            new Paragraph({
              text: "1. TỔNG QUAN",
              heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({
              text: "Đây là báo cáo worklog ngắn để test chức năng export Word file.",
            }),
            new Paragraph({
              text: "",
            }),
            new Paragraph({
              text: "2. CÔNG VIỆC ĐÃ HOÀN THÀNH",
              heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "• Task 1: ",
                  bold: true,
                }),
                new TextRun({
                  text: "Thiết kế giao diện dashboard",
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "• Task 2: ",
                  bold: true,
                }),
                new TextRun({
                  text: "Implement chức năng sync Jira",
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "• Task 3: ",
                  bold: true,
                }),
                new TextRun({
                  text: "Tạo API endpoint cho GitHub sync",
                }),
              ],
            }),
            new Paragraph({
              text: "",
            }),
            new Paragraph({
              text: "3. GHI CHÚ",
              heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({
              text: "File này được tạo tự động bởi hệ thống. Đây là phiên bản test ngắn gọn.",
            }),
            new Paragraph({
              text: "",
            }),
            new Paragraph({
              text: "--- Hết báo cáo ---",
              alignment: AlignmentType.CENTER,
            }),
          ],
        },
      ],
    });

    // Xuất ra Buffer
    const buffer = await Packer.toBuffer(doc);
    return buffer;
  },
};
