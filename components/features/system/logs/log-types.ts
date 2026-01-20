export type LogStatus = "Success" | "Warning" | "Error" | "Info";

export interface LogEntry {
  id: number;
  action: string;
  status: LogStatus;
  detail: string;
  timestamp: string;
  date: string; // Format: YYYY-MM-DD
  user: string;
  ip: string;
}
