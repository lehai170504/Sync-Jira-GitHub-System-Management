import { axiosClient } from "@/lib/axios-client";

export const getAdminOverviewApi = async () => {
  const { data } = await axiosClient.get("/dashboard/admin/overview");
  return data;
};
