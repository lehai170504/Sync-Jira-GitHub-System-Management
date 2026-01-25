import { axiosClient } from "@/lib/axios-client";
import { SemesterDetailResponse } from "../types";

// 1. Interface dữ liệu trả về từ GET
export interface Semester {
  _id: string;
  name: string; // "Spring 2026"
  code: string; // "SP2026"
  start_date: string;
  end_date: string;
  status: "OPEN" | "CLOSED" | "UPCOMING"; // Giả định status
}

interface GetSemestersResponse {
  total: number;
  semesters: Semester[];
}

// 2. Interface Payload gửi lên POST
export interface CreateSemesterPayload {
  name: string;
  code: string;
  start_date: string;
  end_date: string;
}

// --- API FUNCTIONS ---

// Lấy danh sách học kỳ
export const getSemestersApi = async (): Promise<Semester[]> => {
  const { data } = await axiosClient.get<GetSemestersResponse>(
    "/management/semesters",
  );
  return data.semesters;
};

// Tạo học kỳ mới
export const createSemesterApi = async (payload: CreateSemesterPayload) => {
  const { data } = await axiosClient.post("/management/semesters", payload);
  return data;
};

export const getSemesterDetailsApi = async (id: string): Promise<SemesterDetailResponse> => {
  const { data } = await axiosClient.get(`/management/semesters/${id}`);
  return data;
};
