// Cấu trúc một cột điểm (Assignment, Lab, Project...)
export interface GradeColumn {
  name: string;
  weight: number; // 0.1, 0.2 ... tổng phải = 1.0
  isGroupGrade: boolean;
  _id?: string;
}

// Cấu hình điểm đóng góp (Contribution)
export interface ContributionConfig {
  jiraWeight: number; // Tổng 3 cái này phải = 1.0
  gitWeight: number;
  reviewWeight: number;
  allowOverCeiling: boolean; // Cho phép điểm > 10 hay không
}

// Payload gửi lên (Body)
export interface GradingConfigPayload {
  gradeStructure: GradeColumn[];
  contributionConfig: ContributionConfig;
}

// Response trả về
export interface GradingConfigResponse {
  message: string;
  data: {
    gradeStructure: GradeColumn[];
    contributionConfig: ContributionConfig;
  };
}
