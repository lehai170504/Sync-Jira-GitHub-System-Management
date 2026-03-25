import { axiosClient } from "@/lib/axios-client";

// Đổi tên hàm và truyền projectId
export const syncProjectDataApi = async (projectId: string) => {
  const { data } = await axiosClient.post(
    `/integrations/projects/${projectId}/sync`
  );
  return data;
};
