// --- 1. TYPES ---
export interface ReviewerDetail {
  _id: string;
  full_name: string;
  student_code: string;
  avatar_url?: string;
}

export interface ReviewComment {
  _id: string;
  reviewer: ReviewerDetail; // Người đánh giá
  rating: number;
  comment: string;
  created_at: string;
}

export interface StudentReviewSummary {
  student: ReviewerDetail; // Sinh viên được nhận đánh giá
  averageRating: number; // Điểm trung bình
  totalReviews: number; // Tổng số lượt đánh giá
  reviews: ReviewComment[]; // Chi tiết các nhận xét
}

// 👇 CẬP NHẬT THEO BACKEND: Trả về một Object bao bọc
export interface TeamReviewsResponse {
  team_id: string;
  message: string;
  total_reviews: number;
  evaluation_summary: StudentReviewSummary[]; // Mảng dữ liệu thực sự nằm ở đây
}
