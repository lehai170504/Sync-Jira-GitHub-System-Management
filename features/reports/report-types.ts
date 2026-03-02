export type ReportType = "PDF" | "Excel";
export type ReportStatus = "Ready" | "Processing" | "Archived" | "Failed";

export interface ReportItem {
  id: string;
  name: string;
  type: ReportType;
  date: string;
  size: string;
  author: string; // Người tạo
  status: ReportStatus;
}
