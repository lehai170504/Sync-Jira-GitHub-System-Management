// --- PHẦN CŨ GIỮ NGUYÊN ---
export interface GradeColumn {
  name: string;
  weight: number;
  isGroupGrade: boolean;
  _id?: string;
}

export interface ContributionConfig {
  jiraWeight: number;
  gitWeight: number;
  reviewWeight: number;
  allowOverCeiling: boolean;
}

export interface GradingConfigPayload {
  gradeStructure: GradeColumn[];
  contributionConfig: ContributionConfig;
}

// --- THÊM PHẦN MỚI NÀY VÀO ---

// Dữ liệu thô của 1 sinh viên thu thập được từ Jira, Git, và Form Review
export interface StudentRawData {
  studentId: string;
  studentName?: string;
  storyPointsDone: number; // Task đã Done
  validCommits: number; // Commit hợp lệ
  receivedStars: number; // Số sao nhận được từ review
}

// Tham số đầu vào cần thiết cho hệ thống (Bước 1 của bạn)
export interface GroupGradingContext {
  groupGrade: number; // Điểm nhóm (Hệ 10)
  groupSize: number; // Sĩ số nhóm
  totalGroupStoryPoints: number; // Tổng Story Points Done của cả nhóm
  totalGroupCommits: number; // Tổng Commit hợp lệ của cả nhóm
  totalGroupStars: number; // Tổng sao review cả nhóm nhận được
  config: ContributionConfig; // Trọng số cấu hình (Jira, Git, Review, Trần điểm)
}

// Kết quả tính toán cuối cùng trả về cho 1 sinh viên
export interface StudentFinalGrade {
  studentId: string;
  studentName?: string;
  percentJira: number; // %Jira
  percentGit: number; // %Git
  percentReview: number; // %Review
  baseContribution: number; // Cổ phần đóng góp
  normalizedFactor: number; // Hệ số chuẩn hóa
  finalGrade: number; // Điểm cá nhân cuối cùng
}
