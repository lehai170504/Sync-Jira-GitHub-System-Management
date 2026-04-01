// --- CÁC TYPE CŨ GIỮ NGUYÊN ---
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

// --- SỬA LẠI PAYLOAD Ở ĐÂY ---
// Payload bây giờ chỉ chứa 4 trường khớp y hệt hình API Backend đưa
export interface GradingConfigPayload {
  jiraWeight: number;
  gitWeight: number;
  reviewWeight: number;
  allowOverCeiling: boolean;
}

export interface StudentRawData {
  studentId: string;
  studentName?: string;
  storyPointsDone: number;
  validCommits: number;
  receivedStars: number;
}

export interface GroupGradingContext {
  groupGrade: number;
  groupSize: number;
  totalGroupStoryPoints: number;
  totalGroupCommits: number;
  totalGroupStars: number;
  config: ContributionConfig;
}

export interface StudentFinalGrade {
  studentId: string;
  studentName?: string;
  percentJira: number;
  percentGit: number;
  percentReview: number;
  baseContribution: number;
  normalizedFactor: number;
  finalGrade: number;
}

export interface GradingConfigResponse {
  message?: string;
  data?: {
    gradeStructure: GradeColumn[];
    contributionConfig: ContributionConfig;
  };
}
