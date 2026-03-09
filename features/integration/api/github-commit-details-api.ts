import { axiosClient } from "@/lib/axios-client";

// Kiểu dữ liệu dùng nội bộ UI
export interface CommitDetailFile {
  /** Đường dẫn file hiển thị trên UI */
  path: string;
  /** Trạng thái file: added/modified/deleted/... (nếu BE có trả) */
  status?: string;
  additions?: number;
  deletions?: number;
  /** Chuỗi patch unified diff từ GitHub */
  patch?: string;
}

export interface CommitDetailsResponse {
  files: CommitDetailFile[];
}

// Kiểu đúng với response thực tế từ API BE
interface CommitDetailsApiResponse {
  message: string;
  files: {
    filename: string;
    status?: string;
    additions?: number;
    deletions?: number;
    patch?: string;
  }[];
}

/**
 * POST /api/integrations/github/commits/:sha/details
 * Xem chi tiết Commit GitHub (lấy Patch/Diff code)
 * @param sha - Commit SHA (full hash)
 * @param repoUrl - URL repository GitHub
 */
export const getCommitDetailsApi = async (
  sha: string,
  repoUrl: string,
): Promise<CommitDetailsResponse> => {
  const { data } = await axiosClient.post<CommitDetailsApiResponse>(
    `/integrations/github/commits/${encodeURIComponent(sha)}/details`,
    { repoUrl },
  );

  return {
    files: (data.files || []).map((f) => ({
      path: f.filename,
      status: f.status,
      additions: f.additions,
      deletions: f.deletions,
      patch: f.patch,
    })),
  };
};
