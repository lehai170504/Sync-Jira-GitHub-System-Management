import { axiosClient } from "@/lib/axios-client";
import { SyncResponse } from "../types";

export const syncProjectApi = async (
  projectId: string,
): Promise<SyncResponse> => {
  const { data } = await axiosClient.post<SyncResponse>(
    `/integrations/projects/${projectId}/sync`,
  );
  return data;
};

