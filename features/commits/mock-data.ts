import type { CommitItem, CommitDetail, CommitValidation } from "./types";

export const mockCommits: CommitItem[] = [
  {
    id: "cmt-201",
    message: "Implement payment webhook handler",
    author: "Nguyễn Văn An",
    branch: "feature/payment-webhook",
    date: "2026-01-20",
  },
  {
    id: "cmt-202",
    message: "Refactor Auth middleware & fix bug token refresh",
    author: "Trần Thị Bình",
    branch: "feature/auth-refactor",
    date: "2026-01-19",
  },
  {
    id: "cmt-203",
    message: "Add unit test for CartService",
    author: "Lê Hoàng Cường",
    branch: "test/cart-service",
    date: "2026-01-18",
  },
  {
    id: "cmt-204",
    message: "Update README hướng dẫn deploy",
    author: "Phạm Minh Dung",
    branch: "chore/docs-deploy",
    date: "2026-01-17",
  },
  {
    id: "cmt-205",
    message: "Optimize DB indexes for orders",
    author: "Nguyễn Văn An",
    branch: "perf/db-index",
    date: "2026-01-15",
  },
];

export const mockCommitDetails: Record<CommitItem["id"], CommitDetail> = {
  "cmt-201": {
    files: [
      { path: "server/webhooks/payment.ts", additions: 120, deletions: 12 },
      { path: "app/(protected)/leader/sync/page.tsx", additions: 34, deletions: 5 },
    ],
    totalAdd: 154,
    totalDel: 17,
  },
  "cmt-202": {
    files: [
      { path: "middleware/auth.ts", additions: 58, deletions: 41 },
      { path: "server/actions/auth-actions.ts", additions: 22, deletions: 9 },
    ],
    totalAdd: 80,
    totalDel: 50,
  },
  "cmt-203": {
    files: [
      { path: "server/services/cart.service.test.ts", additions: 96, deletions: 0 },
      { path: "server/services/cart.service.ts", additions: 12, deletions: 4 },
    ],
    totalAdd: 108,
    totalDel: 4,
  },
  "cmt-204": {
    files: [{ path: "README.md", additions: 22, deletions: 3 }],
    totalAdd: 22,
    totalDel: 3,
  },
  "cmt-205": {
    files: [
      { path: "server/db/migrations/2026_01_add_indexes.sql", additions: 18, deletions: 0 },
      { path: "server/repositories/order.repo.ts", additions: 7, deletions: 2 },
    ],
    totalAdd: 25,
    totalDel: 2,
  },
};

export const mockValidation: Record<CommitItem["id"], CommitValidation> = {
  "cmt-201": {
    status: "valid",
    label: "Hợp lệ",
    reason: "Commit message rõ ràng, branch theo convention, LOC hợp lý.",
  },
  "cmt-202": {
    status: "valid",
    label: "Hợp lệ",
    reason: "Sửa lỗi + refactor có mô tả đầy đủ.",
  },
  "cmt-203": {
    status: "valid",
    label: "Hợp lệ",
    reason: "Bổ sung unit test đúng scope sprint.",
  },
  "cmt-204": {
    status: "rejected",
    label: "Bị loại",
    reason: "Chỉ cập nhật tài liệu (Docs) — không tính điểm contribution.",
  },
  "cmt-205": {
    status: "rejected",
    label: "Bị loại",
    reason: "Commit ngoài phạm vi sprint hiện tại (Perf/DB) — cần xác nhận.",
  },
};

