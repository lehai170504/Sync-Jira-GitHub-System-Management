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

// 1. Chi tiết thông tin sinh viên (Assignee hoặc Evaluator)
export interface StudentCompact {
  _id: string;
  student_code: string;
  email: string;
  full_name: string;
  avatar_url: string;
}

// 2. Chi tiết từng lời nhận xét (Feedback)
export interface FeedbackItem {
  evaluator: StudentCompact; // Người thực hiện đánh giá
  rating: number; // Điểm (1-5)
  comment: string; // Lời nhắn
  submitted_at: string; // ISO Date
}

// 3. Tổng hợp đánh giá của MỘT sinh viên
export interface StudentReviewSummary {
  student: StudentCompact; // Sinh viên nhận đánh giá
  review_count: number; // SỬA: Khớp với review_count của BE
  average_rating: number; // SỬA: Khớp với average_rating của BE
  feedbacks_received: FeedbackItem[]; // SỬA: Khớp với feedbacks_received của BE
}

// 4. Response tổng từ API
export interface TeamReviewsResponse {
  team_id: string;
  total_reviews_submitted: number; // SỬA: Khớp với total_reviews_submitted
  evaluation_summary: StudentReviewSummary[];
}
