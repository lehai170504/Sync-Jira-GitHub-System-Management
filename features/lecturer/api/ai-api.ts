import { axiosClient } from "@/lib/axios-client";

// 1. API Chat cho Giảng viên (Tự gom context của cả Lớp)
export const sendClassChatApi = async (classId: string, message: string) => {
  const { data } = await axiosClient.post("/ai/project-chat", {
    classId,
    message,
  });
  // Giả định BE trả về object: { reply: "Nội dung markdown..." }
  return data;
};

// 2. API Xuất Báo cáo SRS (Nhận cục Blob file .md)
export const exportProjectSrsApi = async (projectId: string) => {
  const response = await axiosClient.get(
    `/ai/project/${projectId}/export-srs`,
    {
      responseType: "blob", // SỐNG CÒN: Phải ép kiểu blob để tải file
    }
  );
  return response.data;
};
