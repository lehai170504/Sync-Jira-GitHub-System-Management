import { axiosClient } from "@/lib/axios-client";
import type { ContributionConfig } from "@/features/management/classes/types/class-details-types";

export type UpdateContributionConfigPayload = ContributionConfig;

export interface UpdateContributionConfigResponse {
  message?: string;
  contributionConfig?: ContributionConfig;
}

/**
 * PUT /academic/classes/:classId/contribution-config
 * Lecturer set contribution weights for class.
 */
export async function updateClassContributionConfigApi(
  classId: string,
  payload: UpdateContributionConfigPayload,
): Promise<UpdateContributionConfigResponse> {
  const { data } = await axiosClient.put<UpdateContributionConfigResponse>(
    `/academic/classes/${classId}/contribution-config`,
    payload,
  );
  return data;
}

