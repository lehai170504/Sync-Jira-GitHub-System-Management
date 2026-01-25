import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTeamMembersApi, updateMemberMappingApi } from "../api/member-api";
import {
  UpdateMappingPayload,
  UpdateMappingResponse,
} from "../types/member-types";
import { toast } from "sonner";

// Hook lấy danh sách thành viên
export const useTeamMembers = (teamId: string | undefined) => {
  return useQuery({
    queryKey: ["team-members", teamId],
    queryFn: () => getTeamMembersApi(teamId!),
    enabled: !!teamId,
  });
};

// Hook cập nhật mapping
export const useUpdateMapping = (teamId: string) => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateMappingResponse,
    Error,
    { memberId: string; data: UpdateMappingPayload }
  >({
    mutationFn: ({ memberId, data }) => updateMemberMappingApi(memberId, data),
    onSuccess: (data) => {
      // data ở đây chính là UpdateMappingResponse
      toast.success(data.message || "Cập nhật thành công!");
      queryClient.invalidateQueries({ queryKey: ["team-members", teamId] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Lỗi khi cập nhật mapping");
    },
  });
};
