import { axiosClient } from "@/lib/axios-client";
import {
  TeamMembersResponse,
  UpdateMappingPayload,
  UpdateMappingResponse,
} from "../types/member-types";

// 1. Lấy danh sách thành viên team
export const getTeamMembersApi = async (
  teamId: string,
): Promise<TeamMembersResponse> => {
  const { data } = await axiosClient.get(`/teams/${teamId}/members`);
  return data;
};

// 2. Cập nhật mapping (PUT)
export const updateMemberMappingApi = async (
  memberId: string,
  payload: UpdateMappingPayload,
): Promise<UpdateMappingResponse> => {
  // 👈 Trả về data chuẩn
  const { data } = await axiosClient.put(
    `/members/${memberId}/mapping`,
    payload,
  );
  return data;
};
