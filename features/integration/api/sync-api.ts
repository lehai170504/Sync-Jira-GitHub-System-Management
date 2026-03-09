import { axiosClient } from "@/lib/axios-client";
import { SyncResponse } from "../types";

export interface SyncProjectPayload {
  branch?: string;
}

export const syncProjectApi = async (
  projectId: string,
  payload?: SyncProjectPayload,
): Promise<SyncResponse> => {
  const { data } = await axiosClient.post<SyncResponse>(
    `/integrations/projects/${projectId}/sync`,
    payload ?? {},
  );
  return data;
};

