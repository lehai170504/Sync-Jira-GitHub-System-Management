import {
  GroupGradingContext,
  StudentFinalGrade,
  StudentRawData,
} from "../../types/grading-types";

/**
 * Hàm tính điểm cá nhân cho 1 sinh viên dựa trên công thức cấu hình
 */
export const calculateIndividualGrade = (
  student: StudentRawData,
  context: GroupGradingContext
): StudentFinalGrade => {
  const {
    groupGrade,
    groupSize,
    totalGroupStoryPoints,
    totalGroupCommits,
    totalGroupStars,
    config,
  } = context;

  // -------------------------------------------------------------------
  // BƯỚC 1: Tính Tỷ lệ hoàn thành Task trên Jira (%Jira)
  // -------------------------------------------------------------------
  // Đề phòng lỗi chia cho 0 nếu cả nhóm chưa có ai Done task nào
  const percentJira =
    totalGroupStoryPoints > 0
      ? student.storyPointsDone / totalGroupStoryPoints
      : 0;

  // -------------------------------------------------------------------
  // BƯỚC 2: Tính Tỷ lệ đóng góp Code trên GitHub (%Git)
  // -------------------------------------------------------------------
  const percentGit =
    totalGroupCommits > 0 ? student.validCommits / totalGroupCommits : 0;

  // -------------------------------------------------------------------
  // BƯỚC 3: Tính Tỷ lệ Đánh giá chéo (%Review)
  // -------------------------------------------------------------------
  const percentReview =
    totalGroupStars > 0 ? student.receivedStars / totalGroupStars : 0;

  // -------------------------------------------------------------------
  // BƯỚC 4: Tính Hệ số Đóng góp và Điểm Cuối cùng
  // -------------------------------------------------------------------

  // 1. Tính Cổ phần Đóng góp (Base Contribution)
  const baseContribution =
    config.jiraWeight * percentJira +
    config.gitWeight * percentGit +
    config.reviewWeight * percentReview;

  // 2. Chuẩn hóa Hệ số (Normalization)
  let normalizedFactor = baseContribution * groupSize;

  // 3. Kiểm soát Trần điểm (Ceiling)
  if (!config.allowOverCeiling && normalizedFactor > 1.0) {
    normalizedFactor = 1.0;
  }

  // 4. Chốt điểm cá nhân (Điểm_Nhóm x Hệ_số_Chuẩn_hóa)
  const rawFinalGrade = groupGrade * normalizedFactor;

  // Làm tròn đến 2 chữ số thập phân (VD: 8.567 => 8.57)
  const finalGrade = Math.round(rawFinalGrade * 100) / 100;

  return {
    studentId: student.studentId,
    studentName: student.studentName,
    percentJira,
    percentGit,
    percentReview,
    baseContribution,
    normalizedFactor,
    finalGrade,
  };
};

/**
 * Hàm tiện ích: Tính điểm cho TOÀN BỘ NHÓM cùng lúc
 */
export const calculateGroupGrades = (
  students: StudentRawData[],
  groupGrade: number,
  config: GroupGradingContext["config"]
): StudentFinalGrade[] => {
  // Tính tổng các chỉ số của toàn đội
  const totalGroupStoryPoints = students.reduce(
    (sum, s) => sum + s.storyPointsDone,
    0
  );
  const totalGroupCommits = students.reduce(
    (sum, s) => sum + s.validCommits,
    0
  );
  const totalGroupStars = students.reduce((sum, s) => sum + s.receivedStars, 0);

  // Tạo Context
  const context: GroupGradingContext = {
    groupGrade,
    groupSize: students.length,
    totalGroupStoryPoints,
    totalGroupCommits,
    totalGroupStars,
    config,
  };

  // Tính điểm cho từng người
  return students.map((student) => calculateIndividualGrade(student, context));
};
