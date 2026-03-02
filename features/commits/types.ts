export type CommitItem = {
  id: string;
  message: string;
  author: string;
  branch: string;
  date: string; // ISO date
  is_counted?: boolean;
  rejection_reason?: string | null;
};

export type CommitFile = {
  path: string;
  additions: number;
  deletions: number;
};

export type CommitValidationStatus = "valid" | "rejected";

export type CommitValidation = {
  status: CommitValidationStatus;
  label: string;
  reason?: string;
};

export type CommitDetail = {
  files: CommitFile[];
  totalAdd: number;
  totalDel: number;
};

