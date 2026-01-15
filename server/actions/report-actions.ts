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
  // Giả lập delay cho report Word
  await new Promise((r) => setTimeout(r, 2000));
  return { success: false, error: "Tính năng xuất SRS Word đang bảo trì." };
}
