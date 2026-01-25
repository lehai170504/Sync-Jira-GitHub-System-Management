// Định nghĩa Payload gửi lên khi tạo bài tập
export interface CreateAssignmentPayload {
  classId: string;
  title: string;
  description: string;
  type: "ASSIGNMENT" | "LAB" | "QUIZ" | "PROJECT"; // Dựa trên convention của bạn
  deadline: string; // ISO String (2026-01-25T07:02:30.520Z)
  resources: string[]; // Link tài liệu đính kèm
}

// Định nghĩa Response trả về từ API
export interface Assignment {
  _id: string;
  class_id: string;
  title: string;
  description: string;
  type: string;
  deadline: string;
  resources: string[];
  created_at: string;
  updated_at: string;
  submittedCount?: number;
  totalStudent?: number;
  status?: "Open" | "Closed" | "Graded";
}
