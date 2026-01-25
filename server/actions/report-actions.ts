"use server";

import { ReportService } from "@/server/services/report.service";

export async function exportScoreReport() {
  try {
    // 1. Gọi Service tạo file
    const buffer = await ReportService.generateScoreBoard();

    // 2. Chuyển Buffer thành Base64 để gửi về Client
    const base64 = Buffer.from(buffer).toString("base64");

    return {
      success: true,
      data: base64,
      filename: `Bang_Diem_Sprint_4_${
        new Date().toISOString().split("T")[0]
      }.xlsx`,
    };
  } catch (error) {
    console.error("Export Error:", error);
    return { success: false, error: "Lỗi khi tạo file báo cáo." };
  }
}

export async function exportSRSReport() {
  try {
    // 1. Gọi Service tạo file Word
    const buffer = await ReportService.generateWorklog();

    // 2. Chuyển Buffer thành Base64 để gửi về Client
    const base64 = Buffer.from(buffer).toString("base64");

    return {
      success: true,
      data: base64,
      filename: `Worklog_Report_${new Date().toISOString().split("T")[0]}.docx`,
    };
  } catch (error) {
    console.error("Export Worklog Error:", error);
    return { success: false, error: "Lỗi khi tạo file Worklog Word." };
  }
}
